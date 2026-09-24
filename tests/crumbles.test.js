import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
import {emptyLevel,validateLevel} from '../src/levels.js';
import {updateDevices} from '../src/devices.js';
import {updateCrumbles} from '../src/crumbles.js';
const deck={x:8,y:13,w:4,delay:1.2};
function harness(){const g=Object.create(Game.prototype);g.keys=new Set();g.render=()=>{};g.cb={hud(){},sound(){},dead(){},win(){}};g.load({...emptyLevel(),version:3,width:32,height:18,crumbles:[deck]});g.start();return g;}
function stand(g){Object.assign(g.player,{x:270,y:364,vy:0,ground:true});g.update(1/120);}
function step(g,n){for(let i=0;i<n;i++)g.update(1/120);}
test('landing arms a deck once, warns, collapses and drops the player',()=>{const g=harness();stand(g);const start=g.crumbles[0].startedAt;assert.ok(start>0);step(g,100);assert.equal(g.crumbles[0].startedAt,start);assert.equal(g.crumbles[0].gone,false);assert.equal(g.player.y+26,390);step(g,60);assert.equal(g.crumbles[0].gone,true);assert.ok(g.player.y+26>390);assert.equal(g.crumbleRevision,1);step(g,60);assert.equal(g.crumbleRevision,1);});
test('jumping through a deck from below does not arm it',()=>{const g=harness();Object.assign(g.player,{x:265,y:405,vy:-400,ground:false});step(g,10);assert.ok(g.player.y<390);assert.equal(g.crumbles[0].startedAt,null);});
test('leaving a deck does not cancel its collapse; retry restores it',()=>{const g=harness();stand(g);g.jumpBuffer=.14;g.keys.add('ArrowRight');step(g,180);assert.equal(g.crumbles[0].gone,true);g.load(g.level);assert.equal(g.crumbles[0].gone,false);assert.equal(g.crumbles[0].startedAt,null);assert.equal(g.crumbleRevision,0);});
test('freeze and survey pause collapse but freeze still costs score time',()=>{const g=harness();stand(g);g.activate('freeze');const clock=g.clock,elapsed=g.elapsed;step(g,180);assert.equal(g.clock,clock);assert.ok(g.elapsed>elapsed+1);assert.equal(g.crumbles[0].gone,false);g.effects.freeze=0;g.openMap();step(g,180);assert.equal(g.clock,clock);g.closeMap();step(g,160);assert.equal(g.crumbles[0].gone,true);});
test('collapsed cover invalidates the laser cache and is absent from projectile solids',()=>{const g=harness();g.load({...g.level,devices:[{type:'laser',x:10,y:2,dir:'down',length:13,period:4,on:1,phase:0}]});assert.equal(g.devices[0].beam.ey,390);g.crumbles[0].startedAt=0;g.clock=2;updateCrumbles(g);updateDevices(g,false);assert.equal(g.devices[0].beam.ey,465);assert.ok(!g.nearSolids({x:270,y:390,w:16,h:26}).some(s=>s.crumble));});
test('JSON preserves collapse parameters and rejects invalid or overlapping footprints',()=>{const g=harness();assert.deepEqual(validateLevel(g.level).crumbles,[deck]);for(const patch of [{w:0},{w:9},{x:30},{y:0},{delay:.1},{delay:4}])assert.throws(()=>validateLevel({...g.level,crumbles:[{...deck,...patch}]}));assert.throws(()=>validateLevel({...g.level,crumbles:[deck,deck]}));assert.throws(()=>validateLevel({...g.level,tiles:[...g.level.tiles,{x:10,y:13,type:'solid'}]}));assert.throws(()=>validateLevel({...g.level,platforms:[{x:8,y:14,toX:18,toY:14,w:4,period:6,phase:0}]}),/headroom/);});
