export const CONTROLS_KEY='blood-and-balance-controls-v1';
export const ACTIONS={left:'Move left',right:'Move right',jump:'Jump / wall jump',retry:'Restart',pause:'Pause / resume',map:'Map cycle',item1:'Time freeze',item2:'High jump',item3:'Rocket boost',item4:'Shield',item5:'Glider'};
export const DEFAULT_BINDINGS={left:['ArrowLeft','KeyA'],right:['ArrowRight','KeyD'],jump:['Space','ArrowUp','KeyW'],retry:['KeyR'],pause:['KeyP'],map:['KeyM'],item1:['Digit1'],item2:['Digit2'],item3:['Digit3'],item4:['Digit4'],item5:['Digit5']};
const validCode=code=>/^(Key[A-Z]|Digit[0-9]|Arrow(Left|Right|Up|Down)|Space|Shift(Left|Right)|Control(Left|Right)|Alt(Left|Right)|Bracket(Left|Right)|Comma|Period|Slash|Backslash|Semicolon|Quote|Minus|Equal|Backquote)$/.test(code);
export function keyLabel(code){return code?.replace(/^Key/,'').replace(/^Digit/,'').replace('Arrow','').replace(/(Left|Right)$/,' $1').trim()||'Unassigned';}
export function sanitizeBindings(raw){
 if(!raw||typeof raw!=='object')return structuredClone(DEFAULT_BINDINGS);
 const result={},seen=new Set();for(const action of Object.keys(ACTIONS)){
  const values=Array.isArray(raw[action])?raw[action]:DEFAULT_BINDINGS[action];result[action]=[];
  for(const code of values.slice(0,3))if(typeof code==='string'&&validCode(code)&&!seen.has(code)){seen.add(code);result[action].push(code);}
 }return result;
}
export function assignBinding(bindings,action,slot,code){
 if(!Object.hasOwn(ACTIONS,action)||!Number.isInteger(slot)||slot<0||slot>2)throw Error('Invalid binding slot.');
 if(code!==null&&!validCode(code))throw Error('That key is reserved. Escape cancels; Enter and Tab keep their usual actions.');
 if(code)for(const [other,codes] of Object.entries(bindings))if(codes.includes(code)&&!(other===action&&codes.indexOf(code)===slot))throw Error(`${keyLabel(code)} is already assigned to ${ACTIONS[other]}. Clear that binding first.`);
 const next=structuredClone(bindings);next[action]??=[];if(code===null)next[action].splice(slot,1);else next[action][slot]=code;next[action]=next[action].filter(Boolean);return next;
}
export function loadControls(storage){try{const r=JSON.parse(storage.getItem(CONTROLS_KEY));return {bindings:sanitizeBindings(r?.bindings),deadzone:Number.isFinite(r?.deadzone)?Math.max(.1,Math.min(.6,r.deadzone)):.22};}catch{return {bindings:structuredClone(DEFAULT_BINDINGS),deadzone:.22};}}
export function saveControls(storage,value){try{storage.setItem(CONTROLS_KEY,JSON.stringify(value));}catch{}}
export const resolveKey=(bindings,code)=>code==='Escape'?'pause':Object.keys(ACTIONS).find(action=>(bindings??DEFAULT_BINDINGS)[action]?.includes(code));
export const CANONICAL_KEYS={left:'ArrowLeft',right:'ArrowRight',jump:'Space'};

// Standard-mapped pads only: unknown layouts must not fire accidental actions.
export class ControllerInput{
 constructor({action,menu,isMenu,disconnected,connected},read=()=>navigator.getGamepads?.()??[]){Object.assign(this,{action,menu,isMenu,disconnected,connected,read});this.held=new Set();this.menuHeld=new Set();this.index=null;this.deadzone=.22;this.mode=null;this.blocked=false;}
 reset(){for(const action of this.held)this.action(action,false);this.held.clear();this.menuHeld.clear();}
 poll(){
  let pads;try{pads=Array.from(this.read()??[]);}catch{pads=[];}
  const pad=pads.find(p=>p?.connected&&p.mapping==='standard'&&(this.index===null||p.index===this.index))??pads.find(p=>p?.connected&&p.mapping==='standard');
  if(!pad){if(this.index!==null){this.reset();this.index=null;this.disconnected?.();}return;}
  if(this.index!==pad.index){this.reset();this.index=pad.index;this.connected?.(pad.id);}
  const pressed=i=>pad.buttons[i]?.pressed===true,axis=pad.axes[0]||0;
  const menuMode=this.isMenu();
  if(this.mode!==null&&this.mode!==menuMode){this.reset();this.blocked=true;}this.mode=menuMode;
  if(this.blocked){if(!pad.buttons.some(b=>b.pressed)&&pad.axes.every(a=>Math.abs(a)<=this.deadzone))this.blocked=false;return;}
  if(menuMode){
   if(this.held.size)this.reset();
   const next=new Set();for(const [button,action] of [[12,'up'],[13,'down'],[14,'left'],[15,'right'],[0,'confirm'],[1,'back'],[9,'confirm']])if(pressed(button))next.add(action);
   for(const a of next)if(!this.menuHeld.has(a))this.menu(a);this.menuHeld=next;return;
  }
  this.menuHeld.clear();const next=new Set();if(axis < -this.deadzone||pressed(14))next.add('left');if(axis > this.deadzone||pressed(15))next.add('right');
  for(const [button,action] of [[0,'jump'],[3,'retry'],[9,'pause'],[8,'map'],[4,'item1'],[5,'item2'],[2,'item3'],[1,'item4'],[10,'item5']])if(pressed(button))next.add(action);
  // Update bookkeeping before callbacks, which may open a menu or restart.
  const previous=this.held;this.held=next;
  for(const a of previous)if(!next.has(a))this.action(a,false);
  for(const a of next)if(!previous.has(a))this.action(a,true);
 }
}
