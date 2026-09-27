import {IS_KIDS,presentLevel,KIDS_CHAPTERS,kidsText} from './edition.js';
import {finaleLevel} from './finale-levels.js';
import {pursuitLevel} from './pursuit-levels.js';
import {validateSentries} from './sentries.js';
import {tripwireLevel} from './tripwire-levels.js';
import {validateTraps,trapCells} from './traps.js';
import {unstableLevel} from './unstable-levels.js';
import {validateCrumbles} from './crumbles.js';
import {timedLevel} from './timed-levels.js';
import {relayLevel} from './relay-levels.js';
import {validateConditions} from './circuits.js';
import {undertowLevel} from './undertow-levels.js';
import {validatePlatforms} from './platforms.js';
import {crossfireLevel} from './crossfire-levels.js';
import {pulseLevel} from './pulse-levels.js';
import {validateDevices} from './devices.js';
import {openingLevel} from './opening-levels.js';
export const W = 960, H = 540, TILE = 30;
function rawCampaignLevel(index) {
  if (!Number.isInteger(index) || index < 0 || index > 98) throw new RangeError('Campaign stage must be between 0 and 98.');
  if (index < 10) return openingLevel(index);
  if (index < 20) return pulseLevel(index);
  if (index < 30) return crossfireLevel(index);
  if (index < 40) return undertowLevel(index);
  if (index < 50) return relayLevel(index);
  if (index < 60) return timedLevel(index);
  if (index < 70) return unstableLevel(index);
  if (index < 80) return tripwireLevel(index);
  if (index < 90) return pursuitLevel(index);
  return finaleLevel(index);
}
export const campaignLevel=index=>presentLevel({...rawCampaignLevel(index),revision:campaignRevision(index)});
export const campaignRevision = index => (index < 10 ? 3 : 2)+((index===98||(index+1)%10===0)?1:0);

export const SECTORS = [
  {name:'The machine',mechanic:'Switch circuits & traversal puzzles',detail:'Ten large chambers with locked exits, connected gates, return routes, wall-jump shafts, saws, and dangerous shortcuts. Read the map before choosing your route.'},
  {name:'Pulse',mechanic:'Cycled lasers',detail:'Read a warning flash, cross during the off beat, then chain staggered beams with safe waiting spots.'},
  {name:'Crossfire',mechanic:'Turrets & projectiles',detail:'Learn a visible firing cadence, use solid cover, then cross overlapping firing lanes.'},
  {name:'Undertow',mechanic:'Moving platforms',detail:'Ride a safe shuttle first; later transfer between lifts and moving platforms over hazards.'},
  {name:'Cause & effect',mechanic:'Multi-state circuits',detail:'Build on the opening switches with reversible relays and gates that require a combination of states. Change the room, then find a new return route.'},
  {name:'Borrowed time',mechanic:'Timed switches',detail:'Open a timed door, practice the route, then chain short races between safe reset points.'},
  {name:'Unstable',mechanic:'Crumbling platforms',detail:'Cracks warn before a platform collapses. Progress from single hops to routes that cannot be retraced.'},
  {name:'Tripwire',mechanic:'Triggered traps',detail:'Pressure plates telegraph a delayed spike or dart burst. Bait the trap, retreat, then pass through.'},
  {name:'Pursuit',mechanic:'Tracking sentries',detail:'A visible lock-on gives time to move. Break line of sight, then combine cover with moving terrain.'},
  {name:'The last nine',mechanic:'System overload',detail:'A new alarm links existing hazards: a switch visibly changes their patterns. Nine authored finales test combinations, never unseen rules.'},
].map((sector,i)=>({...sector,...(IS_KIDS?{name:KIDS_CHAPTERS[i],mechanic:kidsText(sector.mechanic),detail:kidsText(sector.detail)}:{}),start:i*10+1,end:Math.min(99,i*10+10),implemented:true}));

export function emptyLevel() {
  return {version:1,name:'My first escape',tiles:Array.from({length:32},(_,x)=>({x,y:16,type:'solid'})),coins:[],spawn:{x:2,y:15},exit:{x:29,y:15},time:90};
}
export const levelSize = level => ({width:level.width??32,height:level.height??18});
export function validateLevel(raw) {
  if(!raw || ![1,2,3].includes(raw.version)) throw new Error('Supported level formats are version 1, 2, and 3.');
  const {width,height}=raw.version===1?{width:32,height:18}:raw;
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<32||width>96||height<18||height>64) throw new Error('Level dimensions must be 32–96 columns and 18–64 rows.');
  const point=p=>p && Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.x<width&&p.y>=0&&p.y<height;
  if(typeof raw.name!=='string'||!raw.name.trim()||raw.name.length>60) throw new Error('Give your level a name (1–60 characters).');
  if(!point(raw.spawn)||!point(raw.exit)) throw new Error('The start and exit must be inside the grid.');
  if(!Array.isArray(raw.tiles)||raw.tiles.length>width*height||!raw.tiles.every(t=>point(t)&&['solid','spike','drone'].includes(t.type))) throw new Error('Invalid terrain. Use blocks, spikes, or saws inside the grid.');
  if(!Array.isArray(raw.coins)||raw.coins.length>width*height||!raw.coins.every(point)) throw new Error('Invalid gold positions.');
  const switches=raw.version>=2?(raw.switches??[]):[],gates=raw.version>=2?(raw.gates??[]):[],exitRequires=raw.version>=2?(raw.exitRequires??[]):[];
  if(!Array.isArray(switches)||switches.length>8||!switches.every(s=>point(s)&&typeof s.id==='string'&&/^[A-H]$/.test(s.id)))throw new Error('Use up to eight switches with unique letters A–H.');
  const ids=new Set(switches.map(s=>s.id));if(ids.size!==switches.length)throw new Error('Switch letters must be unique.');
  if(raw.version===3&&!switches.every(s=>(s.mode===undefined||['latch','toggle','timed'].includes(s.mode))&&(s.initial===undefined||typeof s.initial==='boolean'&&s.mode==='toggle')))throw Error('Switch mode must be latch, toggle, or timed; only toggle levers have an initial state.');
  if(raw.version===3&&!switches.every(s=>s.mode==='timed'?Number.isFinite(s.duration)&&s.duration>=2&&s.duration<=30:s.duration===undefined))throw Error('Timed switches need a duration of 2–30 seconds.');
  const exitStates=raw.version===3?validateConditions(raw.exitStates??{},ids,'Exit states'):{};
  if(!Array.isArray(exitRequires)||new Set(exitRequires).size!==exitRequires.length||!exitRequires.every(id=>ids.has(id)))throw new Error('The exit must refer to existing switches.');
  if(exitRequires.some(id=>exitStates[id]===false))throw Error('The exit cannot require a switch both ON and OFF.');
  if(!Array.isArray(gates)||gates.length>64||!gates.every(g=>point(g)&&ids.has(g.switchId)&&Number.isInteger(g.w)&&Number.isInteger(g.h)&&g.w>0&&g.h>0&&g.x+g.w<=width&&g.y+g.h<=height))throw new Error('Gates must fit inside the grid and link to an existing switch.');
  if(raw.version===3)for(const g of gates)if(g.states!==undefined){validateConditions(g.states,ids,'Gate states');if(!Object.hasOwn(g.states,g.switchId))throw Error('Gate states must include its primary switch letter.');}
  const sentries=raw.version===3?validateSentries(raw.sentries??[],width,height,ids):[];
  const devices=raw.version===3?validateDevices(raw.devices??[],width,height,ids):[];
  const traps=raw.version===3?validateTraps(raw.traps??[],width,height,ids):[];
  const crumbles=raw.version===3?validateCrumbles(raw.crumbles??[],width,height):[];
  const crumbleCells=crumbles.flatMap(p=>Array.from({length:p.w},(_,i)=>({x:p.x+i,y:p.y,type:'solid'})));
  const platforms=raw.version===3?validatePlatforms(raw.platforms??[],width,height,[...raw.tiles,...crumbleCells],gates):[];
  const cells=[...sentries,...traps.flatMap(trapCells),...crumbleCells,...devices,...raw.tiles,...raw.coins,raw.spawn,raw.exit,...switches].map(p=>`${p.x},${p.y}`);
  for(const g of gates)for(let y=g.y;y<g.y+g.h;y++)for(let x=g.x;x<g.x+g.w;x++)cells.push(`${x},${y}`);
  if(new Set(cells).size!==cells.length) throw new Error('Two objects share a tile. Give every object and gate its own space.');
  if(!Number.isFinite(raw.time)||raw.time<10||raw.time>300) throw new Error('Time limit must be between 10 and 300 seconds.');
  if(raw.droneSpeed!==undefined&&(!Number.isFinite(raw.droneSpeed)||raw.droneSpeed<.2||raw.droneSpeed>3))throw new Error('Saw speed must be between 0.2 and 3.');
  return {...(raw.version===3?{devices,platforms,crumbles,traps,sentries,exitStates}:{}),version:raw.version,name:raw.name.trim(),time:Math.round(raw.time),spawn:{x:raw.spawn.x,y:raw.spawn.y},exit:{x:raw.exit.x,y:raw.exit.y},tiles:raw.tiles.map(({x,y,type})=>({x,y,type})),coins:raw.coins.map(({x,y})=>({x,y})),...(raw.droneSpeed===undefined?{}:{droneSpeed:raw.droneSpeed}),...(raw.version>=2?{width,height,switches:switches.map(({id,x,y,mode,initial,duration})=>({id,x,y,...(raw.version===3&&mode?{mode,...(mode==='toggle'?{initial:initial??false}:mode==='timed'?{duration}:{})}:{})})),gates:gates.map(({switchId,x,y,w,h,states})=>({switchId,x,y,w,h,...(raw.version===3&&states?{states:{...states}}:{})})),exitRequires:[...exitRequires]}:{})};
}
