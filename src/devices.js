import {validateAlarm,alarmState,alarmClock} from './alarms.js';
import {updateProjectiles} from './projectiles.js';
// Stateful hazard machinery uses the world clock, never wall-clock time.
// Directions are shared with the editor and file validator.
export const DIRECTIONS={right:[1,0],down:[0,1],left:[-1,0],up:[0,-1]};
export function validateDevices(raw,width,height,switchIds){
  if(!Array.isArray(raw)||raw.length>64)throw new Error('Use at most 64 devices.');
  return raw.map(d=>{
    if(!d||!['laser','turret'].includes(d.type))throw new Error('Unknown device type.');
    if(!Number.isInteger(d.x)||!Number.isInteger(d.y)||d.x<0||d.y<0||d.x>=width||d.y>=height)throw new Error('Device emitters must be inside the room.');
    if(!Object.hasOwn(DIRECTIONS,d.dir))throw new Error('Device direction must be up, down, left, or right.');
    if(!Number.isFinite(d.period)||d.period<(d.type==='laser'?2:1.2)||d.period>12)throw new Error('Device cycle must be 2–12s for lasers or 1.2–12s for turrets.');
    if(!Number.isFinite(d.phase)||d.phase<0||d.phase>=d.period)throw new Error('Device phase must be inside its period.');
    if(d.offSwitch!==undefined&&!switchIds.has(d.offSwitch))throw new Error('Device shutdown must refer to an existing switch.');
    const alarm=validateAlarm(d.alarm,switchIds);
    if(d.type==='turret'){
      const projectile=d.projectile??'straight';if(!['straight','homing'].includes(projectile))throw new Error('Turret projectiles must be straight or homing.');
      const minSpeed=projectile==='homing'?70:120,maxSpeed=projectile==='homing'?220:600;
      if(!Number.isFinite(d.speed)||d.speed<minSpeed||d.speed>maxSpeed)throw new Error(projectile==='homing'?'Heat rockets must be 70–220 pixels per second.':'Bullet speed must be 120–600 pixels per second.');
      return {...(alarm?{alarm}:{}),type:d.type,x:d.x,y:d.y,dir:d.dir,period:d.period,phase:d.phase,speed:d.speed,...(projectile==='homing'?{projectile}:{}),...(d.offSwitch?{offSwitch:d.offSwitch}:{})};
    }
    if(!Number.isInteger(d.length)||d.length<1||d.length>96)throw new Error('Beam length must be 1–96 tiles.');
    const [dx,dy]=DIRECTIONS[d.dir];
    if(d.x+dx*d.length<0||d.x+dx*d.length>=width||d.y+dy*d.length<0||d.y+dy*d.length>=height)throw new Error('Beam endpoint must be inside the room.');
    if(!Number.isFinite(d.on)||d.on<.25||d.on>d.period-.7)throw new Error('Laser cycles need at least 0.7s between pulses.');
    return {...(alarm?{alarm}:{}),type:d.type,x:d.x,y:d.y,dir:d.dir,length:d.length,period:d.period,on:d.on,phase:d.phase,...(d.offSwitch?{offSwitch:d.offSwitch}:{})};
  });
}
export function laserPhase(d,clock,activated){
  if(d.offSwitch&&activated.has(d.offSwitch))return 'disabled';
  const t=(clock+d.phase)%d.period;
  // Each retry begins with a readable off interval, then an amber charge.
  if(t>=d.period-d.on)return 'active';
  return t>=d.period-d.on-.45?'warning':'idle';
}
export function beamSegment(g,d){
  const [dx,dy]=DIRECTIONS[d.dir],x=d.x*30+15,y=d.y*30+15;
  let length=d.length*30;
  // A cardinal ray uses exact slab intersections: blocks and closed gates are cover.
  const region={x:Math.min(x,x+dx*length)-1,y:Math.min(y,y+dy*length)-1,w:Math.abs(dx*length)+2,h:Math.abs(dy*length)+2};
  for(const s of g.nearSolids(region)){
    if(dx&&y>s.y&&y<s.y+s.h){const hit=dx>0?s.x-x:x-(s.x+s.w);if(hit>=0)length=Math.min(length,hit);}
    if(dy&&x>s.x&&x<s.x+s.w){const hit=dy>0?s.y-y:y-(s.y+s.h);if(hit>=0)length=Math.min(length,hit);}
  }
  return {x,y,ex:x+dx*length,ey:y+dy*length,length};
}
export function initDevices(g){g.projectiles=[];g.lastDeviceClock=g.clock;g.devices=(g.level.devices??[]).map(d=>({...d,state:'idle',beam:null}));updateDevices(g,false);}
export function updateDevices(g,harm=true){
  const dt=Math.max(0,g.clock-g.lastDeviceClock);const beforeClock=g.lastDeviceClock;g.lastDeviceClock=g.clock;
  updateProjectiles(g,dt,harm);
  for(const d of g.devices){
    const alarm=alarmState(g,d),clock=alarmClock(g,d),previous=alarmClock(g,d,beforeClock);
    if(d.type==='laser'){const coverKey=[...g.activated].sort().join('')+'|'+g.gates.map(gate=>g.gateOpen(gate)?1:0).join('')+'|'+g.crumbleRevision;if(!d.beam||d.coverKey!==coverKey||g.platforms.length){d.beam=beamSegment(g,d);d.coverKey=coverKey;}}
    if(alarm!=='ready'){const wasActive=d.type==='laser'&&d.state==='active';d.state=alarm;if(wasActive)g.cb.sound('laser-off');continue;}
    if(d.type==='turret'){
      const t=(clock+d.phase)%d.period,disabled=d.offSwitch&&g.activated.has(d.offSwitch);
      d.state=disabled?'disabled':t>d.period-.6?'warning':'idle';
      if(!disabled&&Math.floor((clock+d.phase)/d.period)>Math.floor((previous+d.phase)/d.period)){
        const [dx,dy]=DIRECTIONS[d.dir],homing=d.projectile==='homing';g.projectiles.push({x:d.x*30+15+dx*17,y:d.y*30+15+dy*17,vx:dx*d.speed,vy:dy*d.speed,speed:d.speed,projectile:homing?'homing':'straight',turnRate:1.25,life:homing?12:5});g.burst(d.x*30+15+dx*20,d.y*30+15+dy*20,homing?'#f08b55':'#efba6b',4);if(Math.abs(d.x*30-g.camera.x-480)<540&&Math.abs(d.y*30-g.camera.y-270)<330)g.cb.sound(homing?'rocket-launch':'shot');
      }
      continue;
    }
    const previousState=d.state;d.state=laserPhase(d,clock,g.activated);
    if(d.state!==previousState){if(d.state==='warning')g.cb.sound('laser-warning');else if(d.state==='active')g.cb.sound('laser-on');else if(previousState==='active')g.cb.sound('laser-off');}
    if(!harm||d.state!=='active'||g.status!=='playing')continue;
    const b=d.beam,p=g.player;
    // Check the swept player bounds as well as its current position to avoid
    // tunnelling across a thin beam during a boosted or fast falling step.
    const before=g.previousPlayer??p;
    const left=Math.min(p.x,before.x),top=Math.min(p.y,before.y),right=Math.max(p.x+p.w,before.x+before.w),bottom=Math.max(p.y+p.h,before.y+before.h);
    const hit=left<Math.max(b.x,b.ex)+2&&right>Math.min(b.x,b.ex)-2&&top<Math.max(b.y,b.ey)+2&&bottom>Math.min(b.y,b.ey)-2;
    if(hit)g.hurt('laser',{x:b.x-15,y:b.y-15});
  }
}
export function drawDevices(c,g){
  for(const d of g.devices){
    if(d.type==='turret'){
      const x=d.x*30+15,y=d.y*30+15,[dx,dy]=DIRECTIONS[d.dir];c.save();c.translate(x,y);c.rotate(Math.atan2(dy,dx));
      c.fillStyle='#344239';c.beginPath();c.arc(0,0,12,0,Math.PI*2);c.fill();c.fillRect(0,-5,19,10);c.fillStyle=['disabled','dormant'].includes(d.state)?'#83a15e':['warning','arming'].includes(d.state)?'#ffc46c':'#ba6b4f';c.fillRect(13,-4,5,8);
      if(['warning','arming'].includes(d.state)){c.strokeStyle='#e5a252';c.lineWidth=2;c.beginPath();c.arc(0,0,16,0,Math.PI*2);c.stroke();}
      c.restore();if(d.offSwitch){c.fillStyle='#946b39';c.font='bold 12px monospace';c.textAlign='center';c.fillText(d.offSwitch,x,y-18);c.textAlign='left';}continue;
    }
    const b=d.beam;if(!b)continue;
    const active=d.state==='active',warning=['warning','arming'].includes(d.state),disabled=['disabled','dormant'].includes(d.state);
    c.save();c.lineCap='butt';
    if(!disabled){
      c.strokeStyle=active?'#e7584345':warning?'#e4b749':'#aa685e45';c.lineWidth=active?13:1.5;
      if(!active)c.setLineDash(warning?[5,3]:[2,7]);
      c.beginPath();c.moveTo(b.x,b.y);c.lineTo(b.ex,b.ey);c.stroke();c.setLineDash([]);
      if(active){c.strokeStyle='#d8433c';c.lineWidth=5;c.stroke();c.strokeStyle='#fff3c4';c.lineWidth=1.5;c.stroke();}
    }
    c.translate(b.x,b.y);const [dx,dy]=DIRECTIONS[d.dir];c.rotate(Math.atan2(dy,dx));
    c.fillStyle='#354037';c.fillRect(-9,-11,16,22);c.fillStyle=disabled?'#6e9752':active?'#f09063':warning?'#edc566':'#8d5b4d';c.fillRect(4,-7,5,14);
    const cycle=(alarmClock(g,d)+d.phase)%d.period/d.period;
    c.fillStyle='#101b16';c.fillRect(-7,-8,6,16);c.fillStyle=disabled?'#b8d990':'#e2bc79';c.fillRect(-7,8-16*(disabled?1:cycle),6,16*(disabled?1:cycle));c.restore();
    if(d.offSwitch){c.fillStyle=disabled?'#66844b':'#946b39';c.font='bold 12px monospace';c.textAlign='center';c.fillText(d.offSwitch,b.x,b.y-18);c.textAlign='left';}
  }
  for(const b of g.projectiles){const angle=Math.atan2(b.vy,b.vx);if(b.projectile==='homing'){c.save();c.translate(b.x,b.y);c.rotate(angle);c.fillStyle='#f08b55';c.beginPath();c.moveTo(8,0);c.lineTo(-5,-4);c.lineTo(-3,0);c.lineTo(-5,4);c.closePath();c.fill();c.fillStyle='#ffe6a4';c.fillRect(0,-1,5,2);c.restore();}else{c.strokeStyle='#d67542';c.lineWidth=3;c.beginPath();c.moveTo(b.x-b.vx*.025,b.y-b.vy*.025);c.lineTo(b.x,b.y);c.stroke();c.fillStyle='#ffe6a4';c.fillRect(b.x-2,b.y-2,4,4);}}
}
