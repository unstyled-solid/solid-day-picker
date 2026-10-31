import {Project} from 'ts-morph';
import path from 'node:path';
const project=new Project({tsConfigFilePath:'tsconfig.json',skipAddingFilesFromTsConfig:true});
project.addSourceFilesAtPaths(['packages/solid/src/calendars/**/*.{ts,tsx}','docs/examples/**/*.{ts,tsx}']);
for(const f of project.getSourceFiles()) {
  if(!f.getFilePath().includes('/calendars/')&&!f.getFilePath().includes('/docs/examples/'))continue;
  for(const node of [...f.getImportDeclarations(),...f.getExportDeclarations()]) {
    let value=node.getModuleSpecifierValue();if(!value)continue;
    value=value.replace(/^@daypicker\/react|^react-day-picker/,'@solid-unstyled/daypicker').replace(/^@daypicker\/(buddhist|ethiopic|hebrew|hijri|persian)/,'@solid-unstyled/daypicker/$1');
    if(f.getFilePath().includes('/src/calendars/')&&value.startsWith('@solid-unstyled/daypicker')) {
      const suffix=value.slice('@solid-unstyled/daypicker'.length).replace(/^\//,'')||'index';
      value=path.relative(f.getDirectoryPath(),path.resolve('packages/solid/src',suffix)).replaceAll(path.sep,'/');
      if(!value.startsWith('.'))value='./'+value;value+='.js';
    }
    node.setModuleSpecifier(value);
  }
  if(f.getFullText().includes('act(')&&!f.getImportDeclarations().some(d=>d.getNamedImports().some(n=>n.getName()==='act')))f.addImportDeclaration({moduleSpecifier:'@/test/render',namedImports:['act']});
}
await project.save();
