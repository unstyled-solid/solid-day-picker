import {test} from 'node:test';
import assert from 'node:assert/strict';
import {releaseOptions} from './release.mjs';

test('prepare is the default; publishing requires the explicit flag',()=>{
  assert.deepEqual(releaseOptions(['10.0.2-solid.1']),{version:'10.0.2-solid.1',tag:'next',dryRun:false,publish:false});
  assert.equal(releaseOptions(['10.0.2-solid.1','--publish']).publish,true);
});
test('dry-run cannot be combined with publishing',()=>{
  assert.equal(releaseOptions(['10.0.2-solid.1','--dry-run']).dryRun,true);
  assert.throws(()=>releaseOptions(['10.0.2-solid.1','--dry-run','--publish']));
});
test('reject malformed versions, tags, and unexpected arguments',()=>{
  for(const args of [[],['next'],['01.0.0'],['1.0.0','--push'],['1.0.0','--tag'],['1.0.0','--tag','--publish']])assert.throws(()=>releaseOptions(args));
  assert.equal(releaseOptions(['1.0.0']).tag,'latest');
  assert.equal(releaseOptions(['1.0.0','--tag','beta']).tag,'beta');
});
