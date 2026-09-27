import test from 'node:test';import assert from 'node:assert/strict';
import {DEFAULT_BINDINGS,assignBinding,loadControls,saveControls,resolveKey,ControllerInput} from '../src/controls.js';
import {Game} from '../src/engine.js';
test('rebindings persist, reject conflicting/reserved keys, and always retain Escape',()=>{
 let raw=null;const storage={getItem:()=>raw,setItem:(_,v)=>raw=v};let c=loadControls(storage);
 c.bindings=assignBinding(c.bindings,'left',0,'KeyJ');saveControls(storage,c);c=loadControls(storage);
 assert.equal(resolveKey(c.bindings,'KeyJ'),'left');assert.equal(resolveKey(c.bindings,'ArrowLeft'),undefined);assert.equal(resolveKey(c.bindings,'Escape'),'pause');
 assert.throws(()=>assignBinding(c.bindings,'jump',0,'KeyJ'),/already assigned/);assert.throws(()=>assignBinding(c.bindings,'jump',0,'Tab'),/reserved/);
 assert.doesNotThrow(()=>saveControls({setItem(){throw Error();}},c));assert.deepEqual(loadControls({getItem(){throw Error();}}).bindings,DEFAULT_BINDINGS);
});
test('releasing one device or alternate key does not cancel another held input',()=>{
 const game=Object.create(Game.prototype);game.keys=new Set();game.input('ArrowLeft',true,'keyboard:A');game.input('ArrowLeft',true,'controller');game.input('ArrowLeft',false,'controller');assert.ok(game.keys.has('ArrowLeft'));
 game.input('ArrowLeft',false,'keyboard:A');assert.equal(game.keys.has('ArrowLeft'),false);game.input('Space',true);game.jumpBuffer=0;game.input('Space',true);assert.equal(game.jumpBuffer,0);game.clearInput();assert.equal(game.inputSources.size,0);
});
test('controller actions are edge-triggered, deadzone-aware, and cannot resume a pause with the same held button',()=>{
 let menu=false,pad={index:0,id:'test',connected:true,mapping:'standard',buttons:Array.from({length:16},()=>({pressed:false})),axes:[0,0]},calls=[],disconnects=0;
 const input=new ControllerInput({action:(a,down)=>{calls.push([a,down]);if(a==='pause'&&down)menu=true;},menu:a=>calls.push(['menu',a]),isMenu:()=>menu,disconnected:()=>disconnects++},()=>pad?[pad]:[]);
 input.poll();pad.axes[0]=.1;input.poll();assert.equal(calls.length,0);pad.axes[0]=.8;input.poll();input.poll();assert.deepEqual(calls,[['right',true]]);
 pad.axes[0]=0;pad.buttons[9].pressed=true;input.poll();input.poll();assert.equal(calls.some(c=>c[0]==='menu'),false);
 pad.buttons[9].pressed=false;input.poll();pad.buttons[0].pressed=true;input.poll();assert.deepEqual(calls.at(-1),['menu','confirm']);
 pad=null;input.poll();assert.equal(disconnects,1);
});
