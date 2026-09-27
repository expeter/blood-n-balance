import {readFileSync,writeFileSync} from 'node:fs';
const version=process.argv[2];if(!/^\d+\.\d+\.\d+$/.test(version||''))throw Error('Usage: node scripts/set-version.mjs X.Y.Z');
const pkg=JSON.parse(readFileSync('package.json'));const old=pkg.version;pkg.version=version;writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');
const lock=JSON.parse(readFileSync('package-lock.json'));lock.version=version;lock.packages[''].version=version;writeFileSync('package-lock.json',JSON.stringify(lock,null,2)+'\n');
for(const file of ['src/build-info.js'])writeFileSync(file,readFileSync(file,'utf8').replaceAll(`'${old}'`,`'${version}'`));
writeFileSync('README.md',readFileSync('README.md','utf8').replace(`Current version ${old}`,`Current version ${version}`));
writeFileSync('docs/specs/current-game.md',readFileSync('docs/specs/current-game.md','utf8').replace(`baseline, version \`${old}\``,`baseline, version \`${version}\``));
console.log(`${old} -> ${version}`);
