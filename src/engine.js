import {initSentries,updateSentries} from './sentries.js';
import {initTraps,updateTraps} from './traps.js';
import {initCrumbles,updateCrumbles} from './crumbles.js';
import {conditionsMet,gateOpen,updateSwitches,expireSwitches} from './circuits.js';
import {initPlatforms,movePlatforms,landOnPlatforms} from './platforms.js';
import {W,H,TILE,levelSize} from './levels.js';
import {ITEMS} from './state.js';
import {breakApart,splatter,updateEffects} from './effects.js';
import {initDevices,updateDevices} from './devices.js';
import {renderGame} from './renderer.js';
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const makeRandom=seed=>{let n=seed>>>0;return()=>{n=(n+0x6d2b79f5)|0;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};};
export class Game {
  constructor(canvas,callbacks){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.cb=callbacks;this.keys=new Set();this.last=0;this.status='ready';this.reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Render the logical 960×540 scene into a backing store sized for the
    // displayed canvas and the screen's pixel density. Without this, a normal
    // DPR-2 display stretches only 960×540 source pixels across twice as many
    // physical pixels, making every edge and sprite look soft.
    this.resizeCanvas=()=>{
      const rect=this.canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
      const dpr=window.devicePixelRatio||1;
      const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
      if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
      this.ctx.setTransform(width/W,0,0,height/H,0,0);this.render();
    };
    if('ResizeObserver' in window)new ResizeObserver(this.resizeCanvas).observe(this.canvas);
    else window.addEventListener('resize',this.resizeCanvas);
    this.resizeCanvas();
    window.addEventListener('keydown',e=>this.handleKeyDown(e));
    window.addEventListener('keyup',e=>{this.input(e.code,false);});
    const suspend=()=>{this.keys.clear();if(this.mapOpen){this.mapPrior='paused';this.closeMap();}if(this.status==='playing')this.cb.pause();};
    window.addEventListener('blur',suspend);document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});
    requestAnimationFrame(t=>this.frame(t));
  }
  load(level,seed=1,bankedGold=[]){
    this.level=level;const size=levelSize(level);this.worldW=size.width*TILE;this.worldH=size.height*TILE;
    this.player={x:level.spawn.x*TILE+7,y:level.spawn.y*TILE+3,w:16,h:26,vx:0,vy:0,ground:false,wall:0,face:1,sliding:false};
    this.solids=level.tiles.filter(t=>t.type==='solid').map(t=>({x:t.x*TILE,y:t.y*TILE,w:TILE,h:TILE}));
    this.solidGrid=new Map(this.solids.map(s=>[`${s.x/TILE},${s.y/TILE}`,s]));
    this.switches=(level.switches??[]).map(s=>({...s}));this.activated=new Set(this.switches.filter(s=>s.mode==='toggle'&&s.initial).map(s=>s.id));this.switchTimers={};this.visited=new Set();this.switchContacts=new Set();
    this.gates=(level.gates??[]).map(g=>({...g,x:g.x*TILE,y:g.y*TILE,w:g.w*TILE,h:g.h*TILE}));
    const previouslyBanked=new Set(bankedGold);this.gold=level.coins.map((p,index)=>({x:p.x*TILE+15,y:p.y*TILE+15,taken:false,firstBonus:!previouslyBanked.has(index)}));
    this.hazards=level.tiles.filter(t=>t.type!=='solid').map(t=>({...t,baseX:t.x*TILE,x:t.x*TILE,y:t.y*TILE,w:30,h:30}));
    this.elapsed=0;this.remaining=level.time;this.clock=0;this.collected=0;this.usedItems=false;this.effects={};
    this.trail=[];this.particles=[];this.blood=[];this.debris=[];this.stains=[];this.shake=0;this.flash=0;this.deathTime=0;
    this.keys.clear();this.coyote=0;this.jumpBuffer=0;this.wallGrace=0;this.wallSide=0;this.wallJumpLock=0;this.invulnerable=0;this.mapOpen=false;
    this.levelSeed=Number.isInteger(seed)?seed:1;this.retryWhenDead=false;this.ghost=null;if(this.difficulty==='nightmare'){const random=makeRandom(this.levelSeed^0x4e4d);const margin=50;this.ghost={seed:this.levelSeed,x:this.worldW/2,y:this.worldH/2,speed:155,route:Array.from({length:7},()=>({x:margin+random()*Math.max(1,this.worldW-margin*2),y:margin+random()*Math.max(1,this.worldH-margin*2)})),target:0};}
    this.status='ready';this.camera={x:Math.max(0,Math.min(this.worldW-W,this.player.x-W/2)),y:Math.max(0,Math.min(this.worldH-H,this.player.y-H*.55))};
    initSentries(this);initTraps(this);initCrumbles(this);initPlatforms(this);this.moveHazards();initDevices(this);this.cb.hud(this);this.render();
  }
  get exitUnlocked(){return (this.level.exitRequires??[]).every(id=>this.activated.has(id))&&conditionsMet(this.level.exitStates,this.activated);}
  gateOpen(gate){return gateOpen(this,gate);}
  nearSolids(box,includePlatforms=true){
    const result=[];
    for(let y=Math.floor(box.y/TILE);y<=Math.floor((box.y+box.h)/TILE);y++)for(let x=Math.floor(box.x/TILE);x<=Math.floor((box.x+box.w)/TILE);x++){
      const s=this.solidGrid.get(`${x},${y}`);if(s)result.push(s);
    }
    for(const g of this.gates)if(!this.gateOpen(g)&&overlap(box,g))result.push(g);
    if(includePlatforms)for(const s of [...(this.platforms??[]),...(this.crumbles??[]).filter(s=>!s.gone)])if(overlap(box,s))result.push(s);
    return result;
  }
  start(){this.status='playing';this.mapOpen=false;this.keys.clear();}
  handleKeyDown(e){
    if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||document.querySelector('dialog[open]')||this.canvas.closest('[hidden]'))return;
    const codes=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Enter','KeyA','KeyD','KeyW','KeyR','KeyP','KeyM','Escape','Digit1','Digit2','Digit3','Digit4','Digit5'];
    if(!codes.includes(e.code))return;e.preventDefault();this.cb.gesture?.();if(e.repeat)return;
    if(e.code==='Enter'){if(this.status==='dead')this.cb.retry();else if(this.status==='dying')this.retryWhenDead=true;return;}
    if(e.code==='KeyM'){this.cycleMap();return;}
    if(e.code==='KeyR'){this.cb.retry();return;}
    if(e.code==='KeyP'||e.code==='Escape'){if(this.mapOpen)this.closeMap();else this.cb.pause();return;}
    if(e.code.startsWith('Digit')){this.cb.item(ITEMS[+e.code.slice(-1)-1]?.id);return;}
    this.input(e.code,true);
  }
  togglePause(){if(this.status==='playing'){this.status='paused';this.keys.clear();}else if(this.status==='paused')this.status='playing';return this.status;}
  cycleMap(){
    if(!['playing','paused','ready'].includes(this.status))return;
    if(this.mapOpen){this.minimapVisible=false;this.closeMap();this.cb.mapMode?.(false);}
    else if(this.minimapVisible===false){this.minimapVisible=true;this.cb.mapMode?.(true);}
    else this.openMap();
    this.render();
  }
  openMap(){if(this.mapOpen||!['playing','paused','ready'].includes(this.status))return;this.mapPrior=this.status;this.status='paused';this.mapOpen=true;this.keys.clear();this.cb.map?.(true);}
  closeMap(){if(!this.mapOpen)return;this.mapOpen=false;this.status=this.mapPrior;this.keys.clear();this.cb.map?.(false);}
  activate(id){if(this.status!=='playing')return false;const item=ITEMS.find(i=>i.id===id);if(!item||this.effects[id]>0)return false;this.effects[id]=item.duration;this.usedItems=true;this.cb.sound('power');this.burst(this.player.x+8,this.player.y+12,item.color,16);return true;}
  input(code,down){if(down){this.keys.add(code);if(['Space','ArrowUp','KeyW'].includes(code))this.jumpBuffer=.14;}else this.keys.delete(code);}
  burst(x,y,color,count=12){for(let i=0;i<count;i++)this.particles.push({x,y,vx:(Math.random()-.5)*180,vy:(Math.random()-.6)*180,life:.6,color});}
  splatter(x,y,count,direction){splatter(this,x,y,count,direction);}
  die(cause='fall',source){
    if(this.status!=='playing')return;
    this.status='dying';this.keys.clear();this.trail=[];breakApart(this,cause,source);this.cb.sound('death');this.cb.dying?.(cause);
  }
  hurt(cause,source){if(this.status!=='playing'||this.invulnerable>0)return;if(this.effects.shield>0){this.effects.shield=0;this.invulnerable=1.5;this.burst(this.player.x,this.player.y,'#ac88ec',20);}else this.die(cause,source);}
  update(dt){
    if(this.status==='paused')return;
    updateEffects(this,dt);
    if(this.status==='dying'||this.status==='dead'){
      this.clock+=dt;expireSwitches(this);updateCrumbles(this);movePlatforms(this,false);this.moveHazards();updateDevices(this,false);updateTraps(this,false);updateSentries(this,false);
      if(this.status==='dying'&&(this.deathTime+=dt)>=1.6){this.status='dead';if(this.retryWhenDead){this.retryWhenDead=false;this.cb.retry();}else this.cb.dead();}
      return;
    }
    if(this.status!=='playing')return;
    const p=this.player;this.previousPlayer={...p};this.elapsed+=dt;const frozen=this.effects.freeze>0;
    if(!frozen){this.remaining-=dt;this.clock+=dt*(this.difficulty==='easy'?.85:this.difficulty==='hard'?1.15:1);}if(this.remaining<=0){this.die('timeout');return;}
    expireSwitches(this);updateCrumbles(this);movePlatforms(this);
    for(const key in this.effects)this.effects[key]=Math.max(0,this.effects[key]-dt);
    this.invulnerable=Math.max(0,this.invulnerable-dt);this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
    this.coyote=p.ground?.1:Math.max(0,this.coyote-dt);this.wallJumpLock=Math.max(0,this.wallJumpLock-dt);
    // Contact memory lets an away-direction input precede Jump by 140ms.
    // It is consumed on takeoff, so this never grants an airborne double jump.
    if(p.wall&&!p.ground&&this.wallJumpLock===0){this.wallSide=p.wall;this.wallGrace=.14;}
    else this.wallGrace=Math.max(0,this.wallGrace-dt);
    const dir=(this.keys.has('ArrowRight')||this.keys.has('KeyD')?1:0)-(this.keys.has('ArrowLeft')||this.keys.has('KeyA')?1:0);
    if(dir)p.face=dir;
    const steering=this.wallJumpLock>0&&dir===this.wallSide?.12:1;
    p.vx+=dir*1700*dt*steering;
    p.vx*=Math.pow(this.wallJumpLock>0?.99:dir?.94:.83,dt*60);
    const cap=this.wallJumpLock>0?340:265;p.vx=Math.max(-cap,Math.min(cap,p.vx));
    if(this.jumpBuffer>0&&(this.coyote>0||this.wallGrace>0)){
      const wallJump=this.coyote<=0&&this.wallGrace>0;
      p.vy=this.effects.jump>0?-690:this.difficulty==='easy'?-590:-560;
      if(wallJump){p.vx=-this.wallSide*330;p.face=-this.wallSide;this.wallJumpLock=.12;this.burst(p.x+(this.wallSide>0?p.w:0),p.y+18,'#a4ad91',7);}
      this.jumpBuffer=0;this.coyote=0;this.wallGrace=0;p.ground=false;p.wall=0;this.cb.sound('jump');
    }
    p.vy=Math.min(930,p.vy+1450*dt);
    if(this.effects.rocket>0){p.vy=-430;p.vx=dir*350;}
    if(this.effects.glider>0&&p.vy>75)p.vy=75;
    p.sliding=!!(p.wall&&!p.ground&&p.vy>0&&dir!==-p.wall&&this.wallJumpLock===0);
    if(p.sliding){p.vy=Math.min(p.vy,110);if(Math.random()<dt*22)this.particles.push({x:p.x+(p.wall>0?p.w:0),y:p.y+22,vx:-p.wall*(20+Math.random()*30),vy:25,life:.25,color:'#f1bd77'});}
    p.x+=p.vx*dt;
    for(const s of this.nearSolids(p,false))if(overlap(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w;p.vx=0;}
    p.x=Math.max(1,Math.min(this.worldW-p.w-1,p.x));
    p.y+=p.vy*dt;p.ground=false;
    for(const s of this.nearSolids(p,false))if(overlap(p,s)){if(p.vy>0){p.y=s.y-p.h;p.ground=true;}else if(p.vy<0)p.y=s.y+s.h;p.vy=0;}
    landOnPlatforms(this);
    if(p.y<0){p.y=0;p.vy=Math.max(0,p.vy);}if(p.y>this.worldH){this.die('fall');return;}
    // Detect a wall by proximity, even when no inward key is being held.
    p.wall=0;for(const s of this.nearSolids({x:p.x-2,y:p.y+2,w:p.w+4,h:p.h-4},false)){
      if(p.y+2<s.y+s.h&&p.y+p.h-2>s.y){if(Math.abs(p.x+p.w-s.x)<=2)p.wall=1;else if(Math.abs(p.x-(s.x+s.w))<=2)p.wall=-1;}
    }
    if(p.ground)p.sliding=false;
    updateSwitches(this);
    for(const [coinIndex,g] of this.gold.entries())if(!g.taken&&Math.hypot(p.x+8-g.x,p.y+13-g.y)<24){g.taken=true;this.collected++;this.burst(g.x,g.y,'#d5a43b',8);this.cb.sound('gold');this.cb.gold?.(coinIndex);}
    this.moveHazards();
    for(const h of this.hazards){
      const box=h.type==='spike'?{x:h.x+5,y:h.y+7,w:20,h:23}:{x:h.x+3,y:h.y+3,w:24,h:24};
      if(this.invulnerable===0&&overlap(p,box)){
        if(this.effects.shield>0){this.effects.shield=0;this.invulnerable=1.5;this.burst(p.x,p.y,'#ac88ec',20);}
        else {this.die(h.type==='drone'?'saw':'spikes',h);return;}
      }
    }
    updateDevices(this);updateTraps(this);updateSentries(this);if(this.status!=='playing')return;if(this.ghost&&this.updateGhost(dt))return;
    const exit={x:this.level.exit.x*TILE+2,y:this.level.exit.y*TILE,w:26,h:30};
    if(this.exitUnlocked&&overlap(p,exit)){this.status='won';this.cb.sound('win');this.burst(exit.x+13,exit.y+15,'#789d41',36);this.cb.win({time:this.elapsed,gold:this.collected,goldIds:this.gold.flatMap((coin,index)=>coin.taken?[index]:[]),usedItems:this.usedItems});}
    this.trail.push({x:p.x+8,y:p.y+15});if(this.trail.length>10)this.trail.shift();
    const blend=1-Math.exp(-dt*9);this.camera.x+=(Math.max(0,Math.min(this.worldW-W,p.x-W/2+p.vx*.2))-this.camera.x)*blend;
    this.camera.y+=(Math.max(0,Math.min(this.worldH-H,p.y-H*.52))-this.camera.y)*blend;
  }
  moveHazards(){for(const h of this.hazards)if(h.type==='drone')h.x=h.baseX+Math.sin(this.clock*(this.level.droneSpeed||.8)+h.baseX)*47;}
  updateGhost(dt){const gh=this.ghost,point=gh.route[gh.target],dx=point.x-gh.x,dy=point.y-gh.y,distance=Math.hypot(dx,dy)||1,step=gh.speed*dt;if(distance<=step+4)gh.target=(gh.target+1)%gh.route.length;else{gh.x+=dx/distance*step;gh.y+=dy/distance*step;}if(Math.hypot(this.player.x+8-gh.x,this.player.y+13-gh.y)<23){this.die('ghost',gh);return true;}return false;}
  frame(t){const dt=Math.min((t-this.last)/1000||0,.04);this.last=t;if(this.level){for(let i=0;i<3;i++)this.update(dt/3);this.render();if(t-(this.lastHud||0)>100){this.cb.hud(this);this.lastHud=t;}}requestAnimationFrame(t=>this.frame(t));}
  render(){renderGame(this);if(this.level)this.cb.presentation?.(this);}
}
