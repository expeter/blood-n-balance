import {writeFileSync} from 'node:fs';
import {harness,solve} from './solve-opening.mjs';
import {timedRoutes} from '../src/timed-levels.js';
const recovery={
 59:[[52,54,17],[44,47,14],[40,41,42],[34,36,40],[34,35,37],{waitFor:1,at:0},{switchId:'B',refresh:true},{ride:1},{ride:1,at:1},{switchId:'C',refresh:true},[44,47,14],{ride:2},{ride:2,at:1},[54,55.5,8,false],null],
 55:[[44,46,26],[23,25,26],[17,19,26],[9,11,26],{switchId:'A',refresh:true},[17,20,26],[26,29,23],[32,35,20],{switchId:'B',refresh:true},[38,41,18],[48,51,21],[56,59,22],null],
 58:[[44,47,34],[34,37,34],[27,30,31],[34,37,28],{switchId:'B',refresh:true},[37,39,23],[44,47,25],[51,54,22],[45,48,19],{switchId:'C',refresh:true},[57,60,31],null],
};
const chosen=process.argv.slice(2).map(Number);
for(const index of chosen.length?chosen:[55,58,59]){
 let g=harness(index),actions=[];
 const step=t=>{const r=solve(g,t);g=r.g;actions.push(...r.path);console.log(index+1,JSON.stringify(t),g.elapsed.toFixed(2));};
 for(const t of timedRoutes[index-50]){step(t);if(t?.switchId==='D')break;}
 for(const s of g.switches.filter(s=>s.mode==='timed'))step({waitOff:s.id});
 const recoveryWaitEndedAt=g.elapsed;
 for(const t of recovery[index])step(t);
 if(g.status!=='won')throw Error('Recovery did not finish');
 writeFileSync(new URL(`../tests/fixtures/level-${index+1}-recovery.json`,import.meta.url),JSON.stringify({index,revision:2,recoveryWaitEndedAt,time:g.elapsed,actions}));
 console.log('RECOVERY VERIFIED',index+1);
}
