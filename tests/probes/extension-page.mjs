/** Exercise real page DOM/controller with explicitly modeled runtime messaging. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import { launch, finish, results } from './support.mjs';
import { serve } from './server.mjs';
const directory=path.join(results,'page-protocol-'+process.env.HELLO_TEST_BROWSER);
await fs.mkdir(directory,{recursive:true});
await fs.copyFile('tests/fixtures/ordinary.html',path.join(directory,'index.html'));
await build({stdin:{contents:"export {activatePage} from './src/extensions/page.js'; export {validRequest} from './src/extensions/protocol.js';",resolveDir:process.cwd()},bundle:true,format:'esm',outfile:path.join(directory,'entry.js')});
await fs.writeFile(path.join(directory,'sample.xhtml'), '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>XHTML</title></head><body><p>Existing XHTML</p></body></html>');
const server=await serve(directory);const {browser,done}=await launch(process.env.HELLO_TEST_BROWSER);
try {
 const page=await browser.newPage({viewport:{width:1000,height:700}});await page.goto(server.url);
 const result=await page.evaluate(async()=>{
  const {activatePage,validRequest}=await import('/entry.js');
  const listeners=new Set();const runtime={id:'own-extension',onMessage:{addListener:f=>listeners.add(f),removeListener:f=>listeners.delete(f)}};
  let id=0;const req=(type,data={})=>({v:1,requestId:String(++id),type,...data});
  const rpc=(message,sender={id:runtime.id})=>{let response=null;for(const f of listeners)f(message,sender,r=>{response=r});return response;};
  const state=()=>rpc(req('GET_STATE'));const color=()=>document.querySelector('[data-hello-world-overlay]')?.shadowRoot.querySelector('p').style.color;
  const input=document.querySelector('#focus');input.focus();const before=document.querySelector('#fixture').getBoundingClientRect().toJSON();
  activatePage(runtime);const first=state();const initial={state:first,color:color(),count:document.querySelectorAll('[data-hello-world-overlay]').length};
  if(first){rpc(req('SET_COLOR',{documentId:first.documentId,color:'blue'}));}
  activatePage(runtime);const repeated={state:state(),count:document.querySelectorAll('[data-hello-world-overlay]').length};
  const stale=rpc(req('SET_COLOR',{documentId:'other-document',color:'green'}));
  const invalid=rpc(req('SET_COLOR',{documentId:first?.documentId,color:'purple'}));
  const external=rpc(req('SET_COLOR',{documentId:first?.documentId,color:'green'}),{id:'other-extension'});
  history.pushState({},'', '#same-document');const spa=state();
  const host=document.querySelector('[data-hello-world-overlay]');const box=host?.getBoundingClientRect();
  const untouched={geometry:JSON.stringify(before)===JSON.stringify(document.querySelector('#fixture').getBoundingClientRect().toJSON()),focus:document.activeElement===input,pointer:host&&getComputedStyle(host).pointerEvents,center:box&&Math.abs(box.x+box.width/2-innerWidth/2)<2};
  window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));const cleaned={panels:document.querySelectorAll('[data-hello-world-overlay]').length,listeners:listeners.size};
  activatePage(runtime);const restarted=state();
  const vectors=[validRequest(req('GET_STATE')),validRequest(req('SET_COLOR',{documentId:'doc',color:'green'})),...[null,{},req('UNKNOWN'),req('GET_STATE',{v:2}),req('GET_STATE',{requestId:''}),req('GET_STATE',{requestId:'x'.repeat(129)}),req('SET_COLOR',{color:'blue'}),req('SET_COLOR',{documentId:'doc',color:'purple'})].map(validRequest)];
  return {initial,repeated,stale,invalid,external,spa,untouched,cleaned,restarted,vectors};
 });
 await page.screenshot({path:path.join(results,'extension-page-'+process.env.HELLO_TEST_BROWSER+'.png')});await page.goto(server.url+'/sample.xhtml');
 result.xhtml=await page.evaluate(async()=>{const {activatePage}=await import('/entry.js');try{activatePage({id:'own',onMessage:{addListener(){},removeListener(){}}});return document.querySelector('[data-hello-world-overlay]')?.shadowRoot.querySelector('p').textContent;}catch{return null;}});
 finish(result);
}finally{await browser.close();done();await server.close();}
