import {Application} from 'typedoc';
import fs from 'node:fs/promises';
import path from 'node:path';
// The package descriptors and table/group settings come from the copied upstream generator.
const packages=[['react','@solid-unstyled/daypicker','index'],...['buddhist','ethiopic','hebrew','hijri','persian'].map(name=>[name,`@solid-unstyled/daypicker/${name}`,`calendars/${name}/index`])];
await fs.rm('docs/generated/api',{recursive:true,force:true});
await fs.mkdir('docs/generated/api',{recursive:true});
for(const [slug,name,entry] of packages) {
  const app=await Application.bootstrapWithPlugins({entryPoints:[`packages/solid/dist/types/${entry}.d.ts`],tsconfig:'docs/api.tsconfig.json',name,readme:'none',plugin:['typedoc-plugin-markdown'],
    excludePrivate:true,excludeExternals:true,excludeProtected:true,groupOrder:['DayPicker','Props','Classes','Components','Formatters','Labels','Utilities','Hooks','Contexts','*'],
    entryFileName:'index.md',hideBreadcrumbs:true,hidePageHeader:true,parametersFormat:'table',typeDeclarationFormat:'table',propertiesFormat:'list',enumMembersFormat:'table',indexFormat:'table',
    markdown:path.resolve('docs/generated/api',slug),suppressCommentWarningsInDeclarationFiles:true,skipErrorChecking:true,logLevel:'Error'});
  const project=await app.convert();if(!project)throw Error(`API conversion failed: ${name}`);
  await app.generateOutputs(project);
  await app.generateJson(project,path.resolve('docs/generated/api',`${slug}.json`));
}
// Adapt retained JSDoc in the documentation output without changing library source.
const guideRoutes={
  '/docs/selection-modes':'/selections/selection-modes',
  '/docs/localization':'/localization/changing-locale',
  '/docs/customization':'/docs/appearance',
  '/docs/translation':'/guides/translation',
  '/docs/time-zone':'/localization/setting-time-zone',
};
async function adaptApi(directory){
  for(const entry of await fs.readdir(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory()){await adaptApi(file);continue;}
    if(!file.endsWith('.md'))continue;
    let text=await fs.readFile(file,'utf8');
    text=text.replaceAll('react-day-picker','@solid-unstyled/daypicker').replaceAll('@daypicker/react','@solid-unstyled/daypicker');
    text=text.replace(/https?:\/\/daypicker\.dev([^\s)<>]+)/g,(_url,suffix)=>{
      const [route,anchor]=suffix.split('#');
      let target=guideRoutes[route]??route;
      if(target.startsWith('/api/')&&!target.startsWith('/api/react/'))target=target.replace('/api/','/api/react/');
      // Old page anchors do not necessarily exist in the reorganized guides.
      return `${target}${guideRoutes[route]?'':anchor?'#'+anchor:''}`;
    });
    text=text.replace(/^(\/[^\s]+)$/gm,'[Guide]($1)');
    await fs.writeFile(file,text);
  }
}
await adaptApi('docs/generated/api');
await fs.writeFile('docs/generated/api/index.md',`# API Reference\n\nGenerated from the Solid 2 declarations and retained JSDoc, including native events, refs, class values and live contexts.\n\n| Package | Reference |\n| --- | --- |\n${packages.map(([slug,name])=>`| ${name} | [API](${slug}/index.md) |`).join('\n')}\n`);
console.log('Generated native API documentation for core and all five calendars');
