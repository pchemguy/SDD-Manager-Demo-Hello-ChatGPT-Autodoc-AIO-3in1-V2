/** Toolbar coordinator behavior against a modeled native integration boundary. */
import{installActivation}from'../../src/extensions/activation.js';
const cases=[];
for(const kind of ['ordinary','restricted','private','denied']){
 const calls=[];let handler;
 const adapter={onAction:fn=>{handler=fn;return()=>{};},openSidebar:tab=>{calls.push(['open',tab.windowId]);return Promise.resolve();},activate:async tab=>{calls.push(['inject',tab.id]);if(kind==='denied')throw Error('Denied');},notify:async tab=>calls.push(['notify',tab.id,tab.windowId])};
 installActivation(adapter);await handler({id:17,windowId:4,url:kind==='restricted'?'chrome://settings':'https://ordinary.test',incognito:kind==='private'});cases.push({kind,calls});
}
console.log(JSON.stringify(cases));
