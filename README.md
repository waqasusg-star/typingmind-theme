# ChatGPT-inspired chat-only theme for TypingMind

Current version: **1.5.0** — 6 November 2026.

Styles the conversation, user bubbles, assistant Markdown, tables, code blocks,
message actions and composer. Supports TypingMind's light and dark appearance,
a centered 920px reading lane, smaller screens and reduced motion.

TypingMind's original sidebar, navigation, model/settings windows, menus and
home content keep their native styling. The theme leaves browser zoom, page
dimensions and the app's conversation scrolling behavior under TypingMind's
control. It does not force your browser to 100%: your chosen zoom stays in place.

## Install or update

Use this **same stable script URL**, including when updating an existing install:

```text
https://raw.githubusercontent.com/waqasusg-star/typingmind-theme/main/ChatGPT-inspired-TypingMind-theme.js
```

1. Open TypingMind's **Preferences → Advanced Settings → Extensions**. Some
   interface versions label Preferences as Settings.
2. Disable or uninstall earlier appearance extensions, including the full-window
   ChatGPT and Kimi themes, to avoid competing styles.
3. Install the script URL above. If it is already installed, keep just that one
   entry and restart/reload TypingMind. If cached styling remains, use a hard
   refresh (`Ctrl+Shift+R` on Windows).
4. Your sidebar, navigation, settings and browser zoom should look the same as
   before. The conversation and composer use the new appearance.

Extensions run when TypingMind starts; updating GitHub does not modify an already
open page. See [TypingMind's official extension instructions](https://docs.typingmind.com/typingmind-extensions).

## Controls

Toggle for the current page with **Ctrl+Alt+G** on Windows/Linux or **Cmd+Alt+G**
on macOS. The shortcut ignores key repeats, IME composition, AltGraph and events
already handled by another feature.

The existing console API remains available:

```js
window.TypingMindChatGPTTheme.version
window.TypingMindChatGPTTheme.isEnabled()
window.TypingMindChatGPTTheme.enable()
window.TypingMindChatGPTTheme.disable()
window.TypingMindChatGPTTheme.toggle()
window.TypingMindChatGPTTheme.destroy()
```

`disable()` restores native styling for this page. `destroy()` also removes the
stylesheet, shortcut listener and pending startup listener. Reloading an installed
extension enables it again; uninstall it in Extensions for permanent removal.
Loading the same release twice keeps one stylesheet and shortcut listener.
An updated release replaces the earlier one. A retained API from a destroyed
release cannot turn off or remove its replacement.

## What changed in 1.5.0

- Bound message styling to response blocks inside the conversation. Reused
  avatar, action or Markdown hooks in sidebars and settings no longer match.
- Scoped theme variables to chat surfaces and excluded nested native dialogs,
  menus and model/agent option panels from direct style overrides.
- Aligned the composer and message lane. Added shrinkable content and local
  horizontal overflow for long code, URLs and wide tables, preserving native
  table markup, code-copy controls and syntax colors.
- Fixed nested code blocks receiving inline-code borders and backgrounds.
- Fixed a deferred startup listener re-enabling a disabled/destroyed theme.
  Re-enabling also repairs a missing or stale stylesheet.
- Preserved the appearance, public API, shortcut and older Kimi-theme conflict
  handling from 1.4.0. Historical theme files remain unchanged.

## Development and verification

Requires Node.js 22 or newer. The installed extension is a standalone JavaScript
file and has no runtime package dependencies.

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

The 17 browser regression tests cover six widths (360, 390, 768, 1024, 1440 and
1920px), both light and dark modes, native sidebar/navigation/settings/menu style
comparisons, overflow, unchanged zoom/viewport, syntax colors, working controls,
draft retention, duplicate loading, version replacement, early cleanup, keyboard
guards and reduced motion.

Tests use synthetic DOM fixtures based on the repository's TypingMind hooks.
The current public TypingMind composer hooks were also inspected. Full signed-in
conversation rendering, actual provider streaming, Safari/Firefox and installed
PWA behavior have not been verified in this release. TypingMind can change its
DOM hooks; missing hooks should leave that area native, so compatibility should
be rechecked after substantial TypingMind UI changes.

## Files and data

- `ChatGPT-inspired-TypingMind-theme.js`: current chat-only release; install this.
- `ChatGPT-inspired-TypingMind-theme-Full-v1.3.0.js`: historical full-window backup.
- `Kimi-inspired-TypingMind-theme.js`: historical alternative.
- `tests/`: synthetic browser regression fixture and tests.

The current theme changes appearance only. It does not read chat contents, API
keys, account data or persistent storage, and it makes no network requests.
It does not edit TypingMind preferences or saved messages. When enabled, it
disables the known older `TypingMindKimiTheme` visual API/class to avoid stacking
two themes, as previous releases did.

Independent project; not affiliated with or endorsed by OpenAI or TypingMind.
