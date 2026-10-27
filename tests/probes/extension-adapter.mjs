/** Execute built native background and real adapter against narrowly modeled browser APIs. */
import fs from 'node:fs/promises';import vm from 'node:vm';
import{createNativeAdapter}from'../../src/extensions/native-adapter.js';
const platform=process.argv[2];const directory=process.argv[3]||`build/extensions/${platform}`;const calls=[],events={};
function event(name){const listeners=new Set();events[name]=listeners;return{addListener:fn=>listeners.add(fn),removeListener:fn=>listeners.delete(fn)};}
const api={action:{onClicked:event('action')},runtime:{id:'own',onMessage:event('message'),sendMessage:async value=>calls.push(['notify',value])},
 windows:{getCurrent:async()=>({id:8})},tabs:{query:async value=>{calls.push(['query',value]);return[{id:31,windowId:8}];},sendMessage:async(...args)=>{calls.push(['send',...args]);return{ok:true};},onActivated:event('activated'),onUpdated:event('updated'),onRemoved:event('removed')},
 scripting:{executeScript:async value=>calls.push(['inject',value])},sidePanel:{open:value=>{calls.push(['open',value]);return Promise.resolve();}},sidebarAction:{open:()=>{calls.push(['open']);return Promise.resolve();}}};
vm.runInNewContext(await fs.readFile(`${directory}/background.js`,'utf8'),{chrome:api,browser:api,console});
const startupCalls=calls.length;await [...events.action][0]({id:31,windowId:8,url:'https://ordinary.test'});const activation=calls.splice(0);
const adapter=createNativeAdapter(api,platform);const windowId=await adapter.getWindowId();await adapter.getActiveTab(windowId);await adapter.send(31,{v:1,type:'GET_STATE',requestId:'r'});
const delivered=[];const off=adapter.subscribe(e=>delivered.push(e));
for(const fn of events.activated)fn({tabId:31,windowId:8});for(const fn of events.updated)fn(31,{status:'loading'},{windowId:8});for(const fn of events.updated)fn(31,{url:'https://ordinary.test/#spa'},{windowId:8});for(const fn of events.removed)fn(31,{windowId:8});
for(const fn of events.message){fn({type:'HELLO_ACTIVATED',tabId:31,windowId:8},{id:'foreign'});fn({type:'HELLO_ACTIVATED',tabId:31,windowId:8},{id:'own'});}
off();console.log(JSON.stringify({startupCalls,activation,transport:calls,delivered,remaining:[events.activated,events.updated,events.removed,events.message].reduce((n,s)=>n+s.size,0)}));
