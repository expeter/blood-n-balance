import {freshState,loadState} from './state.js';

export const CAREER_KEY='n-momentum-careers-v1';
const DIFFICULTIES=['easy','medium','hard','nightmare'];
const nextUnlockedStage=progress=>Object.keys(progress.completed).length
  ?Math.min(98,Math.max(...Object.keys(progress.completed).map(Number))+1):0;
const readProgress=raw=>loadState({getItem:()=>raw?JSON.stringify(raw):null});

export function loadCareerBook(storage){
  try{
    const raw=JSON.parse(storage.getItem(CAREER_KEY));
    if(raw?.version===1&&Array.isArray(raw.profiles)){
      const seen=new Set(),profiles=raw.profiles.slice(0,8).filter(p=>{
        if(!p||typeof p.id!=='string'||!p.id||seen.has(p.id)||typeof p.name!=='string'||!p.name.trim())return false;
        seen.add(p.id);return true;
      }).map(p=>{
        const progress=readProgress(p.progress);
        return {id:p.id,name:p.name.trim().slice(0,24),difficulty:DIFFICULTIES.includes(p.difficulty)?p.difficulty:progress.settings.difficulty,lastStage:Number.isInteger(p.lastStage)?Math.max(0,Math.min(98,p.lastStage)):nextUnlockedStage(progress),progress};
      });
      if(profiles.length)return {version:1,activeId:profiles.some(p=>p.id===raw.activeId)?raw.activeId:profiles[0].id,profiles};
    }
  }catch{}
  const progress=loadState(storage);
  return {version:1,activeId:'player',profiles:[{id:'player',name:'Player',difficulty:progress.settings.difficulty,lastStage:nextUnlockedStage(progress),progress}]};
}

export function careerStartStage(career){
  return Number.isInteger(career?.lastStage)?Math.max(0,Math.min(98,career.lastStage)):nextUnlockedStage(career?.progress??freshState());
}

export function selectCareer(book,id){
  const career=book.profiles.find(p=>p.id===id);
  if(career)book.activeId=career.id;
  return career??null;
}

export function createCareer(book,name,difficulty='medium',id){
  const cleanName=String(name??'').trim().slice(0,24);
  if(!cleanName)throw new Error('Choose a name for this career.');
  if(book.profiles.length>=8)throw new Error('All eight career slots are in use.');
  const safeDifficulty=DIFFICULTIES.includes(difficulty)?difficulty:'medium';
  const careerId=id??globalThis.crypto?.randomUUID?.()??`career-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if(book.profiles.some(p=>p.id===careerId))throw new Error('That career already exists.');
  const progress=freshState();progress.settings.difficulty=safeDifficulty;
  const career={id:careerId,name:cleanName,difficulty:safeDifficulty,lastStage:0,progress};
  book.profiles.push(career);book.activeId=career.id;
  return career;
}

export function persistCareerBook(storage,book,career,progress){
  career.progress=progress;career.difficulty=progress.settings.difficulty;book.activeId=career.id;
  storage.setItem(CAREER_KEY,JSON.stringify(book));
  // Keep the original save key current for older builds that may still be open.
  if(career.id==='player')storage.setItem('n-momentum-v1',JSON.stringify(progress));
}
