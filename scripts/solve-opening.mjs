import {pathToFileURL} from 'node:url';
// Developer tool: find and record real-physics, item-free input replays.
// Waypoints describe intended routes; they never alter the player's position.
import {Game} from '../src/engine.js';
import {campaignLevel} from '../src/levels.js';
import {writeFileSync} from 'node:fs';
const routes=[
 [[9,11,19],[17,19,16],[24,27,13],[34,37,13],{switchId:'A'},[37,40,22],[25,28,22],[17,20,22],null],
 [[16,19,23],[10,13,20],[4,7,17],[10,13,14],{switchId:'A'},[18,22,26],[27,29,26],[36,39,23],{switchId:'B'},[36,39,23],[26,29,26],null],
 [[8,11,19],[22,25,16],{switchId:'A'},[27,30,22],[33,37,22],[39,42,19],[44,47,16],{switchId:'B'},[58,61,22],null],
 [[7,10,27],[4,7,24],[9,12,21],[5,8,18],[10,13,15],[13,16,12],[18,21,9],[28,30,9],{switchId:'A'},[24,26,15,false],{switchId:'B'},null],
 [[14,18,28,false],[14,18,20,false],[14,18,12,false],[16,16.6,8,false],{switchId:'A'},[16,18,34],[21,23,34],{switchId:'B'},[22,24,34],[28,30,30],{switchId:'C'},[29,32,30],[20,24,34],[14,18,34],null],
 [[17,20,10],{switchId:'A'},[16,18,15,false],{switchId:'B'},[8,10,23,false],[8,11,30],[21,24,26],[31,35,23],[39,44,30],[50,53,30],null],
 [[8,11,23],[16,19,20],[10,13,17],[15,18,14],[12,15,11],{switchId:'A'},[25,28,11],[34,37,14],[41,44,17],{switchId:'B'},[57,60,20],null],
 [[23,26,30],[17,19,28],[20,22,32],[13,15,32],{switchId:'A'},[4,7,27],[9,12,24],[4,7,21],[9,12,18],[4,7,15],[9,12,12],{switchId:'B'},[22,25,12],[30,33,15],[39,42,18],[45,48,21],{switchId:'C'},[49,52,27],[35,39,34],null],
 [[5,8,31],[8,11,28],[4,7,25],[12,12.8,22],[4,7,19],[8,11,16],{switchId:'C'},[16,19,12],[20,21,24,false],{switchId:'A'},[24,26,34],[30,34,31],[34,37,28],[30,33,25],[35,38,22],[30,33,19],[35,38,16],[31,34,13],[36,38,9],[41,44,6],[46,47,19,false],{switchId:'B'},[51,53,34],[57,61,33,false],[59,60.7,6,false],null],
 [[29,33,31],[28,30,28],[33,35,25],[28,30,22],{switchId:'C'},[28,30,16],[33,35,13],[31,32,9,false],[24,28,7],[18,20,7],[9,11,8],{switchId:'A'},[9,11,8],[18,20,7],[24,28,7],[34,35,10],[40,43,7],[48,51,8],{switchId:'B'},[48,51,8],[40,43,7],[34,35,10],[31,32,12,false],null],
];
export function harness(index){const g=Object.create(Game.prototype);g.keys=new Set();g.render=()=>{};g.burst=()=>{};g.cb={hud(){},sound(){},dead(){},win(){}};g.load(campaignLevel(index));g.start();return g;}
export function clone(g){const n=Object.create(Game.prototype);Object.assign(n,g);n.player={...g.player};n.effects={...g.effects};n.keys=new Set();n.particles=[];n.trail=[];n.activated=new Set(g.activated);n.visited=new Set(g.visited);n.switchTimers={...g.switchTimers};n.switchContacts=new Set(g.switchContacts);n.gates=g.gates.map(s=>({...s}));n.camera={...g.camera};n.blood=[];n.stains=[];n.debris=[];n.sentries=g.sentries.map(s=>({...s}));n.traps=g.traps.map(t=>({...t}));n.crumbles=g.crumbles.map(s=>({...s}));n.platforms=g.platforms.map(s=>({...s}));n.projectiles=g.projectiles.map(b=>({...b}));n.devices=g.devices.map(d=>({...d}));n.hazards=g.hazards.map(h=>({...h}));n.gold=g.gold.map(c=>({...c}));return n;}
class Heap{
 constructor(){this.a=[];}
 push(n){const a=this.a;let i=a.length;a.push(n);while(i){const p=(i-1)>>1;if(a[p].score<=n.score)break;a[i]=a[p];i=p;}a[i]=n;}
 pop(){const a=this.a,root=a[0],n=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].score<a[c].score)c++;if(n.score<=a[c].score)break;a[i]=a[c];i=c;}a[i]=n;}return root;}
}
function distance(g,t){if(t?.trap!==undefined){const s=g.traps[t.trap];return Math.hypot(g.player.x+8-(s.x*30+15),g.player.y+26-(s.y*30+30));}if(t?.ride!==undefined){const s=g.platforms[t.ride],path=s.path;
 const candidates=t.at===1?[[path.toX*30,path.toY*30]]:t.at===0?[[path.x*30,path.y*30]]:[[s.x,s.y],[path.x*30,path.y*30],[path.toX*30,path.toY*30]];
 return Math.min(...candidates.map(([x,y])=>Math.hypot(Math.max(x-g.player.x-8,0,g.player.x+8-x-s.w),Math.abs(g.player.y+26-y)*1.3)));}
 if(t?.switchId){const s=g.switches.find(s=>s.id===t.switchId);return Math.hypot(g.player.x+8-(s.x*30+15),g.player.y+13-(s.y*30+15));}if(!t)return Math.hypot(g.player.x+8-(g.level.exit.x*30+15),g.player.y+13-(g.level.exit.y*30+15));const [a,b,y]=t,x=g.player.x+8,feet=g.player.y+26;return Math.hypot(Math.max(a*30-x,0,x-b*30),Math.abs(feet-y*30)*1.3);}
function reached(g,t){if(t?.trap!==undefined)return g.traps[t.trap].triggers>0;if(t?.ride!==undefined){const s=g.platforms[t.ride],path=s.path;return g.player.ground&&Math.abs(g.player.y+26-s.y)<2&&g.player.x+8>=s.x+10&&g.player.x+8<=s.x+s.w-10&&Math.abs(g.player.vx)<110&&(t.at===undefined||Math.hypot(s.x-(t.at?path.toX:path.x)*30,s.y-(t.at?path.toY:path.y)*30)<25);}if(t?.switchId)return g.visited.has(t.switchId)&&g.activated.has(t.switchId)===(t.on??true)&&(!t.refresh||(g.switchTimers[t.switchId]??0)-g.clock>g.switches.find(s=>s.id===t.switchId).duration-.2);if(!t)return g.status==='won';const [a,b,y,ground=true]=t;return g.player.x+8>=a*30&&g.player.x+8<=b*30&&Math.abs(g.player.y+26-y*30)<(ground?3:25)&&(!ground||g.player.ground);}
export function solve(start,target){
 if(target?.waitTrap!==undefined){const g=clone(start);let frames=0;while(!['idle','disabled'].includes(g.traps[target.waitTrap].state)&&g.status==='playing'&&frames<1800){for(let i=0;i<12;i++)g.update(1/120);frames+=12;}if(g.status!=='playing'||frames>=1800)throw Error('Unsafe trap waiting point');return {g,path:frames?[{dir:0,jump:false,frames}]:[]};}

 if(target?.break!==undefined){const g=clone(start);let frames=0;while(!g.crumbles[target.break].gone&&g.status==='playing'&&frames<1800){for(let i=0;i<12;i++)g.update(1/120);frames+=12;}if(g.status!=='playing'||!g.crumbles[target.break].gone)throw Error('Cannot safely collapse this floor');return {g,path:frames?[{dir:0,jump:false,frames}]:[]};}

 if(target?.waitOff){const g=clone(start);let frames=0;while(g.activated.has(target.waitOff)&&g.status==='playing'&&frames<3720){for(let i=0;i<12;i++)g.update(1/120);frames+=12;}if(g.status!=='playing'||g.activated.has(target.waitOff))throw Error('Unsafe countdown waiting point');return {g,path:frames?[{dir:0,jump:false,frames}]:[]};}

 if(target?.ride!==undefined&&target.at!==undefined){const s=start.platforms[target.ride],p=start.player;
  if(p.ground&&Math.abs(p.y+26-s.y)<2&&p.x+8>s.x+10&&p.x+8<s.x+s.w-10&&Math.abs(p.vx)<110){const g=clone(start);let frames=0;const path=[];
   while(!reached(g,target)&&g.status==='playing'&&frames<2640){const deck=g.platforms[target.ride],center=g.player.x+8,dir=center<deck.x+20?1:center>deck.x+deck.w-20?-1:0;g.keys.clear();if(dir)g.keys.add(dir<0?'ArrowLeft':'ArrowRight');for(let i=0;i<12;i++)g.update(1/120);frames+=12;path.push({dir,jump:false,frames:12});}
   if(reached(g,target))return {g,path};
  }
 }
 if(target?.waitFor!==undefined){const g=clone(start),s=g.platforms[target.waitFor],x=(target.at?s.path.toX:s.path.x)*30,y=(target.at?s.path.toY:s.path.y)*30;let frames=0;
 const dockReady=()=>{const t=((g.clock+s.path.phase)%s.path.period)/s.path.period;return Math.hypot(s.x-x,s.y-y)<=5&&(target.at?t>=.45&&t<=.55:t<=.05||t>=.95);};
 while(!dockReady()&&frames<2640&&g.status==='playing'){for(let i=0;i<12;i++)g.update(1/120);frames+=12;}
 if(g.status!=='playing'||frames>=2640)throw Error('Unsafe or unreachable waiting point');return {g,path:frames?[{dir:0,jump:false,frames}]:[]};}
const heap=new Heap(),seen=new Map();const begin=start.elapsed;heap.push({g:start,score:distance(start,target)/150,path:[]});let count=0,best=Infinity;
 while(heap.a.length&&count++<100000){const n=heap.pop(),g=n.g;if(reached(g,target))return n;if(g.status!=='playing')continue;
 for(const dir of [-1,0,1])for(const jump of [false,true]){
  if(jump&&!(g.player.ground||g.player.wall||g.coyote>0||g.wallGrace>0))continue;
  for(const frames of !dir&&!jump&&target?.ride!==undefined?[12,120,240]:[12]){
  const next=clone(g);if(dir)next.keys.add(dir<0?'ArrowLeft':'ArrowRight');if(jump)next.jumpBuffer=.14;
  for(let f=0;f<frames;f++){next.update(1/120);if(next.status!=='playing')break;}
  if(['dying','dead'].includes(next.status))continue;
  const p=next.player,age=next.elapsed-begin;
  if(age>22)continue;
  const key=[Math.round(p.x/5),Math.round(p.y/5),Math.round(p.vx/60),Math.round(p.vy/70),p.ground?1:p.wall,[...next.activated].sort().join(''),[...next.visited].sort().join(''),[...next.switchContacts].sort().join(''),[...next.devices,...next.sentries,...next.traps].filter(h=>h.alarm).map(h=>h.alarmStart===null?'x':Math.round(Math.min(20,next.clock-h.alarmStart)*5)).join('|'),next.sentries.map(s=>[Math.round(s.charge*10),Math.round(Math.max(0,s.readyAt-next.clock)*5)].join(':')).join('|'),next.traps.map(t=>[t.state,t.contact?1:0,t.triggers,Math.round((t.until-next.clock)*5)].join(':')).join('|'),next.crumbles.map(s=>s.gone?'x':s.startedAt===null?'-':Math.round((next.clock-s.startedAt)*10)).join(''),Object.entries(next.switchTimers).map(([id,t])=>id+Math.round((t-next.clock)*5)).join(''),Math.round(next.clock*5)].join(',');
  if((seen.get(key)??Infinity)<=age)continue;seen.set(key,age);
  const d=distance(next,target);best=Math.min(best,d);
  heap.push({g:next,score:age*.65+d/140,path:[...n.path,{dir,jump,frames}]});
 }
 }
 }
 throw Error(`No route after ${count} expansions; closest distance ${best}`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
const chosen=process.argv.slice(2).map(Number),all=[];
for(const index of (chosen.length?chosen:Array.from({length:10},(_,i)=>i))){let g=harness(index),actions=[];for(const target of routes[index]){const result=solve(g,target);g=result.g;actions.push(...result.path);console.log(index+1,target,'reached',g.elapsed.toFixed(2));}const replay={index,revision:3,time:g.elapsed,actions};writeFileSync(new URL(`../tests/fixtures/level-${String(index+1).padStart(2,'0')}.json`,import.meta.url),JSON.stringify(replay));all.push({level:index+1,time:g.elapsed});}console.log(all);

}
