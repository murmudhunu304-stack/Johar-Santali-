package com.example

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.Vibrator
import android.speech.RecognizerIntent
import android.speech.tts.TextToSpeech
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale
import java.util.concurrent.TimeUnit

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {

    private lateinit var webView: WebView
    private var textToSpeech: TextToSpeech? = null
    private var pendingSpeechTarget: String? = null

    // Register Activity Result for Voice Recognition
    private val speechRecognizerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            val spokenText = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
            if (spokenText != null && pendingSpeechTarget != null) {
                // Post back speech result to WebView
                val escapedText = escapeJsString(spokenText)
                webView.post {
                    webView.evaluateJavascript("javascript:onSpeechResult('$escapedText', '$pendingSpeechTarget')", null)
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize Native Text to Speech
        textToSpeech = TextToSpeech(this, this)

        setContent {
            MyApplicationTheme {
                Scaffold(
                    modifier = Modifier
                        .fillMaxSize()
                        .imePadding() // Avoid keyboard overlap
                ) { innerPadding ->
                    WebViewScreen(
                        url = "file:///android_asset/index.html",
                        modifier = Modifier
                            .fillMaxSize()
                            .systemBarsPadding(), // Support full edge to edge with system bar offsets
                        onWebViewReady = { readyWebView ->
                            webView = readyWebView
                        }
                    )
                }
            }
        }
    }

    // Initialize Text to Speech Listener
    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            textToSpeech?.language = Locale.US
        }
    }

    // Clean up TTS
    override fun onDestroy() {
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        super.onDestroy()
    }

    @Composable
    fun WebViewScreen(url: String, modifier: Modifier = Modifier, onWebViewReady: (WebView) -> Unit) {
        AndroidView(
            factory = { context ->
                WebView(context).apply {
                    // Configure secure settings
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        databaseEnabled = true
                        allowFileAccess = true
                        allowContentAccess = true
                        mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                        cacheMode = WebSettings.LOAD_DEFAULT
                    }

                    // Setup clients
                    webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                        }
                    }
                    webChromeClient = WebChromeClient()

                    // Expose the Android Bridge to WebView
                    addJavascriptInterface(AndroidBridge(), "AndroidBridge")

                    loadUrl(url)
                    onWebViewReady(this)
                }
            },
            modifier = modifier
        )
    }

    // Inner class for Javascript Bridge interface
    inner class AndroidBridge {

        @JavascriptInterface
        fun speakText(text: String) {
            textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
        }

        @JavascriptInterface
        fun performHaptic() {
            val vibrator = getSystemService(VIBRATOR_SERVICE) as? Vibrator
            vibrator?.vibrate(50)
        }

        @JavascriptInterface
        fun triggerSpeechInput(targetField: String) {
            pendingSpeechTarget = targetField
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak now to input text...")
            }
            try {
                speechRecognizerLauncher.launch(intent)
            } catch (e: Exception) {
                webView.post {
                    Toast.makeText(this@MainActivity, "Voice recognition not supported on this device.", Toast.LENGTH_SHORT).show()
                }
            }
        }

        @JavascriptInterface
        fun callGeminiAPI(prompt: String, callbackName: String) {
            // Securely call the Gemini API on background thread
            CoroutineScope(Dispatchers.IO).launch {
                val apiKey = BuildConfig.GEMINI_API_KEY
                if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
                    postResultToWebView("Error: Please set your secure GEMINI_API_KEY in the Secrets panel in AI Studio.", callbackName)
                    return@launch
                }

                val client = OkHttpClient.Builder()
                    .connectTimeout(60, TimeUnit.SECONDS)
                    .readTimeout(60, TimeUnit.SECONDS)
                    .writeTimeout(60, TimeUnit.SECONDS)
                    .build()

                // Construct Request Payload
                val jsonRequest = JSONObject().apply {
                    put("contents", JSONArray().apply {
                        put(JSONObject().apply {
                            put("parts", JSONArray().apply {
                                put(JSONObject().apply {
                                    put("text", prompt)
                                })
                            })
                        })
                    })
                }

                val mediaType = "application/json; charset=utf-8".toMediaType()
                val body = jsonRequest.toString().toRequestBody(mediaType)

                val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey"

                val request = Request.Builder()
                    .url(url)
                    .post(body)
                    .build()

                try {
                    client.newCall(request).execute().use { response ->
                        if (response.isSuccessful) {
                            val bodyString = response.body?.string() ?: ""
                            val jsonResponse = JSONObject(bodyString)
                            val candidates = jsonResponse.optJSONArray("candidates")
                            if (candidates != null && candidates.length() > 0) {
                                val content = candidates.getJSONObject(0).getJSONObject("content")
                                val parts = content.getJSONArray("parts")
                                val textResult = parts.getJSONObject(0).getString("text")
                                postResultToWebView(textResult, callbackName)
                            } else {
                                postResultToWebView("Error: Empty response from model.", callbackName)
                            }
                        } else {
                            postResultToWebView("Error calling Gemini API: Code ${response.code}", callbackName)
                        }
                    }
                } catch (e: Exception) {
                    postResultToWebView("Error: ${e.message}", callbackName)
                }
            }
        }
    }

    private fun postResultToWebView(result: String, callbackName: String) {
        val escapedResult = escapeJsString(result)
        webView.post {
            webView.evaluateJavascript("javascript:$callbackName('$escapedResult')", null)
        }
    }

    // Helper method to safely escape string for injection into JavaScript
    private fun escapeJsString(input: String): String {
        return input.replace("\\", "\\\\")
            .replace("'", "\\'")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
    }
}
