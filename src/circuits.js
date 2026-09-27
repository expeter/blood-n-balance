export function timerRemaining(g,id){return Math.max(0,(g.switchTimers[id]??g.clock)-g.clock);}
export function expireSwitches(g){
 for(const [id,until] of Object.entries(g.switchTimers))if(g.clock>=until){delete g.switchTimers[id];g.activated.delete(id);g.cb.sound('expire');}
}
export function conditionsMet(states,activated){return Object.entries(states??{}).every(([id,on])=>activated.has(id)===on);}
export function validateConditions(raw,ids,label){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length>8||!Object.entries(raw).every(([id,on])=>ids.has(id)&&typeof on==='boolean'))throw Error(`${label} must map existing switch letters to true or false.`);
 return {...raw};
}
export function gateOpen(g,gate){
 const wanted=gate.states?conditionsMet(gate.states,g.activated):g.activated.has(gate.switchId),p=g.player;
 const occupied=p.x<gate.x+gate.w&&p.x+p.w>gate.x&&p.y<gate.y+gate.h&&p.y+p.h>gate.y;
 // Only a previously open door can defer closure. Proposed movement into a
 // closed door must never open it simply because the collision box overlaps.
 gate.pendingClose=!wanted&&!!gate.open&&occupied;gate.open=wanted||gate.pendingClose;return gate.open;
}
export function updateSwitches(g){
 expireSwitches(g);
 const p=g.player;
 for(const s of g.switches){
  const distance=Math.hypot(p.x+8-(s.x*30+15),p.y+13-(s.y*30+15));
  if(distance>34)g.switchContacts.delete(s.id);
  if(distance>=25||g.switchContacts.has(s.id))continue;
  g.switchContacts.add(s.id);g.visited.add(s.id);
  if(s.mode==='timed'){g.switchTimers[s.id]=g.clock+s.duration;g.activated.add(s.id);}
  else if(s.mode==='toggle'&&g.activated.has(s.id))g.activated.delete(s.id);
  else if(!g.activated.has(s.id))g.activated.add(s.id);else continue;
  if(g.runStats)g.runStats.switches++;
  g.burst(s.x*30+15,s.y*30+15,g.activated.has(s.id)?'#e7bd65':'#8baac1',24);g.cb.sound('switch');g.cb.switch?.(s.id,g.exitUnlocked,g.activated.has(s.id),s.mode);
 }
 for(const gate of g.gates)gateOpen(g,gate);
}
export function conditionLabel(states){return Object.entries(states??{}).map(([id,on])=>id+(on?' ON':' OFF')).join(' + ');}
