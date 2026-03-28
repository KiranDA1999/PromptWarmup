const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const submitBtn = document.getElementById('submit-btn');
const inputArea = document.getElementById('user-input');
const voiceBtn = document.getElementById('voice-btn');
const imageBtn = document.getElementById('image-btn');
const loadingState = document.getElementById('loading-state');
const outputSection = document.getElementById('output-section');

// Very basic Caching mechanism
const responseCache = new Map();

// API Endpoint - supports Vite dev server and proxying
const API_URL = import.meta.env?.VITE_API_URL || '/api/process';

// Theme toggling functionality
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Voice Input Integration
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  
  recognition.onstart = () => {
    voiceBtn.style.color = '#ef4444';
    voiceBtn.style.animation = 'pulse 1s infinite';
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputArea.value += (inputArea.value ? ' ' : '') + transcript;
  };
  
  recognition.onerror = () => resetVoiceUI();
  recognition.onend = () => resetVoiceUI();
}

function resetVoiceUI() {
  voiceBtn.style.color = '';
  voiceBtn.style.animation = 'none';
}

voiceBtn.addEventListener('click', () => {
  if (recognition) {
    recognition.start();
  } else {
    alert('Voice input is not supported in this browser.');
  }
});

// Simulate Image Upload functionality
imageBtn.addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      inputArea.value = "[Image Data Uploaded: " + fileInput.files[0].name + "] Analyzing visual content for insights...";
    }
  };
  fileInput.click();
});

// Process Request to Backend
submitBtn.addEventListener('click', async () => {
  const text = inputArea.value.trim();
  if (!text) return;

  outputSection.classList.add('hidden');
  loadingState.classList.remove('hidden');
  submitBtn.disabled = true;

  if (responseCache.has(text)) {
    renderOutput(responseCache.get(text));
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Server processing failed');
    }

    const data = await response.json();
    responseCache.set(text, data);
    renderOutput(data);
  } catch (error) {
    console.error(error);
    alert('An error occurred during processing: ' + error.message);
  } finally {
    loadingState.classList.add('hidden');
    submitBtn.disabled = false;
  }
});

// Helper for rendering structured output cleanly
function renderOutput(data) {
  const { intent, entities, urgency, actions } = data;
  
  document.getElementById('out-intent').textContent = intent || 'Unknown Context';
  
  const urgencyEl = document.getElementById('out-urgency');
  const urgencyLower = (urgency || 'low').toLowerCase();
  urgencyEl.textContent = urgencyLower;
  urgencyEl.className = 'badge ' + urgencyLower;
  
  const safetyBanner = document.getElementById('safety-banner');
  if (urgencyLower === 'high') {
    safetyBanner.classList.remove('hidden');
  } else {
    safetyBanner.classList.add('hidden');
  }

  const entitiesList = document.getElementById('out-entities');
  entitiesList.innerHTML = '';
  if (Array.isArray(entities) && entities.length) {
    entities.forEach(entity => {
      const li = document.createElement('li');
      li.textContent = entity;
      entitiesList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'None extracted';
    entitiesList.appendChild(li);
  }

  const actionsList = document.getElementById('out-actions');
  actionsList.innerHTML = '';
  if (Array.isArray(actions) && actions.length) {
    actions.forEach(action => {
      const li = document.createElement('li');
      li.textContent = action;
      actionsList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No explicit actions detected.';
    actionsList.appendChild(li);
  }

  loadingState.classList.add('hidden');
  outputSection.classList.remove('hidden');
}
