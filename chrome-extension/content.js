/**
 * VoiceFlow AI — Chrome Extension Content Script v2
 *
 * Press SS anywhere — inside a LinkedIn comment, Facebook post, Gmail, Docs,
 * WhatsApp Web, any input or textarea — and speak. Text is injected directly
 * at your cursor the moment you stop. No copy-paste needed.
 */
(function () {
  if (document.getElementById('vf-root')) return;

  /* ── Languages ───────────────────────────────────────────── */
  const LANGS = [
    { code: 'en-US',  flag: '🇺🇸', name: 'English',    rtl: false },
    { code: 'en-GB',  flag: '🇬🇧', name: 'English UK',  rtl: false },
    { code: 'ur-PK',  flag: '🇵🇰', name: 'اردو',        rtl: true  },
    { code: 'ar-SA',  flag: '🇸🇦', name: 'العربية',     rtl: true  },
    { code: 'hi-IN',  flag: '🇮🇳', name: 'हिन्दी',      rtl: false },
    { code: 'es-ES',  flag: '🇪🇸', name: 'Español',     rtl: false },
    { code: 'fr-FR',  flag: '🇫🇷', name: 'Français',    rtl: false },
    { code: 'de-DE',  flag: '🇩🇪', name: 'Deutsch',     rtl: false },
    { code: 'pt-BR',  flag: '🇧🇷', name: 'Português',   rtl: false },
    { code: 'it-IT',  flag: '🇮🇹', name: 'Italiano',    rtl: false },
    { code: 'zh-CN',  flag: '🇨🇳', name: '中文',         rtl: false },
    { code: 'ja-JP',  flag: '🇯🇵', name: '日本語',       rtl: false },
    { code: 'ko-KR',  flag: '🇰🇷', name: '한국어',       rtl: false },
    { code: 'ru-RU',  flag: '🇷🇺', name: 'Русский',     rtl: false },
    { code: 'tr-TR',  flag: '🇹🇷', name: 'Türkçe',      rtl: false },
    { code: 'fa-IR',  flag: '🇮🇷', name: 'فارسی',       rtl: true  },
    { code: 'bn-BD',  flag: '🇧🇩', name: 'বাংলা',       rtl: false },
    { code: 'id-ID',  flag: '🇮🇩', name: 'Indonesia',   rtl: false },
    { code: 'ms-MY',  flag: '🇲🇾', name: 'Melayu',      rtl: false },
    { code: 'vi-VN',  flag: '🇻🇳', name: 'Tiếng Việt',  rtl: false },
    { code: 'th-TH',  flag: '🇹🇭', name: 'ภาษาไทย',     rtl: false },
    { code: 'pl-PL',  flag: '🇵🇱', name: 'Polski',      rtl: false },
    { code: 'nl-NL',  flag: '🇳🇱', name: 'Nederlands',  rtl: false },
    { code: 'sv-SE',  flag: '🇸🇪', name: 'Svenska',     rtl: false },
    { code: 'uk-UA',  flag: '🇺🇦', name: 'Українська',  rtl: false },
  ];

  /* ── State ───────────────────────────────────────────────── */
  let recognition   = null;
  let isRecording   = false;
  let accumulated   = '';       // final results only
  let lastInterim   = '';       // most recent interim result (fallback for non-English)
  let currentLang   = 'en-US';
  let lastFocused   = null;     // last focused text element (tracked by focusin)
  let inlineTarget  = null;     // field we are injecting into (inline mode)
  let inlineMode    = false;    // true = SS from inside a text field
  let waveTick      = null;

  // Check if extension context is still valid
  function chromeOk() {
    try { return typeof chrome !== 'undefined' && !!chrome.runtime?.id; } catch { return false; }
  }

  // Load saved language
  try {
    if (chromeOk() && chrome.storage) {
      chrome.storage.local.get('vf_lang', (d) => {
        if (!chromeOk()) return;
        if (d.vf_lang) { currentLang = d.vf_lang; refreshLangUI(); }
      });
    } else {
      currentLang = localStorage.getItem('vf_lang') || 'en-US';
    }
  } catch { currentLang = 'en-US'; }

  function saveLang(code) {
    currentLang = code;
    try {
      if (chromeOk() && chrome.storage) chrome.storage.local.set({ vf_lang: code });
      else localStorage.setItem('vf_lang', code);
    } catch {}
  }

  /* ── Styles ───────────────────────────────────────────────── */
  const css = document.createElement('style');
  css.textContent = `
    #vf-root{all:initial;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
    #vf-root *{box-sizing:border-box;}

    /* Floating mic button */
    #vf-fab{position:fixed;bottom:22px;right:22px;z-index:2147483647;width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s,box-shadow .25s;outline:none;-webkit-tap-highlight-color:transparent;}
    #vf-fab.idle{background:linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 4px 20px rgba(99,102,241,.55);}
    #vf-fab.rec {background:linear-gradient(135deg,#ef4444,#f97316);box-shadow:0 4px 28px rgba(239,68,68,.65);animation:vf-pulse 1.4s ease-in-out infinite;}
    #vf-fab.busy{background:linear-gradient(135deg,#6366f1,#8b5cf6);opacity:.6;cursor:default;}
    #vf-fab:active{transform:scale(.9);}
    @keyframes vf-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}

    /* Inline HUD — shown at bottom-center while recording INTO a text field */
    #vf-hud{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:2147483647;background:rgba(10,10,20,.96);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:10px 16px;min-width:260px;max-width:min(420px,calc(100vw - 32px));backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:0 8px 40px rgba(0,0,0,.6);display:none;pointer-events:none;}
    #vf-hud-row{display:flex;align-items:center;gap:10px;}
    #vf-hud-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;flex-shrink:0;animation:vf-blink .9s ease-in-out infinite;}
    @keyframes vf-blink{0%,100%{opacity:1}50%{opacity:.3}}
    #vf-hud-text{font-size:12px;color:rgba(255,255,255,.75);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:300px;}
    #vf-hud-hint{font-size:10px;color:rgba(255,255,255,.28);margin-top:4px;text-align:center;}

    /* Main panel */
    #vf-panel{position:fixed;bottom:86px;right:22px;z-index:2147483646;background:rgba(11,11,21,.97);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:16px;width:min(310px,calc(100vw - 44px));backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);box-shadow:0 12px 50px rgba(0,0,0,.65);display:none;}

    #vf-panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
    #vf-panel-title{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:#fff;}
    #vf-panel-icon{width:24px;height:24px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    #vf-panel-close{background:rgba(255,255,255,.07);border:none;color:rgba(255,255,255,.5);width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .15s;}
    #vf-panel-close:hover{background:rgba(255,255,255,.14);color:#fff;}

    /* Language selector row */
    #vf-lang-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.06);}
    #vf-lang-label{font-size:11px;color:rgba(255,255,255,.3);}
    #vf-lang-btn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.09);border-radius:8px;color:rgba(255,255,255,.8);font-size:12px;font-weight:600;padding:5px 10px;cursor:pointer;display:flex;align-items:center;gap:5px;transition:background .15s;}
    #vf-lang-btn:hover{background:rgba(255,255,255,.13);}
    #vf-lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:10px;max-height:170px;overflow-y:auto;}
    #vf-lang-grid button{display:flex;align-items:center;gap:7px;padding:7px 9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;color:rgba(255,255,255,.65);font-size:11px;cursor:pointer;transition:all .13s;}
    #vf-lang-grid button:hover,#vf-lang-grid button.vf-sel{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.38);color:#a5b8fc;}

    /* Waveform */
    #vf-wave{display:none;align-items:center;gap:2px;height:22px;margin-bottom:8px;justify-content:center;}
    #vf-wave span{display:inline-block;width:3px;background:linear-gradient(to top,#4f46e5,#a5b8fc);border-radius:2px;height:4px;}

    /* Status + textbox */
    #vf-status{font-size:11px;color:rgba(255,255,255,.32);text-align:center;margin-bottom:8px;min-height:14px;}
    #vf-textbox{color:rgba(255,255,255,.82);font-size:13px;line-height:1.55;min-height:54px;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;margin-bottom:8px;white-space:pre-wrap;word-break:break-word;}
    #vf-textbox.ph{color:rgba(255,255,255,.22);font-style:italic;}
    #vf-textbox.rtl{direction:rtl;text-align:right;}

    /* Action buttons */
    #vf-actions{display:none;gap:6px;}
    #vf-actions button{flex:1;padding:8px 6px;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;transition:opacity .15s,background .15s;}
    .vf-btn-primary{background:#6366f1;color:#fff;}
    .vf-btn-primary:hover{background:#4f46e5;}
    .vf-btn-secondary{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);}
    .vf-btn-secondary:hover{background:rgba(255,255,255,.14);}
    .vf-btn-ghost{background:rgba(255,255,255,.04);color:rgba(255,255,255,.35);}

    /* Shortcut badge on FAB */
    #vf-shortcut-tip{position:fixed;bottom:82px;right:22px;z-index:2147483646;font-size:10px;color:rgba(255,255,255,.28);text-align:center;width:54px;pointer-events:none;transition:opacity .3s;}
  `;
  document.head.appendChild(css);

  /* ── DOM ─────────────────────────────────────────────────── */
  const root = document.createElement('div');
  root.id = 'vf-root';

  // Inline HUD
  const hud = document.createElement('div');
  hud.id = 'vf-hud';
  hud.innerHTML = `
    <div id="vf-hud-row">
      <div id="vf-hud-dot"></div>
      <div id="vf-hud-text">Listening...</div>
    </div>
    <div id="vf-hud-hint">Press <strong>Space</strong> or <strong>Ctrl+9</strong> to stop &amp; insert</div>
  `;

  // Panel
  const panel = document.createElement('div');
  panel.id = 'vf-panel';

  const panelHeader = document.createElement('div');
  panelHeader.id = 'vf-panel-header';
  panelHeader.innerHTML = `
    <div id="vf-panel-title">
      <div id="vf-panel-icon">${micSVG(14)}</div>
      VoiceFlow AI
    </div>
  `;
  const closeBtn = document.createElement('button');
  closeBtn.id = 'vf-panel-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = closePanel;
  panelHeader.appendChild(closeBtn);

  const langRow = document.createElement('div');
  langRow.id = 'vf-lang-row';
  const langLabel = document.createElement('span');
  langLabel.id = 'vf-lang-label';
  langLabel.textContent = 'Language:';
  const langBtn = document.createElement('button');
  langBtn.id = 'vf-lang-btn';
  langRow.append(langLabel, langBtn);

  const langGrid = document.createElement('div');
  langGrid.id = 'vf-lang-grid';
  langGrid.style.display = 'none';
  buildLangGrid();
  langBtn.onclick = () => {
    const open = langGrid.style.display === 'none';
    langGrid.style.display = open ? 'grid' : 'none';
  };

  const wave = document.createElement('div');
  wave.id = 'vf-wave';
  for (let i = 0; i < 16; i++) wave.appendChild(document.createElement('span'));

  const statusEl = document.createElement('div');
  statusEl.id = 'vf-status';
  statusEl.textContent = 'Press Ctrl+9 or S S anywhere to start';

  const textbox = document.createElement('div');
  textbox.id = 'vf-textbox';
  textbox.className = 'ph';
  textbox.textContent = 'Your speech will appear here...';

  const actionsEl = document.createElement('div');
  actionsEl.id = 'vf-actions';

  const insertBtn = document.createElement('button');
  insertBtn.className = 'vf-btn-primary';
  insertBtn.textContent = '✍️ Insert at cursor';
  insertBtn.onclick = doInsert;

  const copyBtn = document.createElement('button');
  copyBtn.className = 'vf-btn-secondary';
  copyBtn.textContent = '📋 Copy';
  copyBtn.onclick = doCopy;

  const clearBtn = document.createElement('button');
  clearBtn.className = 'vf-btn-ghost';
  clearBtn.textContent = 'Clear';
  clearBtn.onclick = doClear;

  actionsEl.append(insertBtn, copyBtn, clearBtn);
  panel.append(panelHeader, langRow, langGrid, wave, statusEl, textbox, actionsEl);

  // FAB
  const fab = document.createElement('button');
  fab.id = 'vf-fab';
  fab.className = 'idle';
  fab.title = 'VoiceFlow AI — click, press Ctrl+9, or press SS';
  fab.innerHTML = micSVG(24);
  fab.onclick = () => {
    if (isRecording) {
      stopRec();
    } else {
      inlineMode = false;
      inlineTarget = null;
      openPanel();
      startRec();
    }
  };

  // Shortcut tip
  const tip = document.createElement('div');
  tip.id = 'vf-shortcut-tip';
  tip.textContent = 'Ctrl+9';

  root.append(hud, panel, tip, fab);
  document.body.appendChild(root);
  refreshLangUI();

  /* ── Track the last focused text element ─────────────────── */
  document.addEventListener('focusin', (e) => {
    const el = e.target;
    if (el && el !== fab && !root.contains(el)) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
        lastFocused = el;
      }
    }
  }, true);

  /* ── Shared toggle logic ─────────────────────────────────── */
  function triggerToggle(targetOverride) {
    if (isRecording) { stopRec(); return; }

    const active = targetOverride || document.activeElement;
    const isField = active && !root.contains(active) && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    );

    if (isField) {
      inlineTarget = active;
      inlineMode   = true;
      startRec();
    } else {
      inlineTarget = null;
      inlineMode   = false;
      openPanel();
      startRec();
    }
  }

  /* ── F1 — start / stop recording ────────────────────────── */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
      e.preventDefault();
      e.stopImmediatePropagation();
      triggerToggle();
    }
  }, true);


/* ── Speech Recognition ──────────────────────────────────── */
  function startRec() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus('❌ Use Chrome or Edge — Firefox does not support voice');
      return;
    }

    if (recognition) { try { recognition.abort(); } catch {} }
    recognition = new SR();
    recognition.continuous    = true;
    recognition.interimResults = true;
    recognition.lang          = currentLang;
    accumulated = '';

    recognition.onstart = () => {
      isRecording = true;
      fab.className = 'rec';
      fab.innerHTML = stopSVG();

      if (inlineMode) {
        // Show compact HUD at bottom-center
        hud.style.display = 'block';
        setHudText('Listening...');
        // Hide panel if open
        panel.style.display = 'none';
      } else {
        // Show waveform inside panel
        wave.style.display = 'flex';
        setStatus('🔴 Listening… press Space or Ctrl+9 to stop');
        animWave();
      }
    };

    recognition.onresult = (ev) => {
      let fin = '', inter = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) fin += r[0].transcript;
        else inter += r[0].transcript;
      }
      if (fin) { accumulated += fin + ' '; lastInterim = ''; }
      else if (inter) lastInterim = inter; // save interim as fallback (fixes non-English)
      const full = (accumulated + (fin ? '' : inter)).trim();

      if (inlineMode) {
        setHudText(full || 'Listening...');
      } else {
        showInPanel(full);
      }
    };

    recognition.onerror = (ev) => {
      if (ev.error === 'not-allowed') {
        setStatus('❌ Microphone blocked — allow it in browser settings');
        showBrowserMicTip();
      } else if (ev.error === 'service-not-allowed') {
        setStatus('❌ Language blocked by browser — try English or switch to Chrome');
      } else if (ev.error !== 'no-speech' && ev.error !== 'aborted') {
        setStatus('Error: ' + ev.error);
      }
    };

    recognition.onend = () => {
      // Auto-restart so recording continues until user presses SS again
      if (isRecording) {
        try { recognition.start(); } catch {}
      }
    };

    recognition.start();
  }

  function stopRec() {
    isRecording = false;
    cancelAnimationFrame(waveTick);
    wave.style.display = 'none';
    fab.className = 'idle';
    fab.innerHTML = micSVG(24);

    if (!recognition) { finalizeAndInject(); return; }

    // Wait for onend so any pending final results (especially non-English) arrive first
    let done = false;
    const finish = () => { if (done) return; done = true; finalizeAndInject(); };
    recognition.onend = finish;
    try { recognition.stop(); } catch { finish(); }
  }

  function finalizeAndInject() {
    // Use accumulated finals + last interim as fallback (fixes Arabic/Urdu/etc.)
    const text = (accumulated + lastInterim).trim();
    accumulated  = '';
    lastInterim  = '';
    recognition  = null;

    if (inlineMode && inlineTarget) {
      hud.style.display = 'none';
      if (text) {
        const ok = injectInto(inlineTarget, text);
        if (ok) {
          flashHud('✅ Inserted!');
        } else {
          navigator.clipboard.writeText(text).catch(() => {});
          flashHud('📋 Copied — press Ctrl+V to paste');
        }
      } else {
        flashHud('Nothing recorded');
      }
    } else {
      if (text) {
        showInPanel(text);
        setStatus('✅ Done — click "Insert at cursor" or Copy');
        actionsEl.style.display = 'flex';
      } else {
        setStatus('Nothing recorded — try again');
      }
    }
  }

  /* ── Inject text into a field ────────────────────────────── */
  function injectInto(el, text) {
    if (!el || !text) return false;
    try {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.focus();
        const s  = el.selectionStart || 0;
        const e2 = el.selectionEnd   || s;
        const proto  = el.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        const newVal = el.value.slice(0, s) + text + el.value.slice(e2);
        if (setter) setter.call(el, newVal); else el.value = newVal;
        el.selectionStart = el.selectionEnd = s + text.length;
        el.dispatchEvent(new Event('input',  { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }

      if (el.isContentEditable) {
        el.focus();
        // execCommand is the most compatible way to inject into React/Vue/Angular fields
        // (LinkedIn, Facebook, Gmail, WhatsApp Web all use contentEditable)
        const inserted = document.execCommand('insertText', false, text);
        if (inserted) return true;

        // Fallback for browsers where execCommand is not supported
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const node = document.createTextNode(text);
          range.insertNode(node);
          range.setStartAfter(node);
          range.setEndAfter(node);
          sel.removeAllRanges();
          sel.addRange(range);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
      }
    } catch {}
    return false;
  }

  /* ── Panel: insert button ────────────────────────────────── */
  function doInsert() {
    const text = getText();
    if (!text) return;
    const target = lastFocused;
    if (target && target !== fab && !root.contains(target)) {
      const ok = injectInto(target, text);
      if (ok) {
        insertBtn.textContent = '✅ Inserted!';
        setTimeout(() => { insertBtn.textContent = '✍️ Insert at cursor'; }, 2000);
        return;
      }
    }
    // No focused field — use clipboard
    doCopy();
    setStatus('No text field focused — text copied, press Ctrl+V');
  }

  async function doCopy() {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
    } catch {
      setStatus('Could not copy — click inside a text field first');
    }
  }

  function doClear() {
    accumulated = '';
    textbox.className = 'ph';
    textbox.textContent = 'Your speech will appear here...';
    actionsEl.style.display = 'none';
    setStatus('Cleared. Press SS to start again.');
  }

  /* ── Panel helpers ───────────────────────────────────────── */
  function openPanel() {
    panel.style.display = 'block';
  }
  function closePanel() {
    panel.style.display = 'none';
    if (isRecording) stopRec();
  }

  function showInPanel(text) {
    const rtl = ['ur-PK', 'ar-SA', 'fa-IR'].includes(currentLang);
    textbox.className = rtl ? 'rtl' : '';
    textbox.textContent = text;
    actionsEl.style.display = 'flex';
  }

  function getText() {
    return textbox.className.includes('ph') ? '' : textbox.textContent.trim();
  }

  function setStatus(msg) { statusEl.textContent = msg; }

  /* ── Inline HUD helpers ──────────────────────────────────── */
  function setHudText(text) {
    const el = document.getElementById('vf-hud-text');
    if (el) el.textContent = text;
  }

  function flashHud(msg, duration = 2200) {
    const hudText = document.getElementById('vf-hud-text');
    const hudHint = document.getElementById('vf-hud-hint');
    const dot     = document.getElementById('vf-hud-dot');
    if (!hudText) return;
    hud.style.display  = 'block';
    if (dot)     dot.style.display    = 'none';
    if (hudHint) hudHint.style.display = 'none';
    hudText.textContent = msg;
    hudText.style.color = 'rgba(255,255,255,.9)';
    setTimeout(() => {
      hud.style.display   = 'none';
      if (dot)     dot.style.display    = '';
      if (hudHint) hudHint.style.display = '';
      hudText.style.color = '';
    }, duration);
  }

  /* ── Language UI ─────────────────────────────────────────── */
  function refreshLangUI() {
    const lang = LANGS.find(l => l.code === currentLang) || LANGS[0];
    langBtn.innerHTML = `<span>${lang.flag}</span><span>${lang.name}</span><span style="color:rgba(255,255,255,.3);margin-left:3px">▾</span>`;
  }

  function buildLangGrid() {
    langGrid.innerHTML = '';
    LANGS.forEach(lang => {
      const btn = document.createElement('button');
      btn.className = lang.code === currentLang ? 'vf-sel' : '';
      btn.innerHTML = `<span style="font-size:15px">${lang.flag}</span><span>${lang.name}</span>`;
      btn.onclick = () => {
        saveLang(lang.code);
        refreshLangUI();
        buildLangGrid();
        langGrid.style.display = 'none';
        setStatus(`Language: ${lang.name}`);
        if (isRecording) stopRec();
      };
      langGrid.appendChild(btn);
    });
  }

  /* ── Mic blocked tip ─────────────────────────────────────── */
  function showBrowserMicTip() {
    // Show a one-time tip in the panel about allowing mic
    openPanel();
    textbox.className = 'ph';
    textbox.textContent = 'Microphone is blocked.\n\nClick the 🔒 or 🎙️ icon in your browser address bar → Allow microphone → Refresh page.';
    textbox.style.color = 'rgba(251,191,36,.85)';
    textbox.style.whiteSpace = 'pre-wrap';
    setTimeout(() => { textbox.style.color = ''; textbox.style.whiteSpace = ''; }, 8000);
  }

  /* ── Waveform animation ──────────────────────────────────── */
  function animWave() {
    wave.querySelectorAll('span').forEach(b => {
      b.style.height = (3 + Math.random() * 18) + 'px';
    });
    waveTick = requestAnimationFrame(animWave);
  }

  /* ── SVG icons ───────────────────────────────────────────── */
  function micSVG(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><rect x="9" y="2" width="6" height="11" rx="3" fill="white" stroke="none"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8"/></svg>`;
  }
  function stopSVG() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>`;
  }
})();
