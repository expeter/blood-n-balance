import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {campaignLevel} from '../src/levels.js';import {Game} from '../src/engine.js';
const output='docs/audits';mkdirSync(output,{recursive:true});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function replay(level,fixture,difficulty='medium'){
 const g=Object.create(Game.prototype);g.keys=new Set();g.difficulty=difficulty;g.reducedMotion=true;g.render=()=>{};const order=[];
 g.cb={hud(){},sound(){},dead(){},win(){},switch(id){order.push(id);}};g.burst=()=>{};g.die=cause=>{g.status='dead';g.deathCause=cause;};g.load(structuredClone(level));g.start();const route=[{x:g.player.x+8,y:g.player.y+13}];let frame=0;
 for(const a of fixture.actions){g.keys.clear();if(a.dir)g.keys.add(a.dir<0?'ArrowLeft':'ArrowRight');if(a.jump)g.jumpBuffer=.14;for(let f=0;f<a.frames&&g.status==='playing';f++){g.update(1/120);if(frame++%30===0)route.push({x:g.player.x+8,y:g.player.y+13});}if(g.status!=='playing')break;}
 return {status:g.status,cause:g.deathCause??null,seconds:+g.elapsed.toFixed(2),timeRemaining:+g.remaining.toFixed(2),switchOrder:order,wallJumps:g.runStats.wallJumps,jumps:g.runStats.jumps,route};
}
const reports=[];
for(let i=0;i<99;i++){
 const level=campaignLevel(i),n=String(i+1).padStart(2,'0'),fixture=JSON.parse(readFileSync(`tests/fixtures/level-${n}.json`));
 const runs=Object.fromEntries(['medium','easy','hard'].map(d=>[d,replay(level,fixture,d)]));
 for(const difficulty of ['easy','hard'])delete runs[difficulty].route;
 const alt=`tests/fixtures/level-${n}-alternate.json`,alternative=existsSync(alt)?replay(level,JSON.parse(readFileSync(alt))):null;
 const warnings=[];if(runs.medium.status!=='won')warnings.push('Primary replay fails; block release.');
 if(!alternative)warnings.push('Alternate route has no recorded fixture; inspect the authored return/shortcut.');
 if(level.lesson.length>180)warnings.push('Long opening hint: split route detail into optional notes.');
 if(runs.medium.wallJumps>=20)warnings.push('Sustained wall-kick route: review fatigue and recovery shelves.');
 if(runs.medium.seconds<level.time*.2)warnings.push('Large timer margin on recorded route; retain exploration allowance and review with player attempts before tightening.');
 for(const d of ['easy','hard'])if(runs[d].status!=='won')warnings.push(`${d}: Medium inputs do not transfer (${runs[d].cause||runs[d].status}); requires a difficulty-specific playtest, not evidence of an impossible room.`);
 const report={stage:i+1,name:level.name,revision:level.revision,purpose:level.skill,designIdea:level.lesson,room:[level.width,level.height],switches:level.switches.length,hazards:level.tiles.filter(t=>t.type!=='solid').length+(level.devices?.length||0)+(level.traps?.length||0)+(level.sentries?.length||0),runs,alternative,warnings,subjectiveReview:'Pending owner playtest; route success is not a fun/fairness score.'};reports.push(report);
 const scale=1/3,w=level.width*30,h=level.height*30;
 const terrain=level.tiles.map(t=>`<rect x="${t.x*30}" y="${t.y*30}" width="30" height="30" fill="${t.type==='solid'?'#47544c':'#c95849'}"/>`).join('');
 const path=runs.medium.route.map((p,j)=>`${j?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w*scale}" height="${h*scale}"><title>${escape(level.name)}: verified Medium route</title><rect width="100%" height="100%" fill="#edf1e7"/>${terrain}${level.gates.map(g=>`<rect x="${g.x*30}" y="${g.y*30}" width="${g.w*30}" height="${g.h*30}" fill="#c18b47"/>`).join('')}<path d="${path}" fill="none" stroke="#227dd1" stroke-width="4" opacity=".7"/>${level.switches.map(s=>`<circle cx="${s.x*30+15}" cy="${s.y*30+15}" r="20" fill="#fbd479"/><text x="${s.x*30+15}" y="${s.y*30+21}" text-anchor="middle" font-size="22">${s.id}</text>`).join('')}<rect x="${level.exit.x*30}" y="${level.exit.y*30}" width="30" height="30" fill="#52a571"/></svg>`;
 writeFileSync(`${output}/stage-${n}.svg`,svg);
}
writeFileSync(`${output}/campaign-report.json`,JSON.stringify(reports,null,2)+'\n');
const summaries=reports.map(r=>`| ${String(r.stage).padStart(2,'0')} | ${r.name} | ${r.runs.medium.seconds}s | ${r.runs.medium.wallJumps} | ${r.runs.medium.switchOrder.join(' → ')} | ${r.alternative?.status==='won'?'Verified':'Unverified'} | [route](stage-${String(r.stage).padStart(2,'0')}.svg) |`).join('\n');
writeFileSync(`${output}/README.md`,`# Campaign audit — reproducible evidence\n\nRun \`node scripts/audit-campaign.mjs\` to regenerate. Blue paths use the real engine, active hazards, no helpers, and Medium difficulty at 120Hz. Orange blocks are gates; labelled circles are required circuits. Static drawings omit moving hazard phases; these are route diagrams, not gameplay screenshots. Easy/Hard results reuse Medium inputs and cannot certify or reject those difficulties. Full metrics, limitations, and warnings are in [campaign-report.json](campaign-report.json).\n\n${reports.filter(r=>r.runs.medium.status==='won').length}/99 primary Medium replays finish. ${reports.filter(r=>r.alternative?.status==='won').length} stages have verified alternate-route fixtures. Subjective difficulty and readability still need player feedback; no geometry was regenerated.\n\n| Stage | Name | Recorded time | Wall kicks | Circuit activation order | Alternate | Evidence |\n| --- | --- | --- | --- | --- | --- | --- |\n${summaries}\n`);
console.log(JSON.stringify({primaryPass:reports.filter(r=>r.runs.medium.status==='won').length,alternatePass:reports.filter(r=>r.alternative?.status==='won').length,warnings:reports.reduce((n,r)=>n+r.warnings.length,0)}));
if(reports.some(r=>r.runs.medium.status!=='won'))process.exitCode=1;
