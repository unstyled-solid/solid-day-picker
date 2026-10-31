// One-time, scope-aware adaptation of the recorded copies. Do not run on repaired files.
import {Project,Node,SyntaxKind} from 'ts-morph';
import path from 'node:path';
const project=new Project({tsConfigFilePath:'tsconfig.json',skipAddingFilesFromTsConfig:true});
project.addSourceFilesAtPaths(['docs/examples/**/*.{ts,tsx}','docs/website/src/components/**/*.{ts,tsx}','packages/solid/src/calendars/**/*.{ts,tsx}']);
const files=project.getSourceFiles().filter(f=>!f.getFilePath().includes('/PlaygroundV9/'));
const runtime=new Set(['createSignal','createMemo','createEffect','createUniqueId','untrack','omit','createContext','useContext']);
function refs(id,expression) {
  for(const ref of id.findReferencesAsNodes().sort((a,b)=>b.getStart()-a.getStart())) {
    if(ref.wasForgotten()||ref.getSourceFile()!==id.getSourceFile()||!Node.isIdentifier(ref))continue;
    const p=ref.getParent();
    if(Node.isBindingElement(p)||Node.isPropertySignature(p)||Node.isJsxAttribute(p)||
      (Node.isPropertyAccessExpression(p)&&p.getNameNode()===ref)||
      (Node.isPropertyAssignment(p)&&p.getNameNode()===ref))continue;
    if(Node.isShorthandPropertyAssignment(p))p.replaceWithText(`get ${p.getName()}(){return ${expression};}`);
    else ref.replaceWithText(expression);
  }
}
function destructure(pattern,source) {
  const keys=[]; let rest;
  for(const el of pattern.getElements()) {
    if(el.getDotDotDotToken()){rest=el.getName();continue;}
    const keyNode=el.getPropertyNameNode();
    let key=Node.isStringLiteral(keyNode)?keyNode.getLiteralValue():keyNode?.getText()??el.getName();if(key==='className')key='class';keys.push(key);
    const name=el.getNameNode();
    if(!Node.isIdentifier(name))throw Error(`Nested binding requires manual adaptation: ${pattern.getText()}`);
    const access=/^[A-Za-z_$][\w$]*$/.test(key)?`${source}.${key}`:`${source}[${JSON.stringify(key)}]`;
    refs(name,el.getInitializer()?`(${access} === undefined ? ${el.getInitializer().getText()} : ${access})`:access);
  }
  return rest?`const ${rest}=omit(${source},${keys.map(x=>JSON.stringify(x)).join(',')});`:'';
}
export function adaptFile(f) {
  const calendar=f.getFilePath().includes('/src/calendars/');
  for(const imp of f.getImportDeclarations()) {
    let value=imp.getModuleSpecifierValue();
    if(value==='react') {
      // Native imports are added after the body transformations.
      imp.remove();continue;
    }
    if(value.startsWith('@daypicker/react')||value.startsWith('react-day-picker')) {
      value=value.replace(/^@daypicker\/react|^react-day-picker/,'@solid-unstyled/daypicker');
    } else value=value.replace(/^@daypicker\/(buddhist|ethiopic|hebrew|hijri|persian)/,'@solid-unstyled/daypicker/$1');
    if(calendar&&value.startsWith('@solid-unstyled/daypicker')) {
      const relative=path.relative(f.getDirectoryPath(),path.resolve('packages/solid/src',value.slice('@solid-unstyled/daypicker'.length+1)||'index')).replaceAll(path.sep,'/');
      value=(relative.startsWith('.')?'':'./')+relative+'.js';
    }
    imp.setModuleSpecifier(value);
  }
  let text=f.getFullText().replace(/\bjest\./g,'vi.')
    .replace(/React\.(MouseEvent|KeyboardEvent|FocusEvent)(?:<[^>]+>)?/g,'$1')
    .replace(/(?:React\.)?ChangeEvent<([^>]+)>/g,'Event & {currentTarget:$1;target:$1}')
    .replace(/React\.CSSProperties/g,'JSX.CSSProperties').replace(/React\.ReactNode/g,'JSX.Element')
    .replace(/React\.ComponentProps/g,'ComponentProps').replace(/React\.ComponentType/g,'Component')
    .replace(/React\.Dispatch<React\.SetStateAction<([^>]+)>>/g,'Setter<$1>')
    .replace(/React\.RefObject<([^>]+)>/g,'{current:$1}')
    .replace(/\bclassName=/g,'class=').replace(/\.className\b/g,'.class')
    .replace(/\bhtmlFor=/g,'for=').replace(/\btabIndex=/g,'tabindex=')
    .replace(/e\.target\.value/g,'e.currentTarget.value');
  for(const name of ['fontSize','fontWeight','fontFamily','marginBlock','marginInline','marginRight','marginLeft','marginTop','marginBottom','backgroundColor','borderColor','borderRadius','maxWidth','minWidth','minHeight','maxHeight','paddingTop','paddingBottom','textAlign','verticalAlign','whiteSpace']) {
    const css=name.replace(/[A-Z]/g,c=>`-${c.toLowerCase()}`);
    text=text.replace(new RegExp(`\\b${name}:`,'g'),JSON.stringify(css)+':');
  }
  f.replaceWithText(text);
  for(const call of f.getDescendantsOfKind(SyntaxKind.CallExpression).reverse()) {
    const name=call.getExpression().getText().replace(/^React\./,'');
    if(name==='useState') {
      const decl=call.getParent();const binding=decl.getNameNode();
      if(!Node.isArrayBindingPattern(binding))throw Error('Unexpected state binding');
      const getter=binding.getElements()[0].getNameNode();
      refs(getter,`${getter.getText()}()`);
      let args=call.getArguments().map(x=>x.getText());
      if(args[0]&&Node.isArrowFunction(call.getArguments()[0]))args=[`untrack(${args[0]})`];
      const types=call.getTypeArguments().map(x=>x.getText());
      if(!args.length){args=['undefined'];if(types.length)types[0]+=' | undefined';}
      call.replaceWithText(`createSignal${types.length?`<${types.join(',')}>`:''}(${args.join(',')})`);
    } else if(name==='useId')call.replaceWithText('createUniqueId()');
    else if(name==='useCallback')call.replaceWithText(call.getArguments()[0].getText());
    else if(name==='useMemo') {
      const decl=call.getParent();
      if(Node.isVariableDeclaration(decl)&&Node.isIdentifier(decl.getNameNode()))refs(decl.getNameNode(),`${decl.getName()}()`);
      call.replaceWithText(`createMemo(${call.getArguments()[0].getText()})`);
    } else if(name==='useRef') {
      const type=call.getTypeArguments()[0]?.getText();const value=call.getArguments()[0]?.getText()??'undefined';
      call.replaceWithText(`{current:${value}${type?` as ${type}${value==='null'?' | null':value==='undefined'?' | undefined':''}`:''}}`);
    } else if(name==='useEffect'||name==='useLayoutEffect') {
      const cb=call.getArguments()[0].getText();const deps=call.getArguments()[1]?.getText()??'[]';
      call.replaceWithText(`createEffect(() => ${deps}, ${cb})`);
    }
  }
  if(!f.getBaseName().includes('.test.')) {
    for(const fn of [...f.getFunctions(),...f.getDescendantsOfKind(SyntaxKind.ArrowFunction)].reverse()) {
      if(fn.wasForgotten())continue;
      const body=fn.getBody();if(!body||!Node.isBlock(body))continue;
      if(!body.getDescendants().some(n=>Node.isJsxElement(n)||Node.isJsxSelfClosingElement(n)||Node.isJsxFragment(n)))continue;
      const param=fn.getParameters()[0];
      if(param&&Node.isObjectBindingPattern(param.getNameNode())) {
        const rest=destructure(param.getNameNode(),'componentProps');
        param.getNameNode().replaceWithText('componentProps');
        if(rest)body.insertStatements(0,rest);
      }
      // Unpack props/context views without taking setup-time snapshots.
      for(const decl of body.getStatements().filter(Node.isVariableStatement).flatMap(s=>s.getDeclarations()).reverse()) {
        if(Node.isObjectBindingPattern(decl.getNameNode())) {
          const init=decl.getInitializer();if(!init)continue;
          if(/^(props|componentProps)$/.test(init.getText())||init.getText().startsWith('useDayPicker(')||init.getText().startsWith('useQueryStringSync(')) {
            const id=`context${decl.getStart()}`;const rest=destructure(decl.getNameNode(),id);
            decl.getVariableStatementOrThrow().replaceWithText(`const ${id}=${init.getText()};${rest}`);
          }
        }
      }
      // React recalculated these expressions on each render; Solid uses live derivations.
      for(const decl of body.getStatements().filter(Node.isVariableStatement).flatMap(s=>s.getDeclarations()).reverse()) {
        const init=decl.getInitializer();const name=decl.getNameNode();
        if(!init||!Node.isIdentifier(name)||Node.isArrowFunction(init)||Node.isFunctionExpression(init))continue;
        if(/^(createSignal|createMemo|createEffect|createUniqueId|omit|useDayPicker|useQueryStringSync)\b/.test(init.getText())||init.getText().startsWith('{current:'))continue;
        const expr=init.getText();
        if(/\b(?:props|componentProps|context\d+)\.|\b(?:selected|month|inputValue|isDialogOpen|accentColor|backgroundAccentColor|rangeMiddleColor)\(\)/.test(expr)) {
          if(decl.getName().endsWith('Component')) {
            decl.setInitializer(`dynamic(() => ${expr})`);
          } else {
            refs(name,`${decl.getName()}()`);
            decl.setInitializer(/getDateLib\(|new DateLib/.test(expr)?`createMemo(() => ${expr})`:`() => (${expr})`);
          }
        }
      }
    }
  }
  for(const attr of f.getDescendantsOfKind(SyntaxKind.JsxAttribute).reverse()) {
    const name=attr.getNameNode().getText();const init=attr.getInitializer();
    if(name==='key'){attr.remove();continue;}
    if(name==='ref'&&Node.isJsxExpression(init)&&Node.isIdentifier(init.getExpression())) {
      const ref=init.getExpression().getText();
      if(f.getFullText().includes(`const ${ref} = {current:`)||f.getFullText().includes(`const ${ref} = { current:`))init.replaceWithText(`{node=>{${ref}.current=node;}}`);
    }
    if(name==='onChange') {
      const opening=attr.getParent().getParent();
      if((Node.isJsxSelfClosingElement(opening)||Node.isJsxOpeningElement(opening))&&['input','textarea'].includes(opening.getTagNameNode().getText()))attr.getNameNode().replaceWithText('onInput');
    }
    if(name.startsWith('aria-')&&['aria-expanded','aria-hidden','aria-modal','aria-selected'].includes(name)) {
      if(!init)attr.setInitializer('"true"');
      else if(Node.isJsxExpression(init))init.replaceWithText(`{String(${init.getExpression().getText()})}`);
    }
  }
  if(f.getBaseName().includes('.test.')) {
    for(const call of f.getDescendantsOfKind(SyntaxKind.CallExpression).reverse()) {
      if(call.getExpression().getText()==='render') {
        const arg=call.getArguments()[0];if(arg&&!Node.isArrowFunction(arg))arg.replaceWithText(`() => (${arg.getText()})`);
      }
    }
  }
  const used=[...runtime].filter(name=>new RegExp(`\\b${name}\\b`).test(f.getFullText()));
  if(used.length)f.addImportDeclaration({moduleSpecifier:'solid-js',namedImports:used});
  if(f.getFullText().includes('Setter<'))f.addImportDeclaration({moduleSpecifier:'solid-js',namedImports:[{name:'Setter',isTypeOnly:true}]});
  if(f.getFullText().includes('JSX.'))f.addImportDeclaration({moduleSpecifier:'@solidjs/web',namedImports:[{name:'JSX',isTypeOnly:true}]});
  if(f.getFullText().includes('ComponentProps<'))f.addImportDeclaration({moduleSpecifier:'@solidjs/web',namedImports:[{name:'ComponentProps',isTypeOnly:true}]});
  if(f.getFullText().includes('dynamic('))f.addImportDeclaration({moduleSpecifier:'@solidjs/web',namedImports:['dynamic']});
  if(f.getFullText().includes('Component<'))f.addImportDeclaration({moduleSpecifier:'solid-js',namedImports:[{name:'Component',isTypeOnly:true}]});
  f.formatText({indentSize:2});
}
export function adaptSnippet(source) {
  const p=new Project({useInMemoryFileSystem:true});
  const f=p.createSourceFile('/snippet.tsx',source);
  adaptFile(f);return f.getFullText();
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve('scripts/docs-adapt.mjs')) {
  for(const f of files)adaptFile(f);
  await project.save();
}
