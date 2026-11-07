const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const G = require('./chat-history-guard.js');
const user = content => ({ role: 'user', content });
const call = (id = 'a') => ({ id, type: 'function', function: { name: 'read_project', arguments: '{"project_id":"example"}' } });
const assistant = (...calls) => ({ role: 'assistant', content: null, reasoning_content: 'retained', tool_calls: calls });
const result = (id = 'a', content = 'ok') => ({ role: 'tool', tool_call_id: id, content });
const target = 'https://api.deepseek.com/chat/completions';
const post = messages => ({ method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer TEST_ONLY' }, body: JSON.stringify({ model: 'deepseek-flash', stream: true, messages }) });

test('valid sequential history stays byte-equivalent and retains reasoning', () => {
  const input = [{ role: 'system', content: 'rules' }, user('read'), assistant(call()), result(), { role: 'assistant', content: 'done' }, user('next')];
  const frozen = JSON.stringify(input);
  const out = G.repairHistory(input);
  assert.equal(out.ok, true); assert.equal(out.repairedBlocks, 0);
  assert.equal(JSON.stringify(out.messages), frozen); assert.equal(JSON.stringify(input), frozen);
});
test('complete current tool block is accepted', () => {
  assert.equal(G.repairHistory([user('read'), assistant(call()), result()]).ok, true);
});
test('parallel results may arrive in a different order', () => {
  const input = [user('read'), assistant(call('a'), call('b')), result('b'), result('a')];
  assert.deepEqual(G.repairHistory(input).messages, input);
});
test('historical orphan results are quoted with all data retained', () => {
  const broken = [result('lost', 'error: timeout; request_id=known-build')];
  const input = [user('old'), ...broken, user('continue')];
  const out = G.repairHistory(input);
  assert.equal(out.ok, true); assert.equal(out.repairedBlocks, 1);
  assert.equal(out.messages[1].role, 'assistant');
  assert.ok(out.messages[1].content.includes(G.PREFIX));
  assert.ok(out.messages[1].content.includes(JSON.stringify(broken)));
  assert.equal(input[1].role, 'tool');
});
test('historical incomplete invocation is preserved as unverified data, not a fabricated result', () => {
  const old = assistant(call('build'));
  const out = G.repairHistory([user('old'), old, user('status')]);
  assert.equal(out.ok, true); assert.ok(out.messages[1].content.includes(JSON.stringify([old])));
  assert.ok(!out.messages.some(m => m.role === 'tool'));
});
test('current orphan result is blocked without repair', () => {
  assert.equal(G.repairHistory([user('build'), result('lost')]).ok, false);
});
test('current unfinished call is blocked without tool replay', () => {
  assert.equal(G.repairHistory([user('build'), assistant(call('build'))]).ok, false);
});
test('missing one result in a current parallel group is blocked', () => {
  assert.equal(G.repairHistory([user('build'), assistant(call('a'), call('b')), result('a')]).ok, false);
});
test('duplicate current results are blocked', () => {
  assert.equal(G.repairHistory([user('read'), assistant(call()), result(), result()]).ok, false);
});
test('duplicate call IDs are blocked', () => {
  assert.equal(G.repairHistory([user('read'), assistant(call(), call()), result()]).ok, false);
});
test('mismatched call/result IDs are blocked', () => {
  assert.equal(G.repairHistory([user('read'), assistant(call('a')), result('b')]).ok, false);
});
test('a malformed historical call list is quoted', () => {
  const out = G.repairHistory([{ role: 'assistant', tool_calls: 'bad', content: 'old' }, user('next')]);
  assert.equal(out.ok, true); assert.equal(out.repairedBlocks, 1);
});
test('a malformed current call is blocked', () => {
  assert.equal(G.repairHistory([user('read'), assistant({ id: 'a' }), result()]).ok, false);
});
test('empty tool_calls is omitted without mutating original', () => {
  const m = { role: 'assistant', content: 'hello', tool_calls: [] };
  assert.deepEqual(G.repairHistory([m]).messages, [{ role: 'assistant', content: 'hello' }]);
  assert.deepEqual(m.tool_calls, []);
});
test('non-tool messages including images and instructions stay intact', () => {
  const input = [{ role: 'developer', content: 'Keep rules' }, user([{ type: 'image_url', image_url: { url: 'https://example.invalid/p.png' } }])];
  assert.deepEqual(G.repairHistory(input).messages, input);
});
test('a current tool error is still a valid returned result', () => {
  assert.equal(G.repairHistory([user('read'), assistant(call()), result('a', '{"error":"GitHub 404"}')]).ok, true);
});
test('multimodal tool result content is retained', () => {
  const input = [user('read'), assistant(call()), result('a', [{ type: 'text', text: 'result' }])];
  assert.deepEqual(G.repairHistory(input).messages, input);
});
test('invalid message array or null message is blocked', () => {
  assert.equal(G.repairHistory(null).ok, false); assert.equal(G.repairHistory([null]).ok, false);
});
test('invalid history without a user boundary is blocked', () => {
  assert.equal(G.repairHistory([result()]).ok, false);
});
test('multiple old broken groups are repaired independently and idempotently', () => {
  const input = [result('x'), { role: 'assistant', content: 'old' }, assistant(call('y')), user('next')];
  const first = G.repairHistory(input);
  assert.equal(first.repairedBlocks, 2);
  const second = G.repairHistory(first.messages);
  assert.equal(second.repairedBlocks, 0); assert.deepEqual(second.messages, first.messages);
});
test('only exact HTTPS DeepSeek chat endpoints are intercepted', () => {
  for (const url of [target, 'https://api.deepseek.com/v1/chat/completions']) assert.equal(G.isTarget(url), true);
  for (const url of ['http://api.deepseek.com/chat/completions', 'https://api.deepseek.com.evil.invalid/chat/completions', 'https://evil.invalid/?url=' + target, 'https://api.deepseek.com/user/balance', 'https://api.openai.com/v1/chat/completions']) assert.equal(G.isTarget(url), false);
});
test('unrelated requests are passed through exactly, including opaque bodies', async () => {
  const input = 'https://example.invalid/private'; const init = { body: Symbol('opaque') };
  let calls = 0;
  const response = {};
  const wrapped = G.guardedFetch(async (a, b) => { calls++; assert.equal(a, input); assert.equal(b, init); return response; }, () => {});
  assert.equal(await wrapped(input, init), response); assert.equal(calls, 1);
});
test('valid direct request and streamed provider response are untouched', async () => {
  const init = post([user('read'), assistant(call()), result()]); const response = new Response('event stream', { headers: { 'Content-Type': 'text/event-stream' } });
  const states = []; let calls = 0;
  const wrapped = G.guardedFetch(async (a, b) => { calls++; assert.equal(a, target); assert.equal(b, init); return response; }, s => states.push(s));
  assert.equal(await wrapped(target, init), response); assert.equal(calls, 1); assert.equal(states[0].kind, 'validated');
});
test('recovery preserves auth, URL, model, stream flag, options and original body', async () => {
  const init = { ...post([result('lost', 'old source'), user('status')]), credentials: 'omit' };
  const before = init.body; let calls = 0; const states = [];
  const wrapped = G.guardedFetch(async req => {
    calls++; assert.ok(req instanceof Request); assert.equal(req.url, target);
    assert.equal(req.headers.get('Authorization'), 'Bearer TEST_ONLY'); assert.equal(req.credentials, 'omit');
    const p = await req.json(); assert.equal(p.model, 'deepseek-flash'); assert.equal(p.stream, true);
    assert.equal(p.messages[0].role, 'assistant'); assert.ok(p.messages[0].content.includes('old source'));
    return new Response('ok');
  }, s => states.push(s));
  assert.equal(await (await wrapped(target, init)).text(), 'ok');
  assert.equal(calls, 1); assert.equal(init.body, before); assert.equal(states[0].kind, 'recovered');
  assert.equal(JSON.stringify(states).includes('old source'), false);
  assert.equal(JSON.stringify(states).includes('TEST_ONLY'), false);
});
test('unsafe current request returns local error with zero provider calls', async () => {
  let calls = 0;
  const wrapped = G.guardedFetch(async () => { calls++; }, () => {});
  const response = await wrapped(target, post([user('build'), assistant(call('build'))]));
  assert.equal(response.status, 400); assert.equal(calls, 0);
  assert.equal((await response.json()).error.code, 'chat_history_guard_blocked');
});
test('invalid JSON returns a local error, never forwards', async () => {
  let calls = 0;
  const wrapped = G.guardedFetch(async () => { calls++; }, () => {});
  assert.equal((await wrapped(target, { method: 'POST', body: '{broken' })).status, 400);
  assert.equal(calls, 0);
});
test('Request object inputs are handled without consuming original', async () => {
  const req = new Request(target, post([result('old'), user('next')])); let calls = 0;
  const wrapped = G.guardedFetch(async r => { calls++; assert.equal((await r.json()).messages[0].role, 'assistant'); return new Response('ok'); }, () => {});
  await wrapped(req); assert.equal(calls, 1); assert.equal(req.bodyUsed, false);
});
test('provider errors propagate without retrying or replaying', async () => {
  let calls = 0;
  const wrapped = G.guardedFetch(async () => { calls++; throw new TypeError('network failed'); }, () => {});
  await assert.rejects(wrapped(target, post([user('hi')])), /network failed/); assert.equal(calls, 1);
});
test('status callback exceptions cannot break a valid request', async () => {
  const wrapped = G.guardedFetch(async () => new Response('ok'), () => { throw new Error('UI problem'); });
  assert.equal(await (await wrapped(target, post([user('hi')]))).text(), 'ok');
});
test('GET and non-chat API paths are not parsed or changed', async () => {
  let calls = 0; const wrapped = G.guardedFetch(async () => { calls++; return new Response('ok'); }, () => {});
  await wrapped(target); await wrapped('https://api.deepseek.com/user/balance'); assert.equal(calls, 2);
});
test('browser installation is idempotent and does not access storage or network by itself', () => {
  let calls = 0; const elements = [];
  const doc = { body: { appendChild: x => elements.push(x) }, createElement: () => ({ setAttribute() {}, style: {} }) };
  const win = { document: doc, fetch: async () => { calls++; } };
  Object.defineProperty(win, 'localStorage', { get() { throw Error('forbidden storage access'); } });
  Object.defineProperty(win, 'indexedDB', { get() { throw Error('forbidden storage access'); } });
  G.install(win); const first = win.fetch; G.install(win);
  assert.equal(win.fetch, first); assert.equal(calls, 0); assert.equal(elements.length, 1);
  assert.match(elements[0].textContent, /transport not verified/);
});
test('actual browser bundle bootstraps without CommonJS', () => {
  const doc = { body: { appendChild() {} }, createElement: () => ({ setAttribute() {}, style: {} }) };
  const win = { document: doc, fetch: async () => new Response('ok') };
  const before = win.fetch;
  vm.runInNewContext(fs.readFileSync(require.resolve('./chat-history-guard.js'), 'utf8'), { window: win, Symbol });
  assert.notEqual(win.fetch, before);
});
test('1000 generated old tool failures normalize once, retain data, and validate on reuse', () => {
  for (let n = 0; n < 1000; n++) {
    const secret = 'retained-output-' + n;
    const old = n % 3 === 0 ? [result('missing-' + n, secret)]
      : n % 3 === 1 ? [assistant(call('a')), result('a', secret), result('a', 'duplicate')]
      : [assistant(call('a'), call('b')), result('a', secret)];
    const input = [user('prior'), ...old, user('resume ' + n), assistant(call('current')), result('current')];
    const snapshot = JSON.stringify(input); const checked = G.repairHistory(input);
    assert.equal(checked.ok, true); assert.equal(checked.repairedBlocks, 1);
    assert.ok(JSON.stringify(checked.messages).includes(secret));
    assert.deepEqual(checked.messages.slice(-3), input.slice(-3));
    assert.equal(G.repairHistory(checked.messages).repairedBlocks, 0);
    assert.equal(JSON.stringify(input), snapshot);
  }
});
