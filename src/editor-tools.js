import {validateLevel} from './levels.js';
const clone=v=>structuredClone(v);
export class EditorHistory{
 constructor(level,saved){this.entries=[clone(level)];this.index=0;this.batch=false;if(saved?.entries?.length&&Number.isInteger(saved.index)&&saved.index>=0&&saved.index<saved.entries.length&&JSON.stringify(saved.entries[saved.index])===JSON.stringify(level)){this.entries=clone(saved.entries.slice(0,60));this.index=Math.min(saved.index,this.entries.length-1);}}
 begin(){this.batch=true;}
 commit(level){if(this.batch||JSON.stringify(this.entries[this.index])===JSON.stringify(level))return;this.entries.splice(this.index+1);this.entries.push(clone(level));this.index++;while(this.entries.length>60||(this.entries.length>1&&JSON.stringify(this.entries).length>900000)){this.entries.shift();this.index--;}}
 end(level){this.batch=false;this.commit(level);}
 get canUndo(){return this.index>0;}get canRedo(){return this.index<this.entries.length-1;}
 undo(){if(this.canUndo)this.index--;return clone(this.entries[this.index]);}redo(){if(this.canRedo)this.index++;return clone(this.entries[this.index]);}
 serialize(){return JSON.stringify({entries:this.entries,index:this.index});}
}
const lists=['tiles','coins','switches','gates','devices','platforms','crumbles','traps','sentries'];
export function selectionRect(a,b){return {x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x)+1,h:Math.abs(a.y-b.y)+1};}
export function copySelection(level,rect){const inside=o=>o.x<rect.x+rect.w&&o.x+(o.w||1)>rect.x&&o.y<rect.y+rect.h&&o.y+(o.h||1)>rect.y;const objects=Object.fromEntries(lists.map(key=>[key,clone((level[key]||[]).filter(inside))]));return {origin:{x:rect.x,y:rect.y},objects,count:Object.values(objects).reduce((n,a)=>n+a.length,0)};}
export function pasteSelection(level,clip,point){
 if(!clip?.count)throw Error('Select and copy some objects first.');const next=clone(level);next.version=3;next.width??=32;next.height??=18;next.switches??=[];next.gates??=[];next.exitRequires??=[];
 const map={},used=new Set(next.switches.map(s=>s.id));for(const s of clip.objects.switches){const id=[...'ABCDEFGH'].find(id=>!used.has(id));if(!id)throw Error('No free circuit letters. Copy fewer switches (maximum eight).');map[s.id]=id;used.add(id);}
 const ref=id=>map[id]||id,states=o=>Object.fromEntries(Object.entries(o).map(([id,value])=>[ref(id),value]));const dx=point.x-clip.origin.x,dy=point.y-clip.origin.y;
 for(const key of lists){next[key]??=[];for(const original of clip.objects[key]){const o=clone(original);o.x+=dx;o.y+=dy;if(key==='platforms'){o.toX+=dx;o.toY+=dy;}if(key==='traps'){o.tx+=dx;o.ty+=dy;}if(key==='switches')o.id=ref(o.id);if(o.switchId)o.switchId=ref(o.switchId);if(o.offSwitch)o.offSwitch=ref(o.offSwitch);if(o.alarm)o.alarm.switchId=ref(o.alarm.switchId);if(o.states)o.states=states(o.states);next[key].push(o);}}
 return validateLevel(next); // Atomic: bounds, collisions, rails and all circuit references must pass.
}
export function drawSelection(c,rect){if(!rect)return;c.save();c.fillStyle='#528bff30';c.fillRect(rect.x*30,rect.y*30,rect.w*30,rect.h*30);c.strokeStyle='#174daf';c.lineWidth=3;c.setLineDash([8,4]);c.strokeRect(rect.x*30+1.5,rect.y*30+1.5,rect.w*30-3,rect.h*30-3);c.restore();}
