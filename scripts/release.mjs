import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

export function releaseOptions(args) {
  const version=args[0];
  if(!version || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(version))
    throw Error('Usage: pnpm release:npm <version> [--tag next] [--dry-run | --publish]');
  let tag=version.includes('-')?'next':'latest';
  let dryRun=false,publish=false;
  for(let i=1;i<args.length;i++) {
    if(args[i]==='--tag') {tag=args[++i];if(!tag || !/^[a-z][a-z0-9-]*$/.test(tag))throw Error('Invalid npm tag');}
    else if(args[i]==='--dry-run')dryRun=true;
    else if(args[i]==='--publish')publish=true;
    else throw Error(`Unknown argument: ${args[i]}`);
  }
  if(dryRun&&publish)throw Error('Choose --dry-run or --publish');
  return {version,tag,dryRun,publish};
}

export async function release(args) {
  const options=releaseOptions(args);
  const root=fileURLToPath(new URL('..',import.meta.url));
  const packageDir=path.join(root,'packages/solid');
  const packageFile=path.join(packageDir,'package.json');
  const lockFile=path.join(root,'pnpm-lock.yaml');
  const originalPackage=await fs.readFile(packageFile,'utf8');
  const originalLock=await fs.readFile(lockFile);
  const pkg=JSON.parse(originalPackage);
  const run=(command,args,cwd=root)=>{
    const result=spawnSync(command,args,{cwd,stdio:'inherit'});
    if(result.error)throw result.error;
    if(result.status!==0)throw Error(`${command} failed (${result.status})`);
  };
  console.log(`${options.dryRun?'Dry run':options.publish?'Publish':'Prepare'} ${pkg.name}@${options.version} (tag: ${options.tag})`);
  try {
    pkg.version=options.version;
    await fs.writeFile(packageFile,JSON.stringify(pkg,null,2)+'\n');
    run('pnpm',['install','--lockfile-only','--offline']);
    run('pnpm',['build']);
    run('npm',['publish','--access','public','--tag',options.tag,...(options.publish?[]:['--dry-run'])],packageDir);
    if(!options.publish&&!options.dryRun)console.log('Version prepared. Publishing requires rerunning with --publish.');
  } finally {
    if(options.dryRun) {
      await fs.writeFile(packageFile,originalPackage);
      await fs.writeFile(lockFile,originalLock);
    }
  }
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
  release(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=1;});
