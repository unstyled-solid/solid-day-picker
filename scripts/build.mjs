import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { compile, moduleImports, verifyToolchain } from './distribution/build/compiler.mjs';

const root = path.resolve('packages/solid');
const src = path.join(root, 'src');
const out = path.join(root, 'dist');
async function filesIn(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => entry.isDirectory()
    ? filesIn(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat().sort();
}
verifyToolchain();
const files = (await filesIn(src)).filter(file => /\.tsx?$/.test(file) && !/\.(test|spec|d)\.tsx?$/.test(file));
await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
const program = ts.createProgram(files, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.Preserve,
  jsxImportSource: '@solidjs/web',
  strict: true,
  skipLibCheck: false,
  esModuleInterop: true,
  declaration: true,
  emitDeclarationOnly: true,
  rootDir: src,
  outDir: path.join(out, 'types'),
  types: [],
});
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCanonicalFileName: f => f, getCurrentDirectory: () => process.cwd(), getNewLine: () => '\n',
}));
if (program.emit().emitSkipped) throw new Error('Declaration emit failed');
const graph = new Set(files.map(file => path.relative(src, file).replace(/\.tsx?$/, '.js')));
for (const file of files) {
  const relative = path.relative(src, file);
  const source = await fs.readFile(file, 'utf8');
  for (const [folder, generate] of [['dom', 'dom'], ['server', 'ssr']]) {
    const { code, map } = compile(source, `src/${relative}`, generate);
    for (const specifier of moduleImports(code, relative)) {
      if (specifier.startsWith('.')) {
        const resolved = path.normalize(path.join(path.dirname(relative), specifier));
        if (!graph.has(resolved)) throw new Error(`${relative}: missing runtime import ${specifier}`);
      } else if (!['solid-js', '@solidjs/web', 'date-fns', 'date-fns-jalali', '@date-fns/tz', '@tabby_ai/hijri-converter'].some(name => specifier === name || specifier.startsWith(`${name}/`))) {
        throw new Error(`${relative}: unexpected runtime dependency ${specifier}`);
      }
    }
    const destination = path.join(out, folder, relative.replace(/\.tsx?$/, '.js'));
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, `${code}\n//# sourceMappingURL=${path.basename(destination)}.map\n`);
    await fs.writeFile(`${destination}.map`, JSON.stringify(map));
  }
}
console.log(`Built ${files.length} modules: DOM ESM, server ESM, and strict declarations`);
