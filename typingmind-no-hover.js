/* TypingMind — Background-free message panels
 * Version: 1.0.0
 * Adds only a stylesheet. Does not read chats, credentials, or storage,
 * make network requests, or modify message content.
 * Remove this extension and reload TypingMind to undo.
 */
(() => {
  "use strict";

  const styleId = "typingmind-background-free-messages";
  const css = `
    [data-element-id="chat-space-middle-part"] [data-element-id="response-block"],
    [data-element-id="chat-space-middle-part"] [data-element-id="response-block"]:hover,
    [data-element-id="chat-space-middle-part"] [data-element-id="response-block"]:focus-within {
      background: transparent !important;
    }
  `;

  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    (document.head || document.documentElement).appendChild(style);
  }
  style.textContent = css;
})();
