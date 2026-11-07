# Chat History Guard 1.0.0

Prepared for Waqas, 7 November 2026. **Not installed or verified in live TypingMind yet.**

This extension addresses malformed OpenAI-style tool-call history on **direct HTTPS requests to `api.deepseek.com/chat/completions` or `/v1/chat/completions` made through `window.fetch`**. It does not claim permanent protection against every software failure.

## What it does

- Validates each assistant tool-call block and the IDs of its immediately following tool results before forwarding a request.
- Leaves complete tool blocks, system instructions, reasoning content, images, model selection, credentials and streaming settings intact.
- Converts broken tool groups **strictly before the latest user message** into explicitly unverified, quoted historical JSON inside assistant text. It preserves the supplied transcript, but stops presenting incomplete associations as verified tool results. This changes the outgoing representation of ambiguous old messages; it does not reconstruct missing data or prove a build succeeded.
- Refuses an incomplete or unmatched tool group in the current turn before contacting DeepSeek. This prevents guessing an outcome or replaying an operation whose result was lost. Read the actual project/run state before retrying.
- Never dispatches, retries or cancels a build; never executes a tool; never retries provider requests; never reads or writes chat databases, local storage or cookies; never changes saved chat history.
- Sends no telemetry and makes no additional network requests. It forwards exactly once to the same provider endpoint using the original authentication and request options.
- Displays a small status indicator: initially **loaded; transport not verified**, then **validated**, **recovered**, or **blocked** when an applicable request passes through it. It installs only once per page.

## Important limits

This is a defensive extension, not a TypingMind vendor patch. It only covers the two direct DeepSeek fetch endpoints above. Cloud proxies, other providers, WebSockets, XHR, SDKs retaining an earlier fetch reference and future endpoint/schema changes are outside its coverage. It cannot restore missing tool data, prevent network outages, repair compiler failures or ensure physical-device behavior. It does not fix API rate limits, token exhaustion, stale leases or duplicated builds started elsewhere.

Requests over 32 MiB and unreadable request bodies are rejected locally, without silent data truncation. An unsafe current turn intentionally requires review instead of an automatic retry. Historical quoted data can increase context size; original messages remain recoverable in TypingMind.

## Tests and verification

Run `node --test chat-history-guard.test.cjs` with Node 24 or a supported Node release providing native Request/Response/fetch.

The suite checks valid and malformed tool sequences, interrupted current groups, duplicate and missing IDs, historical recovery, multimodal data retention, unchanged original histories, preserved headers/model/streaming, exactly one provider forward, no automatic retry, no unrelated-request interception, no storage access, browser installation and generated malformed histories.

These are local tests with mocked transport. **A live TypingMind integration test remains required after installation is approved.** No real provider requests or billable app builds were performed by the test suite.

## Installation — approval required before enabling

1. Review `chat-history-guard.js` and its SHA-256 in `SHA256SUMS.txt`.
2. Host that exact file at a public HTTPS URL returning JavaScript MIME type with CORS support. Prefer an immutable, commit-pinned URL on the user's existing GitHub/CDN hosting. No credentials or chat content should be uploaded with the code.
3. In TypingMind, open Settings → Extensions, enter the pinned script URL, and install only after Waqas confirms the extension access. TypingMind extensions have broad application access even though this code intentionally uses only outgoing fetch requests and a small status element.
4. Reload one idle TypingMind tab. Do not interrupt an active source edit/build tool chain. Confirm the indicator appears.
5. In a disposable agent chat, perform a read-only project/status call and a follow-up. The indicator must say **direct DeepSeek request validated**. Merely seeing **loaded** does not establish coverage.
6. In a preserved affected chat, send a **read-only status/checkpoint** request, not a build dispatch. Confirm any repair is shown and inspect actual tool/run state. If traffic bypasses the guard or the client fails before fetch, stop and use a supported integration/vendor fix.

Do not advertise it as active or fixed until these live checks pass. A pinned release should be updated only after review and regression tests when TypingMind or DeepSeek changes.

## Rollback

Uninstall the script under Settings → Extensions, then reload the page. If the UI is inaccessible, open <https://www.typingmind.com/?safe_mode=1>, uninstall it, and reload normally. The code makes no saved-history changes to undo.

## Authoritative references

- TypingMind extension installation, access and safe mode: <https://docs.typingmind.com/typingmind-extensions>
- DeepSeek tool-call sequencing: <https://api-docs.deepseek.com/guides/tool_calls/>

## Delivery state

Source and local tests are supplied for review. Hosting, installation, live coverage and affected-chat recovery must be verified separately; none is implied by a passing local test.
