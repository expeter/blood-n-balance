import {EXTRA_ACHIEVEMENTS} from './achievements.js';
import {campaignRevision} from './levels.js';
import {PALETTES,SKINS,ACCESSORIES} from './cosmetics.js';
export const ITEMS = [
 {id:'freeze',name:'Time freeze',icon:'◷',price:15,duration:6,description:'Stop drones and the clock for 6s.',key:'1',color:'#92d4ff'},
 {id:'jump',name:'High jump',icon:'↟',price:12,duration:10,description:'Extra jump height for 10s.',key:'2',color:'#c5ef75'},
 {id:'rocket',name:'Rocket boost',icon:'↗',price:20,duration:0.5,description:'A short, powerful upward burst.',key:'3',color:'#fba782'},
 {id:'shield',name:'Shield',icon:'◇',price:18,duration:8,description:'Absorb one hazard hit within 8s.',key:'4',color:'#c5b2ff'},
 {id:'glider',name:'Slow-fall glider',icon:'⌁',price:12,duration:8,description:'Drift gently down for 8s.',key:'5',color:'#79d8b7'}
];
export const ACHIEVEMENTS=[
 {id:'first',name:'One small step',description:'Complete your first stage.',test:s=>Object.keys(s.completed).length>=1},
 {id:'ten',name:'Finding your feet',description:'Complete 10 different stages.',test:s=>Object.keys(s.completed).length>=10},
 {id:'gold',name:'Gold standard',description:'Collect 100 gold across successful runs.',test:s=>s.totalGold>=100},
 {id:'clean',name:'Pure instinct',description:'Finish a stage without using an item.',test:s=>Object.values(s.completed).some(r=>r.clean)},
 {id:'speed',name:'Blink and you miss it',description:'Finish a stage in under 20 seconds.',test:s=>Object.values(s.completed).some(r=>r.best<20)},
 {id:'all',name:'The long run',description:'Complete all 99 stages.',test:s=>Object.keys(s.completed).length===99},
 {id:'purist',name:'Nothing but ninja',description:'Complete all 99 stages without items.',test:s=>Object.values(s.completed).filter(r=>r.clean).length===99},
 {id:'clean-five',name:'No shortcuts',description:'Clear five different stages without using an item.',test:s=>Object.values(s.completed).filter(r=>r.clean).length>=5},
 {id:'full-kit',name:'Ready for anything',description:'Buy every kind of shop item at least once.',test:s=>ITEMS.every(i=>s.shopPurchases[i.id]>=1)},
 {id:'try-everything',name:'Toolbox tested',description:'Use every kind of shop item at least once.',test:s=>ITEMS.every(i=>s.itemUses[i.id]>=1)},
 {id:'night-shift',name:'After hours',description:'Clear ten stages on Nightmare difficulty.',test:s=>Object.values(s.leaderboards).filter(scores=>scores.nightmare&&(scores.nightmare.itemFree!==undefined||scores.nightmare.assisted!==undefined)).length>=10},
 {id:'world-tour',name:'World tour',description:'Start a stage in all ten sectors.',test:s=>Array.from({length:10},(_,sector)=>Object.keys(s.levelPlays).some(stage=>Math.floor(+stage/10)===sector)).every(Boolean)},
 {id:'golden-run',name:'Golden run',description:'Bank 500 gold across successful runs.',test:s=>s.totalGold>=500}
];
ACHIEVEMENTS.push(...EXTRA_ACHIEVEMENTS);
export const freshState=()=>({version:2,ownedAccessories:[],mastery:{},fullGoldStages:[],coins:40,inventory:Object.fromEntries(ITEMS.map(i=>[i.id,0])),completed:{},totalGold:0,deaths:0,deathsByCause:{},itemUses:Object.fromEntries(ITEMS.map(i=>[i.id,0])),shopPurchases:Object.fromEntries(ITEMS.map(i=>[i.id,0])),levelPlays:{},gatheredGold:{},leaderboards:{},settings:{sound:true,music:true,audioConfigured:true,difficulty:'medium',palette:'midnight',skin:'classic',accessories:{},playerName:'Runner'},achievements:[]});
export function loadState(storage) {
  try {
    const raw=JSON.parse(storage.getItem('n-momentum-v1'));
    if(!raw||![1,2].includes(raw.version)) return freshState();
    const s=freshState();
    s.coins=Number.isSafeInteger(raw.coins)&&raw.coins>=0?raw.coins:40;
    for(const i of ITEMS) s.inventory[i.id]=Number.isSafeInteger(raw.inventory?.[i.id])&&raw.inventory[i.id]>=0?raw.inventory[i.id]:0;
    for(const [k,r] of Object.entries(raw.completed||{})) if(/^\d+$/.test(k)&&+k<99&&r&&Number.isFinite(r.best)&&r.best>=0) s.completed[k]={best:r.best,clean:r.clean===true,gold:Number.isFinite(r.gold)?r.gold:0,revision:Number.isInteger(r.revision)&&r.revision>=1?r.revision:1,difficulty:['easy','medium','hard','nightmare'].includes(r.difficulty)?r.difficulty:'medium'};
    for(const [k,n] of Object.entries(raw.mastery||{}))if(/^[a-zA-Z]{1,32}$/.test(k)&&Number.isSafeInteger(n)&&n>=0)s.mastery[k]=n;
    s.fullGoldStages=Array.isArray(raw.fullGoldStages)?[...new Set(raw.fullGoldStages.filter(i=>Number.isInteger(i)&&i>=0&&i<99))]:[];
    s.totalGold=Number.isFinite(raw.totalGold)&&raw.totalGold>=0?raw.totalGold:0;
    s.deaths=Number.isSafeInteger(raw.deaths)&&raw.deaths>=0?raw.deaths:0;
    for(const [cause,n] of Object.entries(raw.deathsByCause||{}))if(/^[a-z-]{1,32}$/.test(cause)&&Number.isSafeInteger(n)&&n>=0)s.deathsByCause[cause]=n;
    for(const i of ITEMS){for(const [source,target] of [[raw.itemUses,s.itemUses],[raw.shopPurchases,s.shopPurchases]]){const n=source?.[i.id];if(Number.isSafeInteger(n)&&n>=0)target[i.id]=n;}}
    for(const [k,n] of Object.entries(raw.levelPlays||{}))if(/^\d+$/.test(k)&&+k<99&&Number.isSafeInteger(n)&&n>=0)s.levelPlays[k]=n;
    for(const [k,ids] of Object.entries(raw.gatheredGold||{}))if(/^\d+$/.test(k)&&+k<99&&Array.isArray(ids))s.gatheredGold[k]=[...new Set(ids.filter(i=>Number.isInteger(i)&&i>=0&&i<512))];
    for(const [k,byDifficulty] of Object.entries(raw.leaderboards||{}))if(/^\d+$/.test(k)&&+k<99&&byDifficulty&&typeof byDifficulty==='object'){
      const record={};for(const difficulty of ['easy','medium','hard','nightmare'])if(byDifficulty[difficulty]&&typeof byDifficulty[difficulty]==='object'){
        const pair={};for(const mode of ['itemFree','assisted'])if(Number.isFinite(byDifficulty[difficulty][mode])&&byDifficulty[difficulty][mode]>=0)pair[mode]=byDifficulty[difficulty][mode];if(Object.keys(pair).length)record[difficulty]=pair;
      }if(Object.keys(record).length&&s.completed[k]?.revision===campaignRevision(+k))s.leaderboards[k]=record;
    }
    // Older saves used false as the default, so migrate them to audible once.
    // After this flag is persisted, an intentional mute choice is respected.
    const audioConfigured=raw.settings?.audioConfigured===true;
    s.settings={sound:audioConfigured?raw.settings?.sound===true:true,music:audioConfigured?raw.settings?.music===true:true,audioConfigured:true,difficulty:['easy','medium','hard','nightmare'].includes(raw.settings?.difficulty)?raw.settings.difficulty:'medium',palette:PALETTES.some(p=>p.id===raw.settings?.palette)?raw.settings.palette:'midnight',skin:SKINS.some(p=>p.id===raw.settings?.skin)?raw.settings.skin:'classic',accessories:{},playerName:typeof raw.settings?.playerName==='string'&&raw.settings.playerName.trim()?raw.settings.playerName.trim().slice(0,24):'Runner'};
    s.ownedAccessories=Array.isArray(raw.ownedAccessories)?[...new Set(raw.ownedAccessories.filter(id=>ACCESSORIES.some(a=>a.id===id)))]:[];
    s.settings.accessories={};for(const slot of ['head','back','badge']){const id=raw.settings?.accessories?.[slot];if(s.ownedAccessories.includes(id)&&ACCESSORIES.some(a=>a.id===id&&a.slot===slot))s.settings.accessories[slot]=id;}
    s.achievements=ACHIEVEMENTS.filter(a=>a.test(s)||(Array.isArray(raw.achievements)&&raw.achievements.includes(a.id))).map(a=>a.id);
    return s;
  } catch {return freshState();}
}
export function unlocked(s,index,allowAll=false){return allowAll||index===0||!!s.completed[index]||!!s.completed[index-1];}
export function recordStagePlay(s,index){if(!Number.isInteger(index)||index<0||index>=99)return false;s.levelPlays[index]=(s.levelPlays[index]||0)+1;return s.levelPlays[index];}
export function recordDeath(s,cause){if(typeof cause!=='string'||!/^[-a-z]{1,32}$/.test(cause))return false;s.deaths++;s.deathsByCause[cause]=(s.deathsByCause[cause]||0)+1;return s.deaths;}
export function recordItemUse(s,id){if(!ITEMS.some(item=>item.id===id))return false;s.itemUses[id]++;return s.itemUses[id];}
export function recordGoldPickup(s,index,coinIndex){if(!Number.isInteger(index)||index<0||index>=99||!Number.isInteger(coinIndex)||coinIndex<0)return false;const seen=s.gatheredGold[index]??=[];if(seen.includes(coinIndex))return false;seen.push(coinIndex);return true;}
export function bankRunGold(s,index,baseGold,coinIndices){if(!Number.isInteger(index)||index<0||index>=99||!Number.isInteger(baseGold)||baseGold<0||!Array.isArray(coinIndices))return null;let bonus=0;for(const id of new Set(coinIndices))if(recordGoldPickup(s,index,id))bonus++;return {gold:baseGold+bonus,bonus};}
export function buy(s,id){const item=ITEMS.find(i=>i.id===id);if(!item||s.coins<item.price)return false;s.coins-=item.price;s.inventory[id]++;s.shopPurchases[id]++;return true;}
export function complete(s,index,time,gold,usedItems,difficulty='medium',allowLocked=false){
  if(!Number.isInteger(index)||index<0||index>=99||!unlocked(s,index,allowLocked)||!Number.isFinite(time)||time<0||!Number.isInteger(gold)||gold<0)return [];
  const previous=s.completed[index];
  const revision=campaignRevision(index);
  const old=previous?.revision===revision?previous:undefined;
  const isBest=time<(old?.best??Infinity);
  s.completed[index]={best:Math.min(old?.best??Infinity,time),clean:!!old?.clean||!usedItems,gold:Math.max(old?.gold??0,gold),revision,difficulty:isBest&&['easy','medium','hard','nightmare'].includes(difficulty)?difficulty:old?.difficulty??'medium'};
  if(!old)delete s.leaderboards[index];
  const ladder=s.leaderboards[index]??={},bucket=ladder[difficulty]??={};s.leaderboards[index]=ladder;ladder[difficulty]=bucket;const mode=usedItems?'assisted':'itemFree';bucket[mode]=Math.min(bucket[mode]??Infinity,time);
  s.coins+=gold;s.totalGold+=gold;
  const earned=ACHIEVEMENTS.filter(a=>!s.achievements.includes(a.id)&&a.test(s));
  s.achievements.push(...earned.map(a=>a.id));return earned;
}
