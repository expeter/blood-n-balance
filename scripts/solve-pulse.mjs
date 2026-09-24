import {writeFileSync} from 'node:fs';
import {harness,solve} from './solve-opening.mjs';
import {pulseRoutes} from '../src/pulse-levels.js';
const chosen=process.argv.slice(2).map(Number);
for(const index of chosen.length?chosen:Array.from({length:10},(_,i)=>i+10)){
 let g=harness(index),actions=[];
 for(const target of pulseRoutes[index-10]){const result=solve(g,target);g=result.g;actions.push(...result.path);console.log(index+1,JSON.stringify(target),'reached',g.elapsed.toFixed(2));}
 const replay={index,revision:2,time:g.elapsed,actions};
 writeFileSync(new URL(`../tests/fixtures/level-${String(index+1).padStart(2,'0')}.json`,import.meta.url),JSON.stringify(replay));
 console.log('VERIFIED',index+1,g.level.name,g.elapsed.toFixed(2));
}
