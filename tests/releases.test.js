import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../vite.config.js';
import {compareVersions,updateAvailable} from '../src/releases.js';
import {APP_VERSION,GIT_HASH,UPDATE_MANIFEST_URL} from '../src/build-info.js';

test('build metadata has safe defaults outside a Vite-processed bundle',()=>{
 assert.equal(APP_VERSION,'0.1.0');
 assert.equal(GIT_HASH,'nogit');
 assert.equal(UPDATE_MANIFEST_URL,'/version.json');
});

test('release comparison ignores patch order correctly and accepts an optional v prefix',()=>{
 assert.equal(compareVersions('0.2.0','0.1.9'),1);
 assert.equal(compareVersions('v1.2.3','1.2.3'),0);
 assert.equal(compareVersions('1.0.0','1.0.1'),-1);
});

test('update prompt requires a newer version or a changed source hash',()=>{
 const current={version:'0.1.0',gitHash:'abc123'};
 assert.equal(updateAvailable(current,{version:'0.2.0',gitHash:'def456'}),true);
 assert.equal(updateAvailable(current,{version:'0.1.0',gitHash:'abc123'}),false);
 assert.equal(updateAvailable(current,{version:'0.1.0',gitHash:'def456'}),true);
 assert.equal(updateAvailable(current,{version:'0.0.9',gitHash:'def456'}),false);
 assert.equal(updateAvailable(current,null),false);
});

test('Vite serves and builds the same no-cache version manifest',()=>{
 const plugin=config.plugins.find(p=>p.name==='version-manifest');let response='';
 plugin.generateBundle.call({emitFile:asset=>{assert.equal(asset.fileName,'version.json');response=asset.source;}});
 const manifest=JSON.parse(response);assert.equal(manifest.version,'0.1.0');assert.equal(typeof manifest.gitHash,'string');
 const handlers={};plugin.configureServer({middlewares:{use:(path,handler)=>{handlers[path]=handler;}}});
 const headers={};handlers['/version.json']({}, {setHeader:(name,value)=>headers[name]=value,end:value=>response=value});
 assert.equal(headers['Cache-Control'],'no-store');assert.deepEqual(JSON.parse(response),manifest);
});
