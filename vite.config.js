import {defineConfig} from 'vite';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const version=JSON.parse(readFileSync(new URL('./package.json',import.meta.url),'utf8')).version;
let gitHash=process.env.VITE_GIT_HASH||'';
if(!gitHash){try{gitHash=execFileSync('git',['rev-parse','--short=12','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{gitHash='nogit';}}
const manifest=JSON.stringify({version,gitHash});
const versionManifest={
  name:'version-manifest',
  configureServer(server){server.middlewares.use('/version.json',(_req,res)=>{res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(manifest);});},
  configurePreviewServer(server){server.middlewares.use('/version.json',(_req,res)=>{res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(manifest);});},
  generateBundle(){this.emitFile({type:'asset',fileName:'version.json',source:manifest});}
};

export default defineConfig({
  plugins:[versionManifest,{
    name:'license-notice',
    generateBundle(){this.emitFile({type:'asset',fileName:'LICENSE.txt',source:readFileSync(new URL('./LICENSE',import.meta.url),'utf8')});}
  }],
  define:{
    __APP_VERSION__:JSON.stringify(version),
    __GIT_HASH__:JSON.stringify(gitHash),
    __UPDATE_MANIFEST_URL__:JSON.stringify(process.env.VITE_UPDATE_MANIFEST_URL||'/version.json')
  }
});
