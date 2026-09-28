export const PALETTES=[
 {id:'midnight',name:'Midnight',unlockAt:0,accent:'#aeb7ff',gold:'#f0c875',panel:'#191b29',deep:'#10121b'},
 {id:'aurora',name:'Aurora',unlockAt:10,accent:'#71d6dc',gold:'#f0d17d',panel:'#172329',deep:'#0e171d'},
 {id:'sunset',name:'Afterglow',unlockAt:30,accent:'#ff9d88',gold:'#ffd080',panel:'#291c27',deep:'#18121d'},
 {id:'ultraviolet',name:'Ultraviolet',unlockAt:50,accent:'#c6a0ff',gold:'#ffcf79',panel:'#211b30',deep:'#14111e'},
 {id:'graphite',name:'Graphite',unlockAt:70,accent:'#d0d7e8',gold:'#f3c76c',panel:'#20232a',deep:'#14161b'},
 {id:'deepsea',name:'Deep Sea',unlockAt:90,accent:'#76baff',gold:'#ffd17b',panel:'#162234',deep:'#0d1522'}
];
export const SKINS=[
 {id:'classic',name:'Classic',unlockAt:0,suit:'#27312b',scarf:'#c96550',outline:'#26312b',eye:'#e4e7d8'},
 {id:'ember',name:'Ember',unlockAt:20,suit:'#32252d',scarf:'#ff735b',outline:'#211922',eye:'#fff0d4'},
 {id:'prism',name:'Prism',unlockAt:40,suit:'#26223b',scarf:'#b99aff',outline:'#1b1830',eye:'#e7ddff'},
 {id:'arctic',name:'Arctic',unlockAt:60,suit:'#233440',scarf:'#62d8e8',outline:'#192630',eye:'#e7fbff'},
 {id:'afterimage',name:'Afterimage',unlockAt:80,suit:'#393036',scarf:'#ffbb59',outline:'#241d25',eye:'#fff2d2'},
 {id:'ascendant',name:'Ascendant',unlockAt:99,suit:'#342d22',scarf:'#ffe17b',outline:'#211d18',eye:'#fffbe3'}
];
export function clearedCount(state){return Object.keys(state?.completed??{}).length;}
export function unlockedCosmetics(state){const count=clearedCount(state);return {palettes:PALETTES.filter(x=>count>=x.unlockAt),skins:SKINS.filter(x=>count>=x.unlockAt),count};}

export const ACCESSORIES=[
 {id:'leaf',slot:'head',name:'Leaf crown',price:12,color:'#27805e'},
 {id:'halo',slot:'head',name:'Sun halo',price:24,color:'#c59116'},
 {id:'ears',slot:'head',name:'Moon ears',price:18,color:'#b08bec'},
 {id:'cape',slot:'back',name:'Festival cape',price:20,color:'#d25282'},
 {id:'wings',slot:'back',name:'Petal wings',price:30,color:'#69bfd8'},
 {id:'ribbon',slot:'back',name:'Silk ribbons',price:14,color:'#ed9868'},
 {id:'flower',slot:'badge',name:'Clover pin',price:8,color:'#ffe082'},
 {id:'moon',slot:'badge',name:'Moon pin',price:10,color:'#d9d9ff'}
];
export function buyAccessory(state,id){const item=ACCESSORIES.find(a=>a.id===id);state.ownedAccessories??=[];if(!item||state.ownedAccessories.includes(id)||state.coins<item.price)return false;state.coins-=item.price;state.ownedAccessories.push(id);state.settings.accessories??={};state.settings.accessories[item.slot]=id;return true;}
export function equipAccessory(state,slot,id){if(!['head','back','badge'].includes(slot))return false;if(id!==null&&(!state.ownedAccessories?.includes(id)||!ACCESSORIES.some(a=>a.id===id&&a.slot===slot)))return false;state.settings.accessories??={};state.settings.accessories[slot]=id;return true;}
export function drawAccessories(c,g){const a=g.accessories||{},p=g.player;c.save();c.translate(p.x+8,p.y+6);
 if(a.back==='cape'){c.fillStyle='#d25282';c.beginPath();c.moveTo(-5,6);c.lineTo(-18,22);c.lineTo(7,22);c.lineTo(4,7);c.fill();}
 if(a.back==='wings'){c.fillStyle='#69bfd8';for(const d of [-1,1]){c.beginPath();c.ellipse(d*12,9,9,5,d*.6,0,Math.PI*2);c.fill();}}
 if(a.back==='ribbon'){c.strokeStyle='#ed9868';c.lineWidth=3;c.beginPath();c.moveTo(-4,6);c.quadraticCurveTo(-20,5,-18,20);c.moveTo(3,6);c.quadraticCurveTo(-12,14,-10,22);c.stroke();}
 if(a.head==='leaf'){c.strokeStyle='#205b42';c.lineWidth=2;c.beginPath();c.arc(0,-2,9,Math.PI,Math.PI*2);c.stroke();c.fillStyle='#3dba7c';for(const x of [-7,0,7]){c.beginPath();c.ellipse(x,-8,3,6,x*.1,0,Math.PI*2);c.fill();}}
 if(a.head==='halo'){c.strokeStyle='#c59116';c.lineWidth=2.5;c.beginPath();c.ellipse(0,-12,11,3,0,0,Math.PI*2);c.stroke();}
 if(a.head==='ears'){c.fillStyle='#b08bec';for(const d of [-1,1]){c.beginPath();c.moveTo(d*2,-5);c.lineTo(d*9,-17);c.lineTo(d*9,-2);c.fill();}}
 if(a.badge){c.fillStyle=a.badge==='flower'?'#ffe082':'#d9d9ff';c.beginPath();c.arc(0,9,3,0,Math.PI*2);c.fill();if(a.badge==='flower'){c.strokeStyle='#927023';c.lineWidth=1;c.stroke();}}
 c.restore();}
