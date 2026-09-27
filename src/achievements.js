const completed=s=>Object.keys(s.completed).length;
const clean=s=>Object.values(s.completed).filter(r=>r.clean).length;
const stat=(s,key)=>s.mastery?.[key]||0;
const goal=(id,name,description,target,progress)=>({id,name,description,target,progress,test:s=>progress(s)>=target});
export const EXTRA_ACHIEVEMENTS=[
 ...Array.from({length:10},(_,chapter)=>goal(`chapter-${chapter+1}`,`Chapter ${chapter+1} graduate`,`Complete every stage in chapter ${chapter+1}.`,chapter===9?9:10,s=>Array.from({length:chapter===9?9:10},(_,i)=>s.completed[chapter*10+i]).filter(Boolean).length)),
 ...Array.from({length:10},(_,chapter)=>goal(`pure-chapter-${chapter+1}`,`Chapter ${chapter+1}: pure focus`,`Complete chapter ${chapter+1} without purchased helpers.`,chapter===9?9:10,s=>Array.from({length:chapter===9?9:10},(_,i)=>s.completed[chapter*10+i]).filter(r=>r?.clean).length)),
 ...['easy','medium','hard','nightmare'].map(mode=>goal(`mode-${mode}`,`${mode[0].toUpperCase()+mode.slice(1)} footing`,`Finish a stage on ${mode} without helpers.`,1,s=>Object.values(s.leaderboards).filter(r=>Number.isFinite(r[mode]?.itemFree)).length)),
 goal('halfway','Halfway home','Complete 50 different stages.',50,completed),
 goal('clean-fifty','Independent spirit','Complete 50 stages without helpers.',50,clean),
 goal('wall-apprentice','Wall apprentice','Perform 10 wall kicks in successful runs.',10,s=>stat(s,'wallJumps')),
 goal('wall-expert','Wall expert','Perform 100 wall kicks in successful runs.',100,s=>stat(s,'wallJumps')),
 goal('wall-route','Vertical thinker','Finish a run with at least 5 wall kicks.',1,s=>stat(s,'wallRoutes')),
 goal('switch-master','Circuit thinker','Activate 50 circuits in successful runs.',50,s=>stat(s,'switches')),
 goal('all-gold','Leave nothing behind','Finish a stage with every gold pickup.',1,s=>stat(s,'fullGoldRuns')),
 goal('all-gold-ten','Thorough explorer','Collect all gold in 10 distinct stages.',10,s=>(s.fullGoldStages||[]).length),
 goal('empty-pockets','Eyes on the exit','Finish a stage without collecting gold.',1,s=>stat(s,'zeroGoldRuns')),
 goal('under-wire','Just in time','Finish with less than five seconds remaining.',1,s=>stat(s,'closeFinishes')),
 goal('time-to-spare','Room to breathe','Finish with at least half the time remaining.',1,s=>stat(s,'fastFinishes')),
 goal('shield-save','Second chance','Finish a run after a shield absorbs a hit.',1,s=>stat(s,'shieldFinishes')),
 goal('air-route','Air route','Finish after using a glider to slow a fall.',1,s=>stat(s,'gliderFinishes')),
 goal('combo-route','Plan B and C','Finish after using at least three different helpers.',1,s=>stat(s,'comboFinishes')),
 goal('comeback','A better attempt','Complete a stage after a failed attempt in the same session.',1,s=>stat(s,'comebacks')),
];
export function recordMastery(s,index,result,totalGold){
 s.mastery??={};const add=(key,value=1)=>{if(Number.isFinite(value)&&value>=0)s.mastery[key]=Math.min(Number.MAX_SAFE_INTEGER,(s.mastery[key]||0)+Math.floor(value));};
 const r=result.stats||{};for(const key of ['jumps','wallJumps','switches'])add(key,r[key]||0);
 if(r.wallJumps>=5)add('wallRoutes');
 if(totalGold>0&&result.gold===totalGold){add('fullGoldRuns');s.fullGoldStages??=[];if(!s.fullGoldStages.includes(index))s.fullGoldStages.push(index);}
 if(result.gold===0)add('zeroGoldRuns');if(result.remaining>=0&&result.remaining<5)add('closeFinishes');
 if(result.remaining>=result.timeLimit/2)add('fastFinishes');
 if(r.shieldBlocks>0)add('shieldFinishes');if(r.gliderUsed)add('gliderFinishes');if((r.helpers||[]).length>=3)add('comboFinishes');if(result.comeback)add('comebacks');
}
export function achievementProgress(achievement,state){
 const target=achievement.target??1,value=achievement.progress?achievement.progress(state):achievement.test(state)?1:0;
 return {value:Math.min(target,value),target,percent:Math.min(100,Math.floor(value/target*100))};
}
