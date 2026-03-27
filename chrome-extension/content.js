/**
 * VoiceFlow AI — Chrome Extension Content Script
 * Injected into every webpage automatically.
 * Adds a floating mic button (bottom-right) that works in any text field.
 */
(function () {
  if (document.getElementById('vf-widget-root')) return;

  const API = 'https://linkedwin.io/api/enhance';
  const LANGS = [
    { code: 'en-US', flag: '🇺🇸', name: 'English', rtl: false },
    { code: 'ur-PK', flag: '🇵🇰', name: 'اردو', rtl: true },
    { code: 'ar-SA', flag: '🇸🇦', name: 'العربية', rtl: true },
    { code: 'hi-IN', flag: '🇮🇳', name: 'हिन्दी', rtl: false },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español', rtl: false },
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français', rtl: false },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch', rtl: false },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português', rtl: false },
    { code: 'zh-CN', flag: '🇨🇳', name: '中文', rtl: false },
    { code: 'ja-JP', flag: '🇯🇵', name: '日本語', rtl: false },
    { code: 'ko-KR', flag: '🇰🇷', name: '한국어', rtl: false },
    { code: 'ru-RU', flag: '🇷🇺', name: 'Русский', rtl: false },
    { code: 'tr-TR', flag: '🇹🇷', name: 'Türkçe', rtl: false },
    { code: 'fa-IR', flag: '🇮🇷', name: 'فارسی', rtl: true },
    { code: 'bn-BD', flag: '🇧🇩', name: 'বাংলা', rtl: false },
    { code: 'id-ID', flag: '🇮🇩', name: 'Indonesia', rtl: false },
  ];

  let recognition = null;
  let isRecording = false;
  let accumulated = '';
  let currentLang = (typeof chrome !== 'undefined' && chrome.storage)
    ? 'en-US' : (localStorage.getItem('vf_lang') || 'en-US');
  let lastTarget = null;
  let animFrame = null;
  let panelVisible = false;

  // Load saved language from chrome.storage
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get('vf_lang', (d) => {
      if (d.vf_lang) { currentLang = d.vf_lang; updateLangBtn(); }
    });
  }

  function saveLang(code) {
    currentLang = code;
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ vf_lang: code });
    } else {
      localStorage.setItem('vf_lang', code);
    }
  }

  /* ── Styles ───────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #vf-widget-root{all:initial;position:fixed;bottom:20px;right:20px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
    #vf-widget-root *{box-sizing:border-box;}
    #vf-fab{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s,box-shadow .3s;outline:none;-webkit-tap-highlight-color:transparent;position:relative;}
    #vf-fab:active{transform:scale(.92);}
    #vf-fab.idle{background:linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 4px 24px rgba(99,102,241,.55);}
    #vf-fab.rec{background:linear-gradient(135deg,#ef4444,#f97316);box-shadow:0 4px 30px rgba(239,68,68,.6);animation:vfp 1.5s ease-in-out infinite;}
    #vf-fab.busy{background:linear-gradient(135deg,#6366f1,#8b5cf6);opacity:.65;}
    @keyframes vfp{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
    #vf-badge{position:absolute;top:-2px;right:-2px;width:16px;height:16px;background:#10b981;border-radius:50%;border:2px solid #0a0a0f;display:flex;align-items:center;justify-content:center;}
    #vf-badge svg{width:8px;height:8px;}
    #vf-panel{background:rgba(12,12,22,.97);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:14px;width:min(300px,calc(100vw - 40px));backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);box-shadow:0 12px 50px rgba(0,0,0,.6);}
    #vf-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
    #vf-head-left{display:flex;align-items:center;gap:8px;}
    #vf-head-icon{width:24px;height:24px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:7px;display:flex;align-items:center;justify-content:center;}
    #vf-head-title{font-size:13px;font-weight:700;color:#fff;}
    #vf-close-btn{background:rgba(255,255,255,.07);border:none;color:rgba(255,255,255,.5);width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:background .15s;}
    #vf-close-btn:hover{background:rgba(255,255,255,.12);color:#fff;}
    #vf-lang-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.06);}
    #vf-lang-row label{font-size:11px;color:rgba(255,255,255,.35);}
    #vf-lang-toggle{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:rgba(255,255,255,.75);font-size:12px;font-weight:600;padding:5px 10px;cursor:pointer;display:flex;align-items:center;gap:5px;}
    #vf-lang-toggle:hover{background:rgba(255,255,255,.12);}
    #vf-lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:10px;max-height:180px;overflow-y:auto;}
    #vf-lang-grid button{display:flex;align-items:center;gap:6px;padding:7px 8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;color:rgba(255,255,255,.65);font-size:11px;cursor:pointer;text-align:left;transition:all .15s;}
    #vf-lang-grid button:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.3);color:#fff;}
    #vf-lang-grid button.vf-active{background:rgba(99,102,241,.2);border-color:rgba(99,102,241,.4);color:#a5b8fc;}
    #vf-wave{display:flex;align-items:center;gap:2px;height:24px;margin-bottom:8px;justify-content:center;}
    #vf-wave span{display:inline-block;width:3px;background:linear-gradient(to top,#4f46e5,#a5b8fc);border-radius:2px;height:4px;}
    #vf-status{font-size:11px;color:rgba(255,255,255,.35);text-align:center;margin-bottom:8px;min-height:16px;}
    #vf-textbox{color:rgba(255,255,255,.82);font-size:13px;line-height:1.55;min-height:52px;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;margin-bottom:8px;white-space:pre-wrap;word-break:break-word;}
    #vf-textbox.rtl{direction:rtl;text-align:right;}
    #vf-textbox.ph{color:rgba(255,255,255,.22);font-style:italic;}
    #vf-actions{display:flex;gap:6px;}
    #vf-actions button{flex:1;padding:8px 6px;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;transition:opacity .15s;}
    #vf-actions .vf-copy{background:#6366f1;color:#fff;}
    #vf-actions .vf-copy:active{opacity:.8;}
    #vf-actions .vf-ai{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);}
    #vf-actions .vf-ai:hover{background:rgba(255,255,255,.12);}
    #vf-actions .vf-clr{background:rgba(255,255,255,.04);color:rgba(255,255,255,.35);}
  `;
  document.head.appendChild(style);

  /* ── Build DOM ────────────────────────────────────────────── */
  const root = document.createElement('div');
  root.id = 'vf-widget-root';

  // Panel
  const panel = document.createElement('div');
  panel.id = 'vf-panel';
  panel.style.display = 'none';

  // Header
  const head = document.createElement('div');
  head.id = 'vf-head';
  head.innerHTML = `
    <div id="vf-head-left">
      <div id="vf-head-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg></div>
      <span id="vf-head-title">VoiceFlow AI</span>
    </div>
  `;
  const closeBtn = document.createElement('button');
  closeBtn.id = 'vf-close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => { panel.style.display = 'none'; panelVisible = false; };
  head.appendChild(closeBtn);

  // Language row
  const langRow = document.createElement('div');
  langRow.id = 'vf-lang-row';
  const langLabel = document.createElement('label');
  langLabel.textContent = 'Speaking in:';
  const langToggle = document.createElement('button');
  langToggle.id = 'vf-lang-toggle';
  langRow.append(langLabel, langToggle);

  // Language grid (always visible, no dropdown)
  const langGrid = document.createElement('div');
  langGrid.id = 'vf-lang-grid';
  langGrid.style.display = 'none';
  buildLangGrid();
  langToggle.onclick = () => {
    const open = langGrid.style.display === 'none';
    langGrid.style.display = open ? 'grid' : 'none';
    langToggle.style.borderColor = open ? 'rgba(99,102,241,0.5)' : '';
  };

  // Waveform
  const wave = document.createElement('div');
  wave.id = 'vf-wave';
  wave.style.display = 'none';
  for (let i = 0; i < 16; i++) {
    const b = document.createElement('span');
    wave.appendChild(b);
  }

  // Status
  const statusEl = document.createElement('div');
  statusEl.id = 'vf-status';
  statusEl.textContent = 'Click the mic button to start';

  // Text box
  const textbox = document.createElement('div');
  textbox.id = 'vf-textbox';
  textbox.className = 'ph';
  textbox.textContent = 'Your text will appear here...';

  // Actions
  const actions = document.createElement('div');
  actions.id = 'vf-actions';
  actions.style.display = 'none';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'vf-copy';
  copyBtn.textContent = '📋 Copy & Insert';
  copyBtn.onclick = copyAndInsert;

  const aiBtn = document.createElement('button');
  aiBtn.className = 'vf-ai';
  aiBtn.textContent = '✨ Enhance';
  aiBtn.onclick = enhance;

  const clrBtn = document.createElement('button');
  clrBtn.className = 'vf-clr';
  clrBtn.textContent = 'Clear';
  clrBtn.onclick = clearAll;

  actions.append(copyBtn, aiBtn, clrBtn);
  panel.append(head, langRow, langGrid, wave, statusEl, textbox, actions);

  // FAB button
  const fab = document.createElement('button');
  fab.id = 'vf-fab';
  fab.className = 'idle';
  fab.title = 'VoiceFlow AI — click to record';
  fab.innerHTML = micSVG() + `<div id="vf-badge"><svg viewBox="0 0 24 24" fill="white"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/></svg></div>`;
  fab.onclick = () => {
    if (!panelVisible) { panel.style.display = 'block'; panelVisible = true; }
    isRecording ? stopRecording() : startRecording();
  };

  root.append(panel, fab);
  document.body.appendChild(root);

  updateLangBtn();

  /* ── Track last focused input ────────────────────────────── */
  document.addEventListener('focusin', (e) => {
    const el = e.target;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
      lastTarget = el;
    }
  }, true);

  /* ── SS shortcut (press S twice quickly) ─────────────────── */
  let lastS = 0;
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.key.toLowerCase() === 's') {
      const now = Date.now();
      if (now - lastS < 400) {
        if (!panelVisible) { panel.style.display = 'block'; panelVisible = true; }
        isRecording ? stopRecording() : startRecording();
        lastS = 0;
      } else lastS = now;
    }
  });

  /* ── Recording ───────────────────────────────────────────── */
  function startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus('❌ Use Chrome or Edge for voice recording'); return; }

    if (recognition) { try { recognition.abort(); } catch {} }
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLang;
    accumulated = '';

    recognition.onstart = () => {
      isRecording = true;
      fab.className = 'rec';
      fab.innerHTML = stopSVG();
      wave.style.display = 'flex';
      setStatus('🔴 Listening... click mic to stop');
      animWave();
    };

    recognition.onresult = (e) => {
      let fin = '', int = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript;
        else int += e.results[i][0].transcript;
      }
      if (fin) accumulated += fin + ' ';
      showText((accumulated + int).trim());
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') setStatus('Error: ' + e.error);
    };

    recognition.onend = () => {
      if (isRecording) { try { recognition.start(); } catch {} }
    };

    recognition.start();
  }

  function stopRecording() {
    isRecording = false;
    if (recognition) { recognition.onend = null; try { recognition.stop(); } catch {} }
    fab.className = 'idle';
    fab.innerHTML = micSVG() + `<div id="vf-badge"><svg viewBox="0 0 24 24" fill="white"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/></svg></div>`;
    wave.style.display = 'none';
    cancelAnimationFrame(animFrame);
    const text = accumulated.trim();
    if (!text) { setStatus('Nothing recorded — try again'); return; }
    showText(text);
    setStatus('✅ Done! Tap "Copy & Insert" to paste');
    actions.style.display = 'flex';
  }

  /* ── Enhance ─────────────────────────────────────────────── */
  async function enhance() {
    const raw = textbox.className.includes('ph') ? '' : textbox.textContent.trim();
    if (!raw) return;
    aiBtn.textContent = '⏳ Enhancing...';
    aiBtn.disabled = true;
    setStatus('AI is enhancing your text...');
    fab.className = 'busy';
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw, mode: 'professional', level: 70, language: currentLang }),
      });
      const data = await res.json();
      if (data.enhanced) { showText(data.enhanced); setStatus('✨ Enhanced! Tap Copy & Insert'); }
    } catch { setStatus('Enhancement failed — copying raw text'); }
    finally { aiBtn.textContent = '✨ Enhance'; aiBtn.disabled = false; fab.className = 'idle'; }
  }

  /* ── Copy & Insert ───────────────────────────────────────── */
  async function copyAndInsert() {
    const text = textbox.className.includes('ph') ? '' : textbox.textContent.trim();
    if (!text) return;

    // Try injecting at cursor first
    if (lastTarget) {
      try {
        if (lastTarget.tagName === 'INPUT' || lastTarget.tagName === 'TEXTAREA') {
          lastTarget.focus();
          const s = lastTarget.selectionStart || 0;
          const e = lastTarget.selectionEnd || 0;
          const v = lastTarget.value;
          const nativeSet = Object.getOwnPropertyDescriptor(
            lastTarget.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype, 'value'
          )?.set;
          if (nativeSet) nativeSet.call(lastTarget, v.slice(0, s) + text + v.slice(e));
          else lastTarget.value = v.slice(0, s) + text + v.slice(e);
          lastTarget.selectionStart = lastTarget.selectionEnd = s + text.length;
          lastTarget.dispatchEvent(new Event('input', { bubbles: true }));
          lastTarget.dispatchEvent(new Event('change', { bubbles: true }));
          setStatus('✅ Inserted at cursor!');
          copyBtn.textContent = '✅ Inserted!';
          setTimeout(() => { copyBtn.textContent = '📋 Copy & Insert'; }, 2000);
          return;
        }
        if (lastTarget.isContentEditable) {
          lastTarget.focus();
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const node = document.createTextNode(text);
            range.insertNode(node);
            range.setStartAfter(node); range.setEndAfter(node);
            sel.removeAllRanges(); sel.addRange(range);
            lastTarget.dispatchEvent(new Event('input', { bubbles: true }));
            setStatus('✅ Inserted at cursor!');
            copyBtn.textContent = '✅ Inserted!';
            setTimeout(() => { copyBtn.textContent = '📋 Copy & Insert'; }, 2000);
            return;
          }
        }
      } catch {}
    }

    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(text);
      setStatus('📋 Copied! Press Ctrl+V / Cmd+V to paste');
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => { copyBtn.textContent = '📋 Copy & Insert'; }, 2000);
    } catch { setStatus('Click in a text field first, then try again'); }
  }

  function clearAll() {
    accumulated = '';
    textbox.className = 'ph';
    textbox.textContent = 'Your text will appear here...';
    actions.style.display = 'none';
    setStatus('Cleared. Click the mic to start again.');
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function showText(text) {
    const rtl = ['ur-PK', 'ar-SA', 'fa-IR'].includes(currentLang);
    textbox.className = rtl ? 'rtl' : '';
    textbox.textContent = text;
    actions.style.display = 'flex';
  }

  function setStatus(msg) { statusEl.textContent = msg; }

  function updateLangBtn() {
    const lang = LANGS.find(l => l.code === currentLang) || LANGS[0];
    langToggle.innerHTML = `<span>${lang.flag}</span><span>${lang.name}</span><span style="color:rgba(255,255,255,.3);margin-left:2px">▾</span>`;
  }

  function buildLangGrid() {
    langGrid.innerHTML = '';
    LANGS.forEach(lang => {
      const btn = document.createElement('button');
      btn.className = lang.code === currentLang ? 'vf-active' : '';
      btn.innerHTML = `<span style="font-size:16px">${lang.flag}</span><span>${lang.name}</span>`;
      btn.onclick = () => {
        saveLang(lang.code);
        updateLangBtn();
        buildLangGrid();
        langGrid.style.display = 'none';
        langToggle.style.borderColor = '';
        setStatus(`Language set to ${lang.name}`);
        if (isRecording) { stopRecording(); setStatus(`${lang.name} selected. Tap mic to record.`); }
      };
      langGrid.appendChild(btn);
    });
  }

  function animWave() {
    wave.querySelectorAll('span').forEach(b => {
      b.style.height = (3 + Math.random() * 20) + 'px';
    });
    animFrame = requestAnimationFrame(animWave);
  }

  function micSVG() {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`;
  }
  function stopSVG() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>`;
  }
})();
