import test from 'node:test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {campaignLevel,campaignRevision,validateLevel,emptyLevel,SECTORS} from '../src/levels.js';
import {freshState,buy,complete,unlocked,loadState} from '../src/state.js';
import {Game} from '../src/engine.js';
function harness(level){const g=Object.create(Game.prototype);g.keys=new Set();g.render=()=>{};g.cb={hud(){},sound(){},dead(){},win(){}};g.load(level);g.start();return g;}
test('all 99 campaign levels validate and preserve puzzle data through JSON',()=>{for(let i=0;i<99;i++){const source=campaignLevel(i),l=validateLevel(JSON.parse(JSON.stringify(source)));assert.ok(l.time>=10&&l.time<=300);assert.ok(l.tiles.length>32);for(const key of ['tiles','coins','switches','gates','devices','platforms','crumbles','traps','sentries','exitRequires','exitStates']){const fallback=key==='exitStates'?{}:[];assert.deepEqual(l[key]??fallback,source[key]??fallback,`Stage ${i+1}: ${key}`);}}});
test('purchases debit precisely one item and prevent overdrafts',()=>{const s=freshState();assert.ok(buy(s,'rocket'));assert.equal(s.coins,20);assert.equal(s.inventory.rocket,1);assert.ok(buy(s,'rocket'));assert.equal(s.coins,0);assert.equal(buy(s,'rocket'),false);assert.equal(buy(s,'invalid'),false);assert.equal(s.inventory.rocket,2);});
test('completion unlocks next stage and preserves clean runs and best scores',()=>{const s=freshState();assert.equal(unlocked(s,1),false);const earned=complete(s,0,24,10,false);assert.ok(earned.some(a=>a.id==='clean'));assert.equal(s.coins,50);assert.equal(unlocked(s,1),true);assert.equal(unlocked(s,2),false);complete(s,0,30,2,true);assert.equal(s.completed[0].best,24);assert.equal(s.completed[0].clean,true);assert.equal(s.completed[0].gold,10);complete(s,0,18,10,true);assert.equal(s.completed[0].best,18);assert.equal(s.achievements.filter(a=>a==='first').length,1);});
test('best-run records retain the difficulty of the fastest result and migrate old records to Medium',()=>{const s=freshState();complete(s,0,24,2,false,'hard');complete(s,0,30,1,true,'easy');assert.equal(s.completed[0].difficulty,'hard');complete(s,0,18,1,true,'easy');assert.equal(s.completed[0].difficulty,'easy');const restored=loadState({getItem:()=>JSON.stringify({version:1,completed:{0:{best:22,clean:false,gold:1,revision:3}}})});assert.equal(restored.completed[0].difficulty,'medium');});
test('all 99 item-free finishes earn purist achievement',()=>{const s=freshState();for(let i=0;i<99;i++)complete(s,i,25,10,false);assert.ok(s.achievements.includes('purist'));assert.ok(s.achievements.includes('all'));assert.equal(Object.keys(s.completed).length,99);});
test('cannot complete locked or out of bounds campaign stages',()=>{const s=freshState();complete(s,98,1,500,false);complete(s,-1,1,500,false);assert.equal(s.coins,40);assert.deepEqual(s.completed,{});});
test('save reload sanitizes corruption and survives unavailable storage',()=>{assert.deepEqual(loadState({getItem:()=>'{bad'}),freshState());assert.deepEqual(loadState({getItem:()=>{throw Error();}}),freshState());const s=freshState();buy(s,'shield');complete(s,0,20,10,false);const restored=loadState({getItem:()=>JSON.stringify(s)});assert.deepEqual(restored,s);assert.equal(loadState({getItem:()=>JSON.stringify({version:1,coins:-2,inventory:{rocket:-5}})}).coins,40);});
test('level importer rejects overlaps, invalid coordinates, and unsupported terrain',()=>{const l=emptyLevel();assert.doesNotThrow(()=>validateLevel(l));assert.throws(()=>validateLevel({...l,exit:l.spawn}),/share a tile/);assert.throws(()=>validateLevel({...l,spawn:{x:99,y:1}}),/inside/);assert.throws(()=>validateLevel({...l,time:0}),/Time limit/);assert.throws(()=>validateLevel({...l,tiles:[{x:1,y:1,type:'script'}]}),/terrain/);});
test('basic jump reaches the first platform without an item',()=>{const level=emptyLevel();for(let x=5;x<=8;x++)level.tiles.push({x,y:13,type:'solid'});const g=harness(level);for(let i=0;i<30;i++)g.update(1/120);assert.ok(g.player.ground);g.keys.add('ArrowRight');for(let i=0;i<24;i++)g.update(1/120);g.jumpBuffer=.14;let landed=false;for(let i=0;i<100;i++){g.update(1/120);if(g.player.ground&&g.player.y<400){landed=true;break;}}assert.ok(landed,`player at ${g.player.x},${g.player.y}`);assert.equal(g.usedItems,false);});
test('difficulty presets keep Medium at authored timing and adjust global hazard pace and Easy jump height',()=>{
 const clocks={};for(const [difficulty,pace] of [['easy',.85],['medium',1],['hard',1.15]]){const g=harness(emptyLevel());g.difficulty=difficulty;g.update(.1);assert.ok(Math.abs(g.clock-.1*pace)<1e-9);clocks[difficulty]=g.clock;}
 const jump=(difficulty)=>{const g=harness(emptyLevel());g.difficulty=difficulty;g.player.ground=true;g.coyote=.1;g.jumpBuffer=.14;g.update(.001);return g.player.vy;};
 assert.ok(jump('easy')<jump('medium'));assert.equal(jump('hard'),jump('medium'));assert.ok(clocks.easy<clocks.medium&&clocks.hard>clocks.medium);
});
test('freeze suspends clock and drones, while elapsed scoring time continues',()=>{const g=harness(campaignLevel(10));g.activate('freeze');const remaining=g.remaining;for(let i=0;i<120;i++)g.update(1/120);assert.equal(g.remaining,remaining);assert.equal(g.clock,0);assert.ok(g.elapsed>.99);assert.ok(g.effects.freeze<6);assert.equal(g.usedItems,true);});
test('shield absorbs one hazard hit and then expires',()=>{const level=emptyLevel();level.tiles.push({x:9,y:15,type:'spike'});const g=harness(level);g.activate('shield');g.player.x=275;g.player.y=450;g.update(1/120);assert.equal(g.effects.shield,0);assert.equal(g.status,'playing');assert.ok(g.invulnerable>0);});
test('paused and dead runs cannot move or use an item',()=>{const g=harness(campaignLevel(0));g.togglePause();const x=g.player.x;g.keys.add('ArrowRight');g.update(1);assert.equal(g.player.x,x);assert.equal(g.activate('rocket'),false);g.status='dead';assert.equal(g.activate('shield'),false);});
test('ten sectors cover exactly 99 levels, with a new implemented mechanic every ten',()=>{
 assert.equal(SECTORS.length,10);
 assert.deepEqual(SECTORS.flatMap(s=>Array.from({length:s.end-s.start+1},(_,i)=>s.start+i)),Array.from({length:99},(_,i)=>i+1));
 assert.deepEqual(SECTORS.map(s=>s.start),[1,11,21,31,41,51,61,71,81,91]);
 assert.equal(SECTORS.filter(s=>s.implemented).length,10);
});
test('opening rooms have distinct terrain, lessons, and increasing difficulty metadata',()=>{
 const levels=Array.from({length:10},(_,i)=>campaignLevel(i));
 assert.equal(new Set(levels.map(l=>JSON.stringify(l.tiles.filter(t=>t.type==='solid')))).size,10);
 assert.equal(new Set(levels.map(l=>l.skill)).size,10);
 assert.deepEqual(levels.map(l=>l.difficulty),[1,2,3,4,5,6,7,8,9,10]);
 assert.ok(levels.every(l=>l.chapter===0&&l.lesson));
 // Returned rooms cannot be mutated by a previous play session.
 levels[0].tiles.pop();assert.notEqual(campaignLevel(0).tiles.length,levels[0].tiles.length);
});
test('older saves retain unlocks and achievements without comparing different layouts',()=>{
 const old=freshState();old.coins=88;old.completed[0]={best:1,clean:true,gold:10};old.achievements=['first','clean','speed'];
 const s=loadState({getItem:()=>JSON.stringify(old)});
 assert.equal(unlocked(s,1),true);assert.equal(s.coins,88);assert.equal(s.completed[0].revision,1);
 complete(s,0,25,4,true);
 assert.equal(s.completed[0].best,25);assert.equal(s.completed[0].revision,3);assert.equal(s.completed[0].clean,false);
 assert.ok(s.achievements.includes('clean'));assert.ok(s.achievements.includes('speed'));
 const restored=loadState({getItem:()=>JSON.stringify(s)});assert.deepEqual(restored,s);
 complete(restored,0,23,5,false);assert.equal(restored.completed[0].best,23);assert.equal(restored.completed[0].clean,true);
});
for(let index=0;index<99;index++){
 const replay=JSON.parse(readFileSync(new URL(`./fixtures/level-${String(index+1).padStart(2,'0')}.json`,import.meta.url)));
 test(`authored stage ${index+1}: recorded inputs reach the exit with hazards active and no items`,()=>{
  const g=harness(campaignLevel(index)),reversals=new Map();let previous=new Set(g.activated),trapFired=false,alarmLive=false;
  for(const action of replay.actions){
   g.keys.clear();if(action.dir)g.keys.add(action.dir<0?'ArrowLeft':'ArrowRight');
   if(action.jump)g.jumpBuffer=.14;
   for(let f=0;f<action.frames&&g.status==='playing';f++){g.update(1/120);trapFired ||= g.traps.some(t=>t.state==='active');alarmLive ||= [...g.devices,...g.sentries,...g.traps].some(h=>h.alarm&&!['arming','dormant','disabled'].includes(h.state));for(const s of g.switches)if(s.mode==='toggle'&&previous.has(s.id)!==g.activated.has(s.id))reversals.set(s.id,(reversals.get(s.id)??0)+1);previous=new Set(g.activated);}
  }
  assert.equal(g.status,'won');if(index>=60&&index<70)assert.ok(g.crumbles.some(s=>s.gone),'The route must use collapsing platforms');if(index>=70&&index<80){assert.ok(g.traps.some(t=>t.triggers>0),'The route must trigger a trap');assert.ok(trapFired,'At least one trap must deploy during the run');}if(index>=80&&index<90)assert.ok(g.sentries.some(s=>s.acquisitions>0),'The route must encounter a tracking eye');if(index>=90){assert.ok([...g.devices,...g.sentries,...g.traps].some(h=>h.alarmActivations>0));assert.ok(alarmLive,'An alarm must finish warning during the run');}assert.equal(g.usedItems,false);assert.ok(g.remaining>0);assert.deepEqual(g.effects,{});assert.equal(g.visited.size,g.switches.length);if(index>=40&&index<50)assert.ok([...reversals.values()].some(n=>n>=2),'The solution must reverse a lever at least once');assert.ok(g.exitUnlocked);assert.equal(replay.revision,campaignRevision(index));
 });
}

for(const side of [-1,1])test(`wall jump accepts away input before Jump (wall side ${side})`,()=>{
 const l=emptyLevel();for(let y=3;y<16;y++)l.tiles.push({x:6,y,type:'solid'});
 const g=harness(l);Object.assign(g.player,{x:side===1?164:210,y:240,vx:0,vy:130,ground:false});
 for(let i=0;i<5;i++)g.update(1/120);
 assert.equal(g.player.wall,side);assert.equal(g.player.sliding,true);assert.ok(g.player.vy<=110);
 g.keys.add(side===1?'ArrowLeft':'ArrowRight');for(let i=0;i<5;i++)g.update(1/120);
 assert.ok(g.wallGrace>0);g.jumpBuffer=.14;g.update(1/120);
 assert.equal(Math.sign(g.player.vx),-side);assert.ok(g.player.vy<-500);assert.equal(g.wallGrace,0);assert.ok(g.wallJumpLock>0);
 const before=g.player.vy;g.jumpBuffer=.14;g.update(1/120);assert.ok(g.player.vy>before,'A second press must not reset airborne vertical speed');
});
test('wall contact grace expires and never grants a remote double jump',()=>{
 const l=emptyLevel();for(let y=3;y<16;y++)l.tiles.push({x:6,y,type:'solid'});
 const g=harness(l);Object.assign(g.player,{x:164,y:180,vx:0,vy:80,ground:false});
 for(let i=0;i<4;i++)g.update(1/120);g.keys.add('ArrowLeft');for(let i=0;i<30;i++)g.update(1/120);
 assert.equal(g.wallGrace,0);const before=g.player.vy;g.jumpBuffer=.14;g.update(1/120);assert.ok(g.player.vy>before);
});
test('switches open matching gates and retry resets the whole circuit',()=>{
 const l={...emptyLevel(),version:2,width:32,height:18,switches:[{id:'A',x:4,y:15}],gates:[{switchId:'A',x:8,y:13,w:1,h:3}],exitRequires:['A']};
 validateLevel(l);const g=harness(l),box={x:240,y:420,w:16,h:26};
 assert.equal(g.exitUnlocked,false);assert.ok(g.nearSolids(box).some(s=>s.switchId==='A'));
 Object.assign(g.player,{x:l.exit.x*30+7,y:l.exit.y*30+3});g.update(1/120);assert.equal(g.status,'playing','A locked exit cannot finish a run');
 Object.assign(g.player,{x:127,y:453,vx:0,vy:0});g.update(1/120);assert.ok(g.activated.has('A'));assert.ok(g.exitUnlocked);assert.ok(!g.nearSolids(box).some(s=>s.switchId==='A'));
 g.load(l);assert.equal(g.activated.size,0);assert.equal(g.exitUnlocked,false);assert.equal(l.switches[0].active,undefined);
});
test('version 2 preserves large rooms and circuits; legacy imports stay 32 by 18',()=>{
 const l=validateLevel(campaignLevel(9));assert.equal(l.width,64);assert.equal(l.height,36);assert.equal(l.switches.length,3);assert.equal(l.gates.length,3);assert.deepEqual(l.exitRequires,['A','B','C']);
 assert.equal(validateLevel(emptyLevel()).version,1);
 assert.throws(()=>validateLevel({...l,width:200}),/dimensions/);
 assert.throws(()=>validateLevel({...l,exitRequires:['Z']}),/existing switches/);
 assert.throws(()=>validateLevel({...l,gates:[{switchId:'Z',x:1,y:1,w:1,h:1}]}),/Gates/);
 assert.throws(()=>validateLevel({...l,switches:[...l.switches,l.switches[0]]}),/unique/);
 assert.throws(()=>validateLevel({...l,gates:[{switchId:'A',x:l.spawn.x,y:l.spawn.y,w:1,h:1}]}),/share a tile/);
});
test('death breaks the ninja apart, stains surfaces, and delays retry overlay',()=>{
 const g=harness(emptyLevel());let callbacks=0;g.cb.dead=()=>callbacks++;
 g.die('saw',{x:60,y:450});assert.equal(g.status,'dying');assert.equal(callbacks,0);assert.equal(g.debris.length,7);assert.ok(g.blood.length>=65);
 const bones=g.debris.map(d=>({x:d.x,y:d.y}));for(let i=0;i<60;i++)g.update(1/120);
 assert.equal(g.status,'dying');assert.ok(g.debris.some((d,i)=>d.x!==bones[i].x||d.y!==bones[i].y));assert.ok(g.stains.length>0);
 for(let i=0;i<150;i++)g.update(1/120);assert.equal(g.status,'dead');assert.equal(callbacks,1);
 g.load(emptyLevel());assert.equal(g.blood.length,0);assert.equal(g.debris.length,0);assert.equal(g.stains.length,0);
});
test('survey mode freezes gameplay and restores the previous state',()=>{
 const g=harness(campaignLevel(0));g.activate('freeze');const time=g.remaining,effect=g.effects.freeze,x=g.player.x;
 g.openMap();g.update(.2);assert.ok(g.mapOpen);assert.equal(g.status,'paused');assert.equal(g.remaining,time);assert.equal(g.effects.freeze,effect);assert.equal(g.player.x,x);
 g.closeMap();assert.equal(g.status,'playing');assert.equal(g.mapOpen,false);
});

test('all authored rooms have distinct terrain, circuit objectives, and complete replay coverage',()=>{
 const rooms=Array.from({length:99},(_,i)=>campaignLevel(i));
 assert.equal(new Set(rooms.map(l=>JSON.stringify(l.tiles.filter(t=>t.type==='solid').map(t=>[t.x,t.y]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]))  )).size,99);
 assert.equal(new Set(rooms.map(l=>l.name  )).size,99);
 for(const l of rooms){assert.ok(l.width>=48&&l.height>=24);assert.ok(l.exitRequires.length>0);}
 for(const l of rooms.slice(10,20))assert.ok(l.devices.some(d=>d.type==='laser'));
 for(const l of rooms.slice(20,30))assert.ok(l.devices.some(d=>d.type==='turret'));
 for(const l of rooms.slice(30,40))assert.ok(l.platforms.length>0);
 for(const l of rooms.slice(40,50))assert.ok(l.switches.some(s=>s.mode==='toggle'));
 for(const l of rooms.slice(50,60))assert.ok(l.switches.some(s=>s.mode==='timed'));
 for(const l of rooms.slice(60,70))assert.ok(l.crumbles.length>0);
 for(const l of rooms.slice(70,80))assert.ok(l.traps.length>0);
 for(const l of rooms.slice(80,90))assert.ok(l.sentries.length>0);
 for(const l of rooms.slice(90))assert.ok([...l.devices,...l.sentries,...l.traps].some(h=>h.alarm));
});

for(const index of [55,58,59])test(`stage ${index+1}: recover after all timers expire without restarting or items`,()=>{
 const replay=JSON.parse(readFileSync(new URL(`./fixtures/level-${index+1}-recovery.json`,import.meta.url))),g=harness(campaignLevel(index));let expiredWindow=false;
 for(const action of replay.actions){g.keys.clear();if(action.dir)g.keys.add(action.dir<0?'ArrowLeft':'ArrowRight');if(action.jump)g.jumpBuffer=.14;
  for(let f=0;f<action.frames&&g.status==='playing';f++){g.update(1/120);if(!expiredWindow&&g.elapsed>=replay.recoveryWaitEndedAt-1e-6){assert.equal(Object.keys(g.switchTimers).length,0);assert.ok(g.activated.has('D'));assert.equal(g.exitUnlocked,false);expiredWindow=true;}}
 }
 assert.ok(expiredWindow);assert.equal(g.status,'won');if(index>=60&&index<70)assert.ok(g.crumbles.some(s=>s.gone),'The route must use collapsing platforms');assert.equal(g.usedItems,false);assert.ok(g.exitUnlocked);assert.ok(g.elapsed>replay.recoveryWaitEndedAt+5);assert.equal(g.visited.size,g.switches.length);
});

 test('stage 79 supports clearing the eastern wing before the western wing',()=>{
 const replay=JSON.parse(readFileSync(new URL('./fixtures/level-79-alternate.json',import.meta.url))),g=harness(campaignLevel(78));const order=[];
 for(const action of replay.actions){g.keys.clear();if(action.dir)g.keys.add(action.dir<0?'ArrowLeft':'ArrowRight');if(action.jump)g.jumpBuffer=.14;for(let f=0;f<action.frames&&g.status==='playing';f++){g.update(1/120);for(const id of g.visited)if(!order.includes(id))order.push(id);}}
 assert.equal(g.status,'won');assert.equal(g.usedItems,false);assert.deepEqual(order,['B','A','C']);assert.ok(g.exitUnlocked);
 });

test('stage 89 supports disabling the western watcher first via the eastern wing',()=>{
 const replay=JSON.parse(readFileSync(new URL('./fixtures/level-89-alternate.json',import.meta.url))),g=harness(campaignLevel(88));const order=[];
 for(const action of replay.actions){g.keys.clear();if(action.dir)g.keys.add(action.dir<0?'ArrowLeft':'ArrowRight');if(action.jump)g.jumpBuffer=.14;for(let f=0;f<action.frames&&g.status==='playing';f++){g.update(1/120);for(const id of g.visited)if(!order.includes(id))order.push(id);}}
 assert.equal(g.status,'won');assert.equal(g.usedItems,false);assert.deepEqual(order,['B','A','C']);assert.ok(g.sentries[1].shots>0);assert.ok(g.exitUnlocked);
});

test('stage 97 supports eastern shutdown first, then a quiet central timed ascent',()=>{
 const replay=JSON.parse(readFileSync(new URL('./fixtures/level-97-alternate.json',import.meta.url))),g=harness(campaignLevel(96));const order=[];
 for(const action of replay.actions){g.keys.clear();if(action.dir)g.keys.add(action.dir<0?'ArrowLeft':'ArrowRight');if(action.jump)g.jumpBuffer=.14;for(let f=0;f<action.frames&&g.status==='playing';f++){g.update(1/120);for(const id of g.visited)if(!order.includes(id))order.push(id);}}
 assert.equal(g.status,'won');assert.equal(g.usedItems,false);assert.deepEqual(order,['D','B','A','C']);assert.equal(g.activated.has('D'),false);assert.ok(g.activated.has('C'));assert.ok(g.exitUnlocked);
});
