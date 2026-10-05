import {CLASSROOM_ITEMS,CLEAN_SPOTS,BAG_ITEMS,LOCKERS,FRIENDS,FRIEND_ROUNDS,ROOMS,ROOM_SPRITES,DISHES,CUTLERY,DINNER_ORDERS,FINAL_ORDERS,STORY_FAMILY,RELAY} from './curriculum-grade4.js';
export const G4_SCHOOL_SPRITES=['blackboard','window','door','light',"teacher's desk",'computer','fan','picture','English book','maths book','Chinese book','storybook','notebook','candy','key','schoolbag'];
export const G4_HOME_SPRITES=['bed','sofa','fridge','phone','table','bathroom','beef','chicken','noodles','soup','vegetables','chopsticks','bowl','fork','knife','spoon'];
export const G4_PEOPLE_SPRITES=['Mike','Amy','John','Lily','doctor','cook','driver','farmer','nurse','football player','baby brother','cousin','uncle','aunt','broom','medical bag'];
export const G4_EXTRA_SPRITES=['TV','red-yellow bag','green-black bag','glasses'];
export const CLASSROOM_LAYOUT={blackboard:[355,195,240,140],window:[795,175,145,170],door:[125,260,120,230],light:[550,80,90,95],picture:[635,150,105,95],"teacher's desk":[690,365,195,150],computer:[690,270,135,110],fan:[915,225,95,125],TV:[370,395,110,110]};
export const ROOM_LAYOUT=Object.fromEntries([...ROOMS,'door'].map((r,i)=>[r,{x:195+(i%3)*300,y:205+Math.floor(i/3)*215}]));
export function makeGrade4Scene(state,h,ui={}){
 const {chapter:c,lesson:s}=state,g=s.g4,{object,zone,position,imageHtml,sayButton,esc}=h;
 const objects=[],zones=[],actions=[];let decor='';
 const panel=(html,extra='')=>`<div class="g4-summary ${extra}">${html}</div>`;
 const pictureButton=(word,extra='')=>`<button class="pronounce-picture" data-say="${esc(word)}" ${extra} aria-label="听 ${esc(word)} 的发音">${imageHtml(word)}</button>`;
 function tray(items){if(!items.length)return;const pages=Math.ceil(items.length/5),page=Math.min(ui.trayPage||0,pages-1),visible=items.slice(page*5,page*5+5);
  decor+=`<div class="g4-tray-background" aria-hidden="true"></div>`;
  visible.forEach((entry,i)=>{const item=typeof entry==='string'?{word:entry}:entry;objects.push(object(`g4-token-${item.word}`,item.sprite||item.word,120+i*190,545,140,95,{item:item.word,draggable:true,label:item.label||item.word,speech:item.word}));});
  if(pages>1)actions.push({name:'tray-page',value:Math.max(0,page-1),text:'上一组道具',disabled:page===0},{name:'tray-page',value:Math.min(pages-1,page+1),text:`下一组道具 · ${page+1}/${pages}`,disabled:page===pages-1});
 }
 function dinner(orders){
  orders.forEach((o,i)=>{const x=orders.length===1?350:180+i*320,served=g.dinnerServed[o.who]||[],tools=g.dinnerTools[o.who]||[],drop=`data-drop-zone="dinner-${o.who}"`;
   zones.push(zone(`dinner-${o.who}`,x,245,255,230,o.name,{className:'g4-dinner-order',speech:`I'd like some ${o.items.join(' and ')}, please.`,ready:o.items.every(w=>served.includes(w))&&o.tools.every(w=>tools.includes(w)),html:`${imageHtml(o.who)}<b>${sayButton(o.name,o.name,drop)}</b><div>${o.items.map(w=>`${sayButton(w,w+(served.includes(w)?' ✓':''),drop)}${served.includes(w)?pictureButton(w,drop):''}`).join(' · ')}</div><div class="g4-tools">${o.tools.map(w=>sayButton(w,w+(tools.includes(w)?' ✓':''),drop)).join(' · ')}</div>`}));
  });
  zones.push(zone('prep',525,425,250,110,'备餐台',{className:'g4-prep',action:'prepare',value:'prep',speech:g.pan||'bowl',html:`${imageHtml(g.pan||'bowl')}<div><b>${g.pan?sayButton(g.pan):'备餐台'}</b><br><span>${g.pan?'走近按 E 准备好':'把一道菜拖到这里'}</span></div>`}));
  tray([...DISHES.map(w=>({word:w,label:w+(g.cooked.includes(w)?' · 已备好':' · 待准备')})),...CUTLERY]);
  if(g.ownMeal.length)decor+=`<div class="g4-own-meal"><strong>你的晚餐</strong>${g.ownMeal.map(w=>pictureButton(w)).join('')}${g.ownUtensils==='fork'?pictureButton('knife')+pictureButton('fork'):g.ownUtensils?pictureButton(g.ownUtensils):''}</div>`;
 }
 function family(final=false){
  STORY_FAMILY.forEach((f,i)=>{const placed=g.familySlots.includes(f.id),dropId=placed?`career-${f.id}`:`family-${f.id}`,drop=`data-drop-zone="${dropId}"`,job=g.jobs[f.id];
   zones.push(zone(dropId,190+(i%3)*300,210+Math.floor(i/3)*205,235,180,f.word,{className:'g4-family-slot',speech:f.word,ready:placed&&(!f.job||job===f.job&&(final||g.careerTools.includes(f.id))),html:`${placed?imageHtml(f.sprite):'<div class="g4-photo-placeholder">待放照片</div>'}<b>${sayButton(f.word,f.word,drop)}</b>${f.job?`<div class="g4-job-line">${sayButton(`${f.pronoun==='he'?'He':'She'} is a ${f.job}.`,job?`${job} ✓`:`${f.job} · 工作提示`,drop)}${g.careerTools.includes(f.id)?' · 工具 ✓':''}</div>`:'<small>宝宝不用工作</small>'}`}));
  });
  if(final)tray(['nurse','driver']);else if(g.familySlots.length<6)tray(STORY_FAMILY.filter(f=>!g.familySlots.includes(f.id)).map(f=>({word:f.word,sprite:f.sprite})));else tray([...STORY_FAMILY.filter(f=>f.job&&!g.jobs[f.id]).map(f=>f.job),...[...new Set(STORY_FAMILY.filter(f=>f.job&&!g.careerTools.includes(f.id)).map(f=>f.tool))]]);
 }
 if(c.id==='g41'){
  decor=panel(`设施 ${g.placed.length}/${CLASSROOM_ITEMS.length} · 打扫 ${g.cleaned.length}/3 · ${g.brush?'扫帚已拿起':'先点扫帚拿起工具'}`)+`<div class="g4-wall-label">${sayButton('wall')}</div><div class="g4-floor-label">${sayButton('floor')}</div>`;
  for(const word of CLASSROOM_ITEMS){const [x,y,w,h]=CLASSROOM_LAYOUT[word],placed=g.placed.includes(word),drop=`data-drop-zone="classroom-${word}"`;zones.push(zone(`classroom-${word}`,x,y,w,h,word,{className:'g4-fixture',ready:placed,speech:word,html:`${placed?imageHtml(word):''}${sayButton(word,word,drop,'zone-label')}`}));}
  for(const spot of CLEAN_SPOTS)if(!g.cleaned.includes(spot)){const [x,y]=spot==='floor'?[460,445]:spot==='blackboard'?[400,225]:[790,205];zones.push(zone(`clean-${spot}`,x,y,95,60,`clean ${spot}`,{className:'g4-dust',action:'clean',value:spot,speech:`Let me clean the ${spot==='window'?'windows':spot}.`,html:`${imageHtml('broom')}<span>待清扫</span>`}));}
  objects.push(object('g4-broom','broom',930,430,70,100,{label:g.brush?'broom · 拿好了':'broom · 点击拿起',action:'broom',value:'broom'}));
  tray(CLASSROOM_ITEMS.filter(w=>!g.placed.includes(w)));actions.unshift({name:'interact',text:'E · 附近清扫'});
 }else if(c.id==='g42'){
  decor=panel(`失物卡：${sayButton('blue and white')} · 搜索 ${g.lockers.length}/4 个柜子 · 用品 ${Object.keys(g.bagPacked).length}/8`);
  if(!g.bagFound){['blue and white','red and yellow','green and black'].forEach((colour,i)=>objects.push(object(`g4-bag-${i}`,['schoolbag','red-yellow bag','green-black bag'][i],240+i*260,220,135,175,{label:colour,speech:colour,action:'pick-bag',value:colour})));}
  else zones.push(zone('schoolbag',810,275,240,250,'schoolbag',{className:'g4-schoolbag',sprite:'schoolbag',speech:'schoolbag',html:`${imageHtml('schoolbag')}<b>${sayButton('schoolbag','schoolbag','data-drop-zone="schoolbag"')}</b><div>${Object.entries(g.bagPacked).map(([w,n])=>sayButton(w,`${w} × ${n}`,'data-drop-zone="schoolbag"')).join(' · ')}</div>`}));
  LOCKERS.forEach((items,i)=>objects.push(object(`g4-locker-${i}`,'box',140+i*180,420,130,110,{label:`失物柜 ${i+1}${g.lockers.includes(i)?' ✓':''}`,speech:'box',action:'locker',value:i})));
  tray(g.loot.filter(w=>!g.bagPacked[w]).map(w=>({word:w,sprite:w==='toy'?'car':w,label:`${w} × ${BAG_ITEMS[w]}`})));actions.unshift({name:'interact',text:'E · 附近搜索 / 领包'});
 }else if(c.id==='g43'){
  const target=FRIEND_ROUNDS[Math.min(g.friendsFound.length,2)];decor=panel(`朋友已加入 ${g.friendsFound.length}/3 · ${g.friendsFound.length===3?'介绍 John 的体格':g.friendGuess?'找到人了，开口介绍名字':sayButton(target.clue,target.clue)}`,'g4-clue');
  FRIENDS.forEach((f,i)=>objects.push(object(`g4-friend-${f.name}`,f.name,155+i*230,330,i===2?150:125,270,{label:f.name+(FRIEND_ROUNDS.findIndex(x=>x.name===f.name)<g.friendsFound.length&&f.name!=='Lily'?' ✓':''),speech:f.name,action:'friend',value:f.name})));
  decor+=`<div class="g4-friend-guide">${sayButton('glasses')} · ${sayButton('long hair')} · ${sayButton('short hair')} · ${sayButton('friendly')} · ${sayButton('quiet')}</div>`;actions.push({name:'interact',text:'E · 确认附近朋友'});
 }else if(c.id==='g4r1'){
  decor=panel(`接力通行章 ${g.relayStamps.length}/3 · 当前第 ${Math.min(g.relayStamps.length+1,3)} 站`);
  RELAY.forEach((p,i)=>zones.push(zone(`relay-${i}`,220+i*290,280+(i===1?70:0),205,215,`${i+1} · ${p.place}`,{className:'g4-relay-slot',ready:g.relayStamps.includes(i),action:'stamp',value:i,speech:p.place,html:`${imageHtml(p.sprite)}<b>${sayButton(p.place,p.place,`data-drop-zone="relay-${i}"`)}</b><small>${g.relayStamps.includes(i)?'通行章 ✓':g.relayDelivered.includes(i)?'先报告，再走近盖章':i===g.relayStamps.length?'送好包裹，再说英语':'等前一站通过'}</small>${g.relayDelivered.includes(i)?pictureButton(p.item,`data-drop-zone="relay-${i}"`):''}`})));
  if(g.relayStamps.length<3)tray([RELAY[g.relayStamps.length].item]);actions.unshift({name:'interact',text:'E · 附近盖章'});
 }else if(c.id==='g44'){
  decor=panel(`已探索 ${g.homeRooms.filter(r=>ROOMS.includes(r)).length}/5 个房间 · ${g.homeKeys?'钥匙找到了':'钥匙还没找到'}`);
  for(const room of [...ROOMS,'door']){const xy=ROOM_LAYOUT[room],visited=g.homeRooms.includes(room),drop='';zones.push(zone(`room-${room}`,xy.x,xy.y,255,190,room,{className:'g4-room',ready:visited,action:'visit-room',value:room,speech:room,html:`${imageHtml(ROOM_SPRITES[room]||'door')}<b>${sayButton(room,room,drop)}</b><small>${visited?'探索 ✓':'走近再点 / 按 E 探索'}</small>${room==='study'&&visited?`<div class="g4-room-find">${pictureButton('Amy')} ${sayButton("She's in the study.")}</div>`:room==='door'&&g.homeKeys?`<div class="g4-room-find">${pictureButton('key')}${pictureButton('key')}</div>`:''}`}));}
  decor+=`<div class="g4-home-words">${pictureButton('phone')}${sayButton('phone')} ${pictureButton('table')}${sayButton('table')} ${sayButton('parents')}</div>`;actions.push({name:'interact',text:'E · 探索附近房间'});
 }else if(c.id==='g45'){
  decor=panel(`五道菜 ${g.cooked.length}/5 已准备 · 菜和餐具都要送齐`);dinner(DINNER_ORDERS);actions.unshift({name:'interact',text:'E · 附近备餐'});
 }else if(c.id==='g46'){
  decor=panel(`故事家庭：相册 ${g.familySlots.length}/6 · 职业 ${Object.keys(g.jobs).length}/5 · 工具 ${g.careerTools.length}/5`);family();
  decor+=`<div class="g4-family-note">${sayButton('parents')} = ${sayButton('father')} + ${sayButton('mother')}</div>`;
 }else if(c.id==='g4r2'){
  decor=panel(`第 ${Math.min(g.finalStage+1,3)} 幕 / 3 · ${['找钥匙开门','准备家庭晚餐','介绍职业拍合影','合影完成！'][g.finalStage]}`);
  if(g.finalStage===0){objects.push(object('final-sofa','sofa',330,310,340,215,{label:'sofa · 搜索',speech:'sofa',action:'final-search',value:'sofa'}),object('final-door','door',800,280,160,250,{label:'door · 开门',speech:'door',action:'final-open',value:'door'}));if(g.finalKeys)decor+=`<div class="g4-final-keys">${pictureButton('key')}${pictureButton('key')} ${sayButton("They're on the sofa.")}</div>`;actions.push({name:'interact',text:'E · 附近搜索 / 开门'});}
  else if(g.finalStage===1){dinner(FINAL_ORDERS);objects.push(object('final-dinner-bell','phone',850,405,100,110,{label:'开饭铃',speech:"Dinner's ready!",action:'final-bell',value:'bell'}));actions.unshift({name:'interact',text:'E · 备餐 / 开饭'});}
  else {family(true);objects.push(object('final-photo','picture',930,435,80,90,{label:g.finalStage===3?'合影 ✓':'拍家庭合影',speech:'picture',action:'final-photo',value:'photo'}));actions.unshift({name:'interact',text:'E · 拍家庭合影'});}
 }
 return {objects,zones,decor,actions};
}
