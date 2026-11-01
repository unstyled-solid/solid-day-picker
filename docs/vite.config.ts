import {defineConfig} from 'vite';
import solid from '@solidjs/vite-plugin';
import mdx from '@mdx-js/rollup';
import {nativeMdx,markdownHtml,remarkNativeDocs} from './scripts/prepare.mjs';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import {fileURLToPath} from 'node:url';
import {compile as compileJSX} from '../scripts/distribution/build/compiler.mjs';
import fs from 'node:fs/promises';
import pages from './generated/pages.json' with {type:'json'};
import gallery from './generated/gallery.json' with {type:'json'};
import {pageHtml} from './scripts/site/html.mjs';
const routes=new Set([...pages.map(page=>page.route),'/playground','/examples',...gallery.map(entry=>'/examples/'+entry.name)]);
export default defineConfig({
  appType:'mpa',
  root:fileURLToPath(new URL('..',import.meta.url)),
  plugins:[{name:'docs-ssr',configureServer(server){
    server.middlewares.use(async(req,res,next)=>{
      const route=new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'')||'/';
      if(!routes.has(route))return next();
      try{
        const {render}=await server.ssrLoadModule('/docs/site/server.tsx');
        const document=await render(route);
        const template=await server.transformIndexHtml('/docs/index.html',await fs.readFile('docs/index.html','utf8'));
        res.setHeader('Content-Type','text/html');res.end(pageHtml(template,document));
      }catch(error){next(error);}
    });
  }},{name:'source-docs',enforce:'pre',async transform(code,id){
    // Docusaurus puts theme styles in the website layer, below site overrides.
    if(id.includes('/docs/site/')&&id.endsWith('.module.css'))return {code:`@layer website {\n${code}\n}`,map:null};
    if(id.endsWith('.mdx'))return {code:nativeMdx(code),map:null};
    if(id.endsWith('.md'))return {code:`import {HTMLContent} from '/docs/site/mdx';export default props=>HTMLContent({html:${JSON.stringify(await markdownHtml(code,id))}});`,map:null};
  }},mdx({include:/\.mdx$/,jsx:true,jsxImportSource:'@solidjs/web',providerImportSource:'/docs/site/mdx',remarkPlugins:[remarkGfm,remarkDirective,remarkNativeDocs]}),
  {name:'native-mdx-jsx',enforce:'post',transform(code,id,options){if(id.endsWith('.mdx'))return compileJSX(code,id+'.tsx',options?.ssr?'ssr':'dom');}},
  solid({compiler:'babel',ssr:true,refresh:false})],
  resolve:{alias:{'@/test':fileURLToPath(new URL('../test',import.meta.url))}},
  // Copied site CSS targets prefixes such as div[class^="admonitionHeading"].
  css:{modules:{generateScopedName:'[local]_[hash:base64:5]'}},
  publicDir:fileURLToPath(new URL('./website/static',import.meta.url)),
  build:{outDir:'docs/generated/site',rollupOptions:{input:'docs/index.html'},emptyOutDir:true},
  server:{port:3001},
});
