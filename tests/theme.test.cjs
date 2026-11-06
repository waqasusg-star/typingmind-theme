'use strict';
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const source=fs.readFileSync(path.join(__dirname,'../ChatGPT-inspired-TypingMind-theme.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'native-layout.html'),'utf8');
let browser,context;
before(async()=>{const options=process.env.THEME_TEST_BROWSER_CONFIG?JSON.parse(fs.readFileSync(process.env.THEME_TEST_BROWSER_CONFIG,'utf8')):{};browser=await chromium.launch({...options,headless:true});context=await browser.newContext();});
after(async()=>browser?.close());
async function pageFor(width=1440,dark=false){const p=await context.newPage();await p.setViewportSize({width,height:1000});await p.setContent(html);if(dark)await p.evaluate(()=>document.documentElement.classList.add('dark'));return p;}
const nativeIds=['sidebar','sidebar-avatar','nav-new','nav-settings','navigation','native-nav-button','settings','settings-preview','settings-button','user-row','attachment-list','attachment','user','activity-row','activity','assistant-row','answer','toolbar','lane','card','input','attach','mode','send'];
async function layout(p){return p.evaluate(ids=>{
 const props=['display','position','padding','margin','maxWidth','minWidth','minHeight','maxHeight','border','borderRadius','backgroundColor','color','textAlign','direction','alignItems','justifyContent','flexDirection','gap','order','overflowX','overflowY','transform','zoom'];
 return Object.fromEntries(ids.map(id=>{const e=document.getElementById(id),s=getComputedStyle(e);return[id,Object.fromEntries(props.map(k=>[k,s[k]]))]}));
},nativeIds);}
async function iconSizes(p){return p.evaluate(()=>[...document.querySelectorAll('[data-element-id="chat-avatar-container"], #toolbar svg, #card svg')].map(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return{width:b.width,height:b.height,display:s.display,color:s.color}}));}
for(const width of [390,768,1440])for(const dark of [false,true])test(`default layout and icons preserved: ${width}px ${dark?'dark':'light'}`,async()=>{
 const p=await pageFor(width,dark),original=await layout(p),icons=await iconSizes(p);
 const originalDom=await p.locator('[data-element-id="chat-space-background"]').first().innerHTML();
 const originalType=await p.evaluate(()=>Object.fromEntries(['user','answer','input'].map(id=>{const s=getComputedStyle(document.getElementById(id));return[id,{size:s.fontSize,weight:s.fontWeight,lineHeight:s.lineHeight}]})));
 const originalBold=await p.locator('#answer strong').first().evaluate(e=>getComputedStyle(e).fontWeight);
 await p.addScriptTag({content:source});
 assert.deepEqual(await layout(p),original,'a native layout, direction, surface or control property changed');
 assert.deepEqual(await iconSizes(p),icons,'a native icon was hidden or resized');
 assert.equal(await p.locator('[data-element-id="chat-space-background"]').first().innerHTML(),originalDom,'chat markup changed');
 const type=await p.evaluate(()=>Object.fromEntries(['user','answer','input'].map(id=>{const s=getComputedStyle(document.getElementById(id));return[id,{size:s.fontSize,weight:s.fontWeight,lineHeight:s.lineHeight}]})));
 assert.deepEqual(type,originalType,'native font size, boldness or line height changed');
 assert.equal(await p.locator('#answer strong').first().evaluate(e=>getComputedStyle(e).fontWeight),originalBold);
 assert.ok((await p.locator('#user').evaluate(e=>getComputedStyle(e).fontFamily)).includes('Arial'));
 assert.equal(await p.locator('#lane').evaluate(e=>getComputedStyle(e).maxWidth),'750px');
 await p.evaluate(()=>window.TypingMindChatGPTTheme.disable());assert.deepEqual(await layout(p),original);await p.close();
});

test('the entire stylesheet contains only a font-family declaration',async()=>{
 const p=await pageFor();await p.addScriptTag({content:source});
 const rules=await p.evaluate(()=>{const result=[];const walk=rs=>{for(const r of rs){if(r.style)result.push({selector:r.selectorText,props:[...r.style]});if(r.cssRules)walk(r.cssRules);}};walk(document.getElementById('tm-cg-font-only-style').sheet.cssRules);return result;});
 assert.equal(rules.length,1,'unexpected additional styling rule');
 for(const rule of rules)assert.deepEqual(rule.props,['font-family'],'a property other than font-family is present');
 await p.close();
});

test('native table design, sizes, weights and column alignment are unchanged',async()=>{
 for(const dark of [false,true]){const p=await pageFor(1440,dark);
 await p.locator('table td').first().evaluate(e=>e.style.textAlign='right');
 const read=()=>p.locator('table').evaluate(e=>[e,e.querySelector('th'),e.querySelector('td')].map(el=>{const s=getComputedStyle(el);return{size:s.fontSize,weight:s.fontWeight,bg:s.backgroundColor,color:s.color,border:s.border,bottom:s.borderBottom,padding:s.padding,align:s.textAlign,direction:s.direction,spacing:s.borderSpacing,collapse:s.borderCollapse};}));
 const before=await read();await p.addScriptTag({content:source});assert.deepEqual(await read(),before);await p.close();}
});

test('drafts, buttons, activity controls and code colors keep working',async()=>{
 const p=await pageFor();await p.locator('#input').fill('Draft stays here');await p.locator('#input').evaluate(e=>e.style.setProperty('height','140px','important'));
 const syntax=await p.locator('.token').evaluate(e=>getComputedStyle(e).color);await p.addScriptTag({content:source});
 await p.locator('#copy').click();assert.equal(await p.evaluate(()=>window.clicks),1);
 await p.locator('#activity').click();assert.equal(await p.locator('#activity').getAttribute('aria-expanded'),'true');
 assert.equal(await p.locator('.token').evaluate(e=>getComputedStyle(e).color),syntax);
 assert.equal(await p.locator('#input').evaluate(e=>e.getBoundingClientRect().height),140);
 await p.keyboard.press('Control+Alt+g');assert.equal(await p.locator('#input').inputValue(),'Draft stays here');await p.close();
});

test('native nested dialogs and menus receive no typography overrides',async()=>{
 const p=await pageFor();await p.evaluate(()=>{const e=document.createElement('div');e.className='native-island';e.setAttribute('role','menu');e.innerHTML='<div data-element-id="ai-response" id="menu-text">Native option</div>';document.querySelector('#answer').append(e);});
 const before=await p.locator('#menu-text').evaluate(e=>getComputedStyle(e).font);
 await p.addScriptTag({content:source});assert.equal(await p.locator('#menu-text').evaluate(e=>getComputedStyle(e).font),before);
 assert.equal(await p.locator('#settings-preview').evaluate(e=>getComputedStyle(e).fontSize),'14px');await p.close();
});

test('duplicate loading, version replacement, cleanup and keyboard guards',async()=>{
 const p=await pageFor();await p.addScriptTag({content:source});await p.evaluate(()=>window.retired=window.TypingMindChatGPTTheme);await p.addScriptTag({content:source});assert.equal(await p.locator('#tm-cg-font-only-style').count(),1);
 await p.evaluate(()=>{const b={ctrlKey:true,altKey:true,code:'KeyG',cancelable:true};for(const extra of [{repeat:true},{shiftKey:true},{isComposing:true}])document.dispatchEvent(new KeyboardEvent('keydown',{...b,...extra}));const e=new KeyboardEvent('keydown',b);e.preventDefault();document.dispatchEvent(e);});assert.equal(await p.evaluate(()=>window.TypingMindChatGPTTheme.isEnabled()),true);
 await p.keyboard.press('Control+Alt+g');assert.equal(await p.evaluate(()=>window.TypingMindChatGPTTheme.isEnabled()),false);
 await p.addScriptTag({content:source.replace(/const version = '[^']+'/,'const version = "99.0.0"')});assert.deepEqual(await p.evaluate(()=>{window.retired.destroy();window.retired.disable();return{version:window.TypingMindChatGPTTheme.version,enabled:window.TypingMindChatGPTTheme.isEnabled()};}),{version:'99.0.0',enabled:true});
 await p.evaluate(()=>window.TypingMindChatGPTTheme.destroy());assert.equal(await p.locator('#tm-cg-font-only-style').count(),0);await p.close();
});
