# TypingMind typography and tables only — v3.0.0

This release follows the latest requested scope: **keep TypingMind's default
layout and icons; change only font family, font size, boldness and table design.**

## Install

1. Uninstall all earlier ChatGPT/Kimi appearance-theme extensions, including
   v2.0.0 and v2.0.1. Keep only this typography-only extension.
2. In **Settings → Extensions**, install this exact URL.
3. Click **Restart Now**.

```text
https://cdn.jsdelivr.net/gh/waqasusg-star/typingmind-theme@9840f208b912e03e1bbca882a16a5d5b2258efd3/ChatGPT-inspired-TypingMind-theme.js
```

This URL pins the tested JavaScript release. Do not use a raw GitHub URL or a
cached CDN `@main` link. Future updates need their new release URL.

## Changes

| Content | Appearance |
| --- | --- |
| Chat messages and input text | System sans-serif, 16px, regular weight |
| Bold text | Weight 600 |
| Main/subheadings | 24px / 20px / 18px; weight 600 |
| Code text | Monospace, 14px; native syntax colors |
| Markdown tables | 15px, semibold header, subtle light/dark header fill and row separators |

Table column alignment and writing direction remain as supplied by TypingMind
and Markdown. Table cell padding and borders change as part of table design.

## Native behavior retained

The stylesheet has **no layout or spacing overrides outside tables**. It does
not hide avatars or icons, move attachments, change bubble colors or shapes,
center or resize the conversation, change text direction, restyle the toolbar,
rebuild the composer, or alter navigation, sidebar, settings, dialogs, scrolling
or browser zoom. Native line-height and margin rules are retained; text naturally
reflows at the chosen font size.

Loading v3 replaces the previous theme through its public cleanup API, removing
its stylesheet and layout class. Older theme extensions must still be uninstalled
so their startup scripts cannot load again on the next restart.

All styling is scoped to chat text/input and Markdown tables. No chat contents,
credentials, storage or network APIs are accessed by the script. Requires a
current browser supporting CSS `@scope`.

## Controls

Use **Ctrl+Alt+G** (Windows/Linux) or **Cmd+Alt+G** (macOS) to toggle.

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

Eleven Chromium fixture checks verify native layout/direction/surface properties
and icon sizes at 390, 768 and 1440px in light/dark mode, unchanged chat markup,
16px message/input fonts, semibold text, table colors and existing column
alignment, draft retention, button/activity handlers, native textarea height,
syntax colors, menu/settings isolation, shortcut guards and cleanup.

A CSS rule audit rejects any non-table declaration except font family, size or
weight. A separate upgrade check using the actual v2.0.1 script verified that
v3 restores the native avatars, composer width, attachment alignment and bubble
color, and removes the old stylesheet. Testing uses synthetic conversations;
private account rendering and provider streaming were not tested.

The historical full-window and Kimi scripts are backups, not part of this
release. Do not install them alongside it.

Independent project; not affiliated with or endorsed by OpenAI or TypingMind.

