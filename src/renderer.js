import {drawAlarmLinks} from './alarms.js';
import {drawSentries} from './sentries.js';
import {drawTraps} from './traps.js';
import {drawCrumbles} from './crumbles.js';
import {conditionLabel,timerRemaining} from './circuits.js';
import {drawPlatforms} from './platforms.js';
import {drawDevices} from './devices.js';
import {W,H,TILE} from './levels.js';
import {SKINS} from './cosmetics.js';
const circuitColor=id=>['#ba7c24','#548eaa','#9066aa','#668d40','#b96150','#477d78','#a28939','#845c45'][id.charCodeAt(0)-65]||'#ba7c24';
export function renderGame(g){
  if(!g.level)return;const c=g.ctx;
  const overview=g.mapOpen||(g.status==='ready'&&(g.worldW>W||g.worldH>H));
  const scale=overview?Math.min(W/g.worldW,H/g.worldH):1;
  const ox=overview?(W-g.worldW*scale)/2:-g.camera.x,oy=overview?(H-g.worldH*scale)/2:-g.camera.y;
  c.clearRect(0,0,W,H);c.fillStyle='#222c22';c.fillRect(0,0,W,H);c.save();
  if(g.shake&&!g.reducedMotion)c.translate((Math.random()-.5)*g.shake,(Math.random()-.5)*g.shake);
  c.translate(ox,oy);c.scale(scale,scale);c.fillStyle='#e4e7d8';c.fillRect(0,0,g.worldW,g.worldH);
  c.strokeStyle='#d6dccb';c.lineWidth=.7;c.beginPath();
  for(let x=0;x<=g.worldW;x+=TILE){c.moveTo(x,0);c.lineTo(x,g.worldH);}for(let y=0;y<=g.worldH;y+=TILE){c.moveTo(0,y);c.lineTo(g.worldW,y);}c.stroke();
  for(const s of g.solids){
    c.fillStyle='#3d483e';c.fillRect(s.x,s.y,s.w,s.h);c.fillStyle='#69755c';c.fillRect(s.x,s.y,s.w,2);
    c.strokeStyle='#475142';c.strokeRect(s.x+.5,s.y+.5,29,29);c.fillStyle='#53604d';c.fillRect(s.x+6,s.y+9,2,2);
  }
  drawTraps(c,g);drawCrumbles(c,g);drawPlatforms(c,g);
  for(const gate of g.gates){
    const open=g.gateOpen(gate),color=circuitColor(gate.switchId);
    c.globalAlpha=open?.2:1;c.fillStyle=open?color:'#323b32';c.fillRect(gate.x,gate.y,gate.w,gate.h);
    c.strokeStyle=color;c.lineWidth=3;c.strokeRect(gate.x+2,gate.y+2,gate.w-4,gate.h-4);
    if(!open){c.save();c.beginPath();c.rect(gate.x,gate.y,gate.w,gate.h);c.clip();c.lineWidth=3;c.beginPath();for(let y=gate.y-gate.w;y<gate.y+gate.h;y+=16){c.moveTo(gate.x,y);c.lineTo(gate.x+gate.w,y+gate.w);}c.stroke();c.restore();}
    c.globalAlpha=1;c.fillStyle=open?'#648345':color;c.fillRect(gate.x+gate.w/2-10,gate.y+gate.h/2-11,20,22);
    c.fillStyle='#f1efd9';c.textAlign='center';c.font='bold 14px monospace';c.fillText(gate.switchId,gate.x+gate.w/2,gate.y+gate.h/2+5);const timed=g.switches.filter(s=>s.mode==='timed'&&Object.hasOwn(gate.states??{[gate.switchId]:true},s.id));if(gate.states||timed.length){c.font='12px monospace';c.fillStyle=gate.pendingClose?'#bd5a3d':'#7c653e';c.fillText(gate.pendingClose?'WAITING':conditionLabel(gate.states??{[gate.switchId]:true})+(timed.length?' / '+timed.map(s=>timerRemaining(g,s.id).toFixed(1)+'s').join(' '):''),gate.x+gate.w/2,gate.y-8);}c.textAlign='left';
  }
  for(const h of g.hazards){
    if(h.type==='spike'){
      c.fillStyle='#493733';c.fillRect(h.x,h.y+26,30,4);
      c.fillStyle='#a44738';c.beginPath();c.moveTo(h.x+1,h.y+28);c.lineTo(h.x+10,h.y+3);c.lineTo(h.x+15,h.y+20);c.lineTo(h.x+23,h.y+2);c.lineTo(h.x+29,h.y+28);c.closePath();c.fill();
      c.strokeStyle='#e5b699';c.lineWidth=1.4;c.beginPath();c.moveTo(h.x+2,h.y+27);c.lineTo(h.x+10,h.y+3);c.moveTo(h.x+16,h.y+22);c.lineTo(h.x+23,h.y+2);c.stroke();
    }else{
      c.strokeStyle='#bd7c654f';c.lineWidth=1;c.setLineDash([4,5]);c.beginPath();c.moveTo(h.baseX-32,h.y+15);c.lineTo(h.baseX+77,h.y+15);c.stroke();c.setLineDash([]);
      c.save();c.translate(h.x+15,h.y+15);c.rotate(g.clock*8);c.beginPath();
      for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?11:18;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();
      c.fillStyle=g.effects.freeze>0?'#71a8bf':'#68736a';c.fill();c.strokeStyle='#29372d';c.lineWidth=1.5;c.stroke();
      c.fillStyle='#ac4f3c';c.beginPath();c.arc(0,0,8,0,Math.PI*2);c.fill();c.strokeStyle='#d1d2b7';c.beginPath();c.moveTo(-5,0);c.lineTo(5,0);c.moveTo(0,-5);c.lineTo(0,5);c.stroke();c.restore();
    }
  }
  drawDevices(c,g);drawSentries(c,g);drawAlarmLinks(c,g);
  for(const s of g.switches){
    const active=g.activated.has(s.id),x=s.x*TILE+15,y=s.y*TILE+15,color=circuitColor(s.id);
    c.fillStyle=active?'#ccdab3':'#e9d1a2';c.beginPath();c.arc(x,y,20,0,Math.PI*2);c.fill();c.strokeStyle=active?'#6e904b':color;c.lineWidth=2;c.stroke();
    if(s.mode==='timed'){c.strokeStyle=active&&timerRemaining(g,s.id)<2?'#d85744':'#62a5a0';c.lineWidth=4;c.beginPath();c.arc(x,y,24,-Math.PI/2,-Math.PI/2+Math.PI*2*(active?timerRemaining(g,s.id)/s.duration:1));c.stroke();}
    c.fillStyle='#384530';c.fillRect(x-8,y+4,16,6);c.strokeStyle=active?'#739845':color;c.lineWidth=4;if(s.mode==='toggle'){c.beginPath();c.moveTo(x,y+5);c.lineTo(x+(active?8:-8),y-9);c.stroke();}else{c.fillStyle=active?'#739845':color;c.fillRect(x-6,y+(active?0:-6),12,active?5:11);}
    c.fillStyle=active?'#52723a':color;c.textAlign='center';c.font='bold 13px monospace';c.fillText(s.id,x,y-25);c.font='12px monospace';const label=s.mode==='timed'?(active?timerRemaining(g,s.id).toFixed(1)+'s':s.duration+'s TIMER'):s.mode==='toggle'?(active?'ON ↔':'OFF ↔'):active?'SET':'PRESS';const labelWidth=c.measureText(label).width+8;c.fillStyle='#e4e7d8ee';c.fillRect(x-labelWidth/2,y+20,labelWidth,16);c.fillStyle=active?'#52723a':color;c.fillText(label,x,y+32);c.textAlign='left';
  }
  for(const gold of g.gold)if(!gold.taken){c.save();c.translate(gold.x,gold.y);if(gold.firstBonus){const pulse=.9+Math.sin(g.clock*5)*.1;c.fillStyle='rgba(66,205,219,.2)';c.beginPath();c.arc(0,0,10*pulse,0,Math.PI*2);c.fill();c.strokeStyle='#63dbe2';c.lineWidth=2;c.beginPath();c.arc(0,0,8*pulse,0,Math.PI*2);c.stroke();c.strokeStyle='#baf7f3';c.lineWidth=1.5;c.beginPath();c.moveTo(-9,0);c.lineTo(-6,0);c.moveTo(9,0);c.lineTo(6,0);c.moveTo(0,-9);c.lineTo(0,-6);c.moveTo(0,9);c.lineTo(0,6);c.stroke();}c.rotate(Math.PI/4);c.fillStyle=gold.firstBonus?'#ffe3a0':'#c69632';c.fillRect(-4,-4,8,8);c.fillStyle=gold.firstBonus?'#fff8d7':'#f3d77a';c.fillRect(-3,-3,3,3);c.restore();}
  const ex=g.level.exit.x*TILE,ey=g.level.exit.y*TILE,unlocked=g.exitUnlocked;
  c.fillStyle=unlocked?'#bdd7a1':'#d7c2ac';c.fillRect(ex-5,ey-6,40,42);c.fillStyle=unlocked?'#55773d':'#795545';c.fillRect(ex+2,ey-1,26,31);
  c.fillStyle=unlocked?'#a8d873':'#b99a7f';c.fillRect(ex+6,ey+3,18,27);
  if(unlocked){c.strokeStyle='#486435';c.lineWidth=2;c.beginPath();c.moveTo(ex+15,ey+24);c.lineTo(ex+15,ey+9);c.moveTo(ex+10,ey+14);c.lineTo(ex+15,ey+9);c.lineTo(ex+20,ey+14);c.stroke();}
  else {c.fillStyle='#684835';c.fillRect(ex+9,ey+12,12,10);c.strokeStyle='#684835';c.lineWidth=2;c.beginPath();c.arc(ex+15,ey+12,4,Math.PI,0);c.stroke();}
  c.fillStyle=unlocked?'#51643d':'#865941';c.font='bold 12px monospace';c.textAlign='center';c.fillText(unlocked?'EXIT':'LOCKED',ex+15,ey-12);c.textAlign='left';
  for(const s of g.stains){c.save();c.translate(s.x,s.y);c.rotate(s.angle);c.fillStyle=s.color;c.beginPath();c.ellipse(0,0,s.size*1.8,s.size*.65,0,0,Math.PI*2);c.fill();c.restore();}
  g.trail.forEach((t,i)=>{c.fillStyle=`rgba(110,132,86,${i*.014})`;c.fillRect(t.x-5,t.y-8,10,18);});
  if(!['dying','dead'].includes(g.status))drawNinja(c,g);
  if(g.ghost)drawHunter(c,g);
  for(const d of g.debris){
    c.save();c.translate(d.x,d.y);c.rotate(d.angle);c.globalAlpha=Math.min(1,d.life);c.strokeStyle='#32372f';c.fillStyle='#e9e0c5';c.lineWidth=2;
    if(d.kind==='head'){c.beginPath();c.arc(0,0,6,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#432c29';c.fillRect(-4,-2,3,3);c.fillRect(1,-2,3,3);c.fillRect(-2,3,4,2);c.fillStyle='#8a302d';c.fillRect(-4,-7,9,2);}
    else if(d.kind==='scarf'){c.fillStyle='#a5483e';c.fillRect(-d.length/2,-2,d.length,4);}
    else {c.strokeStyle='#923b32';c.lineWidth=5;c.beginPath();c.moveTo(0,-d.length/2);c.lineTo(0,d.length/2);c.stroke();c.strokeStyle='#eee5c8';c.lineWidth=3;c.stroke();if(d.kind==='ribcage'){c.lineWidth=1.5;for(let y=-4;y<=4;y+=4){c.beginPath();c.ellipse(0,y,5,2,0,0,Math.PI*2);c.stroke();}}}
    c.restore();
  }
  for(const b of g.blood){c.fillStyle=b.color;c.beginPath();c.arc(b.x,b.y,b.size,0,Math.PI*2);c.fill();}
  for(const q of g.particles){c.globalAlpha=Math.max(0,q.life/.6);c.fillStyle=q.color;c.fillRect(q.x,q.y,3,3);}c.globalAlpha=1;
  c.restore();
  if(g.effects.freeze>0){c.fillStyle='#75b8e014';c.fillRect(0,0,W,H);}
  if(g.flash>0&&!g.reducedMotion){c.fillStyle=`rgba(148,35,31,${g.flash*1.6})`;c.fillRect(0,0,W,H);}
}
function drawNinja(c,g){
  const p=g.player,skin=SKINS.find(s=>s.id===g.skin)||SKINS[0];c.save();c.translate(p.x+8,p.y+13);
  if(g.invulnerable>0)c.globalAlpha=Math.sin(g.last*.025)>0?.4:1;
  if(g.effects.shield>0){c.strokeStyle='#a68bd1';c.lineWidth=2;c.beginPath();c.arc(0,0,24,0,Math.PI*2);c.stroke();}
  if(g.effects.glider>0){c.fillStyle='#548977';c.beginPath();c.moveTo(-26,-21);c.quadraticCurveTo(0,-43,26,-21);c.closePath();c.fill();c.strokeStyle='#548977';c.beginPath();c.moveTo(-23,-21);c.lineTo(-4,0);c.moveTo(23,-21);c.lineTo(4,0);c.stroke();}
  if(g.effects.rocket>0){c.fillStyle='#ed9864';c.beginPath();c.moveTo(-7,10);c.lineTo(0,34+Math.random()*10);c.lineTo(7,10);c.fill();}
  c.strokeStyle=skin.outline;c.lineWidth=3.5;c.lineCap='round';
  const slide=p.sliding&&p.wall,s=slide?p.wall:p.face;
  const headX=slide?-s*2:0;
  c.fillStyle=skin.suit;c.beginPath();c.arc(headX,-8,6.5,0,Math.PI*2);c.fill();
  c.fillStyle=skin.scarf;c.fillRect(headX-6,-11,12,3);c.beginPath();c.moveTo(headX-s*5,-9);c.lineTo(headX-s*(14+Math.sin(g.last*.02)*3),-6);c.lineTo(headX-s*10,-11);c.fill();
  c.fillStyle=skin.eye;c.fillRect(headX+(s>0?2:-4),-10,2,2);
  c.beginPath();c.moveTo(headX,-2);c.lineTo(slide?-s*3:0,6);
  if(slide){
    // Both hands brace against the wall; bent knees and soles drag downward.
    const drag=Math.sin(g.last*.016)*1.3;
    c.moveTo(0,0);c.lineTo(s*3,-3);c.lineTo(s*8,-6+drag);
    c.moveTo(0,2);c.lineTo(s*3,4);c.lineTo(s*8,1+drag);
    c.moveTo(-s*3,6);c.lineTo(-s*5,10);c.lineTo(s*7,12+drag);
    c.moveTo(-s*2,6);c.lineTo(s*2,8);c.lineTo(s*8,8+drag);
  }else{
    const swing=p.ground?Math.sin(g.last*.022)*Math.min(Math.abs(p.vx)/45,5):4;
    c.moveTo(0,6);c.lineTo(-3-swing,10);c.lineTo(-5-swing,13);
    c.moveTo(0,6);c.lineTo(3+swing,10);c.lineTo(6+swing,12);
    c.moveTo(0,0);c.lineTo(-5,3+swing);c.lineTo(-8,1+swing);
    c.moveTo(0,0);c.lineTo(5,3-swing);c.lineTo(8,1-swing);
  }
  c.stroke();c.restore();
}
function drawHunter(c,g){const h=g.ghost;c.save();c.translate(h.x,h.y);c.globalAlpha=.88;c.shadowColor='#d49cff';c.shadowBlur=18;c.fillStyle='#ddbdff';c.beginPath();c.arc(0,0,13+Math.sin(g.clock*9)*2,0,Math.PI*2);c.fill();c.shadowBlur=0;c.fillStyle='#272039';c.fillRect(-6,-3,4,3);c.fillRect(3,-3,4,3);c.strokeStyle='#d49cff';c.lineWidth=3;c.beginPath();c.moveTo(-9,7);c.quadraticCurveTo(-18,18+Math.sin(g.clock*6)*4,-25,17);c.moveTo(8,7);c.quadraticCurveTo(17,15-Math.sin(g.clock*5)*4,23,19);c.stroke();c.restore();}
