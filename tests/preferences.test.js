import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTheme,setTheme} from '../src/preferences.js';

function storage(initial){let value=initial;return {getItem:()=>value,setItem:(_key,next)=>{value=next;},value:()=>value};}

test('global theme loads, applies to the document root, and persists across reloads',()=>{
 const saved=storage('light'),root={dataset:{}};
 assert.equal(loadTheme(saved),'light');assert.equal(setTheme(saved,root,'dark'),'dark');assert.equal(root.dataset.theme,'dark');assert.equal(saved.value(),'dark');
 assert.equal(loadTheme(saved),'dark');setTheme(saved,root,'light');assert.equal(root.dataset.theme,'light');assert.equal(loadTheme(saved),'light');
});

test('theme defaults safely and rejects unsupported values',()=>{
 assert.equal(loadTheme(storage(null)),'dark');assert.throws(()=>setTheme(storage(null),{dataset:{}},'sepia'),/light or dark/);
 assert.equal(loadTheme({getItem(){throw Error('blocked')}}),'dark');
});
