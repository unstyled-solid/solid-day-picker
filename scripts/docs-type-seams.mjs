import {Project,Node,SyntaxKind} from 'ts-morph';
const project=new Project({tsConfigFilePath:'docs/tsconfig.json'});
const files=project.getSourceFiles().filter(f=>f.getFilePath().includes('/docs/examples/')||f.getFilePath().includes('/docs/website/src/components/')&&!f.getFilePath().includes('/PlaygroundV9/'));
for(const f of files) {
  let text=f.getFullText();
  for(const key of ['justifyContent','alignItems','marginBlockEnd','textDecoration','borderTop'])text=text.replace(new RegExp(`\\b${key}:`,'g'),JSON.stringify(key.replace(/[A-Z]/g,c=>`-${c.toLowerCase()}`))+':');
  text=text.replace(/\bChangeEventHandler<HTMLInputElement>/g,'JSX.EventHandler<HTMLInputElement, InputEvent>')
    .replace(/\bMouseEventHandler<HTMLButtonElement>/g,'JSX.EventHandler<HTMLButtonElement, MouseEvent>');
  if(text.includes('JSX.')&&!text.includes('import type { JSX }')&&!text.includes('{ type JSX }')&&!text.includes('import type {JSX}'))text='import type {JSX} from "@solidjs/web";\n'+text;
  f.replaceWithText(text);
  for(const p of f.getDescendantsOfKind(SyntaxKind.PropertyAssignment)) {
    if(/width|height|margin|padding/.test(p.getName())&&Node.isNumericLiteral(p.getInitializer())&&p.getInitializer().getText()!=='0')p.setInitializer(JSON.stringify(p.getInitializer().getText()+'px'));
  }
  for(const call of f.getDescendantsOfKind(SyntaxKind.CallExpression).reverse())if(call.getExpression().getText()==='renderApp') {
    const arg=call.getArguments()[0];if(arg&&!Node.isArrowFunction(arg))arg.replaceWithText(`()=>(${arg.getText()})`);
  }
  for(const fn of f.getFunctions()) {
    const body=fn.getBody();if(!body)continue;
    const stmts=body.getStatements();const declaration=stmts.find(s=>Node.isVariableStatement(s)&&s.getDeclarations().some(d=>d.getName()==='footer'));
    if(!declaration||declaration.getDeclarationKind()!=='let')continue;
    const first=stmts.indexOf(declaration);let last=first;
    while(Node.isIfStatement(stmts[last+1]))last++;
    const code=stmts.slice(first,last+1).map(s=>s.getText()).join('\n');
    for(let i=last;i>first;i--)stmts[i].remove();
    declaration.replaceWithText(`const footer=()=>{${code}\nreturn footer;};`);
    for(const attr of fn.getDescendantsOfKind(SyntaxKind.JsxAttribute))if(attr.getNameNode().getText()==='footer'&&attr.getInitializer()?.getText()==='{footer}')attr.setInitializer('{footer()}');
  }
}
for(let iteration=0;iteration<4;iteration++) {
  let count=0;
  const diagnostics=project.getPreEmitDiagnostics().filter(d=>[2532,2345].includes(d.getCode()));
  for(const d of diagnostics.sort((a,b)=>(b.getStart()??0)-(a.getStart()??0))) {
    const f=d.getSourceFile();if(!files.includes(f))continue;
    const start=d.getStart(),end=start+d.getLength();
    const candidates=f.getDescendants().filter(n=>(Node.isCallExpression(n)||Node.isPropertyAccessExpression(n))&&n.getStart()===start&&n.getEnd()<=end&&/^(selected\w*|range|month|calendarLocale)\(\)/.test(n.getText()));
    const node=candidates.sort((a,b)=>b.getWidth()-a.getWidth())[0];
    if(node&&!Node.isNonNullExpression(node.getParent())){node.replaceWithText(node.getText()+'!');count++;}
  }
  if(!count)break;
}
await project.save();
