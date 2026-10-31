import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {createHash} from 'node:crypto';
import {compile} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import {visit} from 'unist-util-visit';
import {adaptSnippet} from '../../scripts/docs-adapt.mjs';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import {Project,Node} from 'ts-morph';
import {createRequire} from 'node:module';

export async function filesIn(directory){return(await Promise.all((await fs.readdir(directory,{withFileTypes:true})).map(entry=>entry.isDirectory()?filesIn(path.join(directory,entry.name)):path.join(directory,entry.name)))).flat().sort();}
const hash=value=>createHash('sha256').update(value).digest('hex');
const sourceRoot='docs/website/docs';
const running=process.argv[1]&&path.resolve(process.argv[1])===path.resolve('docs/scripts/prepare.mjs');
const pages=[];
for(const file of (await filesIn(sourceRoot)).filter(file=>/\.mdx?$/.test(file)&&!file.includes('/api/'))) {
  const parsed=matter(await fs.readFile(file,'utf8'));
  if(parsed.data.draft===true)continue;
  const relative=path.relative(sourceRoot,file).replace(/\.mdx?$/,'');
  const route=typeof parsed.data.slug==='string'?parsed.data.slug:'/'+relative;
  const title=parsed.data.title??parsed.content.match(/^#\s+(.+)$/m)?.[1]?.replace(/\s+\{#[\w-]+\}\s*$/,'')??relative;
  pages.push({file:'/'+file,route:route==='/'?'/':route.replace(/\/$/,''),title,sidebarLabel:parsed.data.sidebar_label??title,section:relative.includes('/')?relative.split('/')[0]:'Overview',order:parsed.data.sidebar_position??100,paginationPrevious:parsed.data.pagination_prev,paginationNext:parsed.data.pagination_next});
}
for(const file of (await filesIn('docs/generated/api')).filter(file=>file.endsWith('.md'))) {
  const relative=path.relative('docs/generated/api',file).replace(/\.md$/,'').replace(/\/index$/,'').replace(/^index$/,'');
  const parsed=matter(await fs.readFile(file,'utf8'));
  pages.push({file:'/'+file,route:'/api'+(relative?'/'+relative:''),title:parsed.content.match(/^#\s+(.+)$/m)?.[1]??relative,section:'API',order:100});
}
const routes=new Set(pages.map(page=>page.route));
const names=new Set(); const expressions=new Set();
const allowed=new Set(['Admonition','Changelog','BrowserWindow','AnatomyDiagram','Tabs','TabItem','a','br','div','span','p','img','iframe','details','summary','table','thead','tbody','tr','th','td','sup','strong','em','code','pre','blockquote','ul','ol','li','h1','h2','h3','h4','style']);
for(const tag of ['kbd','h5','h6','hr','dl','dt','dd','small','section','article','figure','figcaption','label','input','button','select','option'])allowed.add(tag);
const slug=value=>value.toLowerCase().replace(/<[^>]+>/g,'').replace(/[^\p{L}\p{N}\s_-]/gu,'').trim().replace(/\s/g,'-');
export function nativeMdx(value){
  let fence;
  return matter(value).content.split('\n').map(line=>{
    const marker=line.match(/^\s*(`{3,}|~{3,})/);
    if(marker){if(!fence)fence=marker[1];else if(marker[1][0]===fence[0]&&marker[1].length>=fence.length)fence=undefined;return line;}
    if(fence)return line;
    const admonition=line.match(/^:::(note|tip|info|caution|warning|danger)(?:\s+(.+))?\s*$/);
    if(admonition)return `<Admonition type=${JSON.stringify(admonition[1])} title=${JSON.stringify(admonition[2]??admonition[1])}>`;
    if(/^:::\s*$/.test(line))return '</Admonition>';
    return line.replace(/^(#{1,6} .+?)\s+\{#([A-Za-z0-9_-]+)\}\s*$/,'$1 {/* heading-id:$2 */}');
  }).join('\n');
}
export function remarkNativeDocs(){return(tree,file)=>{
  const pathname=String(file.path??'');const historical=/upgrading|changelog|development\//.test(pathname);
  const ids=new Map();
  file.data.toc=[];
  visit(tree,node=>{
    if(node.type==='code'&&!historical&&['tsx','jsx','ts','js'].includes(node.lang)&&(/\bReact\.|\buseState\b|from ["']react["']/.test(node.value))) {
      node.value=adaptSnippet(node.value);node.lang='tsx';
    }
    if(node.type==='heading') {
      const explicit=node.children.find(child=>child.type==='mdxTextExpression'&&/heading-id:/.test(child.value));
      if(explicit)node.children=node.children.filter(child=>child!==explicit);
      const text=node.children.map(child=>child.value??'').join('');let id=explicit?.value.match(/heading-id:([A-Za-z0-9_-]+)/)?.[1]??slug(text);const count=ids.get(id)??0;ids.set(id,count+1);if(count)id+='-'+count;
      node.data={...node.data,hProperties:{...node.data?.hProperties,id}};
      if(node.depth===2||node.depth===3)file.data.toc.push({id,title:text,level:node.depth});
    }
    if(node.type==='link') {
      const url=node.url;
      if(!/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)&&/\.mdx?(?:#|$)/.test(url)) {
        const [base,anchor]=url.split('#');let next;
        if(base.startsWith('/'))next=base.replace(/\.mdx?$/,'');
        else {const root=pathname.includes('/generated/api/')?'docs/generated/api':'docs/website/docs';next=path.relative(root,path.resolve(path.dirname(pathname),base)).replaceAll(path.sep,'/').replace(/\.mdx?$/,'').replace(/\/index$/,'').replace(/^index$/,'');next=(root.includes('/api')?'/api/':'/')+next;}
        node.url=next.replace(/\/$/,'')+(anchor?'#'+anchor:'');
      }
      if(node.url.startsWith('/api/')&&!routes.has(node.url.split('#')[0]))node.url=node.url.replace('/api/','/api/react/');
    }
    if(node.type==='image'&&!/^(https?:|\/)/.test(node.url))node.url='/'+path.join(path.dirname(pathname),node.url).replaceAll(path.sep,'/');
    if(node.type==='containerDirective'||node.type==='leafDirective'||node.type==='textDirective'){
      node.data={hName:'aside',hProperties:{className:['admonition',`admonition-${node.name}`],role:'note'}};
    }
    if(node.type==='mdxJsxFlowElement'||node.type==='mdxJsxTextElement') {
      if(node.name){names.add(node.name);if(!allowed.has(node.name)&&!node.name.startsWith('Examples.'))throw Error(`Unknown MDX element ${node.name}: ${pathname}:${node.position.start.line}`);}
      for(const attr of node.attributes??[])if(attr.type==='mdxJsxAttribute'&&attr.name==='className')attr.name='class';
    }
    if(node.type==='mdxFlowExpression'||node.type==='mdxTextExpression')expressions.add(node.value);
  });
};}
export async function markdownHtml(value,filename,toc){const result=await unified().use(remarkParse).use(remarkGfm).use(remarkDirective).use(remarkNativeDocs).use(remarkRehype).use(rehypeStringify).process({value:matter(value).content,path:filename});if(toc)toc.push(...result.data.toc);return String(result);}
if(running){
await fs.mkdir('docs/generated',{recursive:true});
// Resolve the copied source sidebar configuration instead of inventing sections.
const sidebarProject=new Project();
const sidebarSource=sidebarProject.addSourceFileAtPath('docs/website/sidebars.ts');
const require=createRequire(import.meta.url);
const apiImports=Object.fromEntries(['react','persian','buddhist','ethiopic','hebrew','hijri'].map(name=>[name+'Sidebar',require(path.resolve(sourceRoot,'api',name,'typedoc-sidebar.cjs'))]));
function literal(node){
  if(Node.isStringLiteral(node)||Node.isNumericLiteral(node))return node.getLiteralValue();
  if(node.getText()==='true'||node.getText()==='false')return node.getText()==='true';
  if(Node.isArrayLiteralExpression(node))return node.getElements().map(literal);
  if(Node.isObjectLiteralExpression(node))return Object.fromEntries(node.getProperties().map(property=>[property.getName(),literal(property.getInitializerOrThrow())]));
  if(Node.isIdentifier(node)&&node.getText() in apiImports)return apiImports[node.getText()];
  throw Error(`Unsupported sidebar config: ${node.getText()}`);
}
const docsSidebar=literal(sidebarSource.getVariableDeclarationOrThrow('sidebars').getInitializerOrThrow().getPropertyOrThrow('docs').getInitializerOrThrow());
function resolveSidebar(item){
  if(typeof item==='string'){const page=pages.find(page=>page.file===`/${sourceRoot}/${item}.mdx`||page.file===`/${sourceRoot}/${item}.md`);if(!page)throw Error(`Missing sidebar page: ${item}`);return {type:'link',route:page.route,label:page.sidebarLabel};}
  if(item.type==='autogenerated')return pages.filter(page=>page.section===item.dirName).sort((a,b)=>a.order-b.order).map(page=>({type:'link',route:page.route,label:page.sidebarLabel}));
  return {...item,items:item.items.flatMap(resolveSidebar)};
}
const resolvedSidebar=docsSidebar.flatMap(resolveSidebar);
await fs.writeFile('docs/generated/sidebar.json',JSON.stringify(resolvedSidebar,null,2));
const apiSidebar=literal(sidebarSource.getVariableDeclarationOrThrow('sidebars').getInitializerOrThrow().getPropertyOrThrow('api').getInitializerOrThrow());
function resolveApi(item){
  if(typeof item==='string')item={type:'doc',id:item};
  const route='/'+(item.id??item.link?.id??'').replace(/\/index$/,'');
  const page=pages.find(page=>page.route===route);
  if(item.type==='category')return {type:'category',label:item.label.replace('@daypicker/react','@solid-unstyled/daypicker').replace('@daypicker/','@solid-unstyled/daypicker/'),route:page?.route,collapsed:true,items:item.items.map(resolveApi).filter(Boolean)};
  return page?{type:'link',label:item.label??page.title,route:page.route}:undefined;
}
await fs.writeFile('docs/generated/api-sidebar.json',JSON.stringify(apiSidebar.map(resolveApi).filter(Boolean),null,2));
const orderedDocs=resolvedSidebar.flatMap(function flatten(item){return item.items?item.items.flatMap(flatten):[item];});
for(const page of pages){
  const index=orderedDocs.findIndex(item=>item.route===page.route);
  const link=value=>value?{route:value.route,label:value.label}:undefined;
  const override=value=>orderedDocs.find(item=>item.route==='/'+value.replace(/\/index$/,''));
  page.previous=page.paginationPrevious===null?undefined:link(typeof page.paginationPrevious==='string'?override(page.paginationPrevious):orderedDocs[index-1]);
  page.next=page.paginationNext===null?undefined:link(typeof page.paginationNext==='string'?override(page.paginationNext):index>=0?orderedDocs[index+1]:undefined);
}
const config=JSON.parse(await fs.readFile('docs/site/config.json','utf8'));
const pkg=JSON.parse(await fs.readFile('packages/solid/package.json','utf8'));
await fs.writeFile('docs/generated/site-config.json',JSON.stringify({...config,version:pkg.version},null,2));
// A native module registry and source panels come from actual adapted files, not retyped samples.
const project=new Project({tsConfigFilePath:'docs/tsconfig.json'});
const registry=[];
for(const file of (await filesIn('docs/examples')).filter(file=>/\.tsx$/.test(file)&&!file.includes('.test.'))) {
  const sf=project.getSourceFile(file);if(!sf)continue;
  const exports=[...sf.getExportedDeclarations()].filter(([name,decls])=>decls.some(d=>Node.isFunctionDeclaration(d)||Node.isVariableDeclaration(d))).map(([name])=>name);
  const content=await fs.readFile(file,'utf8');
  const dependencies=[];
  for(const imp of sf.getImportDeclarations()) {
    const specifier=imp.getModuleSpecifierValue();if(!specifier.startsWith('.'))continue;
    const base=path.resolve(path.dirname(file),specifier);for(const suffix of ['.tsx','.ts','.css','/index.tsx']) {
      const candidate=specifier.endsWith('.css')?base:base+suffix;
      try {const body=await fs.readFile(candidate,'utf8');dependencies.push({file:path.relative(process.cwd(),candidate),source:body,sha256:hash(body)});break;}catch{}
    }
  }
  registry.push({file,name:exports[0],exports,source:content,sha256:hash(content),dependencies});
}
await fs.writeFile('docs/generated/pages.json',JSON.stringify(pages,null,2));
await fs.writeFile('docs/generated/examples.json',JSON.stringify(registry,null,2));
const gallery=registry.filter(entry=>!entry.file.includes('/CustomDropdown/Select')).map(entry=>({name:entry.exports.find(name=>name===path.basename(entry.file,'.tsx'))??entry.exports[0],file:entry.file}));
await fs.writeFile('docs/generated/gallery.json',JSON.stringify(gallery,null,2));
const imports=registry.map((entry,i)=>`import * as example${i} from '../../${entry.file.replace(/\.tsx$/,'')}';`).join('\n');
const entries=registry.flatMap((entry,i)=>entry.exports.map(name=>`${JSON.stringify(name)}:example${i}.${name}`)).join(',\n');
await fs.writeFile('docs/generated/examples.ts',`${imports}\nexport const Examples={${entries}};\n`);
// Compile every active page once here so unsupported grammar fails before building.
for(const page of pages){try{
  const value=await fs.readFile(page.file.slice(1),'utf8');
  page.toc=[];
  if(page.file.endsWith('.md'))await markdownHtml(value,page.file.slice(1),page.toc);
  else {const result=await compile({value:nativeMdx(value),path:page.file.slice(1)},{jsx:true,jsxImportSource:'@solidjs/web',remarkPlugins:[remarkGfm,remarkDirective,remarkNativeDocs]});page.toc=result.data.toc;}
}catch(error){throw new Error(`${page.file}: ${error.message}`,{cause:error});}}
await fs.writeFile('docs/generated/content-inventory.json',JSON.stringify({pages:pages.length,examples:registry.length,elements:[...names].sort(),expressions:[...expressions].sort()},null,2));
await fs.writeFile('docs/generated/pages.json',JSON.stringify(pages,null,2));
console.log(`Prepared ${pages.length} source-derived pages and ${registry.length} adapted example modules`);
}
