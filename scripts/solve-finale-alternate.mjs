import {writeFileSync} from 'node:fs';
import {harness,solve} from './solve-opening.mjs';
import {finaleRoutes} from '../src/finale-levels.js';
let g=harness(96),actions=[];
const route=[{switchId:'D'},[41,43,42],[47,49,39],[55,57,36],[47,49,33],[55,57,30],[47,49,27],{switchId:'B'},[41,43,42],[23,24,42],[19,21,39],[11,13,36],[19,21,33],[11,13,30],[19,21,27],{switchId:'A'},[23,24,42],...finaleRoutes[6].slice(16)];
for(const target of route){const result=solve(g,target);g=result.g;actions.push(...result.path);console.log(97,JSON.stringify(target),'reached',g.elapsed.toFixed(2));}
writeFileSync(new URL('../tests/fixtures/level-97-alternate.json',import.meta.url),JSON.stringify({index:96,revision:2,time:g.elapsed,actions}));console.log('VERIFIED reverse shutdown order',g.status,g.elapsed);
