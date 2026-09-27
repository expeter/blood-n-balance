import test from 'node:test';
import assert from 'node:assert/strict';
import {previewJump} from '../src/jump-preview.js';
import {emptyLevel,campaignLevel} from '../src/levels.js';

test('jump probe uses supported takeoff, respects difficulty and run-up, and never edits the room',()=>{
 const level=emptyLevel(),before=structuredClone(level);
 const standing=previewJump(level,{x:10,y:16}),running=previewJump(level,{x:10,y:16},{running:true}),easy=previewJump(level,{x:10,y:16},{difficulty:'easy'});
 assert.equal(standing.valid,true);assert.equal(standing.paths.length,2);
 for(const path of standing.paths){assert.equal(path.outcome,'landed');assert.ok(path.rise>100&&path.rise<110);assert.ok(path.range>170&&path.range<190);}
 assert.ok(running.paths[1].range>standing.paths[1].range);
 assert.ok(easy.paths[1].rise>standing.paths[1].rise);
 assert.deepEqual(previewJump(level,{x:10,y:15}),standing,'hovering the empty cell above the floor uses the same takeoff');
 assert.deepEqual(level,before);
});

test('jump probe accounts for walls and ceilings instead of drawing an unrestricted radius',()=>{
 const level=emptyLevel(),clear=previewJump(level,{x:10,y:16});
 for(let y=9;y<16;y++)level.tiles.push({x:12,y,type:'solid'});
 const blocked=previewJump(level,{x:10,y:16});assert.ok(blocked.paths[1].range<clear.paths[1].range/2);
 level.tiles.push({x:10,y:14,type:'solid'});
 const ceiling=previewJump(level,{x:10,y:16});assert.ok(ceiling.paths[1].rise<10);
 level.tiles.push({x:10,y:15,type:'solid'});
 assert.equal(previewJump(level,{x:10,y:16}).valid,false);
 assert.equal(previewJump(level,{x:20,y:4}).valid,false);
 assert.equal(previewJump(level,{x:-1,y:4}).valid,false);
});

test('jump probe terminates at hazards and is reproducible without gameplay side effects',()=>{
 const level=emptyLevel();level.tiles.push({x:16,y:15,type:'spike'});
 const first=previewJump(level,{x:10,y:16});
 assert.equal(first.paths[1].outcome,'hazard');assert.equal(first.paths[1].cause,'spikes');
 assert.deepEqual(previewJump(level,{x:10,y:16}),first);
 const large=campaignLevel(98),before=JSON.stringify(large);previewJump(large,{x:3,y:54});assert.equal(JSON.stringify(large),before);
});
