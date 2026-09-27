export const RULESET='bnb-physics-1';
export const TICK_RATE=120;
export const MAX_REPLAY_TICKS=40000;
export function createTape(){return {ruleset:RULESET,tickRate:TICK_RATE,ticks:0,actions:[],overflow:false};}
export function recordTick(tape,dir,jump,helpers=[],clear=false){if(tape.ticks>=MAX_REPLAY_TICKS){tape.overflow=true;return;}tape.ticks++;const previous=tape.actions.at(-1);if(previous&&previous.dir===dir&&previous.jump===jump&&!previous.helpers.length&&!helpers.length&&!previous.clear&&!clear)previous.frames++;else tape.actions.push({dir,jump,helpers:[...helpers],clear,frames:1});}
export function validateTape(raw){
 if(!raw||raw.ruleset!==RULESET||raw.tickRate!==TICK_RATE||raw.overflow||!Number.isSafeInteger(raw.ticks)||raw.ticks<1||raw.ticks>MAX_REPLAY_TICKS||!Array.isArray(raw.actions)||raw.actions.length>MAX_REPLAY_TICKS)throw Error('Invalid replay header.');
 let ticks=0;const uses={};for(const action of raw.actions){if(!action||![-1,0,1].includes(action.dir)||typeof action.jump!=='boolean'||(action.clear!==undefined&&typeof action.clear!=='boolean')||(action.clear&&action.frames!==1)||!Number.isSafeInteger(action.frames)||action.frames<1||!Array.isArray(action.helpers)||action.helpers.length>5||action.helpers.some(id=>!['freeze','jump','rocket','shield','glider'].includes(id))||(action.helpers.length&&action.frames!==1))throw Error('Invalid replay action.');ticks+=action.frames;if(ticks>MAX_REPLAY_TICKS)throw Error('Replay is too long.');for(const id of action.helpers)uses[id]=(uses[id]||0)+1;}
 if(ticks!==raw.ticks)throw Error('Replay length does not match its actions.');return {ticks,uses};
}
