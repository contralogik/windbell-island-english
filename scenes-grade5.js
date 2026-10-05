import {TRAITS,WEEK,SUBJECTS,MENU,ROOM,SEASONS,MONTHS,ORDINALS,OWNERS,WEEKEND,g5Part,g5Tasks,g5Final} from './curriculum-grade5.js';
import {partDone} from './engine-grade5.js';
export const G5_FOOD_SPRITES=['sandwich','salad','hamburger','ice cream','tea','plant','water bottle','photo','bike','pipa','basketball station','ping-pong','microphone','cartoon sketchbook','Robin','kung fu dummy'];
export const G5_NATURE_SPRITES=['forest','river','lake','mountain','hill','bridge','village','building','tree','spring tree','apple tree','snowman','picnic','swimming','snowball','flowers'];
export const G5_ACTIVITY_SPRITES=['breakfast','morning exercises','dancing','go for a walk','go shopping','calendar','present','kitten','dog eating','dog drinking','dog sleeping','rabbit jumping','monkey climbing','dog playing','quiet sign','tidy desk'];
const subjectSprite=w=>({'Chinese':'Chinese book',English:'English book',maths:'maths book',science:'book',art:'picture',PE:'ball',music:'music class','computer class':'computer','read books':'book','play football':'ball','wash my clothes':'shirt','do homework':'homework','watch TV':'TV'}[w]||'book');
export function makeGrade5Scene({chapter:c,lesson:s},h,ui={}){const {object,zone,position,imageHtml,sayButton,esc}=h,g=s.g5,part=g5Part(c,g),tasks=g5Tasks(c,part),finished=partDone(c,g,part),r=tasks[Math.min(g.round,tasks.length-1)];const objects=[],zones=[],actions=[];let decor='';
 const picture=(w,sprite=w,extra='')=>`<button type="button" class="pronounce-picture" data-say="${esc(w)}" aria-label="听 ${esc(w)} 的发音" ${extra}>${imageHtml(sprite)}</button>`;
 const control=(name,value,label,active=false)=>`<button type="button" data-lower-action="${name}" data-value="${esc(value)}" class="${active?'active':''}">${esc(label)}</button>`;
 const panel=text=>`<div class="g5-summary">${text}</div>`;
 function card(id,x,y,w,h,speech,html,extra={}){zones.push(zone(id,x,y,w,h,speech,{className:'g5-card',speech,html,...extra}));}
 function tray(list){const size=ui.compact?2:4,pages=Math.max(1,Math.ceil(list.length/size)),page=Math.max(0,Math.min(pages-1,ui.trayPage||0));list.slice(page*size,(page+1)*size).forEach((a,i)=>{if(typeof a==='string')a={word:a};objects.push(object(`g5-token-${a.word}`,a.sprite||a.word,ui.compact?280+i*440:160+i*225,535,ui.compact?255:170,105,{draggable:true,item:a.word,label:a.label||a.word,speech:a.speech||a.word}));});if(pages>1)actions.push({name:'tray-page',value:Math.max(0,page-1),text:'上一组道具',disabled:page===0},{name:'tray-page',value:Math.min(pages-1,page+1),text:`下一组道具 · ${page+1}/${pages}`,disabled:page===pages-1});}
 const finish=()=>objects.push(object('g5-finish','cash register',900,425,ui.compact?120:90,100,{label:ui.compact?'确认本轮':'确认本轮 · 走近再点',speech:'Great!',action:'g5-finish',value:'confirm'}));
 objects.push(object('g5-guide','fox',900,110,95,110,{npc:true,label:'Fox',speech:'Fox'}));
 if(g5Final(c))decor+=`<div class="g5-act">第 ${Math.min(3,g.stage+1)} 幕 / 3</div>`;
 if(finished){decor+=panel(g5Final(c)&&g.stage<3?(g.stage===2?'这一幕完成了！走近通行门，领取综合奖励。':'这一幕完成了！走近通行门，进入下一幕。'):'本关已完成！点“再玩一遍”可以重新挑战。');objects.push(object('g5-scene-reward',c.rewardSprite,500,270,230,235,{speech:c.rewardSprite,label:c.reward}));if(g5Final(c)&&g.stage<3)objects.push(object('g5-next-stage','door',860,410,110,130,{label:g.stage===2?'通行门 · 领奖':'通行门 · 下一幕',speech:'door',action:'g5-next-stage',value:'next'}));return {objects,zones,decor,actions};}
 if(['calendar','dates','seasons'].includes(part))objects.pop();
 if(part==='traits'){
  decor+=panel(`人物档案 ${g.round}/${tasks.length} · ${sayButton(r.who)} · 先走近查看线索，再选择性格卡`);
  objects.push(object('g5-person',r.sprite,280,265,190,235,{label:r.who,speech:r.who,action:'g5-inspect',value:r.word}));
  card('trait',650,260,330,255,g.choice||r.word,`<div class="g5-clue">${g.seen.includes(r.word)?esc(r.clue):'点击人物走过去，再点一次查看行为线索。'}</div><b>${g.choice?sayButton(g.choice,g.choice,'data-drop-zone="trait"'):'把性格卡交到这里'}</b>`);
  decor+=`<div class="g5-word-rack">${TRAITS.map(t=>control('g5-pick',t.word,t.word,g.choice===t.word)).join('')}</div>`;finish();
 }
 if(part==='week'){
  decor+=panel(`第 ${g.round+1}/${tasks.length} 天 · ${sayButton(r.day)} · 日程卡：${r.subjects.map(w=>sayButton(w)).join(' + ')}`);
  decor+=`<div class="g5-week-strip">${WEEK.map(w=>sayButton(w.day,w.day+(g.done.some(k=>k===`week-${WEEK.indexOf(w)}`)?' ✓':''))).join('')}</div>`;
  const placed=g.schedule[r.day]||[];card('schedule',495,275,700,230,r.day,`<b>${sayButton(r.day,r.day,'data-drop-zone="schedule"')}</b><div class="g5-schedule-items">${placed.map(w=>`<div>${picture(w,subjectSprite(w),'data-drop-zone="schedule"')}${sayButton(w,w,'data-drop-zone="schedule"')}${control('g5-remove-subject',w,'取回')}</div>`).join('')||'把本日课程 / 活动卡拖进计划板'}</div>`);
  tray(SUBJECTS.filter(w=>!placed.includes(w)).map(word=>({word,sprite:subjectSprite(word)})));finish();
 }
 if(part==='meals'){
  decor+=panel(`客人 ${g.round+1}/${tasks.length} · ${sayButton(r.who)} · ${esc(r.note)}`);objects.push(object('g5-customer',r.sprite,220,240,150,190,{label:r.who,speech:r.who}));
  card('food',500,250,240,205,g.food||'food',`${picture(g.food||'food',g.food||'plate','data-drop-zone="food"')}<b>${g.food?sayButton(g.food,g.food,'data-drop-zone="food"'):'食物餐盘'}</b>`);
  card('drink',780,250,200,205,g.drink||'drink',`${picture(g.drink||'drink',g.drink||'water bottle','data-drop-zone="drink"')}<b>${g.drink?sayButton(g.drink,g.drink,'data-drop-zone="drink"'):'饮品台'}</b>`);
  decor+=`<div class="g5-tastes">${['fresh','healthy','delicious','hot','sweet'].map(w=>sayButton(w)).join(' ')}</div>`;tray(MENU);finish();
 }
 if(part==='skills'){
  decor+=panel(`才艺 ${g.round+1}/${tasks.length} · ${sayButton(r.word)} · ${esc(r.instruction)}`);card('skill-stage',470,250,530,260,r.word,`${picture(r.word,r.sprite)}<b>${sayButton(r.word)}</b><div class="g5-combo-progress">${r.sequence.map((x,i)=>`<span class="${i<g.combo.length?'done':''}">${esc(x)} ${i<g.combo.length?'✓':''}</span>`).join(' → ')}</div><div class="g5-challenge-controls">${r.buttons.map(b=>control('g5-combo',b,b)).join('')}</div>`);
  if(r.word==='play basketball')decor+=`<div class="g5-aim">篮筐方向：${sayButton(r.sequence[Math.min(g.combo.length,2)])}</div>`;
  decor+=`<div class="g5-word-rack">${['sing English songs','dance','cook','swim','play ping-pong','speak English'].map(w=>sayButton(w)).join(' ')}</div>`;finish();
 }
 if(part==='room'){
  decor+=panel(`房间任务 ${g.round+1}/${tasks.length} · ${sayButton(r.word)} → ${sayButton(r.phrase)} · 可取回重摆`);
  objects.push(object('g5-bed','bed',550,275,230,185,{label:'big bed',speech:'There is a big bed.'}));
  const targets=[['above',550,125,220,85],['beside',200,285,180,170],['behind',775,200,185,145],['between',355,280,120,150],['in front of',550,405,240,90]];
  for(const [name,x,y,w,height]of targets){const items=ROOM.filter(a=>g.room[a.word]===name);card(name,x,y,w,height,name,`<b>${sayButton(name,name,`data-drop-zone="${name}"`)}</b><div class="g5-room-items">${items.map(a=>`${picture(a.word,a.sprite,`data-drop-zone="${name}"`)}${control('g5-take-back',a.word,'取回')}`).join('')}</div>`,{className:'g5-card g5-room-slot',ready:items.some(a=>a.zone===name)});}
  card('pictures',830,330,190,110,'pictures',`<b>${sayButton('picture','picture × '+g.pictures,'data-drop-zone="pictures"')}</b><div class="g5-room-items">${Array.from({length:g.pictures},()=>picture('picture','picture','data-drop-zone="pictures"')).join('')}</div>`);
  tray([...ROOM.filter(a=>!g.room[a.word]).map(a=>({word:a.word,sprite:a.sprite})),...(g.pictures<2?[{word:'picture'}]:[])]);finish();
 }
 if(part==='park'){
  decor+=panel(`修桥 ${g.bridge.length}/2 · 调查 ${g.round}/${tasks.length} · 当前：${sayButton(r.word)}`);
  objects.push(object('g5-mountain','mountain',520,180,220,185,{speech:'mountain',label:'mountain'}),object('g5-village','village',790,225,200,140,{speech:'village',label:'village'}),object('g5-tree1','tree',140,205,100,160,{speech:'tree',label:'tree'}),object('g5-tree2','tree',235,205,100,160,{speech:'tree',label:'tree'}));
  for(const [i,side]of ['west','east'].entries())card(side,340+i*330,350,205,135,'bridge',g.bridge.includes(side)?picture('bridge','bridge',`data-drop-zone="${side}"`):'拖桥跨过山谷', {className:'g5-card g5-bridge-slot',ready:g.bridge.includes(side)});
  card('survey-point',r.word==='river'?180:510,260,210,145,r.word,`${r.word==='lake'?picture('lake'):r.word==='trees'||r.word==='river'?picture('forest','forest'):imageHtml('map')}<b>${sayButton(r.word)} ${r.word==='river'?'· forest 区域':''}</b><small>${g.survey.includes(r.word)?r.present?'发现它了 ✓':'确认没有 ✓':'走近再点 · 调查'}</small>`,{action:'g5-survey',value:r.word});
  if(g.bridge.length<2)tray([{word:'bridge'}]);finish();
 }
 if(part==='daily'){
  decor+=panel(`第 ${g.round+1}/${tasks.length} 段 · ${sayButton(r.word)} · ${sayButton(`${r.hour} o'clock`)} · ${r.hour<10?'上午 / 傍晚活动见任务牌':'日程'}`);
  card('routine-clock',240,245,250,220,'clock',`<div class="g4l-clock-face">${imageHtml('clock')}<svg viewBox="0 0 100 100" aria-hidden="true"><line x1="50" y1="50" x2="50" y2="25" transform="rotate(${g.hour*30} 50 50)" class="clock-hour"/><line x1="50" y1="50" x2="50" y2="13" class="clock-minute"/><circle cx="50" cy="50" r="3"/></svg></div><b>${sayButton(`${g.hour} o'clock`)}</b>`);
  card('schedule',610,235,260,205,g.activity||r.word,`${picture(g.activity||'schedule',g.activity?(tasks.find(t=>t.word===g.activity)?.sprite||'book'):'calendar','data-drop-zone="schedule"')}<b>${g.activity?sayButton(g.activity,g.activity,'data-drop-zone="schedule"'):'拖入活动卡'}</b>`);
  decor+=`<div class="g5-hour-controls">${Array.from({length:12},(_,i)=>control('g5-hour',i+1,i+1,g.hour===i+1)).join('')}</div>`;
  if(!g5Final(c))decor+=`<div class="g5-weekend-controls">${WEEKEND.map(w=>control('g5-weekend',w.word,w.word+(g.weekend.includes(w.word)?' ✓':''))).join('')}</div>`;
  // Weekend buttons represent nearby stations and share a real position for movement.
  if(!g5Final(c))objects.push(object('g5-weekend-station','go shopping',860,325,90,110,{label:'周末活动站',speech:'weekend',action:'g5-weekend',value:WEEKEND.find(w=>!g.weekend.includes(w.word))?.word||WEEKEND[0].word}));
  tray(tasks.map(t=>({word:t.word,sprite:t.sprite})));finish();
 }
 if(part==='seasons'){
  decor+=panel(`四季活动 ${g.round}/${tasks.length} · ${sayButton(r.word)} · ${esc(r.instruction)}`);decor+=`<div class="g5-season-strip"><span>我最喜欢：</span>${SEASONS.map(se=>control('g5-favorite',se.word,se.word+(g.favorite===se.word?' ♥':''),g.favorite===se.word)).join('')}</div>`;
  objects.push(object('g5-season-tree',r.sprite,430,260,280,270,{label:r.word,speech:r.word}));const pieces=g.seasonPieces[r.word]||[];
  if(['spring','winter'].includes(r.word)){card('season-project',760,285,260,235,r.activity,`${picture(r.activity,pieces.length===r.pieces.length?r.prop:r.word==='winter'?'snowball':'picnic','data-drop-zone="season-project"')}<b>${sayButton(r.activity,r.activity,'data-drop-zone="season-project"')}</b><small>${pieces.length}/${r.pieces.length} 件 · ${pieces.map(w=>esc(w)).join(' + ')}</small>`);tray(r.pieces.filter(w=>!pieces.includes(w)));}
  else {for(const [i,p] of r.pieces.entries())if(!pieces.includes(p))objects.push(object(`g5-season-piece-${p}`,r.word==='autumn'?'apple':'swimming',300+i*215,r.word==='autumn'?210+i%2*95:365,100,100,{label:r.word==='autumn'?`apple ${p}`:`泳圈 ${p}`,speech:r.activity,action:'g5-season-piece',value:p}));decor+=`<div class="g5-season-count">${sayButton(r.activity)} ${pieces.length}/3</div>`;}
  finish();
 }
 if(part==='calendar'||part==='dates'){
  const isDate=part==='dates';decor+=panel(`${isDate?'邀请投递':'活动安排'} ${g.round+1}/${tasks.length} · ${sayButton(r.word)} → ${sayButton(r.month)}${isDate?' · '+sayButton(ORDINALS[r.day]):''}`);
  decor+=`<div class="g5-month-controls">${MONTHS.map(m=>control('g5-month',m,m,m===g.month)).join('')}</div>`;
  if(isDate)decor+=`<div class="g5-date-controls">${Object.entries(ORDINALS).map(([d,w])=>control('g5-date',d,`${d} · ${w}`,Number(d)===g.date)).join('')}</div>`;
  const drop=isDate?'mailbox':'calendar';card(drop,500,isDate?(ui.compact?440:410):(ui.compact?350:290),440,isDate?(ui.compact?135:145):(ui.compact?210:260),'calendar',`${picture(g.month,'calendar',`data-drop-zone="${drop}"`)}<b>${sayButton(g.month,g.month,`data-drop-zone="${drop}"`)} ${isDate?sayButton(ORDINALS[g.date],ORDINALS[g.date],`data-drop-zone="${drop}"`):''}</b><small>${isDate?g.invitation===r.word?'邀请卡已装好':'将邀请卡拖到这里':g.calendar[r.word]?`${esc(r.word)} · ${esc(g.calendar[r.word])}`:'把活动卡拖到这里'}</small>`);
  tray([{word:r.word,sprite:r.sprite}]);finish();
 }
 if(part==='pets'){
  const owners=g5Final(c)?OWNERS.filter(o=>['mine','hers'].includes(o.word)):OWNERS;
  decor+=panel(`宠物照护 ${g.round+1}/${tasks.length} · ${sayButton(r.word)} · ${esc(r.instruction)} · 失物归还 ${g.returned.length}/${owners.length}`);
  const showOwners=g.round===0&&(!owners.every(o=>g.returned.includes(o.word))||owners.some(o=>!s.talks[`pets-0-owner-${o.word}`]));
  if(showOwners){objects[0]=object('g5-guide','fox',900,85,80,75,{npc:true,label:'Fox',speech:'Fox'});owners.forEach((o,i)=>card(`owner-${o.word}`,owners.length===2?300+i*400:170+i%3*330,owners.length===2?260:200+Math.floor(i/3)*175,owners.length===2?260:280,145,o.word,`<b>${sayButton(o.word,o.label+ ' → '+o.word,`data-drop-zone="owner-${o.word}"`)}</b>${g.returned.includes(o.word)?picture(o.item,o.sprite,`data-drop-zone="owner-${o.word}"`):'<small>按标签归还失物</small>'}`));tray(owners.filter(o=>!g.returned.includes(o.word)).map(o=>({word:o.item,sprite:o.sprite,label:`${o.item} · ${o.word}`,speech:`${o.item}. ${o.word}.`})));}
  else {card('pet-care',500,270,430,280,r.word,`${picture(g.pet||'dog',g.pet===r.word?r.sprite:r.word==='jumping'?'rabbit jumping':r.word==='climbing'?'monkey climbing':'dog','data-drop-zone="pet-care"')}<b>${g.pet?sayButton(g.pet,g.pet,'data-drop-zone="pet-care"'):'送上照护道具'}</b><small>${esc(r.instruction)}</small>`);tray([{word:r.prop,sprite:r.prop==='food bowl'?'bowl':r.prop==='toy'?'car':r.prop},{word:'carrot'},{word:'ball'}].filter((a,i,arr)=>arr.findIndex(b=>b.word===a.word)===i));}
  if(!showOwners)finish();
 }
 if(part==='rules'){
  decor+=panel(`展馆站点 ${g.round+1}/${tasks.length} · ${sayButton(r.word)} · ${esc(r.instruction)}`);card('rule-station',480,245,410,235,r.word,`${picture(r.word,r.sprite)}<b>${sayButton(r.activity)}</b><small>${g.ruleDone.includes(r.word)?'实际规则已完成 ✓':'走近展台，再点一次登记'}</small>`,{action:'g5-rule-pass',value:r.word});
  let controls='';if(r.word==='Keep to the right.')controls=['left','right'].map(v=>control('g5-lane',v,v,g.lane===v)).join('');if(r.word==='Talk quietly.')controls=['loud','quiet'].map(v=>control('g5-volume',v,v,g.volume===v)).join('');if(r.word==='Take turns.')controls=['Amy','Mike','me'].map(v=>control('g5-queue',v,v+(g.queue.includes(v)?' ✓':''))).join('');if(r.word==='Work quietly.')controls=['on','off'].map(v=>control('g5-speaker',v,v==='on'?'喇叭开':'喇叭关',g.speaker===(v==='on'))).join('');decor+=`<div class="g5-rule-controls">${controls}</div>`;
  if(r.word==='Keep your desk clean.'){card('tidy',780,300,175,160,'box',`${picture('box','box','data-drop-zone="tidy"')}<small>收纳 ${g.tidy.length}/3</small>`);tray(['pencil','book','crayon'].filter(w=>!g.tidy.includes(w)));}finish();
 }
 actions.unshift({name:'interact',text:'E · 操作附近目标'});return {objects,zones,decor,actions};
}
