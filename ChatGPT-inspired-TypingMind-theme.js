/*!
 * TypingMind — ChatGPT-inspired typography and tables only
 * 3.0.0 · 6 November 2026 · Independent project
 * Changes only chat font family, font size, font weight and Markdown table design.
 * Default layout, alignment, icons, bubbles, colors outside tables, spacing,
 * composer structure, scrolling and browser zoom remain native.
 * No chat/storage access or network calls. Ctrl/Cmd+Alt+G toggles.
 */
(() => {
  'use strict';
  const version = '3.0.0';
  const apiName = 'TypingMindChatGPTTheme';
  const flag = 'tm-cg-type';
  const styleId = 'tm-cg-type-style';
  const previous = window[apiName];
  if (previous?.version === version) { previous.enable(); return; }
  if (previous) {
    if (typeof previous.destroy !== 'function') return;
    try { previous.destroy(); } catch { return; }
  }

  const root = `html.${flag} [data-element-id="chat-space-background"]:not(:where([role="dialog"] *, [role="menu"] *, [role="listbox"] *))`;
  const boundary = '[role="dialog"], [role="menu"], [role="listbox"], [data-element-id="pop-up-modal"], [data-element-id="model-select-options"], [data-element-id="agent-select-options"], [data-element-id="chat-space-beginning-part"]';
  const css = String.raw`
@scope (${root}) to (${boundary}) {
  [data-element-id="response-block"] :is([data-element-id="ai-response"], [data-element-id="user-message"]),
  [data-element-id="chat-space-end-part"] [data-element-id="chat-input-textbox"] {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    font-size: 16px !important;
    font-weight: 400 !important;
  }
  [data-element-id="response-block"] :is([data-element-id="ai-response"], [data-element-id="user-message"]) :is(strong,b) {
    font-weight: 600 !important;
  }
  [data-element-id="ai-response"] :is(h1,h2,h3,h4,h5,h6) {
    font-family: inherit !important;
    font-weight: 600 !important;
  }
  [data-element-id="ai-response"] h1 { font-size: 24px !important; }
  [data-element-id="ai-response"] h2 { font-size: 20px !important; }
  [data-element-id="ai-response"] h3 { font-size: 18px !important; }
  [data-element-id="ai-response"] :is(h4,h5,h6) { font-size: 16px !important; }
  [data-element-id="ai-response"] :is(pre,code) {
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace !important;
  }
  [data-element-id="ai-response"] code { font-size: 14px !important; }

  /* All non-typographic decoration is limited to Markdown tables. */
  [data-element-id="ai-response"] table {
    --cg-table-line: #dedede;
    --cg-table-head: #f7f7f7;
    font-family: inherit !important;
    font-size: 15px !important;
    border-collapse: collapse !important;
    border-spacing: 0 !important;
    border: 0 !important;
  }
  :scope:is(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) [data-element-id="ai-response"] table {
    --cg-table-line: #454545;
    --cg-table-head: #303030;
  }
  [data-element-id="ai-response"] table :is(th,td) {
    font-family: inherit !important;
    font-size: inherit !important;
    border: 0 !important;
    border-bottom: 1px solid var(--cg-table-line) !important;
    padding: 10px 12px !important;
  }
  [data-element-id="ai-response"] table th {
    font-weight: 600 !important;
    background-color: var(--cg-table-head) !important;
    color: inherit !important;
  }
  [data-element-id="ai-response"] table td {
    font-weight: 400 !important;
    background-color: transparent !important;
  }
}
`;

  let disposed = false;
  function enable() {
    if (disposed) return false;
    let sheet = document.getElementById(styleId);
    if (!sheet) {
      sheet = document.createElement('style');
      sheet.id = styleId;
      (document.head || document.documentElement).append(sheet);
    }
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
  function isEnabled() { return !disposed && document.documentElement.classList.contains(flag); }
  function toggle() { return isEnabled() ? disable() : enable(); }
  function keydown(e) {
    if (e.defaultPrevented || e.isComposing || e.repeat || e.shiftKey || e.getModifierState?.('AltGraph')) return;
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.code === 'KeyG') { e.preventDefault(); toggle(); }
  }
  function destroy() {
    if (disposed) return;
    disable();
    disposed = true;
    document.removeEventListener('keydown', keydown);
    document.getElementById(styleId)?.remove();
    if (window[apiName] === api) delete window[apiName];
  }
  const api = Object.freeze({version, enable, disable, toggle, isEnabled, destroy});
  Object.defineProperty(window, apiName, {value: api, configurable: true});
  document.addEventListener('keydown', keydown);
  enable();
})();
