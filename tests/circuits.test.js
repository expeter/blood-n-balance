import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
import {emptyLevel,validateLevel,campaignLevel} from '../src/levels.js';
import {updateSwitches,conditionsMet} from '../src/circuits.js';
import {updateDevices} from '../src/devices.js';
function harness(extra={}){const g=Object.create(Game.prototype);g.keys=new Set();g.render=()=>{};g.cb={hud(){},sound(){},dead(){},win(){}};g.load({...emptyLevel(),version:3,width:32,height:18,switches:[{id:'A',x:5,y:15,mode:'toggle',initial:false},{id:'B',x:12,y:15}],gates:[{switchId:'A',x:8,y:13,w:1,h:3,states:{A:true}}],exitRequires:['B'],exitStates:{A:false},...extra});g.start();return g;}
function touch(g,x,y=15){Object.assign(g.player,{x:x*30+7,y:y*30+2,vx:0,vy:0});updateSwitches(g);}
test('lever toggles once on entry, requires leaving its circle, and works while frozen',()=>{
 const g=harness();touch(g,5);assert.ok(g.activated.has('A'));for(let i=0;i<100;i++)updateSwitches(g);assert.ok(g.activated.has('A'));
 g.player.x+=22;updateSwitches(g);touch(g,5);assert.ok(g.activated.has('A'),'Small movement inside hysteresis must not toggle');touch(g,3);g.activate('freeze');touch(g,5);assert.ok(!g.activated.has('A'));assert.ok(g.visited.has('A'));
});
test('paired gates invert state and an AND gate requires every condition',()=>{
 const g=harness({gates:[{switchId:'A',x:8,y:13,w:1,h:3,states:{A:true}},{switchId:'A',x:10,y:13,w:1,h:3,states:{A:false}},{switchId:'A',x:14,y:13,w:1,h:3,states:{A:true,B:true}}]});
 assert.deepEqual(g.gates.map(s=>g.gateOpen(s)),[false,true,false]);touch(g,5);assert.deepEqual(g.gates.map(s=>g.gateOpen(s)),[true,false,false]);touch(g,12);assert.deepEqual(g.gates.map(s=>g.gateOpen(s)),[true,false,true]);assert.ok(conditionsMet({A:true,B:true},g.activated));
});
test('closing door defers while occupied, then closes; a closed door cannot be walked through',()=>{
 const g=harness();touch(g,5);const gate=g.gates[0];assert.ok(g.gateOpen(gate));Object.assign(g.player,{x:245,y:430});g.activated.delete('A');assert.ok(g.gateOpen(gate));assert.ok(gate.pendingClose);assert.ok(!g.nearSolids(g.player).includes(gate));
 g.player.x=280;assert.equal(g.gateOpen(gate),false);assert.equal(gate.pendingClose,false);g.player.x=245;assert.equal(g.gateOpen(gate),false);assert.ok(g.nearSolids(g.player).includes(gate));
});
test('exit needs its collected switch and the specified OFF state',()=>{
 const g=harness();assert.equal(g.exitUnlocked,false);touch(g,5);touch(g,12);assert.equal(g.exitUnlocked,false);touch(g,5);assert.equal(g.exitUnlocked,true);assert.deepEqual([...g.visited].sort(),['A','B']);
});
test('initial ON and reset preserve the blueprint but clear visit/contact history',()=>{
 const g=harness({switches:[{id:'A',x:5,y:15,mode:'toggle',initial:true},{id:'B',x:12,y:15}]});assert.ok(g.activated.has('A'));touch(g,5);assert.ok(!g.activated.has('A'));g.load(g.level);assert.ok(g.activated.has('A'));assert.equal(g.visited.size,0);assert.equal(g.switchContacts.size,0);assert.equal(g.level.switches[0].initial,true);
});
test('laser cover cache follows a deferred door closure even without another switch change',()=>{
 const g=harness({switches:[{id:'A',x:5,y:15,mode:'toggle',initial:true}],exitRequires:[],gates:[{switchId:'A',x:10,y:9,w:1,h:3,states:{A:true}}],devices:[{type:'laser',x:4,y:10,dir:'right',length:20,period:4,on:1,phase:0}]});
 assert.equal(g.devices[0].beam.ex,735);g.activated.delete('A');Object.assign(g.player,{x:305,y:300});updateDevices(g,false);assert.equal(g.devices[0].beam.ex,735);g.player.x=350;updateDevices(g,false);assert.equal(g.devices[0].beam.ex,300);
});
test('version 3 preserves relay conditions and rejects contradictory or dangling requirements',()=>{
 const l=campaignLevel(44),copy=validateLevel(JSON.parse(JSON.stringify(l)));assert.deepEqual(copy.exitStates,l.exitStates);assert.deepEqual(copy.switches,l.switches);assert.deepEqual(copy.gates,l.gates);
 assert.throws(()=>validateLevel({...l,exitStates:{Z:false}}),/existing/);assert.throws(()=>validateLevel({...l,exitRequires:['A'],exitStates:{A:false}}),/ON and OFF/);
 assert.throws(()=>validateLevel({...l,gates:[{...l.gates[0],states:{B:true}}]}),/primary/);assert.throws(()=>validateLevel({...l,switches:l.switches.map(s=>({...s,mode:'random'}))}),/mode/);
});

import {timerRemaining,expireSwitches} from '../src/circuits.js';
test('timed switch expires on the world clock and standing on it does not refresh it',()=>{
 const g=harness({switches:[{id:'A',x:5,y:15,mode:'timed',duration:3}],exitRequires:['A'],exitStates:{}});touch(g,5);assert.equal(timerRemaining(g,'A'),3);assert.equal(g.exitUnlocked,true);
 g.clock=2;updateSwitches(g);assert.equal(timerRemaining(g,'A'),1);g.clock=3;updateSwitches(g);assert.equal(g.activated.has('A'),false);assert.equal(g.exitUnlocked,false);assert.equal(timerRemaining(g,'A'),0);assert.ok(g.visited.has('A'));
 touch(g,3);touch(g,5);assert.ok(g.activated.has('A'));assert.equal(timerRemaining(g,'A'),3);
});
test('re-entering a live timer refreshes it; pause and freeze preserve its remaining time',()=>{
 const g=harness({switches:[{id:'A',x:5,y:15,mode:'timed',duration:8}],exitRequires:[],exitStates:{}});touch(g,5);g.clock=2;touch(g,3);touch(g,5);assert.equal(timerRemaining(g,'A'),8);
 g.activate('freeze');for(let i=0;i<60;i++)g.update(1/120);assert.equal(timerRemaining(g,'A'),8);assert.ok(g.elapsed>.49);g.togglePause();g.update(1);assert.equal(timerRemaining(g,'A'),8);g.load(g.level);assert.deepEqual(g.switchTimers,{});assert.equal(g.activated.size,0);
});
test('timer expiry safely closes occupied gates and resumes linked devices',()=>{
 const g=harness({switches:[{id:'A',x:5,y:15,mode:'timed',duration:2}],exitRequires:[],exitStates:{},devices:[{type:'laser',x:4,y:10,dir:'right',length:20,period:4,on:1,phase:0,offSwitch:'A'}]});touch(g,5);updateDevices(g,false);assert.equal(g.devices[0].state,'disabled');const gate=g.gates[0];assert.ok(g.gateOpen(gate));Object.assign(g.player,{x:245,y:430});g.clock=3.2;expireSwitches(g);assert.ok(g.gateOpen(gate));assert.ok(gate.pendingClose);updateDevices(g,false);assert.equal(g.devices[0].state,'active');g.player.x=280;assert.equal(g.gateOpen(gate),false);
});
test('timer JSON preserves bounded durations and rejects incompatible initial states',()=>{
 const l=campaignLevel(50);assert.deepEqual(validateLevel(JSON.parse(JSON.stringify(l))).switches,l.switches);
 for(const duration of [0,1,31,NaN,Infinity])assert.throws(()=>validateLevel({...l,switches:l.switches.map(s=>s.mode==='timed'?{...s,duration}:s)}),/duration/);
 assert.throws(()=>validateLevel({...l,switches:l.switches.map(s=>s.mode==='timed'?{...s,initial:true}:s)}),/initial/);
});
