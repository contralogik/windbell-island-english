import {CLASSROOM_ITEMS,CLEAN_SPOTS,BAG_ITEMS,LOCKERS,FRIEND_ROUNDS,ROOMS,DISHES,CUTLERY,DINNER_ORDERS,FINAL_ORDERS,STORY_FAMILY,RELAY,G4_PHONICS,interpretGrade4Speech,ordersReady} from './curriculum-grade4.js';
export const grade4Blank=()=>({g4:{placed:[],cleaned:[],brush:false,bagFound:false,lockers:[],loot:[],bagPacked:{},friendsFound:[],friendGuess:null,relayDelivered:[],relayStamps:[],homeRooms:[],homeKeys:false,pan:null,cooked:[],dinnerServed:{},dinnerTools:{},ownMeal:[],ownUtensils:null,familySlots:[],jobs:{},careerTools:[],finalKeys:false,finalStage:0}});
const unique=(a,allowed)=>Array.isArray(a)?[...new Set(a.filter(x=>allowed.includes(x)))]:[];
const prefix=a=>{let length=0;while(a.includes(length))length++;return Array.from({length},(_,i)=>i);};
export function restoreGrade4(r,c){const s=grade4Blank(),g=s.g4,v=r.g4||{};
 g.placed=unique(v.placed,CLASSROOM_ITEMS);g.cleaned=unique(v.cleaned,CLEAN_SPOTS);g.brush=v.brush===true;
 g.bagFound=v.bagFound===true;g.lockers=unique(v.lockers,[0,1,2,3]);g.loot=unique(v.loot,g.lockers.flatMap(i=>LOCKERS[i]));
 for(const [word,number] of Object.entries(BAG_ITEMS))if(g.bagFound&&g.loot.includes(word)&&v.bagPacked?.[word]===number)g.bagPacked[word]=number;
 g.friendsFound=prefix(unique(v.friendsFound,[0,1,2]));g.friendGuess=FRIEND_ROUNDS.some(f=>f.name===v.friendGuess)?v.friendGuess:null;
 g.relayDelivered=unique(v.relayDelivered,[0,1,2]);g.relayStamps=prefix(unique(v.relayStamps,g.relayDelivered));
 g.homeRooms=unique(v.homeRooms,[...ROOMS,'door']);g.homeKeys=v.homeKeys===true&&g.homeRooms.includes('door');
 g.pan=DISHES.includes(v.pan)?v.pan:null;g.cooked=unique(v.cooked,DISHES);
 const orders=c.id==='g4r2'?FINAL_ORDERS:DINNER_ORDERS;
 for(const o of orders){if(v.dinnerServed?.[o.who])g.dinnerServed[o.who]=unique(v.dinnerServed[o.who],o.items.filter(w=>g.cooked.includes(w)));if(v.dinnerTools?.[o.who])g.dinnerTools[o.who]=unique(v.dinnerTools[o.who],o.tools);}
 g.familySlots=unique(v.familySlots,STORY_FAMILY.map(f=>f.id));
 for(const f of STORY_FAMILY)if(f.job&&g.familySlots.includes(f.id)&&v.jobs?.[f.id]===f.job)g.jobs[f.id]=f.job;
 g.careerTools=unique(v.careerTools,STORY_FAMILY.filter(f=>g.jobs[f.id]===f.job&&f.job).map(f=>f.id));
 g.finalKeys=v.finalKeys===true;g.finalStage=Number.isInteger(v.finalStage)?Math.max(0,Math.min(3,v.finalStage)):0;
 s.phonics=unique(r.phonics,c.phonics);return s;
}
function savedNode(key){
 const modes={classroom:'classroom',pictureLocation:'pictureLocation',cleanOffer:'cleanOffer',bagColour:'bagColour',bagContents:'bagContents',friendLook:'friendLook','relay-0':'pictureLocation','relay-1':'relayBag',homeNo:'homeNo',homeWhere:'homeWhere',dinnerRequest:'dinnerRequest',dinnerUtensils:'dinnerUtensils',familyCount:'familyCount',familyUncle:'familyUncle',finalMeal:'finalMeal',finalCount:'familyCount'};
 if(modes[key])return {mode:modes[key]};
 if(/^friend-[0-2]$/.test(key)){const f=FRIEND_ROUNDS[Number(key.slice(-1))];return {mode:'friendName',expected:f.name,pronoun:f.pronoun};}
 if(key==='relay-2')return {mode:'friendName',expected:'Mike',pronoun:'he'};
 if(key==='homeKeys')return {mode:'keysLocation',expected:'in the door'};
 if(key==='finalKeys')return {mode:'keysLocation',expected:'on the sofa'};
 if(['familyAunt','finalAunt'].includes(key))return {mode:'job',expected:'nurse',pronoun:'she'};
 if(key==='familyFather')return {mode:'job',expected:'doctor',pronoun:'he'};
 if(key==='finalTools')return {mode:'passUtensil',expected:'chopsticks'};
 return null;
}
export function restoreGrade4Talks(r,c,s){
 const allowed={g41:['classroom','pictureLocation','cleanOffer'],g42:['bagColour','bagContents'],g43:['friend-0','friend-1','friend-2','friendLook'],g4r1:['relay-0','relay-1','relay-2'],g44:['homeNo','homeWhere','homeKeys'],g45:['dinnerRequest','dinnerUtensils','dinnerPass'],g46:['familyCount','familyUncle','familyAunt','familyFather'],g4r2:['finalKeys','finalMeal','finalTools','finalAunt','finalCount']}[c.id]||[];
 for(const key of allowed){const record=r.talks?.[key];if(!record||!['voice','text'].includes(record.mode))continue;const n=key==='dinnerPass'?{mode:'passUtensil',expected:s.talks.dinnerUtensils?.value==='fork'?'fork':'chopsticks'}:savedNode(key);if(!n)continue;const result=interpretGrade4Speech(record.text,n);if(result.ok)s.talks[key]={mode:record.mode,text:String(record.text).slice(0,160),value:result.value};}
 const g=s.g4;g.friendsFound=prefix(g.friendsFound.filter(i=>s.talks[`friend-${i}`]));
 if(g.friendGuess!==FRIEND_ROUNDS[g.friendsFound.length]?.name)g.friendGuess=null;
 g.relayStamps=prefix(g.relayStamps.filter(i=>s.talks[`relay-${i}`]));
 g.ownMeal=s.talks.dinnerRequest?.value||s.talks.finalMeal?.value||[];g.ownUtensils=s.talks.dinnerUtensils?.value||null;
 if(c.id==='g4r2'){
  const savedStage=g.finalStage;g.finalStage=0;
  if(savedStage>=1&&g.finalKeys&&s.talks.finalKeys)g.finalStage=1;
  if(savedStage>=2&&g.finalStage===1&&ordersReady(g,FINAL_ORDERS)&&s.talks.finalMeal&&s.talks.finalTools)g.finalStage=2;
  if(savedStage===3&&g.finalStage===2&&g.jobs.aunt==='nurse'&&g.jobs.uncle==='driver'&&s.talks.finalAunt&&s.talks.finalCount)g.finalStage=3;
 }
}
export function grade4Goals(id,s){const g=s.g4,t=s.talks;
 switch(id){
 case 'g41':return [CLASSROOM_ITEMS.every(w=>g.placed.includes(w)),CLEAN_SPOTS.every(w=>g.cleaned.includes(w)),!!t.classroom&&!!t.pictureLocation&&!!t.cleanOffer];
 case 'g42':return [g.bagFound,Object.entries(BAG_ITEMS).every(([w,n])=>g.bagPacked[w]===n),!!t.bagColour&&!!t.bagContents];
 case 'g43':return [g.friendsFound.length===3,[0,1,2].every(i=>!!t[`friend-${i}`]),!!t.friendLook];
 case 'g4r1':return [0,1,2].map(i=>g.relayStamps.includes(i));
 case 'g44':return [ROOMS.every(r=>g.homeRooms.includes(r)),!!t.homeNo&&!!t.homeWhere,g.homeKeys&&!!t.homeKeys];
 case 'g45':return [DISHES.every(w=>g.cooked.includes(w)),ordersReady(g,DINNER_ORDERS),!!t.dinnerRequest&&!!t.dinnerUtensils&&!!t.dinnerPass];
 case 'g46':return [g.familySlots.length===6,STORY_FAMILY.filter(f=>f.job).every(f=>g.jobs[f.id]===f.job&&g.careerTools.includes(f.id)),!!t.familyCount&&!!t.familyUncle&&!!t.familyAunt&&!!t.familyFather];
 case 'g4r2':return [g.finalStage>=1,g.finalStage>=2,g.finalStage>=3];
 }return [false,false,false];
}
export function grade4Drop(c,s,item,zone,emit){const g=s.g4;let changed=false;
 if(c.id==='g41'&&zone===`classroom-${item}`&&CLASSROOM_ITEMS.includes(item)&&!g.placed.includes(item)){g.placed.push(item);changed=true;}
 if(c.id==='g42'&&zone==='schoolbag'&&Object.hasOwn(BAG_ITEMS,item)){
  if(!g.bagFound)emit('先报告颜色，领回自己的蓝白书包。');else if(!g.loot.includes(item))emit('失物柜里还没找到这件用品，先走过去搜寻。');else if(!g.bagPacked[item]){g.bagPacked[item]=BAG_ITEMS[item];changed=true;}
 }
 if(c.id==='g4r1'){const index=g.relayStamps.length,parcel=RELAY[index];if(parcel&&item===parcel.item&&zone===`relay-${index}`&&!g.relayDelivered.includes(index)){g.relayDelivered.push(index);changed=true;}else emit('按接力路线依次送包裹，先完成当前站。');}
 if(c.id==='g45'||c.id==='g4r2'&&g.finalStage===1){
  if(zone==='prep'&&DISHES.includes(item)){if(g.pan)emit('备餐台上还有一道菜，先走近按 E 准备好。');else if(!g.cooked.includes(item)){g.pan=item;changed=true;}}
  const orders=c.id==='g4r2'?FINAL_ORDERS:DINNER_ORDERS,order=orders.find(o=>zone===`dinner-${o.who}`);
  if(order){if(order.items.includes(item)){if(!g.cooked.includes(item))emit('这道菜还没准备好，先放到备餐台处理。');else{g.dinnerServed[order.who]??=[];if(!g.dinnerServed[order.who].includes(item)){g.dinnerServed[order.who].push(item);changed=true;}}}else if(order.tools.includes(item)){g.dinnerTools[order.who]??=[];if(!g.dinnerTools[order.who].includes(item)){g.dinnerTools[order.who].push(item);changed=true;}}else emit(`${order.name} 需要的是订单里的菜和餐具，再看一下。`);}
 }
 if(c.id==='g46'||c.id==='g4r2'&&g.finalStage>=2){
  const f=STORY_FAMILY.find(f=>zone===`family-${f.id}`||zone===`career-${f.id}`);if(f){
   if(zone===`family-${f.id}`&&item===f.word&&!g.familySlots.includes(f.id)){g.familySlots.push(f.id);changed=true;}
   else if(zone===`career-${f.id}`&&f.job){if(!g.familySlots.includes(f.id))emit('先把这个家人的照片拼回相册。');else if(item===f.job&&g.jobs[f.id]!==f.job){g.jobs[f.id]=f.job;changed=true;}else if(item===f.tool&&g.jobs[f.id]===f.job&&!g.careerTools.includes(f.id)){g.careerTools.push(f.id);changed=true;}else emit('看这位家人的工作提示，先配职业牌，再送正确工具。');}
  }
 }
 if(changed)emit('放好了！继续探索和对话。',true);return changed;
}
export const G4_NEAR_ACTIONS=['clean','locker','pick-bag','friend','stamp','visit-room','prepare','final-search','final-open','final-bell','final-photo'];
export function grade4Action(c,s,name,value,near,emit){const g=s.g4;
 if(G4_NEAR_ACTIONS.includes(name)&&!near){emit('先走近目标，再点一次或按 E。');return false;}
 if(c.id==='g41'){
  if(name==='broom'){g.brush=!g.brush;emit(g.brush?'拿好扫帚了，走近三处污渍清扫。':'放下扫帚了。');return true;}
  if(name==='clean'&&CLEAN_SPOTS.includes(value)&&!g.cleaned.includes(value)){if(!g.brush){emit('先点击扫帚拿起清扫工具。');return false;}if(value!=='floor'&&!g.placed.includes(value)){emit('先把这里的设施布置好。');return false;}g.cleaned.push(value);emit('擦干净啦！',true);return true;}
 }
 if(c.id==='g42'){
  if(name==='pick-bag'){if(!s.talks.bagColour){emit('先回答失物管理员：你的书包是什么颜色？');return false;}if(value!=='blue and white'){emit('这不是蓝白书包，再观察颜色。');return false;}if(!g.bagFound){g.bagFound=true;return true;}}
  if(name==='locker'&&Number.isInteger(value)&&value>=0&&value<4&&!g.lockers.includes(value)){if(!g.bagFound){emit('先领回你的书包，再去失物柜搜用品。');return false;}g.lockers.push(value);LOCKERS[value].forEach(w=>{if(!g.loot.includes(w))g.loot.push(w);});emit(`找到了 ${LOCKERS[value].join(' and ')}！`,true);return true;}
 }
 if(c.id==='g43'&&name==='friend'&&g.friendsFound.length<3){const friend=FRIEND_ROUNDS[g.friendsFound.length];if(value!==friend.name){emit('这位朋友不符合当前外貌线索，看看头发、眼镜和鞋子的颜色。');return false;}g.friendGuess=value;emit('外貌线索吻合！开口介绍名字。',true);return true;}
 if(c.id==='g4r1'&&name==='stamp'&&value===g.relayStamps.length&&value<3){if(!g.relayDelivered.includes(value)||!s.talks[`relay-${value}`]){emit('先送好包裹，并完成英语报告。');return false;}g.relayStamps.push(value);emit('通行章盖好了，下一站开放！',true);return true;}
 if(c.id==='g44'&&name==='visit-room'&&[...ROOMS,'door'].includes(value)&&!g.homeRooms.includes(value)){g.homeRooms.push(value);if(value==='door')g.homeKeys=true;emit(value==='study'?'找到 Amy 了！告诉伙伴她的位置。':value==='door'?'找到门上的钥匙了！用 they 报告位置。':'这里探索过啦，去下一间看看。',true);return true;}
 if((c.id==='g45'||c.id==='g4r2'&&g.finalStage===1)&&name==='prepare'&&g.pan){g.cooked.push(g.pan);emit(`${g.pan} 准备好了，可以送餐！`,true);g.pan=null;return true;}
 if(c.id==='g4r2'){
  if(name==='final-search'&&g.finalStage===0&&value==='sofa'&&!g.finalKeys){g.finalKeys=true;emit('找到沙发上的钥匙了，报告位置再去开门。',true);return true;}
  if(name==='final-open'&&g.finalStage===0){if(!g.finalKeys||!s.talks.finalKeys){emit('先搜沙发找到钥匙，用英语报告它们的位置。');return false;}g.finalStage=1;emit('门打开啦！第二幕：准备家庭晚餐。',true);return true;}
  if(name==='final-bell'&&g.finalStage===1){if(!ordersReady(g,FINAL_ORDERS)||!s.talks.finalMeal||!s.talks.finalTools){emit('先送好晚餐和餐具，完成两句英语。');return false;}g.finalStage=2;g.familySlots=STORY_FAMILY.map(f=>f.id);emit('开饭啦！最后一幕：职业介绍和家庭合影。',true);return true;}
  if(name==='final-photo'&&g.finalStage===2){if(g.jobs.aunt!=='nurse'||g.jobs.uncle!=='driver'||!s.talks.finalAunt||!s.talks.finalCount){emit('先配好两张职业牌，介绍 aunt 并报告合影人数。');return false;}g.finalStage=3;emit('合影完成！四年级上册冒险通关啦！',true);return true;}
 }
 return false;
}
export function applyGrade4Talk(c,s,n,r){const g=s.g4;if(c.id==='g43'&&/^friend-[0-2]$/.test(n.key)){const i=Number(n.key.slice(-1));if(i===g.friendsFound.length)g.friendsFound.push(i);g.friendGuess=null;}
 if(['dinnerRequest','finalMeal'].includes(n.key))g.ownMeal=r.value;if(n.key==='dinnerUtensils')g.ownUtensils=r.value;
}
export function grade4Phonics(c,s,word,pattern){if(!c.phonics.includes(word)||G4_PHONICS[word]!==pattern)return false;if(!s.phonics.includes(word))s.phonics.push(word);return true;}
