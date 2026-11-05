/*!
 * ChatGPT-inspired chat-area styling for TypingMind
 * Version: 1.5.0 | 2026-11-06
 *
 * Independent visual theme. Not affiliated with or endorsed by OpenAI or TypingMind.
 * Changes appearance only: does not read chats, API keys, prompts, or account data;
 * does not send network requests or create persistent storage.
 *
 * Scope: chat conversation, message content and composer only.
 * Original TypingMind sidebar, toolbar, settings, menus and home UI remain unchanged.
 * Native browser scaling / viewport sizing unchanged.
 * Shortcut: Ctrl/Cmd + Alt + G (toggle)
 * Console API: window.TypingMindChatGPTTheme.{enable,disable,toggle,destroy,isEnabled}
 *
 * Please uninstall/disable other TypingMind appearance extensions to avoid CSS
 * conflicts. This script disables the older TypingMindKimiTheme when enabled.
 */
(() => {
  'use strict';

  const VERSION = '1.5.0';
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

  // Keep reused UI hooks outside the conversation native. Popovers may be
  // rendered in a portal or inside the composer; neither is a theme surface.
  const NATIVE_UI = ':where(' + [
    '[role="dialog"]', '[role="menu"]', '[role="listbox"]',
    '[data-element-id="pop-up-modal"]',
    '[data-element-id="model-select-options"]',
    '[data-element-id="agent-select-options"]'
  ].join(', ') + ')';
  const NATIVE_GUARD = `:not(${NATIVE_UI}, ${NATIVE_UI} *)`;
  const CHAT = `html.${CLASS_NAME} [data-element-id="chat-space-middle-part"]${NATIVE_GUARD}`;
  const COMPOSER = `html.${CLASS_NAME} [data-element-id="chat-space-end-part"]${NATIVE_GUARD}`;
  const RESPONSE = `${CHAT} [data-element-id="response-block"]`;
  let destroyed = false;

  // CSS is opt-in and targets only TypingMind conversation and composer elements.
  // Do not alter html/body colors, document font, application layout, sidebar,
  // title bar, navigation, settings, home screen, popovers, or browser zoom.
  // Selectors based on known TypingMind data-element-id hooks; no app reflow.
  const css = String.raw`
/* ===========================================================
   01 — Chat-only tokens (no global page or window styling)
   =========================================================== */
html.${CLASS_NAME} :is([data-element-id="chat-space-middle-part"], [data-element-id="chat-space-end-part"])${NATIVE_GUARD} {
  --cg-page: #ffffff;
  --cg-surface: #ffffff;
  --cg-wash: #f5f5f5;
  --cg-hover: #ededed;
  --cg-user: #f4f4f4;
  --cg-code: #f7f7f8;
  --cg-code-head: #f0f0f0;
  --cg-text: #0d0d0d;
  --cg-secondary: #5f5f5f;
  --cg-tertiary: #838383;
  --cg-stroke: #e6e6e6;
  --cg-stroke-strong: #cdcdcd;
  --cg-link: #126dc1;
  --cg-send: #0d0d0d;
  --cg-send-text: #ffffff;
  --cg-shadow: 0 2px 14px rgba(0, 0, 0, .055);
  --cg-font: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
             "Helvetica Neue", Helvetica, Arial, sans-serif;
}
html.dark.${CLASS_NAME} :is([data-element-id="chat-space-middle-part"], [data-element-id="chat-space-end-part"])${NATIVE_GUARD},
html.${CLASS_NAME}[data-theme="dark"] :is([data-element-id="chat-space-middle-part"], [data-element-id="chat-space-end-part"])${NATIVE_GUARD} {
  --cg-page: #212121;
  --cg-surface: #303030;
  --cg-wash: #292929;
  --cg-hover: #2b2b2b;
  --cg-user: #303030;
  --cg-code: #282828;
  --cg-code-head: #333333;
  --cg-text: #f4f4f4;
  --cg-secondary: #b4b4b4;
  --cg-tertiary: #959595;
  --cg-stroke: #414141;
  --cg-stroke-strong: #626262;
  --cg-link: #8abcfb;
  --cg-send: #f4f4f4;
  --cg-send-text: #151515;
  --cg-shadow: 0 2px 16px rgba(0, 0, 0, .12);
}

/* ===========================================================
   02 — Chat content canvas ONLY, not application windows/nav
   =========================================================== */
${CHAT}${NATIVE_GUARD},
${COMPOSER}${NATIVE_GUARD} {
  background: var(--cg-page) !important;
}

/* ===========================================================
   03 — Message lane: centered, spacious and uncluttered
   =========================================================== */
${RESPONSE}${NATIVE_GUARD} {
  box-sizing: border-box;
  /* ChatGPT-style reading lane. No changes to TypingMind app layout. */
  min-width: 0;
  max-width: 920px !important;
  width: calc(100% - 32px) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-top: 18px !important;
  padding-bottom: 19px !important;
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
${RESPONSE}:hover${NATIVE_GUARD} {
  background: transparent !important;
}
${RESPONSE}[data-message-role="user"]${NATIVE_GUARD} {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
${RESPONSE} [data-element-id="chat-avatar-container"]${NATIVE_GUARD} {
  background: var(--cg-surface) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 50% !important;
  width: 30px;
  height: 30px;
  overflow: hidden;
  box-shadow: none !important;
}
${RESPONSE} [data-element-id="chat-avatar-container"] img${NATIVE_GUARD} {
  border-radius: 50% !important;
}
${RESPONSE} [data-element-id="user-message"]${NATIVE_GUARD} {
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
${RESPONSE} [data-element-id="user-message"] *${NATIVE_GUARD} {
  color: inherit !important;
}
${RESPONSE} [data-element-id="assistant-activity-status"]${NATIVE_GUARD} {
  color: var(--cg-tertiary) !important;
  font-size: 13px;
}

/* ===========================================================
   04 — Markdown reading: typography, tables, quotes and links
   =========================================================== */
${RESPONSE} [data-element-id="ai-response"]${NATIVE_GUARD} {
  min-width: 0;
  max-width: 100% !important;
  /* Wide tables/code stay in the answer, never widen the app or sidebar. */
  overflow-x: auto;
  background: transparent !important;
  color: var(--cg-text) !important;
  font-family: var(--cg-font);
  font-size: 16px;
  line-height: 1.76;
  letter-spacing: -.008em;
  overflow-wrap: anywhere;
}
${RESPONSE} [data-element-id="ai-response"] > :first-child${NATIVE_GUARD} { margin-top: 0 !important; }
${RESPONSE} [data-element-id="ai-response"] > :last-child${NATIVE_GUARD} { margin-bottom: 0 !important; }
${RESPONSE} [data-element-id="ai-response"] p${NATIVE_GUARD} { margin: .7em 0; }
${RESPONSE} [data-element-id="ai-response"] h1${NATIVE_GUARD},
${RESPONSE} [data-element-id="ai-response"] h2${NATIVE_GUARD},
${RESPONSE} [data-element-id="ai-response"] h3${NATIVE_GUARD},
${RESPONSE} [data-element-id="ai-response"] h4${NATIVE_GUARD} {
  color: var(--cg-text) !important;
  font-weight: 650 !important;
  letter-spacing: -.025em;
  line-height: 1.35;
  scroll-margin-top: 64px;
}
${RESPONSE} [data-element-id="ai-response"] h1${NATIVE_GUARD} { font-size: 1.7em; margin: 1.2em 0 .55em; }
${RESPONSE} [data-element-id="ai-response"] h2${NATIVE_GUARD} { font-size: 1.35em; margin: 1.2em 0 .5em; }
${RESPONSE} [data-element-id="ai-response"] h3${NATIVE_GUARD} { font-size: 1.14em; margin: 1.1em 0 .45em; }
${RESPONSE} [data-element-id="ai-response"] h4${NATIVE_GUARD} { font-size: 1.02em; margin: 1em 0 .35em; }
${RESPONSE} [data-element-id="ai-response"] strong${NATIVE_GUARD} {
  color: var(--cg-text) !important;
  font-weight: 650;
}
${RESPONSE} [data-element-id="ai-response"] a${NATIVE_GUARD} {
  color: var(--cg-link) !important;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}
${RESPONSE} [data-element-id="ai-response"] ul${NATIVE_GUARD},
${RESPONSE} [data-element-id="ai-response"] ol${NATIVE_GUARD} {
  margin: .65em 0 1em;
  padding-left: 1.55em;
}
${RESPONSE} [data-element-id="ai-response"] li${NATIVE_GUARD} { margin: .22em 0; padding-left: .16em; }
${RESPONSE} [data-element-id="ai-response"] li${NATIVE_GUARD}::marker { color: var(--cg-secondary); }
${RESPONSE} [data-element-id="ai-response"] blockquote${NATIVE_GUARD} {
  margin: 1em 0;
  color: var(--cg-secondary) !important;
  background: transparent !important;
  border-left: 3px solid var(--cg-stroke-strong) !important;
  border-radius: 0 !important;
  padding: 2px 0 2px 16px !important;
  font-style: normal;
}
${RESPONSE} [data-element-id="ai-response"] hr${NATIVE_GUARD} {
  margin: 1.65em 0;
  border-color: var(--cg-stroke) !important;
}
${RESPONSE} [data-element-id="ai-response"] code:not(pre code)${NATIVE_GUARD} {
  padding: .14em .35em;
  background: var(--cg-wash) !important;
  color: var(--cg-text) !important;
  border-radius: 6px;
  border: 1px solid var(--cg-stroke);
  font-size: .89em;
  font-weight: 450;
}
${RESPONSE} [data-element-id="ai-response"] code:not(pre code)${NATIVE_GUARD}::before,
${RESPONSE} [data-element-id="ai-response"] code:not(pre code)${NATIVE_GUARD}::after { content: none !important; }
${RESPONSE} [data-element-id="ai-response"] pre${NATIVE_GUARD} {
  max-width: 100%;
  background: var(--cg-code) !important;
  color: var(--cg-text) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 13px !important;
  line-height: 1.6;
  box-shadow: none !important;
  overflow-x: auto;
}
${RESPONSE} [data-element-id="ai-response"] pre code${NATIVE_GUARD} {
  font-family: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: .875em;
}
/* Preserve native syntax-highlighting colors and TypingMind's code-copy controls. */
${RESPONSE} [data-element-id="ai-response"] pre > div > div:first-child${NATIVE_GUARD} {
  background: var(--cg-code-head) !important;
  color: var(--cg-secondary) !important;
  min-height: 36px;
  border-bottom: 1px solid var(--cg-stroke);
}
${RESPONSE} [data-element-id="ai-response"] pre > div > div:first-child button${NATIVE_GUARD} {
  background: transparent !important;
  color: var(--cg-secondary) !important;
  border-radius: 8px !important;
}
${RESPONSE} [data-element-id="ai-response"] pre > div > div:first-child button:hover${NATIVE_GUARD} {
  background: var(--cg-hover) !important;
  color: var(--cg-text) !important;
}
${RESPONSE} [data-element-id="ai-response"] pre > div > div > pre${NATIVE_GUARD} {
  margin: 0 !important;
  padding: 15px 17px !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
${RESPONSE} [data-element-id="ai-response"] table${NATIVE_GUARD} {
  border: 1px solid var(--cg-stroke) !important;
  border-collapse: separate !important;
  border-spacing: 0;
  border-radius: 12px;
  max-width: 100%;
  /* Never hide long cells or interactive table content. */
  overflow: visible;
  font-size: .94em;
}
${RESPONSE} [data-element-id="ai-response"] th${NATIVE_GUARD} {
  background: var(--cg-wash) !important;
  color: var(--cg-text) !important;
  font-weight: 600;
}
${RESPONSE} [data-element-id="ai-response"] td${NATIVE_GUARD},
${RESPONSE} [data-element-id="ai-response"] th${NATIVE_GUARD} {
  padding: 9px 12px !important;
  border-color: var(--cg-stroke) !important;
  vertical-align: top;
}
${RESPONSE} [data-element-id="ai-response"] tr:nth-child(even) td${NATIVE_GUARD} {
  background: color-mix(in srgb, var(--cg-wash) 30%, transparent);
}
${RESPONSE} [data-element-id="ai-response"] img${NATIVE_GUARD} {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

/* ===========================================================
   05 — Response actions, thinking, sources and results
   =========================================================== */
${RESPONSE} [data-element-id="thinking-block"]${NATIVE_GUARD},
${RESPONSE} [data-element-id="websearch-calls-block"]${NATIVE_GUARD},
${RESPONSE} [data-element-id="citations-block"]${NATIVE_GUARD} {
  color: var(--cg-secondary) !important;
  border-color: var(--cg-stroke) !important;
}
${RESPONSE} [data-element-id="thinking-block"]${NATIVE_GUARD} {
  background: var(--cg-wash) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 12px !important;
}
${RESPONSE} [data-element-id="additional-actions-of-response-container"]${NATIVE_GUARD} {
  background: transparent !important;
  color: var(--cg-tertiary) !important;
  border: 0 !important;
  box-shadow: none !important;
}
${RESPONSE} [data-element-id="copy-message-button"]${NATIVE_GUARD},
${RESPONSE} [data-element-id="edit-message-button"]${NATIVE_GUARD},
${RESPONSE} [data-element-id="more-actions-menu-button"]${NATIVE_GUARD},
${RESPONSE} [data-element-id="fork-chat-button"]${NATIVE_GUARD} {
  color: var(--cg-secondary) !important;
  background: transparent !important;
  border-radius: 9px !important;
}
${RESPONSE} [data-element-id="copy-message-button"]:hover${NATIVE_GUARD},
${RESPONSE} [data-element-id="edit-message-button"]:hover${NATIVE_GUARD},
${RESPONSE} [data-element-id="more-actions-menu-button"]:hover${NATIVE_GUARD},
${RESPONSE} [data-element-id="fork-chat-button"]:hover${NATIVE_GUARD} {
  color: var(--cg-text) !important;
  background: var(--cg-hover) !important;
}

/* ===========================================================
   06 — Composer: floating rounded input, native controls intact
   =========================================================== */
${COMPOSER}${NATIVE_GUARD} {
  padding-inline: 0;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
${COMPOSER} > div:has([data-element-id="message-input"])${NATIVE_GUARD} {
  box-sizing: border-box;
  /* Match the reading lane without changing the app-owned flex layout. */
  width: calc(100% - 32px) !important;
  max-width: 920px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  margin-top: 0 !important;
  margin-bottom: 10px !important;
  padding: 3px 7px 7px !important;
  background: var(--cg-surface) !important;
  border: 1px solid var(--cg-stroke) !important;
  border-radius: 27px !important;
  box-shadow: var(--cg-shadow) !important;
  outline: 0 !important;
  overflow: visible;
  transition: border-color .12s ease, box-shadow .12s ease;
}
${COMPOSER} > div:has([data-element-id="message-input"]):focus-within${NATIVE_GUARD} {
  border-color: var(--cg-stroke-strong) !important;
  box-shadow: var(--cg-shadow) !important;
}
${COMPOSER} [data-element-id="message-input"]${NATIVE_GUARD},
${COMPOSER} [data-element-id="input-row"]${NATIVE_GUARD},
${COMPOSER} [data-element-id="chat-input-textbox-container"]${NATIVE_GUARD} {
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
}
${COMPOSER} [data-element-id="chat-input-textbox-container"]${NATIVE_GUARD},
${COMPOSER} [data-element-id="chat-input-textbox-container"].editing${NATIVE_GUARD} {
  padding: 0 !important;
  overflow: visible;
}
${COMPOSER} [data-element-id="chat-input-textbox"]${NATIVE_GUARD} {
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
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
${COMPOSER} [data-element-id="chat-input-textbox"]:focus${NATIVE_GUARD},
${COMPOSER} [data-element-id="chat-input-textbox"]:focus-visible${NATIVE_GUARD} {
  outline: 0 !important;
  box-shadow: none !important;
}
${COMPOSER} [data-element-id="chat-input-textbox"]${NATIVE_GUARD}::placeholder {
  color: var(--cg-tertiary) !important;
  opacity: 1;
}
${COMPOSER} [data-element-id="chat-input-actions"]${NATIVE_GUARD} {
  background: transparent !important;
  min-height: 39px;
  padding: 3px 5px 0 !important;
}
${COMPOSER} [data-element-id="chat-input-actions"] .scroll-indicator-gradient${NATIVE_GUARD}::after {
  background: linear-gradient(90deg, transparent, var(--cg-surface)) !important;
}
${COMPOSER} [data-element-id="chat-input-actions"] button${NATIVE_GUARD},
${COMPOSER} [data-element-id="model-setting-button"]${NATIVE_GUARD},
${COMPOSER} [data-element-id="output-settings-button"]${NATIVE_GUARD} {
  color: var(--cg-secondary) !important;
  border-radius: 999px !important;
}
${COMPOSER} [data-element-id="chat-input-actions"] button:hover${NATIVE_GUARD},
${COMPOSER} [data-element-id="model-setting-button"]:hover${NATIVE_GUARD},
${COMPOSER} [data-element-id="output-settings-button"]:hover${NATIVE_GUARD} {
  color: var(--cg-text) !important;
  background: var(--cg-hover) !important;
}
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="send-button"]${NATIVE_GUARD},
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]${NATIVE_GUARD} {
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
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]${NATIVE_GUARD} {
  min-width: 34px !important;
  width: 34px !important;
  padding: 0 !important;
  margin-left: 2px;
}
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="send-button"] *${NATIVE_GUARD},
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"] *${NATIVE_GUARD} {
  color: inherit !important;
}
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="send-button"]:hover${NATIVE_GUARD},
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]:hover${NATIVE_GUARD} {
  background: var(--cg-send) !important;
  color: var(--cg-send-text) !important;
  opacity: .83;
}
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="send-button"]:disabled${NATIVE_GUARD},
${COMPOSER} [data-element-id="chat-input-actions"] [data-element-id="more-options-button"]:disabled${NATIVE_GUARD} {
  background: var(--cg-hover) !important;
  color: var(--cg-tertiary) !important;
  opacity: .75;
}
/* TypingMind's new-chat, regenerate, dropdowns and popovers remain native. */

/* Visible keyboard focus only inside the composer and chat actions. */
${COMPOSER} button:focus-visible${NATIVE_GUARD},
${RESPONSE} button:focus-visible${NATIVE_GUARD} {
  outline: 2px solid var(--cg-link) !important;
  outline-offset: 2px;
}

/* ===========================================================
   07 — Native 100% layout (no theme-based zoom)
   =========================================================== */
/* Deliberately do not override CSS zoom, transform scale, html/body
   width/height, or viewport units. Chromium and TypingMind keep their
   normal viewport sizing and app-owned scroll behavior. */

/* ===========================================================
   08 — Responsive and accessibility settings
   =========================================================== */
@media (max-width: 950px) {
  ${RESPONSE}${NATIVE_GUARD} {
    width: calc(100% - 24px) !important;
  }
  ${COMPOSER} > div:has([data-element-id="message-input"])${NATIVE_GUARD} {
    width: calc(100% - 24px) !important;
  }
}
@media (max-width: 767px) {
  ${RESPONSE}${NATIVE_GUARD} {
    padding-top: 14px !important;
    padding-bottom: 14px !important;
  }
  ${RESPONSE} [data-element-id="ai-response"]${NATIVE_GUARD} { font-size: 15.5px; line-height: 1.7; }
  ${RESPONSE} [data-element-id="user-message"]${NATIVE_GUARD} {
    max-width: 88% !important;
    padding: 10px 14px !important;
    font-size: 15px !important;
  }
  ${COMPOSER}${NATIVE_GUARD} {
    padding-inline: 0;
    padding-bottom: max(7px, env(safe-area-inset-bottom));
  }
  ${COMPOSER} > div:has([data-element-id="message-input"])${NATIVE_GUARD} {
    border-radius: 23px !important;
    margin-bottom: 5px !important;
  }
  ${COMPOSER} [data-element-id="chat-input-textbox"]${NATIVE_GUARD} { font-size: 16px !important; }
}
@media (prefers-reduced-motion: reduce) {
  ${COMPOSER} > div:has([data-element-id="message-input"])${NATIVE_GUARD} {
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
      (document.head || document.documentElement).appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
    return style;
  }

  function enable() {
    if (destroyed) return false;
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
    if (destroyed) return false;
    document.removeEventListener('DOMContentLoaded', enable);
    document.documentElement.classList.remove(CLASS_NAME);
    delete document.documentElement.dataset.tmChatgptThemeVersion;
    return false;
  }

  function toggle() {
    return document.documentElement.classList.contains(CLASS_NAME) ? disable() : enable();
  }

  function onKeyDown(event) {
    if (!event.defaultPrevented && !event.isComposing && !event.repeat &&
        !(event.getModifierState && event.getModifierState('AltGraph')) &&
        (event.ctrlKey || event.metaKey) && event.altKey &&
        !event.shiftKey && event.code === 'KeyG') {
      event.preventDefault();
      toggle();
    }
  }

  function destroy() {
    if (destroyed) return;
    disable();
    destroyed = true;
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
      isEnabled: () => !destroyed && document.documentElement.classList.contains(CLASS_NAME)
    })
  });

  document.addEventListener('keydown', onKeyDown);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enable, { once: true });
  } else {
    enable();
  }
})();
