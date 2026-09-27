import {Game} from './engine.js';
import {TILE,levelSize} from './levels.js';
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

// Headless instance: the same simulation as play, with no listeners, canvas,
// sound, saves, gore, or RAF. Each trajectory owns a fresh copy of the room.
function simulation(level,difficulty){
 const g=Object.create(Game.prototype);
 g.keys=new Set();g.difficulty=difficulty;g.reducedMotion=true;
 g.cb={hud(){},sound(){},gold(){},switch(){},win(){},dying(){},dead(){}};
 g.render=()=>{};g.burst=()=>{};
 g.die=cause=>{g.deathCause=cause;g.status='dead';};
 g.load(structuredClone(level));g.start();return g;
}

export function previewJump(level,cell,{difficulty='medium',running=false}={}){
 const g=simulation(level,difficulty),{width,height}=levelSize(level);
 if(!cell||cell.x<0||cell.y<0||cell.x>=width||cell.y>=height)return {valid:false,reason:'Choose a cell inside the room.',paths:[]};
 const center=cell.x*TILE+15,cellTop=cell.y*TILE;
 const surfaces=g.nearSolids({x:center-8,y:cellTop-1,w:16,h:TILE+2});
 // Hover a platform cell to stand on its top; hover the empty cell above
 // a platform to use the same takeoff position.
 const surface=surfaces.filter(s=>center+8>s.x&&center-8<s.x+s.w&&s.y>=cellTop-1&&s.y<=cellTop+TILE+1).sort((a,b)=>a.y-b.y)[0];
 if(!surface)return {valid:false,reason:'Hover a solid floor, closed gate, or deck (or the cell directly above it).',paths:[]};
 const origin={x:center-8,y:surface.y-26,w:16,h:26};
 if(origin.y<0||g.nearSolids(origin,false).some(s=>overlaps(origin,s)))return {valid:false,reason:'There is not enough headroom for the character here.',origin,paths:[]};
 const paths=[-1,1].map(direction=>{
  const run=simulation(level,difficulty);Object.assign(run.player,origin,{vx:running?direction*265:0,vy:0,ground:true,wall:0});
  run.coyote=.1;run.jumpBuffer=.14;run.keys.add(direction<0?'ArrowLeft':'ArrowRight');
  const points=[{x:origin.x+8,y:origin.y+26}],startY=origin.y;let apex=origin.y,airborne=false,outcome='limit',time=0;
  for(let step=0;step<360;step++){
   run.update(1/120);time=(step+1)/120;apex=Math.min(apex,run.player.y);
   if(!run.player.ground)airborne=true;
   const done=run.status!=='playing'||airborne&&run.player.ground;
   if(step%3===0||done||step===359)points.push({x:run.player.x+8,y:run.player.y+26});
   if(done){outcome=run.status==='dead'?'hazard':run.status==='won'?'exit':'landed';break;}
  }
  return {direction,points,outcome,cause:run.deathCause,time,rise:startY-apex,range:Math.abs(run.player.x-origin.x)};
 });
 return {valid:true,origin,paths};
}

export function drawJumpPreview(c,preview){
 if(!preview?.origin)return;
 c.save();c.lineWidth=2.5;
 for(const path of preview.paths){
  c.strokeStyle=path.direction<0?'#285cb4':'#8b3aad';c.setLineDash([6,4]);c.beginPath();
  path.points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();c.setLineDash([]);
  const end=path.points.at(-1);c.fillStyle=path.outcome==='hazard'?'#bf4035':path.outcome==='landed'?'#2a795a':'#926819';c.beginPath();c.arc(end.x,end.y,5,0,Math.PI*2);c.fill();
 }
 const {x,y}=preview.origin;
 c.fillStyle='#ffffffbb';c.fillRect(x-3,y-3,22,32);c.strokeStyle=preview.valid?'#24456a':'#bf4035';c.lineWidth=3;
 c.beginPath();c.arc(x+8,y+5,4,0,Math.PI*2);c.moveTo(x+8,y+10);c.lineTo(x+8,y+18);c.moveTo(x+2,y+14);c.lineTo(x+14,y+14);c.moveTo(x+8,y+18);c.lineTo(x+2,y+26);c.moveTo(x+8,y+18);c.lineTo(x+14,y+26);c.stroke();c.restore();
}
