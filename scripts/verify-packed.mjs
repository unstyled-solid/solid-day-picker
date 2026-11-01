import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { chromium } from 'playwright';
import os from 'node:os';

const temporaryRoot = path.join(os.tmpdir(), 'opencode');
const calendars=['buddhist','ethiopic','hebrew','hijri','persian'];
const work = process.argv[2] ?? await fs.mkdtemp(path.join(temporaryRoot, 'daypicker-packed-'));
const env = { ...process.env, NODE_OPTIONS: '', npm_config_userconfig: path.join(work, '.npmrc'), npm_config_cache: path.join(work, '.cache') };
await fs.writeFile(env.npm_config_userconfig, '');
const command = (name, args, cwd = work) => execFileSync(name, args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const packed = JSON.parse(command('npm', ['pack', '--json', '--pack-destination', work], path.resolve('packages/solid')))[0];
const packedFile = path.join(work, packed.filename);
assert(!packed.files.some(file => /\.(test|spec)\.|source-copy|node_modules|\.tsx?$/.test(file.path.replace(/\.d\.ts$/, '.declaration'))));
const sha256 = createHash('sha256').update(await fs.readFile(packedFile)).digest('hex');
const tarball = path.join(work, `solid-unstyled-daypicker-${sha256}.tgz`);
await fs.rename(packedFile, tarball);
await fs.writeFile(path.join(work, 'package.json'), JSON.stringify({
  name: 'daypicker-independent-consumer', private: true, type: 'module',
  dependencies: { '@solid-unstyled/daypicker': `file:${tarball}`, 'solid-js': '2.0.0-rc.20', '@solidjs/web': '2.0.0-rc.20' },
  devDependencies: { vite: '8.3.2', '@solidjs/vite-plugin': '3.0.0-next.54', '@babel/core': '7.29.7', typescript: '5.9.3' },
  overrides: { 'solid-js': '2.0.0-rc.20', '@solidjs/web': '2.0.0-rc.20', '@solidjs/signals': '2.0.0-rc.20', '@solidjs/compiler': '2.0.0-rc.20' },
}, null, 2));
console.log(`Installing exact tarball into independent stock-peer consumer: ${work}`);
  command('npm', ['install', '--no-audit', '--no-fund']);
for (const file of packed.files) {
  assert.deepEqual(await fs.readFile(path.join(work, 'node_modules/@solid-unstyled/daypicker', file.path)),
    await fs.readFile(path.join('packages/solid', file.path)), `Installed archive differs: ${file.path}`);
}
for (const name of ['App.tsx', 'client.tsx', 'server.tsx']) await fs.copyFile(`test/packed/${name}`, path.join(work, name));
await fs.writeFile(path.join(work, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
  target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'preserve', jsxImportSource: '@solidjs/web',
  strict: true, skipLibCheck: false, types: [], lib: ['ES2022', 'DOM', 'DOM.Iterable'],
}, include: ['App.tsx', 'client.tsx', 'server.tsx'] }));
command('npm', ['exec', '--', 'tsc', '--noEmit']);
await fs.writeFile(path.join(work, 'consumer-types.tsx'), `
import {DayPicker,DayButton,CalendarDay,DateLib,useDayPicker,type DayPickerProps} from '@solid-unstyled/daypicker';
import {enUS} from '@solid-unstyled/daypicker/locale'; import {fr} from '@solid-unstyled/daypicker/locale/fr';
import styles from '@solid-unstyled/daypicker/style.module.css';
const props:DayPickerProps={mode:'single',required:true,selected:new Date(),onSelect:date=>date.getTime(),locale:fr,class:[styles.root,{custom:true}]};
const calendar=<DayPicker {...props}/>;
const button=<DayButton day={new CalendarDay(new Date(),new Date())} modifiers={{}} ref={el=>el.focus()} style={{'font-weight':'700'}}/>;
const context=()=>useDayPicker<{mode:'single',required:true}>();
export {calendar,button,context,DateLib,enUS};
${calendars.map((name,index)=>`import {DayPicker as Calendar${index}} from '@solid-unstyled/daypicker/${name}';export const calendar${index}=<Calendar${index} mode="single" onSelect={date=>date?.getTime()}/>;`).join('\n')}
import {DayPicker as Core} from '@solid-unstyled/daypicker/core';export const core=<Core/>;`);
await fs.writeFile(path.join(work, 'tsconfig.nodenext.json'), JSON.stringify({ compilerOptions: {
  target:'ES2022',module:'NodeNext',moduleResolution:'NodeNext',jsx:'preserve',jsxImportSource:'@solidjs/web',strict:true,skipLibCheck:false,types:[],
},include:['consumer-types.tsx'] }));
command('npm', ['exec', '--', 'tsc', '--noEmit', '-p', 'tsconfig.nodenext.json']);
command('npm', ['exec', '--', 'tsc', '--noEmit', '-p', 'tsconfig.nodenext.json','--module','ESNext','--moduleResolution','Bundler']);
const resolved = code => command(process.execPath, ['--input-type=module', '-e', code]).trim();
assert.equal(resolved(`import {DayPicker} from '@solid-unstyled/daypicker';import {isServer} from '@solidjs/web';console.log(typeof DayPicker+':'+isServer);`), 'function:true');
assert.equal(command(process.execPath, ['--conditions=browser','--conditions=worker','--input-type=module','-e',`import {DayPicker} from '@solid-unstyled/daypicker';import {isServer,renderToString} from '@solidjs/web';if(!renderToString(()=>DayPicker({month:new Date(2024,0,1)})).includes('January 2024'))throw Error('worker SSR failed');console.log(isServer);`]).trim(), 'true');
for(const conditions of [[],['--conditions=browser','--conditions=worker']]){
  const code=`import {isServer,renderToString} from '@solidjs/web';if(!isServer)throw Error('Expected server renderer');for(const name of ${JSON.stringify(['core',...calendars])}){const {DayPicker}=await import('@solid-unstyled/daypicker/'+name);const html=renderToString(()=>DayPicker({month:new Date(2024,0,1),today:new Date(2024,0,10)}),{onError:error=>{throw error;}});if(!html.includes('rdp-root')||!html.includes('role="grid"'))throw Error(name+' SSR missing grid');}console.log('ok');`;
  assert.equal(command(process.execPath,[...conditions,'--input-type=module','-e',code]).trim(),'ok');
}
await fs.writeFile(path.join(work,'unused.ts'), `import {DayPicker} from '@solid-unstyled/daypicker'; export const marker=1;`);
await fs.writeFile(path.join(work,'vite-unused.config.mjs'), `import fs from 'node:fs';export default {build:{outDir:'shake-dist',lib:{entry:'unused.ts',formats:['es'],fileName:'unused'}},plugins:[{name:'audit',generateBundle(_,bundle){fs.writeFileSync('shake-modules.json',JSON.stringify(Object.values(bundle).filter(x=>x.type==='chunk').flatMap(x=>Object.keys(x.modules))));}}]};`);
command('npm',['exec','--','vite','build','--config','vite-unused.config.mjs']);
const shakeModules=JSON.parse(await fs.readFile(path.join(work,'shake-modules.json'),'utf8'));
assert.equal(shakeModules.filter(name=>name.includes('/node_modules/@solid-unstyled/daypicker/')).length,0,'Unused import retained library runtime');
await fs.writeFile(path.join(work, 'vite.config.mjs'), `import {defineConfig} from 'vite'; import solid from '@solidjs/vite-plugin';
export default defineConfig({plugins:[solid({compiler:'babel',ssr:true,refresh:false})]});`);
await fs.writeFile(path.join(work, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>DayPicker stock consumer</title></head><body>
<!--BOOTSTRAP--><div id="one"><!--ONE--></div><div id="two"><!--TWO--></div>
<script>window.before={roots:[...document.querySelectorAll('.rdp-root')],buttons:[...document.querySelectorAll('.rdp-day_button')]};</script>
<script type="module" src="/client.tsx"></script></body></html>`);
command('npm', ['exec', '--', 'vite', 'build', '--ssr', 'server.tsx', '--outDir', 'server-dist']);
// Fresh Node imports the separately compiled server graph under stock conditions.
await fs.writeFile(path.join(work, 'render.mjs'), `import {one,two,bootstrap} from './server-dist/server.js'; console.log(JSON.stringify({one,two,bootstrap}));`);
const serverOutput = JSON.parse(command(process.execPath, ['render.mjs']));
assert(serverOutput.one.includes('January 2024'));
assert(serverOutput.two.includes('January 2024'));
command('npm', ['exec', '--', 'vite', 'build']);
let html = await fs.readFile(path.join(work, 'dist/index.html'), 'utf8');
html = html.replace('<!--BOOTSTRAP-->', serverOutput.bootstrap).replace('<!--ONE-->', serverOutput.one).replace('<!--TWO-->', serverOutput.two);
await fs.writeFile(path.join(work, 'dist/index.html'), html);
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const filename = path.join(work, 'dist', url.pathname === '/' ? 'index.html' : url.pathname);
    if (!filename.startsWith(path.join(work, 'dist') + path.sep)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', filename.endsWith('.js') ? 'text/javascript' : filename.endsWith('.css') ? 'text/css' : 'text/html');
    res.end(await fs.readFile(filename));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
const errors = [];
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  let release;
  const clientGate = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/*.js', async route => { await clientGate; await route.continue(); });
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'commit' });
  await page.locator('#single-calendar [data-day="2024-01-12"] button').click();
  assert.equal(await page.locator('#single-value').textContent(), 'none', 'Client ran before the hydration gate');
  release();
  try { await page.waitForFunction(() => window.hydrated); }
  catch(error) { console.error('Hydration diagnostics:', errors, await page.content()); throw error; }
  await page.waitForFunction(() => document.querySelector('#single-value').textContent === '12');
  assert.equal(await page.locator('#single-requests').textContent(), '1', 'Prehydration click was lost or replayed more than once');
  const identity = await page.evaluate(() => ({
    roots: window.before.roots.every((element, index) => element === document.querySelectorAll('.rdp-root')[index]),
    buttons: window.before.buttons.every((element, index) => element === document.querySelectorAll('.rdp-day_button')[index]),
  }));
  assert.deepEqual(identity, { roots: true, buttons: true }, 'Hydration replaced SSR hosts');
  const single = page.locator('#single-calendar');
  const range = page.locator('#range-calendar');
  const single15 = single.locator('[data-day="2024-01-15"] button');
  await single15.click();
  try { await page.waitForFunction(() => document.querySelector('#single-value').textContent === '15', null, { timeout: 2000 }); }
  catch(error) {
    console.error('Day selection diagnostics', errors, await single15.evaluate(element => ({keys:Object.keys(element), outer:element.outerHTML})));
    await page.locator('#standalone-day').click();
    console.error('Standalone day result', await page.locator('#single-value').textContent(), await page.locator('#standalone-day').evaluate(element => Object.keys(element)));
    throw error;
  }
  assert.equal(await single.locator('[data-day="2024-01-15"]').getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('#single-requests').textContent(), '2');
  assert.equal(await page.evaluate(() => document.querySelector('[data-day="2024-01-15"] button') === window.before.buttons[14]), true);
  await single15.press('ArrowRight');
  assert.equal(await single.locator('[data-day="2024-01-16"] button').evaluate(element => element === document.activeElement), true);
  await range.locator('[data-day="2024-01-05"] button').click();
  await range.locator('[data-day="2024-01-09"] button').click();
  await page.waitForFunction(() => document.querySelector('#range-value').textContent === '5:9');
  assert.match(await range.locator('[data-day="2024-01-07"]').getAttribute('class'), /rdp-range_middle/);
  await page.locator('#external-month').click();
  await page.waitForFunction(() => document.querySelector('#single-calendar [role="grid"]').getAttribute('aria-label') === 'February 2024');
  assert.equal(await single.evaluate(element => element === window.before.roots[0]), true);
  assert.equal(await range.locator('[role="grid"]').getAttribute('aria-label'), 'January 2024');
  await range.getByRole('button', { name: 'Go to the Next Month' }).click();
  assert.equal(await range.locator('[data-animated-month]').count(), 2, 'Navigation did not start the copied CSS animation');
  await page.waitForFunction(() => document.querySelector('#range-calendar [role="grid"]').getAttribute('aria-label') === 'February 2024');
  await page.waitForFunction(() => document.querySelectorAll('#range-calendar [data-animated-month]').length === 1);
  for(const name of calendars){
    const calendar=page.locator(`#calendar-${name}`);
    await calendar.locator('.rdp-day_button:not([disabled])').first().click();
    await page.waitForFunction(name=>document.querySelector(`#calendar-${name} output`).textContent==='selected',name);
    assert.equal(await calendar.locator('[aria-selected="true"]').count(),1,`${name}: selected day`);
    const caption=await calendar.locator('.rdp-month_caption').textContent();
    await calendar.locator('.rdp-button_next').click();
    await page.waitForFunction(({name,caption})=>document.querySelector(`#calendar-${name} .rdp-month_caption`).textContent!==caption,{name,caption});
    assert.equal(await calendar.locator('.rdp-root').evaluate(element=>window.before.roots.includes(element)),true,`${name}: navigation replaced root`);
  }
  await page.evaluate(() => window.disposeCalendars());
  assert.equal(await page.locator('.rdp-root').count(), 0);
  assert.deepEqual(errors, [], 'Browser runtime errors');
  const report = { work, tarball, sha256, integrity: packed.integrity, identity, unusedLibraryModules: 0,
    calendarSubpaths:calendars,
    checks: ['archive inclusion and installed byte equality', 'stock-peer strict Bundler/NodeNext declarations including core and five calendar subpaths', 'default and browser+worker exports including calendar SSR', 'unused root import elimination', 'fresh-process SSR', 'deterministic requests', 'two-root Chromium hydration identity including all calendar hosts', 'trusted prehydration click replay exactly once', 'selection/range/native keyboard', 'five calendar wrappers: selection and navigation identity', 'controlled month identity', 'CSS animation start/completion', 'disposal'], errors };
  await fs.writeFile('tracking/packed-verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
