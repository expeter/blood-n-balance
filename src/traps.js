import {validateAlarm,alarmState} from './alarms.js';
import {DIRECTIONS} from './devices.js';
import {segmentHit} from './projectiles.js';
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function validateTraps(raw,width,height,ids){
 if(!Array.isArray(raw)||raw.length>32)throw Error('Use at most 32 pressure traps.');
 return raw.map(t=>{
  if(!t||!['spikes','dart'].includes(t.type))throw Error('Trap type must be spikes or dart.');
  if(![t.x,t.y,t.tx,t.ty].every(Number.isInteger)||t.x<0||t.x>=width||t.tx<0||t.tx>=width||t.y<0||t.y>=height||t.ty<0||t.ty>=height)throw Error('Trap plate and target must fit inside the room.');
  if(!Number.isFinite(t.delay)||t.delay<.6||t.delay>3||!Number.isFinite(t.active)||t.active<.5||t.active>4||!Number.isFinite(t.cooldown)||t.cooldown<1||t.cooldown>6)throw Error('Traps need a 0.6–3s warning, 0.5–4s active time, and 1–6s cooldown.');
  if(t.offSwitch!==undefined&&!ids.has(t.offSwitch))throw Error('Trap shutdown must refer to an existing switch.');
  const alarm=validateAlarm(t.alarm,ids);
  const base={...(alarm?{alarm}:{}),type:t.type,x:t.x,y:t.y,tx:t.tx,ty:t.ty,delay:t.delay,active:t.active,cooldown:t.cooldown,...(t.offSwitch?{offSwitch:t.offSwitch}:{})};
  if(t.type==='spikes'){
   if(!Number.isInteger(t.w)||t.w<1||t.w>8||t.tx+t.w>width)throw Error('Spike traps must be 1–8 tiles wide and fit inside the room.');
   return {...base,w:t.w};
  }
  if(!Object.hasOwn(DIRECTIONS,t.dir)||!Number.isFinite(t.speed)||t.speed<120||t.speed>600)throw Error('Dart traps need a cardinal direction and speed of 120–600.');
  return {...base,dir:t.dir,speed:t.speed};
 });
}
export const trapCells=t=>[{x:t.x,y:t.y},...Array.from({length:t.type==='spikes'?t.w:1},(_,i)=>({x:t.tx+i,y:t.ty}))];
export function initTraps(g){g.traps=(g.level.traps??[]).map((t,id)=>({...t,id,state:'idle',until:0,contact:false,triggers:0}));for(const t of g.traps)if(t.alarm)t.state=alarmState(g,t);}
export function updateTraps(g,harm=true){
 for(const t of g.traps){
  const p=g.player,plate={x:t.x*30,y:t.y*30+12,w:30,h:18};
  const touching=overlap(p,plate),near=overlap(p,{x:plate.x-6,y:plate.y-6,w:42,h:30});
  if(!near)t.contact=false;
  const alarm=alarmState(g,t);if(alarm!=='ready'){t.state=alarm;t.until=0;t.contact=false;continue;}
  if(['arming','dormant'].includes(t.state))t.state='idle';
  if(t.offSwitch&&g.activated.has(t.offSwitch)){t.state='disabled';t.until=0;t.contact=touching;continue;}
  if(t.state==='disabled')t.state='idle';
  if(t.state!=='idle'&&g.clock>=t.until){
   if(t.state==='warning'){
    t.state='active';t.until+=t.active;g.cb.sound('shot');
    if(t.type==='dart'){const [dx,dy]=DIRECTIONS[t.dir];g.projectiles.push({x:t.tx*30+15+dx*17,y:t.ty*30+15+dy*17,vx:dx*t.speed,vy:dy*t.speed,life:5});}
   }else if(t.state==='active'){t.state='cooldown';t.until+=t.cooldown;}
   else t.state='idle';
  }
  if(harm&&g.status==='playing'&&touching&&!t.contact){t.contact=true;if(t.state==='idle'){t.state='warning';t.until=g.clock+t.delay;t.triggers++;g.cb.sound('trap');}}
  if(harm&&g.status==='playing'&&t.type==='spikes'&&t.state==='active'){
   const box={x:t.tx*30+3,y:t.ty*30+5,w:t.w*30-6,h:25},old=g.previousPlayer??p;
   if(segmentHit(old.x,old.y,p.x,p.y,{x:box.x-p.w,y:box.y-p.h,w:box.w+p.w,h:box.h+p.h})!==null)g.hurt('spikes',{x:box.x,y:box.y});
  }
 }
}
export function drawTraps(c,g,editor=false){
 for(const t of g.traps){
  const x=t.x*30+15,y=t.y*30+27,tx=t.tx*30+15,ty=t.ty*30+15;
  const warning=t.state==='warning',active=t.state==='active',disabled=['disabled','dormant'].includes(t.state),color=disabled?'#81946a':active?'#cd4638':warning?'#d9a52d':'#9b7865';
  c.save();c.strokeStyle=color+'70';c.lineWidth=1;c.setLineDash([3,6]);c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke();c.setLineDash([]);
  c.fillStyle=color;c.fillRect(x-14,y-3,28,5);c.fillStyle='#675342';c.font='bold 12px monospace';c.textAlign='center';c.fillText('T'+(t.id+1),x,y-8);
  if(t.type==='spikes'){
   c.fillStyle=color;c.fillRect(t.tx*30,t.ty*30+27,t.w*30,3);
   for(let i=0;i<t.w*3;i++){const px=t.tx*30+i*10;c.beginPath();c.moveTo(px+1,t.ty*30+27);c.lineTo(px+5,t.ty*30+(active?3:23));c.lineTo(px+9,t.ty*30+27);c.fill();}
   if(warning||editor){c.strokeStyle=color;c.setLineDash([3,3]);c.strokeRect(t.tx*30,t.ty*30+3,t.w*30,24);c.setLineDash([]);}
  }else{
   c.fillStyle='#56483e';c.beginPath();c.arc(tx,ty,12,0,Math.PI*2);c.fill();c.fillStyle=color;c.fillText({right:'→',left:'←',up:'↑',down:'↓'}[t.dir],tx,ty+4);
  }
  c.fillStyle=color;c.fillText('T'+(t.id+1)+(t.offSwitch?' / '+t.offSwitch:''),tx,ty-19);
  if(warning){c.fillRect(tx-15,ty-13,30*Math.max(0,(t.until-g.clock)/t.delay),3);c.fillText(Math.max(0,t.until-g.clock).toFixed(1),x,y-20);}
  if(t.state==='cooldown'){c.fillStyle='#728267';c.fillText('RESET',tx,ty-30);}
  c.restore();
 }
}
