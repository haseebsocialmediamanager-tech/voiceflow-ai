/**
 * VoiceFlow AI — Universal Widget
 * Inject on ANY website. Works on Facebook, Gmail, Twitter, anywhere.
 * Loaded via bookmarklet or <script> tag.
 */
(function () {
  if (document.getElementById('vf-widget-root')) {
    document.getElementById('vf-widget-root').remove();
    return;
  }

  const API = 'https://www.linkedwin.io/api/enhance';
  const LANGS = [
    { code: 'en-US', flag: '🇺🇸', name: 'English' },
    { code: 'ur-PK', flag: '🇵🇰', name: 'Urdu' },
    { code: 'ar-SA', flag: '🇸🇦', name: 'Arabic' },
    { code: 'hi-IN', flag: '🇮🇳', name: 'Hindi' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Spanish' },
    { code: 'fr-FR', flag: '🇫🇷', name: 'French' },
    { code: 'de-DE', flag: '🇩🇪', name: 'German' },
    { code: 'zh-CN', flag: '🇨🇳', name: 'Chinese' },
    { code: 'tr-TR', flag: '🇹🇷', name: 'Turkish' },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Portuguese' },
    { code: 'ru-RU', flag: '🇷🇺', name: 'Russian' },
    { code: 'ja-JP', flag: '🇯🇵', name: 'Japanese' },
    { code: 'ko-KR', flag: '🇰🇷', name: 'Korean' },
    { code: 'id-ID', flag: '🇮🇩', name: 'Indonesian' },
    { code: 'bn-BD', flag: '🇧🇩', name: 'Bengali' },
  ];

  let recognition = null;
  let isRecording = false;
  let accumulated = '';
  let currentLang = localStorage.getItem('vf_lang') || 'en-US';
  let lastTarget = null;
  let showLangPicker = false;
  let animFrame = null;

  // ── Styles ────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #vf-widget-root * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #vf-widget-root { position: fixed; bottom: 24px; right: 24px; z-index: 2147483647; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    #vf-btn { width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, box-shadow 0.3s; outline: none; -webkit-tap-highlight-color: transparent; }
    #vf-btn:active { transform: scale(0.92); }
    #vf-btn.idle { background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 4px 20px rgba(99,102,241,0.5); }
    #vf-btn.recording { background: linear-gradient(135deg, #ef4444, #f97316); box-shadow: 0 4px 30px rgba(239,68,68,0.6); animation: vf-pulse 1.5s ease-in-out infinite; }
    #vf-btn.enhancing { background: linear-gradient(135deg, #6366f1, #8b5cf6); opacity: 0.7; }
    @keyframes vf-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
    #vf-panel { background: rgba(14,14,22,0.97); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 12px; min-width: 260px; max-width: min(320px, calc(100vw - 48px)); backdrop-filter: blur(20px); box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
    #vf-panel .vf-text { color: rgba(255,255,255,0.8); font-size: 13px; line-height: 1.5; min-height: 48px; padding: 8px; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 8px; white-space: pre-wrap; word-break: break-word; }
    #vf-panel .vf-text.rtl { direction: rtl; text-align: right; }
    #vf-panel .vf-text.placeholder { color: rgba(255,255,255,0.25); font-style: italic; }
    #vf-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    #vf-actions button { flex: 1; padding: 7px 10px; border: none; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; -webkit-tap-highlight-color: transparent; }
    #vf-actions .vf-copy { background: #6366f1; color: #fff; }
    #vf-actions .vf-copy:active { opacity: 0.8; }
    #vf-actions .vf-fix { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
    #vf-actions .vf-fix:active { opacity: 0.7; }
    #vf-actions .vf-clear { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); }
    #vf-lang-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    #vf-lang-bar span { color: rgba(255,255,255,0.4); font-size: 11px; }
    #vf-lang-btn { background: rgba(255,255,255,0.06); border: none; border-radius: 6px; color: rgba(255,255,255,0.7); font-size: 11px; padding: 4px 8px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    #vf-lang-picker { position: absolute; bottom: 64px; right: 0; background: rgba(14,14,22,0.98); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 6px; max-height: 220px; overflow-y: auto; width: 180px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); backdrop-filter: blur(20px); }
    #vf-lang-picker button { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 8px; background: none; border: none; color: rgba(255,255,255,0.7); font-size: 12px; cursor: pointer; border-radius: 6px; text-align: left; }
    #vf-lang-picker button:hover, #vf-lang-picker button.active { background: rgba(99,102,241,0.2); color: #fff; }
    #vf-wave { display: flex; align-items: center; gap: 2px; height: 20px; margin-bottom: 8px; justify-content: center; }
    #vf-wave span { display: inline-block; width: 3px; background: linear-gradient(to top, #4f46e5, #a5b8fc); border-radius: 2px; transition: height 0.1s; }
    #vf-status { font-size: 11px; color: rgba(255,255,255,0.35); text-align: center; margin-bottom: 6px; }
    #vf-close { position: absolute; top: 8px; right: 8px; background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 16px; line-height: 1; padding: 2px 6px; }
    #vf-close:hover { color: #fff; }
  `;
  document.head.appendChild(style);

  // ── DOM ───────────────────────────────────────────────────
  const root = document.createElement('div');
  root.id = 'vf-widget-root';

  const panel = document.createElement('div');
  panel.id = 'vf-panel';
  panel.style.display = 'none';
  panel.style.position = 'relative';

  const closeBtn = document.createElement('button');
  closeBtn.id = 'vf-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => { panel.style.display = 'none'; };

  const langBar = document.createElement('div');
  langBar.id = 'vf-lang-bar';
  const langLabel = document.createElement('span');
  langLabel.textContent = 'Language';
  const langBtn = document.createElement('button');
  langBtn.id = 'vf-lang-btn';
  langBar.appendChild(langLabel);
  langBar.appendChild(langBtn);
  updateLangBtn();

  const langPicker = document.createElement('div');
  langPicker.id = 'vf-lang-picker';
  langPicker.style.display = 'none';
  langPicker.style.position = 'absolute';
  langPicker.style.bottom = '100%';
  langPicker.style.right = '0';
  langPicker.style.marginBottom = '4px';
  langPicker.style.zIndex = '9999';
  buildLangPicker();
  langBtn.onclick = () => {
    showLangPicker = !showLangPicker;
    langPicker.style.display = showLangPicker ? 'block' : 'none';
  };

  const wave = document.createElement('div');
  wave.id = 'vf-wave';
  wave.style.display = 'none';
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('span');
    b.style.height = '4px';
    wave.appendChild(b);
  }

  const status = document.createElement('div');
  status.id = 'vf-status';
  status.textContent = 'Click mic or press SS anywhere';

  const textBox = document.createElement('div');
  textBox.className = 'vf-text placeholder';
  textBox.textContent = 'Your text appears here...';

  const actions = document.createElement('div');
  actions.id = 'vf-actions';
  actions.style.display = 'none';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'vf-copy';
  copyBtn.textContent = '📋 Copy & Paste';
  copyBtn.onclick = copyAndPaste;

  const fixBtn = document.createElement('button');
  fixBtn.className = 'vf-fix';
  fixBtn.textContent = '✨ Enhance';
  fixBtn.onclick = enhanceText;

  const clearBtn = document.createElement('button');
  clearBtn.className = 'vf-clear';
  clearBtn.textContent = 'Clear';
  clearBtn.onclick = clearText;

  actions.append(copyBtn, fixBtn, clearBtn);
  panel.append(closeBtn, langPicker, langBar, wave, status, textBox, actions);

  const btn = document.createElement('button');
  btn.id = 'vf-btn';
  btn.className = 'idle';
  btn.title = 'VoiceFlow AI — Click or press SS';
  btn.innerHTML = micIcon();
  btn.onclick = toggleRecording;

  root.append(panel, btn);
  document.body.appendChild(root);

  // ── Track last focused input ──────────────────────────────
  document.addEventListener('focusin', (e) => {
    const el = e.target;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
      lastTarget = el;
    }
  }, true);

  // ── SS shortcut ───────────────────────────────────────────
  let lastS = 0;
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.key.toLowerCase() === 's') {
      const now = Date.now();
      if (now - lastS < 400) { toggleRecording(); lastS = 0; }
      else lastS = now;
    }
  });

  // ── Recording ─────────────────────────────────────────────
  function toggleRecording() {
    panel.style.display = 'block';
    if (isRecording) stopRecording();
    else startRecording();
  }

  function startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showStatus('❌ Use Chrome for voice recording'); return; }

    if (recognition) { try { recognition.abort(); } catch {} }

    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLang;
    accumulated = '';

    recognition.onstart = () => {
      isRecording = true;
      btn.className = 'recording';
      btn.innerHTML = stopIcon();
      wave.style.display = 'flex';
      showStatus('🔴 Listening... click to stop');
      animateWave();
    };

    recognition.onresult = (e) => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      if (final) accumulated += final + ' ';
      const full = (accumulated + interim).trim();
      showText(full);
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') showStatus('Error: ' + e.error);
    };

    recognition.onend = () => {
      if (isRecording) { try { recognition.start(); } catch {} }
    };

    recognition.start();
  }

  function stopRecording() {
    isRecording = false;
    if (recognition) { recognition.onend = null; try { recognition.stop(); } catch {} }
    btn.className = 'idle';
    btn.innerHTML = micIcon();
    wave.style.display = 'none';
    cancelAnimationFrame(animFrame);
    const text = accumulated.trim();
    if (!text) { showStatus('Nothing recorded. Try again.'); return; }
    showStatus('✅ Done! Click Enhance or Copy');
    showText(text);
    actions.style.display = 'flex';
  }

  // ── Enhance / Fix ─────────────────────────────────────────
  async function enhanceText() {
    const raw = textBox.textContent?.trim();
    if (!raw || raw === 'Your text appears here...') return;
    fixBtn.textContent = '⏳ Enhancing...';
    fixBtn.disabled = true;
    btn.className = 'enhancing';
    showStatus('AI is enhancing...');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw, mode: 'professional', level: 65, language: currentLang }),
      });
      const data = await res.json();
      if (data.enhanced) {
        showText(data.enhanced);
        showStatus('✨ Enhanced! Click Copy & Paste');
      }
    } catch {
      showStatus('Enhancement failed — copy raw text');
    } finally {
      fixBtn.textContent = '✨ Enhance';
      fixBtn.disabled = false;
      btn.className = 'idle';
    }
  }

  async function copyAndPaste() {
    const text = textBox.textContent?.trim();
    if (!text || text === 'Your text appears here...') return;

    // Try to inject at cursor
    if (lastTarget) {
      try {
        if (lastTarget.tagName === 'INPUT' || lastTarget.tagName === 'TEXTAREA') {
          lastTarget.focus();
          const start = lastTarget.selectionStart || 0;
          const end = lastTarget.selectionEnd || 0;
          const v = lastTarget.value;
          lastTarget.value = v.slice(0, start) + text + v.slice(end);
          lastTarget.selectionStart = lastTarget.selectionEnd = start + text.length;
          lastTarget.dispatchEvent(new Event('input', { bubbles: true }));
          lastTarget.dispatchEvent(new Event('change', { bubbles: true }));
          showStatus('✅ Inserted at cursor!');
          copyBtn.textContent = '✅ Inserted!';
          setTimeout(() => { copyBtn.textContent = '📋 Copy & Paste'; }, 2000);
          return;
        } else if (lastTarget.isContentEditable) {
          lastTarget.focus();
          document.execCommand('insertText', false, text);
          showStatus('✅ Inserted at cursor!');
          copyBtn.textContent = '✅ Inserted!';
          setTimeout(() => { copyBtn.textContent = '📋 Copy & Paste'; }, 2000);
          return;
        }
      } catch {}
    }

    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(text);
      showStatus('📋 Copied! Press Ctrl+V to paste');
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => { copyBtn.textContent = '📋 Copy & Paste'; }, 2000);
    } catch {
      showStatus('Select text field first, then click Copy');
    }
  }

  function clearText() {
    accumulated = '';
    textBox.className = 'vf-text placeholder';
    textBox.textContent = 'Your text appears here...';
    actions.style.display = 'none';
    showStatus('Cleared. Click mic to start again.');
  }

  // ── Helpers ───────────────────────────────────────────────
  function showText(text) {
    const rtlLangs = ['ur-PK', 'ar-SA', 'fa-IR', 'he-IL'];
    textBox.className = 'vf-text' + (rtlLangs.includes(currentLang) ? ' rtl' : '');
    textBox.textContent = text;
    actions.style.display = 'flex';
  }

  function showStatus(msg) { status.textContent = msg; }

  function updateLangBtn() {
    const lang = LANGS.find(l => l.code === currentLang) || LANGS[0];
    langBtn.textContent = lang.flag + ' ' + lang.name;
  }

  function buildLangPicker() {
    langPicker.innerHTML = '';
    LANGS.forEach(lang => {
      const b = document.createElement('button');
      b.className = lang.code === currentLang ? 'active' : '';
      b.innerHTML = `<span>${lang.flag}</span><span>${lang.name}</span>`;
      b.onclick = () => {
        currentLang = lang.code;
        localStorage.setItem('vf_lang', lang.code);
        updateLangBtn();
        buildLangPicker();
        showLangPicker = false;
        langPicker.style.display = 'none';
        showStatus(`Language: ${lang.name}`);
      };
      langPicker.appendChild(b);
    });
  }

  function animateWave() {
    const bars = wave.querySelectorAll('span');
    bars.forEach(bar => {
      bar.style.height = (4 + Math.random() * 18) + 'px';
    });
    animFrame = requestAnimationFrame(animateWave);
  }

  function micIcon() {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
      <path d="M19 10a1 1 0 0 1 2 0 9 9 0 0 1-8 8.94V21h2a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h2v-2.06A9 9 0 0 1 3 10a1 1 0 0 1 2 0 7 7 0 0 0 14 0z"/>
    </svg>`;
  }

  function stopIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="3"/>
    </svg>`;
  }
})();
