import {CHAPTERS,BOOKS,COLORS,STATIONERY,ANIMALS,ORDERS,FESTIVAL_ORDERS,PARTS,dialogue,interpretSpeech,chaptersForBook} from './curriculum.js';
import {lowerBlank,restoreLower,restoreLowerTalks,lowerGoals,lowerDrop,applyLowerTalk,lowerAction} from './engine-lower.js';
import {G4_BOOK} from './curriculum-grade4.js';
import {grade4Blank,restoreGrade4,restoreGrade4Talks,grade4Goals,grade4Drop,applyGrade4Talk,grade4Action,grade4Phonics} from './engine-grade4.js';
import {G4L_BOOK} from './curriculum-grade4-lower.js';
import {grade4LowerBlank,restoreGrade4Lower,restoreGrade4LowerTalks,grade4LowerGoals,grade4LowerDrop,grade4LowerAction,grade4LowerPhonics} from './engine-grade4-lower.js';
import {G5_BOOKS} from './curriculum-grade5.js';
import {grade5Blank,restoreGrade5,restoreGrade5Talks,grade5Goals,grade5Drop,grade5Action,grade5Phonics} from './engine-grade5.js';
import {G6_BOOKS} from './curriculum-grade6.js';
import {grade6Blank,restoreGrade6,restoreGrade6Talks,grade6Goals,grade6Drop,grade6Action,grade6Phonics} from './engine-grade6.js';
export const SAVE_KEY='windbell-island-v2';
export function freshProgress(){return {version:2,current:'u1',bookCurrent:Object.fromEntries(BOOKS.map(b=>[b.id,b.first])),completed:[],profile:{name:'Bella',drink:'milk',colour:'red',age:8,partyAge:6,country:'China',fruit:'apple',likesPears:true},lessons:{},replayHistory:{}};}
const blankLesson=()=>({packed:[],painted:{},parts:[],moves:[],photos:[],orders:{},plates:0,candles:0,talks:{},letters:[],actions:0,...lowerBlank(),...grade4Blank(),...grade4LowerBlank(),...grade5Blank(),...grade6Blank()});
const unique=(values,allowed)=>Array.isArray(values)?[...new Set(values.filter(x=>allowed.includes(x)))]:[];
export function restoreProgress(raw,allowTrial=false){
 const p=freshProgress();if(!raw||raw.version!==2)return p;
 const ids=CHAPTERS.map(c=>c.id);p.completed=unique(raw.completed,ids);p.current=ids.includes(raw.current)?raw.current:'u1';
 const profile=raw.profile||{};if(typeof profile.name==='string'&&/^[a-zA-Z][a-zA-Z '\-]{0,28}$/.test(profile.name))p.profile.name=profile.name;
 if(['milk','juice','water'].includes(profile.drink))p.profile.drink=profile.drink;
 if(Object.keys(COLORS).includes(profile.colour))p.profile.colour=profile.colour;
 if(Number.isInteger(profile.age)&&profile.age>=1&&profile.age<=10)p.profile.age=profile.age;
 if(['UK','USA','Canada','China'].includes(profile.country))p.profile.country=profile.country;
 if(['pear','apple','orange','banana','watermelon','strawberry','grape'].includes(profile.fruit))p.profile.fruit=profile.fruit;
 if(typeof profile.likesPears==='boolean')p.profile.likesPears=profile.likesPears;
 function restoreLesson(r,c){const l=blankLesson();
 l.packed=unique(r.packed,STATIONERY);l.parts=unique(r.parts,PARTS);l.photos=unique(r.photos,ANIMALS);l.moves=unique(r.moves,[0,1,2]);l.letters=unique(r.letters,[...c.letters]);
 for(const [k,v] of Object.entries(r.painted||{}))if(/^(tile|flag)-[0-7]$/.test(k)&&Object.keys(COLORS).includes(v))l.painted[k]=v;
 for(const [k,v] of Object.entries(r.talks||{}))if(['name','tool','bye','greet','colour','how','body','introduce','this','that','serve','drink','askAge','birthday','age','welcome','animal'].includes(k)&&['voice','text'].includes(v.mode))l.talks[k]={mode:v.mode,text:String(v.text||'').slice(0,160),value:v.value};
 const orders=c.id==='r2'?FESTIVAL_ORDERS:ORDERS;for(const o of orders)if(r.orders?.[o.who])l.orders[o.who]=unique(r.orders[o.who],o.items);
 if(c.book==='lower'){Object.assign(l,restoreLower(r,c));l.talks={};restoreLowerTalks(r,c,l);}
 if(c.book===G4_BOOK){Object.assign(l,restoreGrade4(r,c));l.talks={};restoreGrade4Talks(r,c,l);}
 if(c.book===G4L_BOOK){Object.assign(l,restoreGrade4Lower(r,c));l.talks={};restoreGrade4LowerTalks(r,c,l);}
 if(G5_BOOKS.includes(c.book)){Object.assign(l,restoreGrade5(r,c));l.talks={};restoreGrade5Talks(r,c,l);}
 if(G6_BOOKS.includes(c.book)){Object.assign(l,restoreGrade6(r,c));l.talks={};restoreGrade6Talks(r,c,l);}
 l.actions=Math.max(0,Math.min(10000,Math.floor(Number(r.actions)||0)));
 l.plates=Math.max(0,Math.min(10,Math.floor(Number(r.plates)||0)));l.candles=Math.max(0,Math.min(10,Math.floor(Number(r.candles)||0)));return l;
 }
 for(const c of CHAPTERS){
  if(raw.lessons?.[c.id])p.lessons[c.id]=restoreLesson(raw.lessons[c.id],c);
  if(raw.replayHistory?.[c.id]){const previous=restoreLesson(raw.replayHistory[c.id],c);if(isComplete(c.id,previous,p.profile))p.replayHistory[c.id]=previous;}
  if(p.lessons[c.id]&&isComplete(c.id,p.lessons[c.id],p.profile)&&!p.replayHistory[c.id])p.replayHistory[c.id]=JSON.parse(JSON.stringify(p.lessons[c.id]));
 }
 // Keep validated completion evidence when replaying; flags alone never unlock lessons.
 p.completed=ids.filter(id=>isComplete(id,p.lessons[id]||blankLesson(),p.profile)||!!p.replayHistory[id]);
 for(const {id:book} of BOOKS){const value=raw.bookCurrent?.[book];if(chaptersForBook(book).some(c=>c.id===value)&&(allowTrial||canEnter(p,value)))p.bookCurrent[book]=value;}
 const book=CHAPTERS.find(c=>c.id===p.current).book;
 if(!allowTrial&&!canEnter(p,p.current))p.current=chaptersForBook(book)[0].id;p.bookCurrent[book]=p.current;return p;
}
export function canEnter(p,id){const c=CHAPTERS.find(c=>c.id===id);if(!c)return false;const chapters=chaptersForBook(c.book),i=chapters.findIndex(c=>c.id===id);return i===0||p.completed.includes(id)||p.completed.includes(chapters[i-1]?.id);}
export function goals(id,s,profile){
 if(G6_BOOKS.includes(CHAPTERS.find(c=>c.id===id)?.book))return grade6Goals(CHAPTERS.find(c=>c.id===id),s);
 if(G5_BOOKS.includes(CHAPTERS.find(c=>c.id===id)?.book))return grade5Goals(CHAPTERS.find(c=>c.id===id),s);
 if(CHAPTERS.find(c=>c.id===id)?.book===G4L_BOOK)return grade4LowerGoals(id,s);
 if(CHAPTERS.find(c=>c.id===id)?.book===G4_BOOK)return grade4Goals(id,s);
 if(CHAPTERS.find(c=>c.id===id)?.book==='lower')return lowerGoals(id,s);
 const t=s.talks||{};
 switch(id){
 case 'u1':return [!!t.name,s.packed.length===7,!!t.tool];
 case 'u2':return [!!t.greet,Object.keys(COLORS).every((color,i)=>s.painted[`tile-${i}`]===color),!!t.colour];
 case 'u3':return [s.parts.length===4,!!t.how&&!!t.body,s.moves.length===3];
 case 'r1':return [s.painted['flag-0']==='red'&&s.painted['flag-1']==='yellow'&&s.painted['flag-2']==='blue',!!t.name&&!!t.introduce,s.moves.length===3];
 case 'u4':return [s.photos.length===10,!!t.this,!!t.that&&t.this?.value!==t.that?.value];
 case 'u5':return [ORDERS.every(o=>o.items.every(item=>s.orders[o.who]?.includes(item))),!!t.serve,!!t.drink];
 case 'u6':return [!!t.askAge,s.plates===5&&s.candles===profile.partyAge,!!t.birthday&&!!t.age];
 case 'r2':return [FESTIVAL_ORDERS.every(o=>o.items.every(item=>s.orders[o.who]?.includes(item))),s.plates===5,!!t.welcome&&!!t.animal];
 }
}
export function isComplete(id,s,profile){return goals(id,s,profile).every(Boolean);}
export function createAdventure(saved,onEvent=()=>{},initialTrial=false,options={}){
 const progress=restoreProgress(saved,initialTrial);let trial=!!initialTrial;
 const finishedRuns=new Set(CHAPTERS.filter(c=>isComplete(c.id,progress.lessons[c.id]||blankLesson(),progress.profile)).map(c=>c.id));
 const emit=(text,success=false)=>onEvent({type:'feedback',text,success});
 const lesson=()=>progress.lessons[progress.current]??=(blankLesson());
 const state=()=>({chapter:CHAPTERS.find(c=>c.id===progress.current),lesson:lesson(),profile:progress.profile,progress,trial});
 const check=()=>{const {chapter,lesson:s}=state();if(isComplete(chapter.id,s,progress.profile)&&!finishedRuns.has(chapter.id)){finishedRuns.add(chapter.id);progress.replayHistory[chapter.id]=JSON.parse(JSON.stringify(s));if(!progress.completed.includes(chapter.id))progress.completed.push(chapter.id);onEvent({type:'complete',chapter});}onEvent({type:'change'});};
 const go=(id)=>{const chapter=CHAPTERS.find(c=>c.id===id);if(!chapter)return false;if(!trial&&!canEnter(progress,id)){emit('先完成前一关，或在教材地图打开自由试学。');return false;}progress.current=id;progress.bookCurrent[chapter.book]=id;lesson();onEvent({type:'chapter'});return true;};
 function drop(item,zone){
  const {chapter:c,lesson:s}=state();let changed=false;
  if(G6_BOOKS.includes(c.book)){changed=grade6Drop(c,s,item,zone,emit);if(changed){s.actions++;check();}return changed;}
  if(G5_BOOKS.includes(c.book)){changed=grade5Drop(c,s,item,zone,emit);if(changed){s.actions++;check();}return changed;}
  if(c.book===G4L_BOOK){changed=grade4LowerDrop(c,s,item,zone,emit);if(changed){s.actions++;check();}return changed;}
  if(c.book===G4_BOOK){changed=grade4Drop(c,s,item,zone,emit);if(changed){s.actions++;check();}return changed;}
  if(c.book==='lower'){changed=lowerDrop(c,s,item,zone,emit);if(changed){s.actions++;check();}return changed;}
  if(c.kind==='pack'&&zone==='bag'&&STATIONERY.includes(item)){if(!s.packed.includes(item)){s.packed.push(item);changed=true;emit(`${item==='eraser'?'An':'A'} ${item} is in your bag!`,true);}}
  if(['paint','show'].includes(c.kind)&&Object.keys(COLORS).includes(item)&&/^(tile|flag)-[0-7]$/.test(zone)){
   const i=Number(zone.split('-')[1]),expected=c.kind==='paint'?Object.keys(COLORS)[i]:['red','yellow','blue'][i];
   s.painted[zone]=item;changed=true;emit(item===expected?`${item}! 这个机关亮起来了。`:`这里需要 ${expected}，试试换一种颜料。`,item===expected);
  }
  if(c.kind==='puppet'&&PARTS.includes(item)&&zone===`part-${item}`){if(!s.parts.includes(item)){s.parts.push(item);changed=true;emit(`This is the ${item}.`,true);}}
  if(['cafe','festival'].includes(c.kind)){const orders=c.kind==='cafe'?ORDERS:FESTIVAL_ORDERS,o=orders.find(o=>zone===`order-${o.who}`);if(o){if(o.items.includes(item)){s.orders[o.who]??=[];if(!s.orders[o.who].includes(item)){s.orders[o.who].push(item);changed=true;emit(`Here you are, ${o.name}!`,true);}}else emit(`${o.name} 的订单里没有 ${item}。拿回厨房，试试别的。`);}}
  if(c.kind==='party'&&item==='candle'&&zone==='cake'&&s.candles<10){s.candles++;changed=true;emit('再添一根蜡烛。');}
  if(['party','festival'].includes(c.kind)&&item==='plate'&&zone==='table'&&s.plates<10){s.plates++;changed=true;emit('再摆一个餐盘。');}
  if(changed){s.actions++;check();}return changed;
 }
 function talk(text,mode='voice'){
  const {chapter:c,lesson:s}=state();const node=dialogue(c.id,s,progress.profile);const r=interpretSpeech(text,node);
  if(!r.ok){emit(r.reason);return r;}
  if(c.id==='u4'&&node.key==='that'&&s.talks.this?.value===r.value){r.ok=false;r.reason='换一种你拍到的动物，告诉伙伴远处是谁。';emit(r.reason);return r;}
  s.talks[node.key]={mode:mode==='voice'?'voice':'text',text:String(text).slice(0,160),value:r.value};
  if(c.book==='lower')applyLowerTalk(c,s,node,r,progress.profile);
  if(c.book===G4_BOOK)applyGrade4Talk(c,s,node,r);
  if(node.mode==='name')progress.profile.name=r.value;
  if(node.mode==='drink')progress.profile.drink=r.value;
  if(node.mode==='colour')progress.profile.colour=r.value;
  if(node.mode==='age')progress.profile.age=r.value;
  r.reply=node.mode==='askAge'?"I'm six years old!":r.reply;check();onEvent({type:'reply',text:r.reply,value:r.value});return r;
 }
 function photograph(animal,visible){const s=lesson();if(progress.current!=='u4'||!ANIMALS.includes(animal))return false;if(!visible){emit('它藏进树丛了。等它现身再拍！');return false;}if(!s.photos.includes(animal)){s.photos.push(animal);s.actions++;emit(`拍到了 ${animal}！`,true);check();return true;}emit('这张已经在相册里啦，找找别的动物。');return false;}
 function move(index,action){const {chapter:c,lesson:s}=state();if(!['puppet','show'].includes(c.kind))return false;if(c.kind==='puppet'&&s.parts.length<4){emit('先把四组木偶零件装好。');return false;}if(action!==['wave','clap','stamp'][index]){emit('这个机关需要另一个动作。看一下舞台标记。');return false;}if(!s.moves.includes(index)){s.moves.push(index);emit('机关打开，木偶演出成功！',true);check();return true;}return false;}
 function count(type,delta){const s=lesson();if(!['plates','candles'].includes(type)||!['u6','r2'].includes(progress.current))return; s[type]=Math.max(0,Math.min(10,s[type]+delta));check();}
 function letter(upper,lower){const {chapter:c,lesson:s}=state();if(!c.letters.includes(upper)||upper.toLowerCase()!==lower)return false;if(!s.letters.includes(upper)){s.letters.push(upper);check();return true;}return false;}
 function resetChapter(){const {chapter:c,lesson:s}=state();if(isComplete(c.id,s,progress.profile))progress.replayHistory[c.id]=JSON.parse(JSON.stringify(s));progress.lessons[c.id]=blankLesson();finishedRuns.delete(c.id);onEvent({type:'chapter'});}
 function action(name,value,near=true){const {chapter:c,lesson:s}=state();if(!['lower',G4_BOOK,G4L_BOOK,...G5_BOOKS,...G6_BOOKS].includes(c.book))return false;const changed=G6_BOOKS.includes(c.book)?grade6Action(c,s,name,value,near,emit):G5_BOOKS.includes(c.book)?grade5Action(c,s,name,value,near,emit):c.book===G4L_BOOK?grade4LowerAction(c,s,name,value,near,emit):c.book===G4_BOOK?grade4Action(c,s,name,value,near,emit):lowerAction(c,s,name,value,near,emit,options.rng||Math.random);if(changed){s.actions++;check();}return changed;}
 function phonics(word,vowel){const {chapter:c,lesson:s}=state();if(G6_BOOKS.includes(c.book)){if(!grade6Phonics(c,s,word,vowel))return false;check();return true;}if(G5_BOOKS.includes(c.book)){if(!grade5Phonics(c,s,word,vowel))return false;check();return true;}if(c.book===G4L_BOOK){if(!grade4LowerPhonics(c,s,word,vowel))return false;check();return true;}if(c.book===G4_BOOK){if(!grade4Phonics(c,s,word,vowel))return false;check();return true;}if(c.book!=='lower'||!c.phonics.includes(word)||word.match(/[aeiou]/)?.[0]!==vowel)return false;if(!s.phonics.includes(word)){s.phonics.push(word);check();}return true;}
 function switchBook(book){const b=BOOKS.find(b=>b.id===book);if(!b)return false;const id=progress.bookCurrent[book]||b.first;return go(trial||canEnter(progress,id)?id:b.first);}
 return {state,go,drop,talk,photograph,move,count,letter,action,phonics,switchBook,resetChapter,setTrial(value){trial=!!value;onEvent({type:'change'});},snapshot:()=>JSON.parse(JSON.stringify(progress))};
}
