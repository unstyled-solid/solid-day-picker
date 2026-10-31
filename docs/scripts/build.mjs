import {build} from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import pages from '../generated/pages.json' with {type:'json'};
import gallery from '../generated/gallery.json' with {type:'json'};
import {filesIn} from './prepare.mjs';
import {pageHtml} from './site/html.mjs';
await build({configFile:'docs/vite.config.ts',build:{ssr:'docs/site/server.tsx',outDir:'docs/generated/server'}});
await build({configFile:'docs/vite.config.ts'});
const {render}=await import(pathToFileURL(path.resolve('docs/generated/server/server.js')));
const template=await fs.readFile('docs/generated/site/docs/index.html','utf8');
for(const route of [...pages.map(page=>page.route),'/playground','/examples',...gallery.map(entry=>'/examples/'+entry.name)]) {
  const document=pageHtml(template,await render(route));
  const destination=path.join('docs/generated/site',route,'index.html');
  await fs.mkdir(path.dirname(destination),{recursive:true});
  await fs.writeFile(destination,document);
  // Vite preview resolves extensionless URLs to .html, not nested index.html.
  // Keep both forms so source-site links and explicit trailing slashes agree.
  if(route!=='/')await fs.writeFile(path.join('docs/generated/site',route+'.html'),document);
}
for(const file of await filesIn('docs/website/docs/img')) {
  const destination=path.join('docs/generated/site',file);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.copyFile(file,destination);
}
for(const file of (await filesIn('docs/examples')).filter(file=>!file.includes('.test.')&&!file.includes('__snapshots__'))) {
  const destination=path.join('docs/generated/site/source',file);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.copyFile(file,destination);
}
console.log(`Built ${pages.length+2+gallery.length} static documentation routes with native Solid islands`);
