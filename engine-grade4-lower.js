import {SCHOOL,DAY,FORECASTS,WEATHER,VEG,HERD,CLOTHES,SHOP,G4L_PHONICS,schoolNode,clockNode,weatherNode,ownerNode,interpretGrade4LowerSpeech} from './curriculum-grade4-lower.js';
export const grade4LowerBlank=()=>({g4l:{floor:1,visited:[],homework:false,hour:6,minute:0,activity:null,day:0,trip:0,weather:{},gear:{},harvested:[],basket:[],pens:[],sorted:[],size:null,bought:[],stage:0}});
const unique=(a,allowed)=>Array.isArray(a)?[...new Set(a.filter(x=>allowed.includes(x)))]:[];
export const clockRound=(c,g)=>c.id==='g4lr1'?DAY[5]:DAY[Math.min(g.day,DAY.length-1)];
export const forecastRound=(c,g)=>FORECASTS[c.id==='g4lr1'?0:Math.min(g.trip,2)];
export const farmVegetables=c=>c.id==='g4lr2'?['tomato','carrot']:VEG;
export const farmAnimals=c=>c.id==='g4lr2'?HERD.filter(a=>a.word==='sheep'):HERD;
export const ownerItems=c=>c.id==='g4lr2'?CLOTHES.filter(a=>['coat','pants'].includes(a.word)):CLOTHES;
export const coins=g=>25-g.bought.reduce((sum,w)=>sum+(SHOP.find(i=>i.word===w)?.price||0),0);
export const G4L_NEAR_ACTIONS=['school-visit','homework','day-start','travel','harvest-vegetable','pass-stage','market-finish'];
export function grade4LowerGoals(id,s){const g=s.g4l,t=s.talks;
 switch(id){
 case 'g4l1':return [SCHOOL.every(r=>g.visited.includes(r.word)),g.homework&&!!t.schoolWhere,!!t.schoolLibrary&&!!t.schoolComputer];
 case 'g4l2':return [DAY.every((_,i)=>t[`clock-${i}-time`]),DAY.every((_,i)=>t[`clock-${i}-activity`]),g.day===DAY.length];
 case 'g4l3':return [FORECASTS.every(f=>g.weather[f.city]===f.weather),FORECASTS.every(f=>g.gear[f.city]===f.gear),g.trip===3];
 case 'g4lr1':return [g.stage>=1,g.stage>=2,g.stage>=3];
 case 'g4l4':return [VEG.every(w=>g.basket.includes(w)),HERD.every(a=>g.pens.includes(a.word)),!!t.farmThese&&!!t.farmThose&&!!t.farmCount];
 case 'g4l5':return [CLOTHES.every(a=>g.sorted.includes(a.word)),!!t.ownerCoat&&!!t.ownerPants,!!t.ownerSocks];
 case 'g4l6':return [!!t.shopTry&&!!t.shopSmall&&!!t.shopRight,!!t.shopPrice&&!!t.shopExpensive,['umbrella','scarf'].every(w=>g.bought.includes(w))];
 case 'g4lr2':return [g.stage>=1,g.stage>=2,g.stage>=3];
 }return [false,false,false];
}
export function grade4LowerDrop(c,s,item,zone,emit){const g=s.g4l;let changed=false;
 if(c.id==='g4l2'||c.id==='g4lr1'&&g.stage===1){if(zone==='schedule'&&DAY.some(r=>r.activity===item)){g.activity=item;changed=true;}}
 if(c.id==='g4l3'||c.id==='g4lr1'&&g.stage===2){const f=forecastRound(c,g);if(zone==='forecast'&&WEATHER.includes(item)){g.weather[f.city]=item;changed=true;}if(zone==='gear'&&['umbrella','scarf','hat','sunglasses','gloves'].includes(item)){g.gear[f.city]=item;changed=true;}}
 if(c.id==='g4l4'||c.id==='g4lr2'&&g.stage===0){if(zone==='basket'&&farmVegetables(c).includes(item)&&!g.basket.includes(item)){if(!g.harvested.includes(item)){emit('先走近菜地，点一次收获，再装进篮子。');return false;}g.basket.push(item);changed=true;}if(farmAnimals(c).some(a=>a.word===item)&&zone===`pen-${item}`&&!g.pens.includes(item)){g.pens.push(item);changed=true;}}
 if(c.id==='g4l5'||c.id==='g4lr2'&&g.stage===1){const entry=ownerItems(c).find(a=>a.word===item);if(entry&&zone===`owner-${entry.owner}`&&!g.sorted.includes(item)){g.sorted.push(item);changed=true;}else if(entry)emit('再看一下姓名标签：衣物需要归还给正确的主人。');}
 if(c.id==='g4l6'||c.id==='g4lr2'&&g.stage===2){const goods=SHOP.find(i=>i.word===item);if(zone==='checkout'&&goods&&!g.bought.includes(item)){if(c.id==='g4l6'&&!s.talks.shopExpensive||c.id==='g4lr2'&&!s.talks.marketPrice){emit('先完成试穿和问价对话，再到收银台购买。');return false;}if(goods.price>coins(g)){emit('游戏币不够！选择便宜一些的物品，或退回已买物品。');return false;}g.bought.push(item);changed=true;}}
 if(changed)emit('操作成功！继续观察、安排和对话。',true);return changed;
}
export function grade4LowerAction(c,s,name,value,near,emit){const g=s.g4l,t=s.talks;
 if(G4L_NEAR_ACTIONS.includes(name)&&!near){emit('先走近目标，再点一次或按 E。');return false;}
 const school=c.id==='g4l1'||c.id==='g4lr1'&&g.stage===0;
 if(school){if(name==='floor'&&[1,2].includes(Number(value))){g.floor=Number(value);return true;}if(name==='school-visit'){const room=SCHOOL.find(r=>r.word===value);if(!room||room.floor!==g.floor||g.visited.includes(value))return false;g.visited.push(value);emit(`探索了 ${value}！`,true);return true;}if(name==='homework'){if(g.floor!==2||!g.visited.includes("teachers' office")||!t.schoolWhere){emit('先在二楼探索办公室，报出位置后再交作业。');return false;}if(!g.homework){g.homework=true;emit('老师收到作业了，谢谢你！',true);return true;}}}
 if(c.id==='g4l2'||c.id==='g4lr1'&&g.stage===1){if(name==='hour'&&Number.isInteger(Number(value))&&Number(value)>=1&&Number(value)<=12){g.hour=Number(value);return true;}if(name==='minute'&&[0,30].includes(Number(value))){g.minute=Number(value);return true;}if(name==='day-start'){const i=c.id==='g4lr1'?0:g.day,r=clockRound(c,g);if(g.day>=DAY.length||g.hour!==r.hour||g.minute!==r.minute||g.activity!==r.activity||!t[`clock-${i}-time`]||!t[`clock-${i}-activity`]){emit('时钟和活动都要与日程卡相符，再完成两句英语报告。');return false;}if(c.id==='g4lr1')g.stage=2;else {g.day++;g.activity=null;}emit('日程启动啦！',true);return true;}}
 if(c.id==='g4l3'||c.id==='g4lr1'&&g.stage===2){if(name==='travel'){const i=c.id==='g4lr1'?0:g.trip,f=forecastRound(c,g);if(g.trip>=3||g.weather[f.city]!==f.weather||g.gear[f.city]!==f.gear||!t[`weather-${i}-forecast`]||!t[`weather-${i}-outside`]){emit('配好天气与装备，播报天气并决定能否去户外。');return false;}if(c.id==='g4lr1')g.stage=3;else g.trip++;emit(f.outside?'晴天行程安排好了！':'室内行程安排好了！',true);return true;}}
 if((c.id==='g4l4'||c.id==='g4lr2'&&g.stage===0)&&name==='harvest-vegetable'&&farmVegetables(c).includes(value)&&!g.harvested.includes(value)){g.harvested.push(value);emit(`收获 ${value}，把它装进篮子。`,true);return true;}
 if(c.id==='g4l6'&&name==='size'&&[5,6,7].includes(Number(value))){if(!t.shopTry){emit('先向店员请求试穿。');return false;}if(Number(value)===6&&!t.shopSmall){emit('先试 5 号，说出它太小，再换 6 号。');return false;}g.size=Number(value);return true;}
 if((c.id==='g4l6'||c.id==='g4lr2'&&g.stage===2)&&name==='return-item'&&g.bought.includes(value)){g.bought=g.bought.filter(w=>w!==value);emit('物品已原价退回，游戏币恢复。');return true;}
 if(c.id==='g4lr1'&&g.stage===0&&name==='pass-stage'){if(g.homework&&t.schoolWhere){g.stage=1;return true;}emit('先找到办公室、报告楼层并交作业。');}
 if(c.id==='g4lr2'&&name==='pass-stage'){if(g.stage===0&&['tomato','carrot'].every(w=>g.basket.includes(w))&&g.pens.includes('sheep')&&t.farmThese&&t.farmCount){g.stage=1;return true;}if(g.stage===1&&['coat','pants'].every(w=>g.sorted.includes(w))&&t.ownerCoat&&t.ownerPants){g.stage=2;return true;}emit('把当前幕的实物任务和英语报告都做完，再去通行门。');}
 if(c.id==='g4lr2'&&g.stage===2&&name==='market-finish'&&t.marketPrice&&g.bought.includes('umbrella')){g.stage=3;emit('雨伞买好了，四年级下册冒险完成！',true);return true;}
 return false;
}
export function grade4LowerPhonics(c,s,w,p){if(!c.phonics.includes(w)||G4L_PHONICS[w]!==p)return false;if(!s.phonics.includes(w))s.phonics.push(w);return true;}
function savedNode(key,c,g){if(key==='schoolWhere')return schoolNode();if(key==='schoolLibrary')return {mode:'library'};if(key==='schoolComputer')return {mode:'computer'};
 let m=key.match(/^clock-(\d+)-(time|activity)$/);if(m){const i=Number(m[1]),r=c.id==='g4lr1'?i===0&&DAY[5]:DAY[i];return r?{mode:m[2],round:r}:null;}
 m=key.match(/^weather-(\d+)-(forecast|outside)$/);if(m){const i=Number(m[1]),f=c.id==='g4lr1'?i===0&&FORECASTS[0]:FORECASTS[i];return f?{mode:m[2],forecast:f}:null;}
 return {farmThese:{mode:'tomatoes'},farmThose:{mode:'horses'},farmCount:{mode:'sheepCount'},ownerCoat:ownerNode('ownerCoat','coat'),ownerPants:ownerNode('ownerPants','pants'),ownerSocks:ownerNode('ownerSocks','socks'),shopTry:{mode:'try'},shopSmall:{mode:'small'},shopRight:{mode:'right'},shopPrice:{mode:'askPrice'},shopExpensive:{mode:'expensive'},marketPrice:{mode:'umbrellaPrice'}}[key];
}
export function restoreGrade4Lower(r,c){const s=grade4LowerBlank(),g=s.g4l,v=r.g4l||{};g.floor=[1,2].includes(v.floor)?v.floor:1;g.visited=unique(v.visited,SCHOOL.map(r=>r.word));g.homework=v.homework===true&&g.visited.includes("teachers' office");g.hour=Number.isInteger(v.hour)&&v.hour>=1&&v.hour<=12?v.hour:6;g.minute=v.minute===30?30:0;g.activity=DAY.some(r=>r.activity===v.activity)?v.activity:null;g.day=Number.isInteger(v.day)?Math.max(0,Math.min(DAY.length,v.day)):0;g.trip=Number.isInteger(v.trip)?Math.max(0,Math.min(3,v.trip)):0;
 for(const f of FORECASTS){if(WEATHER.includes(v.weather?.[f.city]))g.weather[f.city]=v.weather[f.city];if(['umbrella','scarf','hat','sunglasses','gloves'].includes(v.gear?.[f.city]))g.gear[f.city]=v.gear[f.city];}
 g.harvested=unique(v.harvested,farmVegetables(c));g.basket=unique(v.basket,g.harvested);g.pens=unique(v.pens,farmAnimals(c).map(a=>a.word));g.sorted=unique(v.sorted,ownerItems(c).map(a=>a.word));g.size=[5,6,7].includes(v.size)?v.size:null;for(const item of unique(v.bought,SHOP.map(i=>i.word)))if((SHOP.find(i=>i.word===item)?.price||0)<=coins(g))g.bought.push(item);g.stage=Number.isInteger(v.stage)?Math.max(0,Math.min(3,v.stage)):0;s.phonics=unique(r.phonics,c.phonics);return s;
}
export function restoreGrade4LowerTalks(r,c,s){const g=s.g4l;const allowed={g4l1:['schoolWhere','schoolLibrary','schoolComputer'],g4l2:DAY.flatMap((_,i)=>[`clock-${i}-time`,`clock-${i}-activity`]),g4l3:FORECASTS.flatMap((_,i)=>[`weather-${i}-forecast`,`weather-${i}-outside`]),g4lr1:['schoolWhere','clock-0-time','clock-0-activity','weather-0-forecast','weather-0-outside'],g4l4:['farmThese','farmThose','farmCount'],g4l5:['ownerCoat','ownerPants','ownerSocks'],g4l6:['shopTry','shopSmall','shopRight','shopPrice','shopExpensive'],g4lr2:['farmThese','farmCount','ownerCoat','ownerPants','marketPrice']}[c.id]||[];
 for(const key of allowed){const rec=r.talks?.[key],n=savedNode(key,c,g);if(!rec||!n||!['voice','text'].includes(rec.mode))continue;const result=interpretGrade4LowerSpeech(rec.text,n);if(result.ok)s.talks[key]={mode:rec.mode,text:String(rec.text).slice(0,160),value:result.value};}
 if(!s.talks.schoolWhere)g.homework=false;
 let day=0;while(day<g.day&&s.talks[`clock-${day}-time`]&&s.talks[`clock-${day}-activity`])day++;g.day=day;
 let trip=0;while(trip<g.trip){const f=FORECASTS[trip];if(g.weather[f.city]!==f.weather||g.gear[f.city]!==f.gear||!s.talks[`weather-${trip}-forecast`]||!s.talks[`weather-${trip}-outside`])break;trip++;}g.trip=trip;
 if(!s.talks.shopTry)g.size=null;if(c.id==='g4l6'&&!s.talks.shopExpensive||c.id==='g4lr2'&&!s.talks.marketPrice)g.bought=[];
 if(c.id==='g4lr1'){const stage=g.stage;g.stage=0;if(stage>=1&&g.homework&&s.talks.schoolWhere)g.stage=1;if(stage>=2&&g.stage===1&&s.talks['clock-0-time']&&s.talks['clock-0-activity'])g.stage=2;if(stage>=3&&g.stage===2&&g.weather['New York']==='rainy'&&g.gear['New York']==='umbrella'&&s.talks['weather-0-forecast']&&s.talks['weather-0-outside'])g.stage=3;}
 if(c.id==='g4lr2'){const stage=g.stage;g.stage=0;if(stage>=1&&['tomato','carrot'].every(w=>g.basket.includes(w))&&g.pens.includes('sheep')&&s.talks.farmThese&&s.talks.farmCount)g.stage=1;if(stage>=2&&g.stage===1&&['coat','pants'].every(w=>g.sorted.includes(w))&&s.talks.ownerCoat&&s.talks.ownerPants)g.stage=2;if(stage>=3&&g.stage===2&&g.bought.includes('umbrella')&&s.talks.marketPrice)g.stage=3;}
}
