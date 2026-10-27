/** Execute the actual bundled content entry with native-shaped nested runtime APIs. */
import fs from'node:fs/promises';import path from'node:path';import{launch,finish,results}from'./support.mjs';import{serve}from'./server.mjs';
const platform=process.argv[2];const runtime=process.argv[3]||`build/extensions/${platform}`;const dir=path.join(results,'entry-'+platform);await fs.mkdir(dir,{recursive:true});await fs.copyFile('tests/fixtures/ordinary.html',path.join(dir,'index.html'));
const server=await serve(dir);const{browser,done}=await launch(process.env.HELLO_TEST_BROWSER);
try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(server.url);
await page.evaluate(platform=>{const listeners=new Set();const api={runtime:{id:'own-extension',onMessage:{addListener:fn=>listeners.add(fn),removeListener:fn=>listeners.delete(fn)}}};globalThis[platform==='firefox'?'browser':'chrome']=api;globalThis.contentListeners=listeners;},platform);
for(let i=0;i<2;i++)await page.addScriptTag({path:`${runtime}/page.js`});
const state=await page.evaluate(()=>{let response=null;for(const fn of contentListeners)fn({v:1,requestId:'entry',type:'GET_STATE'},{id:'own-extension'},r=>response=r);return{panels:document.querySelectorAll('[data-hello-world-overlay]').length,listeners:contentListeners.size,response};});
finish({...state,errors});}finally{await browser.close();done();await server.close();}
