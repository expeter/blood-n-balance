import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
import {emptyLevel,validateLevel,campaignLevel} from '../src/levels.js';
import {laserPhase,updateDevices,validateDevices} from '../src/devices.js';
const laser={type:'laser',x:4,y:10,dir:'right',length:20,period:4,on:1,phase:0};
function harness(extra={}){const g=Object.create(Game.prototype);g.keys=new Set();g.render=()=>{};g.cb={hud(){},sound(){},dead(){},win(){}};g.load({...emptyLevel(),version:3,width:32,height:18,switches:[],gates:[],exitRequires:[],devices:[laser],...extra});g.start();return g;}
test('laser has an off window, warning, firing interval, and linked shutdown',()=>{
 const active=new Set();assert.equal(laserPhase(laser,0,active),'idle');assert.equal(laserPhase(laser,2.6,active),'warning');assert.equal(laserPhase(laser,3,active),'active');assert.equal(laserPhase(laser,4,active),'idle');assert.equal(laserPhase({...laser,offSwitch:'A'},3,new Set(['A'])),'disabled');
});
test('walls and closed gates stop beams; opening a gate exposes the lane',()=>{
 const base=emptyLevel();const g=harness({tiles:[...base.tiles,{x:18,y:10,type:'solid'}],switches:[{id:'A',x:3,y:15}],gates:[{switchId:'A',x:9,y:9,w:1,h:3}]});
 assert.equal(g.devices[0].beam.ex,270);g.activated.add('A');updateDevices(g,false);assert.equal(g.devices[0].beam.ex,540);
 for(const [dir,x,y,ex,ey] of [['left',24,10,570,315],['up',18,14,555,330],['down',18,4,555,300]]){g.level.devices=[{...laser,dir,x,y,length:dir==='down'?10:dir==='up'?10:20}];g.load(g.level);assert.equal(g.devices[0].beam.ex,ex);assert.equal(g.devices[0].beam.ey,ey);}
});
test('warning is harmless, an active beam kills, and swept crossing cannot tunnel',()=>{
 const g=harness();Object.assign(g.player,{x:200,y:302});g.clock=2.8;updateDevices(g);assert.equal(g.status,'playing');g.clock=3.2;updateDevices(g);assert.equal(g.status,'dying');assert.equal(g.deathCause,'laser');
 const h=harness();Object.assign(h.player,{x:200,y:340});h.previousPlayer={...h.player,y:270};h.clock=3.2;updateDevices(h);assert.equal(h.status,'dying');
});
test('laser shield is consumed once and immunity does not last forever',()=>{
 const g=harness();Object.assign(g.player,{x:200,y:302});g.clock=3.2;g.effects.shield=5;updateDevices(g);assert.equal(g.status,'playing');assert.equal(g.effects.shield,0);assert.equal(g.invulnerable,1.5);updateDevices(g);assert.equal(g.status,'playing');g.invulnerable=0;updateDevices(g);assert.equal(g.status,'dying');
});
test('freeze pauses laser phase but does not turn an active beam off; retry resets',()=>{
 const g=harness();g.clock=3.2;g.activate('freeze');for(let i=0;i<30;i++)g.update(1/120);assert.equal(g.clock,3.2);assert.equal(g.devices[0].state,'active');assert.ok(g.elapsed>.24);Object.assign(g.player,{x:200,y:302});g.previousPlayer={...g.player};updateDevices(g);assert.equal(g.status,'dying');g.load(g.level);assert.equal(g.clock,0);assert.equal(g.devices[0].state,'idle');
});
test('version 3 round trips devices and rejects invalid parameters or overlaps',()=>{
 const l=campaignLevel(10),restored=validateLevel(JSON.parse(JSON.stringify(l)));assert.deepEqual(restored.devices,l.devices);assert.equal(restored.version,3);
 for(const patch of [{period:1},{on:4},{phase:4},{length:99},{dir:'constructor'},{offSwitch:'Z'},{x:31}])assert.throws(()=>validateDevices([{...laser,...patch}],32,18,new Set()));
 assert.throws(()=>validateLevel({...l,devices:[{...l.devices[0],x:l.spawn.x,y:l.spawn.y,dir:'up',length:1}]}),/share a tile/);
});

test('turret wind-up, cadence, shutdown, and retry reset',()=>{
 const gun={type:'turret',x:4,y:10,dir:'right',period:3,phase:0,speed:240,offSwitch:'A'};
 const g=harness({devices:[gun],switches:[{id:'A',x:5,y:15}]});
 g.clock=2.5;updateDevices(g,false);assert.equal(g.devices[0].state,'warning');assert.equal(g.projectiles.length,0);
 g.clock=3;updateDevices(g,false);assert.equal(g.projectiles.length,1);const x=g.projectiles[0].x;
 g.activated.add('A');g.clock=3.1;updateDevices(g,false);assert.equal(g.devices[0].state,'disabled');assert.ok(g.projectiles[0].x>x,'Shutdown must not recall a shot');
 g.clock=6;updateDevices(g,false);assert.ok(g.projectiles.length<=1);g.load(g.level);assert.equal(g.projectiles.length,0);assert.equal(g.lastDeviceClock,0);
});
test('projectiles cannot tunnel through cover or hit a player behind it',()=>{
 const l=emptyLevel(),g=harness({devices:[],tiles:[...l.tiles,{x:10,y:10,type:'solid'}]});
 Object.assign(g.player,{x:360,y:300});g.previousPlayer={...g.player};g.projectiles=[{x:280,y:315,vx:600,vy:0,life:5}];g.clock=.3;updateDevices(g);assert.equal(g.projectiles.length,0);assert.equal(g.status,'playing');
 g.solidGrid.delete('10,10');g.projectiles=[{x:280,y:315,vx:600,vy:0,life:5}];g.clock=.6;updateDevices(g);assert.equal(g.status,'dying');assert.equal(g.deathCause,'bullet');
});
test('frozen bullets remain stationary and dangerous to a crossing player',()=>{
 const g=harness({devices:[]});g.projectiles=[{x:200,y:315,vx:240,vy:0,life:5}];g.activate('freeze');g.update(1/120);assert.equal(g.projectiles[0].x,200);assert.equal(g.projectiles[0].life,5);
 Object.assign(g.player,{x:220,y:302});g.previousPlayer={...g.player,x:170};updateDevices(g);assert.equal(g.status,'dying');
});
test('shield absorbs and removes one projectile',()=>{
 const g=harness({devices:[]});Object.assign(g.player,{x:200,y:302});g.effects.shield=5;g.projectiles=[{x:202,y:310,vx:240,vy:0,life:5}];updateDevices(g);assert.equal(g.status,'playing');assert.equal(g.effects.shield,0);assert.equal(g.projectiles.length,0);
});
test('turret JSON preserves bounded speed, direction, phase and links',()=>{
 const l=campaignLevel(20);assert.deepEqual(validateLevel(JSON.parse(JSON.stringify(l))).devices,l.devices);
 const d=l.devices[0];for(const patch of [{speed:NaN},{speed:1000},{period:.5},{phase:20},{dir:'bad'},{offSwitch:'Z'}])assert.throws(()=>validateDevices([{...d,...patch}],48,24,new Set(['A'])));
});
