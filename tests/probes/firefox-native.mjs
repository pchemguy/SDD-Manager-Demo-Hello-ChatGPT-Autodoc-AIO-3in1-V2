/** Bounded temporary-addon installation in a dedicated managed Firefox profile. */
import fs from'node:fs/promises';import path from'node:path';import{spawn}from'node:child_process';
const directory=process.argv[2]||'build/extensions/firefox';
await fs.mkdir('.tools/profiles',{recursive:true});const profile=await fs.mkdtemp(path.resolve('.tools/profiles/firefox-native-'));
const command=['.tools/web-ext/node_modules/web-ext/bin/web-ext.js','run','--source-dir',directory,'--firefox',path.resolve('.tools/browsers/firefox-1555/firefox/firefox'),'--firefox-profile',profile,'--profile-create-if-missing','--keep-profile-changes','--no-reload','--no-input','--start-url','about:blank','--arg=-headless'];
const child=spawn(process.execPath,command,{detached:true,env:{...process.env,MOZ_DISABLE_CONTENT_SANDBOX:'1'},stdio:['ignore','pipe','pipe']});let output='',stopping=false;
const stop=()=>{if(stopping)return;stopping=true;try{process.kill(-child.pid,'SIGTERM');}catch{}};
child.stdout.on('data',data=>{output+=data;if(/Installed .*temporary add-on/.test(output))stop();});child.stderr.on('data',data=>{output+=data;});
const deadline=setTimeout(stop,25000);const force=setTimeout(()=>{try{process.kill(-child.pid,'SIGKILL');}catch{}},30000);
const code=await new Promise(resolve=>child.on('close',(code,signal)=>resolve({code,signal})));
clearTimeout(deadline);clearTimeout(force);await fs.rm(profile,{recursive:true,force:true});
await fs.writeFile('.test-results/firefox-native-install.log',output);
const result={installed:/Installed .*temporary add-on/.test(output),...code,tool:'web-ext 10.8.0',binary:'managed Firefox 157.0',source:directory};await fs.writeFile('.test-results/firefox-native-capability.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
