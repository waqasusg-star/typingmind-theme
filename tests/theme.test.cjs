'use strict';
const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const source = fs.readFileSync(path.join(__dirname, '../ChatGPT-inspired-TypingMind-theme.js'), 'utf8');
const fixture = fs.readFileSync(path.join(__dirname, 'fixture.html'), 'utf8')
  .replace('LONG_CODE_PLACEHOLDER', 'long_code_'.repeat(100))
  .replace('LONG_TEXT_PLACEHOLDER', 'https://example.com/' + 'shipment'.repeat(120))
  .replace('WIDE_TABLE_PLACEHOLDER', '<td>Long carrier reference 1234567890</td>'.repeat(30));
let browser, context;
before(async () => {
  const options = process.env.THEME_TEST_BROWSER_CONFIG
    ? JSON.parse(fs.readFileSync(process.env.THEME_TEST_BROWSER_CONFIG, 'utf8')) : {};
  browser = await chromium.launch({...options, headless:true});
  context = await browser.newContext();
});
after(async () => { await browser?.close(); });

async function setup(width = 1440, dark = false) {
  const page = await context.newPage();
  await page.setViewportSize({width, height:1000});
  await page.setContent(fixture);
  if (dark) await page.evaluate(() => document.documentElement.classList.add('dark'));
  return page;
}

const sentinels = ['sidebar','sidebar-fork','sidebar-avatar','nav-settings','navigation','nav-model',
  'settings','settings-preview','settings-copy','settings-input','home-response','menu-button',
  'response-menu-copy','response-menu-text'];
async function nativeSnapshot(page) {
  return page.evaluate(ids => Object.fromEntries(ids.map(id => {
    const element = document.getElementById(id), style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const properties = ['backgroundColor','color','fontFamily','fontSize','fontWeight','lineHeight',
      'borderRadius','padding','border','boxShadow','outline','width','height'];
    // Chat content height changes naturally, so menu position is not a native invariant.
    return [id, {...Object.fromEntries(properties.map(key => [key,style[key]])), width:rect.width,height:rect.height}];
  })), sentinels);
}

for (const width of [360, 390, 768, 1024, 1440, 1920]) for (const dark of [false,true]) {
  test(`chat-only layout: ${width}px ${dark ? 'dark' : 'light'}`, async () => {
    const page = await setup(width, dark);
    const nativeBefore = await nativeSnapshot(page);
    const viewportBefore = await page.evaluate(() => ({width:innerWidth,height:innerHeight,scale:visualViewport.scale,
      rootZoom:getComputedStyle(document.documentElement).zoom,bodyZoom:getComputedStyle(document.body).zoom,
      overflow:getComputedStyle(document.getElementById('conversation')).overflowY}));
    await page.addScriptTag({content:source});
    assert.deepEqual(await nativeSnapshot(page), nativeBefore, 'native sidebar/settings/navigation/menus changed');
    const result = await page.evaluate(() => {
      const rect = id => document.getElementById(id).getBoundingClientRect();
      const css = id => getComputedStyle(document.getElementById(id));
      return {color:css('answer').color,bubble:css('answer').fontSize, radius:document.querySelector('[data-element-id="user-message"]') && getComputedStyle(document.querySelector('[data-element-id="user-message"]')).borderRadius,
        docWidth:document.documentElement.scrollWidth, width:innerWidth,height:innerHeight,scale:visualViewport.scale,
        rootZoom:getComputedStyle(document.documentElement).zoom,bodyZoom:getComputedStyle(document.body).zoom,
        overflow:css('conversation').overflowY, row:rect('answer-row').width,composer:rect('composer').width,
        codeScroll:document.getElementById('long-code').scrollWidth > document.getElementById('long-code').clientWidth,
        sidebarToken:css('sidebar').getPropertyValue('--cg-text')};
    });
    assert.equal(result.color, dark ? 'rgb(244, 244, 244)' : 'rgb(13, 13, 13)');
    assert.equal(result.radius, '21px');
    assert.ok(result.docWidth <= width, `document widened to ${result.docWidth}`);
    assert.ok(result.row <= 920);
    assert.ok(Math.abs(result.row-result.composer) < 1, 'composer should align with reading lane');
    assert.ok(result.codeScroll, 'long code needs horizontal scrolling');
    assert.equal(result.sidebarToken, '', 'theme variables leaked to sidebar');
    for (const key of Object.keys(viewportBefore)) assert.equal(result[key],viewportBefore[key],`${key} changed`);
    await page.evaluate(() => window.TypingMindChatGPTTheme.disable());
    assert.deepEqual(await nativeSnapshot(page), nativeBefore);
    await page.close();
  });
}

test('nested code retains syntax colors and avoids inline-code borders', async () => {
  const page = await setup();
  await page.addScriptTag({content:source});
  const styles = await page.evaluate(() => Object.fromEntries(['inline-code','nested-code'].map(id => {
    const s = getComputedStyle(document.getElementById(id));
    return [id,{border:s.borderTopWidth,color:s.color,background:s.backgroundColor}];
  })));
  assert.equal(styles['inline-code'].border,'1px');
  assert.equal(styles['nested-code'].border,'0px');
  assert.equal(styles['nested-code'].color,'rgb(139, 92, 246)');
  assert.equal(styles['nested-code'].background,'rgba(0, 0, 0, 0)');
  await page.locator('#copy-message').click();
  assert.equal(await page.evaluate(() => window.testClicks),1);
  await page.locator('#input').fill('Draft preserved on toggle');
  await page.keyboard.press('Control+Alt+g');
  assert.equal(await page.locator('#input').inputValue(),'Draft preserved on toggle');
  await page.close();
});

test('duplicate loads, style repair, update and retained old APIs are safe', async () => {
  const page = await setup();
  await page.addScriptTag({content:source});
  await page.evaluate(() => { window.oldTheme = window.TypingMindChatGPTTheme; });
  await page.addScriptTag({content:source});
  assert.equal(await page.locator('#tm-chatgpt-ui-styles').count(),1);
  await page.keyboard.press('Control+Alt+g');
  assert.equal(await page.evaluate(() => window.TypingMindChatGPTTheme.isEnabled()),false);
  await page.evaluate(() => {
    document.getElementById('tm-chatgpt-ui-styles').textContent = '/* stale */';
    window.TypingMindChatGPTTheme.enable();
  });
  assert.ok((await page.locator('#tm-chatgpt-ui-styles').textContent()).length > 1000);
  await page.addScriptTag({content:source.replace("const VERSION = '1.5.0'", "const VERSION = '1.5.1'")});
  const current = await page.evaluate(() => {
    window.oldTheme.destroy();
    window.oldTheme.enable();
    window.oldTheme.disable();
    return {enabled:window.TypingMindChatGPTTheme.isEnabled(),oldEnabled:window.oldTheme.isEnabled(),version:window.TypingMindChatGPTTheme.version};
  });
  assert.deepEqual(current,{enabled:true,oldEnabled:false,version:'1.5.1'});
  await page.close();
});

test('destroy/disable before DOM ready cancels deferred enable', async () => {
  for (const action of ['destroy','disable']) {
    const page = await context.newPage();
    await page.setContent(`<html><head><script>${source}</script><script>window.TypingMindChatGPTTheme.${action}();</script></head><body></body></html>`);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('tm-chatgpt-ui')),false);
    if (action === 'destroy') {
      assert.equal(await page.locator('#tm-chatgpt-ui-styles').count(),0);
      assert.equal(await page.evaluate(() => 'TypingMindChatGPTTheme' in window),false);
    }
    await page.close();
  }
});

test('keyboard toggle respects composition, repeats, existing handlers and AltGraph', async () => {
  const page = await setup();
  await page.addScriptTag({content:source});
  const result = await page.evaluate(() => {
    const base = {code:'KeyG',ctrlKey:true,altKey:true,bubbles:true,cancelable:true};
    const events = [{repeat:true},{isComposing:true},{shiftKey:true},{metaKey:false,ctrlKey:false}];
    for (const extra of events) document.dispatchEvent(new KeyboardEvent('keydown',{...base,...extra}));
    const prevented = new KeyboardEvent('keydown',base); prevented.preventDefault(); document.dispatchEvent(prevented);
    const altGraph = new KeyboardEvent('keydown',base);
    Object.defineProperty(altGraph,'getModifierState',{value:key => key === 'AltGraph'}); document.dispatchEvent(altGraph);
    return window.TypingMindChatGPTTheme.isEnabled();
  });
  assert.equal(result,true);
  await page.keyboard.press('Meta+Alt+g');
  assert.equal(await page.evaluate(() => window.TypingMindChatGPTTheme.isEnabled()),false);
  await page.close();
});

test('reduced motion and dark attribute work without document styling', async () => {
  const page = await setup();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addScriptTag({content:source});
  await page.evaluate(() => document.documentElement.dataset.theme = 'dark');
  const result = await page.evaluate(() => ({
    transition:getComputedStyle(document.getElementById('composer')).transitionDuration,
    color:getComputedStyle(document.getElementById('answer')).color,
    rootToken:getComputedStyle(document.documentElement).getPropertyValue('--cg-text')
  }));
  assert.deepEqual(result,{transition:'0s',color:'rgb(244, 244, 244)',rootToken:''});
  await page.close();
});
