import {LOWER_CHAPTERS,GUESTS,FAMILY,FRUITS,FRUIT_ORDERS,TRAITS,FEATURES,TOYS,PLACES,COUNTRIES,boardChallenge,interpretLowerSpeech,COUNT_WORDS} from './curriculum-lower.js';
export const lowerBlank=()=>({passports:{},roles:{},familyFound:[],familyTree:[],observations:[],features:[],gates:[],toysFound:[],toysPlaced:{},searched:[],harvested:[],basket:Object.fromEntries(FRUITS.map(f=>[f,0])),fruitOrders:Object.fromEntries(FRUIT_ORDERS.map(o=>[o.who,[]])),gift:null,kites:[],crayons:[],launched:0,launchTarget:20,launchSuccess:[],phonics:[],board:{pos:0,turn:0,pending:null,bananas:0,grapes:0,lastDie:0}});
const unique=(a,valid)=>Array.isArray(a)?[...new Set(a.filter(x=>valid.includes(x)))]:[];
const count=(n,max)=>Number.isFinite(Number(n))?Math.max(0,Math.min(max,Math.floor(Number(n)))):0;
export function restoreLower(r,c){const s=lowerBlank();
 for(const g of GUESTS){if(r.passports?.[g.id]===g.country)s.passports[g.id]=g.country;if(r.roles?.[g.id]===g.role)s.roles[g.id]=g.role;}
 if(r.roles?.jones==='teacher')s.roles.jones='teacher';
 s.familyFound=unique(r.familyFound,FAMILY);s.familyTree=unique(r.familyTree,s.familyFound);
 s.observations=unique(r.observations,TRAITS.map(x=>x.word));s.features=unique(r.features,FEATURES);
 s.gates=unique(r.gates,[0,1,2]).sort();if(s.gates.some((x,i)=>x!==i))s.gates=[];
 s.toysFound=unique(r.toysFound,TOYS.map(t=>t.word));s.searched=unique(r.searched,PLACES);
 for(const t of TOYS)if(s.toysFound.includes(t.word)&&r.toysPlaced?.[t.word]===t.destination)s.toysPlaced[t.word]=t.destination;
 s.harvested=unique(r.harvested,FRUITS);for(const f of FRUITS)s.basket[f]=count(r.basket?.[f],20);
 for(const o of FRUIT_ORDERS)s.fruitOrders[o.who]=unique(r.fruitOrders?.[o.who],o.items);
 s.gift=FRUITS.includes(r.gift)?r.gift:null;
 s.kites=unique(r.kites,Array.from({length:12},(_,i)=>i));s.crayons=unique(r.crayons,Array.from({length:16},(_,i)=>i));s.launched=count(r.launched,20);s.launchTarget=Number.isInteger(r.launchTarget)&&r.launchTarget>=11&&r.launchTarget<=20?r.launchTarget:20;s.launchSuccess=unique(r.launchSuccess,Array.from({length:10},(_,i)=>i+11));s.phonics=unique(r.phonics,c.phonics);
 const b=r.board||{};s.board={pos:count(b.pos,20),turn:count(b.turn,2000),bananas:count(b.bananas,13),grapes:count(b.grapes,20),lastDie:count(b.lastDie,6),pending:null};
 if(b.pending&&Number.isInteger(b.pending.die)&&b.pending.die>=1&&b.pending.die<=6&&b.pending.landing===Math.min(20,s.board.pos+b.pending.die))s.board.pending={die:b.pending.die,landing:b.pending.landing};
 return s;
}
function savedNode(k){if(['origin','gateOrigin'].includes(k))return {mode:'origin'};if(k==='friend')return {mode:'friend'};if(k==='teacherIntro')return {mode:'teacherIntro'};if(['father','mother','gateFamily'].includes(k))return {mode:'family',expected:k==='mother'?'mother':'father'};if(k==='familyYes')return {mode:'familyYes'};if(k==='familyNo')return {mode:'familyNo'};if(k==='tall')return {mode:'trait'};if(['nose','gateAnimal'].includes(k))return {mode:'feature'};if(k.startsWith('where-')){const toy=TOYS.find(t=>k===`where-${t.word}`);if(toy)return {mode:'location',expected:toy.place};}if(k==='toyYes')return {mode:'toyYes'};if(k==='toyNo')return {mode:'toyNo'};if(['taste','like','request'].includes(k))return {mode:k};if(k==='seeKites')return {mode:'number',expected:12,prefix:'see'};if(k==='haveCrayons')return {mode:'number',expected:16,prefix:'have'};if(/^launch-(1[1-9]|20)$/.test(k))return {mode:'number',expected:Number(k.slice(7)),prefix:'have'};if(/^board-\d{1,4}$/.test(k))return boardChallenge({board:{turn:Number(k.slice(6))}});if(k==='final')return {mode:'number',expected:20,prefix:'have'};return null;}
export function restoreLowerTalks(r,c,s){
 const allowed={l1:['origin','friend','teacherIntro'],l2:['father','mother','familyYes','familyNo'],l3:['tall','nose'],lr1:['gateOrigin','gateFamily','gateAnimal'],l4:[...TOYS.map(t=>`where-${t.word}`),'toyYes','toyNo'],l5:['taste','like','request'],l6:['seeKites','haveCrayons',...Array.from({length:10},(_,i)=>`launch-${i+11}`)],lr2:['final']};
 for(const [k,v] of Object.entries(r.talks||{})){if(!v||!['voice','text'].includes(v.mode)||typeof v.text!=='string')continue;if(!allowed[c.id].includes(k)&&!(c.id==='lr2'&&/^board-\d{1,4}$/.test(k)&&Number(k.slice(6))<s.board.turn))continue;const node=savedNode(k);const answer=node&&interpretLowerSpeech(v.text,node);if(answer?.ok&&answer.value===v.value)s.talks[k]={mode:v.mode,text:v.text.slice(0,160),value:answer.value};}
 s.gates=s.gates.filter(i=>s.talks[['gateOrigin','gateFamily','gateAnimal'][i]]);s.launchSuccess=s.launchSuccess.filter(n=>s.talks[`launch-${n}`]);
}
export function lowerGoals(id,s){const t=s.talks||{};switch(id){
 case 'l1':return [GUESTS.every(g=>s.passports[g.id]===g.country),GUESTS.every(g=>s.roles[g.id]===g.role)&&s.roles.jones==='teacher',!!t.origin&&!!t.friend&&!!t.teacherIntro];
 case 'l2':return [s.familyFound.length===6,s.familyTree.length===6,!!t.father&&!!t.mother&&!!t.familyYes&&!!t.familyNo];
 case 'l3':return [s.observations.length===7,s.features.length===5,!!t.tall&&!!t.nose];
 case 'lr1':return [0,1,2].map(i=>s.gates.includes(i)&&!!t[['gateOrigin','gateFamily','gateAnimal'][i]]);
 case 'l4':return [TOYS.every(o=>s.toysFound.includes(o.word)&&t[`where-${o.word}`]),TOYS.every(o=>s.toysPlaced[o.word]===o.destination),!!t.toyYes&&!!t.toyNo];
 case 'l5':return [s.harvested.length===7,FRUIT_ORDERS.every(o=>o.items.every(f=>s.fruitOrders[o.who]?.includes(f))),!!t.taste&&!!t.like&&!!t.request];
 case 'l6':return [s.kites.length===12&&!!t.seeKites,s.crayons.length===16&&!!t.haveCrayons,s.launchSuccess.length>0];
 case 'lr2':return [s.board.pos===20,s.board.bananas===13&&s.board.grapes===20,!!t.final];
 }return [false,false,false];}
export function lowerDrop(c,s,item,zone,emit){let changed=false;
 if(c.id==='l1'&&zone==='role-jones'){if(item==='teacher'){s.roles.jones='teacher';changed=true;}else emit('Mr Jones 是老师，试试 teacher 身份牌。');}
 if(c.id==='l1'){const g=GUESTS.find(g=>zone===`passport-${g.id}`);if(g){if(item===g.country){s.passports[g.id]=item;changed=true;}else if(item===g.role&&s.passports[g.id]){s.roles[g.id]=item;changed=true;}else emit(s.passports[g.id]?`看看身份牌：${g.pronoun} / ${g.role}`:`${g.name} 来自 ${g.country}，先放正确国家章。`);}}
 if(c.id==='l2'&&zone===`family-${item}`&&FAMILY.includes(item)){if(s.familyFound.includes(item)){if(!s.familyTree.includes(item)){s.familyTree.push(item);changed=true;}}else emit('先走近这位家人，拍到照片再送进相册。');}
 if(c.id==='l3'){const a=zone.replace('animal-','');const trait=TRAITS.find(t=>t.word===item&&t.animal===a);if(trait){if(!s.observations.includes(item)){s.observations.push(item);changed=true;}}else if(zone.startsWith('feature-')&&FEATURES[Number(zone.slice(8))]===item){if(!s.features.includes(item)){s.features.push(item);changed=true;}}else emit('观察动物，再选合适的特征或拼图位置。');}
 if(c.id==='l4'){const toy=TOYS.find(t=>t.word===item);if(toy&&zone===`place-${toy.destination}`){if(!s.talks[`where-${item}`])emit('先用英语告诉伙伴：它刚才藏在哪里？');else{s.toysPlaced[item]=toy.destination;changed=true;}}else if(toy)emit(`这件玩具的新家是 ${toy.destination}。`);}
 if(c.id==='l5'){const o=FRUIT_ORDERS.find(o=>zone===`fruit-order-${o.who}`);if(o){if(!o.items.includes(item))emit(`${o.name} 的订单没有 ${item}。`);else if(!s.basket[item])emit('篮里还没有这种水果，先到果园亲手采摘。');else {s.fruitOrders[o.who]??=[];if(!s.fruitOrders[o.who].includes(item)){s.fruitOrders[o.who].push(item);s.basket[item]--;changed=true;}}}}
 if(changed)emit('任务机关亮起来了！',true);return changed;
}
export function applyLowerTalk(c,s,node,r,profile){if(['origin','gateOrigin'].includes(node.key))profile.country=r.value;if(node.key==='like')profile.fruit=r.value;if(node.key==='taste')profile.likesPears=r.value==='yes';if(node.key==='request')s.gift=r.value;if(c.id==='l6'&&node.key.startsWith('launch-')&&!s.launchSuccess.includes(r.value))s.launchSuccess.push(r.value);
 if(node.board&&s.board.pending){const b=s.board,landing=b.pending.landing;const jumps={3:10,12:17,8:4,18:11};b.pos=jumps[landing]||landing;const kind=b.turn%3;b.bananas=Math.min(13,b.bananas+(kind===0?5:kind===2?2:0));b.grapes=Math.min(20,b.grapes+(kind===1?7:kind===2?3:0));b.turn++;b.pending=null;r.reply=landing!==b.pos?`Yes! ${COUNT_WORDS[b.pos]}!`:'Great! Let’s keep exploring!';}
}
export function lowerAction(c,s,name,value,near,emit,rng){
 const needNear=['family-photo','gate','search','harvest','launch'];if(needNear.includes(name)&&!near){emit('先走到标记附近，再点一次或按 E 操作。');return false;}
 if(c.id==='l2'&&name==='family-photo'&&FAMILY.includes(value)&&!s.familyFound.includes(value)){s.familyFound.push(value);emit(`拍到了 ${value}！`,true);return true;}
 if(c.id==='lr1'&&name==='gate'&&value===s.gates.length&&value<3){if(!s.talks[['gateOrigin','gateFamily','gateAnimal'][value]]){emit('先完成这座桥的英语对话，再盖章。');return false;}s.gates.push(value);emit('通行章盖好了，下一座桥开放！',true);return true;}
 if(c.id==='l4'&&name==='search'&&PLACES.includes(value)){if(!s.searched.includes(value))s.searched.push(value);const toys=TOYS.filter(t=>t.place===value&&!s.toysFound.includes(t.word));for(const t of toys)s.toysFound.push(t.word);emit(toys.length?`找到了 ${toys.map(t=>t.word).join(' and ')}！告诉伙伴位置。`:'这里已经找过了，试试另一处位置。',!!toys.length);return true;}
 if(c.id==='l5'&&name==='harvest'&&FRUITS.includes(value)){if((s.basket[value]||0)>=20){emit('篮里这种水果已经够多啦，先分享给朋友。');return false;}s.basket[value]=(s.basket[value]||0)+1;if(!s.harvested.includes(value))s.harvested.push(value);emit(`采到 ${value}！现在可以送给客人。`,true);return true;}
 if(c.id==='l6'){
  if(name==='mark-kite'&&Number.isInteger(value)&&value>=0&&value<12&&!s.kites.includes(value)){s.kites.push(value);emit(`${COUNT_WORDS[s.kites.length]}!`,true);return true;}
  if(name==='bird'){emit('The black one is a bird! 它不是风筝。');return false;}
  if(name==='crayon'&&s.talks.seeKites&&Number.isInteger(value)&&value>=0&&value<16&&!s.crayons.includes(value)){s.crayons.push(value);emit(`${COUNT_WORDS[s.crayons.length]}!`,true);return true;}
  if(name==='target'&&s.talks.haveCrayons&&Number.isInteger(value)&&value>=11&&value<=20){s.launchTarget=value;return true;}
  if(name==='launch'&&s.talks.haveCrayons&&s.launched<20){s.launched++;return true;}
  if(name==='recover'&&s.talks.haveCrayons&&s.launched>0){s.launched--;return true;}
 }
 if(c.id==='lr2'&&name==='roll'&&!s.board.pending){const die=Math.min(6,Math.max(1,1+Math.floor(rng()*6)));s.board.lastDie=die;s.board.pending={die,landing:Math.min(20,s.board.pos+die)};emit(`骰子 ${die}：完成英语挑战再前进。`);return true;}
 return false;
}
