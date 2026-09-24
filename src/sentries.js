import {validateAlarm,alarmState} from './alarms.js';
import {segmentHit} from './projectiles.js';
export function validateSentries(raw,width,height,ids){
 if(!Array.isArray(raw)||raw.length>16)throw Error('Use at most 16 tracking sentries.');
 return raw.map(s=>{
  if(!s||![s.x,s.y].every(Number.isInteger)||s.x<0||s.y<0||s.x>=width||s.y>=height)throw Error('Sentries must fit inside the room.');
  if(!Number.isFinite(s.range)||s.range<6||s.range>32||!Number.isFinite(s.lock)||s.lock<.7||s.lock>3||!Number.isFinite(s.cooldown)||s.cooldown<.8||s.cooldown>5||!Number.isFinite(s.speed)||s.speed<120||s.speed>600)throw Error('Sentries need range 6–32 tiles, lock time 0.7–3s, cooldown 0.8–5s, and shot speed 120–600.');
  if(s.offSwitch!==undefined&&!ids.has(s.offSwitch))throw Error('Sentry shutdown must refer to an existing switch.');
  const alarm=validateAlarm(s.alarm,ids);
  return {...(alarm?{alarm}:{}),x:s.x,y:s.y,range:s.range,lock:s.lock,cooldown:s.cooldown,speed:s.speed,...(s.offSwitch?{offSwitch:s.offSwitch}:{})};
 });
}
// Walk every grid cell crossed by the ray, then test the separate dynamic cover.
// This avoids scanning the full bounding rectangle of long diagonal sight lines.
export function lineOfSight(g,x,y,tx,ty){
 const dx=tx-x,dy=ty-y,sx=Math.sign(dx),sy=Math.sign(dy);let cx=Math.floor(x/30),cy=Math.floor(y/30);
 const endX=Math.floor(tx/30),endY=Math.floor(ty/30),stepX=dx?30/Math.abs(dx):Infinity,stepY=dy?30/Math.abs(dy):Infinity;
 let nextX=dx?((sx>0?(cx+1)*30:cx*30)-x)/dx:Infinity,nextY=dy?((sy>0?(cy+1)*30:cy*30)-y)/dy:Infinity;
 for(let n=0;n<200;n++){
  if(g.solidGrid.has(`${cx},${cy}`))return false;
  if(cx===endX&&cy===endY)break;
  if(nextX<nextY){cx+=sx;nextX+=stepX;}else{cy+=sy;nextY+=stepY;}
 }
 const cover=[...g.gates.filter(s=>!g.gateOpen(s)),...g.platforms,...g.crumbles.filter(s=>!s.gone)];
 return !cover.some(s=>segmentHit(x,y,tx,ty,s)!==null);
}
export function initSentries(g){g.lastSentryClock=g.clock;g.sentries=(g.level.sentries??[]).map(s=>({...s,state:'idle',charge:0,readyAt:0,aimX:s.x*30+15,aimY:s.y*30+45,shots:0,acquisitions:0,lostLocks:0}));for(const s of g.sentries)if(s.alarm)s.state=alarmState(g,s);}
export function updateSentries(g,harm=true){
 const dt=Math.max(0,g.clock-g.lastSentryClock);g.lastSentryClock=g.clock;
 for(const s of g.sentries){
  const alarm=alarmState(g,s);if(alarm!=='ready'){s.state=alarm;s.charge=0;s.readyAt=0;continue;}
  if(s.offSwitch&&g.activated.has(s.offSwitch)){s.state='disabled';s.charge=0;continue;}
  if(!harm||g.status!=='playing'||dt===0)continue;
  if(g.clock<s.readyAt){s.state='cooldown';continue;}
  const x=s.x*30+15,y=s.y*30+15,p=g.player,tx=p.x+p.w/2,ty=p.y+p.h/2,distance=Math.hypot(tx-x,ty-y);
  if(distance>s.range*30||!lineOfSight(g,x,y,tx,ty)){if(s.charge>0)s.lostLocks++;s.charge=0;s.state='idle';continue;}
  if(s.charge===0)s.acquisitions++;s.charge+=dt;s.aimX=tx;s.aimY=ty;s.state='tracking';
  if(s.charge>=s.lock){
   const dx=(tx-x)/(distance||1),dy=(ty-y)/(distance||1);
   // Spawn at the eye so a wall immediately beside it cannot be skipped.
   g.projectiles.push({x,y,vx:dx*s.speed,vy:dy*s.speed,life:5});s.shots++;s.charge=0;s.readyAt=g.clock+s.cooldown;s.state='cooldown';g.burst(x,y,'#e7ae75',6);g.cb.sound('shot');
  }
 }
}
export function drawSentries(c,g,editor=false){
 for(const s of g.sentries){
  const x=s.x*30+15,y=s.y*30+15,tracking=s.state==='tracking',disabled=['disabled','dormant'].includes(s.state),progress=Math.min(1,(s.charge??0)/s.lock);
  c.save();
  if(editor){c.strokeStyle='#97618b50';c.setLineDash([4,7]);c.beginPath();c.arc(x,y,s.range*30,0,Math.PI*2);c.stroke();c.setLineDash([]);}
  if(tracking){
   c.strokeStyle=progress>.75?'#ce584b':'#bc9257';c.lineWidth=1.5;c.setLineDash([4,5]);c.beginPath();c.moveTo(x,y);c.lineTo(s.aimX,s.aimY);c.stroke();c.setLineDash([]);
   const r=14-5*progress;c.strokeRect(s.aimX-r,s.aimY-r,r*2,r*2);c.lineWidth=3;c.beginPath();c.arc(x,y,19,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);c.stroke();
  }
  c.fillStyle='#594754';c.beginPath();c.moveTo(x,y-14);c.lineTo(x+14,y);c.lineTo(x,y+14);c.lineTo(x-14,y);c.closePath();c.fill();
  const angle=Math.atan2((s.aimY??y+1)-y,(s.aimX??x)-x);c.fillStyle=disabled?'#8fa968':tracking?'#efbd76':'#b794b7';c.beginPath();c.arc(x+Math.cos(angle)*4,y+Math.sin(angle)*4,5,0,Math.PI*2);c.fill();
  c.font='bold 12px monospace';c.textAlign='center';c.fillStyle='#775d73';c.fillText(s.offSwitch??'EYE',x,y-24);c.restore();
 }
}
