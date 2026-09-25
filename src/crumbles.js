export function validateCrumbles(raw,width,height){
 if(!Array.isArray(raw)||raw.length>128)throw Error('Use at most 128 crumbling decks.');
 return raw.map(p=>{
  if(!p||![p.x,p.y,p.w].every(Number.isInteger)||p.w<1||p.w>8||p.x<0||p.x+p.w>width||p.y<1||p.y>=height)throw Error('Crumbling decks must fit inside the room and be 1–8 tiles wide.');
  if(!Number.isFinite(p.delay)||p.delay<.4||p.delay>3)throw Error('Collapse delay must be 0.4–3 seconds.');
  return {x:p.x,y:p.y,w:p.w,delay:p.delay};
 });
}
export const CRUMBLE_RESPAWN=3.5;
export function initCrumbles(g){g.crumbleRevision=0;g.crumbles=(g.level.crumbles??[]).map((s,id)=>({...s,x:s.x*30,y:s.y*30,oldY:s.y*30,w:s.w*30,h:12,id,crumble:true,startedAt:null,respawnAt:null,gone:false}));}
export function updateCrumbles(g){
 for(const s of g.crumbles){
  if(s.gone){if(s.respawnAt!==null&&g.clock>=s.respawnAt){const p=g.player,occupied=g.status==='playing'&&p&&p.x<s.x+s.w&&p.x+p.w>s.x&&p.y<s.y+s.h&&p.y+p.h>s.y;if(occupied){s.respawnAt=g.clock+.3;continue;}s.gone=false;s.startedAt=null;s.respawnAt=null;g.crumbleRevision++;g.burst(s.x+s.w/2,s.y+5,'#70c9ae',8);g.cb.sound('rebuild');}continue;}
  if(s.startedAt!==null&&g.clock-s.startedAt>=s.delay){s.gone=true;s.respawnAt=['easy','medium'].includes(g.difficulty)?g.clock+CRUMBLE_RESPAWN:null;g.crumbleRevision++;g.burst(s.x+s.w/2,s.y+5,'#b78758',12);g.cb.sound('crumble');}
 }
}
export function drawCrumbles(c,g){
 for(const s of g.crumbles){
  if(s.gone){c.strokeStyle=s.respawnAt!==null?'#70c9ae80':'#a9855b50';c.lineWidth=1;c.setLineDash([3,5]);c.strokeRect(s.x,s.y,s.w,10);c.setLineDash([]);if(s.respawnAt!==null){const remaining=Math.max(0,s.respawnAt-g.clock);c.fillStyle='#70c9ae';c.fillRect(s.x,s.y-4,s.w*(1-remaining/CRUMBLE_RESPAWN),2);}continue;}
  const progress=s.startedAt===null?0:Math.min(1,(g.clock-s.startedAt)/s.delay);
  c.fillStyle=progress>.7?'#b46a48':'#9e835d';c.fillRect(s.x,s.y,s.w,12);c.fillStyle='#e7c48c';c.fillRect(s.x,s.y,s.w,3);
  c.strokeStyle='#4d4736';c.lineWidth=1.5;
  for(let x=s.x+10;x<s.x+s.w;x+=24){c.beginPath();c.moveTo(x,s.y+2);c.lineTo(x-4,s.y+6);c.lineTo(x+2,s.y+9);if(progress>.25)c.lineTo(x-2,s.y+12);c.stroke();}
  if(progress){c.fillStyle='#edb977';c.fillRect(s.x,s.y-4,s.w*(1-progress),2);}
 }
}
