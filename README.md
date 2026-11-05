# TypingMind chat-only theme — 2.0.1

A fresh implementation built around TypingMind's native block messages,
absolute avatars and separate composer parent. The earlier stylesheet and
its flex-row test fixture were replaced.

## Install

**Uninstall earlier ChatGPT/Kimi appearance extensions first.** Keeping an older
startup script installed can replace the newer theme after a restart.

In **Settings → Extensions**, install this exact release URL, then choose
**Restart Now**:

```text
https://cdn.jsdelivr.net/gh/waqasusg-star/typingmind-theme@ee654923b2a911e9d67838588abf9b593fb3ead3/ChatGPT-inspired-TypingMind-theme.js
```

This URL pins the tested source and serves it as JavaScript. Avoid the plain-text
raw GitHub URL and the CDN's cached `@main` link. Future releases need a new
pinned URL. The rebuilt v2 theme was verified loading after restart in the current public
TypingMind interface. The current release is covered by the checks below.

## Fixed in 2.0.1

TypingMind nests file cards in a separate full-width flex column. This release
aligns the children of that native column to the right, including multiple
attachments and messages without text. Card appearance and click actions remain
native. The regression fixture now includes this exact additional wrapper.

## Design

- One 768px maximum column for messages, model toolbar and input card.
- Matching outer gutters: 24px desktop, 16px mobile.
- Chat avatars removed and the reserved avatar padding cleared.
- User bubbles and attachment cards share a right edge.
- Matching 16px system sans-serif messages and input; consistent Markdown spacing and aligned native activity-status rows.
- Neutral light/dark conversation surfaces and controls, rounded composer,
  visible keyboard focus and local horizontal overflow for wide content.
- Original sidebar, top navigation, settings, dialogs and menus retain native styling.

The native textarea keeps its app-owned height and resize behavior. Controls,
syntax colors, attachment actions and selected tool states remain functional.
The script does not move DOM nodes or change document dimensions, browser zoom,
viewport metadata, app scrolling, saved preferences or messages.

## Scope and compatibility

All presentation rules are bounded to `chat-space-background` with CSS `@scope`.
Nested dialogs, menus, listboxes, option panels and the navigation header form
explicit lower boundaries. Use a current browser with `@scope` support; older
engines retain native styling. This is a ChatGPT-inspired adaptation rather than
a pixel-identical clone of the ChatGPT app.

There are no observers, polling, chat-content readers, storage access, network
requests or app-state integrations in the production script.

## Controls

**Ctrl+Alt+G** on Windows/Linux or **Cmd+Alt+G** on macOS toggles the theme.
The existing console API remains available:

```js
window.TypingMindChatGPTTheme.version
window.TypingMindChatGPTTheme.isEnabled()
window.TypingMindChatGPTTheme.enable()
window.TypingMindChatGPTTheme.disable()
window.TypingMindChatGPTTheme.toggle()
window.TypingMindChatGPTTheme.destroy()
```

Disable restores native styling. Destroy also removes the stylesheet and
shortcut listener. Retained APIs from destroyed releases cannot alter the
replacement. Uninstall the extension to stop loading it on future visits.

## Verification

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

The rewritten synthetic fixture models native block rows, absolute avatars,
inline 750px constraints and the separate model toolbar/composer parent observed
in TypingMind's public renderer and DOM. It includes synthetic text and attachments.

The 19 Chromium checks cover six widths (360, 390, 768, 1024, 1440, 1920px), both
light and dark mode, exact shared left/right edges, attachments, consistent fonts,
native sidebar/header/settings/menu invariants, unchanged zoom and viewport,
long code/tables, syntax colors, draft retention, live button handlers, textarea
height, duplicate loading, version replacement, cleanup, keyboard guards, reduced motion, pin highlights and message-selection controls. Desktop light/dark and mobile screenshots were visually reviewed.

Full signed-in provider streaming, private conversation rendering and runtime
testing on other browser engines were not performed. No private chat exports
were used. TypingMind can change its DOM hooks; recheck after substantial UI updates.

## Files

`ChatGPT-inspired-TypingMind-theme.js` is the standalone current release. The
historical full-window and Kimi scripts remain as backups; do not install them
alongside this release. No runtime package dependencies are required.

Independent project; not affiliated with or endorsed by OpenAI or TypingMind.
