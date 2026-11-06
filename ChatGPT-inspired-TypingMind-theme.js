/*!
 * TypingMind — ChatGPT-like font family only
 * 4.0.0 · 6 November 2026 · Independent project
 * The only CSS property changed is font-family for chat text and input.
 * Native sizes, weights, tables, directions, icons, colors and layout stay native.
 * Uses locally available fonts; no font downloads, storage access or network calls.
 * OpenAI Sans / Söhne if locally installed; otherwise Helvetica Neue / Arial.
 * This is a font approximation when OpenAI's fonts are unavailable.
 * Ctrl/Cmd+Alt+G toggles.
 */
(() => {
  'use strict';
  const version = '4.0.0';
  const apiName = 'TypingMindChatGPTTheme';
  const flag = 'tm-cg-font-only';
  const styleId = 'tm-cg-font-only-style';
  const previous = window[apiName];
  if (previous?.version === version) { previous.enable(); return; }
  if (previous) {
    if (typeof previous.destroy !== 'function') return;
    try { previous.destroy(); } catch { return; }
  }

  const nativeUI = ':is([role="dialog"], [role="menu"], [role="listbox"], [data-element-id="pop-up-modal"], [data-element-id="model-select-options"], [data-element-id="agent-select-options"], [data-element-id="chat-space-beginning-part"])';
  const guard = `:not(${nativeUI}, ${nativeUI} *)`;
  const root = `html.${flag} [data-element-id="chat-space-background"]`;
  const css = `
${root} [data-element-id="response-block"] [data-element-id="ai-response"]${guard},
${root} [data-element-id="response-block"] [data-element-id="user-message"]${guard},
${root} [data-element-id="chat-space-end-part"] [data-element-id="chat-input-textbox"]${guard} {
  font-family: "OpenAI Sans", "Söhne", "Helvetica Neue", Arial, sans-serif !important;
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
