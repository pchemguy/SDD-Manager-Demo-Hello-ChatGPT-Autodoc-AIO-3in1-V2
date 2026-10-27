/** Extracted page/sidebar/background bundles cooperate through a modeled native API broker.
 * Colors live only in actual page controllers. Window IDs, active tabs, grants and
 * native chrome surfaces are modeled; real browser documents/inputs/navigation render.
 */
import fs from 'node:fs/promises';import path from 'node:path';import vm from 'node:vm';
import{launch,finish,results}from'./support.mjs';import{serve}from'./server.mjs';
const platform=process.argv[2],runtime=path.resolve(process.argv[3]);
const fixture=path.join(results,'matrix-fixture-'+platform);await fs.mkdir(fixture,{recursive:true});
for(const name of ['sidebar.html','sidebar.css','sidebar.js'])await fs.copyFile(path.join(runtime,name),path.join(fixture,name));
await fs.copyFile('tests/fixtures/ordinary.html',path.join(fixture,'ordinary.html'));
const server=await serve(fixture);const{browser,done}=await launch(process.env.HELLO_TEST_BROWSER);
const contexts=new Map(),tabs=new Map(),active=new Map([[1,11],[2,21]]),sidebars=new Map(),errors=[],commands=[],injections=[];
let holdNext=null,dropNext=false,sequence=0;
const deferred=()=>{let release;const promise=new Promise(r=>release=r);return{promise,release};};
const tabInfo=id=>{const t=tabs.get(id);return{id,windowId:t.windowId,url:t.page.url(),incognito:false};};
async function content(id,message,sender='own-extension'){
 const tab=tabs.get(id);if(!tab)throw Error('No tab');
 const result=await tab.page.evaluate(({message,sender})=>{let response=null;__helloApi.runtime.onMessage.emit(message,{id:sender},r=>response=r);return response;},{message,sender});
 if(!result)throw Error('No receiver');return result;
}
const state=id=>content(id,{v:1,requestId:'snapshot-'+(++sequence),type:'GET_STATE'});
const color=async id=>(await state(id)).color;
async function emit(windowId,event,...args){const page=sidebars.get(windowId);if(page&&!page.isClosed())await page.evaluate(({event,args})=>__helloApi.tabs[event].emit(...args),{event,args});}
async function notify(tab){for(const page of sidebars.values())if(!page.isClosed())await page.evaluate(value=>__helloApi.runtime.onMessage.emit(value,{id:'own-extension'},()=>{}),{type:'HELLO_ACTIVATED',tabId:tab.id,windowId:tab.windowId});}
async function bridge(windowId,operation,args){
 if(operation==='window')return{id:windowId};
 if(operation==='query'){if(args.windowId!==windowId)throw Error('Wrong window query');return[tabInfo(active.get(windowId))];}
 if(operation==='send'){
  if(args.options.frameId!==0)throw Error('Wrong frame');
  if(args.message.type==='SET_COLOR'){
   commands.push({tabId:args.tabId,color:args.message.color,requestId:args.message.requestId});
   if(holdNext){const gate=holdNext;holdNext=null;await gate.promise;}
   const response=await content(args.tabId,args.message);
   if(dropNext){dropNext=false;return new Promise(()=>{});}return response;
  }
  return content(args.tabId,args.message);
 }
 throw Error('Unexpected modeled operation');
}
async function addWindow(id){
 const context=await browser.newContext({viewport:{width:1000,height:700}});contexts.set(id,context);
 await context.exposeBinding('__bridge',(_,operation,args)=>bridge(id,operation,args));
 await context.addInitScript(platform=>{
  const event=()=>{const listeners=new Set();return{addListener:f=>listeners.add(f),removeListener:f=>listeners.delete(f),emit:(...args)=>{for(const f of listeners)f(...args);},get size(){return listeners.size;}};};
  const api={runtime:{id:'own-extension',onMessage:event()},windows:{getCurrent:()=>__bridge('window')},tabs:{query:query=>__bridge('query',query),sendMessage:async(tabId,message,options)=>{const response=await __bridge('send',{tabId,message,options});__completedTransport.push(message.requestId);return response;},onActivated:event(),onUpdated:event(),onRemoved:event()}};
  globalThis.__completedTransport=[];globalThis.__helloApi=api;globalThis[platform==='firefox'?'browser':'chrome']=api;
 },platform);
}
async function addTab(id,windowId,url=server.url+'/ordinary.html'){
 const page=await contexts.get(windowId).newPage();page.on('pageerror',error=>errors.push(error.message));tabs.set(id,{page,windowId});await page.goto(url);return page;
}
async function openSidebar(windowId){
 if(sidebars.has(windowId)&&!sidebars.get(windowId).isClosed())return;
 const page=await contexts.get(windowId).newPage();await page.setViewportSize({width:200,height:600});page.on('pageerror',error=>errors.push(error.message));sidebars.set(windowId,page);await page.goto(server.url+'/sidebar.html');
 await page.waitForFunction(()=>document.querySelector('fieldset')&&document.querySelector('[role=status]')?.textContent);
}
function background(){
 let action;
 const api={action:{onClicked:{addListener:fn=>action=fn}},runtime:{sendMessage:message=>notify({id:message.tabId,windowId:message.windowId})},
  scripting:{executeScript:async options=>{if(options.world!=='ISOLATED'||JSON.stringify(options.target.frameIds)!=='[0]'||JSON.stringify(options.files)!=='["page.js"]')throw Error('Wrong injection');injections.push(options.target.tabId);await tabs.get(options.target.tabId).page.addScriptTag({path:path.join(runtime,'page.js')});}},
  sidePanel:{open:({windowId})=>openSidebar(windowId)},sidebarAction:{open:()=>openSidebar(tabInfo(activeAction).windowId)}};
 vm.runInNewContext(backgroundSource,{chrome:api,browser:api,Promise,console});return action;
}
let backgroundSource=await fs.readFile(path.join(runtime,'background.js'),'utf8'),action,activeAction;
async function activate(id){activeAction=id;await action(tabInfo(id));}
async function select(windowId,value){await sidebars.get(windowId).locator(`input[value=${value}]`).click();}
async function ready(windowId,value){await sidebars.get(windowId).waitForFunction(value=>!document.querySelector('fieldset').disabled&&document.querySelector('input:checked').value===value&&document.querySelector('[role=status]').textContent==='Page connected.',value);}
async function unavailable(windowId){await sidebars.get(windowId).waitForFunction(()=>document.querySelector('fieldset').disabled&&document.querySelector('[role=status]').textContent.includes('Unavailable'));return true;}
const selected=windowId=>sidebars.get(windowId).locator('input:checked').inputValue();
async function switchTab(windowId,id){active.set(windowId,id);await emit(windowId,'onActivated',{windowId,tabId:id});}
try{
 await addWindow(1);await addWindow(2);await addTab(11,1);await addTab(12,1);await addTab(21,2);action=background();
 await openSidebar(1);const initialUnavailable=await unavailable(1);
 await activate(11);await ready(1,'red');const activatedRed=await color(11)==='red';await select(1,'blue');await ready(1,'blue');
 await switchTab(1,12);await unavailable(1);await activate(12);await ready(1,'red');await select(1,'green');await ready(1,'green');
 await activate(21);await ready(2,'red');await select(2,'blue');await ready(2,'blue');
 await switchTab(1,11);await ready(1,'blue');await select(1,'red');await ready(1,'red');const independent=await Promise.all([11,12,21].map(color));
 await select(1,'blue');await ready(1,'blue');await sidebars.get(1).close();sidebars.delete(1);await openSidebar(1);await ready(1,'blue');const reopened=await selected(1);
 action=background();const backgroundRestart=await color(11);await tabs.get(11).page.evaluate(()=>history.pushState({},'','#same-document'));const spa=await color(11);
 await select(1,'red');await ready(1,'red');let gate=deferred();holdNext=gate;const before=commands.length;await select(1,'blue');await select(1,'red');gate.release();await ready(1,'red');
 // Wait for queued acknowledgment, not the preexisting checked red placeholder.
 await sidebars.get(1).waitForFunction(()=>document.querySelector('[role=status]').textContent==='Page connected.');
 const reselection={colors:commands.slice(before).map(c=>c.color),actual:await color(11)};
 gate=deferred();holdNext=gate;const switchStart=commands.length;await select(1,'blue');await select(1,'green');await switchTab(1,12);await ready(1,'green');gate.release();
 await tabs.get(11).page.waitForFunction(()=>document.querySelector('[data-hello-world-overlay]').shadowRoot.querySelector('p').style.color==='blue');
 await sidebars.get(1).waitForFunction(requestId=>__completedTransport.includes(requestId),commands[switchStart].requestId);
 const switchRace={targets:commands.slice(switchStart).map(c=>c.tabId),old:await color(11),selected:await color(12),ui:await selected(1)};
 await switchTab(1,11);await ready(1,'blue');const oldId=(await state(11)).documentId;
 await emit(1,'onUpdated',11,{status:'loading'},tabInfo(11));await tabs.get(11).page.reload();await emit(1,'onUpdated',11,{status:'complete'},tabInfo(11));const reloadUnavailable=await unavailable(1);
 await activate(11);await ready(1,'red');const fresh=await state(11);const stale=await content(11,{v:1,requestId:'stale',type:'SET_COLOR',documentId:oldId,color:'green'});
 const reload={unavailable:reloadUnavailable,fresh:fresh.color,newNonce:fresh.documentId!==oldId,stale:stale.error};
 await select(1,'green');await ready(1,'green');const cleaned=await tabs.get(11).page.evaluate(()=>{dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));return{panels:document.querySelectorAll('[data-hello-world-overlay]').length,listeners:__helloApi.runtime.onMessage.size};});
 await emit(1,'onUpdated',11,{status:'complete'},tabInfo(11));const cachedUnavailable=await unavailable(1);await activate(11);await ready(1,'red');const cachedSignal={...cleaned,unavailable:cachedUnavailable,fresh:await color(11)};
 await emit(1,'onUpdated',11,{status:'loading'},tabInfo(11));await tabs.get(11).page.goto(server.url+'/ordinary.html?new-document');await emit(1,'onUpdated',11,{status:'complete'},tabInfo(11));const navigationUnavailable=await unavailable(1);await activate(11);await ready(1,'red');const navigation={unavailable:navigationUnavailable,fresh:await color(11)};
 dropNext=true;const timeoutStart=commands.length;await select(1,'blue');await ready(1,'blue');const timeout={mutations:commands.length-timeoutStart,actual:await color(11),ui:await selected(1)};
 const liveId=(await state(11)).documentId;const invalid=[(await content(11,{v:2,requestId:'invalid',type:'SET_COLOR',documentId:liveId,color:'green'})).error,(await content(11,{v:1,requestId:'foreign',type:'SET_COLOR',documentId:liveId,color:'green'},'foreign-extension')).error,await color(11)];
 await addTab(99,1,'about:blank');await switchTab(1,99);const unsupported=await unavailable(1),injectionCount=injections.length;await activate(99);const noUnsupportedInjection=injections.length===injectionCount;
 await switchTab(1,11);await ready(1,'blue');await tabs.get(11).page.screenshot({path:path.join(results,'matrix-'+platform+'-page.png')});await sidebars.get(1).screenshot({path:path.join(results,'matrix-'+platform+'-sidebar.png')});
 finish({initialUnavailable,activatedRed,independent,reopened,backgroundRestart,spa,reselection,switchRace,reload,cachedSignal,navigation,timeout,invalid,unsupported,noUnsupportedInjection,errors});
}finally{for(const context of contexts.values())await context.close();await browser.close();done();await server.close();}
