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
