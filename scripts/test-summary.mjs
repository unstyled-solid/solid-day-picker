import fs from 'node:fs/promises';
const report = JSON.parse(await fs.readFile(process.argv[2]??'tracking/test-results.json', 'utf8'));
const failures = report.testResults.flatMap(file => file.assertionResults
  .filter(test => test.status === 'failed')
  .map(test => ({ file: file.name, test: test.fullName, messages: test.failureMessages })));
console.log(JSON.stringify({ files: report.testResults.length, passed: report.numPassedTests,
  failed: report.numFailedTests, skipped: report.numPendingTests, success: report.success, failures }, null, 2));
if (!report.success || report.numFailedTests) process.exitCode = 1;
