import {W,H,TILE} from './levels.js';

// This canvas lives in the header, never in the gameplay rendering surface.
export function renderMinimap(g,canvas){
  if(!g.level)return;
  const rect=canvas.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  const width=168,height=90,dpr=globalThis.devicePixelRatio||1;
  const pixelWidth=Math.max(1,Math.round(rect.width*dpr)),pixelHeight=Math.max(1,Math.round(rect.height*dpr));
  if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight;}
  const c=canvas.getContext('2d');
  c.setTransform(pixelWidth/width,0,0,pixelHeight/height,0,0);
  c.clearRect(0,0,width,height);c.fillStyle='#151b26';c.fillRect(0,0,width,height);
  const scale=Math.min((width-12)/g.worldW,(height-12)/g.worldH);
  c.save();c.translate((width-g.worldW*scale)/2,(height-g.worldH*scale)/2);c.scale(scale,scale);
  c.fillStyle='#859174';for(const s of g.solids)c.fillRect(s.x,s.y,s.w,s.h);
  for(const gate of g.gates)if(!g.gateOpen(gate)){c.fillStyle='#d99759';c.fillRect(gate.x,gate.y,gate.w,gate.h);}
  for(const s of g.switches){c.fillStyle=g.activated.has(s.id)?'#c5ed85':'#ffd378';c.fillRect(s.x*TILE-6,s.y*TILE-6,42,42);}
  for(const s of g.sentries){c.fillStyle=s.state==='disabled'?'#8caa66':'#ad75a4';c.fillRect(s.x*TILE,s.y*TILE,TILE,TILE);}
  for(const t of g.traps){c.fillStyle=t.state==='active'?'#f3654e':'#bc965d';c.fillRect(t.tx*TILE,t.ty*TILE,(t.w??1)*TILE,20);}
  for(const s of g.crumbles)if(!s.gone){c.fillStyle='#c8a46e';c.fillRect(s.x,s.y,s.w,14);}
  for(const s of g.platforms){c.fillStyle='#8bd7bc';c.fillRect(s.x,s.y,s.w,14);}
  for(const d of g.devices){c.fillStyle=d.state==='disabled'?'#92b677':'#e2836b';c.fillRect(d.x*TILE-2,d.y*TILE-2,34,34);}
  c.strokeStyle='#aeb7ff';c.lineWidth=1/scale;c.strokeRect(g.camera.x,g.camera.y,Math.min(W,g.worldW),Math.min(H,g.worldH));
  const ex=(g.level.exit.x+.5)*TILE,ey=(g.level.exit.y+.5)*TILE;
  c.fillStyle=g.exitUnlocked?'#c5ed85':'#f29b84';c.fillRect(ex-2.5/scale,ey-3/scale,5/scale,6/scale);
  c.strokeStyle='#151b26';c.lineWidth=1/scale;c.strokeRect(ex-2.5/scale,ey-3/scale,5/scale,6/scale);
  c.fillStyle='#fff';c.beginPath();c.arc(g.player.x+g.player.w/2,g.player.y+g.player.h/2,2.5/scale,0,Math.PI*2);c.fill();c.stroke();
  c.restore();
}
