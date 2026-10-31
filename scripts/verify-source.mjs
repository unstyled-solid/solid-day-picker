import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';

const source = 'upstream/react-day-picker/packages/react-day-picker/src';
const target = 'packages/solid/src';
const manifest = JSON.parse(await fs.readFile('packages/solid/src.source-copy.json', 'utf8'));
assert.equal(execFileSync('git', ['-C', 'upstream/react-day-picker', 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), manifest.sourceSha);
assert.equal(execFileSync('git', ['-C', 'upstream/react-day-picker', 'status', '--porcelain'], { encoding: 'utf8' }).trim(), '');
function registrations(code, filename) {
  const file = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true);
  const result = [];
  const callee = node => ts.isIdentifier(node) ? node.text
    : ts.isPropertyAccessExpression(node) ? `${callee(node.expression)}.${node.name.text}`
    : ts.isCallExpression(node) ? callee(node.expression) : '';
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const name = callee(node.expression);
      const last = node.arguments.at(-1);
      if (/^(test|it|describe)(\.|$)/.test(name) &&
          (last && (ts.isArrowFunction(last) || ts.isFunctionExpression(last)) || name.endsWith('.todo'))) {
        result.push({ name, title: node.arguments[0]?.getText(file) });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return result;
}
const runtime = (code, filename) => ts.transpileModule(code, {
  fileName: filename, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, removeComments: true },
}).outputText;
let suites = 0, cases = 0, unchangedAlgorithms = 0;
for (const file of manifest.files) {
  const original = await fs.readFile(path.join(source, file.path));
  assert.equal(createHash('sha256').update(original).digest('hex'), file.sha256, `Source pin changed: ${file.path}`);
  const copied = await fs.readFile(path.join(target, file.path), 'utf8');
  if (file.category === 'test-or-type-spec') {
    const expected = registrations(original.toString(), file.path);
    assert.deepEqual(registrations(copied, file.path), expected, `Test registration changed: ${file.path}`);
    suites++;
    cases += expected.filter(item => !item.name.startsWith('describe')).length;
  } else if (/^(classes|formatters|labels|utils|helpers)\//.test(file.path) && file.path !== 'helpers/useControlledValue.ts') {
    assert.equal(runtime(copied, file.path), runtime(original.toString(), file.path), `Pure algorithm changed: ${file.path}`);
    unchangedAlgorithms++;
  }
}
const report = { sourceSha: manifest.sourceSha, copiedCoreFiles: manifest.files.length, retainedCoreSuites: suites,
  retainedStaticTestRegistrations: cases, unchangedAlgorithmModules: unchangedAlgorithms };
await fs.writeFile('tracking/source-verification.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
