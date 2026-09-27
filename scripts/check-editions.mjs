import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const version=JSON.parse(readFileSync('package.json')).version;
for(const [dir,edition,title,icon] of [['dist','original','Blood &amp; Balance','favicon'],['dist-kids','kids','Cloud &amp; Clover','kids-icon']]){
 const manifest=JSON.parse(readFileSync(`${dir}/version.json`));assert.equal(manifest.version,version);assert.equal(manifest.edition,edition);
 const html=readFileSync(`${dir}/index.html`,'utf8');assert.ok(html.includes(title));assert.match(html,new RegExp(`/assets/${icon}-`));
 if(edition==='kids'){assert.doesNotMatch(html,/blood|brutal|deadly/i);assert.ok(!readdirSync(`${dir}/assets`).some(f=>f.startsWith('favicon-')));}
}
console.log('Both edition identities and icons verified.');
