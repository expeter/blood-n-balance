import {IS_KIDS} from './edition.js';
const TITLES=['The Bellkeeper','The Prism Warden','The Iron Archer','The Ferryman','The Twin Seals','The Hourkeeper','The Falling King','The Trapwright','The Watcher','The Last Examiner'];
const FRAGMENTS=['Strength begins with a deliberate step.','Look for the interval, not the barrier.','Cover turns an attack into an opening.','Trust motion, but choose your landing.','Every opening changes something behind you.','Patience and urgency can share one breath.','A lost foothold is an invitation to adapt.','A warning is a gift. Learn its language.','Attention is stronger than pursuit.','The artifact is no weapon. It is the practice you carry out of the temple.'];
export const hasBoss=index=>Number.isInteger(index)&&(index===98||(index+1)%10===0);
export function bossArena(index){
 const chapter=Math.floor(index/10),tiles=[];
 for(let x=0;x<32;x++){tiles.push({x,y:17,type:'solid'});tiles.push({x,y:0,type:'solid'});}for(let y=1;y<17;y++){tiles.push({x:0,y,type:'solid'},{x:31,y,type:'solid'});}
 // Broad launch ledges and full floor keep recovery possible without helpers.

 const mode=chapter%3===0?'stomp':chapter%3===1?'controls':'either';
 return {version:3,index,chapter,name:IS_KIDS?`Festival friend ${chapter+1}`:TITLES[chapter],skill:'Read the warning. Use the opening.',lesson:mode==='stomp'?'Jump onto the glowing head while OPEN. Jump over floor waves; wait away from the body between openings.':mode==='controls'?'Touch the lit arena button while OPEN to send a pulse. The required side changes after every hit; leave and return for another press.':'Use the lit button or land on the glowing head while OPEN. Jump over floor waves; body contact resets the attempt.',width:32,height:18,time:150,spawn:{x:3,y:16},exit:{x:29,y:16},tiles,coins:[],switches:[],gates:[],exitRequires:[],devices:[],platforms:[],crumbles:[],traps:[],sentries:[],boss:{chapter,mode,hits:3+(chapter>=5?1:0),period:7-chapter*.13,openFor:3.5}};
}
export function initBoss(g){g.boss=g.level.boss?{...g.level.boss,hp:g.level.boss.hits,x:456,y:450,w:48,h:60,state:'guard',cycle:-1,lastHit:-99,button:0,contacts:new Set(),waves:[],pulse:null}:null;}
export function updateBoss(g,dt){
 const b=g.boss;if(!b||b.hp===0)return;
 const phase=g.clock%b.period,cycle=Math.floor(g.clock/b.period);
 const opens=b.mode==='stomp'?1.4:2;b.state=phase<1.2?'warning':phase<opens?'attack':phase<opens+b.openFor?'open':'guard';
 if(cycle!==b.cycle&&phase>=1.2){b.cycle=cycle;for(const dir of [-1,1])b.waves.push({x:b.x+24,y:498,dir});g.cb.sound('shot');}
 for(const wave of b.waves){wave.x+=wave.dir*(170+b.chapter*9)*dt;if(Math.abs(g.player.x+8-wave.x)<18&&g.player.y<510&&g.player.y+g.player.h>490)g.hurt('boss-wave',{x:wave.x,y:490});}
 b.waves=b.waves.filter(w=>w.x>30&&w.x<930);
 const p=g.player,old=g.previousPlayer??p;
 const overlap=p.x<b.x+b.w&&p.x+p.w>b.x&&p.y<b.y+b.h&&p.y+p.h>b.y;
 const stomp=overlap&&p.vy>0&&old.y+old.h<=b.y+7;
 const buttons=[{x:180,y:480},{x:780,y:480}],touch=buttons.map(s=>Math.abs(p.x+8-s.x)<24&&p.y<510&&p.y+p.h>476);
 const press=touch[b.button]&&!b.contacts.has(b.button);
 b.contacts=new Set(touch.flatMap((on,i)=>on?[i]:[]));
 if(b.state==='open'&&g.clock-b.lastHit>.5&&((b.mode!=='controls'&&stomp)||(b.mode!=='stomp'&&press))){
  b.hp--;b.lastHit=g.clock;b.pulse=press?{from:buttons[b.button].x,time:g.clock}:null;b.button=1-b.button;g.cb.sound('switch');g.burst(b.x+24,b.y,'#bb8df0',18);
  if(stomp){p.y=b.y-p.h;p.vy=-540;g.invulnerable=Math.max(g.invulnerable,.3);}
  if(b.hp===0){b.state='cleared';b.waves=[];g.cb.sound('win');}return;
 }
 if(overlap)g.hurt('boss',b);
}
export function drawBoss(c,g){const b=g.boss;if(!b)return;
 c.save();c.font='bold 14px sans-serif';c.textAlign='center';
 if(b.hp===0){c.fillStyle=IS_KIDS?'#7856a5':'#476a49';c.fillText(IS_KIDS?'FESTIVAL READY — PORTAL OPEN':'TRIAL PASSED — EXIT OPEN',480,405);c.restore();return;}
 const open=b.state==='open';c.fillStyle=IS_KIDS?'#c5a7df':'#5b4659';c.fillRect(b.x,b.y,b.w,b.h);
 c.fillStyle=open?'#b5dd80':b.state==='warning'?'#f2c16f':'#8299b5';c.fillRect(b.x-4,b.y-7,b.w+8,12);
 c.fillStyle='#f8f6f0';for(const x of [b.x+13,b.x+35]){c.beginPath();c.arc(x,b.y+22,7,0,Math.PI*2);c.fill();}c.fillStyle='#4c4960';c.fillRect(b.x+11,b.y+18,4,7);c.fillRect(b.x+33,b.y+18,4,7);
 c.fillStyle=IS_KIDS?'#365164':'#554354';c.fillText(`${b.hp} / ${b.hits} · ${b.state==='warning'?'JUMP SOON':b.state.toUpperCase()}`,480,416);
 for(const w of b.waves){c.fillStyle=IS_KIDS?'#75bcd9':'#ab435b';c.fillRect(w.x-12,w.y-7,24,16);}
 if(b.mode!=='stomp')for(const [i,x] of [180,780].entries()){c.fillStyle=i===b.button?'#e0b968':'#95a3b2';c.fillRect(x-24,491,48,14);c.fillStyle='#465367';c.fillText(i===b.button?'PRESS WHEN OPEN':'WAIT',x,477);}
 if(b.pulse&&g.clock-b.pulse.time<.5){c.strokeStyle='#a789c7';c.lineWidth=5;c.beginPath();c.moveTo(b.pulse.from,490);c.lineTo(480,470);c.stroke();}
 c.restore();}
export const bossStory=index=>IS_KIDS?'Another friend is ready for the festival. Your next garden trail is waiting.':FRAGMENTS[Math.floor(index/10)];
export function combineChapterResults(first,second){const a=first.stats,b=second.stats;return {...first,replays:[first.replay,second.replay],time:first.time+second.time,timeLimit:first.timeLimit+second.timeLimit,remaining:first.remaining+second.remaining,usedItems:first.usedItems||second.usedItems,stats:{jumps:a.jumps+b.jumps,wallJumps:a.wallJumps+b.wallJumps,switches:a.switches+b.switches,shieldBlocks:a.shieldBlocks+b.shieldBlocks,gliderUsed:a.gliderUsed||b.gliderUsed,helpers:[...new Set([...a.helpers,...b.helpers])]}};}
