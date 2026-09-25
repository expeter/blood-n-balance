// Earliest swept point/box intersection, including a point already inside.
export function segmentHit(x,y,ex,ey,box,padding=0){
 let enter=0,leave=1;
 for(const [start,delta,min,max] of [[x,ex-x,box.x-padding,box.x+box.w+padding],[y,ey-y,box.y-padding,box.y+box.h+padding]]){
  if(Math.abs(delta)<1e-9){if(start<min||start>max)return null;continue;}
  const a=(min-start)/delta,b=(max-start)/delta;enter=Math.max(enter,Math.min(a,b));leave=Math.min(leave,Math.max(a,b));if(enter>leave)return null;
 }
 return enter;
}
export function updateProjectiles(g,dt,harm){
 const survivors=[];
 for(const b of g.projectiles){
  if(b.projectile==='homing'&&harm&&g.status==='playing'&&dt>0){
   const dx=g.player.x+g.player.w/2-b.x,dy=g.player.y+g.player.h/2-b.y,wanted=Math.atan2(dy,dx),current=Math.atan2(b.vy,b.vx);
   const turn=Math.atan2(Math.sin(wanted-current),Math.cos(wanted-current)),angle=current+Math.max(-b.turnRate*dt,Math.min(b.turnRate*dt,turn)),speed=b.speed??Math.hypot(b.vx,b.vy);
   b.vx=Math.cos(angle)*speed;b.vy=Math.sin(angle)*speed;
  }
  const ex=b.x+b.vx*dt,ey=b.y+b.vy*dt;
  const region={x:Math.min(b.x,ex)-3,y:Math.min(b.y,ey)-3,w:Math.abs(ex-b.x)+6,h:Math.abs(ey-b.y)+6};
  let wall=Infinity;
  for(const s of g.nearSolids(region)){const t=segmentHit(b.x,b.y,ex,ey,s,3);if(t!==null)wall=Math.min(wall,t);}
  if(harm&&g.status==='playing'){
   const p=g.player,old=g.previousPlayer??p;
   // Relative motion catches the player crossing even a frozen bullet.
   const hit=segmentHit(b.x,b.y,ex-(p.x-old.x),ey-(p.y-old.y),old,3);
   if(hit!==null&&hit<wall){g.hurt('bullet',{x:b.x-15,y:b.y-15});continue;}
  }
  if(wall!==Infinity){g.burst(b.x+(ex-b.x)*wall,b.y+(ey-b.y)*wall,b.projectile==='homing'?'#f08b55':'#e2ad62',b.projectile==='homing'?10:3);g.cb.sound(b.projectile==='homing'?'rocket-impact':'impact');continue;}
  b.x=ex;b.y=ey;b.life-=dt;
  if(b.life>0&&b.x>0&&b.y>0&&b.x<g.worldW&&b.y<g.worldH)survivors.push(b);
 }
 g.projectiles=survivors;
}
