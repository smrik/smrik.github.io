const {chromium}=require('/home/smrik/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({executablePath:'/tmp/patrik-edge-browser/opt/microsoft/msedge/msedge'});
try {
  const page=await browser.newPage({viewport:{width:412,height:721},screen:{width:412,height:892},deviceScaleFactor:2.8125,hasTouch:true,isMobile:true,colorScheme:'dark'});
  for(const slug of ['/','/Inflation-perceptions']){
    await page.setViewportSize({width:412,height:721});
    await page.goto('https://blog.patriksmid.com'+slug,{waitUntil:'domcontentloaded',timeout:20000});
    await page.locator('patrik-navigation .ps-bar').waitFor({timeout:10000,state:'attached'});
    if(process.argv.includes('--test-fix')) await page.addStyleTag({content:`
      @media (max-width: 800px) {
        .page > #quartz-body { grid-template-columns: minmax(0, 1fr); }
      }
    `});
    for(const width of [320,412,1280]){
      await page.setViewportSize({width,height:721});
      await page.waitForTimeout(200);
      console.log(slug,width,JSON.stringify(await page.evaluate(()=>{
        const cw=document.documentElement.clientWidth;
        const segments=[...document.querySelectorAll('*')].map(e=>[e,e.getBoundingClientRect()]).filter(([e,r])=>r.width>0&&r.right>cw+.5).sort(([,a],[,b])=> b.right-a.right);
        return {cw,sw:document.documentElement.scrollWidth,height:innerHeight,width:innerWidth,visual:visualViewport.width,overflow:segments.slice(0,18).map(([e,r])=>[e.tagName,e.id,e.className?.baseVal??e.className,Math.round(r.left),Math.round(r.right),getComputedStyle(e).position,e.innerText?.slice(0,35)])};
      })));
    }
  }
} finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
