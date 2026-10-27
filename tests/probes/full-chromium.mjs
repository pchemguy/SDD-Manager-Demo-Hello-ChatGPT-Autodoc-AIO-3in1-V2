/** Diagnose dedicated managed full Chromium, independently from the working headless shell. */
import{chromium}from'playwright';import fs from'node:fs/promises';import path from'node:path';
await fs.mkdir('.tools/profiles',{recursive:true});const outcomes=[];
for(let cycle=0;cycle<2;cycle++){
 const profile=await fs.mkdtemp(path.resolve('.tools/profiles/full-probe-'));let context;
 try{context=await chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,timeout:10000});const page=await context.newPage();await page.setContent('<button>Probe</button><p>red</p>');await page.locator('button').click();await page.screenshot({path:`.test-results/full-chromium-${cycle}.png`});outcomes.push({cycle,usable:true,version:context.browser()?.version()});}
 catch(error){outcomes.push({cycle,usable:false,error:String(error)});break;}
 finally{if(context)await context.close();await fs.rm(profile,{recursive:true,force:true});}
}
await fs.writeFile('.test-results/full-chromium-capability.json',JSON.stringify({outcomes},null,2));console.log(JSON.stringify({outcomes}));
