import {SKINS,drawAccessories} from './cosmetics.js';
import {drawEndlessFront} from './endless.js';
import {drawBoss} from './bosses.js';
import {W,H,TILE} from './levels.js';
import {timerRemaining} from './circuits.js';
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
function flower(c,x,y,r,color){for(let i=0;i<5;i++)circle(c,x+Math.cos(i*1.257)*r*.65,y+Math.sin(i*1.257)*r*.65,r*.45,color);circle(c,x,y,r*.35,'#ffd95b');}
function cloud(c,x,y,w,color='#f8fbff'){circle(c,x+w*.25,y,w*.22,color);circle(c,x+w*.5,y-3,w*.28,color);circle(c,x+w*.75,y,w*.22,color);c.fillStyle=color;c.fillRect(x+w*.2,y,w*.6,8);}
function label(c,text,x,y){c.font='bold 12px sans-serif';c.textAlign='center';const w=c.measureText(text).width+6;c.fillStyle='#f7fbf4e8';c.fillRect(x-w/2,y-11,w,15);c.fillStyle='#365164';c.fillText(text,x,y);c.textAlign='left';}
export function drawKidsWorld(c,g){
 c.fillStyle='#e7f5eb';c.fillRect(0,0,g.worldW,g.worldH);
 c.strokeStyle='#d5e9df';c.lineWidth=.5;c.beginPath();for(let x=g.endless?Math.floor(g.camera.x/30)*30:0;x<(g.endless?g.camera.x+W:g.worldW);x+=30){c.moveTo(x,0);c.lineTo(x,g.worldH);}for(let y=0;y<g.worldH;y+=30){c.moveTo(0,y);c.lineTo(g.worldW,y);}c.stroke();
 for(const s of g.solids){c.fillStyle='#658d78';c.fillRect(s.x,s.y,s.w,s.h);c.fillStyle='#aad1a1';c.fillRect(s.x,s.y,s.w,4);}
 for(const s of g.gates){c.globalAlpha=g.gateOpen(s)?.18:1;c.fillStyle='#bb92cf';c.fillRect(s.x,s.y,s.w,s.h);c.strokeStyle='#785f92';c.lineWidth=2;c.strokeRect(s.x+2,s.y+2,s.w-4,s.h-4);c.globalAlpha=1;label(c,s.switchId,s.x+s.w/2,s.y+s.h/2+4);}
 for(const p of g.platforms){c.strokeStyle='#719db166';c.setLineDash([4,6]);c.beginPath();c.moveTo(p.path.x*30,p.path.y*30);c.lineTo(p.path.toX*30,p.path.toY*30);c.stroke();c.setLineDash([]);c.fillStyle='#9cc1eb';c.fillRect(p.x,p.y,p.w,p.h);for(let x=p.x;x<p.x+p.w;x+=30)cloud(c,x,p.y,30);}
 for(const p of g.crumbles){if(p.gone){c.strokeStyle='#81b4aa88';c.strokeRect(p.x,p.y,p.w,8);continue;}c.globalAlpha=p.startedAt===null?1:.6;c.fillStyle='#efd5ff';c.fillRect(p.x,p.y,p.w,p.h);for(let x=p.x;x<p.x+p.w;x+=30)cloud(c,x,p.y,30,'#efd5ff');c.globalAlpha=1;}
 for(const h of g.hazards){if(h.type==='spike'){c.fillStyle='#5daecc';c.fillRect(h.x+2,h.y+26,26,4);for(let i=0;i<3;i++){c.strokeStyle='#459fc9';c.lineWidth=3;c.beginPath();c.moveTo(h.x+5+i*10,h.y+26);c.quadraticCurveTo(h.x+2+i*10,h.y+5,h.x+7+i*8,h.y+5);c.stroke();circle(c,h.x+7+i*8,h.y+5,3,'#92daf1');}}else{c.save();c.translate(h.x+15,h.y+15);c.rotate(g.clock*2);flower(c,0,0,18,'#8bcbe9');c.restore();}}
 for(const t of g.traps){c.fillStyle='#b6afd9';c.fillRect(t.x*30,t.y*30+24,30,6);label(c,`T${t.id+1}`,t.x*30+15,t.y*30+15);const x=t.tx*30,y=t.ty*30;c.strokeStyle=t.state==='warning'?'#d5a644':'#599fc7';c.setLineDash([3,3]);c.strokeRect(x,y,(t.w||1)*30,30);c.setLineDash([]);if(t.state==='active'){for(let j=0;j<(t.w||1);j++)flower(c,x+j*30+15,y+15,16,'#7ac6ef');}if(t.state==='warning')label(c,'SOON',x+15,y-5);}
 for(const d of g.devices){const x=d.x*30+15,y=d.y*30+15,off=['disabled','dormant'].includes(d.state),warn=['warning','arming'].includes(d.state);if(d.type==='laser'&&d.beam&&!off){c.strokeStyle=d.state==='active'?'#ab73ce':warn?'#dbad44':'#8babc966';c.lineWidth=d.state==='active'?7:2;c.setLineDash(d.state==='active'?[]:[4,5]);c.beginPath();c.moveTo(d.beam.x,d.beam.y);c.lineTo(d.beam.ex,d.beam.ey);c.stroke();c.setLineDash([]);}flower(c,x,y,13,off?'#adc4b4':warn?'#ffe083':'#93c3f1');if(d.offSwitch)label(c,d.offSwitch,x,y-18);}
 for(const s of g.sentries){const x=s.x*30+15,y=s.y*30+15;circle(c,x,y,13,'#be9fd5');circle(c,x-5,y-2,5,'#fff');circle(c,x+5,y-2,5,'#fff');circle(c,x-5,y-2,2,'#415568');circle(c,x+5,y-2,2,'#415568');if(s.state==='tracking'){c.strokeStyle='#c5a03d';c.lineWidth=2;c.beginPath();c.arc(x,y,19,-Math.PI/2,-Math.PI/2+Math.PI*2*s.charge/s.lock);c.stroke();}if(s.offSwitch)label(c,s.offSwitch,x,y-20);}
 for(const b of g.projectiles){circle(c,b.x,b.y,b.projectile==='homing'?7:4,'#68bddf');circle(c,b.x-2,b.y-2,2,'#e9fcff');}
 for(const s of g.switches){const x=s.x*30+15,y=s.y*30+15,on=g.activated.has(s.id);flower(c,x,y,18,on?'#93d1a5':'#f4c476');c.fillStyle='#5b6079';if(s.mode==='toggle'){c.lineWidth=4;c.strokeStyle='#5b6079';c.beginPath();c.moveTo(x,y+5);c.lineTo(x+(on?7:-7),y-8);c.stroke();}else c.fillRect(x-5,y-5,10,10);label(c,s.id,x,y-22);label(c,s.mode==='timed'?(on?timerRemaining(g,s.id).toFixed(1):s.duration)+'s':s.mode==='toggle'?(on?'ON':'OFF'):on?'SET':'TOUCH',x,y+31);}
 for(const gold of g.gold)if(!gold.taken){flower(c,gold.x,gold.y,7,gold.firstBonus?'#7edbdf':'#ffe477');}
 if(!g.endless){const ex=g.level.exit.x*30,ey=g.level.exit.y*30;c.fillStyle=g.exitUnlocked?'#93d1b8':'#c5b3d8';c.fillRect(ex,ey,30,30);flower(c,ex+15,ey+15,12,g.exitUnlocked?'#ffdf83':'#e4d5ee');label(c,g.exitUnlocked?'PORTAL':'LOCKED',ex+15,ey-8);}
 if(g.ghost)cloud(c,g.ghost.x-18,g.ghost.y,36,'#dfdcff');
 drawBoss(c,g);drawEndlessFront(c,g,true);
 drawKidsAvatar(c,g);
 const p=g.player,x=p.x+8,y=p.y;
 for(const particle of g.particles){c.globalAlpha=Math.min(1,particle.life*2);circle(c,particle.x,particle.y,2,'#7bbfe0');}c.globalAlpha=1;
 if(g.effects.shield>0){c.strokeStyle='#86bce0';c.lineWidth=2;c.beginPath();c.arc(x,y+13,23,0,Math.PI*2);c.stroke();}
}
export function renderKidsGame(g){if(!g.level)return;const c=g.ctx,overview=!g.endless&&(g.mapOpen||g.status==='ready'),scale=overview?Math.min(W/g.worldW,H/g.worldH):1;c.clearRect(0,0,W,H);c.fillStyle='#d5e7f1';c.fillRect(0,0,W,H);c.save();c.translate(overview?(W-g.worldW*scale)/2:-g.camera.x,overview?(H-g.worldH*scale)/2:-g.camera.y);c.scale(scale,scale);drawKidsWorld(c,g);c.restore();}

export function drawKidsAvatar(c,g){
 const p=g.player,x=p.x+8,y=p.y;const resting=['dying','dead'].includes(g.status);
 if(resting){cloud(c,x-22,y+18,44);label(c,'Z z',x+10,y);}
 else {c.fillStyle=(SKINS.find(s=>s.id===g.skin)?.id!=='classic'&&SKINS.find(s=>s.id===g.skin)?.scarf)||'#906bc1';c.fillRect(p.x+3,y+10,10,12);circle(c,x,y+6,7,'#fff3df');c.fillStyle='#e6b1db';c.beginPath();c.moveTo(x-2,y);c.lineTo(x+2,y-9);c.lineTo(x+5,y+1);c.fill();circle(c,x+p.face*3,y+5,1.5,'#365164');c.strokeStyle='#725aa4';c.lineWidth=3;c.beginPath();c.moveTo(x,y+20);c.lineTo(x-6,y+26);c.moveTo(x,y+20);c.lineTo(x+6,y+26);c.moveTo(x-6,y+13);c.lineTo(x+6,y+14);c.stroke();}
 if(!resting)drawAccessories(c,g);
}
