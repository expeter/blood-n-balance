import test from 'node:test';
import assert from 'node:assert/strict';
import {careerStartStage,createCareer,loadCareerBook,persistCareerBook,selectCareer} from '../src/careers.js';

function memoryStorage(seed={}){
 const values=new Map(Object.entries(seed).map(([key,value])=>[key,JSON.stringify(value)]));
 return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),read:key=>JSON.parse(values.get(key))};
}

test('legacy progress migrates into the default Player career with its unlocks, difficulty, and continue stage',()=>{
 const storage=memoryStorage({'n-momentum-v1':{version:1,coins:79,inventory:{shield:2},completed:{0:{best:21,clean:true,gold:4},2:{best:19,clean:false,gold:3}},settings:{difficulty:'hard',sound:true}}});
 const book=loadCareerBook(storage),player=book.profiles[0];
 assert.equal(book.activeId,'player');assert.equal(player.name,'Player');assert.equal(player.progress.coins,79);assert.equal(player.progress.inventory.shield,2);assert.equal(player.progress.settings.difficulty,'hard');assert.equal(player.progress.completed[0].best,21);assert.equal(careerStartStage(player),3);
});

test('new careers isolate all progress and survive selecting each career after reload',()=>{
 const storage=memoryStorage({'n-momentum-v1':{version:1,coins:79,completed:{0:{best:21,clean:true,gold:4}}}});
 const book=loadCareerBook(storage),player=book.profiles[0];
 persistCareerBook(storage,book,player,player.progress);
 const newRunner=createCareer(book,'  Kestrel  ','easy','kestrel');
 assert.equal(newRunner.name,'Kestrel');assert.equal(newRunner.progress.coins,40);assert.deepEqual(newRunner.progress.completed,{});assert.equal(newRunner.progress.settings.difficulty,'easy');
 newRunner.progress.coins=13;newRunner.progress.completed[0]={best:12,clean:false,gold:0,revision:3,difficulty:'easy'};
 persistCareerBook(storage,book,newRunner,newRunner.progress);
 const restored=loadCareerBook(storage);
 assert.equal(selectCareer(restored,'player').progress.coins,79);assert.equal(restored.activeId,'player');
 const selected=selectCareer(restored,'kestrel');assert.equal(restored.activeId,'kestrel');assert.equal(selected.progress.coins,13);assert.equal(selected.progress.completed[0].best,12);assert.equal(careerStartStage(selected),0);
});

test('career slots enforce names and an eight-career limit',()=>{
 const book=loadCareerBook(memoryStorage());
 assert.throws(()=>createCareer(book,'   ','medium','bad-name'),/Choose a name/);
 for(let i=1;i<8;i++)createCareer(book,`Runner ${i}`,'medium',`runner-${i}`);
 assert.equal(book.profiles.length,8);assert.throws(()=>createCareer(book,'Ninth','hard','runner-9'),/eight career slots/);
 assert.equal(selectCareer(book,'missing'),null);
});

test('career loading sanitizes invalid profiles and repairs the active selection',()=>{
 const storage=memoryStorage({'n-momentum-careers-v1':{version:1,activeId:'missing',profiles:[{id:'same',name:'First',progress:{version:1,coins:22}},{id:'same',name:'Duplicate',progress:{}},{id:'',name:'Invalid',progress:{}}]}});
 const book=loadCareerBook(storage);assert.equal(book.profiles.length,1);assert.equal(book.activeId,'same');assert.equal(book.profiles[0].progress.coins,22);
});
