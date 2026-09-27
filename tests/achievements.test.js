import test from 'node:test';import assert from 'node:assert/strict';
import {freshState,loadState,ACHIEVEMENTS,complete} from '../src/state.js';
import {recordMastery,achievementProgress} from '../src/achievements.js';
test('expanded achievements preserve unique legacy IDs and give bounded progress',()=>{
 assert.ok(ACHIEVEMENTS.length>=40);assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size,ACHIEVEMENTS.length);
 const s=freshState();for(const a of ACHIEVEMENTS){const p=achievementProgress(a,s);assert.ok(p.percent>=0&&p.percent<=100);}
 const restored=loadState({getItem:()=>JSON.stringify({...s,achievements:['first','purist'],mastery:{wallJumps:10,bad:-1},fullGoldStages:[0,0,99,-1]})});
 assert.ok(restored.achievements.includes('purist'));assert.ok(restored.achievements.includes('wall-apprentice'));assert.deepEqual(restored.fullGoldStages,[0]);assert.equal(restored.mastery.bad,undefined);
});
test('successful mastery goals unlock at thresholds once and distinguish per-stage exploration',()=>{
 const s=freshState();const result={gold:5,remaining:4,timeLimit:90,stats:{wallJumps:5,jumps:7,switches:3,shieldBlocks:1,gliderUsed:true,helpers:['shield','jump','glider']},comeback:true};
 recordMastery(s,0,result,5);let earned=complete(s,0,86,5,true);assert.ok(earned.some(a=>a.id==='all-gold'));assert.ok(earned.some(a=>a.id==='under-wire'));assert.ok(earned.some(a=>a.id==='combo-route'));assert.equal(s.achievements.includes('wall-apprentice'),false);
 recordMastery(s,0,result,5);earned=complete(s,0,86,5,true);assert.ok(earned.some(a=>a.id==='wall-apprentice'));assert.equal(earned.some(a=>a.id==='all-gold'),false);assert.deepEqual(s.fullGoldStages,[0]);
 for(let i=0;i<10;i++)complete(s,i,25,0,false,'hard',true);assert.ok(s.achievements.includes('pure-chapter-1'));assert.ok(s.achievements.includes('mode-hard'));assert.equal(s.achievements.includes('pure-chapter-2'),false);
});
