import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {Game} from '../src/engine.js';import {bossArena,hasBoss,combineChapterResults} from '../src/bosses.js';
function game(index,difficulty='medium'){const g=Object.create(Game.prototype);g.keys=new Set();g.difficulty=difficulty;g.render=()=>{};g.cb={hud(){},sound(){},win(){},dying(){},dead(){}};g.load(bossArena(index));g.start();return g;}
for(const difficulty of ['easy','medium','hard'])for(const index of [9,19,29,39,49,59,69,79,89,98])test(`chapter ${Math.floor(index/10)+1} boss can be cleared without helpers on ${difficulty}`,()=>{
 const replay=JSON.parse(readFileSync(new URL(`./fixtures/bosses/${index+1}-${difficulty}.json`,import.meta.url)));const g=game(index,difficulty);
 assert.equal(g.exitUnlocked,false);for(const action of replay.actions){g.keys.clear();if(action.dir)g.keys.add(action.dir>0?'ArrowRight':'ArrowLeft');for(let f=0;f<action.frames&&g.status==='playing';f++){if(action.jump)g.jumpBuffer=.14;g.update(1/120);}}
 assert.equal(g.status,'won');assert.equal(g.boss.hp,0);assert.equal(g.exitUnlocked,true);assert.equal(g.usedItems,false);
});
test('boss stage boundaries and combined completion preserve staged gold and assistance',()=>{
 assert.deepEqual(Array.from({length:99},(_,i)=>i).filter(hasBoss),[9,19,29,39,49,59,69,79,89,98]);
 const result={time:10,timeLimit:120,remaining:110,gold:4,goldIds:[1,2,3,4],usedItems:false,stats:{jumps:2,wallJumps:1,switches:2,shieldBlocks:0,gliderUsed:false,helpers:[]}};
 const combined=combineChapterResults(result,{...result,time:20,gold:0,goldIds:[],usedItems:true,stats:{...result.stats,helpers:['shield']}});
 assert.equal(combined.time,30);assert.equal(combined.gold,4);assert.deepEqual(combined.goldIds,result.goldIds);assert.equal(combined.usedItems,true);assert.deepEqual(combined.stats.helpers,['shield']);assert.equal(combined.stats.jumps,4);
});
test('closed head and floor waves are harmful, freeze stops wave movement, loading clears encounter state',()=>{
 const g=game(9);g.player.x=460;g.player.y=475;g.update(1/120);assert.equal(g.status,'dying');assert.equal(g.deathCause,'boss');
 g.load(bossArena(9));g.start();g.boss.waves=[{x:600,y:498,dir:1}];g.effects.freeze=2;g.update(1/120);assert.equal(g.boss.waves[0].x,600);assert.equal(g.clock,0);
 g.load({...bossArena(9),boss:undefined});assert.equal(g.boss,null);
});
