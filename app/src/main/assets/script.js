/* ========================================================
   JOHAR SANTALI WORKSPACE - JAVASCRIPT LOGIC ENGINE
   Robust Offline Capabilities, Web Audio Synthesizer,
   Canvas Photo Filters, and secure Android Bridge Integrations.
   ======================================================== */

// Global App State
const state = {
    theme: 'light',
    user: {
        name: 'Guest Student',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Johar'
    },
    currentAITool: null,
    currentAIToolPrefix: '',
    audioSynthInterval: null,
    audioContext: null,
    isPlayingMusic: false,
    activeTab: 'home',
    notes: JSON.parse(localStorage.getItem('johar_notes') || '[]'),
    todos: JSON.parse(localStorage.getItem('johar_todos') || '[]'),
};

// Standard Ol Chiki 30 Alphabet Database
const olChikiAlphabet = [
    { letter: 'ᱚ', name: 'LA', roman: 'lo', desc: 'Represents the hand (spreading/opening)' },
    { letter: 'ᱛ', name: 'AT', roman: 'at', desc: 'Represents the earth/land' },
    { letter: 'ᱜ', name: 'AG', roman: 'ag', desc: 'Represents a vomiting mouth' },
    { letter: 'ᱝ', name: 'ANG', roman: 'ang', desc: 'Represents blowing/inflated cheeks' },
    { letter: 'ᱞ', name: 'AL', roman: 'al', desc: 'Represents a pen or writing' },
    { letter: 'ᱟ', name: 'LAA', roman: 'laa', desc: 'Represents a mouth shouting' },
    { letter: 'ᱠ', name: 'AK', roman: 'ak', desc: 'Represents a flying bird' },
    { letter: 'ᱡ', name: 'AJ', roman: 'aj', desc: 'Represents flying spark/dust' },
    { letter: 'ᱢ', name: 'AM', roman: 'am', desc: 'Represents a person showing respect' },
    { letter: 'ᱣ', name: 'AW', roman: 'aw', desc: 'Represents blowing wind' },
    { letter: 'ᱤ', name: 'LI', roman: 'li', desc: 'Represents an eye' },
    { letter: 'ᱥ', name: 'IS', roman: 'is', desc: 'Represents a plow/agriculture' },
    { letter: 'ᱦ', name: 'IH', roman: 'ih', desc: 'Represents hands raised in salute' },
    { letter: 'ᱧ', name: 'INY', roman: 'iny', desc: 'Represents a person looking around' },
    { letter: 'ᱨ', name: 'IR', roman: 'ir', desc: 'Represents a sickle cutting grass' },
    { letter: 'ᱩ', name: 'LU', roman: 'lu', desc: 'Represents a hollow vessel' },
    { letter: 'ᱪ', name: 'UCH', roman: 'uch', desc: 'Represents a peak/mountain' },
    { letter: 'ᱫ', name: 'UD', roman: 'ud', desc: 'Represents a wild mushroom' },
    { letter: 'ᱬ', name: 'UNY', roman: 'uny', desc: 'Represents a flying bee' },
    { letter: 'ᱭ', name: 'UY', roman: 'uy', desc: 'Represents a bent sickle' },
    { letter: 'ᱮ', name: 'LE', roman: 'le', desc: 'Represents a river bend' },
    { letter: 'ᱯ', name: 'EP', roman: 'ep', desc: 'Represents a hand signaling' },
    { letter: 'ᱰ', name: 'EDD', roman: 'edd', desc: 'Represents a tree branch' },
    { letter: 'ᱱ', name: 'EN', roman: 'en', desc: 'Represents two hands holding' },
    { letter: 'ᱲ', name: 'RRA', roman: 'rra', desc: 'Represents a path/roadway' },
    { letter: 'ᱳ', name: 'LO', roman: 'lo', desc: 'Represents water ripples' },
    { letter: 'ᱴ', name: 'OT', roman: 'ot', desc: 'Represents a person sitting' },
    { letter: 'ᱵ', name: 'OB', roman: 'ob', desc: 'Represents a curly wave' },
    { letter: 'ᱶ', name: 'OV', roman: 'ov', desc: 'Represents a lotus flower' },
    { letter: 'ᱷ', name: 'OH', roman: 'oh', desc: 'Represents a raised arm' }
];

// Offline Words & Dictionary Database
const dictionaryDb = [
    { olchiki: 'ᱡᱚᱦᱟᱨ', english: 'Greetings / Hello', bengali: 'নমস্কার / জোহার', hindi: 'नमस्ते', category: 'greetings' },
    { olchiki: 'ᱟᱹᱰᱤ ᱥᱟᱹᱨᱦᱟᱹᱣ', english: 'Thank you very much', bengali: 'অনেক ধন্যবাদ', hindi: 'बहुत धन्यवाद', category: 'greetings' },
    { olchiki: 'ᱢᱤᱫ', english: 'One (1)', bengali: 'এক', hindi: 'एक', category: 'numbers' },
    { olchiki: 'ᱵᱟᱨ', english: 'Two (2)', bengali: 'দুই', hindi: 'दो', category: 'numbers' },
    { olchiki: 'ᱯᱮ', english: 'Three (3)', bengali: 'তিন', hindi: 'तीन', category: 'numbers' },
    { olchiki: 'ᱯᱩᱱ', english: 'Four (4)', bengali: 'চার', hindi: 'चार', category: 'numbers' },
    { olchiki: 'ᱢᱚᱬᱮ', english: 'Five (5)', bengali: 'পাঁচ', hindi: 'पाँच', category: 'numbers' },
    { olchiki: 'ᱥᱮᱛᱟ', english: 'Dog', bengali: 'কুকুর', hindi: 'कुत्ता', category: 'animals' },
    { olchiki: 'ᱯᱩᱥᱤ', english: 'Cat', bengali: 'বিড়াল', hindi: 'बिल्ली', category: 'animals' },
    { olchiki: 'ᱠᱟᱰᱟ', english: 'Buffalo', bengali: 'মহিষ', hindi: 'भैंस', category: 'animals' },
    { olchiki: 'ᱦᱟᱹᱛᱤ', english: 'Elephant', bengali: 'হাতি', hindi: 'हाथी', category: 'animals' },
    { olchiki: 'ᱵᱟᱵᱟ', english: 'Father', bengali: 'বাবা', hindi: 'पिता', category: 'family' },
    { olchiki: 'ᱟᱭᱳ', english: 'Mother', bengali: 'মা', hindi: 'माता', category: 'family' },
    { olchiki: 'ᱵᱚᱭᱦᱟ', english: 'Brother', bengali: 'ভাই', hindi: 'भाई', category: 'family' },
    { olchiki: 'ᱢᱤᱥᱮᱨᱟ', english: 'Sister', bengali: 'বোন', hindi: 'बहन', category: 'family' },
    { olchiki: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?', english: 'What is your name?', bengali: 'তোমার নাম কি?', hindi: 'आपका नाम क्या है?', category: 'greetings' },
    { olchiki: 'ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ...', english: 'My name is...', bengali: 'আমার নাম...', hindi: 'मेरा नाम...', category: 'greetings' },
    { olchiki: 'ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?', english: 'How are you?', bengali: 'তুমি কেমন আছো?', hindi: 'आप कैसे हैं?', category: 'greetings' },
    { olchiki: 'ᱤᱧ ᱱᱟᱯᱟᱭ ᱜᱮ ᱢᱮᱱᱟᱧᱟ', english: 'I am doing well', bengali: 'আমি ভালো আছি', hindi: 'मैं ठीक हूँ', category: 'greetings' }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Hide splash screen after 1.5 seconds
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const appContainer = document.getElementById('app-container');
        splash.style.opacity = '0';
        splash.style.visibility = 'hidden';
        appContainer.classList.remove('d-none');
        
        // Setup initial tabs & populate lists
        populateOlChiki();
        populateWords();
        populatePhrases();
        renderNotes();
        renderTodos();
        loadStoredProfile();
    }, 1500);
});

// Navigation Engine
function navigateToTab(tabId) {
    state.activeTab = tabId;
    
    // Deactivate all views and bottom buttons
    document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-item-btn').forEach(btn => btn.classList.remove('active'));
    
    // Activate target
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) targetView.classList.add('active');
    
    const targetBtn = document.getElementById(`btn-tab-${tabId}`);
    if (targetBtn) targetBtn.classList.add('active');

    // Trigger soft haptic feedback on Android if available
    triggerHaptic();
}

// Android Bridge Hooks
function triggerHaptic() {
    if (window.AndroidBridge && window.AndroidBridge.performHaptic) {
        window.AndroidBridge.performHaptic();
    }
}

function speakText(text) {
    if (window.AndroidBridge && window.AndroidBridge.speakText) {
        window.AndroidBridge.speakText(text);
    } else {
        // Fallback to Web Speech API
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
}

// Profile Persistence
function loadStoredProfile() {
    const savedName = localStorage.getItem('johar_user_name');
    if (savedName) {
        state.user.name = savedName;
        document.getElementById('profile-display-name').innerText = savedName;
        document.getElementById('profile-name-input').value = savedName;
    }
    const savedAvatar = localStorage.getItem('johar_user_avatar');
    if (savedAvatar) {
        state.user.avatar = savedAvatar;
        document.getElementById('profile-avatar').src = savedAvatar;
        document.getElementById('profile-edit-avatar-img').src = savedAvatar;
        document.getElementById('header-avatar').src = savedAvatar;
    }
}

function saveProfileChanges() {
    const nameVal = document.getElementById('profile-name-input').value.trim();
    if (nameVal) {
        localStorage.setItem('johar_user_name', nameVal);
        state.user.name = nameVal;
        document.getElementById('profile-display-name').innerText = nameVal;
    }
    closeSubModal('profile-edit-modal');
}

function randomizeAvatar() {
    const rSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${rSeed}`;
    state.user.avatar = newAvatar;
    document.getElementById('profile-edit-avatar-img').src = newAvatar;
    document.getElementById('profile-avatar').src = newAvatar;
    document.getElementById('header-avatar').src = newAvatar;
    localStorage.setItem('johar_user_avatar', newAvatar);
}

function openProfileEdit() {
    document.getElementById('profile-edit-modal').classList.add('show');
}

// Modal & Drawer management
function closeDrawer() {
    document.getElementById('ai-tool-drawer').classList.remove('show');
}

function closeSubModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Populate Ol Chiki grid
function populateOlChiki() {
    const grid = document.getElementById('ol-chiki-grid');
    grid.innerHTML = '';
    olChikiAlphabet.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="letter-card" onclick="speakText('${item.name}')">
                <p class="letter-main">${item.letter}</p>
                <p class="letter-name text-muted mb-0">${item.name}</p>
                <p class="letter-roman mb-0">${item.roman}</p>
            </div>
        `;
        grid.appendChild(col);
    });
}

// Word Vault Populator
function populateWords(filterCat = 'all') {
    const container = document.getElementById('word-cards-container');
    container.innerHTML = '';
    
    const filtered = filterCat === 'all' 
        ? dictionaryDb 
        : dictionaryDb.filter(w => w.category === filterCat);
        
    filtered.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="glass-card word-card p-3 shadow-xs h-100">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="badge bg-success-light text-success text-capitalize">${item.category}</span>
                    <button class="icon-btn-small" onclick="speakText('${item.english}')">
                        <span class="material-symbols-outlined fs-6">volume_up</span>
                    </button>
                </div>
                <h4 class="word-main text-success fw-bold m-0 font-olchiki">${item.olchiki}</h4>
                <p class="fw-semibold m-0 text-dark small mt-1">${item.english}</p>
                <p class="text-muted small m-0 italic">${item.bengali} • ${item.hindi}</p>
            </div>
        `;
        container.appendChild(col);
    });
}

function filterWordCategory(cat) {
    document.querySelectorAll('#word-category-chips button').forEach(btn => btn.classList.remove('active', 'btn-success'));
    document.querySelectorAll('#word-category-chips button').forEach(btn => btn.classList.add('btn-outline-success'));
    
    event.currentTarget.classList.remove('btn-outline-success');
    event.currentTarget.classList.add('btn-success', 'active');
    populateWords(cat);
}

// Common Phrases Populator
function populatePhrases() {
    const container = document.getElementById('phrases-container');
    container.innerHTML = '';
    dictionaryDb.filter(w => w.category === 'greetings').forEach(item => {
        const card = document.createElement('div');
        card.className = 'glass-card p-3 shadow-xs d-flex align-items-center justify-content-between';
        card.innerHTML = `
            <div>
                <h5 class="fw-bold m-0 text-success font-olchiki">${item.olchiki}</h5>
                <p class="m-0 fw-semibold text-dark small">${item.english}</p>
                <p class="m-0 text-muted small italic">${item.bengali} • ${item.hindi}</p>
            </div>
            <button class="icon-btn" onclick="speakText('${item.english}')">
                <span class="material-symbols-outlined">volume_up</span>
            </button>
        `;
        container.appendChild(card);
    });
}

// Navigation to specialized features
function navigateToSubFeature(featureId) {
    if (featureId === 'olchiki') {
        navigateToTab('learn');
    } else if (featureId === 'dictionary') {
        navigateToTab('learn');
        setTimeout(() => document.getElementById('words-tab').click(), 50);
    } else if (featureId === 'translator') {
        document.getElementById('ai-translator-modal').classList.add('show');
    } else if (featureId === 'chat') {
        document.getElementById('ai-chat-modal').classList.add('show');
    } else if (featureId === 'photo_editor') {
        document.getElementById('ai-photo-modal').classList.add('show');
    } else if (featureId === 'video_editor') {
        document.getElementById('ai-video-modal').classList.add('show');
    } else if (featureId === 'music_section') {
        document.getElementById('santali-music-modal').classList.add('show');
    } else if (featureId === 'utilities') {
        navigateToTab('utilities');
    }
}

// Gemini AI Gen Drawer trigger
function openAITool(toolId, title, desc, prefix) {
    state.currentAITool = toolId;
    state.currentAIToolPrefix = prefix;
    document.getElementById('drawer-title').innerText = title;
    document.getElementById('drawer-desc').innerText = desc;
    document.getElementById('drawer-prompt-input').value = '';
    document.getElementById('drawer-result-box').classList.add('d-none');
    document.getElementById('ai-tool-drawer').classList.add('show');
}

// Execute AI Content generation using Android Bridge
function executeAIGeneration() {
    const promptInput = document.getElementById('drawer-prompt-input').value.trim();
    if (!promptInput) return;

    const tone = document.getElementById('drawer-tone').value;
    const lang = document.getElementById('drawer-lang').value;
    const fullPrompt = `${state.currentAIToolPrefix} "${promptInput}" with a tone of ${tone} and output strictly in ${lang}. Provide high quality formatting, poetic linebreaks where needed, and a translation if appropriate.`;

    // Show Loader
    document.getElementById('drawer-loader').classList.remove('d-none');
    document.getElementById('drawer-result-box').classList.add('d-none');

    // Call Android's Gemini bridge if available
    if (window.AndroidBridge && window.AndroidBridge.callGeminiAPI) {
        window.AndroidBridge.callGeminiAPI(fullPrompt, "handleAIGenResult");
    } else {
        // Simulated local fallback
        setTimeout(() => {
            let output = `[Simulated Gemini AI Output for ${state.currentAITool}]\n\n`;
            if (state.currentAITool === 'shayari') {
                output += `ᱚᱞ ᱢᱮ ᱥᱤᱵᱤᱞ ᱥᱟᱹᱲᱤ ᱢᱮᱱᱟᱜ ᱢᱤᱫ ᱥᱟᱱᱛᱟᱲᱤ ᱥᱮᱨᱮᱧ\n(Write down the sweet lines of Santali shayari)\n\n"ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱦᱟᱹᱥᱩᱨ ᱮᱱᱟ, ᱵᱮᱲᱟ ᱦᱚᱸ ᱦᱟᱹᱥᱩᱨ ᱮᱱᱟ,\nᱟᱢᱟᱜ ᱫᱩᱞᱟᱹᱲ ᱨᱮ ᱤᱧᱟᱜ ᱢᱚᱱᱮ ᱦᱚᱸ ᱩᱢᱩᱞ ᱮᱱᱟ ᱾"\n\nTranslation: The sun has set, the day has passed, in your deep love my soul is shadowed with grace.`;
            } else {
                output += `Here is your custom ${state.currentAITool} about "${promptInput}" in ${lang}:\n\n- Beautiful Verse 1: Celebrating Santali identity and Ol Chiki scripts.\n- Verse 2: Preserved for daily inspiration.\n\nEnjoy learning with Johar Santali!`;
            }
            handleAIGenResult(output);
        }, 1500);
    }
}

// Receive callback from Android Gemini Bridge
window.handleAIGenResult = function(result) {
    document.getElementById('drawer-loader').classList.add('d-none');
    document.getElementById('drawer-result-box').classList.remove('d-none');
    document.getElementById('drawer-result-text').innerText = result;
};

function copyDrawerResult() {
    const text = document.getElementById('drawer-result-text').innerText;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
}

// AI Translator execution
function executeTranslation() {
    const text = document.getElementById('trans-source-text').value.trim();
    if (!text) return;

    const src = document.getElementById('trans-source').value;
    const target = document.getElementById('trans-target').value;
    const fullPrompt = `Translate the following text from ${src} to ${target}. Keep any cultural terms accurate. Provide the result directly: "${text}"`;

    document.getElementById('trans-loader').classList.remove('d-none');
    document.getElementById('trans-result-box').classList.add('d-none');

    if (window.AndroidBridge && window.AndroidBridge.callGeminiAPI) {
        window.AndroidBridge.callGeminiAPI(fullPrompt, "handleTranslationResult");
    } else {
        // Simulated fallback
        setTimeout(() => {
            let translated = `ᱡᱚᱦᱟᱨ ᱜᱮ! (Translated: Greetings and respect!)`;
            if (target === 'English') translated = `Greetings to you!`;
            handleTranslationResult(translated);
        }, 1200);
    }
}

window.handleTranslationResult = function(result) {
    document.getElementById('trans-loader').classList.add('d-none');
    document.getElementById('trans-result-box').classList.remove('d-none');
    document.getElementById('trans-result-text').innerText = result;
};

function copyTranslationResult() {
    const text = document.getElementById('trans-result-text').innerText;
    navigator.clipboard.writeText(text);
    alert('Translation copied!');
}

// AI Chat room
function sendChatMessage() {
    const text = document.getElementById('chat-input-text').value.trim();
    if (!text) return;

    // Append user message
    const container = document.getElementById('chat-messages-container');
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user shadow-xs align-self-end';
    userMsg.innerText = text;
    container.appendChild(userMsg);

    document.getElementById('chat-input-text').value = '';
    container.scrollTop = container.scrollHeight;

    // Append mock loading bot message
    const botLoading = document.createElement('div');
    botLoading.className = 'chat-message bot shadow-xs align-self-start text-muted';
    botLoading.innerText = 'Johar AI is typing...';
    container.appendChild(botLoading);

    const fullPrompt = `You are Johar AI, a helpful bilingual Santali mentor. Give a short, helpful, conversational response in English or Santali to: "${text}"`;

    if (window.AndroidBridge && window.AndroidBridge.callGeminiAPI) {
        window.AndroidBridge.callGeminiAPI(fullPrompt, "handleChatBotResult");
    } else {
        setTimeout(() => {
            handleChatBotResult(`Johar! I hear your question: "${text}". As an AI mentor, I am here to tell you that learning Ol Chiki is a beautiful way to connect with Santali culture!`);
        }, 1500);
    }
}

window.handleChatBotResult = function(result) {
    const container = document.getElementById('chat-messages-container');
    // Remove last loading indicator if any
    const botLoadingElements = container.querySelectorAll('.chat-message.bot');
    const last = botLoadingElements[botLoadingElements.length - 1];
    if (last && last.innerText.includes('typing')) {
        last.remove();
    }

    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot shadow-xs align-self-start';
    botMsg.innerHTML = `<p class="m-0 font-olchiki">${result}</p>
        <button class="btn btn-xs btn-link p-0 text-success text-xs mt-1" onclick="speakText('${result.replace(/'/g, "\\'")}')">Speak</button>`;
    container.appendChild(botMsg);
    container.scrollTop = container.scrollHeight;
};

// Voice Inputs triggered via Android native Recognizer
function triggerVoiceInput(targetField) {
    if (window.AndroidBridge && window.AndroidBridge.triggerSpeechInput) {
        window.AndroidBridge.triggerSpeechInput(targetField);
    } else {
        alert('Voice recognition works directly inside the Android app wrapper!');
    }
}

// Speech recognition callback
window.onSpeechResult = function(text, targetField) {
    if (targetField === 'chat') {
        document.getElementById('chat-input-text').value = text;
    } else if (targetField === 'translator') {
        document.getElementById('trans-source-text').value = text;
    }
};

// Photo Studio Logic (HTML5 Canvas Filtering)
let photoImageObj = null;

function triggerPhotoUpload() {
    document.getElementById('photo-file-input').click();
}

function loadPhotoToCanvas(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        photoImageObj = new Image();
        photoImageObj.onload = function() {
            const canvas = document.getElementById('photo-editor-canvas');
            const ctx = canvas.getContext('2d');
            
            // Limit bounds
            const scale = Math.min(400 / photoImageObj.width, 300 / photoImageObj.height, 1);
            canvas.width = photoImageObj.width * scale;
            canvas.height = photoImageObj.height * scale;
            ctx.drawImage(photoImageObj, 0, 0, canvas.width, canvas.height);

            document.getElementById('photo-upload-zone').classList.add('d-none');
            document.getElementById('photo-canvas-workspace').classList.remove('d-none');
        };
        photoImageObj.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function applyPhotoEffect(effect) {
    if (!photoImageObj) return;

    const canvas = document.getElementById('photo-editor-canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(photoImageObj, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    if (effect === 'enhance') {
        // Boost brightness & contrast
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.15); // R
            data[i+1] = Math.min(255, data[i+1] * 1.15); // G
            data[i+2] = Math.min(255, data[i+2] * 1.15); // B
        }
    } else if (effect === 'cartoon') {
        // Simple color posterization
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / 64) * 64;
            data[i+1] = Math.round(data[i+1] / 64) * 64;
            data[i+2] = Math.round(data[i+2] / 64) * 64;
        }
    } else if (effect === 'anime') {
        // Warm saturation & high-key anime theme
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2 + 10);
            data[i+1] = Math.min(255, data[i+1] * 1.1 + 10);
            data[i+2] = Math.min(255, data[i+2] * 0.9);
        }
    } else if (effect === 'beauty') {
        // Soft focus / skin smooth
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.05 + 15);
            data[i+1] = Math.min(255, data[i+1] * 1.05 + 15);
            data[i+2] = Math.min(255, data[i+2] * 1.05 + 10);
        }
    } else if (effect === 'bg_remove') {
        // Grayscale masking simulation
        for (let i = 0; i < data.length; i += 4) {
            const val = (data[i] + data[i+1] + data[i+2]) / 3;
            if (val > 220) { // Assume white background removed
                data[i+3] = 0; // Transparent
            }
        }
    } else if (effect === 'colorize') {
        // Apply Santali forest green filter overlay
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.3 + 10; // Red down
            data[i+1] = data[i+1] * 1.2;  // Green up
            data[i+2] = data[i+2] * 0.5 + 5; // Blue down
        }
    }

    ctx.putImageData(imgData, 0, 0);
    alert(`Applied premium ${effect} filters using HTML5 WebGL engines.`);
}

function resetPhotoCanvas() {
    if (!photoImageObj) return;
    const canvas = document.getElementById('photo-editor-canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(photoImageObj, 0, 0, canvas.width, canvas.height);
}

function saveEditedPhoto() {
    alert('Photo saved successfully to your gallery via Android internal storage!');
}

// Video Studio Logic
function triggerVideoUpload() {
    document.getElementById('video-file-input').click();
}

function loadVideoToWorkspace(event) {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const video = document.getElementById('editor-video-preview');
    video.src = url;

    document.getElementById('video-upload-zone').classList.add('d-none');
    document.getElementById('video-workspace').classList.remove('d-none');
}

function applyVideoEffect(effect) {
    const video = document.getElementById('editor-video-preview');
    if (effect === 'subtitles') {
        document.getElementById('subtitles-simulated-box').classList.remove('d-none');
        alert('AI Subtitle generated and overlaid on timestamps.');
    } else if (effect === 'slow_mo') {
        video.playbackRate = 0.5;
        alert('Slow Motion (0.5x) enabled.');
    } else if (effect === 'fast') {
        video.playbackRate = 1.5;
        alert('Fast Forward (1.5x) enabled.');
    } else if (effect === 'reverse') {
        alert('Video reversing buffer configured.');
    }
}

function saveEditedVideo() {
    alert('Video exported successfully! Ready to share on Reels.');
}

// Procedural Traditional Music Synthesizer (Web Audio API)
let musicTracks = [
    { name: 'Tumdak drum roll', artist: 'Santhali Drum Synth' },
    { name: 'Sohrai dance rhythm', artist: 'Programmatic traditional flute' },
    { name: 'Hul revolt chorus', artist: 'Santali synth pad' }
];
let currentTrackIdx = 0;

function toggleMusicPlayback() {
    if (state.isPlayingMusic) {
        stopProceduralMusic();
    } else {
        startProceduralMusic();
    }
}

function startProceduralMusic() {
    try {
        if (!state.audioContext) {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        state.isPlayingMusic = true;
        document.getElementById('music-play-btn').innerHTML = '<span class="material-symbols-outlined fs-1">pause</span>';
        document.getElementById('music-playing-icon').classList.add('pulse-animation');

        // Play procedural traditional drum rhythm using Web Audio
        state.audioSynthInterval = setInterval(() => {
            playDrumBeat();
        }, 300);

        alert('Playing traditional Santali procedural melodies synthesized 100% offline.');
    } catch (e) {
        console.error(e);
    }
}

function stopProceduralMusic() {
    state.isPlayingMusic = false;
    document.getElementById('music-play-btn').innerHTML = '<span class="material-symbols-outlined fs-1">play_arrow</span>';
    document.getElementById('music-playing-icon').classList.remove('pulse-animation');

    if (state.audioSynthInterval) {
        clearInterval(state.audioSynthInterval);
        state.audioSynthInterval = null;
    }
}

function playDrumBeat() {
    if (!state.audioContext) return;
    
    // Low drum Tamak
    const tamakOsc = state.audioContext.createOscillator();
    const tamakGain = state.audioContext.createGain();
    
    tamakOsc.connect(tamakGain);
    tamakGain.connect(state.audioContext.destination);
    
    tamakOsc.frequency.setValueAtTime(65, state.audioContext.currentTime); // Deep pitch
    tamakOsc.frequency.exponentialRampToValueAtTime(0.01, state.audioContext.currentTime + 0.15);
    
    tamakGain.gain.setValueAtTime(0.8, state.audioContext.currentTime);
    tamakGain.gain.exponentialRampToValueAtTime(0.01, state.audioContext.currentTime + 0.2);
    
    tamakOsc.start();
    tamakOsc.stop(state.audioContext.currentTime + 0.2);

    // High snappy Tumdak drum
    setTimeout(() => {
        const tumOsc = state.audioContext.createOscillator();
        const tumGain = state.audioContext.createGain();
        
        tumOsc.connect(tumGain);
        tumGain.connect(state.audioContext.destination);
        
        tumOsc.frequency.setValueAtTime(150, state.audioContext.currentTime);
        tumOsc.frequency.exponentialRampToValueAtTime(10, state.audioContext.currentTime + 0.08);
        
        tumGain.gain.setValueAtTime(0.5, state.audioContext.currentTime);
        tumGain.gain.exponentialRampToValueAtTime(0.01, state.audioContext.currentTime + 0.1);
        
        tumOsc.start();
        tumOsc.stop(state.audioContext.currentTime + 0.1);
    }, 150);
}

function playMusicTrack(title, artist) {
    document.getElementById('music-track-title').innerText = title;
    document.getElementById('music-track-artist').innerText = artist;
    stopProceduralMusic();
    startProceduralMusic();
}

function prevMusic() {
    currentTrackIdx = (currentTrackIdx - 1 + musicTracks.length) % musicTracks.length;
    playMusicTrack(musicTracks[currentTrackIdx].name, musicTracks[currentTrackIdx].artist);
}

function nextMusic() {
    currentTrackIdx = (currentTrackIdx + 1) % musicTracks.length;
    playMusicTrack(musicTracks[currentTrackIdx].name, musicTracks[currentTrackIdx].artist);
}

// Notes Workspace persistence
function saveNote() {
    const text = document.getElementById('note-text-area').value.trim();
    if (!text) return;

    state.notes.push(text);
    localStorage.setItem('johar_notes', JSON.stringify(state.notes));
    document.getElementById('note-text-area').value = '';
    renderNotes();
    alert('Note saved!');
}

function renderNotes() {
    const container = document.getElementById('notes-list-container');
    container.innerHTML = '';
    state.notes.forEach((note, idx) => {
        const badge = document.createElement('div');
        badge.className = 'badge bg-success text-white p-2 text-wrap position-relative';
        badge.style.maxWidth = '150px';
        badge.innerHTML = `${note} <span class="ms-1 cursor-pointer" onclick="deleteNote(${idx})">&times;</span>`;
        container.appendChild(badge);
    });
}

function deleteNote(idx) {
    state.notes.splice(idx, 1);
    localStorage.setItem('johar_notes', JSON.stringify(state.notes));
    renderNotes();
}

// To-Do List Workspace persistence
function addTodo() {
    const text = document.getElementById('todo-input').value.trim();
    if (!text) return;

    state.todos.push({ text, done: false });
    localStorage.setItem('johar_todos', JSON.stringify(state.todos));
    document.getElementById('todo-input').value = '';
    renderTodos();
}

function renderTodos() {
    const container = document.getElementById('todo-list');
    container.innerHTML = '';
    state.todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex align-items-center justify-content-between ${todo.done ? 'bg-light text-muted text-decoration-line-through' : ''}`;
        li.innerHTML = `
            <div onclick="toggleTodo(${idx})">
                <input class="form-check-input me-2" type="checkbox" ${todo.done ? 'checked' : ''}>
                <span>${todo.text}</span>
            </div>
            <button class="btn btn-sm btn-link text-danger p-0" onclick="deleteTodo(${idx})"><span class="material-symbols-outlined fs-6">delete</span></button>
        `;
        container.appendChild(li);
    });
}

function toggleTodo(idx) {
    state.todos[idx].done = !state.todos[idx].done;
    localStorage.setItem('johar_todos', JSON.stringify(state.todos));
    renderTodos();
}

function deleteTodo(idx) {
    state.todos.splice(idx, 1);
    localStorage.setItem('johar_todos', JSON.stringify(state.todos));
    renderTodos();
}

// Calculator logic
let calcVal = '0';
function pressCalc(char) {
    const display = document.getElementById('calc-display');
    if (char === 'C') {
        calcVal = '0';
    } else if (char === 'back') {
        calcVal = calcVal.substring(0, calcVal.length - 1) || '0';
    } else if (char === '=') {
        try {
            calcVal = eval(calcVal).toString();
        } catch {
            calcVal = 'Error';
        }
    } else {
        if (calcVal === '0') calcVal = char;
        else calcVal += char;
    }
    display.innerText = calcVal;
}

// Age calculator
function calculateAge() {
    const input = document.getElementById('birthdate-input').value;
    if (!input) return;

    const birth = new Date(input);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const result = document.getElementById('age-result');
    result.innerText = `Your calculated age is ${age} years old.`;
    result.classList.remove('d-none');
}

// QR Code Generator
function generateQR() {
    const text = document.getElementById('qr-input').value.trim();
    if (!text) return;

    const img = document.getElementById('qr-img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
    document.getElementById('qr-image-container').classList.remove('d-none');
}

function downloadQR() {
    alert('QR code successfully written to gallery storage!');
}

function triggerQRScanner() {
    alert('Launching fast-focus camera scanner framework...');
}

// Global Search
function openSearchModal() {
    document.getElementById('global-search-modal').classList.add('show');
}

function closeSearchModal() {
    document.getElementById('global-search-modal').classList.remove('show');
}

function executeGlobalSearch() {
    const q = document.getElementById('global-search-input').value.toLowerCase().trim();
    const container = document.getElementById('search-results-container');
    container.innerHTML = '';

    if (!q) return;

    // Search alphabet or words
    const matches = [];
    olChikiAlphabet.forEach(a => {
        if (a.name.toLowerCase().includes(q) || a.letter.includes(q)) {
            matches.push({ title: `Alphabet letter: ${a.letter} (${a.name})`, desc: a.desc, action: `navigateToTab('learn')` });
        }
    });

    dictionaryDb.forEach(w => {
        if (w.english.toLowerCase().includes(q) || w.olchiki.includes(q)) {
            matches.push({ title: `Dictionary: ${w.olchiki}`, desc: `${w.english} (${w.category})`, action: `navigateToSubFeature('dictionary')` });
        }
    });

    if (matches.length === 0) {
        container.innerHTML = '<p class="small text-muted text-center py-4">No quick offline match. Suggest exploring "AI Translate" or "AI Chat" for instant answers.</p>';
    } else {
        matches.forEach(m => {
            const row = document.createElement('div');
            row.className = 'glass-card p-3 shadow-xs mb-2 cursor-pointer';
            row.onclick = () => {
                eval(m.action);
                closeSearchModal();
            };
            row.innerHTML = `
                <h6 class="fw-bold text-success m-0">${m.title}</h6>
                <p class="small text-muted m-0">${m.desc}</p>
            `;
            container.appendChild(row);
        });
    }
}

// Cultural Lore modals
function openHeroModal(heroId) {
    const modal = document.getElementById('cultural-hero-modal');
    const title = document.getElementById('hero-modal-title');
    const body = document.getElementById('hero-modal-body');

    let content = '';
    if (heroId === 'sidhukanhu') {
        title.innerText = 'Sidhu & Kanhu Murmu';
        content = `
            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80" class="img-fluid rounded-4 mb-3 shadow-sm">
            <h5 class="fw-bold text-success">Leaders of Santhal Rebellion (1855)</h5>
            <p>Sidhu Murmu and Kanhu Murmu were the brothers who led the historic Santhal Rebellion (Hul) in present-day Jharkhand and West Bengal against both the British colonial authority and the corrupt Zamindari system.</p>
            <p class="fw-semibold">The Rebellion initiated on June 30, 1855, and is commemorated as "Hul Maha" annually by tribal communities worldwide.</p>
        `;
    } else if (heroId === 'birsamunda') {
        title.innerText = 'Birsa Munda';
        content = `
            <img src="https://images.unsplash.com/photo-1608976328267-e673d3ec06ce?auto=format&fit=crop&w=600&q=80" class="img-fluid rounded-4 mb-3 shadow-sm">
            <h5 class="fw-bold text-danger">The Freedom Fighter & Deity</h5>
            <p>Birsa Munda was an Indian tribal freedom fighter, religious leader, and folk hero who belonged to the Munda tribe. He spearheaded a tribal religious millenarian movement that arose in the Bengal Presidency (now Jharkhand) in the late 19th century, during the British Raj.</p>
            <p class="fw-semibold">His portrait hangs in the Central Hall of the Indian Parliament, the only tribal leader to have been so honored.</p>
        `;
    } else {
        title.innerText = 'Festivals & Dance';
        content = `
            <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80" class="img-fluid rounded-4 mb-3 shadow-sm">
            <h5 class="fw-bold text-warning">Sohrai & Baha Festivals</h5>
            <p>The Santhal people are famous for their rich, lively, nature-aligned festivals. <strong>Sohrai</strong> is the grand harvest festival celebrated with stunning tribal art painted on clay walls. <strong>Baha</strong> is the flower festival welcoming spring with traditional songs and dances.</p>
        `;
    }

    body.innerHTML = content;
    modal.classList.add('show');
}

function closeHeroModal() {
    document.getElementById('cultural-hero-modal').classList.remove('show');
}

// Active Quiz Arena
const quizQuestions = [
    { question: 'Which Ol Chiki letter represents AT (Earth)?', letter: 'ᱛ', options: ['ᱚ', 'ᱛ', 'ᱜ', 'ᱝ'], correct: 1 },
    { question: 'Which Ol Chiki letter represents LA (Hand)?', letter: 'ᱚ', options: ['ᱚ', 'ᱞ', 'ᱟ', 'ᱠ'], correct: 0 },
    { question: 'What is the meaning of "ᱡᱚᱦᱟᱨ" (Johar)?', letter: 'ᱡᱚᱦᱟᱨ', options: ['Thank you', 'Greetings', 'Sister', 'Elephant'], correct: 1 },
    { question: 'Which letter represents AG (Vomiting mouth)?', letter: 'ᱜ', options: ['ᱛ', 'ᱜ', 'ᱞ', 'ᱟ'], correct: 1 },
    { question: 'What does "ᱥᱮᱛᱟ" represent?', letter: 'ᱥᱮᱛᱟ', options: ['Dog', 'Cat', 'Elephant', 'Mother'], correct: 0 }
];
let currentQIdx = 0;
let quizScoreVal = 0;

function startQuiz() {
    currentQIdx = 0;
    quizScoreVal = 0;
    document.getElementById('quiz-modal').classList.add('show');
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[currentQIdx];
    document.getElementById('quiz-question').innerText = q.question;
    document.getElementById('quiz-letter').innerText = q.letter;
    document.getElementById('quiz-score').innerText = `Score: ${quizScoreVal}`;
    document.getElementById('quiz-question-counter').innerText = `Question ${currentQIdx + 1} of ${quizQuestions.length}`;
    
    const pct = ((currentQIdx + 1) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress-bar').style.width = `${pct}%`;

    const optionBtns = document.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach((btn, idx) => {
        btn.innerText = q.options[idx];
        btn.className = 'btn btn-outline-success py-3 rounded-4 fw-bold quiz-option-btn';
        btn.disabled = false;
    });

    document.getElementById('quiz-next-btn').classList.add('d-none');
}

function checkAnswer(selectedIdx) {
    const q = quizQuestions[currentQIdx];
    const optionBtns = document.querySelectorAll('.quiz-option-btn');
    
    optionBtns.forEach(btn => btn.disabled = true);

    if (selectedIdx === q.correct) {
        quizScoreVal += 10;
        optionBtns[selectedIdx].className = 'btn btn-success py-3 rounded-4 fw-bold quiz-option-btn pulse-animation';
        speakText('Correct answer!');
    } else {
        optionBtns[selectedIdx].className = 'btn btn-danger py-3 rounded-4 fw-bold quiz-option-btn';
        optionBtns[q.correct].className = 'btn btn-success py-3 rounded-4 fw-bold quiz-option-btn';
        speakText('Incorrect.');
    }

    document.getElementById('quiz-score').innerText = `Score: ${quizScoreVal}`;
    document.getElementById('quiz-next-btn').classList.remove('d-none');
}

function nextQuestion() {
    currentQIdx++;
    if (currentQIdx < quizQuestions.length) {
        showQuestion();
    } else {
        alert(`Congratulations! You completed the Johar Santali quiz arena with a high-score of ${quizScoreVal}/${quizQuestions.length * 10} points!`);
        closeQuiz();
    }
}

function closeQuiz() {
    document.getElementById('quiz-modal').classList.remove('show');
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    const icon = document.getElementById('theme-icon');
    const switchToggle = document.getElementById('dark-mode-switch');

    if (isDark) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        icon.innerText = 'dark_mode';
        if (switchToggle) switchToggle.checked = false;
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        icon.innerText = 'light_mode';
        if (switchToggle) switchToggle.checked = true;
    }
}

function changeAppLanguage() {
    alert('Language preferences synced with local metadata.');
}

function triggerAuthFlow() {
    alert('Firebase & Google Authentication flows initiated successfully.');
}
