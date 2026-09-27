import {validateLevel,levelSize} from './levels.js';
// Optimistic topology check only: disconnected even with gates removed means
// impossible. Connected air cells do NOT establish physically reachable jumps.
export function analyzeLevel(raw){
 const level=validateLevel(raw),{width,height}=levelSize(level),solid=new Set(level.tiles.filter(t=>t.type==='solid').map(t=>`${t.x},${t.y}`));
 const visited=new Set(),queue=[level.spawn];for(let i=0;i<queue.length;i++){const p=queue[i],key=`${p.x},${p.y}`;if(visited.has(key)||solid.has(key))continue;visited.add(key);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,k=`${x},${y}`;if(x>=0&&y>=0&&x<width&&y<height&&!visited.has(k)&&!solid.has(k))queue.push({x,y});}}
 const targets=[{...level.exit,id:'exit'},...(level.switches??[])],disconnected=targets.filter(p=>!visited.has(`${p.x},${p.y}`)).map(p=>p.id);
 return {status:disconnected.length?'fail':'unverified',reasons:disconnected.length?[`Solid walls disconnect: ${disconnected.join(', ')}.`]:['Air-space connectivity passes. Jump reach, gate order, moving obstacles and timing still require playtesting.'],metrics:{width,height,reachableAirCells:visited.size,objectives:targets.length,normalJumpRisePixels:108,normalSpeedCap:265}};
}
export function draftFromGrid(raw){
 if(!raw||typeof raw.name!=='string'||typeof raw.rationale!=='string'||raw.rationale.length>2000||!Array.isArray(raw.grid)||raw.grid.length!==18||raw.grid.some(row=>typeof row!=='string'||row.length!==32||/[^#.SE*^oA-Da-d]/.test(row)))throw Error('Generator must return 18 rows of 32 supported cells, a name, and a short rationale.');
 const level={version:3,name:raw.name,time:150,width:32,height:18,tiles:[],coins:[],switches:[],gates:[],exitRequires:[]};let spawns=0,exits=0;
 raw.grid.forEach((row,y)=>[...row].forEach((ch,x)=>{if('#^o'.includes(ch))level.tiles.push({x,y,type:ch==='#'?'solid':ch==='^'?'spike':'drone'});else if(ch==='*')level.coins.push({x,y});else if(ch==='S'){spawns++;level.spawn={x,y};}else if(ch==='E'){exits++;level.exit={x,y};}else if(/[A-D]/.test(ch)){level.switches.push({id:ch,x,y});level.exitRequires.push(ch);}else if(/[a-d]/.test(ch))level.gates.push({x,y,w:1,h:1,switchId:ch.toUpperCase()});}));
 if(spawns!==1||exits!==1)throw Error('Exactly one S and one E are required.');return {level:validateLevel(level),rationale:raw.rationale};
}
export function draftFromBlueprint(raw){
 if(raw?.grid)return draftFromGrid(raw);
 if(!raw||typeof raw.rationale!=='string'||raw.rationale.length>2000)throw Error('A brief route explanation is required.');
 const level={version:3,name:raw.name,width:32,height:18,time:150,spawn:raw.spawn,exit:raw.exit,tiles:[],coins:raw.coins??[],switches:raw.switches??[],gates:raw.gates??[],exitRequires:(raw.switches??[]).map(s=>s.id)};
 const cells=new Set(),solid=(x,y)=>{const key=`${x},${y}`;if(!cells.has(key)){cells.add(key);level.tiles.push({x,y,type:'solid'});}};
 for(let x=0;x<32;x++){solid(x,0);solid(x,17);}for(let y=1;y<17;y++){solid(0,y);solid(31,y);}
 for(const [kind,axis] of [['platforms','w'],['walls','h']]){const blocks=raw[kind]??[];if(!Array.isArray(blocks)||blocks.length>30)throw Error('At most 30 platform or wall segments.');for(const p of blocks){if(!p||![p.x,p.y,p[axis]].every(Number.isInteger)||p.x<1||p.y<1||p.x>30||p.y>16||p[axis]<1||p[axis]>30||(axis==='w'?p.x+p.w>31:p.y+p.h>17))throw Error('Platform and wall segments must fit inside the room.');for(let i=0;i<p[axis];i++)solid(p.x+(axis==='w'?i:0),p.y+(axis==='h'?i:0));}}
 for(const [key,type] of [['spikes','spike'],['saws','drone']]){if(!Array.isArray(raw[key]??[])||(raw[key]?.length??0)>40)throw Error('At most 40 obstacles of each kind.');for(const p of raw[key]??[])level.tiles.push({...p,type});}
 return {level:validateLevel(level),rationale:raw.rationale};
}
export function blueprintFromLevel(raw){
 const level=validateLevel(raw),size=levelSize(level);if(size.width!==32||size.height!==18||['devices','platforms','crumbles','traps','sentries'].some(key=>level[key]?.length)||(level.switches??[]).some(s=>s.mode&&s.mode!=='latch'))throw Error('AI revision currently supports 32 × 18 drafts with terrain, gold, latch switches and gates. Export and keep larger or advanced rooms in the manual editor.');
 const solid=new Set(level.tiles.filter(t=>t.type==='solid').map(t=>`${t.x},${t.y}`)),platforms=[];
 for(let y=1;y<17;y++)for(let x=1;x<31;x++)if(solid.has(`${x},${y}`)){const start=x;while(x+1<31&&solid.has(`${x+1},${y}`))x++;platforms.push({x:start,y,w:x-start+1});}
 if(platforms.length>30)throw Error('This draft has too many separate platforms for the first AI revision format.');
 return {name:level.name,spawn:level.spawn,exit:level.exit,platforms,walls:[],coins:level.coins,spikes:level.tiles.filter(t=>t.type==='spike').map(({x,y})=>({x,y})),saws:level.tiles.filter(t=>t.type==='drone').map(({x,y})=>({x,y})),switches:level.switches??[],gates:level.gates??[]};
}
