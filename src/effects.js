// Physical debris and surface stains are intentionally independent of player collision.
export function breakApart(game,cause,source) {
  const p=game.player,x=p.x+8,y=p.y+12;
  const saw=cause==='saw',away=source?Math.sign(x-(source.x+15))||p.face:-p.face;
  game.deathCause=cause;game.deathTime=0;game.shake=saw?14:10;game.flash=.16;
  const pieces=[['head',0,-10,6],['ribcage',0,1,11],['bone',-6,0,10],['bone',6,0,10],['bone',-4,10,12],['bone',4,10,12],['scarf',-9,-8,13]];
  game.debris=pieces.map(([kind,dx,dy,length],i)=>({kind,x:x+dx,y:y+dy,vx:p.vx*.45+away*100+(Math.random()-.5)*(saw?550:320),vy:-180-Math.random()*350+(i>3?110:0),angle:Math.random()*6.28,spin:(Math.random()-.5)*22,length,life:5,shredded:false}));
  game.splatter(x,y,saw?100:65,away);
}
export function splatter(game,x,y,count,direction=0) {
  for(let i=0;i<count;i++) {
    const angle=Math.random()*Math.PI*2,speed=70+Math.random()*430;
    game.blood.push({x,y,vx:Math.cos(angle)*speed+direction*90,vy:Math.sin(angle)*speed-130,size:1+Math.random()*3,life:2+Math.random(),color:['#812d31','#ac3536','#bc4340','#542729'][i%4]});
  }
}
export function updateEffects(game,dt) {
  for(const p of game.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=200*dt;p.life-=dt;}
  game.particles=game.particles.filter(p=>p.life>0);
  game.shake=Math.max(0,game.shake-dt*17);game.flash=Math.max(0,game.flash-dt);
  for(const b of game.blood){
    b.life-=dt;b.vy+=950*dt;const oldX=b.x,oldY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;
    const hit=game.nearSolids({x:b.x-2,y:b.y-2,w:4,h:4}).find(s=>b.x>=s.x&&b.x<=s.x+s.w&&b.y>=s.y&&b.y<=s.y+s.h);
    if(hit){let nx=b.x,ny=b.y,angle=0;
      if(oldY<hit.y){ny=hit.y-1;}else if(oldY>hit.y+hit.h){ny=hit.y+hit.h+1;}else {nx=oldX<hit.x?hit.x-1:hit.x+hit.w+1;angle=Math.PI/2;}
      game.stains.push({x:nx,y:ny,size:b.size*(1.2+Math.random()),angle,color:b.color});b.life=0;
    }
  }
  game.blood=game.blood.filter(b=>b.life>0&&b.y<game.worldH+50);
  if(game.stains.length>350)game.stains.splice(0,game.stains.length-350);
  for(const d of game.debris){
    d.life-=dt;d.vy+=1000*dt;d.angle+=d.spin*dt;
    const before={x:d.x,y:d.y};d.x+=d.vx*dt;d.y+=d.vy*dt;
    for(const s of game.nearSolids({x:d.x-4,y:d.y-4,w:8,h:8}))if(d.x+4>s.x&&d.x-4<s.x+s.w&&d.y+4>s.y&&d.y-4<s.y+s.h){
      if(before.y<=s.y){d.y=s.y-4;d.vy=-Math.abs(d.vy)*.28;d.vx*=.69;d.spin*=.5;}else if(before.y>=s.y+s.h){d.y=s.y+s.h+4;d.vy=Math.abs(d.vy)*.3;}else{d.x=before.x;d.vx*=-.45;d.spin*=-.6;}break;
    }
    if(!d.shredded&&game.hazards.some(h=>h.type==='drone'&&Math.hypot(h.x+15-d.x,h.y+15-d.y)<22)){
      d.shredded=true;d.vx+=(Math.random()-.5)*500;d.vy=-220;d.spin*=2;game.splatter(d.x,d.y,14);game.shake=Math.max(game.shake,5);
    }
  }
  game.debris=game.debris.filter(d=>d.life>0&&d.y<game.worldH+100);
}
