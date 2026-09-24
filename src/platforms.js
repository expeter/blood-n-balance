export function platformPosition(p,clock){
 const t=((clock+p.phase)%p.period)/p.period,q=t<.1?0:t<.5?(t-.1)/.4:t<.6?1:(1-t)/.4;
 return {x:(p.x+(p.toX-p.x)*q)*30,y:(p.y+(p.toY-p.y)*q)*30};
}
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function validatePlatforms(raw,width,height,tiles,gates){
 if(!Array.isArray(raw)||raw.length>24)throw Error('Use at most 24 moving platforms.');
 return raw.map(p=>{
  if(!p||![p.x,p.y,p.toX,p.toY,p.w].every(Number.isInteger)||p.w<2||p.w>8)throw Error('Platforms need integer endpoints and a width of 2–8 tiles.');
  if(p.x<0||p.toX<0||p.x+p.w>width||p.toX+p.w>width||p.y<2||p.toY<2||p.y>=height||p.toY>=height)throw Error('Platform paths must fit inside the room with headroom.');
  if((p.x===p.toX)===(p.y===p.toY))throw Error('Platform paths must be horizontal or vertical, with distinct endpoints.');
  if(!Number.isFinite(p.period)||p.period<2||p.period>20||!Number.isFinite(p.phase)||p.phase<0||p.phase>=p.period)throw Error('Platform cycle must be 2–20 seconds with a phase inside the cycle.');
  if((Math.abs(p.x-p.toX)+Math.abs(p.y-p.toY))*75/p.period>200)throw Error('Platform speed must not exceed 200 pixels per second.');
  const corridor={x:Math.min(p.x,p.toX),y:Math.min(p.y,p.toY)-2,w:Math.abs(p.toX-p.x)+p.w,h:Math.abs(p.toY-p.y)+3};
  const cover=[...tiles.filter(t=>t.type==='solid').map(t=>({...t,w:1,h:1})),...gates];
  if(cover.some(t=>overlap(corridor,t)))throw Error('Keep the platform rail and two tiles of headroom clear of walls and gates.');
  return {x:p.x,y:p.y,toX:p.toX,toY:p.toY,w:p.w,period:p.period,phase:p.phase};
 });
}
export function initPlatforms(g){g.platforms=(g.level.platforms??[]).map((path,id)=>{const p=platformPosition(path,0);return {...p,oldX:p.x,oldY:p.y,w:path.w*30,h:12,path,id};});}
export function movePlatforms(g,carry=true){
 const p=g.player;
 for(const s of g.platforms){
  s.oldX=s.x;s.oldY=s.y;Object.assign(s,platformPosition(s.path,g.clock));
 }
 if(!carry)return;
 for(const s of g.platforms){
  if(!p.ground||Math.abs(p.y+p.h-s.oldY)>1||p.x+p.w<=s.oldX||p.x>=s.oldX+s.w)continue;
  const dx=s.x-s.oldX,dy=s.y-s.oldY;p.x+=dx;
  for(const wall of g.nearSolids(p,false))if(overlap(p,wall))p.x=dx>0?wall.x-p.w:wall.x+wall.w;
  p.y+=dy;
  for(const wall of g.nearSolids(p,false))if(overlap(p,wall)){p.y=dy>0?wall.y-p.h:wall.y+wall.h;p.ground=false;}
  break;
 }
}
export function landOnPlatforms(g){
 const p=g.player;if(p.vy<0)return;
 const oldFeet=(g.previousPlayer??p).y+p.h;
 for(const s of [...g.platforms,...g.crumbles.filter(s=>!s.gone)]){
  if(p.x+p.w<=s.x||p.x>=s.x+s.w||oldFeet>s.oldY+1||p.y+p.h<s.y)continue;
  const candidate={...p,y:s.y-p.h};
  if(g.nearSolids(candidate,false).some(w=>overlap(candidate,w)))continue;
  p.y=candidate.y;p.vy=0;p.ground=true;if(s.crumble&&s.startedAt===null){s.startedAt=g.clock;g.cb.sound('crack');}
 }
}
export function drawPlatforms(c,g){
 for(const s of g.platforms){const p=s.path;c.strokeStyle='#8b9d9580';c.lineWidth=2;c.setLineDash([4,6]);c.beginPath();c.moveTo((p.x+p.w/2)*30,p.y*30+6);c.lineTo((p.toX+p.w/2)*30,p.toY*30+6);c.stroke();c.setLineDash([]);
  for(const [x,y] of [[p.x,p.y],[p.toX,p.toY]]){c.fillStyle='#81938b';c.beginPath();c.arc((x+p.w/2)*30,y*30+6,4,0,Math.PI*2);c.fill();}
  c.fillStyle='#3c6866';c.fillRect(s.x,s.y,s.w,s.h);c.fillStyle='#a4d7bf';c.fillRect(s.x,s.y,s.w,3);c.fillStyle='#203f3d';for(let x=s.x+8;x<s.x+s.w;x+=15)c.fillRect(x,s.y+6,7,3);
 }
}
