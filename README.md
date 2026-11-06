# TypingMind font family only — v4.0.0

Changes **only the font family** of chat messages and input text.
Native sizes, boldness, line-height rules, tables, icons, alignment, colors,
bubbles, spacing, controls and browser zoom remain under TypingMind's control.

## Install

1. Uninstall the earlier ChatGPT/Kimi theme extension entries from this project,
   including v1–v3. Keep your unrelated extensions.
2. Open **Settings → Extensions** and install this exact URL.
3. Choose **Restart Now**.

```text
https://cdn.jsdelivr.net/gh/waqasusg-star/typingmind-theme@3573d813d977f9927ff39639657ccab0748bde3e/ChatGPT-inspired-TypingMind-theme.js
```

This URL pins the tested release and serves JavaScript through jsDelivr.
Avoid raw GitHub URLs and cached CDN `@main` URLs.

## Font choice

The single CSS declaration is:

```css
font-family: "OpenAI Sans", "Söhne", "Helvetica Neue", Arial, sans-serif;
```

OpenAI Sans or Söhne is used only if installed locally. Otherwise the browser
uses Helvetica Neue, Arial or its generic sans-serif fallback. This is a
ChatGPT-like approximation when OpenAI's fonts are unavailable. No font files
are downloaded or bundled.

The font rule applies only to user/assistant message text and the message input.
It does not restyle code fonts, toolbar controls, navigation, sidebar or settings.
Native monospace rules and syntax colors remain intact.

## Scope

The entire injected stylesheet has **one declaration: font-family**. There are
no size, weight, table, layout, direction, spacing, color, zoom or icon overrides.
Native writing direction and Markdown column alignment remain unchanged. Text
may wrap differently because the letter shapes and widths of fonts differ.

Loading this release calls the previous theme's cleanup API. Old extensions
must also be uninstalled so their startup scripts cannot reapply an older
release after restarting.

The script does not read chat text, credentials or storage, send network requests,
move DOM nodes, resize controls or intercept scrolling. The production CSS does
not require `@scope`.

## Controls

Toggle with **Ctrl+Alt+G** (Windows/Linux) or **Cmd+Alt+G** (macOS).

```js
window.TypingMindChatGPTTheme.version
window.TypingMindChatGPTTheme.isEnabled()
window.TypingMindChatGPTTheme.enable()
window.TypingMindChatGPTTheme.disable()
window.TypingMindChatGPTTheme.toggle()
window.TypingMindChatGPTTheme.destroy()
```

## Verification

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

Eleven Chromium fixture checks cover default layout, icons, sizes, weights,
line-height rules, table design, column alignment, light/dark mode, draft retention,
native textarea height, code colors, controls, dialogs, keyboard guards and cleanup.
The CSS audit rejects any property other than font-family.

A separate upgrade check using the actual v3.0.0 script confirmed that v4 removes
its stylesheet and restores the original sizes, boldness and table styling.
Tests use synthetic conversations; private accounts and provider streaming were
not tested.

Historical full-window and Kimi scripts remain as backups. Do not install them
alongside this release.

Independent project; not affiliated with or endorsed by OpenAI or TypingMind.
