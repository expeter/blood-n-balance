import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
import {emptyLevel,validateLevel} from '../src/levels.js';
import {platformPosition,movePlatforms} from '../src/platforms.js';
const path={x:8,y:13,toX:18,toY:13,w:4,period:6,phase:0};
function harness(paths=[path]){const g=Object.create(Game.prototype);g.keys=new Set();g.render=()=>{};g.cb={hud(){},sound(){},dead(){},win(){}};g.load({...emptyLevel(),version:3,width:32,height:18,platforms:paths});g.start();return g;}
function stand(g,index=0){const s=g.platforms[index];Object.assign(g.player,{x:s.x+20,y:s.y-26,vy:0,ground:true});}
test('platform path reverses at each endpoint deterministically',()=>{assert.deepEqual(platformPosition(path,0),{x:240,y:390});assert.deepEqual(platformPosition(path,3),{x:540,y:390});assert.deepEqual(platformPosition(path,6),{x:240,y:390});});
test('standing player is carried horizontally; other platforms continue to move',()=>{const g=harness([path,{...path,y:7,toY:7,phase:1}]);stand(g);const x=g.player.x,other=g.platforms[1].x;for(let i=0;i<120;i++)g.update(1/120);assert.ok(g.player.x>x+20);assert.ok(Math.abs(g.player.x-g.platforms[0].x-20)<.001);assert.ok(g.player.ground);assert.notEqual(g.platforms[1].x,other);});
test('vertical lift carries both upwards and downwards without losing contact',()=>{const g=harness([{...path,toX:8,toY:5}]);stand(g);for(let i=0;i<600;i++){g.update(1/120);assert.ok(g.player.ground);assert.ok(Math.abs(g.player.y+26-g.platforms[0].y)<.001);}assert.equal(g.status,'playing');});
test('jumping leaves the platform; a platform is passable from underneath',()=>{const g=harness();stand(g);g.jumpBuffer=.14;g.update(1/120);assert.equal(g.player.ground,false);assert.ok(g.player.vy<0);const h=harness();Object.assign(h.player,{x:260,y:405,vy:-400,ground:false});for(let i=0;i<10;i++)h.update(1/120);assert.ok(h.player.y<390);assert.ok(h.player.vy<0);});
test('freeze and survey stop platforms; retry restores their initial phases',()=>{const g=harness();stand(g);g.activate('freeze');g.update(.2);assert.equal(g.platforms[0].x,240);g.effects.freeze=0;g.openMap();g.update(.2);assert.equal(g.platforms[0].x,240);g.closeMap();for(let i=0;i<120;i++)g.update(1/120);assert.ok(g.platforms[0].x>240);g.load(g.level);assert.equal(g.platforms[0].x,240);});
test('platform format preserves paths and rejects dangerous rails and unbounded speeds',()=>{const g=harness();assert.deepEqual(validateLevel(g.level).platforms,[path]);for(const patch of [{toY:10},{w:12},{period:.1},{phase:9},{y:16,toY:16},{toX:31}])assert.throws(()=>validateLevel({...g.level,platforms:[{...path,...patch}]}));assert.throws(()=>validateLevel({...g.level,tiles:[...g.level.tiles,{x:14,y:12,type:'solid'}]}),/headroom/);});

test('a moving deck blocks a downward beam and updates cover every tick',async()=>{
 const {updateDevices}=await import('../src/devices.js');
 const g=harness();g.load({...g.level,devices:[{type:'laser',x:10,y:2,dir:'down',length:13,period:4,on:1,phase:0}]});
 assert.equal(g.devices[0].beam.ey,390);g.clock=3;movePlatforms(g,false);updateDevices(g,false);assert.equal(g.devices[0].beam.ey,465);
});
test('falling onto a deck lands on its top without snagging on its side',()=>{
 const g=harness();Object.assign(g.player,{x:265,y:330,vy:200,ground:false});for(let i=0;i<40;i++)g.update(1/120);assert.equal(g.player.ground,true);assert.equal(g.player.y+26,g.platforms[0].y);
});
