import test from 'node:test';
import assert from 'node:assert/strict';
import {unlockedCosmetics} from '../src/cosmetics.js';
import {freshState,loadState} from '../src/state.js';

function progress(count){return {completed:Object.fromEntries(Array.from({length:count},(_,i)=>[i,{best:1}]))};}

test('cosmetic rewards unlock at ten-stage milestones through full completion',()=>{
 for(const count of [0,9]){const unlocked=unlockedCosmetics(progress(count));assert.deepEqual(unlocked.palettes.map(x=>x.id),['midnight']);assert.deepEqual(unlocked.skins.map(x=>x.id),['classic']);}
 assert.ok(unlockedCosmetics(progress(10)).palettes.some(x=>x.id==='aurora'));
 assert.ok(!unlockedCosmetics(progress(19)).skins.some(x=>x.id==='ember'));
 assert.ok(unlockedCosmetics(progress(20)).skins.some(x=>x.id==='ember'));
 assert.ok(unlockedCosmetics(progress(99)).skins.some(x=>x.id==='ascendant'));
});

test('palette and ninja selections survive save loading and invalid ids fall back safely',()=>{
 const save=freshState();save.settings.palette='sunset';save.settings.skin='arctic';
 const loaded=loadState({getItem:()=>JSON.stringify(save)});
 assert.equal(loaded.settings.palette,'sunset');assert.equal(loaded.settings.skin,'arctic');
 save.settings.palette='military';save.settings.skin='unknown';
 const safe=loadState({getItem:()=>JSON.stringify(save)});
 assert.equal(safe.settings.palette,'midnight');assert.equal(safe.settings.skin,'classic');
});
