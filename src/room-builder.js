import {trapCells} from './traps.js';
// Turns explicit room blueprints into independent, serializable levels.
// This shares construction rules, never chooses a room's geometry or route.
export function buildRoom(r,index,revision=2){
  const [width,height]=r.size,cells=new Map();
  const rect=([x1,y1,x2,y2],type)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)cells.set(`${x},${y}`,{x,y,type});};
  rect([0,height-2,width-1,height-1],'solid');rect([0,0,width-1,0],'solid');rect([0,0,0,height-1],'solid');rect([width-1,0,width-1,height-1],'solid');
  r.blocks.forEach(b=>rect(b,'solid'));r.spikes?.forEach(b=>rect(b,'spike'));r.saws?.forEach(([x,y])=>cells.set(`${x},${y}`,{x,y,type:'drone'}));
  const gates=(r.gates??[]).map(([switchId,x,y,w,h,states])=>({switchId,x,y,w,h,...(states?{states:{...states}}:{})}));
  for(const g of gates)for(let y=g.y;y<g.y+g.h;y++)for(let x=g.x;x<g.x+g.w;x++)cells.delete(`${x},${y}`);
  const switches=r.switches.map(([id,x,y,mode,initial])=>({id,x,y,...(mode?{mode,...(mode==='toggle'?{initial:initial??false}:mode==='timed'?{duration:initial??10}:{})}:{})})),spawn={x:r.spawn[0],y:r.spawn[1]},exit={x:r.exit[0],y:r.exit[1]};
  const sentries=(r.sentries??[]).map(s=>({...s}));
  const devices=(r.devices??[]).map(d=>({...d}));
  const occupied=new Set([...cells.keys(),...switches.map(s=>`${s.x},${s.y}`),...sentries.map(d=>`${d.x},${d.y}`),...devices.map(d=>`${d.x},${d.y}`),`${spawn.x},${spawn.y}`,`${exit.x},${exit.y}`]);
  for(const g of gates)for(let y=g.y;y<g.y+g.h;y++)for(let x=g.x;x<g.x+g.w;x++)occupied.add(`${x},${y}`);
  const crumbles=(r.crumbles??[]).map(p=>({...p}));for(const p of crumbles)for(let x=p.x;x<p.x+p.w;x++)occupied.add(`${x},${p.y}`);
  const traps=(r.traps??[]).map(t=>({...t}));for(const cell of traps.flatMap(trapCells))occupied.add(`${cell.x},${cell.y}`);
  const coins=[];
  for(const t of cells.values())if(t.type==='solid'&&t.x>1&&t.x<width-2&&t.y>3&&t.y<height-2&&t.x%3===1){const y=t.y-2;if(!occupied.has(`${t.x},${y}`)&&!occupied.has(`${t.x},${y+1}`))coins.push({x:t.x,y});}
  for(const p of crumbles){const x=p.x+Math.floor(p.w/2),y=p.y-1;if(!occupied.has(`${x},${y}`)&&!coins.some(c=>c.x===x&&c.y===y))coins.push({x,y});}
  return {version:3,revision,index,chapter:Math.floor(index/10),name:r.name,width,height,time:r.time??160,skill:r.skill,lesson:r.lesson,spawn,exit,tiles:[...cells.values()],coins:coins.slice(0,80),switches,gates,exitRequires:r.exitRequires??switches.filter(s=>!['toggle','timed'].includes(s.mode)).map(s=>s.id),exitStates:{...(r.exitStates??{})},devices,crumbles,traps,sentries,platforms:(r.platforms??[]).map(p=>({...p})),droneSpeed:r.droneSpeed??.9};
}
export const laser=(x,y,dir,length,phase=0,offSwitch,period=4.6,on=1.4)=>({type:'laser',x,y,dir,length,phase,period,on,...(offSwitch?{offSwitch}:{})});

export const turret=(x,y,dir,phase=0,offSwitch,period=3.2,speed=240)=>({type:'turret',x,y,dir,phase,period,speed,...(offSwitch?{offSwitch}:{})});

export const platform=(x,y,toX,toY,w=4,period=6,phase=0)=>({x,y,toX,toY,w,period,phase});

export const crumble=(x,y,w=4,delay=1.2)=>({x,y,w,delay});

export const spikeTrap=(x,y,tx,ty,w=4,delay=1.2,offSwitch)=>({type:'spikes',x,y,tx,ty,w,delay,active:1.6,cooldown:2,...(offSwitch?{offSwitch}:{})});
export const dartTrap=(x,y,tx,ty,dir,delay=1.2,offSwitch)=>({type:'dart',x,y,tx,ty,dir,speed:250,delay,active:.6,cooldown:2,...(offSwitch?{offSwitch}:{})});

export const sentry=(x,y,offSwitch,range=18,lock=1.2,cooldown=1.5,speed=250)=>({x,y,range,lock,cooldown,speed,...(offSwitch?{offSwitch}:{})});

export const alarm=(hazard,switchId,on=true,delay=1.5)=>({...hazard,alarm:{switchId,on,delay}});
