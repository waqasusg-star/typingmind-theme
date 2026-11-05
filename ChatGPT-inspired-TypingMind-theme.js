/*!
 * TypingMind — ChatGPT-inspired conversation theme
 * 2.0.0 · 6 November 2026 · Independent project
 * A fresh implementation for TypingMind's native block/absolute-avatar layout.
 * Appearance only. No chat/storage access, network calls, DOM reparenting,
 * scroll interception, application navigation styling, or browser zoom changes.
 * Ctrl/Cmd+Alt+G toggles. Requires a current browser supporting CSS @scope.
 */
(() => {
  'use strict';
  const version = '2.0.0';
  const apiName = 'TypingMindChatGPTTheme';
  const flag = 'tm-cg-v2';
  const styleId = 'tm-cg-v2-style';
  const previous = window[apiName];
  if (previous?.version === version) { previous.enable(); return; }
  if (previous) {
    if (typeof previous.destroy !== 'function') return;
    try { previous.destroy(); } catch { return; }
  }

  // Every presentation rule lives inside the chat canvas. Native UI portals
  // and nested menus/dialogs form explicit lower scope boundaries.
  const boundary = '[role="dialog"], [role="menu"], [role="listbox"], [data-element-id="pop-up-modal"], [data-element-id="model-select-options"], [data-element-id="agent-select-options"], [data-element-id="chat-space-beginning-part"]';
  const root = `html.${flag} [data-element-id="chat-space-background"]:not(:where([role="dialog"] *, [role="menu"] *, [role="listbox"] *))`;
  const css = String.raw`
@scope (${root}) to (${boundary}) {
  :scope {
    --tm2-lane: 768px;
    --tm2-gutter: 24px;
    --tm2-font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --tm2-ink: #171717;
    --tm2-muted: #6b6b6b;
    --tm2-canvas: #ffffff;
    --tm2-card: #ffffff;
    --tm2-bubble: #f4f4f4;
    --tm2-code: #f7f7f8;
    --tm2-line: #e5e5e5;
    --tm2-focus: #858585;
    --tm2-link: #2167ae;
    --tm2-button: #171717;
    --tm2-button-text: #ffffff;
  }
  :scope:is(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) {
    --tm2-ink: #ececec;
    --tm2-muted: #ababab;
    --tm2-canvas: #212121;
    --tm2-card: #303030;
    --tm2-bubble: #303030;
    --tm2-code: #282828;
    --tm2-line: #454545;
    --tm2-focus: #a0a0a0;
    --tm2-link: #92bfff;
    --tm2-button: #ececec;
    --tm2-button-text: #171717;
  }

  /* Both native outer gutters and both inner lanes use one set of dimensions. */
  [data-element-id="chat-space-middle-part"]:has([data-element-id="response-block"]) {
    background-color: var(--tm2-canvas) !important;
  }
  [data-element-id="chat-space-middle-part"] .dynamic-chat-content-container {
    padding-inline: var(--tm2-gutter) !important;
    padding-block: 8px 24px !important;
  }
  div:has(> div > [data-element-id="chat-space-end-part"]) {
    padding-inline: var(--tm2-gutter) !important;
  }
  [data-element-id="chat-space-middle-part"]:has([data-element-id="response-block"]) + div:has(> div > [data-element-id="chat-space-end-part"]) {
    background-color: var(--tm2-canvas) !important;
  }
  div:has(> [data-element-id="chat-space-end-part"]) {
    box-sizing: border-box !important;
    width: 100% !important;
    max-width: var(--tm2-lane) !important;
    margin-inline: auto !important;
    padding-top: 8px !important;
  }
  [data-element-id="chat-space-middle-part"] [data-element-id="response-block"] {
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: var(--tm2-lane) !important;
    margin-inline: auto !important;
    padding: 18px 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transition: none !important;
  }
  [data-element-id="response-block"]:not(.is-pinned):not(.cursor-pointer) {
    background: transparent !important;
  }
  [data-element-id="response-block"].cursor-pointer {
    padding-inline-start: 40px !important;
  }
  [data-element-id="response-block"] [data-element-id="chat-avatar-container"] {
    display: none !important;
  }
  [data-element-id="response-block"] > div[class~="w-full"] {
    width: 100% !important;
    min-width: 0 !important;
  }
  [data-element-id="response-block"]:has([data-element-id="user-message"]) > div[class~="w-full"] > div {
    align-items: flex-end !important;
    min-width: 0 !important;
  }
  [data-element-id="response-block"] [data-element-id="user-message"] {
    box-sizing: border-box !important;
    width: fit-content !important;
    max-width: 85% !important;
    margin-inline-start: auto !important;
    padding: 12px 18px !important;
    background: var(--tm2-bubble) !important;
    color: var(--tm2-ink) !important;
    border: 0 !important;
    border-radius: 24px !important;
    box-shadow: none !important;
    font: 400 16px/1.65 var(--tm2-font) !important;
    overflow-wrap: anywhere;
  }

  /* Native block wrappers remain blocks; all answer text starts at lane left. */
  [data-element-id="response-block"] [data-element-id="ai-response"] {
    min-width: 0 !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    color: var(--tm2-ink) !important;
    background: transparent !important;
    font: 400 16px/1.75 var(--tm2-font) !important;
    letter-spacing: normal !important;
    overflow-wrap: anywhere;
    overflow-x: auto;
  }
  [data-element-id="ai-response"] > :first-child { margin-top: 0 !important; }
  [data-element-id="ai-response"] > :last-child { margin-bottom: 0 !important; }
  [data-element-id="ai-response"] p { margin-block: 0 16px !important; }
  [data-element-id="ai-response"] :is(h1,h2,h3,h4) {
    color: var(--tm2-ink) !important;
    font-family: var(--tm2-font) !important;
    font-weight: 600 !important;
    line-height: 1.35 !important;
    margin-block: 28px 12px !important;
  }
  [data-element-id="ai-response"] h1 { font-size: 1.65em !important; }
  [data-element-id="ai-response"] h2 { font-size: 1.4em !important; }
  [data-element-id="ai-response"] h3 { font-size: 1.15em !important; }
  [data-element-id="ai-response"] h4 { font-size: 1em !important; }
  [data-element-id="ai-response"] strong { color: inherit !important; font-weight: 600 !important; }
  [data-element-id="ai-response"] a { color: var(--tm2-link) !important; text-underline-offset: 3px; }
  [data-element-id="ai-response"] :is(ul,ol) { margin-block: 0 16px !important; padding-inline-start: 26px !important; }
  [data-element-id="ai-response"] li { margin-block: 4px !important; padding-inline-start: 2px !important; }
  [data-element-id="ai-response"] li > p { margin-block: 0 8px !important; }
  [data-element-id="ai-response"] blockquote {
    border-inline-start: 3px solid var(--tm2-line) !important;
    padding-inline-start: 16px !important;
    margin: 20px 0 !important;
    color: var(--tm2-muted) !important;
    font-style: normal !important;
  }
  [data-element-id="ai-response"] hr { border-color: var(--tm2-line) !important; margin-block: 24px !important; }
  [data-element-id="ai-response"] code:not(pre code) {
    background: var(--tm2-bubble) !important;
    color: inherit !important;
    font-size: .875em !important;
    border-radius: 5px !important;
    padding: 2px 5px !important;
  }
  [data-element-id="ai-response"] code:not(pre code)::before,
  [data-element-id="ai-response"] code:not(pre code)::after { content: none !important; }
  [data-element-id="ai-response"] pre {
    box-sizing: border-box;
    max-width: 100%;
    background: var(--tm2-code) !important;
    border: 1px solid var(--tm2-line) !important;
    border-radius: 14px !important;
    padding: 16px !important;
    margin-block: 18px !important;
    overflow-x: auto;
    white-space: pre;
  }
  [data-element-id="ai-response"] pre code {
    font: 400 13px/1.65 ui-monospace, SFMono-Regular, Consolas, monospace !important;
  }
  [data-element-id="ai-response"] table {
    border-collapse: collapse !important;
    max-width: 100%;
    font-size: 14px !important;
    line-height: 1.6 !important;
    margin-block: 18px !important;
  }
  [data-element-id="ai-response"] :is(th,td) {
    padding: 10px 14px !important;
    border: 1px solid var(--tm2-line) !important;
    text-align: start;
    vertical-align: top;
  }
  [data-element-id="ai-response"] th { background: var(--tm2-bubble) !important; font-weight: 600 !important; }
  [data-element-id="ai-response"] :is(img,video) { max-width: 100%; height: auto; border-radius: 12px; }
  [data-element-id="response-block"] :is([data-element-id="thinking-block"],[data-element-id="assistant-activity-status"]) {
    margin: 8px 0 16px !important;
    padding-inline: 0 !important;
    background: transparent !important;
    border: 0 !important;
    color: var(--tm2-muted) !important;
    font: 400 14px/1.6 var(--tm2-font) !important;
  }
  /* Activity groups are separate native rows, outside response-block. */
  [data-element-id="chat-space-middle-part"] [data-activity-message-uuids] {
    box-sizing: border-box !important;
    width: 100% !important;
    max-width: var(--tm2-lane) !important;
    margin: 0 auto !important;
    padding: 4px 0 !important;
  }
  [data-activity-message-uuids] > div {
    max-width: 100% !important;
    margin-inline: 0 !important;
    padding-inline: 0 !important;
  }
  [data-activity-message-uuids] [data-element-id="chat-avatar-container"] {
    display: none !important;
  }
  [data-activity-message-uuids] [data-element-id="assistant-activity-status"] {
    height: auto !important;
    min-height: 36px !important;
    margin: 0 !important;
    padding: 0 !important;
    color: var(--tm2-muted) !important;
    font: 400 14px/1.6 var(--tm2-font) !important;
  }

  /* Toolbar and card share the parent lane. Native toolbar controls stay put. */
  div:has(> [data-element-id="chat-space-end-part"]) > div:not([data-element-id="chat-space-end-part"]) {
    font-family: var(--tm2-font) !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
  }
  div:has(> [data-element-id="chat-space-end-part"]) > div:not([data-element-id="chat-space-end-part"]) button {
    color: var(--tm2-ink) !important;
    background: transparent !important;
    border-radius: 8px !important;
    font: inherit !important;
  }
  div:has(> [data-element-id="chat-space-end-part"]) > div:not([data-element-id="chat-space-end-part"]) button:hover {
    background: var(--tm2-bubble) !important;
  }
  [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) {
    box-sizing: border-box !important;
    width: 100% !important;
    margin: 0 0 16px !important;
    padding: 4px 8px 8px !important;
    border: 1px solid var(--tm2-line) !important;
    border-radius: 28px !important;
    background: var(--tm2-card) !important;
    box-shadow: 0 2px 12px #00000006 !important;
    transition: border-color .15s ease !important;
  }
  [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]):focus-within {
    border-color: var(--tm2-focus) !important;
  }
  [data-element-id="chat-space-end-part"] :is([data-element-id="message-input"],[data-element-id="input-row"],[data-element-id="chat-input-textbox-container"]) {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }
  [data-element-id="chat-space-end-part"] [data-element-id="chat-input-textbox"] {
    box-sizing: border-box !important;
    width: 100% !important;
    min-height: 48px !important;
    padding: 12px 12px 8px !important;
    background: transparent !important;
    color: var(--tm2-ink) !important;
    caret-color: var(--tm2-ink);
    font: 400 16px/1.6 var(--tm2-font) !important;
    border: 0 !important;
    border-radius: 0 !important;
    outline: none !important;
    box-shadow: none !important;
  }
  [data-element-id="chat-space-end-part"] [data-element-id="chat-input-textbox"]::placeholder {
    color: var(--tm2-muted) !important;
    opacity: 1;
  }
  [data-element-id="chat-input-actions"] { padding: 2px 0 0 !important; }
  [data-element-id="chat-input-actions"] button {
    color: var(--tm2-muted) !important;
    border-radius: 50% !important;
  }
  [data-element-id="chat-input-actions"] button:hover { background: var(--tm2-bubble) !important; color: var(--tm2-ink) !important; }
  [data-element-id="chat-input-actions"] button:is([aria-pressed="true"],[data-active="true"]) {
    background: var(--tm2-bubble) !important;
    color: var(--tm2-ink) !important;
  }
  [data-element-id="chat-input-actions"] [data-element-id="send-button"] {
    background: var(--tm2-button) !important;
    color: var(--tm2-button-text) !important;
    border-radius: 999px !important;
  }
  [data-element-id="chat-input-actions"] button:disabled { opacity: .4 !important; }
  :is([data-element-id="response-block"],[data-element-id="chat-space-end-part"]) :is(button,a):focus-visible {
    outline: 2px solid var(--tm2-focus) !important;
    outline-offset: 3px !important;
  }
  @media (max-width: 640px) {
    :scope { --tm2-gutter: 16px; }
    [data-element-id="response-block"] [data-element-id="user-message"] { max-width: 92% !important; padding: 10px 15px !important; }
    [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) { margin-bottom: 8px !important; border-radius: 24px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-element-id="chat-space-end-part"] > div:has([data-element-id="message-input"]) { transition: none !important; }
  }
}
`;
  let disposed = false;
  function enable() {
    if (disposed) return false;
    let sheet = document.getElementById(styleId);
    if (!sheet) { sheet = document.createElement('style'); sheet.id = styleId; (document.head || document.documentElement).append(sheet); }
    if (sheet.textContent !== css) sheet.textContent = css;
    document.documentElement.classList.add(flag);
    document.documentElement.dataset.tmChatgptThemeVersion = version;
    return true;
  }
  function disable() {
    if (disposed) return false;
    document.documentElement.classList.remove(flag);
    delete document.documentElement.dataset.tmChatgptThemeVersion;
    return false;
  }
  function toggle() { return isEnabled() ? disable() : enable(); }
  function isEnabled() { return !disposed && document.documentElement.classList.contains(flag); }
  function keydown(e) {
    if (e.defaultPrevented || e.isComposing || e.repeat || e.shiftKey || e.getModifierState?.('AltGraph')) return;
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.code === 'KeyG') { e.preventDefault(); toggle(); }
  }
  function destroy() {
    if (disposed) return;
    disable(); disposed = true;
    document.removeEventListener('keydown', keydown);
    document.getElementById(styleId)?.remove();
    if (window[apiName] === api) delete window[apiName];
  }
  const api = Object.freeze({version, enable, disable, toggle, isEnabled, destroy});
  Object.defineProperty(window, apiName, {value: api, configurable: true});
  document.addEventListener('keydown', keydown);
  enable();
})();
