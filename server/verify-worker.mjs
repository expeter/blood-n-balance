import {parentPort,workerData} from 'node:worker_threads';
import {Game} from '../src/engine.js';import {validateTape,TICK_RATE} from '../src/replay.js';
try{
 const {level,difficulty,seed,replay,assistance,maxHelperUses=1,initialEffects}=workerData;const {uses}=validateTape(replay);
 if(assistance==='itemFree'&&Object.keys(uses).length)throw Error('Helpers are not allowed in this ladder.');if(Object.values(uses).some(n=>n>maxHelperUses))throw Error('Assisted attempts allow one charge of each helper.');
 const g=Object.create(Game.prototype);g.keys=new Set();g.difficulty=difficulty;g.render=()=>{};g.burst=()=>{};g.recordReplay=false;g.die=cause=>{g.status='dead';g.deathCause=cause;};let result=null;g.cb={hud(){},sound(){},gold(){},switch(){},win:r=>{result=r;},dying(){},dead(){}};g.load(level,seed);if(initialEffects)g.effects={...initialEffects};g.start();let ticks=0;
 for(const action of replay.actions){g.keys.clear();if(action.dir)g.keys.add(action.dir>0?'ArrowRight':'ArrowLeft');for(let frame=0;frame<action.frames;frame++){if(g.status!=='playing')throw Error('Replay continues after its outcome.');if(action.clear)g.jumpBuffer=0;if(action.jump)g.jumpBuffer=.14;for(const id of action.helpers)if(!g.activate(id))throw Error('Invalid helper activation.');g.update(1/TICK_RATE);ticks++;}}
 if(g.status!=='won'||!result)throw Error('Replay does not finish this level.');parentPort.postMessage({ok:true,ticks,time:ticks/TICK_RATE,gold:result.gold,usedItems:result.usedItems,effects:{...g.effects}});
}catch(error){parentPort.postMessage({ok:false,error:error.message});}
