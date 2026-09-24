// Alarm links let one circuit wake a whole group of familiar hazards.
export function validateAlarm(raw,ids){
 if(raw===undefined)return undefined;
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||!ids.has(raw.switchId)||typeof raw.on!=='boolean'||!Number.isFinite(raw.delay)||raw.delay<1||raw.delay>4)throw Error('Alarm links need an existing switch, an ON/OFF state, and a 1–4 second warning.');
 return {switchId:raw.switchId,on:raw.on,delay:raw.delay};
}
export function alarmState(g,h){
 if(!h.alarm)return 'ready';
 if(h.offSwitch&&g.activated.has(h.offSwitch)){h.alarmStart=null;return 'disabled';}
 const enabled=g.activated.has(h.alarm.switchId)===h.alarm.on;
 if(!enabled){h.alarmStart=null;return 'dormant';}
 if(h.alarmStart===null||h.alarmStart===undefined){h.alarmStart=g.clock;h.alarmActivations=(h.alarmActivations??0)+1;if(g.status==='playing')g.cb.sound('alarm');}
 return g.clock-h.alarmStart<h.alarm.delay?'arming':'ready';
}
export const alarmClock=(g,h,clock=g.clock)=>h.alarm?Math.max(0,clock-h.alarmStart-h.alarm.delay):clock;
export const alarmLabel=h=>h.alarm?'!'+h.alarm.switchId+(h.alarm.on?' ON':' OFF'):'';
export function alarmSummary(g){
 const groups=new Map();
 for(const h of [...g.devices,...g.sentries,...g.traps])if(h.alarm){const label=alarmLabel(h),remaining=h.state==='arming'?Math.max(0,h.alarm.delay-(g.clock-h.alarmStart)):0;
  const rank=h.state==='arming'?2:h.state==='dormant'||h.state==='disabled'?0:1,old=groups.get(label);
  if(!old||rank>old.rank||rank===old.rank&&remaining>old.remaining)groups.set(label,{label,rank,remaining});
 }
 return [...groups.values()].map(s=>`${s.label}: ${s.rank===2?s.remaining.toFixed(1)+'s':s.rank===1?'LIVE':'QUIET'}`).join(' · ');
}
export function drawAlarmLinks(c,g,editor=false){
 for(const h of [...g.devices,...g.sentries,...g.traps])if(h.alarm){
  const x=(h.tx??h.x)*30+15,y=(h.ty??h.y)*30+15,arming=h.state==='arming',live=!['dormant','disabled'].includes(h.state),color=arming?'#ca963f':live?'#be5c4f':'#899178';
  c.save();c.strokeStyle=color;c.lineWidth=1.5;c.setLineDash([4,3]);c.strokeRect(x-19,y-19,38,38);c.setLineDash([]);c.fillStyle=color;c.textAlign='center';c.font='bold 12px monospace';c.fillText(alarmLabel(h),x,y+32);
  if(arming){const progress=Math.min(1,(g.clock-h.alarmStart)/h.alarm.delay);c.fillRect(x-18,y+38,36*progress,3);}
  if(editor||g.mapOpen){const s=g.switches.find(s=>s.id===h.alarm.switchId);if(s){c.globalAlpha=.35;c.setLineDash([3,7]);c.beginPath();c.moveTo(s.x*30+15,s.y*30+15);c.lineTo(x,y);c.stroke();}}
  c.restore();
 }
}
