/*!
 * Kimi-inspired Chat UI for TypingMind
 * Version: 2.0.0
 *
 * Visual styling only. No chat reading, API-key access, network requests,
 * prompt changes, or model changes. Not affiliated with Moonshot AI/TypingMind.
 * Toggle: Ctrl/Cmd + Alt + K.
 */
(() => {
  "use strict";

  const VERSION = "2.0.0";
  const ROOT = "tm-kimi-ui";
  const STYLE_ID = "tm-kimi-ui-styles";
  if (window.TypingMindKimiTheme) return;

  const css = String.raw`
    html.${ROOT} {
      --kimi-bg: #ffffff;
      --kimi-sidebar: #f7f7f5;
      --kimi-surface: #ffffff;
      --kimi-soft: #f5f5f3;
      --kimi-hover: #eeeeeb;
      --kimi-bubble: #f0f0ed;
      --kimi-text: #202124;
      --kimi-muted: #6f7077;
      --kimi-faint: #9b9ca3;
      --kimi-border: #e5e5e1;
      --kimi-border-strong: #cecec8;
      --kimi-accent: #2f6fdd;
      --kimi-accent-soft: #edf4ff;
      --kimi-code: #f6f7f8;
      --kimi-avatar: #ffffff;
      --kimi-shadow: 0 3px 18px rgba(25, 25, 23, .065);
      color-scheme: light;
    }
    html.dark.${ROOT} {
      --kimi-bg: #191919;
      --kimi-sidebar: #111111;
      --kimi-surface: #222222;
      --kimi-soft: #252525;
      --kimi-hover: #303030;
      --kimi-bubble: #2c2c2c;
      --kimi-text: #ececea;
      --kimi-muted: #aaa9a5;
      --kimi-faint: #7d7c78;
      --kimi-border: #353535;
      --kimi-border-strong: #4b4b4b;
      --kimi-accent: #79aaff;
      --kimi-accent-soft: #202c3e;
      --kimi-code: #202122;
      --kimi-avatar: #242424;
      --kimi-shadow: 0 5px 24px rgba(0, 0, 0, .28);
      color-scheme: dark;
    }

    html.${ROOT}, html.${ROOT} body {
      background: var(--kimi-bg) !important;
      color: var(--kimi-text);
      font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    html.${ROOT} *, html.${ROOT} *::before, html.${ROOT} *::after {
      scrollbar-color: var(--kimi-border-strong) transparent;
      scrollbar-width: thin;
    }
    html.${ROOT} ::selection {
      color: var(--kimi-text);
      background: var(--kimi-accent-soft);
    }

    /* App surfaces */
    html.${ROOT} [data-element-id="main-content-area"],
    html.${ROOT} [data-element-id="chat-space-background"],
    html.${ROOT} [data-element-id="chat-space-middle-part"],
    html.${ROOT} [data-element-id="chat-space-end-part"] {
      color: var(--kimi-text);
      background: var(--kimi-bg) !important;
    }
    html.${ROOT} [data-element-id="chat-space-beginning-part"] {
      color: var(--kimi-text);
      background: var(--kimi-bg) !important;
      border-bottom: 1px solid var(--kimi-border) !important;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    html.${ROOT} [data-element-id="current-chat-title"],
    html.${ROOT} [data-element-id="model-name"] {
      color: var(--kimi-text) !important;
      font-weight: 600 !important;
      letter-spacing: -.01em;
    }

    /* Sidebar: neutral, compact, and free of heavy accent colors */
    html.${ROOT} [data-element-id="workspace-bar"],
    html.${ROOT} [data-element-id="nav-sidebar-container"],
    html.${ROOT} [data-element-id="side-bar-background"],
    html.${ROOT} [data-element-id="sidebar-beginning-part"],
    html.${ROOT} [data-element-id="sidebar-middle-part"],
    html.${ROOT} [data-element-id="side-bar-footer"] {
      color: var(--kimi-muted);
      background: var(--kimi-sidebar) !important;
      border-color: var(--kimi-border) !important;
    }
    html.${ROOT} [data-element-id="workspace-bar"] button,
    html.${ROOT} [data-element-id="nav-sidebar-container"] button,
    html.${ROOT} [data-element-id="nav-sidebar-container"] a,
    html.${ROOT} [data-element-id="side-bar-footer"] button {
      color: var(--kimi-muted) !important;
      border-radius: 10px !important;
    }
    html.${ROOT} [data-element-id="workspace-bar"] button:hover,
    html.${ROOT} [data-element-id="nav-sidebar-container"] button:hover,
    html.${ROOT} [data-element-id="nav-sidebar-container"] a:hover,
    html.${ROOT} [data-element-id="side-bar-footer"] button:hover {
      color: var(--kimi-text) !important;
      background: var(--kimi-hover) !important;
    }
    html.${ROOT} [data-element-id="new-chat-button-in-side-bar"] {
      color: var(--kimi-text) !important;
      background: var(--kimi-surface) !important;
      border: 1px solid var(--kimi-border) !important;
      border-radius: 12px !important;
      box-shadow: 0 1px 2px rgba(0,0,0,.025);
      font-weight: 550 !important;
    }
    html.${ROOT} [data-element-id="new-chat-button-in-side-bar"] * {
      color: var(--kimi-text) !important;
    }
    html.${ROOT} [data-element-id="new-chat-button-in-side-bar"]:hover {
      background: var(--kimi-soft) !important;
      border-color: var(--kimi-border-strong) !important;
    }
    html.${ROOT} [data-element-id="search-chats-bar"] {
      color: var(--kimi-muted) !important;
      background: transparent !important;
      border-color: var(--kimi-border) !important;
      border-radius: 10px !important;
    }
    html.${ROOT} [data-element-id="custom-chat-item"],
    html.${ROOT} [data-element-id="selected-chat-item"] {
      border-radius: 11px !important;
    }
    html.${ROOT} [data-element-id="custom-chat-item"]:hover {
      background: var(--kimi-soft) !important;
    }
    html.${ROOT} [data-element-id="selected-chat-item"] {
      color: var(--kimi-text) !important;
      background: var(--kimi-hover) !important;
    }
    html.${ROOT} [data-element-id="selected-chat-item"] * {
      color: var(--kimi-text) !important;
    }

    /* Message layout */
    html.${ROOT} [data-element-id="response-block"] {
      color: var(--kimi-text);
      background: transparent !important;
      border-radius: 0 !important;
      padding-top: 18px !important;
      padding-bottom: 18px !important;
      transition: none !important;
    }
    html.${ROOT} [data-element-id="response-block"]:hover,
    html.dark.${ROOT} [data-element-id="response-block"]:hover {
      background: transparent !important;
    }
    html.${ROOT} [data-element-id="response-block"][data-message-role="user"] {
      padding-top: 12px !important;
      padding-bottom: 12px !important;
    }
    html.${ROOT} [data-element-id="chat-avatar-container"] {
      width: 30px;
      height: 30px;
      overflow: hidden;
      background: var(--kimi-avatar) !important;
      border: 1px solid var(--kimi-border);
      border-radius: 9px !important;
      box-shadow: 0 1px 2px rgba(0,0,0,.025);
    }
    html.${ROOT} [data-element-id="chat-avatar-container"] img {
      border-radius: 8px !important;
    }
    html.${ROOT} [data-element-id="user-message"] {
      display: block;
      width: fit-content !important;
      max-width: min(78%, 720px) !important;
      margin-left: auto !important;
      padding: 9px 15px !important;
      color: var(--kimi-text) !important;
      background: var(--kimi-bubble) !important;
      border: 0 !important;
      border-radius: 16px !important;
      box-shadow: none !important;
      font-weight: 400 !important;
      line-height: 1.6 !important;
    }
    html.${ROOT} [data-element-id="user-message"] * { color: inherit !important; }
    html.${ROOT} [data-element-id="assistant-activity-status"] {
      color: var(--kimi-muted) !important;
      font-size: 13px !important;
      line-height: 1.4;
    }

    /* Response typography and Markdown */
    html.${ROOT} [data-element-id="ai-response"] {
      max-width: 100% !important;
      color: var(--kimi-text) !important;
      background: transparent !important;
      font-size: 16px;
      line-height: 1.72;
      letter-spacing: -.003em;
    }
    html.${ROOT} [data-element-id="ai-response"] > :first-child { margin-top: 0 !important; }
    html.${ROOT} [data-element-id="ai-response"] > :last-child { margin-bottom: 0 !important; }
    html.${ROOT} [data-element-id="ai-response"] p {
      margin-top: .68em;
      margin-bottom: .68em;
    }
    html.${ROOT} [data-element-id="ai-response"] h1,
    html.${ROOT} [data-element-id="ai-response"] h2,
    html.${ROOT} [data-element-id="ai-response"] h3,
    html.${ROOT} [data-element-id="ai-response"] h4 {
      color: var(--kimi-text) !important;
      font-weight: 650 !important;
      line-height: 1.35;
      letter-spacing: -.02em;
    }
    html.${ROOT} [data-element-id="ai-response"] h1 { font-size: 1.6em; }
    html.${ROOT} [data-element-id="ai-response"] h2 { font-size: 1.34em; }
    html.${ROOT} [data-element-id="ai-response"] h3 { font-size: 1.16em; }
    html.${ROOT} [data-element-id="ai-response"] strong {
      color: var(--kimi-text) !important;
      font-weight: 650;
    }
    html.${ROOT} [data-element-id="ai-response"] a {
      color: var(--kimi-accent) !important;
      text-decoration: none;
      border-bottom: 1px solid color-mix(in srgb, var(--kimi-accent) 30%, transparent);
    }
    html.${ROOT} [data-element-id="ai-response"] a:hover { border-bottom-color: var(--kimi-accent); }
    html.${ROOT} [data-element-id="ai-response"] li::marker { color: var(--kimi-faint); }
    html.${ROOT} [data-element-id="ai-response"] blockquote {
      color: var(--kimi-muted) !important;
      background: var(--kimi-soft);
      border-left: 2px solid var(--kimi-border-strong) !important;
      border-radius: 0 10px 10px 0;
      padding: 9px 14px;
      font-style: normal;
    }
    html.${ROOT} [data-element-id="ai-response"] :not(pre) > code {
      color: var(--kimi-text) !important;
      background: var(--kimi-soft) !important;
      border: 1px solid var(--kimi-border);
      border-radius: 6px;
      padding: .12em .36em;
      font-size: .88em;
      font-weight: 450;
    }
    html.${ROOT} [data-element-id="ai-response"] :not(pre) > code::before,
    html.${ROOT} [data-element-id="ai-response"] :not(pre) > code::after { content: none !important; }
    html.${ROOT} [data-element-id="ai-response"] pre {
      color: var(--kimi-text) !important;
      background: var(--kimi-code) !important;
      border: 1px solid var(--kimi-border);
      border-radius: 13px;
      box-shadow: none;
      line-height: 1.6;
    }
    html.${ROOT} [data-element-id="ai-response"] pre code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: .88em;
    }
    /* TypingMind nests a highlighted pre inside the framed code block. */
    html.${ROOT} [data-element-id="ai-response"] pre > div > div:first-child {
      min-height: 34px;
      color: var(--kimi-muted) !important;
      background: var(--kimi-soft) !important;
      border-bottom: 1px solid var(--kimi-border);
    }
    html.${ROOT} [data-element-id="ai-response"] pre > div > div:first-child button {
      color: var(--kimi-muted) !important;
      background: transparent !important;
      border-radius: 7px !important;
    }
    html.${ROOT} [data-element-id="ai-response"] pre > div > div:first-child button:hover {
      color: var(--kimi-text) !important;
      background: var(--kimi-hover) !important;
    }
    html.${ROOT} [data-element-id="ai-response"] pre > div > div > pre {
      margin: 0 !important;
      padding: 14px 16px !important;
      color: var(--kimi-text) !important;
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    html.${ROOT} [data-element-id="ai-response"] pre > div > div > pre * {
      text-shadow: none !important;
    }
    html.${ROOT} [data-element-id="ai-response"] pre > div > div:last-child form button {
      color: var(--kimi-muted) !important;
      background: transparent !important;
      border-radius: 8px !important;
      box-shadow: none !important;
    }
    html.${ROOT} [data-element-id="ai-response"] pre > div > div:last-child form button:hover {
      color: var(--kimi-text) !important;
      background: var(--kimi-hover) !important;
    }
    html.${ROOT} [data-element-id="ai-response"] table {
      border: 1px solid var(--kimi-border);
      border-collapse: separate !important;
      border-spacing: 0;
      border-radius: 12px;
    }
    html.${ROOT} [data-element-id="ai-response"] th {
      color: var(--kimi-text) !important;
      background: var(--kimi-soft) !important;
      font-weight: 600;
    }
    html.${ROOT} [data-element-id="ai-response"] th,
    html.${ROOT} [data-element-id="ai-response"] td {
      border-color: var(--kimi-border) !important;
      padding: 9px 12px;
    }
    html.${ROOT} [data-element-id="ai-response"] img { border-radius: 13px; }
    html.${ROOT} [data-element-id="ai-response"] hr { border-color: var(--kimi-border) !important; }

    /* Supporting response UI */
    html.${ROOT} [data-element-id="thinking-block"],
    html.${ROOT} [data-element-id="websearch-calls-block"],
    html.${ROOT} [data-element-id="citations-block"] {
      color: var(--kimi-muted);
      border-color: var(--kimi-border) !important;
    }
    html.${ROOT} [data-element-id="thinking-block"] {
      background: var(--kimi-soft);
      border: 1px solid var(--kimi-border);
      border-radius: 12px;
    }
    html.${ROOT} [data-element-id="additional-actions-of-response-container"] {
      color: var(--kimi-muted);
      background: transparent;
      border: 0;
      border-radius: 9px;
      box-shadow: none;
    }
    html.${ROOT} [data-element-id="copy-message-button"],
    html.${ROOT} [data-element-id="edit-message-button"],
    html.${ROOT} [data-element-id="more-actions-menu-button"],
    html.${ROOT} [data-element-id="fork-chat-button"] {
      color: var(--kimi-muted) !important;
      border-radius: 8px !important;
    }
    html.${ROOT} [data-element-id="copy-message-button"]:hover,
    html.${ROOT} [data-element-id="edit-message-button"]:hover,
    html.${ROOT} [data-element-id="more-actions-menu-button"]:hover,
    html.${ROOT} [data-element-id="fork-chat-button"]:hover {
      color: var(--kimi-text) !important;
      background: var(--kimi-hover) !important;
    }

    /* Composer: style the real outer wrapper once, reset the inner wrapper. */
    html.${ROOT} [data-element-id="chat-space-end-part"] {
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: max(10px, env(safe-area-inset-bottom));
    }
    html.${ROOT} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) {
      box-sizing: border-box;
      color: var(--kimi-text);
      background: var(--kimi-surface) !important;
      border: 1px solid var(--kimi-border) !important;
      border-radius: 22px !important;
      outline: none !important;
      box-shadow: var(--kimi-shadow) !important;
      padding: 3px 5px 7px !important;
      margin-top: 0 !important;
      margin-bottom: 10px !important;
      overflow: visible;
    }
    html.${ROOT} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]):focus-within {
      border-color: var(--kimi-border-strong) !important;
      outline: none !important;
      box-shadow: var(--kimi-shadow) !important;
    }
    html.${ROOT} [data-element-id="message-input"],
    html.${ROOT} [data-element-id="input-row"],
    html.${ROOT} [data-element-id="chat-input-textbox-container"] {
      color: var(--kimi-text);
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      outline: none !important;
      box-shadow: none !important;
    }
    html.${ROOT} [data-element-id="chat-input-textbox-container"],
    html.${ROOT} [data-element-id="chat-input-textbox-container"].editing {
      padding: 0 !important;
      overflow: visible;
    }
    html.${ROOT} [data-element-id="chat-input-textbox"] {
      min-height: 44px !important;
      max-height: 240px !important;
      padding: 11px 12px 5px !important;
      color: var(--kimi-text) !important;
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      outline: none !important;
      box-shadow: none !important;
      font-size: 16px !important;
      line-height: 1.55 !important;
      caret-color: var(--kimi-text);
    }
    html.${ROOT} [data-element-id="chat-input-textbox"]:focus,
    html.${ROOT} [data-element-id="chat-input-textbox"]:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
    html.${ROOT} [data-element-id="chat-input-textbox"]::placeholder {
      color: var(--kimi-muted) !important;
      opacity: 1;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] {
      min-height: 38px;
      padding: 3px 5px 0 !important;
      background: transparent !important;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] .scroll-indicator-gradient::after {
      background: linear-gradient(90deg, transparent, var(--kimi-surface)) !important;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] button,
    html.${ROOT} [data-element-id="model-setting-button"],
    html.${ROOT} [data-element-id="output-settings-button"] {
      color: var(--kimi-muted) !important;
      border-radius: 9px !important;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] button:hover,
    html.${ROOT} [data-element-id="model-setting-button"]:hover,
    html.${ROOT} [data-element-id="output-settings-button"]:hover {
      color: var(--kimi-text) !important;
      background: var(--kimi-hover) !important;
    }

    /* Send supports text, icon, streaming, edit, disabled, and split-menu states. */
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="send-button"],
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"] {
      box-sizing: border-box;
      width: auto !important;
      min-width: 0 !important;
      height: 34px !important;
      min-height: 34px !important;
      padding: 0 11px !important;
      color: var(--kimi-bg) !important;
      background: var(--kimi-text) !important;
      border: 0 !important;
      border-radius: 9px !important;
      box-shadow: none !important;
      font-size: 13px !important;
      line-height: 1 !important;
      white-space: nowrap;
      opacity: 1;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"] {
      width: 32px !important;
      min-width: 32px !important;
      padding: 0 !important;
      margin-left: 2px;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="send-button"] *,
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"] * {
      color: inherit !important;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="send-button"]:hover,
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]:hover {
      color: var(--kimi-bg) !important;
      background: var(--kimi-text) !important;
      opacity: .82;
    }
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="send-button"]:disabled,
    html.${ROOT} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]:disabled {
      color: var(--kimi-muted) !important;
      background: var(--kimi-hover) !important;
      opacity: .8;
    }
    html.${ROOT} [data-element-id="new-chat-button"],
    html.${ROOT} [data-element-id="regenerate-button"] {
      color: var(--kimi-muted) !important;
      background: transparent !important;
      border: 0 !important;
      border-radius: 9px !important;
      box-shadow: none !important;
      font-weight: 500 !important;
    }
    html.${ROOT} [data-element-id="new-chat-button"]:hover,
    html.${ROOT} [data-element-id="regenerate-button"]:hover {
      color: var(--kimi-text) !important;
      background: var(--kimi-soft) !important;
    }
    html.${ROOT} [data-element-id="regenerate-button"]:disabled {
      color: var(--kimi-faint) !important;
      background: transparent !important;
      opacity: .65;
    }

    /* Popovers keep TypingMind's layout; only their surface is normalized. */
    html.${ROOT} [data-element-id="pop-up-modal"],
    html.${ROOT} [data-element-id="model-select-options"],
    html.${ROOT} [data-element-id="agent-select-options"] {
      color: var(--kimi-text);
      background: var(--kimi-surface) !important;
      border: 1px solid var(--kimi-border) !important;
      border-radius: 15px !important;
      box-shadow: var(--kimi-shadow) !important;
    }
    html.${ROOT} [data-element-id="model-select-button"],
    html.${ROOT} [data-element-id="agent-select-button"] { border-radius: 10px !important; }

    /* Accessible focus without drawing a second input border. */
    html.${ROOT} button:focus-visible,
    html.${ROOT} a:focus-visible,
    html.${ROOT} [role="button"]:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--kimi-accent) 70%, transparent) !important;
      outline-offset: 2px;
    }

    @media (max-width: 767px) {
      html.${ROOT} [data-element-id="response-block"] {
        padding-top: 15px !important;
        padding-bottom: 15px !important;
      }
      html.${ROOT} [data-element-id="ai-response"] {
        font-size: 15.5px;
        line-height: 1.68;
      }
      html.${ROOT} [data-element-id="user-message"] { max-width: 88% !important; }
      html.${ROOT} [data-element-id="chat-space-end-part"] {
        padding-left: 7px;
        padding-right: 7px;
        padding-bottom: max(7px, env(safe-area-inset-bottom));
      }
      html.${ROOT} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) {
        border-radius: 19px !important;
        margin-bottom: 7px !important;
      }
      html.${ROOT} [data-element-id="chat-input-textbox"] { font-size: 16px !important; }
    }
    @media (prefers-reduced-motion: reduce) {
      html.${ROOT} *, html.${ROOT} *::before, html.${ROOT} *::after {
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `;

  function enable() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.type = "text/css";
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }
    document.documentElement.classList.add(ROOT);
    document.documentElement.dataset.tmKimiVersion = VERSION;
    return true;
  }
  function disable() {
    document.documentElement.classList.remove(ROOT);
    delete document.documentElement.dataset.tmKimiVersion;
    return false;
  }
  function toggle() {
    return document.documentElement.classList.contains(ROOT) ? disable() : enable();
  }

  Object.defineProperty(window, "TypingMindKimiTheme", {
    configurable: true,
    value: Object.freeze({
      version: VERSION,
      enable,
      disable,
      toggle,
      isEnabled: () => document.documentElement.classList.contains(ROOT)
    })
  });

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.altKey && event.code === "KeyK") {
      event.preventDefault();
      toggle();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enable, { once: true });
  } else {
    enable();
  }
})();
