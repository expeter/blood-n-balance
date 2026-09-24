import test from 'node:test';
import assert from 'node:assert/strict';
import {complete,freshState,loadState,unlocked,ITEMS,buy,recordDeath,recordGoldPickup,recordItemUse,recordStagePlay} from '../src/state.js';
import {Game} from '../src/engine.js';
import {emptyLevel} from '../src/levels.js';
import {scorePayload} from '../src/score-payload.js';

test('local test builds can select locked levels and record them without changing normal progression',()=>{
 const state=freshState();assert.equal(unlocked(state,55),false);assert.equal(unlocked(state,55,true),true);
 assert.deepEqual(complete(state,55,12,2,false,'medium'),[]);
 complete(state,55,12,2,false,'medium',true);
 assert.equal(state.completed[55].best,12);assert.equal(state.leaderboards[55].medium.itemFree,12);
 complete(state,55,10,1,true,'nightmare',true);
 assert.equal(state.leaderboards[55].nightmare.assisted,10);
});

test('career telemetry, shop counters, and unique gold identities persist',()=>{
 const state=freshState();recordDeath(state,'laser');recordDeath(state,'ghost');recordItemUse(state,'rocket');recordItemUse(state,'rocket');recordItemUse(state,'rocket');for(let i=0;i<7;i++)recordStagePlay(state,4);assert.equal(recordGoldPickup(state,4,0),true);assert.equal(recordGoldPickup(state,4,2),true);assert.equal(recordGoldPickup(state,4,0),false);
 state.coins++;state.totalGold++;
 assert.equal(buy(state,ITEMS[0].id),true);assert.equal(state.shopPurchases.freeze,1);
 const saved=JSON.stringify(state),loaded=loadState({getItem:()=>saved});
 assert.equal(loaded.deathsByCause.laser,1);assert.equal(loaded.itemUses.rocket,3);assert.equal(loaded.shopPurchases.freeze,1);
 assert.equal(loaded.levelPlays[4],7);assert.deepEqual(loaded.gatheredGold[4],[0,2]);
});

test('nightmare ghost routes are deterministic from the stage seed',()=>{
 const a=Object.create(Game.prototype),b=Object.create(Game.prototype);
 for(const game of [a,b]){game.keys=new Set();game.render=()=>{};game.cb={hud(){},sound(){},dead(){},win(){}};game.difficulty='nightmare';game.load(emptyLevel(),42);}
 assert.deepEqual(a.ghost.route,b.ghost.route);assert.equal(a.ghost.seed,42);
 a.updateGhost(.1);b.updateGhost(.1);assert.deepEqual([a.ghost.x,a.ghost.y],[b.ghost.x,b.ghost.y]);
});

test('gold pickups report stable per-stage indexes once each run',()=>{
 const game=Object.create(Game.prototype),found=[];game.keys=new Set();game.render=()=>{};game.cb={hud(){},sound(){},dead(){},win(){},gold:index=>found.push(index)};
 const level=emptyLevel();level.coins=[{x:2,y:15},{x:8,y:15}];game.load(level,7);game.start();game.update(1/120);game.update(1/120);
 assert.deepEqual(found,[0]);
});

test('score exports are shaped for difficulty and assistance leaderboards',()=>{
 const state=freshState();complete(state,0,14.25,1,false,'easy');complete(state,0,12.5,1,true,'easy');
 const payload=scorePayload(state,{playerName:'Test pilot',gameVersion:'0.2.0',gitHash:'123abc',exportedAt:'2026-01-01T00:00:00Z'});
 assert.equal(payload.playerName,'Test pilot');assert.equal(payload.leaderboards[0].easy.itemFree,14.25);assert.equal(payload.leaderboards[0].easy.assisted,12.5);
 assert.equal(payload.gitHash,'123abc');assert.equal(payload.schemaVersion,2);
});

test('Enter retries from the death card or queues during the death animation, but not during play',()=>{
 const originalDocument=globalThis.document;globalThis.document={querySelector:()=>null};
 try{const game=Object.create(Game.prototype);game.canvas={closest:()=>null};game.cb={gesture(){},retry(){game.retries=(game.retries||0)+1;}};game.status='playing';let prevented=0;
  const event={target:{tagName:'CANVAS'},code:'Enter',repeat:false,preventDefault(){prevented++;}};
  game.handleKeyDown(event);assert.equal(game.retries||0,0);game.status='dying';game.handleKeyDown(event);assert.equal(game.retryWhenDead,true);game.status='dead';game.handleKeyDown(event);assert.equal(game.retries,1);assert.equal(prevented,3);
 }finally{globalThis.document=originalDocument;}
});
