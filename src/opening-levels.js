// Authored puzzle rooms. Coordinates are tiles; rectangles are inclusive.
// A switch opens every gate bearing its letter and also contributes to the exit lock.
const rooms = [
  {
    name:'False start', size:[48,24], time:120, skill:'The exit is not the objective',
    lesson:'The exit is beside you, but it is locked. Find A on the far balcony. Its gate opens a shorter return route. Hold M to study the map.',
    spawn:[3,21],exit:[5,21],switches:[['A',42,10]],
    blocks:[[7,19,11,19],[15,16,19,16],[23,13,27,13],[33,13,37,13],[39,11,44,11],[22,14,22,18],[31,18,36,18]],
    gates:[['A',22,19,1,3]],spikes:[[12,21,15,21],[30,21,34,21],[25,12,26,12]],saws:[[34,17]],
  },
  {
    name:'Two sides', size:[48,28], time:130, skill:'Unlock a loop',
    lesson:'A opens the low passage to B. You can also cross the top of the divide. Both switches unlock the central exit; plan your return.',
    spawn:[20,25],exit:[22,25],switches:[['A',5,10],['B',42,25]],
    blocks:[[15,23,20,23],[9,20,13,20],[3,17,7,17],[9,14,14,14],[3,11,8,11],[18,8,24,8],[24,9,24,22],[35,23,40,23],[28,20,32,20],[36,17,41,17]],
    gates:[['A',24,23,1,3]],spikes:[[30,25,33,25],[10,25,13,25],[11,13,12,13]],saws:[[39,22]],
  },
  {
    name:'The switchyard', size:[64,24], time:140, skill:'Choose the high road',
    lesson:'Two switch circuits divide the yard. The floor is fast and dangerous; the upper bridges give you room to think. Open A, find B, and escape east.',
    spawn:[3,21],exit:[59,21],switches:[['A',17,12],['B',50,12]],
    blocks:[[7,19,11,19],[14,16,25,16],[2,13,19,13],[27,10,39,10],[31,12,31,18],[38,19,42,19],[43,16,47,16],[45,13,53,13],[56,14,56,18],[18,7,24,7]],
    gates:[['A',31,19,1,3],['B',56,19,1,3]],
    spikes:[[8,21,12,21],[21,21,25,21],[39,21,42,21],[53,21,55,21],[11,12,13,12],[31,9,33,9]],saws:[[35,20],[46,15]],
  },
  {
    name:'Inside out', size:[48,32], time:150, skill:'Read the whole machine',
    lesson:'The exit is inside the inner cage. A is outside, B is inside. The roof opening and the side gate are two ways into the vault.',
    spawn:[4,29],exit:[24,26],switches:[['A',37,8],['B',24,16]],
    blocks:[[5,27,11,27],[3,24,7,24],[8,21,12,21],[4,18,9,18],[9,15,13,15],[12,12,16,12],[16,9,22,9],[27,9,31,9],[34,9,40,9],[16,10,16,23],[31,10,31,26],[16,27,31,27],[21,17,26,17],[17,23,20,23],[26,20,30,20],[22,23,22,26],[26,23,26,26]],
    gates:[['A',16,24,1,3],['B',23,23,3,1]],
    spikes:[[12,29,15,29],[33,29,41,29],[18,26,20,26],[28,19,29,19]],saws:[[19,20],[39,8]],
  },
  {
    name:'Double helix', size:[48,36], time:160, skill:'Wall-slide, kick, reconnect',
    lesson:'Climb to A, cross to the second shaft for B, then reach C outside. C opens the way back to the exit. Jump while steering away from a wall to kick off.',
    spawn:[16,33],exit:[4,33],switches:[['A',14,6],['B',22,18],['C',37,33]],
    blocks:[[13,4,13,28],[19,4,19,28],[25,9,25,28],[14,8,15,8],[21,19,22,19],[20,25,21,25],[23,13,24,13],[28,30,33,30],[36,27,41,27],[5,24,10,24]],
    gates:[['A',19,29,1,5],['B',25,29,1,5],['C',13,29,1,5]],
    spikes:[[29,33,32,33],[7,33,10,33],[17,7,18,7]],saws:[[16,24],[31,29],[22,11]],
  },
  {
    name:'Down payment', size:[64,32], time:150, skill:'A shortcut has a price',
    lesson:'A releases the near trapdoor; the long way around remains open. Find B on the middle floor before descending to the exit. Dropping early means climbing back.',
    spawn:[3,4],exit:[58,29],switches:[['A',6,7],['B',34,17]],
    blocks:[[1,5,15,5],[3,8,10,8],[1,10,14,10],[19,10,48,10],[12,18,62,18],[48,19,48,25],[19,26,25,26],[30,23,35,23],[2,27,7,27],[7,24,11,24],[2,21,7,21],[7,18,11,18],[2,15,7,15],[7,12,11,12],[53,23,60,23]],
    gates:[['A',15,10,4,1],['B',48,26,1,4]],
    spikes:[[22,9,25,9],[41,9,44,9],[23,17,26,17],[43,17,46,17],[12,29,18,29],[32,29,36,29],[55,22,57,22]],saws:[[38,17],[21,25],[54,28]],
  },
  {
    name:'The grinder', size:[64,28], time:140, skill:'Pick your exposure',
    lesson:'A opens the low crossing. The suspended upper route bypasses it, but both routes meet the saws guarding B. Watch their travel before committing.',
    spawn:[3,25],exit:[60,25],switches:[['A',18,7],['B',51,15]],
    blocks:[[7,23,11,23],[15,20,19,20],[23,23,27,23],[32,20,36,20],[40,17,44,17],[47,16,52,16],[56,20,61,20],[9,17,13,17],[14,14,18,14],[10,11,15,11],[15,8,21,8],[24,11,29,11],[33,14,38,14],[31,15,31,18]],
    gates:[['A',31,19,1,7]],spikes:[[9,25,21,25],[29,25,41,25],[48,25,56,25],[11,10,12,10],[25,10,26,10]],saws:[[18,19],[34,19],[43,16],[49,15]],droneSpeed:1.15,
  },
  {
    name:'Three keys, one lie', size:[64,36], time:170, skill:'Choose the order',
    lesson:'Three switches, one central exit. The obvious doorway is only a shortcut: a high rim connects the two wings. Decide which switch to visit next.',
    spawn:[33,32],exit:[31,32],switches:[['A',8,29],['B',9,8],['C',56,20]],
    blocks:[[10,32,22,32],[22,30,26,30],[15,28,19,28],[3,30,12,30],[3,27,7,27],[8,24,12,24],[3,21,7,21],[8,18,12,18],[3,15,7,15],[8,12,12,12],[4,9,16,9],[16,10,16,23],[21,12,25,12],[29,15,33,15],[38,18,42,18],[44,21,48,21],[50,21,60,21],[42,19,42,23],[27,24,36,24],[27,30,36,30],[33,27,38,27],[48,27,53,27],[55,30,61,30]],
    gates:[['A',16,24,1,6],['B',42,24,1,10]],
    spikes:[[12,33,20,33],[40,33,48,33],[5,20,6,20],[23,11,24,11],[52,20,54,20]],saws:[[10,17],[31,23],[46,20],[58,29]],droneSpeed:1.05,
  },
  {
    name:'Security theater', size:[64,36], time:180, skill:'Break in, then break out',
    lesson:'C opens the first vault entrance. Its roof is another way in. A opens the route to the second vault; B releases the final passage. Escape from the eastern tower.',
    spawn:[3,33],exit:[61,5],switches:[['A',20,26],['B',47,22],['C',5,12]],
    blocks:[[4,31,9,31],[7,28,12,28],[3,25,7,25],[8,22,12,22],[3,19,7,19],[7,16,12,16],[3,13,8,13],[14,12,19,12],[22,12,27,12],[14,13,14,27],[27,13,27,28],[17,27,24,27],[29,31,35,31],[33,28,38,28],[29,25,34,25],[34,22,38,22],[29,19,34,19],[34,16,38,16],[30,13,35,13],[35,10,38,10],[36,9,38,9],[39,6,45,6],[48,6,54,6],[39,7,39,33],[54,7,54,23],[42,23,51,23],[56,6,58,6],[61,6,62,6],[56,9,56,30],[62,9,62,33],[40,30,46,30]],
    gates:[['C',14,28,1,6],['A',27,29,1,5],['B',54,24,1,10]],
    spikes:[[9,33,12,33],[17,33,23,33],[30,33,35,33],[44,33,51,33],[18,26,19,26],[43,22,44,22]],saws:[[9,21],[24,18],[35,15],[49,13],[59,24]],droneSpeed:1.2,
  },
  {
    name:'Meat machine', size:[64,36], time:180, skill:'An exit earned twice',
    lesson:'You start inside the machine. C opens its roof. Visit both outer switches, then return to the central exit. The lower corridors are recovery routes, not safe routes.',
    spawn:[31,33],exit:[31,30],switches:[['A',4,5],['B',59,5],['C',31,18]],
    blocks:[[27,10,30,10],[33,10,36,10],[27,11,27,27],[36,11,36,27],[28,28,30,28],[33,25,35,25],[28,22,30,22],[30,19,33,19],[28,16,30,16],[33,13,35,13],[29,31,33,31],[23,7,29,7],[15,7,20,7],[8,8,11,8],[2,6,6,6],[39,7,43,7],[47,8,52,8],[56,6,61,6],[1,7,1,33],[7,10,7,30],[56,10,56,30],[62,7,62,33],[20,30,25,30],[13,27,17,27],[8,24,11,24],[39,30,43,30],[46,27,50,27],[52,24,55,24]],
    gates:[['A',27,28,1,6],['B',36,28,1,6],['C',31,10,2,1]],
    spikes:[[12,33,23,33],[40,33,51,33],[16,6,17,6],[41,6,42,6],[34,18,35,18]],saws:[[15,5],[49,6],[32,15],[33,27],[22,29],[42,29]],droneSpeed:1.2,
  },
];

export function openingLevel(index) {
  const r=rooms[index], [width,height]=r.size, cells=new Map();
  const rect=([x1,y1,x2,y2],type)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)cells.set(`${x},${y}`,{x,y,type});};
  rect([0,height-2,width-1,height-1],'solid');
  rect([0,0,0,height-1],'solid');rect([width-1,0,width-1,height-1],'solid');rect([0,0,width-1,0],'solid');
  r.blocks.forEach(b=>rect(b,'solid'));r.spikes?.forEach(b=>rect(b,'spike'));
  r.saws?.forEach(([x,y])=>cells.set(`${x},${y}`,{x,y,type:'drone'}));
  const gates=r.gates.map(([switchId,x,y,w,h])=>({switchId,x,y,w,h}));
  for(const g of gates)for(let y=g.y;y<g.y+g.h;y++)for(let x=g.x;x<g.x+g.w;x++)cells.delete(`${x},${y}`);
  const switches=r.switches.map(([id,x,y])=>({id,x,y}));
  const spawn={x:r.spawn[0],y:r.spawn[1]},exit={x:r.exit[0],y:r.exit[1]};
  const occupied=new Set([...cells.keys(),...switches.map(s=>`${s.x},${s.y}`),`${spawn.x},${spawn.y}`,`${exit.x},${exit.y}`]);
  for(const g of gates)for(let y=g.y;y<g.y+g.h;y++)for(let x=g.x;x<g.x+g.w;x++)occupied.add(`${x},${y}`);
  const coins=[];
  for(const t of cells.values())if(t.type==='solid'&&t.x>1&&t.x<width-2&&t.y>3&&t.y<height-2&&t.x%3===1){
    const y=t.y-2;if(!occupied.has(`${t.x},${y}`)&&!occupied.has(`${t.x},${y+1}`))coins.push({x:t.x,y});
  }
  return {version:2,revision:3,index,chapter:0,name:r.name,width,height,time:r.time,lesson:r.lesson,skill:r.skill,difficulty:index+1,spawn,exit,tiles:[...cells.values()],coins:coins.slice(0,65),switches,gates,exitRequires:switches.map(s=>s.id),droneSpeed:r.droneSpeed??.85};
}
