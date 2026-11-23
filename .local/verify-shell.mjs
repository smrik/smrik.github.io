import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
const shared = '/home/smrik/Projects/patriksmid.com-cloud/public';
const live = process.argv.includes('--live');
const themeURL = 'https://patriksmid.com/theme/';
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webp':'image/webp', '.png':'image/png'};
const roots = ['/home/smrik/Projects/patrik-quartz-shell/public','/home/smrik/Projects/life-in-rooms/dist'];
const servers = [];
async function serve(root) {
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    try {
      let file;
      if (['/theme/v1.css','/theme/v2.css','/theme/v2.js','/theme/shell.css','/theme/shell.js'].includes(pathname)) file = shared + pathname;
      else {
        file = resolve(root, '.' + pathname);
        if (pathname.endsWith('/')) file += (file.endsWith(sep) ? '' : sep) + 'index.html';
        else if (!extname(file)) file += '.html';
        assert.ok(file.startsWith(root + sep));
      }
      const type = types[extname(file)] ?? 'application/octet-stream';
      let content = await readFile(file);
      if (type === 'text/html') content = String(content).replaceAll(themeURL, '/theme/');
      response.writeHead(200, {'content-type': type}).end(content);
    } catch {
      response.writeHead(404).end();
    }
  });
  servers.push(server);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return 'http://127.0.0.1:' + server.address().port;
}
const sources = live ? ['https://blog.patriksmid.com', 'https://life.patriksmid.com'] : [await serve(roots[0]), await serve(roots[1])];
const profile = await mkdtemp('/home/smrik/Projects/patrik-quartz-shell/.local/browser-');
await writeFile(profile + '/user.js', 'user_pref("webgl.force-enabled", true);\nuser_pref("gfx.webrender.software", true);\n');
const browser = spawn('firefox',['--headless','--no-remote','--profile',profile,'--remote-debugging-port','0','about:blank'],{stdio:['ignore','pipe','pipe'],env:{...process.env,LIBGL_ALWAYS_SOFTWARE:'1'}});
try {
  const url = await new Promise((resolve,reject) => {
    const timer = setTimeout(() => reject(Error('Browser startup timeout')), 16000);
    const parse = chunk => {
      const found = String(chunk).match(/ws:\/\/[^\s]+/);
      if (found) {
        clearTimeout(timer);
        resolve(new URL('/session', found[0]));
      }
    };
    browser.stdout.on('data',parse);
    browser.stderr.on('data',parse);
    browser.on('exit', (code) => {
      clearTimeout(timer);
      reject(Error('Browser exited ' + code));
    });
  });
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (!pending.has(message.id)) return;
    const [resolve, reject] = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(Error(message.message)) : resolve(message.result);
  };
  const call = (method,params) => new Promise((resolve,reject) => {
    pending.set(++id, [resolve,reject]);
    ws.send(JSON.stringify({id,method,params}));
  });
  await call('session.new',{capabilities:{}});
  const {context} = await call('browsingContext.create',{type:'tab'});
  const evaluate = async (expression) => {
    const result = await call('script.evaluate',{expression,target:{context},awaitPromise:true});
    if (result.type !== 'success') throw Error(JSON.stringify(result));
    return result.result.value;
  };
  const visit = url => call('browsingContext.navigate', {context,url,wait:'complete'});
  for (const [i, source] of sources.entries()) {
    if (process.argv.includes('--game-only') && i === 0) continue;
    await call('browsingContext.setViewport',{context,viewport:{width:320,height:900}});
    await visit(source + '/');
    for (const width of [320,390,800,897,1024,1200,1440]) {
      await call('browsingContext.setViewport',{context,viewport:{width,height:900}});
      await delay(100);
      const result = JSON.parse(await evaluate(`JSON.stringify({
        view: innerWidth,
        scroll: document.documentElement.scrollWidth,
        rail: getComputedStyle(document.querySelector('.ps-rail')).display,
        bar: getComputedStyle(document.querySelector('.ps-bar')).display,
        source: getComputedStyle(document.querySelector('[data-patrik-shell]')).display,
        panel: Math.ceil(document.querySelector('.game-grid, #quartz-body').getBoundingClientRect().right),
        current: document.querySelector('.ps-link[aria-current="page"]')?.textContent
      })`));
      console.log(source, width, JSON.stringify(result));
      assert.equal(result.view, width);
      assert.ok(result.scroll <= width, 'Document fits viewport');
      assert.ok(result.panel <= width, 'Content panel fits viewport');
      assert.equal(result.rail !== 'none', width > 896);
      assert.equal(result.bar !== 'none', width <= 896);
      assert.equal(result.source, 'none');
      assert.equal(result.current, i === 0 ? 'Blog' : 'Life in Rooms');
    }
    await call('browsingContext.setViewport',{context,viewport:{width:390,height:880}});
    await visit(source + '/');
    await evaluate("document.querySelector('.ps-toggle').click()");
    assert.ok(await evaluate("document.querySelector('.ps-drawer').open"));
    assert.equal(await evaluate("document.querySelector('.ps-toggle').getAttribute('aria-expanded')"), 'true');
    await evaluate(`(() => {
      const select = document.querySelector('.ps-drawer select[data-patrik-theme]');
      select.value = 'dark';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    assert.equal(await evaluate("document.documentElement.dataset.theme"), 'dark');
    assert.equal(await evaluate("getComputedStyle(document.documentElement).getPropertyValue('--patrik-bg').trim()"), '#202022');
    await evaluate("document.querySelector('.ps-close').click()");
    await delay(100);
    assert.equal(await evaluate("document.querySelector('.ps-drawer').open"), false);
    assert.equal(await evaluate("document.activeElement.className"), 'ps-toggle');
    if (i === 0) {
      assert.equal(await evaluate("document.documentElement.getAttribute('saved-theme')"), 'dark');
      await evaluate(`window.navigationProbe = 1; [...document.querySelectorAll('a.internal')].find(a => a.pathname.includes('Inflation-perceptions')).click()`);
      for (let attempt = 0; attempt < 30 && !await evaluate(`location.pathname.includes('Inflation-perceptions') && document.querySelector('article img') !== null`); attempt++) await delay(250);
      assert.match(await evaluate('location.pathname'), /Inflation-perceptions/);
      assert.equal(await evaluate('window.navigationProbe'), 1);
      assert.equal(await evaluate("document.querySelectorAll('patrik-navigation').length"), 1);
      await evaluate("document.querySelector('.ps-toggle').click()");
      assert.ok(await evaluate("document.querySelector('.ps-drawer').open"));
      assert.equal(await evaluate("document.querySelector('.ps-drawer select').value"), 'dark');
      await evaluate("document.querySelector('.ps-close').click()");
      await delay(100);
      for (let attempt = 0; attempt < 20 && await evaluate("document.querySelector('button.mobile-explorer')?.classList.contains('hide-until-loaded')"); attempt++) await delay(100);
      await evaluate("document.querySelector('button.mobile-explorer').click()");
      assert.ok(await evaluate("document.querySelector('.explorer').getAttribute('aria-expanded') === 'true'"));
      console.log('Quartz theme, SPA navigation, drawer and Explorer passed');
    } else {
      assert.equal(await evaluate("document.querySelectorAll('#quest-list button').length"), 7);
      await evaluate("document.querySelector('button[data-filter=movement]').click()");
      assert.equal(await evaluate("document.querySelector('button[data-filter=movement]').getAttribute('aria-pressed')"), 'true');
      assert.ok(await evaluate("document.querySelectorAll('#quest-list button').length < 7"));
      await evaluate("document.querySelector('#how-to').click()");
      assert.equal(await evaluate("document.querySelector('#help-dialog').open"), true);
      await evaluate("document.querySelector('#help-dialog').close(); document.querySelector('button[data-filter=all]').click(); document.querySelector('#quest-list button').click()");
      await evaluate("document.querySelector('#complete-task').click()");
      assert.match(await evaluate("document.querySelector('#complete-task').textContent"), /Undo/);
      await visit(source + '/');
      assert.match(await evaluate("document.querySelector('#complete-task').textContent"), /Undo/);
      await evaluate("document.querySelector('#complete-task').click(); document.querySelector('#add-quest').click()");
      assert.equal(await evaluate("document.querySelector('#add-dialog').open"), true);
      console.log('Game filter, help, completion, save reload, undo and add dialog passed');
    }
  }
  await call('session.end', {});
  ws.close();
} finally {
  browser.kill('SIGTERM');
  for (const server of servers) await new Promise(resolve => server.close(resolve));
  await rm(profile,{recursive:true,force:true});
}
