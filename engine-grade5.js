import {G5_BOOKS,TRAITS,SUBJECTS,MENU,ROOM,WEEKEND,SEASONS,MONTHS,ORDINALS,OWNERS,PETS,RULES,g5Part,g5Tasks,g5Final,g5Nodes,g5Pattern,interpretGrade5Speech} from './curriculum-grade5.js';
export const grade5Blank=()=>({g5:{stage:0,round:0,seen:[],choice:null,schedule:{},food:null,drink:null,combo:[],room:{},pictures:0,bridge:[],survey:[],hour:6,activity:null,weekend:[],season:'spring',favorite:null,seasonPieces:{},month:'January',calendar:{},date:1,invitation:null,returned:[],pet:null,lane:'left',volume:'loud',queue:[],tidy:[],speaker:true,ruleDone:[],done:[],receipts:{}},phonics:[]});
export const G5_NEAR_ACTIONS=['g5-inspect','g5-finish','g5-survey','g5-weekend','g5-season-piece','g5-rule-pass','g5-next-stage'];
const unique=(x,a)=>Array.isArray(x)?[...new Set(x.filter(w=>a.includes(w)))]:[];
export const partDone=(c,g,part)=>g5Tasks(c,part).every((_,i)=>g.done.includes(`${part}-${i}`));
export function grade5Goals(c,s){const g=s.g5,t=s.talks;if(g5Final(c))return [g.stage>=1,g.stage>=2,g.stage>=3];const part=g5Part(c,g),tasks=g5Tasks(c,part),done=tasks.map((_,i)=>g.done.includes(`${part}-${i}`)),all=partDone(c,g,part),reported=suffix=>tasks.every((_,i)=>t[`${part}-${i}-${suffix}`]);
 switch(part){
 case 'traits':return [tasks.every(r=>g.seen.includes(r.word)),all,all&&reported('describe')];
 case 'week':return [done.slice(0,5).every(Boolean),done.slice(5).every(Boolean),all&&reported('plan')];
 case 'meals':return [all,reported('eat')&&reported('drink'),all&&reported('taste')];
 case 'skills':return [done.slice(0,2).every(Boolean),done.slice(2).every(Boolean),all];
 case 'room':return [ROOM.every(r=>g.room[r.word]===r.zone),reported('place'),all&&g.pictures===2&&!!t['room-4-bed']&&!!t['room-4-pictures']];
 case 'park':return [g.bridge.length===2,tasks.every(r=>g.survey.includes(r.word)),all];
 case 'daily':return [all,WEEKEND.every(w=>g.weekend.includes(w.word)),all&&reported('time')];
 case 'seasons':return [tasks.every(r=>r.pieces.every(p=>g.seasonPieces[r.word]?.includes(p))),!!g.favorite,all];
 case 'calendar':return [done.slice(0,4).every(Boolean),done.slice(4).every(Boolean),all];
 case 'dates':return [done.slice(0,5).every(Boolean),done.slice(5).every(Boolean),all&&reported('date')];
 case 'pets':return [OWNERS.every(o=>g.returned.includes(o.word)),all,all&&reported('doing')];
 case 'rules':return [done.slice(0,2).every(Boolean),done.slice(2,4).every(Boolean),all];
 }return [false,false,false];
}
export function g5Operation(c,part,i,g){const r=g5Tasks(c,part)[i];if(!r)return false;
 switch(part){
 case 'traits':return g.seen.includes(r.word)&&g.choice===r.word;
 case 'week':return r.subjects.every(w=>g.schedule[r.day]?.includes(w))&&g.schedule[r.day]?.length===r.subjects.length;
 case 'meals':return g.food===r.food&&g.drink===r.drink;
 case 'skills':return g.combo.join('|')===r.sequence.join('|');
 case 'room':return g.room[r.word]===r.zone&&(i!==g5Tasks(c,part).length-1||g.pictures===2);
 case 'park':return ['west','east'].every(w=>g.bridge.includes(w))&&g.survey.includes(r.word);
 case 'daily':return g.hour===r.hour&&g.activity===r.word&&(g5Final(c)||i!==g5Tasks(c,part).length-1||WEEKEND.every(w=>g.weekend.includes(w.word)));
 case 'seasons':return r.pieces.every(p=>g.seasonPieces[r.word]?.includes(p))&&SEASONS.some(s=>s.word===g.favorite);
 case 'calendar':return g.month===r.month&&g.calendar[r.word]===r.month;
 case 'dates':return g.month===r.month&&g.date===r.day&&g.invitation===r.word;
 case 'pets':return g.pet===r.word&&(i!==0||(g5Final(c)?['mine','hers']:OWNERS.map(o=>o.word)).every(w=>g.returned.includes(w)));
 case 'rules':return g.ruleDone.includes(r.word);
 }return false;
}
const fields={traits:['seen','choice'],week:['schedule'],meals:['food','drink'],skills:['combo'],room:['room','pictures'],park:['bridge','survey'],daily:['hour','activity','weekend'],seasons:['season','favorite','seasonPieces'],calendar:['month','calendar'],dates:['month','date','invitation'],pets:['returned','pet'],rules:['lane','volume','queue','tidy','speaker','ruleDone']};
function proof(part,g){return JSON.parse(JSON.stringify(Object.fromEntries(fields[part].map(k=>[k,g[k]]))));}
function reports(c,part,i,g,t){return g5Nodes(c,part,i,g).every(n=>t[n.key]);}
export function grade5Drop(c,s,item,zone,emit){const g=s.g5,part=g5Part(c,g),r=g5Tasks(c,part)[g.round];if(!r||g.stage>=3)return false;let changed=false;
 if(part==='traits'&&zone==='trait'&&TRAITS.some(x=>x.word===item)){g.choice=item;changed=true;}
 if(part==='week'&&zone==='schedule'&&SUBJECTS.includes(item)){g.schedule[r.day]??=[];if(!g.schedule[r.day].includes(item)){g.schedule[r.day].push(item);changed=true;}}
 if(part==='meals'&&MENU.includes(item)){if(zone==='food'&&!['tea','water','milk'].includes(item)){g.food=item;changed=true;}if(zone==='drink'&&['tea','water','milk'].includes(item)){g.drink=item;changed=true;}}
 if(part==='room'){if(ROOM.some(x=>x.word===item)&&ROOM.some(x=>x.zone===zone)){g.room[item]=zone;changed=true;}if(item==='picture'&&zone==='pictures'&&g.pictures<2){g.pictures++;changed=true;}}
 if(part==='park'&&item==='bridge'&&['west','east'].includes(zone)&&!g.bridge.includes(zone)){g.bridge.push(zone);changed=true;}
 if(part==='daily'&&zone==='schedule'&&g5Tasks(c,part).some(x=>x.word===item)){g.activity=item;changed=true;}
 if(part==='seasons'&&zone==='season-project'&&['spring','winter'].includes(r.word)&&r.pieces.includes(item)){g.seasonPieces[r.word]??=[];if(!g.seasonPieces[r.word].includes(item)){g.seasonPieces[r.word].push(item);changed=true;}}
 if(part==='calendar'&&zone==='calendar'&&item===r.word){g.calendar[r.word]=g.month;changed=true;}
 if(part==='dates'&&zone==='mailbox'&&item===r.word){g.invitation=item;changed=true;}
 if(part==='pets'){if(zone.startsWith('owner-')){const owner=OWNERS.find(o=>o.item===item);if(owner&&zone===`owner-${owner.word}`&&(g5Final(c)?['mine','hers']:OWNERS.map(o=>o.word)).includes(owner.word)&&!g.returned.includes(owner.word)){g.returned.push(owner.word);changed=true;}else if(owner)emit('主人标签和箱子要对应，再试一次。');}if(zone==='pet-care'&&item===r.prop){g.pet=r.word;changed=true;}else if(zone==='pet-care')emit('这个道具没有触发任务卡上的宠物动作。');}
 if(part==='rules'&&r.word==='Keep your desk clean.'&&zone==='tidy'&&['pencil','book','crayon'].includes(item)&&!g.tidy.includes(item)){g.tidy.push(item);changed=true;}
 if(changed)emit('道具已放好。观察结果，再用英语报告。',true);return changed;
}
export function grade5Action(c,s,name,value,near,emit){const g=s.g5,part=g5Part(c,g),tasks=g5Tasks(c,part),r=tasks[g.round];if(G5_NEAR_ACTIONS.includes(name)&&!near){emit('先走近目标，再点一次或按 E。');return false;}
 if(name==='g5-next-stage'&&g5Final(c)&&g.stage<3){if(!partDone(c,g,part)){emit('当前幕的操作和英语报告还没有做完。');return false;}g.stage++;g.round=0;g.combo=[];g.choice=null;g.food=null;g.drink=null;g.pet=null;emit(g.stage===3?'综合冒险完成！':'下一幕开始了！',true);return true;}
 if(!r||g.stage>=3)return false;
 if(part==='traits'&&name==='g5-inspect'&&value===r.word&&!g.seen.includes(value)){g.seen.push(value);emit(r.clue,true);return true;}
 if(part==='week'&&name==='g5-remove-subject'&&g.schedule[r.day]?.includes(value)){g.schedule[r.day]=g.schedule[r.day].filter(w=>w!==value);return true;}
 if(part==='skills'&&name==='g5-combo'&&r.buttons.includes(value)&&g.combo.length<r.sequence.length){if(value!==r.sequence[g.combo.length]){g.combo=[];emit('动作顺序错了，重新观察提示再挑战。');return true;}g.combo.push(value);emit(g.combo.length===r.sequence.length?'挑战成功！现在可以介绍本领。':'动作正确，继续下一步。',true);return true;}
 if(part==='room'&&name==='g5-take-back'&&g.room[value]){delete g.room[value];return true;}
 if(part==='park'&&name==='g5-survey'&&value===r.word){if(g.bridge.length<2){emit('先修好两座桥，再过桥调查。');return false;}if(!g.survey.includes(value)){g.survey.push(value);emit(r.present?'这里有这个景物。':'调查过了，这里没有这个景物。',true);return true;}}
 if(part==='daily'&&name==='g5-hour'&&Number.isInteger(Number(value))&&Number(value)>=1&&Number(value)<=12){g.hour=Number(value);return true;}
 if(part==='daily'&&name==='g5-weekend'&&WEEKEND.some(w=>w.word===value)&&!g.weekend.includes(value)){g.weekend.push(value);emit('周末活动完成！',true);return true;}
 if(part==='seasons'&&name==='g5-favorite'&&SEASONS.some(s=>s.word===value)){g.favorite=value;delete s.talks[`seasons-${g.round}-season`];delete s.talks[`seasons-${g.round}-reason`];return true;}
 if(part==='seasons'&&name==='g5-season-piece'&&['summer','autumn'].includes(r.word)&&r.pieces.includes(value)){g.seasonPieces[r.word]??=[];if(r.word==='summer'&&value!==String(g.seasonPieces[r.word].length+1)){emit('从第一个泳圈开始，按路线前进。');return false;}if(!g.seasonPieces[r.word].includes(value)){g.seasonPieces[r.word].push(value);emit(r.word==='autumn'?'摘到一只苹果！':'到达下一个泳圈！',true);return true;}}
 if(['calendar','dates'].includes(part)&&name==='g5-month'&&MONTHS.includes(value)){g.month=value;return true;}
 if(part==='dates'&&name==='g5-date'&&Object.hasOwn(ORDINALS,value)){g.date=Number(value);return true;}
 if(part==='rules'){if(name==='g5-lane'&&['left','right'].includes(value)){g.lane=value;return true;}if(name==='g5-volume'&&['quiet','loud'].includes(value)){g.volume=value;return true;}if(name==='g5-speaker'&&['on','off'].includes(value)){g.speaker=value==='on';return true;}if(name==='g5-queue'&&['Amy','Mike','me'].includes(value)&&g.queue.length<3){const expected=['Amy','Mike','me'][g.queue.length];if(expected!==value){emit('先到的伙伴要先体验，按 Amy → Mike → 你 排队。');return false;}g.queue.push(value);return true;}if(name==='g5-rule-pass'){const valid=r.word==='Keep to the right.'?g.lane==='right':r.word==='Talk quietly.'?g.volume==='quiet':r.word==='Take turns.'?g.queue.join(',')==='Amy,Mike,me':r.word==='Keep your desk clean.'?g.tidy.length===3:g.speaker===false;if(!valid){emit(r.instruction);return false;}if(!g.ruleDone.includes(r.word)){g.ruleDone.push(r.word);return true;}}}
 if(name==='g5-finish'){if(!g5Operation(c,part,g.round,g)||!reports(c,part,g.round,g,s.talks)){emit('本轮操作和英语对话都完成后，才能确认。');return false;}const key=`${part}-${g.round}`;g.receipts[key]=proof(part,g);if(!g.done.includes(key))g.done.push(key);g.round++;g.choice=null;g.food=null;g.drink=null;g.combo=[];g.activity=null;g.pet=null;g.invitation=null;if(part==='seasons')g.season=g5Tasks(c,part)[Math.min(g.round,tasks.length-1)].word;emit(g.round===tasks.length?(g5Final(c)?'这一幕完成了，走近通行门进入下一幕。':'本关任务完成！可以重玩或去下一站。'):'下一项任务来了！',true);return true;}
 return false;
}
export function grade5Phonics(c,s,w,p){if(!c.phonics.includes(w)||g5Pattern(c,w)!==p)return false;if(!s.phonics.includes(w))s.phonics.push(w);return true;}
function sanitize(v,c){const g=grade5Blank().g5;const parts=g5Final(c)?[0,1,2].map(stage=>g5Part(c,{stage})): [g5Part(c,g)];const all=part=>parts.includes(part)?g5Tasks(c,part):[];
 g.stage=Number.isInteger(v.stage)?Math.max(0,Math.min(g5Final(c)?3:0,v.stage)):0;g.round=Number.isInteger(v.round)?Math.max(0,Math.min(12,v.round)):0;
 g.seen=unique(v.seen,TRAITS.map(x=>x.word));g.choice=TRAITS.some(x=>x.word===v.choice)?v.choice:null;
 for(const d of all('week'))if(Array.isArray(v.schedule?.[d.day]))g.schedule[d.day]=unique(v.schedule[d.day],SUBJECTS);
 g.food=MENU.includes(v.food)?v.food:null;g.drink=['water','tea','milk'].includes(v.drink)?v.drink:null;g.combo=Array.isArray(v.combo)?v.combo.filter(x=>['1','2','3','head','body','arm','wave','clap','stamp','left','middle','right'].includes(x)).slice(0,3):[];
 for(const r of ROOM)if(ROOM.some(x=>x.zone===v.room?.[r.word]))g.room[r.word]=v.room[r.word];g.pictures=[1,2].includes(v.pictures)?v.pictures:0;g.bridge=unique(v.bridge,['west','east']);g.survey=unique(v.survey,all('park').map(x=>x.word));
 g.hour=Number.isInteger(v.hour)&&v.hour>=1&&v.hour<=12?v.hour:6;g.activity=all('daily').some(x=>x.word===v.activity)?v.activity:null;g.weekend=unique(v.weekend,WEEKEND.map(x=>x.word));g.season=SEASONS.some(x=>x.word===v.season)?v.season:'spring';g.favorite=SEASONS.some(x=>x.word===v.favorite)?v.favorite:null;
 for(const r of all('seasons'))if(Array.isArray(v.seasonPieces?.[r.word]))g.seasonPieces[r.word]=unique(v.seasonPieces[r.word],r.pieces);
 g.month=MONTHS.includes(v.month)?v.month:'January';for(const r of all('calendar'))if(MONTHS.includes(v.calendar?.[r.word]))g.calendar[r.word]=v.calendar[r.word];g.date=Object.hasOwn(ORDINALS,v.date)?Number(v.date):1;g.invitation=all('dates').some(x=>x.word===v.invitation)?v.invitation:null;
 g.returned=unique(v.returned,g5Final(c)?['mine','hers']:OWNERS.map(x=>x.word));g.pet=PETS.some(x=>x.word===v.pet)?v.pet:null;g.lane=v.lane==='right'?'right':'left';g.volume=v.volume==='quiet'?'quiet':'loud';g.queue=Array.isArray(v.queue)?v.queue.filter(x=>['Amy','Mike','me'].includes(x)).slice(0,3):[];g.tidy=unique(v.tidy,['pencil','book','crayon']);g.speaker=v.speaker!==false;
 // Rule stamps are derived from their physical state, never accepted as free completion flags.
 g.ruleDone=unique(v.ruleDone,all('rules').filter(r=>r.word==='Keep to the right.'?g.lane==='right':r.word==='Talk quietly.'?g.volume==='quiet':r.word==='Take turns.'?g.queue.join(',')==='Amy,Mike,me':r.word==='Keep your desk clean.'?g.tidy.length===3:g.speaker===false).map(r=>r.word));return g;
}
export function restoreGrade5(r,c){return {g5:sanitize(r.g5||{},c),phonics:unique(r.phonics,c.phonics)};}
export function restoreGrade5Talks(r,c,s){const g=s.g5,v=r.g5||{},parts=g5Final(c)?[0,1,2].map(stage=>g5Part(c,{stage})): [g5Part(c,g)];const desiredStage=g.stage;let stage=0;
 for(const part of parts){const tasks=g5Tasks(c,part);let count=0;for(let i=0;i<tasks.length;i++){const key=`${part}-${i}`,stored=v.receipts?.[key],evidence=stored?sanitize(stored,c):g;for(const n of g5Nodes(c,part,i,evidence)){const record=r.talks?.[n.key];if(!record||!['voice','text'].includes(record.mode))continue;const answer=interpretGrade5Speech(record.text,n);if(answer.ok)s.talks[n.key]={mode:record.mode,text:String(record.text).slice(0,160),value:answer.value};}
  if(i===count&&Array.isArray(v.done)&&v.done.includes(key)&&stored&&g5Operation(c,part,i,evidence)&&reports(c,part,i,evidence,s.talks)){g.done.push(key);g.receipts[key]=proof(part,evidence);count++;}}
  if(g5Final(c)&&stage<desiredStage&&count===tasks.length)stage++;else if(g5Final(c)&&stage<desiredStage)break;
 }
 g.stage=g5Final(c)?stage:0;const part=g5Part(c,g),count=g5Tasks(c,part).filter((_,i)=>g.done.includes(`${part}-${i}`)).length;g.round=g5Final(c)&&stage!==desiredStage?count:Math.min(g.round,count);if(g5Final(c)&&stage===3)g.round=0;
}
