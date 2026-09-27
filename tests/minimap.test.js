import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMinimap} from '../src/minimap.js';

test('a collapsed minimap does not resize or draw into either canvas',()=>{
 const canvas={width:168,height:90,getBoundingClientRect:()=>({width:0,height:0}),getContext(){throw Error('Hidden map must not draw');}};
 renderMinimap({level:{}},canvas);
 assert.equal(canvas.width,168);assert.equal(canvas.height,90);
});

test('minimap draws into its own high-DPI surface without touching game state or the playfield',()=>{
 const calls=[],context=new Proxy({}, {get:(_,name)=>(...args)=>calls.push([name,...args])});
 const canvas={width:168,height:90,getBoundingClientRect:()=>({width:168,height:90}),getContext:()=>context};
 const game={level:{exit:{x:62,y:33}},worldW:1920,worldH:1080,solids:[{x:0,y:1020,w:1920,h:30}],gates:[],switches:[],sentries:[],traps:[],crumbles:[],platforms:[],devices:[],camera:{x:960,y:540},player:{x:1807,y:993,w:16,h:26},exitUnlocked:true};
 const before=JSON.stringify(game);
 Object.defineProperty(game,'ctx',{get(){throw Error('Minimap must never use the playfield canvas');}});
 const previous=Object.getOwnPropertyDescriptor(globalThis,'devicePixelRatio');
 Object.defineProperty(globalThis,'devicePixelRatio',{value:2,configurable:true});
 try{renderMinimap(game,canvas);}finally{if(previous)Object.defineProperty(globalThis,'devicePixelRatio',previous);else delete globalThis.devicePixelRatio;}
 assert.equal(canvas.width,336);assert.equal(canvas.height,180);
 assert.ok(calls.some(([name])=>name==='fillRect'));
 assert.equal(JSON.stringify(game),before);
});
