import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const sha = JSON.parse(await fs.readFile('packages/solid/src.source-copy.json', 'utf8')).sourceSha;
const calendars=['buddhist','ethiopic','hebrew','hijri','persian'];
const work = await fs.mkdtemp(path.join(os.tmpdir(), 'opencode', 'daypicker-react-oracle-'));
const env = { ...process.env, NODE_OPTIONS: '', npm_config_userconfig: path.join(work, '.npmrc'), npm_config_cache: path.join(work, '.cache') };
await fs.writeFile(env.npm_config_userconfig, '');
const run = (name, args) => execFileSync(name, args, { cwd: work, env, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
run('git', ['clone', '--quiet', '--no-checkout', '--shared', path.resolve('upstream/react-day-picker'), 'source']);
run('git', ['-C', 'source', 'checkout', '--quiet', '--detach', sha]);
await fs.writeFile(path.join(work, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: {
  react: '19.2.4', 'react-dom': '19.2.4', 'date-fns': '4.1.0', '@date-fns/tz': '1.4.1',
  'date-fns-jalali':'4.1.0-0','@tabby_ai/hijri-converter':'1.0.5',
}}));
run('npm', ['install', '--no-audit', '--no-fund']);
const src = path.join(work, 'source/packages/react-day-picker/src');
async function filesIn(directory) {
  return (await Promise.all((await fs.readdir(directory, {withFileTypes:true})).map(entry => entry.isDirectory()
    ? filesIn(path.join(directory,entry.name)) : path.join(directory,entry.name)))).flat();
}
for(const [input,outputRoot] of [[src,path.join(work,'react')],...calendars.map(name=>[path.join(work,'source/packages',name,'src'),path.join(work,'react-calendars',name)])]) {
for (const file of (await filesIn(input)).filter(file => /\.tsx?$/.test(file) && !/\.(test|spec|d)\.tsx?$/.test(file))) {
  const output = path.join(outputRoot, path.relative(input,file).replace(/\.tsx?$/,'.js'));
  await fs.mkdir(path.dirname(output), {recursive:true});
  const code=ts.transpileModule(await fs.readFile(file,'utf8'), {
    fileName: file, compilerOptions: {target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.React},
  }).outputText;
  await fs.writeFile(output,code.replace(/(["'])@daypicker\/react(\/[^"']*)?\1/g,(_match,_quote,subpath)=>{
    const target=path.join(work,'react',subpath?subpath.slice(1).replace(/\.js$/,'')+'.js':'index.js');
    const relative=path.relative(path.dirname(output),target).replaceAll(path.sep,'/');
    return JSON.stringify(relative.startsWith('.')?relative:'./'+relative);
  }));
}
}
const fixtures = `const january=new Date(2024,0,1), today=new Date(2024,0,10); const fixtures=[
  {month:january,today},
  {month:january,today,mode:'single',selected:new Date(2024,0,15),onSelect:()=>{}},
  {month:january,today,mode:'multiple',selected:[new Date(2024,0,5),new Date(2024,0,9)],onSelect:()=>{}},
  {month:january,today,mode:'range',selected:{from:new Date(2024,0,5),to:new Date(2024,0,9)},onSelect:()=>{},animate:true},
  {month:january,today,captionLayout:'dropdown',startMonth:new Date(2023,0,1),endMonth:new Date(2025,11,1),numberOfMonths:2,showWeekNumber:true},
  {month:january,today,mode:'single',disabled:new Date(2024,0,5),hidden:new Date(2024,0,9),showOutsideDays:true,dir:'rtl'},
];`;
await fs.writeFile(path.join(work,'react-render.mjs'), `import {createElement} from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {DayPicker} from './react/index.js'; ${fixtures} console.log(JSON.stringify(fixtures.map(props=>renderToStaticMarkup(createElement(DayPicker,props)))));`);
const original = JSON.parse(run(process.execPath, ['react-render.mjs']));
// A fresh Solid server process uses the actual compiled output and no DOM globals.
const port = JSON.parse(execFileSync(process.execPath, ['--input-type=module','-e', `import {renderToString} from '@solidjs/web'; import {DayPicker} from './packages/solid/dist/server/index.js'; ${fixtures} console.log(JSON.stringify(fixtures.map(props=>renderToString(()=>DayPicker(props),{onError:e=>{throw e}}))));`], {env,encoding:'utf8'}));
const calendarFixtures=`const fixtures=[{month:new Date(2024,0,1),today:new Date(2024,0,10)},{month:new Date(2024,0,1),today:new Date(2024,0,10),mode:'single',selected:new Date(2024,0,15),onSelect:()=>{},captionLayout:'dropdown',showOutsideDays:true}];`;
const calendarResults=[];
for(const name of calendars){
  await fs.writeFile(path.join(work,'calendar-render.mjs'),`import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {DayPicker} from './react-calendars/${name}/index.js';${calendarFixtures}console.log(JSON.stringify(fixtures.map(props=>renderToStaticMarkup(createElement(DayPicker,props)))));`);
  const react=JSON.parse(run(process.execPath,['calendar-render.mjs']));
  const solid=JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',`import {renderToString} from '@solidjs/web';import {DayPicker} from './packages/solid/dist/server/calendars/${name}/index.js';${calendarFixtures}console.log(JSON.stringify(fixtures.map(props=>renderToString(()=>DayPicker(props),{onError:e=>{throw e}}))));`],{env,encoding:'utf8'}));
  calendarResults.push({name,react,solid});
}
const document = new JSDOM('').window.document;
function tree(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  function serialize(node) {
    if(node.nodeType===3) return node.textContent;
    if(node.nodeType!==1 || node.tagName==='SCRIPT') return undefined;
    return {
      tag:node.tagName,
      // Only framework hydration keys and attribute serialization order are normalized.
      attrs:Object.fromEntries([...node.attributes].filter(a=>a.name!=='_hk').map(a=>[a.name,a.value]).sort(([a],[b])=>a.localeCompare(b))),
      children:[...node.childNodes].map(serialize).filter(value=>value!==undefined),
    };
  }
  return [...container.childNodes].map(serialize).filter(value=>value!==undefined);
}
for(let index=0;index<original.length;index++) assert.deepEqual(tree(port[index]),tree(original[index]),`React/Solid SSR DOM mismatch in fixture ${index}`);
for(const {name,react,solid} of calendarResults)for(let index=0;index<react.length;index++)assert.deepEqual(tree(solid[index]),tree(react[index]),`${name}: React/Solid SSR DOM mismatch in fixture ${index}`);
const report={sourceSha:sha,fixtures:original.length+calendarResults.reduce((count,item)=>count+item.react.length,0),calendarSubpaths:calendars,checks:['exact-SHA pristine React oracle','static calendar','single/multiple/range selection','dropdowns and two months','week numbers','disabled/hidden/outside dates','RTL','five calendar wrappers: defaults and selected dropdowns','SSR DOM/attributes/CSS parity']};
await fs.writeFile('tracking/react-oracle-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
