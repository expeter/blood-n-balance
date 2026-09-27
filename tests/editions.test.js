import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {campaignLevel} from '../src/levels.js';
import {kidsText} from '../src/edition.js';
import {ITEMS,ACHIEVEMENTS} from '../src/state.js';
const physics=l=>{const {name,lesson,skill,...rest}=l;return rest;};
test('all 99 kids rooms have identical rules and geometry, with separate presentation',()=>{
 const code=`globalThis.__GAME_EDITION__='kids';const {campaignLevel}=await import('./src/levels.js');console.log(JSON.stringify(Array.from({length:99},(_,i)=>campaignLevel(i))));`;
 const kids=JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',code],{maxBuffer:16e6}));
 for(let i=0;i<99;i++){assert.deepEqual(physics(kids[i]),physics(campaignLevel(i)));assert.notEqual(kids[i].name,campaignLevel(i).name);}
});
test('kids labels are stable across UI updates and cover public catalogs',()=>{
 const labels=[...ITEMS,...ACHIEVEMENTS,...Array.from({length:99},(_,i)=>campaignLevel(i))].flatMap(o=>[o.name,o.description,o.lesson].filter(Boolean));
 for(const label of labels){const result=kidsText(label);assert.equal(kidsText(result),result);assert.doesNotMatch(result,/\b(blood|skeleton|death|deadly|ninja|brutal|saw|spike|laser|turret|rocket)\b/i);}
 assert.equal(kidsText('Blood and Balance home'),'Cloud & Clover home');
});
test('kids failures never create blood, bones, stains or death audio noise',()=>{
 const code=`globalThis.__GAME_EDITION__='kids';
 const assert=(await import('node:assert/strict')).default;
 const {breakApart,splatter}=await import('./src/effects.js');
 for(const cause of ['saw','spikes','laser','projectile','ghost','fall','timeout']){const g={player:{x:0,y:0},burst(){},blood:[],debris:[],stains:[]};breakApart(g,cause);splatter(g,0,0,50);assert.deepEqual([g.blood,g.debris,g.stains],[[],[],[]]);assert.equal(g.shake,0);}
 const {Sound}=await import('./src/audio.js');const s=new Sound({sound:true});s.ctx={createBuffer(){throw Error('adult noise invoked')}};let tones=0;s.tone=(f,d,type)=>{assert.equal(type,'sine');tones++;};s.play('death');s.play('rocket-impact');assert.equal(tones,2);
 const {editionStorage}=await import('./src/edition.js');const map=new Map([['save','adult']]);const storage=editionStorage({getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)});storage.setItem('save','kids');assert.equal(map.get('save'),'adult');assert.equal(storage.getItem('save'),'kids');`;
 execFileSync(process.execPath,['--input-type=module','-e',code]);
});
