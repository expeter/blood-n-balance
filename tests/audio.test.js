import test from 'node:test';
import assert from 'node:assert/strict';
import {Sound} from '../src/audio.js';
import {freshState,loadState} from '../src/state.js';

test('new and legacy careers enable audio, while saved mute preferences stay muted',()=>{
 assert.equal(freshState().settings.sound,true);
 assert.equal(freshState().settings.music,true);
 const legacy={getItem:()=>JSON.stringify({version:1,settings:{sound:false,music:false}})};
 assert.equal(loadState(legacy).settings.sound,true);
 assert.equal(loadState(legacy).settings.music,true);
 const configured={getItem:()=>JSON.stringify({version:1,settings:{sound:false,music:false,audioConfigured:true}})};
 assert.equal(loadState(configured).settings.sound,false);
 assert.equal(loadState(configured).settings.music,false);
});

test('effects and music schedule audible tones after the browser unlocks audio',async()=>{
 const originalWindow=globalThis.window,originalDocument=globalThis.document;
 const originalInterval=globalThis.setInterval,originalClear=globalThis.clearInterval;
 let ticks=0,musicTick;
 class FakeAudioContext{
  constructor(){this.currentTime=1;this.sampleRate=100;this.destination={};this.state='suspended';this.oscillators=0;}
  resume(){this.state='running';return Promise.resolve();}
  createOscillator(){this.oscillators++;return {frequency:{setValueAtTime(){}},connect(){},start(){},stop(){},set type(_v){}};}
  createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}
 }
 globalThis.window={AudioContext:FakeAudioContext};globalThis.document={hidden:false};
 globalThis.setInterval=fn=>{musicTick=fn;return ++ticks;};globalThis.clearInterval=()=>{};
 try{
  const sound=new Sound({sound:true,music:false});sound.unlock();await Promise.resolve();
  sound.play('jump');sound.play('rocket-launch');sound.play('laser-warning');assert.equal(sound.ctx.oscillators,3);
  sound.settings.music=true;sound.unlock();await Promise.resolve();
  assert.equal(typeof musicTick,'function');const firstMusicTick=musicTick;musicTick();assert.equal(sound.ctx.oscillators,4);
  sound.unlock();assert.equal(musicTick,firstMusicTick,'repeated input must not restart the music loop');
  sound.settings.sound=false;sound.play('gold');assert.equal(sound.ctx.oscillators,4);
 }finally{
  globalThis.window=originalWindow;globalThis.document=originalDocument;
  globalThis.setInterval=originalInterval;globalThis.clearInterval=originalClear;
 }
});
