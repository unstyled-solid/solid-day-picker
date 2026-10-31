import fs from 'node:fs/promises';
import path from 'node:path';
import {Project} from 'ts-morph';
import {adaptSnippet} from '../../scripts/docs-adapt.mjs';
async function filesIn(dir){return(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(entry=>entry.isDirectory()?filesIn(path.join(dir,entry.name)):path.join(dir,entry.name)))).flat();}
const project=new Project({tsConfigFilePath:'docs/tsconfig.json'});
const examples=new Map();
for(const f of project.getSourceFiles().filter(f=>f.getFilePath().includes('/docs/examples/')&&!f.getBaseName().includes('.test.')))for(const [name]of f.getExportedDeclarations())examples.set(name,f.getFullText());
for(const file of(await filesIn('docs/website/docs')).filter(f=>f.endsWith('.mdx')&&!/api\/|upgrading|changelog|development\//.test(f))){
  let text=await fs.readFile(file,'utf8');
  text=text.replace(/```(tsx|jsx|ts|js)([^\n]*)\n([\s\S]*?)\n```/g,(_,lang,meta,code)=>{
    // Where the page embeds the same example, display its actual adapted implementation.
    const names=[...code.matchAll(/(?:function|const)\s+([A-Z]\w+)/g)].map(match=>match[1]);
    const same=names.find(name=>examples.has(name)&&code.length>200);
    const adapted=same?examples.get(same):adaptSnippet(code);
    return `\`\`\`tsx${meta}\n${adapted.trim()}\n\`\`\``;
  });
  text=text.replace('Use a custom React Context to share state between your custom components and your application.','Use a native Solid context with live getters to share state between your custom components and your application.')
    .replace('This approach uses a custom React context to share the selected date state','This approach uses a native Solid context to share the selected date state')
    .replaceAll('`ReactNode`','`JSX.Element`');
  if(file.endsWith('/custom-components.mdx'))text+='\n## Native Solid ownership\n\nComponent setup runs once. Keep props and context fields live by reading them in JSX, accessors or memos, rather than destructuring changing values during setup. Use a direct `<Context value={value}>` provider, callback refs, and native events. The copied custom-dropdown demo keeps the source component structure and styles while adapting the React-only primitive boundary to an owned native Solid implementation. Its source panel includes that dependency.\n';
  await fs.writeFile(file,text);
}
