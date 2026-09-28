import {RULESET} from './replay.js';
// Runtime chunks are curated physics-tested motifs. No network generation on the play path.
export const ENDLESS_VERSION='chunks-2';
export const CHUNK_TILES=24,CHUNK_PX=720;
export const MOTIFS=['rest','hurdle','gap','spike','steps','double','climb','bridge','climb-spikes','escape'];
export function seedNumber(text){let n=2166136261;for(const c of String(text))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function randomAt(seed,index){let n=seedNumber(seed)^Math.imul(index+1,0x9e3779b9);n=Math.imul(n^(n>>>16),0x21f0aaad);n=Math.imul(n^(n>>>15),0x735a2d97);return (n^(n>>>15))>>>0;}
export function endlessChunk(seed,index,override){
 const r=randomAt(seed,index),checkpoint=index>0&&(index+1)%21===0;
 const vertical=index<10?['climb','bridge']:['climb','bridge','climb-spikes'];
 const kind=override??(checkpoint?'escape':index===0||index%5===0?'rest':index===1?'steps':index%2===0?vertical[r%vertical.length]:MOTIFS[1+r%5]);
 if(!MOTIFS.includes(kind))throw Error('Unknown chunk motif');
 const x=index*CHUNK_TILES,tiles=[],coins=[];const put=(cx,y,type='solid')=>tiles.push({x:x+cx,y,type});
 const gap=kind==='gap'?new Set([10,11,12]):kind==='bridge'?new Set([9,10,11,12,13,14,15,16,17,18]):new Set();
 for(let i=0;i<CHUNK_TILES;i++)if(!gap.has(i)){put(i,16);put(i,17);}
 if(kind==='hurdle'){put(10,15);put(10,14);put(11,15);put(11,14);}
 if(kind==='spike')for(let i=10;i<12;i++)put(i,15,'spike');
 if(kind==='steps'){for(const [cx,h] of [[8,1],[9,2],[10,2],[11,1]])for(let y=16-h;y<16;y++)put(cx,y);}
 if(kind==='double'){put(7,15,'spike');put(16,15);put(16,14);}
 if(['climb','climb-spikes'].includes(kind)){for(const [from,to,h] of [[5,8,2],[9,12,4],[13,16,6],[17,19,3]])for(let cx=from;cx<=to;cx++)for(let y=16-h;y<16;y++)put(cx,y);if(kind==='climb-spikes'){put(18,12,'spike');}}
 if(kind==='bridge'){for(const [from,to,y] of [[5,8,14],[10,14,12],[15,18,10]])for(let cx=from;cx<=to;cx++)put(cx,y);}
 if(kind==='escape'){for(const [from,to,y] of [[4,8,14],[9,14,12],[15,19,10]])for(let cx=from;cx<=to;cx++)put(cx,y);}
 const verticalKind=['climb','climb-spikes','bridge','escape'].includes(kind);
 for(const [cx,y] of (verticalKind?[[6,13],[10,11],[14,8],[21,15]]:[[4,15],[9,11],[12,11],[19,15]]))coins.push({x:x+cx,y});
 return {index,kind,tiles,coins,...(kind==='escape'?{portal:{x:x+17,y:9}}:{})};
}
export function endlessLevel(seed){const chunks=Array.from({length:5},(_,i)=>endlessChunk(seed,i));return {name:'Endless · '+seed,width:120,height:18,time:864000,spawn:{x:3,y:15},exit:{x:119,y:0},tiles:chunks.flatMap(c=>c.tiles),coins:chunks.flatMap(c=>c.coins),switches:[],gates:[],lesson:'Keep moving right. Read each landing before you jump. Every fifth stretch is a breather.'};}
export function initEndless(g,{seed,difficulty='medium',assisted=false}){
 seed=String(seed).trim().slice(0,48)||'dojo';if(!['easy','medium','hard'].includes(difficulty))difficulty='medium';
 g.difficulty=difficulty;g.load(endlessLevel(seed),seedNumber(seed));
 g.endless={seed,difficulty,assisted,version:ENDLESS_VERSION,ruleset:RULESET,next:5,first:0,portals:[],fire:-180,distance:0,ended:false};g.minimapBeforeEndless=g.minimapVisible;g.minimapVisible=false;g.ghost=null;
 for(const coin of g.gold)coin.firstBonus=false;
 return g.endless;
}
export function updateEndless(g,dt,frozen){
 const run=g.endless;if(!run)return;
 run.distance=Math.max(run.distance,g.player.x-97);
 const ahead=Math.floor(g.player.x/CHUNK_PX)+5;
 while(run.next<ahead){const chunk=endlessChunk(run.seed,run.next++);g.level.tiles.push(...chunk.tiles);g.level.coins.push(...chunk.coins);if(chunk.portal)run.portals.push(chunk.portal);
 for(const t of chunk.tiles){if(t.type==='solid'){const s={x:t.x*30,y:t.y*30,w:30,h:30};g.solids.push(s);g.solidGrid.set(`${t.x},${t.y}`,s);}else g.hazards.push({...t,baseX:t.x*30,x:t.x*30,y:t.y*30,w:30,h:30});}
 for(const p of chunk.coins)g.gold.push({x:p.x*30+15,y:p.y*30+15,taken:false,firstBonus:false});
 g.worldW=run.next*CHUNK_PX;g.level.width=run.next*CHUNK_TILES;g.level.exit.x=g.level.width-1;
 }
 // Retain only a bounded window behind the runner, including the entire visible rear.
 // Crossing the rear boundary is already fatal; it can never become a new safe route.
 const floor=Math.max(0,Math.floor((Math.min(run.fire,g.player.x-CHUNK_PX)-CHUNK_PX)/CHUNK_PX));
 if(floor>run.first){run.first=floor;const min=floor*CHUNK_PX;run.portals=run.portals.filter(p=>p.x*30>=min);g.solids=g.solids.filter(s=>s.x>=min);g.hazards=g.hazards.filter(s=>s.x>=min);g.gold=g.gold.filter(s=>s.x>=min);g.level.tiles=g.level.tiles.filter(s=>s.x*30>=min);g.level.coins=g.level.coins.filter(s=>s.x*30>=min);g.solidGrid=new Map(g.solids.map(s=>[`${s.x/30},${s.y/30}`,s]));}
 if(!frozen){const base={easy:40,medium:55,hard:70}[run.difficulty];const pressure=Math.max(0,(g.player.x-run.fire-800)*.5);run.fire+=Math.min(420,Math.max(Math.min(base+Math.floor(g.player.x/CHUNK_PX)*2,125),pressure))*dt;}
 if(g.player.x<=run.fire){run.ended=true;g.die('pursuit');return;}
 const p=g.player;for(const exit of run.portals){const x=exit.x*30+2,y=exit.y*30;if(p.x<x+26&&p.x+p.w>x&&p.y<y+30&&p.y+p.h>y){run.ended=true;run.escaped=true;g.status='won';g.clearInput();g.cb.sound('win');g.cb.win({time:g.elapsed,gold:g.collected,usedItems:g.usedItems,escaped:true});return;}}

}
export function endlessResult(g){const r=g.endless;return {seed:r.seed,version:r.version,ruleset:r.ruleset,difficulty:r.difficulty,assisted:r.assisted,distance:Math.max(r.distance,g.player.x-97,0),gold:g.collected,time:g.elapsed,escaped:!!r.escaped,at:Date.now()};}
export function saveEndlessBest(storage,result){const key='endless-bests';let rows=[];try{rows=JSON.parse(storage.getItem(key)||'[]');if(!Array.isArray(rows))rows=[];}catch{}rows=rows.filter(r=>r&&typeof r.seed==='string'&&Number.isFinite(r.distance));const same=r=>r.seed===result.seed&&r.version===result.version&&r.ruleset===result.ruleset&&r.difficulty===result.difficulty&&r.assisted===result.assisted;const previous=rows.find(same);if(!previous||result.distance>previous.distance){rows=rows.filter(r=>!same(r));rows.unshift(result);}storage.setItem(key,JSON.stringify(rows.slice(0,50)));return Math.max(previous?.distance||0,result.distance);}
export function drawEndlessFront(c,g,kids=false){if(!g.endless)return;const x=g.endless.fire,cam=g.camera?.x||0;if(x<cam-60)return;
 c.save();const left=Math.max(0,cam-20),width=Math.max(0,x-left);c.fillStyle=kids?'#b4cceee6':'#742427ed';c.fillRect(left,0,width,g.worldH);c.fillStyle=kids?'#d7e5fa':'#ef7543';
 for(let y=-20;y<g.worldH+30;y+=26){const wobble=Math.sin(g.clock*3+y)*8;c.beginPath();if(kids)c.arc(x+wobble,y,24,0,Math.PI*2);else{c.moveTo(x-12,y-25);c.lineTo(x+15+wobble,y);c.lineTo(x-12,y+26);}c.fill();}c.restore();}

export function drawEndlessExits(c,g,kids=false){if(!g.endless)return;c.save();for(const e of g.endless.portals){const x=e.x*30,y=e.y*30;c.fillStyle=kids?'#7c57a7':'#b7db77';c.fillRect(x-3,y-5,36,40);c.fillStyle=kids?'#e6dafa':'#263f2f';c.fillRect(x+3,y+1,24,30);c.strokeStyle=kids?'#664192':'#c4ec8b';c.lineWidth=2;c.beginPath();c.moveTo(x+15,y+24);c.lineTo(x+15,y+8);c.moveTo(x+10,y+13);c.lineTo(x+15,y+8);c.lineTo(x+20,y+13);c.stroke();c.font='bold 14px sans-serif';c.textAlign='center';const text='EXIT · END RUN',w=c.measureText(text).width+12;c.fillStyle=kids?'#f7fbff':'#162d25';c.fillRect(x+15-w/2,y-31,w,21);c.fillStyle=kids?'#3c285a':'#ecf5e2';c.fillText(text,x+15,y-16);}c.restore();}
