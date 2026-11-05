/*!
 * ChatGPT-inspired UI for TypingMind
 * Version: 1.3.0 | 2026-11-06
 *
 * Independent visual theme. Not affiliated with or endorsed by OpenAI or TypingMind.
 * Changes appearance only: does not read chats, API keys, prompts, or account data;
 * does not send network requests or create persistent storage.
 *
 * Shortcut: Ctrl/Cmd + Alt + G (toggle)
 * Console API: window.TypingMindChatGPTTheme.{enable,disable,toggle,destroy,isEnabled}
 *
 * Please uninstall/disable other TypingMind appearance extensions to avoid CSS
 * conflicts. This script disables the older TypingMindKimiTheme when enabled.
 */
(() => {
  'use strict';

  const VERSION = '1.3.0';
  const CLASS_NAME = 'tm-chatgpt-ui';
  const STYLE_ID = 'tm-chatgpt-ui-styles';
  const API_NAME = 'TypingMindChatGPTTheme';

  // A version update should replace the old CSS and its listener in-place.
  // Re-evaluating the same version must not attach duplicate listeners.
  if (window[API_NAME]) {
    if (window[API_NAME].version === VERSION) {
      if (typeof window[API_NAME].enable === 'function') window[API_NAME].enable();
      return;
    }
    if (typeof window[API_NAME].destroy === 'function') {
      try { window[API_NAME].destroy(); } catch (_) { /* Continue safely. */ }
    } else {
      // Preserve functional older themes rather than layering unknown styles.
      return;
    }
  }

  // CSS applies ONLY while the theme class is present on <html>.
  // Explicit [data-element-id] selectors come from the known TypingMind UI.
  // Deliberately avoid setting position, overflow, or height on app scroll roots.
  const css = String.raw`
/* ===========================================================
   01 — Design tokens: quiet neutrals, comfortable readability
   =========================================================== */
html.${CLASS_NAME} {
  --cg-page: #ffffff;
  --cg-sidebar: #f9f9f9;
  --cg-surface: #ffffff;
  --cg-panel: #ffffff;
  --cg-wash: #f5f5f5;
  --cg-hover: #ededed;
  --cg-active: #eaeaea;
  --cg-user: #f4f4f4;
  --cg-code: #f7f7f8;
  --cg-code-head: #f0f0f0;
  --cg-text: #0d0d0d;
  --cg-secondary: #5f5f5f;
  --cg-tertiary: #838383;
  --cg-stroke: #e6e6e6;
  --cg-stroke-strong: #cdcdcd;
  --cg-link: #126dc1;
  --cg-selection: #dbeafe;
  --cg-send: #0d0d0d;
  --cg-send-text: #ffffff;
  --cg-shadow: 0 2px 14px rgba(0, 0, 0, .055);
  --cg-pop-shadow: 0 9px 32px rgba(0, 0, 0, .12);
  --cg-font: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
             "Helvetica Neue", Helvetica, Arial, sans-serif;
  color-scheme: light;
}
html.dark.${CLASS_NAME},
html.${CLASS_NAME}[data-theme="dark"] {
  --cg-page: #212121;
  --cg-sidebar: #171717;
  --cg-surface: #303030;
  --cg-panel: #2b2b2b;
  --cg-wash: #292929;
  --cg-hover: #2b2b2b;
  --cg-active: #343434;
  --cg-user: #303030;
  --cg-code: #282828;
  --cg-code-head: #333333;
  --cg-text: #f4f4f4;
  --cg-secondary: #b4b4b4;
  --cg-tertiary: #959595;
  --cg-stroke: #414141;
  --cg-stroke-strong: #626262;
  --cg-link: #8abcfb;
  --cg-selection: #2d4662;
  --cg-send: #f4f4f4;
  --cg-send-text: #151515;
  --cg-shadow: 0 2px 16px rgba(0, 0, 0, .12);
  --cg-pop-shadow: 0 12px 36px rgba(0, 0, 0, .33);
  color-scheme: dark;
}
html.${CLASS_NAME}, html.${CLASS_NAME} body {
  background: var(--cg-page) !important;
  color: var(--cg-text);
  font-family: var(--cg-font);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
html.${CLASS_NAME} ::selection { background: var(--cg-selection); color: var(--cg-text); }

/* ===========================================================
   02 — Application canvas, top bar and navigation
   =========================================================== */
html.${CLASS_NAME} [data-element-id="main-content-area"],
html.${CLASS_NAME} [data-element-id="chat-space-background"],
html.${CLASS_NAME} [data-element-id="chat-space-middle-part"],
html.${CLASS_NAME} [data-element-id="chat-space-end-part"] {
  background: var(--cg-page) !important;
  color: var(--cg-text);
}
html.${CLASS_NAME} [data-element-id="chat-space-beginning-part"] {
  background: var(--cg-page) !important;
  color: var(--cg-text);
  border-bottom: 1px solid transparent !important;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="current-chat-title"],
html.${CLASS_NAME} [data-element-id="model-name"] {
  color: var(--cg-text) !important;
  font-weight: 600 !important;
  letter-spacing: -.018em;
}

/* ===========================================================
   03 — Chat history sidebar: subtle hover, clear active row
   =========================================================== */
html.${CLASS_NAME} [data-element-id="workspace-bar"],
html.${CLASS_NAME} [data-element-id="nav-sidebar-container"],
html.${CLASS_NAME} [data-element-id="side-bar-background"],
html.${CLASS_NAME} [data-element-id="sidebar-beginning-part"],
html.${CLASS_NAME} [data-element-id="sidebar-middle-part"],
html.${CLASS_NAME} [data-element-id="side-bar-footer"] {
  background: var(--cg-sidebar) !important;
  color: var(--cg-secondary) !important;
  border-color: transparent !important;
}
html.${CLASS_NAME} [data-element-id="nav-sidebar-container"] button,
html.${CLASS_NAME} [data-element-id="nav-sidebar-container"] a,
html.${CLASS_NAME} [data-element-id="side-bar-footer"] button,
html.${CLASS_NAME} [data-element-id="workspace-bar"] button {
  border-radius: 10px !important;
  color: var(--cg-secondary) !important;
  transition: background-color .12s ease, color .12s ease;
}
html.${CLASS_NAME} [data-element-id="nav-sidebar-container"] button:hover,
html.${CLASS_NAME} [data-element-id="nav-sidebar-container"] a:hover,
html.${CLASS_NAME} [data-element-id="side-bar-footer"] button:hover,
html.${CLASS_NAME} [data-element-id="workspace-bar"] button:hover {
  background: var(--cg-hover) !important;
  color: var(--cg-text) !important;
}
html.${CLASS_NAME} [data-element-id="new-chat-button-in-side-bar"] {
  color: var(--cg-text) !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  font-weight: 600 !important;
}
html.${CLASS_NAME} [data-element-id="new-chat-button-in-side-bar"] * { color: inherit !important; }
html.${CLASS_NAME} [data-element-id="new-chat-button-in-side-bar"]:hover {
  background: var(--cg-hover) !important;
}
html.${CLASS_NAME} [data-element-id="search-chats-bar"] {
  background: transparent !important;
  color: var(--cg-secondary) !important;
  border-color: transparent !important;
  border-radius: 10px !important;
}
html.${CLASS_NAME} [data-element-id="search-chats-bar"]:focus-within {
  background: var(--cg-surface) !important;
  border-color: var(--cg-stroke-strong) !important;
}
html.${CLASS_NAME} [data-element-id="custom-chat-item"],
html.${CLASS_NAME} [data-element-id="selected-chat-item"] {
  border-radius: 10px !important;
  border-color: transparent !important;
}
html.${CLASS_NAME} [data-element-id="custom-chat-item"]:hover {
  background: var(--cg-hover) !important;
}
html.${CLASS_NAME} [data-element-id="selected-chat-item"] {
  background: var(--cg-active) !important;
  color: var(--cg-text) !important;
  font-weight: 500;
}
html.${CLASS_NAME} [data-element-id="selected-chat-item"] * {
  color: var(--cg-text) !important;
}

/* ===========================================================
   04 — Message lane: centered, spacious and uncluttered
   =========================================================== */
html.${CLASS_NAME} [data-element-id="response-block"] {
  box-sizing: border-box;
  /* Allow messages to use the available chat area without forced zoom. */
  max-width: none !important;
  width: calc(100% - 64px) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-top: 18px !important;
  padding-bottom: 19px !important;
  background: transparent !important;
  color: var(--cg-text);
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="response-block"]:hover {
  background: transparent !important;
}
html.${CLASS_NAME} [data-element-id="response-block"][data-message-role="user"] {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
html.${CLASS_NAME} [data-element-id="chat-avatar-container"] {
  background: var(--cg-surface) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 50% !important;
  width: 30px;
  height: 30px;
  overflow: hidden;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="chat-avatar-container"] img {
  border-radius: 50% !important;
}
html.${CLASS_NAME} [data-element-id="user-message"] {
  box-sizing: border-box;
  display: block;
  width: fit-content !important;
  max-width: min(88%, 1180px) !important;
  margin-left: auto !important;
  padding: 11px 17px !important;
  background: var(--cg-user) !important;
  color: var(--cg-text) !important;
  border: 0 !important;
  border-radius: 21px !important;
  box-shadow: none !important;
  font-size: 15.5px !important;
  line-height: 1.58 !important;
  overflow-wrap: anywhere;
}
html.${CLASS_NAME} [data-element-id="user-message"] * {
  color: inherit !important;
}
html.${CLASS_NAME} [data-element-id="assistant-activity-status"] {
  color: var(--cg-tertiary) !important;
  font-size: 13px;
}

/* ===========================================================
   05 — Markdown reading: typography, tables, quotes and links
   =========================================================== */
html.${CLASS_NAME} [data-element-id="ai-response"] {
  max-width: 100% !important;
  background: transparent !important;
  color: var(--cg-text) !important;
  font-family: var(--cg-font);
  font-size: 16px;
  line-height: 1.76;
  letter-spacing: -.008em;
  overflow-wrap: break-word;
}
html.${CLASS_NAME} [data-element-id="ai-response"] > :first-child { margin-top: 0 !important; }
html.${CLASS_NAME} [data-element-id="ai-response"] > :last-child { margin-bottom: 0 !important; }
html.${CLASS_NAME} [data-element-id="ai-response"] p { margin: .7em 0; }
html.${CLASS_NAME} [data-element-id="ai-response"] h1,
html.${CLASS_NAME} [data-element-id="ai-response"] h2,
html.${CLASS_NAME} [data-element-id="ai-response"] h3,
html.${CLASS_NAME} [data-element-id="ai-response"] h4 {
  color: var(--cg-text) !important;
  font-weight: 650 !important;
  letter-spacing: -.025em;
  line-height: 1.35;
  scroll-margin-top: 64px;
}
html.${CLASS_NAME} [data-element-id="ai-response"] h1 { font-size: 1.7em; margin: 1.2em 0 .55em; }
html.${CLASS_NAME} [data-element-id="ai-response"] h2 { font-size: 1.35em; margin: 1.2em 0 .5em; }
html.${CLASS_NAME} [data-element-id="ai-response"] h3 { font-size: 1.14em; margin: 1.1em 0 .45em; }
html.${CLASS_NAME} [data-element-id="ai-response"] h4 { font-size: 1.02em; margin: 1em 0 .35em; }
html.${CLASS_NAME} [data-element-id="ai-response"] strong {
  color: var(--cg-text) !important;
  font-weight: 650;
}
html.${CLASS_NAME} [data-element-id="ai-response"] a {
  color: var(--cg-link) !important;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}
html.${CLASS_NAME} [data-element-id="ai-response"] ul,
html.${CLASS_NAME} [data-element-id="ai-response"] ol {
  margin: .65em 0 1em;
  padding-left: 1.55em;
}
html.${CLASS_NAME} [data-element-id="ai-response"] li { margin: .22em 0; padding-left: .16em; }
html.${CLASS_NAME} [data-element-id="ai-response"] li::marker { color: var(--cg-secondary); }
html.${CLASS_NAME} [data-element-id="ai-response"] blockquote {
  margin: 1em 0;
  color: var(--cg-secondary) !important;
  background: transparent !important;
  border-left: 3px solid var(--cg-stroke-strong) !important;
  border-radius: 0 !important;
  padding: 2px 0 2px 16px !important;
  font-style: normal;
}
html.${CLASS_NAME} [data-element-id="ai-response"] hr {
  margin: 1.65em 0;
  border-color: var(--cg-stroke) !important;
}
html.${CLASS_NAME} [data-element-id="ai-response"] :not(pre) > code {
  padding: .14em .35em;
  background: var(--cg-wash) !important;
  color: var(--cg-text) !important;
  border-radius: 6px;
  border: 1px solid var(--cg-stroke);
  font-size: .89em;
  font-weight: 450;
}
html.${CLASS_NAME} [data-element-id="ai-response"] :not(pre) > code::before,
html.${CLASS_NAME} [data-element-id="ai-response"] :not(pre) > code::after { content: none !important; }
html.${CLASS_NAME} [data-element-id="ai-response"] pre {
  max-width: 100%;
  background: var(--cg-code) !important;
  color: var(--cg-text) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 13px !important;
  line-height: 1.6;
  box-shadow: none !important;
  overflow-x: auto;
}
html.${CLASS_NAME} [data-element-id="ai-response"] pre code {
  font-family: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: .875em;
}
/* Preserve native syntax-highlighting colors and TypingMind's code-copy controls. */
html.${CLASS_NAME} [data-element-id="ai-response"] pre > div > div:first-child {
  background: var(--cg-code-head) !important;
  color: var(--cg-secondary) !important;
  min-height: 36px;
  border-bottom: 1px solid var(--cg-stroke);
}
html.${CLASS_NAME} [data-element-id="ai-response"] pre > div > div:first-child button {
  background: transparent !important;
  color: var(--cg-secondary) !important;
  border-radius: 8px !important;
}
html.${CLASS_NAME} [data-element-id="ai-response"] pre > div > div:first-child button:hover {
  background: var(--cg-hover) !important;
  color: var(--cg-text) !important;
}
html.${CLASS_NAME} [data-element-id="ai-response"] pre > div > div > pre {
  margin: 0 !important;
  padding: 15px 17px !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="ai-response"] table {
  border: 1px solid var(--cg-stroke) !important;
  border-collapse: separate !important;
  border-spacing: 0;
  border-radius: 12px;
  max-width: 100%;
  /* Never hide long cells or interactive table content. */
  overflow: visible;
  font-size: .94em;
}
html.${CLASS_NAME} [data-element-id="ai-response"] th {
  background: var(--cg-wash) !important;
  color: var(--cg-text) !important;
  font-weight: 600;
}
html.${CLASS_NAME} [data-element-id="ai-response"] td,
html.${CLASS_NAME} [data-element-id="ai-response"] th {
  padding: 9px 12px !important;
  border-color: var(--cg-stroke) !important;
  vertical-align: top;
}
html.${CLASS_NAME} [data-element-id="ai-response"] tr:nth-child(even) td {
  background: color-mix(in srgb, var(--cg-wash) 30%, transparent);
}
html.${CLASS_NAME} [data-element-id="ai-response"] img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

/* ===========================================================
   06 — Response actions, thinking, sources and results
   =========================================================== */
html.${CLASS_NAME} [data-element-id="thinking-block"],
html.${CLASS_NAME} [data-element-id="websearch-calls-block"],
html.${CLASS_NAME} [data-element-id="citations-block"] {
  color: var(--cg-secondary) !important;
  border-color: var(--cg-stroke) !important;
}
html.${CLASS_NAME} [data-element-id="thinking-block"] {
  background: var(--cg-wash) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 12px !important;
}
html.${CLASS_NAME} [data-element-id="additional-actions-of-response-container"] {
  background: transparent !important;
  color: var(--cg-tertiary) !important;
  border: 0 !important;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="copy-message-button"],
html.${CLASS_NAME} [data-element-id="edit-message-button"],
html.${CLASS_NAME} [data-element-id="more-actions-menu-button"],
html.${CLASS_NAME} [data-element-id="fork-chat-button"] {
  color: var(--cg-secondary) !important;
  background: transparent !important;
  border-radius: 9px !important;
}
html.${CLASS_NAME} [data-element-id="copy-message-button"]:hover,
html.${CLASS_NAME} [data-element-id="edit-message-button"]:hover,
html.${CLASS_NAME} [data-element-id="more-actions-menu-button"]:hover,
html.${CLASS_NAME} [data-element-id="fork-chat-button"]:hover {
  color: var(--cg-text) !important;
  background: var(--cg-hover) !important;
}

/* ===========================================================
   07 — Composer: floating rounded input, native controls intact
   =========================================================== */
html.${CLASS_NAME} [data-element-id="chat-space-end-part"] {
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
html.${CLASS_NAME} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) {
  box-sizing: border-box;
  /* Keep the composer aligned with the newly expanded conversation lane. */
  width: calc(100% - 64px) !important;
  max-width: none !important;
  margin-left: auto !important;
  margin-right: auto !important;
  margin-top: 0 !important;
  margin-bottom: 10px !important;
  padding: 3px 7px 7px !important;
  background: var(--cg-surface) !important;
  color: var(--cg-text);
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 27px !important;
  box-shadow: var(--cg-shadow) !important;
  outline: 0 !important;
  overflow: visible;
  transition: border-color .12s ease, box-shadow .12s ease;
}
html.${CLASS_NAME} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]):focus-within {
  border-color: var(--cg-stroke-strong) !important;
  box-shadow: var(--cg-shadow) !important;
}
html.${CLASS_NAME} [data-element-id="message-input"],
html.${CLASS_NAME} [data-element-id="input-row"],
html.${CLASS_NAME} [data-element-id="chat-input-textbox-container"] {
  background: transparent !important;
  color: var(--cg-text);
  border: 0 !important;
  border-radius: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="chat-input-textbox-container"],
html.${CLASS_NAME} [data-element-id="chat-input-textbox-container"].editing {
  padding: 0 !important;
  overflow: visible;
}
html.${CLASS_NAME} [data-element-id="chat-input-textbox"] {
  min-height: 48px !important;
  max-height: 260px !important;
  padding: 13px 13px 6px !important;
  background: transparent !important;
  color: var(--cg-text) !important;
  border: 0 !important;
  border-radius: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  font-family: var(--cg-font);
  font-size: 16px !important;
  line-height: 1.55 !important;
  caret-color: var(--cg-text);
}
html.${CLASS_NAME} [data-element-id="chat-input-textbox"]:focus,
html.${CLASS_NAME} [data-element-id="chat-input-textbox"]:focus-visible {
  outline: 0 !important;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="chat-input-textbox"]::placeholder {
  color: var(--cg-tertiary) !important;
  opacity: 1;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] {
  background: transparent !important;
  min-height: 39px;
  padding: 3px 5px 0 !important;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] .scroll-indicator-gradient::after {
  background: linear-gradient(90deg, transparent, var(--cg-surface)) !important;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] button,
html.${CLASS_NAME} [data-element-id="model-setting-button"],
html.${CLASS_NAME} [data-element-id="output-settings-button"] {
  color: var(--cg-secondary) !important;
  border-radius: 999px !important;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] button:hover,
html.${CLASS_NAME} [data-element-id="model-setting-button"]:hover,
html.${CLASS_NAME} [data-element-id="output-settings-button"]:hover {
  color: var(--cg-text) !important;
  background: var(--cg-hover) !important;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="send-button"],
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"] {
  box-sizing: border-box;
  min-width: 36px !important;
  height: 36px !important;
  min-height: 36px !important;
  padding: 0 10px !important;
  background: var(--cg-send) !important;
  color: var(--cg-send-text) !important;
  border: 0 !important;
  border-radius: 999px !important;
  box-shadow: none !important;
  font-size: 13px !important;
  line-height: 1 !important;
  white-space: nowrap;
  opacity: 1;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"] {
  min-width: 34px !important;
  width: 34px !important;
  padding: 0 !important;
  margin-left: 2px;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="send-button"] *,
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"] * {
  color: inherit !important;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="send-button"]:hover,
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]:hover {
  background: var(--cg-send) !important;
  color: var(--cg-send-text) !important;
  opacity: .83;
}
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="send-button"]:disabled,
html.${CLASS_NAME} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]:disabled {
  background: var(--cg-hover) !important;
  color: var(--cg-tertiary) !important;
  opacity: .75;
}
html.${CLASS_NAME} [data-element-id="new-chat-button"],
html.${CLASS_NAME} [data-element-id="regenerate-button"] {
  background: transparent !important;
  color: var(--cg-secondary) !important;
  border: 0 !important;
  border-radius: 999px !important;
  box-shadow: none !important;
}
html.${CLASS_NAME} [data-element-id="new-chat-button"]:hover,
html.${CLASS_NAME} [data-element-id="regenerate-button"]:hover {
  background: var(--cg-hover) !important;
  color: var(--cg-text) !important;
}

/* ===========================================================
   08 — Popovers, menus and dialogs: surfaces only, no reflow
   =========================================================== */
html.${CLASS_NAME} [data-element-id="pop-up-modal"],
html.${CLASS_NAME} [data-element-id="model-select-options"],
html.${CLASS_NAME} [data-element-id="agent-select-options"] {
  background: var(--cg-panel) !important;
  color: var(--cg-text) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 16px !important;
  box-shadow: var(--cg-pop-shadow) !important;
}
html.${CLASS_NAME} [data-element-id="model-select-button"],
html.${CLASS_NAME} [data-element-id="agent-select-button"] {
  border-radius: 11px !important;
}
html.${CLASS_NAME} button:focus-visible,
html.${CLASS_NAME} a:focus-visible,
html.${CLASS_NAME} [role="button"]:focus-visible,
html.${CLASS_NAME} [role="menuitem"]:focus-visible {
  outline: 2px solid var(--cg-link) !important;
  outline-offset: 2px;
}

/* ===========================================================
   09 — Native 100% layout (no theme-based zoom)
   =========================================================== */
/* Deliberately do not override CSS zoom, transform scale, html/body
   width/height, or viewport units. Chromium and TypingMind keep their
   normal viewport sizing and app-owned scroll behavior. */

/* ===========================================================
   10 — Responsive and accessibility settings
   =========================================================== */
@media (max-width: 950px) {
  html.${CLASS_NAME} [data-element-id="response-block"] {
    max-width: none !important;
    width: calc(100% - 24px) !important;
  }
  html.${CLASS_NAME} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) {
    max-width: none !important;
    width: calc(100% - 16px) !important;
  }
}
@media (max-width: 767px) {
  html.${CLASS_NAME} [data-element-id="response-block"] {
    padding-top: 14px !important;
    padding-bottom: 14px !important;
  }
  html.${CLASS_NAME} [data-element-id="ai-response"] { font-size: 15.5px; line-height: 1.7; }
  html.${CLASS_NAME} [data-element-id="user-message"] {
    max-width: 88% !important;
    padding: 10px 14px !important;
    font-size: 15px !important;
  }
  html.${CLASS_NAME} [data-element-id="chat-space-end-part"] {
    padding-left: 7px;
    padding-right: 7px;
    padding-bottom: max(7px, env(safe-area-inset-bottom));
  }
  html.${CLASS_NAME} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) {
    border-radius: 23px !important;
    margin-bottom: 5px !important;
  }
  html.${CLASS_NAME} [data-element-id="chat-input-textbox"] { font-size: 16px !important; }
}
@media (prefers-reduced-motion: reduce) {
  html.${CLASS_NAME} [data-element-id="nav-sidebar-container"] button,
  html.${CLASS_NAME} [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) {
    transition: none !important;
  }
}
`;

  function ensureStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.type = 'text/css';
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }
    return style;
  }

  function enable() {
    ensureStyle();
    // A known previous theme uses a separate root class. Disable it without
    // touching its extension installation or user data.
    try {
      if (window.TypingMindKimiTheme &&
          typeof window.TypingMindKimiTheme.disable === 'function') {
        window.TypingMindKimiTheme.disable();
      }
    } catch (_) { /* A visual theme must never interrupt TypingMind. */ }
    document.documentElement.classList.remove('tm-kimi-ui');
    document.documentElement.classList.add(CLASS_NAME);
    document.documentElement.dataset.tmChatgptThemeVersion = VERSION;
    return true;
  }

  function disable() {
    document.documentElement.classList.remove(CLASS_NAME);
    delete document.documentElement.dataset.tmChatgptThemeVersion;
    return false;
  }

  function toggle() {
    return document.documentElement.classList.contains(CLASS_NAME) ? disable() : enable();
  }

  function onKeyDown(event) {
    if (!event.repeat && (event.ctrlKey || event.metaKey) && event.altKey &&
        !event.shiftKey && event.code === 'KeyG') {
      event.preventDefault();
      toggle();
    }
  }

  function destroy() {
    disable();
    document.removeEventListener('keydown', onKeyDown);
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    try { delete window[API_NAME]; } catch (_) { /* ignore locked globals */ }
  }

  Object.defineProperty(window, API_NAME, {
    configurable: true,
    enumerable: false,
    value: Object.freeze({
      version: VERSION,
      enable,
      disable,
      toggle,
      destroy,
      isEnabled: () => document.documentElement.classList.contains(CLASS_NAME)
    })
  });

  document.addEventListener('keydown', onKeyDown);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enable, { once: true });
  } else {
    enable();
  }
})();
