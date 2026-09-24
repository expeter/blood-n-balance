import {writeFileSync} from 'node:fs';
import {harness,solve} from './solve-opening.mjs';
import {tripwireRoutes} from '../src/tripwire-levels.js';
// The ninth room explicitly allows either wing first. Verify the other order.
let g=harness(78),actions=[];
const route=[[38,41,38],[44,46,32],{trap:1},[51,54,26],{switchId:'B'},[39,41,38],[22,25,38],{trap:0},[10,12,29],[10,13,26],{switchId:'A'},[22,25,38],...tripwireRoutes[8].slice(13)];
for(const target of route){const result=solve(g,target);g=result.g;actions.push(...result.path);console.log(79,JSON.stringify(target),'reached',g.elapsed.toFixed(2));}
writeFileSync(new URL('../tests/fixtures/level-79-alternate.json',import.meta.url),JSON.stringify({index:78,revision:2,time:g.elapsed,actions}));
console.log('VERIFIED reverse branch order',g.status,g.elapsed);
