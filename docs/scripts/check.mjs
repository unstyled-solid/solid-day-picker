import fs from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve('docs/generated/site');
async function filesIn(dir){return(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?filesIn(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await filesIn(root);
const failures=new Set();
async function check(file,value){
  value=value.replaceAll('&amp;','&');
  if(!value||/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value))return;
  const url=new URL(value,'https://local.invalid/'+path.relative(root,file));
  let target=path.join(root,decodeURIComponent(url.pathname));
  if(!target.startsWith(root+path.sep)&&target!==root)throw Error('Link escaped site root');
  for(const candidate of [target,target+'.html',path.join(target,'index.html')]) {
    try {if((await fs.stat(candidate)).isFile())return;}catch{}
  }
  failures.add(`${path.relative(root,file)} → ${value}`);
}
for(const file of files.filter(file=>/\.(html|css)$/.test(file))){
  const text=await fs.readFile(file,'utf8');
  const refs=file.endsWith('.html')?[...text.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(m=>m[1]):[...text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)].map(m=>m[1]);
  await Promise.all(refs.map(value=>check(file,value)));
}
if(failures.size){console.error([...failures].join('\n'));process.exitCode=1;}
else console.log('Built documentation links and assets resolve.');
