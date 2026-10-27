/** Real sidebar DOM with deterministic modeled tabs, transport races and errors. */
import fs from 'node:fs/promises';import path from 'node:path';import {build} from 'esbuild';
import {launch,finish,results} from './support.mjs';import{serve}from'./server.mjs';
const dir=path.join(results,'sidebar-'+process.env.HELLO_TEST_BROWSER);await fs.mkdir(dir,{recursive:true});
await fs.copyFile('src/extensions/sidebar/sidebar.css',path.join(dir,'sidebar.css'));
await fs.writeFile(path.join(dir,'index.html'),'<html><head><link rel="stylesheet" href="sidebar.css"></head><body><main id="sidebar"></main></body></html>');
await build({entryPoints:['src/extensions/sidebar/controller.js'],bundle:true,format:'esm',outfile:path.join(dir,'entry.js')});
const server=await serve(dir);const{browser,done}=await launch(process.env.HELLO_TEST_BROWSER);
try{const page=await browser.newPage({viewport:{width:200,height:600}});await page.goto(server.url);
const result=await page.evaluate(async()=>{
 const{createSidebar}=await import('/entry.js');const root=document.querySelector('#sidebar');
 let active=11,subscribers=new Set(),holdSet=null,holdGet=null,timeoutSet=false,badReply=false;
 const pages=new Map([[11,{documentId:'a',color:'red'}],[12,{documentId:'b',color:'green'}],[21,{documentId:'c',color:'blue'}]]);const messages=[],queries=[];
 const adapter={getWindowId:async()=>1,getActiveTab:async windowId=>{queries.push(windowId);return{id:active,windowId:1,url:active===99?'chrome://settings':'https://ordinary.test'};},subscribe:fn=>{subscribers.add(fn);return()=>subscribers.delete(fn);},send:async(tabId,req)=>{
  messages.push({tabId,...req});const gate=req.type==='SET_COLOR'?holdSet:holdGet;if(gate){if(req.type==='SET_COLOR')holdSet=null;else holdGet=null;await gate.promise;}
  const state=pages.get(tabId);if(!state)throw Error('No receiver');
  if(req.type==='SET_COLOR'&&req.documentId!==state.documentId)return{v:1,requestId:req.requestId,ok:false,error:'STALE_DOCUMENT'};
  if(req.type==='SET_COLOR')state.color=req.color;
  if(req.type==='SET_COLOR'&&timeoutSet){timeoutSet=false;return new Promise(()=>{});}
  const requestId=badReply&&req.type==='SET_COLOR'?'wrong-request':req.requestId;if(req.type==='SET_COLOR')badReply=false;return{v:1,requestId,ok:true,...state};
 }};
 const deferred=()=>{let release;const promise=new Promise(r=>release=r);return{promise,release};};
 const emit=event=>{for(const f of subscribers)f(event);};
 const snapshot=()=>({color:root.querySelector('input:checked')?.value,checked:root.querySelectorAll('input:checked').length,disabled:root.querySelector('fieldset')?.disabled,status:root.querySelector('[role=status]')?.textContent});
 const wait=async condition=>{const end=Date.now()+4000;while(!condition()){if(Date.now()>end)throw Error('Wait expired '+JSON.stringify(snapshot()));await new Promise(r=>setTimeout(r,5));}};
 const select=color=>root.querySelector(`input[value=${color}]`).click();
 let controller=createSidebar(root,adapter);await controller.ready;const initial=snapshot();
 if(!root.querySelector('input'))return{initial};
 select('blue');await wait(()=>snapshot().color==='blue');const selected=snapshot();
 emit({type:'activated',windowId:2,tabId:21});await new Promise(r=>setTimeout(r,10));const otherWindow=snapshot();
 const gate=deferred();holdSet=gate;select('red');select('blue');select('green');select('red');
 const start=messages.length;gate.release();await wait(()=>!snapshot().status.includes('Applying'));const coalesced=messages.slice(start).filter(m=>m.type==='SET_COLOR').map(m=>m.color);
 const reselectGate=deferred();holdSet=reselectGate;select('blue');select('red');reselectGate.release();await wait(()=>!snapshot().status.includes('Applying'));const reselected={ui:snapshot(),actual:pages.get(11).color};
 const switchedGate=deferred();holdSet=switchedGate;select('blue');select('green');active=12;emit({type:'activated',windowId:1,tabId:12});await wait(()=>snapshot().color==='green'&&!snapshot().disabled);switchedGate.release();await new Promise(r=>setTimeout(r,20));
 const switched={ui:snapshot(),old:pages.get(11).color,target:pages.get(12).color,wrong:messages.filter(m=>m.type==='SET_COLOR'&&m.tabId!==11).length};
 controller.dispose();controller=createSidebar(root,adapter);await controller.ready;const reopened=snapshot();
 const oldProbe=deferred();holdGet=oldProbe;active=11;const pending=controller.refresh();await new Promise(r=>setTimeout(r,10));active=12;await controller.refresh();oldProbe.release();await pending;const late=snapshot();
 active=11;await controller.refresh();timeoutSet=true;const mutations=messages.filter(m=>m.type==='SET_COLOR').length;select('red');await wait(()=>snapshot().color==='red'&&!snapshot().disabled&&snapshot().status.includes('connected'));const timeout={ui:snapshot(),actual:pages.get(11).color,mutations:messages.filter(m=>m.type==='SET_COLOR').length-mutations};
 badReply=true;select('blue');await wait(()=>snapshot().color==='blue'&&!snapshot().disabled);const invalidReply=snapshot();
 const staleGate=deferred();holdSet=staleGate;select('green');pages.set(11,{documentId:'replaced',color:'red'});staleGate.release();await wait(()=>snapshot().status.includes('Document changed'));const stale={ui:snapshot(),actual:pages.get(11).color};await controller.refresh();
 emit({type:'loading',windowId:1,tabId:11});const navigating=snapshot();pages.delete(11);emit({type:'complete',windowId:1,tabId:11});await wait(()=>snapshot().status.includes('Unavailable'));const unavailable=snapshot();
 pages.set(11,{documentId:'new',color:'red'});emit({type:'activation',windowId:1,tabId:11});await wait(()=>!snapshot().disabled);const recovered=snapshot();
 active=99;await controller.refresh();const unsupported=snapshot();
 const geometry={overflow:document.documentElement.scrollWidth>innerWidth,labels:[...root.querySelectorAll('label')].map(l=>l.textContent),exclusive:snapshot().checked};
 active=11;await controller.refresh();const disposeGate=deferred();holdSet=disposeGate;select('green');controller.dispose();disposeGate.release();await new Promise(r=>setTimeout(r,20));const remaining=root.children.length,subscriptions=subscribers.size;active=12;await createSidebar(root,adapter).ready;return{initial,selected,otherWindow,coalesced,reselected,switched,reopened,late,timeout,invalidReply,stale,navigating,unavailable,recovered,unsupported,geometry,queries,remaining,subscriptions};
});await page.screenshot({path:path.join(results,'extension-sidebar-'+process.env.HELLO_TEST_BROWSER+'.png')});finish(result);
}finally{await browser.close();done();await server.close();}
