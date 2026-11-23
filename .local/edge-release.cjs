const {chromium}=require('/home/smrik/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const join=(_folder,name)=>'/home/smrik/Projects/screenshots-theme/sidebar-release/'+name;
(async()=>{
const browser=await chromium.launch({executablePath:'/tmp/patrik-edge-browser/opt/microsoft/msedge/msedge'});
try {
for(const [i,url] of process.argv.slice(2).entries()){
const name=new URL(url).hostname.split('.')[0],p=await browser.newPage({viewport:{width:412,height:721},screen:{width:412,height:892},deviceScaleFactor:2.8125,hasTouch:true,isMobile:true,colorScheme:'dark'});
await p.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
const shell=p.locator('patrik-navigation');
await shell.locator('.ps-bar').waitFor({timeout:10000});
const result=[];
for(const w of [320,412,1280]){
 await p.setViewportSize({width:w,height:721});
 const [cw,sw]=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
 assert(sw<=cw+1,name+' overflow '+w+': '+sw);
 if(w===1280){assert(await shell.locator('.ps-rail').isVisible());continue;}
 const opener=shell.getByRole('button',{name:'Open navigation'});
 if(w===412)await p.screenshot({path:join(__dirname,name+'-phone.png'),scale:'css',animations:'disabled'});
 await opener.click();assert(await shell.locator('dialog').isVisible());
 const links=await shell.locator('dialog nav a').allTextContents();
 assert(links.length,name+' empty nav');
 if(w===412)await p.screenshot({path:join(__dirname,name+'-menu.png'),scale:'css',animations:'disabled'});
 const pick=shell.locator('dialog select');
 if(await pick.count()){
  await pick.selectOption('light');
  assert.equal(await p.locator('html').getAttribute('data-theme'),'light');
  await pick.selectOption('dark');
 }
 await p.keyboard.press('Escape');
 await shell.locator('dialog').waitFor({state:'hidden',timeout:3000});
 await p.waitForFunction(()=>document.activeElement?.classList.contains('ps-toggle'));result.push([w,links.length]);
}
await p.screenshot({path:join(__dirname,name+'-desktop.png'),scale:'css',animations:'disabled'});
if(name==='blog'){
 await p.setViewportSize({width:320,height:721});
 await p.locator('.search-button').click();
 const search=p.locator('.search-container');
 await search.waitFor({state:'visible',timeout:3000});
 await p.keyboard.press('Escape');
 await search.waitFor({state:'hidden',timeout:3000});
 await p.goto(new URL('/Inflation-perceptions',url).href,{waitUntil:'domcontentloaded',timeout:20000});
 for(const width of [320,412]){
   await p.setViewportSize({width,height:721});
   await p.waitForTimeout(200);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth===document.documentElement.clientWidth));
 }
}
console.log(name,'passed',result);await p.close();
}
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
