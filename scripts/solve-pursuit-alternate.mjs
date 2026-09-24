import {writeFileSync} from 'node:fs';
import {harness,solve} from './solve-opening.mjs';
import {pursuitRoutes} from '../src/pursuit-levels.js';
let g=harness(88),actions=[];
const route=[[39,41,38],[45,47,32],[53,55,29],[45,47,26],[53,55,24],{switchId:'B'},[39,41,38],[22,24,38],[17,19,32],[9,11,29],[17,19,26],[9,11,24],{switchId:'A'},[22,24,38],...pursuitRoutes[8].slice(14)];
for(const target of route){const result=solve(g,target);g=result.g;actions.push(...result.path);console.log(89,JSON.stringify(target),'reached',g.elapsed.toFixed(2));}
writeFileSync(new URL('../tests/fixtures/level-89-alternate.json',import.meta.url),JSON.stringify({index:88,revision:2,time:g.elapsed,actions}));console.log('VERIFIED reverse wing order',g.status,g.elapsed);
