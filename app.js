import {CHAPTERS,COLORS,CHINESE,STATIONERY,ANIMALS,FOOD,PARTS,MOVES,ORDERS,FESTIVAL_ORDERS,NUMBERS,dialogue} from './curriculum.js';
import {createAdventure,restoreProgress,goals,canEnter,SAVE_KEY} from './engine.js';
import {LocalRecorder,transcribe,saveRecording,allRecordings,deleteRecording,browserSpeechMode,prepareBrowserSpeech} from './speech.js?v=20261007';
import {SITE_CONFIG} from './site-config.js';
import {PROGRESS_BACKUP_KEY,progressFile,readProgressFile} from './progress-transfer.js';
let pendingProgressImport=null,progressExportURL=null;
import {audioKey,practiceExpressions} from './pronunciation.js';
import {BOOKS,chaptersForBook} from './curriculum.js';
import {makeLowerScene,LOWER_ITEMS,LOWER_PEOPLE} from './scenes-lower.js';
import {G4_BOOK,G4_PATTERN_EXAMPLES} from './curriculum-grade4.js';
import {makeGrade4Scene,G4_SCHOOL_SPRITES,G4_HOME_SPRITES,G4_PEOPLE_SPRITES,G4_EXTRA_SPRITES} from './scenes-grade4.js';
import {G4_NEAR_ACTIONS} from './engine-grade4.js';
import {G4L_BOOK,G4L_PHONICS,G4L_PATTERN_EXAMPLES} from './curriculum-grade4-lower.js';
import {G4L_NEAR_ACTIONS} from './engine-grade4-lower.js';
import {makeGrade4LowerScene,G4L_FARM_SPRITES,G4L_CLOTHES_SPRITES,G4L_SCHOOL_SPRITES} from './scenes-grade4-lower.js';
import {G5_BOOKS,ORDINALS,g5Pattern,G5_PATTERN_EXAMPLES} from './curriculum-grade5.js';
import {G5_NEAR_ACTIONS} from './engine-grade5.js';
import {makeGrade5Scene,G5_FOOD_SPRITES,G5_NATURE_SPRITES,G5_ACTIVITY_SPRITES} from './scenes-grade5.js';

import {G6_BOOKS,g6Sample} from './curriculum-grade6.js';
import {G6_NEAR_ACTIONS} from './engine-grade6.js';
import {makeGrade6Scene,G6_SPRITES} from './scenes-grade6.js';
let grade6SlotPage=0;
const $=s=>document.querySelector(s),sprites={},keys=new Set();
let loaded=false,soundOn=true,selectedItem=null,drag=null,moveTarget=null,player={x:190,y:220},lastTime=0,clock=0,toastUntil=0,bubbleUntil=0,sceneObjects=[],sceneZones=[],take=null,takeURL=null,requestController=null,letterSelection=null,letterOffset=0,albumURLs=[],responseTimer;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let mapBook=null,phonicsSelection=null,grade4TrayPage=0;
const bookName=book=>BOOKS.find(b=>b.id===book)?.name||'探险';
let saved,initialTrial=false;try{saved=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');initialTrial=localStorage.getItem('windbell-trial-v2')==='true';}catch{}
let game=createAdventure(saved,handleEvent,initialTrial);
if(game.state().chapter.book!=='upper')player={x:70,y:500};
const recorder=new LocalRecorder(voiceStatus,handleTake,microphoneLevel);
const pronunciationBank=new Map();let speechTicket=0,speakingElement=null;
const node=()=>{const s=game.state();return dialogue(s.chapter.id,s.lesson,s.profile);};
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(game.snapshot()));$('#save-status').textContent='进度自动保存';}catch{$('#save-status').textContent='存储已满，进度暂未保存';}}
function toast(text,seconds=3.5){$('#toast').innerHTML=String(text).split(/([A-Za-z][A-Za-z0-9’'.,!? -]*)/g).map((part,index)=>index%2?sayButton(part.trim(),part):esc(part)).join('');$('#toast').hidden=false;toastUntil=performance.now()+seconds*1000;}
function tone(success=false){if(!soundOn)return;try{const ctx=new AudioContext();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=success?660:440;gain.gain.setValueAtTime(.025,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.15);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.16);osc.onended=()=>ctx.close();}catch{}}
function voiceStatus(text,status){$('#voice-status').textContent=text;const recording=status==='recording',wasRecording=$('#record-button').classList.contains('recording');$('#record-button').classList.toggle('recording',recording);$('#record-button span').textContent=recording?'停止录音':'开始录音';$('#record-button').disabled=status==='pending'||status==='preparing';$('#mic-device').disabled=recording||status==='pending';if(recording&&!wasRecording)refreshMicrophones();}
async function refreshMicrophones(){try{const devices=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='audioinput'),select=$('#mic-device'),selected=select.value;select.innerHTML='<option value="">系统默认麦克风</option>'+devices.filter(d=>d.deviceId!=='default'&&d.deviceId!=='communications').map((d,i)=>`<option value="${esc(d.deviceId)}">${esc(d.label||`麦克风 ${i+1}`)}</option>`).join('');if([...select.options].some(o=>o.value===selected))select.value=selected;}catch{}}
function microphoneLevel(data){const meter=$('#mic-meter');meter.hidden=!data;if(!data)return;$('#mic-level').value=data.level||0;const message=data.unavailable?'音量检测不可用，录音仍可回听':data.rms>=.0008?'麦克风收到声音':data.seconds<1.2?'正在检测麦克风…':'没有收到声音，请检查麦克风';$('#mic-level-label').textContent=message;meter.dataset.signal=data.rms>=.0008?'sound':'quiet';}
function handleEvent(event){
 if(!loaded)return;
 if(event.type==='feedback'){toast(event.text);if(event.success)tone(true);}
 if(event.type==='reply'){showReply(event.text);if(event.value&&['milk','juice','water'].includes(event.value)){toast(`小狐狸端来了 ${event.value}，这是你的选择！`,5);}}
 if(event.type==='chapter'){grade6SlotPage=0;grade4TrayPage=0;save();cancelVoice();player=game.state().chapter.book!=='upper'?{x:70,y:500}:{x:180,y:240};moveTarget=null;selectedItem=null;clearTimeout(responseTimer);$('#npc-response').hidden=true;$('#speech-bubble').hidden=true;bubbleUntil=0;toastUntil=0;$('#text-panel').hidden=true;$('#text-answer').value='';render();}
 if(event.type==='change'){save();render();}
 if(event.type==='complete'){save();render();setTimeout(()=>showCompletion(event.chapter),450);}
}
function showReply(text){$('#npc-response').textContent=`伙伴：${text}`;$('#npc-response').dataset.say=text;$('#npc-response').hidden=false;$('#speech-bubble').textContent=text;$('#speech-bubble').dataset.say=text;$('#speech-bubble').hidden=false;bubbleUntil=performance.now()+6000;speakDynamic(text);clearTimeout(responseTimer);responseTimer=setTimeout(()=>{$('#npc-response').hidden=true;},9000);}
function stopSpeech(){speechTicket++;const audio=$('#npc-audio');audio.pause();audio.onerror=null;audio.onended=null;window.speechSynthesis?.cancel();speakingElement?.classList.remove('speaking');speakingElement=null;audio.dataset.playing='false';}
function speakDynamic(text,source=null){
 text=String(text).replace(/^g6-/,'');
 if(recorder.active||recorder.pending){toast('正在录音，停止录音后再听发音。');return;}
 if(!soundOn){toast('声音已关闭，打开声音后可以听发音。');return;}
 stopSpeech();const ticket=speechTicket,audio=$('#npc-audio');speakingElement=source;source?.classList.add('speaking');audio.dataset.pronunciation=text;audio.dataset.playing='true';if(source)toast(`🔊 ${text}`,2.5);
 const ended=()=>{if(ticket!==speechTicket)return;speakingElement?.classList.remove('speaking');speakingElement=null;audio.dataset.playing='false';};
 let usedFallback=false;const fallback=()=>{
  if(ticket!==speechTicket||usedFallback)return;usedFallback=true;
  if(!window.speechSynthesis){ended();toast('这句发音暂时没有加载成功，请再点一次。');return;}
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=.8;const voices=window.speechSynthesis.getVoices();utterance.voice=voices.find(v=>/en-US/i.test(v.lang)&&/zira|natural|aria/i.test(v.name))||voices.find(v=>/^en/.test(v.lang))||null;utterance.onend=ended;utterance.onerror=ended;window.speechSynthesis.speak(utterance);
 };
 const clip=pronunciationBank.get(audioKey(text));if(clip){audio.src=clip;audio.onended=ended;audio.onerror=fallback;audio.play().catch(fallback);}else fallback();
}
function listen(){speakDynamic(node().npc,$('#npc-line'));}
function img(name){return sprites[name]||sprites.fox||'';}
function esc(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function imageHtml(name,alt=''){return `<img src="${img(name)}" alt="${esc(alt)}" draggable="false">`;}
function sayButton(text,label=text,extra='',className=''){return `<button type="button" class="pronounce-word ${className}" data-say="${esc(text)}" aria-label="听 ${esc(text)} 的发音" ${extra}>${esc(label)}</button>`;}
function chapterSpeech(chapter){return chapter.title.match(/[a-z]/i)?`${chapter.unit}. ${chapter.title}`:chapter.unit;}
function objectSpeech(o){return o.speech||o.item||o.sprite||o.label;}
function zoneSpeech(z){if(z.order)return `I'd like some ${z.order.items.join(' and ')}, please.`;if(z.id==='table')return `How many plates? ${NUMBERS[game.state().lesson.plates]||game.state().lesson.plates}.`;return z.speech||z.label.split(' · ')[0]||z.sprite||z.id.replace('part-','');}
function position(x,y,w,h){return `left:${x/10}%;top:${y/6}%;width:${w/10}%;height:${h/6}%;`;}
function object(id,sprite,x,y,w=90,h=110,extra={}){return {id,sprite,x,y,w,h,label:sprite,...extra};}
function zone(id,x,y,w,h,label,extra={}){return {id,x,y,w,h,label,...extra};}

function makeScene(){
 const {chapter:c,lesson:s,profile}=game.state();let objects=[],zones=[],decor='';
 if(G6_BOOKS.includes(c.book))return makeGrade6Scene(game.state(),{object,zone,position,imageHtml,sayButton,esc},{trayPage:grade4TrayPage,slotPage:grade6SlotPage,compact:matchMedia('(max-width:540px)').matches});
 if(G5_BOOKS.includes(c.book))return makeGrade5Scene(game.state(),{object,zone,position,imageHtml,sayButton,esc},{trayPage:grade4TrayPage,compact:matchMedia('(max-width:540px)').matches});
 if(c.book===G4L_BOOK)return makeGrade4LowerScene(game.state(),{object,zone,position,imageHtml,sayButton,esc},{trayPage:grade4TrayPage,compact:matchMedia('(max-width:540px)').matches});
 if(c.book===G4_BOOK)return makeGrade4Scene(game.state(),{object,zone,position,imageHtml,sayButton,esc},{trayPage:grade4TrayPage});
 if(c.book==='lower')return makeLowerScene(game.state(),{object,zone,position,imageHtml,sayButton,esc});
 const guide=object('guide','fox',460,140,120,150,{label:'Fox · 小狐狸',npc:true});
 const orders=c.kind==='festival'?FESTIVAL_ORDERS:ORDERS;
 const tileColors=Object.keys(COLORS);
 const commonPuppet=()=>{
  const p=game.state().progress.lessons.u3?.parts||[];
  const parts=c.kind==='puppet'?s.parts:(p.length===4?p:PARTS);
  const positions={head:[680,200,85,85],body:[680,300,95,115],arm:[680,305,180,140],leg:[680,405,115,145]};
  for(const part of PARTS){const [x,y,w,h]=positions[part];zones.push(zone(`part-${part}`,x,y,w,h,parts.includes(part)?'':part,{sprite:parts.includes(part)?part:null,className:`part-slot part-${part} ${parts.includes(part)?'filled':''}`,decorative:c.kind!=='puppet'}));}
 };
 if(c.kind==='pack'){
  decor='<div class="scene-decor workcloth"></div>';objects.push(guide);
  STATIONERY.forEach((name,i)=>{if(!s.packed.includes(name))objects.push(object(`tool-${i}`,name,360+(i%3)*135,290+Math.floor(i/3)*115,name==='ruler'?110:95,100,{draggable:true,item:name}));});
  zones.push(zone('bag',800,350,210,300,`bag · ${s.packed.length}/7`,{sprite:'bag',className:'bag'}));
  if(s.packed.length)decor+=`<div class="scene-decor packed-list" style="${position(805,510,240,65)};z-index:8;font-size:12px;text-align:center;font-weight:700;color:#fff;background:#246c68dc;border-radius:12px;padding:6px">${s.packed.map(word=>sayButton(word,word,'data-drop-zone="bag"')).join(' · ')}</div>`;
 }else if(c.kind==='paint'||c.kind==='show'){
  objects.push(c.kind==='show'?{...guide,x:860,y:155}:guide);if(c.kind==='show')decor='<div class="scene-decor stage-rug" style="'+position(510,380,760,300)+'"></div>';
  const colors=c.kind==='paint'?tileColors:['red','yellow','blue'];colors.forEach((color,i)=>{const id=c.kind==='paint'?`tile-${i}`:`flag-${i}`;const x=c.kind==='paint'?300+(i%4)*155:250+i*220,y=c.kind==='paint'?290+Math.floor(i/4)*140:190;
   zones.push(zone(id,x,y,c.kind==='paint'?130:135,c.kind==='paint'?90:95,color,{className:'tile',color:s.painted[id],ready:s.painted[id]===color,sprite:c.kind==='show'?'flag':null}));});
  tileColors.forEach((color,i)=>objects.push(object(`paint-${color}`,null,120+i*105,535,75,68,{label:color,draggable:true,item:color,color})));
  if(c.kind==='show'){
   zones=[];['red','yellow','blue'].forEach((color,i)=>zones.push(zone(`flag-${i}`,210+i*155,160,125,85,color,{className:'tile',color:s.painted[`flag-${i}`],sprite:'flag',ready:s.painted[`flag-${i}`]===color})));
   MOVES.forEach((m,i)=>decor+=checkpoint(i,m,s));
  }
 }else if(c.kind==='puppet'){
  decor='<div class="scene-decor workcloth" style="'+position(670,325,340,450)+'"></div>';objects.push(object('guide','fox',440,130,100,130,{label:'Fox',npc:true}));commonPuppet();
  PARTS.forEach((part,i)=>{if(!s.parts.includes(part))objects.push(object(`piece-${part}`,part,170+(i%2)*140,225+Math.floor(i/2)*200,110,145,{draggable:true,item:part}));});
  if(s.parts.length===4){zones=[];MOVES.forEach((m,i)=>decor+=checkpoint(i,m,s));}
  decor+='<div class="body-guide"><strong>木偶身体图</strong>'+['face','ear','eye','nose','mouth','head','body','arm','hand','leg','foot'].map(w=>sayButton(w)).join('')+'</div>';
 }else if(c.kind==='photo'){
  ANIMALS.forEach((a,i)=>{const x=160+(i%5)*165,y=170+Math.floor(i/5)*245;objects.push(object(`animal-${a}`,a,x,y,105,120,{label:a,capture:true,index:i,captured:s.photos.includes(a)}));});
  for(let i=0;i<9;i++)decor+=`<button class="scene-decor pronounce-picture" data-say="bush" aria-label="听 bush 的发音" style="${position(105+(i%5)*180,235+Math.floor(i/5)*220,145,150)};z-index:2">${imageHtml('bush')}</button>`;
  decor+='<div class="photo-album">'+ANIMALS.map(a=>`<button class="pronounce-picture animal-thumb ${s.photos.includes(a)?'collected':''}" data-say="${a}" aria-label="听 ${a} 的发音">${imageHtml(a,a)}</button>`).join('')+'</div>';
 }else if(c.kind==='cafe'||c.kind==='festival'){
  FOOD.forEach((food,i)=>objects.push(object(`food-${food}`,food,125+(i%4)*115,370+Math.floor(i/4)*145,95,105,{draggable:true,item:food})));
  orders.forEach((o,i)=>{const x=c.kind==='cafe'?630+(i%2)*235:560+(i%3)*160,y=c.kind==='cafe'?170+Math.floor(i/2)*220:170+Math.floor(i/3)*215;zones.push(zone(`order-${o.who}`,x,y,c.kind==='cafe'?190:145,c.kind==='cafe'?180:175,o.name,{className:'order',order:o,items:s.orders[o.who]||[],ready:o.items.every(food=>s.orders[o.who]?.includes(food))}));});
  if(c.kind==='festival'){zones.push(zone('table',810,535,260,85,`How many plates? ${s.plates}`,{className:'order',sprite:'plate'}));objects.push(object('plate-stack','plate',330,200,110,90,{draggable:true,item:'plate',label:'plate'}));}
  if(s.talks.drink){objects.push(object('my-drink',profile.drink,400,190,100,125,{label:`你的 ${profile.drink}`}));}
 }else if(c.kind==='party'){
  objects.push(object('guide','fox',250,180,105,140,{label:'Fox · birthday!',npc:true}),object('party-cat','cat',440,135,75,100,{label:'Cat'}),object('party-bird','bird',550,160,80,90,{label:'Bird'}),object('party-dog','dog',660,130,85,100,{label:'Dog'}),object('party-panda','panda',800,155,90,100,{label:'Panda'}));
  decor='<div class="scene-decor tablecloth" style="'+position(590,415,600,280)+'"></div>';
  zones.push(zone('cake',630,325,175,160,`cake · ${s.candles}`,{sprite:'cake',className:'bag'}),zone('table',600,465,560,130,`plates · ${s.plates} / 5`,{className:'bag'}));
  objects.push(object('plate-stack','plate',130,360,115,95,{draggable:true,item:'plate',label:'plate'}),object('candle-box','candle',150,510,60,100,{draggable:true,item:'candle',label:'candle'}));
  for(let i=0;i<s.plates;i++)decor+=`<button class="plate-decoration pronounce-picture" data-say="plate" data-drop-zone="table" aria-label="听 plate 的发音" style="left:${(335+(i%5)*108)/10}%;top:${(405+Math.floor(i/5)*70)/6}%">${imageHtml('plate')}</button>`;
  for(let i=0;i<s.candles;i++)decor+=`<button class="candle-decoration pronounce-picture" data-say="candle" data-drop-zone="cake" aria-label="听 candle 的发音" style="left:${(560+(i%5)*26)/10}%;top:${(240+Math.floor(i/5)*30)/6}%">${imageHtml('candle')}</button>`;
  const revealed=s.talks.askAge;decor+=`<div class="scene-decor" style="${position(430,250,260,75)};z-index:8;text-align:center;background:#fff5d9e8;border-radius:12px;padding:6px"><span class="party-count">${sayButton('five friends','5 friends')} · ${revealed?sayButton(`${NUMBERS[profile.partyAge]} years old`):'先问 '+sayButton('How old are you?')}</span></div>`;
 }
 return {objects,zones,decor};
}
function checkpoint(i,m,s){return `<div class="scene-decor checkpoint ${s.moves.includes(i)?'done':''}" style="left:${(260+i*250)/10}%;top:64%" data-checkpoint="${i}">${sayButton(m.text,m.text,`data-walk-to="${i}"`)}</div>`;}
function render(){
 if(!loaded)return;const {chapter:c,lesson:s,profile,progress,trial}=game.state();
 $('.world-section').style.backgroundImage=`url("assets/${['photo','festival','family-quest','zoo-lab','spring-gates','orchard','kite-lab','friend-detective','school-relay','family-careers'].includes(c.kind)?'forest':'workshop'}.png")`;
 $('#chapter-name').textContent=c.name;$('#chapter-title').textContent=`${c.unit} · ${c.title}`;$('#chapter-title').dataset.say=chapterSpeech(c);$('#chapter-pages').textContent=`教材 p.${c.pages}`;
 $('#book-selector').innerHTML=BOOKS.map(b=>`<button data-book="${b.id}" class="${b.id===c.book?'active':''}" aria-pressed="${b.id===c.book}">${b.name}</button>`).join('');
 const done=goals(c.id,s,profile),goalSprites=G6_BOOKS.includes(c.book)?[c.rewardSprite,'calendar','fox']:G5_BOOKS.includes(c.book)?[c.rewardSprite,'calendar','fox']:c.book===G4L_BOOK?({g4l1:['library','homework','computer'],g4l2:['clock','English book','cash register'],g4l3:['rainy','umbrella','hat'],g4lr1:['homework','clock','umbrella'],g4l4:['tomato','sheep','horse'],g4l5:['shirt','coat','socks'],g4l6:['shoes','skirt','umbrella'],g4lr2:['sheep','pants','umbrella']}[c.id]):c.book===G4_BOOK?({g41:['computer','broom','window'],g42:['schoolbag','English book','key'],g43:['Mike','Amy','John'],g4r1:['picture','English book','glasses'],g44:['house','Amy','key'],g45:['noodles','bowl','chopsticks'],g46:['cousin','doctor','aunt'],g4r2:['key','soup','nurse']}[c.id]):c.book==='lower'?({l1:['China','teacher','schoolgirl'],l2:['father','mother','grandmother'],l3:['giraffe','elephant','panda'],lr1:['China','father','elephant'],l4:['car','box','cap'],l5:['apple','banana','pear'],l6:['kite','crayon','kite'],lr2:['fox','banana','grape']}[c.id]):c.kind==='pack'?['fox','pencil','bag']:c.kind==='puppet'?['head','fox','arm']:c.kind==='photo'?['panda','cat','bird']:c.kind==='cafe'?['bread','fox','milk']:c.kind==='party'?['fox','plate','cake']:['flag','fox','bag'];
 $('#goal-list').innerHTML=c.goals.map((g,i)=>`<li class="${done[i]?'done':''}"><button class="pronounce-picture goal-picture" data-say="${goalSprites[i]}" aria-label="听 ${goalSprites[i]} 的发音">${imageHtml(goalSprites[i])}</button><span>${esc(g)}</span><span class="goal-check">${done[i]?'✓':''}</span></li>`).join('');$('#goal-list').querySelectorAll('img').forEach(i=>i.className='goal-icon');
 $('#chapter-list').innerHTML=chaptersForBook(c.book).map(ch=>`<button class="chapter-row ${ch.id===c.id?'active':''} ${progress.completed.includes(ch.id)?'completed':''} ${!trial&&!canEnter(progress,ch.id)?'locked':''}" data-chapter="${ch.id}" aria-label="${esc(ch.unit+' '+ch.title)}" ${ch.id===c.id?'aria-current="step"':''}><span class="star">${progress.completed.includes(ch.id)?'✓':!trial&&!canEnter(progress,ch.id)?'·':'★'}</span><span>${esc(ch.unit)} &nbsp; ${esc(ch.book!=='upper'?ch.name:ch.id.startsWith('r')?'综合冒险':ch.title)}</span><small>p.${ch.pages}</small></button>`).join('');
 $('#letters-label').textContent=G6_BOOKS.includes(c.book)?'语音与词形工坊':G5_BOOKS.includes(c.book)?'五年级拼读工坊':c.book===G4L_BOOK?'字母组合拼读工坊':c.book===G4_BOOK?'拼读魔法工坊':c.book==='lower'?'短元音拼词工坊':'字母邮路';$('#letters-summary').textContent=c.book!=='upper'?`${s.phonics.length}/${c.phonics.length}`:c.letters?`${s.letters.length}/${c.letters.length}`:'ABC';$('#trial-switch').checked=trial;
 const titles={pack:'操作工作台',paint:'彩虹修路队',puppet:s.parts.length===4?'木偶开始表演！':'组装你的木偶',show:'木偶剧团开演',photo:'等待动物现身，拍下它！',cafe:'今天你是小厨师',party:'筹备生日派对',festival:'森林庆典开场啦'};
 $('#scene-title').textContent=titles[c.kind]||c.name;$('#scene-hint').textContent=c.hint;
 const scene=makeScene();sceneObjects=scene.objects;sceneZones=scene.zones;$('#scene-decor').innerHTML=scene.decor;
 $('#zones').innerHTML=scene.zones.map(z=>{let inside=z.html||(z.sprite?imageHtml(z.sprite):'');if(z.order){inside=`<img class="order-avatar" src="${img(z.order.who)}" alt="${esc(z.order.name)}" data-say="${z.order.who}" data-drop-zone="${z.id}" role="button" tabindex="0" aria-label="听 ${esc(z.order.name)} 的发音">${sayButton(z.order.name,z.order.name,`data-drop-zone="${z.id}"`,'zone-label')}<div class="order-items">${z.order.items.map(item=>sayButton(item,item+(z.items.includes(item)?' ✓':''),`data-drop-zone="${z.id}" data-served="${z.items.includes(item)}"`)).join('')}</div>`;}
  return `<div class="zone ${z.className||''} ${z.ready?'ready':''}" style="${position(z.x,z.y,z.w,z.h)}${selectedItem&&z.id===`part-${selectedItem}`?'z-index:16;':''}${z.color?`--paint:${COLORS[z.color]};`:''}" data-zone="${z.id}" ${z.decorative?'':`role="button" tabindex="0" aria-label="${esc(z.label||z.id)}"`}>${inside}${!z.order&&!z.html&&z.label?`<span class="zone-label">${esc(z.label)}</span>`:''}</div>`;}).join('');
 $('#objects').innerHTML=scene.objects.map(o=>`<button class="object ${o.captured?'captured':''} ${selectedItem===o.item?'selected':''}" style="${position(o.x,o.y,o.w,o.h)}${o.color?`--paint:${COLORS[o.color]};`:''}" data-object="${o.id}" aria-label="${esc(o.draggable?`拿起 ${o.label}`:o.capture?`拍摄 ${o.label}`:o.label)}">${o.color?'<span class="color-token"></span>':imageHtml(o.sprite)}<span class="object-label">${esc(o.label)}</span></button>`).join('');
 const d=node();$('#npc-line').textContent=d.npc;$('#npc-line').dataset.say=d.npc;$('#dialogue-help').textContent=d.help;$('#examples').innerHTML=d.examples.map(text=>sayButton(text)).join('<br>');$('#hint-button').textContent=$('#examples').hidden?'看说法':'收起说法';
 const completed=done.every(Boolean);$('#replay-button .replay-label').textContent=completed?'再玩一遍':'重玩本关';$('#next-button').hidden=!completed;$('#next-button').innerHTML=c.id==='g6lr'?'查看毕业成果':c.id==='g6ur2'?'进入六年级下册':c.id==='g5lr2'?'进入六年级上册':c.id==='g5ur2'?'进入五年级下册':c.id==='g4lr2'?'进入五年级上册':c.id==='g4r2'?'进入四年级下册':c.id==='lr2'?'进入四年级上册':c.id==='r2'?'进入三年级下册':'下一站 <span aria-hidden="true">→</span>';
 const banner=$('#scene-banner');if([G4_BOOK,G4L_BOOK,...G5_BOOKS,...G6_BOOKS].includes(c.book))$('.world-section').insertBefore(banner,$('.scene-controls'));else $('#playfield').append(banner);
 banner.hidden=!completed;if(completed)banner.textContent=`${c.reward} 已获得！可以继续探索，或去下一站。`;
 $('#action-buttons').innerHTML=['puppet','show'].includes(c.kind)&&(c.kind==='show'||s.parts.length===4)?MOVES.map(m=>`<button data-move="${m.id}">${m.key} · ${m.name}</button>`).join(''):['party','festival'].includes(c.kind)?'<button data-count="plates">收回一个盘子</button>'+(c.kind==='party'?'<button data-count="candles">取下一根蜡烛</button>':''):'';
 if(c.book!=='upper')$('#action-buttons').innerHTML=scene.actions.map(a=>`<button data-lower-action="${a.name}" data-value="${a.value??''}" ${a.disabled?'disabled':''}>${esc(a.text)}</button>`).join('');
 $('#controls-note').textContent=c.kind==='photo'?'点动物拍照并听读 · 相册里的动物也能点读':['puppet','show'].includes(c.kind)&&$('#action-buttons').children.length?'点英文听读 · 空地 / WASD 移动 · 站上标记做动作':'点物体 / 英文听发音 · 拖动或点选放置 · WASD 移动';
 const puppetActive=['puppet','show'].includes(c.kind)&&((c.kind==='puppet'&&s.parts.length===4)||c.kind==='show');
 $('#player').src=img('explorer');$('#player').hidden=puppetActive;$('#puppet-player').hidden=!puppetActive;
 $('.world-section').dataset.book=c.book;$('#playfield').dataset.book=c.book;$('#playfield').dataset.chapter=c.id;$('#playfield').dataset.complete=String(completed);$('#playfield').dataset.photos=String(s.photos.length);updatePlayer();bindScene();
 if(c.book!=='upper')$('#controls-note').textContent='点物体 / 英文听读 · 点空地 / WASD 移动 · E 附近操作';
}
function coordinates(event){const r=$('#playfield').getBoundingClientRect();return {x:(event.clientX-r.left)/r.width*1000,y:(event.clientY-r.top)/r.height*600};}
function findZone(x,y,item){const matches=sceneZones.filter(z=>Math.abs(x-z.x)<=z.w/2+15&&Math.abs(y-z.y)<=z.h/2+15);return matches.find(z=>z.id===`part-${item}`)||matches.sort((a,b)=>Math.hypot(x-a.x,y-a.y)-Math.hypot(x-b.x,y-b.y))[0];}
function pronounceTarget(target){
 speakDynamic(target.dataset.say,target);
 if(target.dataset.walkTo!==undefined){moveTarget={x:260+Number(target.dataset.walkTo)*250,y:384};selectedItem=null;}
 if(target.dataset.dropZone&&selectedItem){const item=selectedItem;selectedItem=null;game.drop(item,target.dataset.dropZone);render();}
}
function bindScene(){
 $('#objects').querySelectorAll('[data-object]').forEach(el=>{
  const o=sceneObjects.find(x=>x.id===el.dataset.object);
  if(o.draggable){el.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();speakDynamic(objectSpeech(o),el);const pos=coordinates(event);drag={object:o,el,start:pos,moved:false,pointer:event.pointerId};el.setPointerCapture(event.pointerId);el.classList.add('dragging');});
   el.addEventListener('pointermove',event=>{if(drag?.el!==el)return;const p=coordinates(event);if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)>10)drag.moved=true;if(drag.moved){el.style.left=`${Math.max(35,Math.min(965,p.x))/10}%`;el.style.top=`${Math.max(30,Math.min(570,p.y))/6}%`;}});
   el.addEventListener('pointerup',event=>{if(drag?.el!==el)return;const p=coordinates(event),moved=drag.moved;el.releasePointerCapture(event.pointerId);drag=null;if(moved){const z=findZone(p.x,p.y,o.item);if(z)game.drop(o.item,z.id);else toast('拿到目标附近再放下。也可以点道具，再点目标。');selectedItem=null;render();}else{selectedItem=selectedItem===o.item?null:o.item;render();if(selectedItem)toast(`拿起了 ${o.item}。点一下目标位置。`,2.5);}});
   el.addEventListener('pointercancel',()=>{drag=null;render();});
   el.addEventListener('click',event=>{event.stopPropagation();if(event.detail===0){speakDynamic(objectSpeech(o),el);selectedItem=selectedItem===o.item?null:o.item;render();if(selectedItem)toast(`拿起了 ${o.item}，现在点目标位置。`);}});
  }else el.addEventListener('click',event=>{event.stopPropagation();speakDynamic(objectSpeech(o),el);if(o.action)performLowerAction(o.action,o.value,el,o);if(o.capture){const visible=animalPosition(o).visible;if(game.photograph(o.sprite,visible)){const f=$('#photo-flash');f.classList.remove('flash');void f.offsetWidth;f.classList.add('flash');}}});
 });
 $('#zones').querySelectorAll('[data-zone]').forEach(el=>{const activate=event=>{event.stopPropagation();const nested=event.target.closest('[data-lower-action]');if(nested){performLowerAction(nested.dataset.lowerAction,nested.dataset.value,nested);return;}const word=event.target.closest('[data-say]');if(word){pronounceTarget(word);return;}const z=sceneZones.find(z=>z.id===el.dataset.zone);if(z)speakDynamic(zoneSpeech(z),el);if(selectedItem){const item=selectedItem;selectedItem=null;game.drop(item,el.dataset.zone);render();}else if(z?.action)performLowerAction(z.action,z.value,el,z);};el.addEventListener('click',activate);el.addEventListener('keydown',event=>{if(event.target===el&&['Enter',' '].includes(event.key)){event.preventDefault();activate(event);}});});
 $('#action-buttons').querySelectorAll('[data-move]').forEach(el=>el.addEventListener('click',()=>performMove(el.dataset.move)));
 $('#action-buttons').querySelectorAll('[data-count]').forEach(el=>el.addEventListener('click',()=>game.count(el.dataset.count,-1)));
}
function performMove(action){const move=MOVES.find(m=>m.id===action);if(move)speakDynamic(move.text,$(`[data-move="${action}"]`));const index=[260,510,760].findIndex(x=>Math.hypot(player.x-x,player.y-384)<95);if(index<0){toast('先走到一个圆形舞台标记上，再做动作。');return;}if(game.move(index,action)){const actor=$('#puppet-player');actor.classList.remove('wave','clap','stamp');void actor.offsetWidth;actor.classList.add(action);setTimeout(()=>actor.classList.remove(action),1100);}}
function performLowerAction(name,value,source=null,target=null){
 if(G6_BOOKS.includes(game.state().chapter.book)){performGrade6Action(name,value,source,target);return;}
 if(G5_BOOKS.includes(game.state().chapter.book)){performGrade5Action(name,value,source,target);return;}
 if(game.state().chapter.book===G4L_BOOK){performGrade4LowerAction(name,value,source,target);return;}
 if(game.state().chapter.book===G4_BOOK){performGrade4Action(name,value,source,target);return;}
 if(game.state().chapter.book!=='lower')return;
 if(name==='select-feature'){speakDynamic(value,source);selectedItem=value;render();toast(`拿起 ${value}，点右边对应的拼图位置。`);return;}
 if(name==='interact'){const nearby=[...sceneObjects,...sceneZones].filter(o=>o.action&&Math.hypot(o.x-player.x,o.y-player.y)<105).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];if(!nearby){toast('先点击目标走过去，到附近再按 E。');return;}performLowerAction(nearby.action,nearby.value,null,nearby);return;}
 if(['family-photo','gate','search','harvest','launch'].includes(name)&&target&&Math.hypot(target.x-player.x,target.y-player.y)>=105){moveTarget={x:target.x,y:Math.max(125,Math.min(535,target.y))};selectedItem=null;toast('正在走过去。到附近再点一次，或按 E 操作。');return;}
 if(source?.dataset.actionSpeech)speakDynamic(source.dataset.actionSpeech,source);
 const numeric=['gate','target','mark-kite','crayon'].includes(name)?Number(value):value;
 game.action(name,numeric,true);
}
function performGrade4Action(name,value,source=null,target=null){
 if(game.state().chapter.book!==G4_BOOK)return;
 if(name==='tray-page'){grade4TrayPage=Math.max(0,Math.min(10,Number(value)||0));selectedItem=null;render();return;}
 if(name==='interact'){
  const nearby=[...sceneObjects,...sceneZones].filter(o=>G4_NEAR_ACTIONS.includes(o.action)&&Math.hypot(o.x-player.x,o.y-player.y)<105).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
  if(!nearby){toast('先点击场景目标走过去，到附近再按 E。');return;}
  performGrade4Action(nearby.action,nearby.value,null,nearby);return;
 }
 target??=[...sceneObjects,...sceneZones].find(o=>o.action===name&&String(o.value)===String(value));
 if(G4_NEAR_ACTIONS.includes(name)){
  if(!target){toast('先找到场景里的目标。');return;}
  if(Math.hypot(target.x-player.x,target.y-player.y)>=105){moveTarget={x:target.x,y:Math.max(125,Math.min(535,target.y))};selectedItem=null;toast('正在走过去，到附近再点一次或按 E。');return;}
 }
 if(source?.dataset.actionSpeech)speakDynamic(source.dataset.actionSpeech,source);
 selectedItem=null;game.action(name,['locker','stamp'].includes(name)?Number(value):value,true);
}
function performGrade4LowerAction(name,value,source=null,target=null){
 if(game.state().chapter.book!==G4L_BOOK)return;
 if(name==='tray-page'){grade4TrayPage=Math.max(0,Math.min(10,Number(value)||0));selectedItem=null;render();return;}
 if(name==='interact'){const nearby=[...sceneObjects,...sceneZones].filter(o=>G4L_NEAR_ACTIONS.includes(o.action)&&Math.hypot(o.x-player.x,o.y-player.y)<105).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];if(!nearby){toast('先点击场景目标走过去，到附近再按 E。');return;}performGrade4LowerAction(nearby.action,nearby.value,null,nearby);return;}
 target??=[...sceneObjects,...sceneZones].find(o=>o.action===name&&String(o.value)===String(value));
 if(G4L_NEAR_ACTIONS.includes(name)){if(!target)return;if(Math.hypot(target.x-player.x,target.y-player.y)>=105){moveTarget={x:target.x,y:Math.max(125,Math.min(535,target.y))};selectedItem=null;toast('正在走过去，到附近再点一次或按 E。');return;}}
 const before=game.state().lesson.g4l;const stage=before.stage,day=before.day,trip=before.trip;
 if(source?.dataset.actionSpeech)speakDynamic(source.dataset.actionSpeech,source);
 if(['hour','minute','size'].includes(name))speakDynamic(name==='minute'&&Number(value)===30?'thirty':NUMBERS[Number(value)]||String(value),source);
 selectedItem=null;game.action(name,value,true);
 if(stage!==before.stage||day!==before.day||trip!==before.trip){grade4TrayPage=0;render();}
}
function updatePlayer(){for(const el of [$('#player'),$('#puppet-player')]){el.style.left=`${player.x/10}%`;el.style.top=`${player.y/6}%`;}$('#playfield').dataset.playerX=String(Math.round(player.x));$('#playfield').dataset.playerY=String(Math.round(player.y));}
function performGrade5Action(name,value,source=null,target=null){
 if(name==='tray-page'){grade4TrayPage=Math.max(0,Math.min(12,Number(value)||0));selectedItem=null;render();return;}
 if(name==='g5-pick'){speakDynamic(value,source);selectedItem=value;render();toast(`拿起 ${value}，点人物档案框放下。`);return;}
 if(name==='interact'){target=[...sceneObjects,...sceneZones].filter(o=>G5_NEAR_ACTIONS.includes(o.action)&&Math.hypot(o.x-player.x,o.y-player.y)<105).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];if(!target){toast('先点击场景目标走过去，到附近再按 E。');return;}name=target.action;value=target.value;}
 target??=[...sceneObjects,...sceneZones].find(o=>o.action===name&&String(o.value)===String(value));
 if(name==='g5-weekend')target??=sceneObjects.find(o=>o.action===name);
 if(G5_NEAR_ACTIONS.includes(name)){if(!target)return;if(Math.hypot(target.x-player.x,target.y-player.y)>=105){moveTarget={x:target.x,y:Math.max(125,Math.min(535,target.y))};selectedItem=null;toast('正在走过去，到附近再点一次或按 E。');return;}}
 if(name==='g5-date')speakDynamic(ORDINALS[Number(value)],source);
 else if(name==='g5-hour'||name==='g5-combo'&&/^\d+$/.test(value))speakDynamic(NUMBERS[Number(value)]||String(value),source);
 else if(value&&/[a-z]/i.test(value)&&!['confirm','next','off','on'].includes(value))speakDynamic(value,source);
 const g=game.state().lesson.g5,stage=g.stage,round=g.round;selectedItem=null;game.action(name,value,true);if(stage!==g.stage||round!==g.round){grade4TrayPage=0;render();}
}
function performGrade6Action(name,value,source=null,target=null){
 if(name==='tray-page'){grade4TrayPage=Math.max(0,Number(value)||0);selectedItem=null;render();return;}
 if(name==='g6-slot'){if(source)speakDynamic(source.textContent,source);grade6SlotPage=Number(value)||0;grade4TrayPage=0;selectedItem=null;render();return;}
 if(name==='interact'){target=[...sceneObjects,...sceneZones].find(o=>G6_NEAR_ACTIONS.includes(o.action)&&Math.hypot(o.x-player.x,o.y-player.y)<105);if(!target){toast('先走近目标，再按 E。');return;}name=target.action;value=target.value;}
 target??=[...sceneObjects,...sceneZones].find(o=>o.action===name&&String(o.value)===String(value));
 if(G6_NEAR_ACTIONS.includes(name)){if(!target)return;if(Math.hypot(target.x-player.x,target.y-player.y)>=105){moveTarget={x:target.x,y:Math.max(125,Math.min(535,target.y))};selectedItem=null;toast('正在走过去，到附近再点一次或按 E。');return;}}
 if(name==='g6-view'&&source)speakDynamic(source.textContent,source);
 else if(value&&/[a-z]/i.test(value)&&!['confirm','next','inspect','reset'].includes(value))speakDynamic(g6Sample(game.state().chapter,value),source);
 else if(name==='g6-sequence'&&/^\d+$/.test(value))speakDynamic(NUMBERS[Number(value)]||value,source);
 const g=game.state().lesson.g6,stage=g.stage,round=g.round;selectedItem=null;game.action(name,value,true);if(stage!==g.stage||round!==g.round){grade6SlotPage=0;grade4TrayPage=0;render();}
}
function animalPosition(o){const t=clock+o.index*1.1;return {x:o.x+(reducedMotion?0:Math.sin(t*.65)*42),y:o.y+(reducedMotion?0:Math.cos(t*.6)*30),visible:Math.sin(t*.7)>-.45};}
function loop(time){const dt=Math.min((time-lastTime)/1000||0,.25);lastTime=time;clock+=dt;let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
 if(dx||dy){moveTarget=null;const norm=Math.hypot(dx,dy);player.x+=dx/norm*230*dt;player.y+=dy/norm*230*dt;}
 else if(moveTarget){const distance=Math.hypot(moveTarget.x-player.x,moveTarget.y-player.y);if(distance<7)moveTarget=null;else{const step=Math.min(distance,230*dt);player.x+=(moveTarget.x-player.x)/distance*step;player.y+=(moveTarget.y-player.y)/distance*step;}}
 player.x=Math.max(70,Math.min(930,player.x));player.y=Math.max(125,Math.min(535,player.y));updatePlayer();
 if(game.state().chapter.kind==='photo'){for(const o of sceneObjects){if(!o.capture)continue;const p=animalPosition(o),el=$(`[data-object="${o.id}"]`);if(el){el.style.left=`${p.x/10}%`;el.style.top=`${p.y/6}%`;el.classList.toggle('hidden-animal',!p.visible);el.dataset.visible=String(p.visible);}}}
 if(!reducedMotion&&game.state().chapter.book==='lower'){for(const o of sceneObjects){if(!o.bob)continue;const el=$(`[data-object="${o.id}"]`);if(el){el.style.top=`${(o.y+Math.sin(clock*1.2+o.index)*9)/6}%`;el.style.transform=`translate(-50%,-50%) rotate(${Math.sin(clock*.6+o.index)*3}deg)`;}}}
 if(time>toastUntil)$('#toast').hidden=true;if(time>bubbleUntil)$('#speech-bubble').hidden=true;requestAnimationFrame(loop);
}

async function handleTake(record,token){
 if(token!==recorder.generation)return;clearTake();take=record;takeURL=URL.createObjectURL(record.blob);$('#take-audio').src=takeURL;$('#take-panel').hidden=false;$('#transcript').value='';$('#send-button').disabled=true;requestController=new AbortController();const pendingTake=take;
 try{const data=await transcribe(record.blob,requestController.signal,p=>{if(take===pendingTake)voiceStatus(p.percent===null?'正在准备设备上的英语识别，录音不会上传…':`正在下载英语识别组件 · 本部分 ${p.percent}%`,'transcribing');});if(take!==pendingTake)return;take.text=data.text;take.originalText=data.text;$('#transcript').value=data.text;voiceStatus(data.message||(data.text?(data.uncertain?'识别可能不准，请回听并确认文字。':'请确认文字，再发送给角色。识别文字不代表发音评分。'):'没有听清英语。请回听、重录，或改正文字。'),data.reason==='no-sound'?'error':'ready');}
 catch(e){if(e.name==='AbortError')return;if(take===pendingTake)voiceStatus(e.message+' 录音仍可保存和回听。','error');}
 finally{if(take===pendingTake){$('#send-button').disabled=false;requestController=null;}}
}
function clearTake(){requestController?.abort();requestController=null;if(takeURL)URL.revokeObjectURL(takeURL);takeURL=null;take=null;$('#take-audio').pause();$('#take-audio').removeAttribute('src');$('#take-panel').hidden=true;}
function cancelVoice(){stopSpeech();recorder.cancel();clearTake();voiceStatus('录音只保存在本机 · 可回听、重录','idle');}
async function persistTake(answered=false){if(!take)return false;take.text=$('#transcript').value.trim();take.answered=answered;take.corrected=take.text!==take.originalText;try{await saveRecording(take);await updateRecordCount();voiceStatus('这段录音已保存到录音册，可以回听、下载和删除。','saved');return true;}catch(e){voiceStatus(`保存失败：${e.message} 请先下载或清理录音册。`,'error');return false;}}
async function sendTake(){if(!take)return;const current=node();if(take.chapter!==game.state().chapter.id||take.node!==current.key){voiceStatus('对话已经换到下一句。请为这句话重新录音。原录音仍可保存。','error');return;}
 const text=$('#transcript').value.trim();const record=take;const result=game.talk(text,'voice');if(result.ok){await persistTake(true);if(take===record)clearTake();}else voiceStatus(result.reason,'error');}
async function updateRecordCount(){try{const rows=await allRecordings();$('#record-count').textContent=rows.length||'';}catch{}}
async function showAlbum(){recorder.stop();$('#album-dialog').showModal();albumURLs.forEach(URL.revokeObjectURL);albumURLs=[];try{const rows=await allRecordings();$('#recordings-list').innerHTML=rows.length?rows.map(r=>{const url=URL.createObjectURL(r.blob);albumURLs.push(url);const chapter=CHAPTERS.find(c=>c.id===r.chapter);return `<article class="recording-row"><div><h3>${chapter?esc(bookName(chapter.book)+' · '):''}${esc(chapter?.name||'探险录音')} · ${Math.round(r.seconds)} 秒</h3><p>${esc(r.text||'尚未识别或未填写文字')}</p><p class="small-note">${new Date(r.date).toLocaleString('zh-CN')}${r.corrected?' · 文字已改正':''}${r.answered?' · 已发送给角色':''}</p></div><div class="record-actions"><a href="${url}" download="风铃岛-${r.chapter}-${new Date(r.date).toISOString().slice(0,10)}.${r.blob.type.includes('wav')?'wav':r.blob.type.includes('mp4')?'m4a':'webm'}">下载</a><button data-delete-record="${r.id}">删除</button></div><audio src="${url}" controls></audio></article>`;}).join(''):'<div class="empty-album">还没有录音。回到游戏，和伙伴说一句英语，再保存到这里。</div>';
 $('#recordings-list').querySelectorAll('[data-delete-record]').forEach(button=>button.addEventListener('click',async()=>{await deleteRecording(button.dataset.deleteRecord);await updateRecordCount();await refreshAlbum();}));
 }catch{$('#recordings-list').textContent='浏览器存储暂时不可用。你仍可以在游戏里录音和回听。';}}
async function refreshAlbum(){const dialog=$('#album-dialog');dialog.close();await showAlbum();}
function renderMap(){const {progress,trial,chapter}=game.state();mapBook??=chapter.book;$('#map-books').innerHTML=BOOKS.map(b=>`<button data-map-book="${b.id}" class="${mapBook===b.id?'active':''}" aria-pressed="${mapBook===b.id}">${b.name} · ${progress.completed.filter(id=>chaptersForBook(b.id).some(c=>c.id===id)).length}/${chaptersForBook(b.id).length}</button>`).join('');$('#map-content').innerHTML=chaptersForBook(mapBook).map(c=>`<article class="map-row"><div><h3>${sayButton(chapterSpeech(c),`${c.unit} · ${c.title}`)}</h3><span class="pages">${esc(c.name)} / p.${c.pages}${c.letters?' / 字母 '+[...c.letters].map(letter=>sayButton(letter)).join(''):''}${c.phonics?' / 拼读 '+c.phonics.map(w=>sayButton(G6_BOOKS.includes(c.book)?g6Sample(c,w):w,w)).join(' · '):''}</span></div><div><div class="expressions">${c.expressions.flatMap(practiceExpressions).map(text=>sayButton(text)).join('<br>')}</div><div class="words">${c.words.map(word=>sayButton(G6_BOOKS.includes(c.book)?g6Sample(c,word):word,word)).join(' · ')}</div></div><button data-map-chapter="${c.id}" data-replay="${progress.completed.includes(c.id)}">${progress.completed.includes(c.id)?'再玩一遍':trial||canEnter(progress,c.id)?'进入关卡':'尚未解锁'}</button></article>`).join('');$('#map-content').querySelectorAll('[data-map-chapter]').forEach(b=>b.addEventListener('click',()=>{if(game.go(b.dataset.mapChapter)){$('#map-dialog').close();if(b.dataset.replay==='true')requestReplay();}}));}
function showLetters(){letterOffset=0;letterSelection=null;phonicsSelection=null;const c=game.state().chapter;$('#letter-feedback').textContent=c.book==='upper'?'先点一个大写字母，再点对应的小写字母。':[G4_BOOK,G4L_BOOK,...G5_BOOKS,...G6_BOOKS].includes(c.book)?'先点一个单词，听一听，再选择它的拼读规律。':'先点一个单词，听一听，再补入元音字母。';$('#letters-dialog [data-close]').setAttribute('aria-label',c.book==='upper'?'关闭字母邮路':'关闭拼读工坊');$('#letters-dialog').showModal();renderLetters();}
function renderLetters(){const {chapter:c,lesson:s}=game.state();const letters=c.letters||'ABCDEFGHIJKLMNOPQRSTUVWXYZ';const batch=[...letters].slice(letterOffset,letterOffset+6);if(!batch.length){letterOffset=0;return renderLetters();}const shuffled=[...batch].sort((a,b)=>((a.charCodeAt(0)*7)%11)-((b.charCodeAt(0)*7)%11)).reverse();
 if(G6_BOOKS.includes(c.book)){renderGrade6Phonics(c,s);return;}
 if(G5_BOOKS.includes(c.book)){renderGrade5Phonics(c,s);return;}
 $('#letters-dialog h2').textContent=G5_BOOKS.includes(c.book)?'五年级拼读工坊':c.book===G4L_BOOK?'字母组合拼读工坊':c.book===G4_BOOK?'拼读魔法工坊':c.book==='lower'?'短元音拼词工坊':'字母邮路';$('#letter-next').hidden=c.book!=='upper';
 if(c.book===G4_BOOK){renderGrade4Phonics(c,s);return;}
 if(c.book===G4L_BOOK){renderGrade4LowerPhonics(c,s);return;}
 if(c.book==='lower'){renderPhonics(c,s);return;}
 $('#letter-game').classList.remove('phonics-game');$('#letter-feedback').textContent='先点一个大写字母，再点对应的小写字母。';
 $('#letter-description').innerHTML=c.letters?`${sayButton(c.unit)} 的字母：${[...c.letters].map(letter=>sayButton(letter)).join('')}。把字母送进对应的小写邮袋。`:`${sayButton('Unit 1')} 的 ${[...'ABC'].map(letter=>sayButton(letter)).join('')} 热身：认识字母，不要求拼写单词。`;
 $('#letter-game').innerHTML=`<div class="letter-column">${batch.map(l=>`<button data-upper="${l}" class="${s.letters.includes(l)?'matched':''} ${letterSelection===l?'selected':''}" aria-label="大写 ${l}">${l}</button>`).join('')}</div><div class="letter-column">${shuffled.map(l=>`<button data-lower="${l.toLowerCase()}" class="${s.letters.includes(l)?'matched':''}" aria-label="小写 ${l.toLowerCase()}">${l.toLowerCase()}</button>`).join('')}</div>`;
 $('#letter-game').querySelectorAll('[data-upper]').forEach(b=>b.addEventListener('click',()=>{letterSelection=b.dataset.upper;renderLetters();speakDynamic(letterSelection);$('#letter-feedback').textContent=`把 ${letterSelection} 送到对应的小写邮袋。`;}));
 $('#letter-game').querySelectorAll('[data-lower]').forEach(b=>b.addEventListener('click',()=>{const lower=b.dataset.lower;speakDynamic(lower,b);if(!letterSelection)return;const match=letterSelection.toLowerCase()===lower;if(match){if(c.letters)game.letter(letterSelection,lower);$('#letter-feedback').textContent=`${letterSelection} 和 ${lower} 是一对，送达！`;letterSelection=null;renderLetters();tone(true);}else $('#letter-feedback').textContent='这个邮袋不匹配，看看字母形状，再试试。';}));
}
function renderPhonics(c,s){$('#letter-description').innerHTML=`教材 p.${c.phonicsPages} 的拼读支线：先听完整单词，找出中间的短元音字母。a / e / i / o / u 按钮读字母名称；短元音发音通过单词示范。`;
 $('#letter-game').classList.add('phonics-game');$('#letter-game').innerHTML=`<div class="phonics-words">${c.phonics.map(w=>`<button data-phonics-word="${w}" class="${s.phonics.includes(w)?'matched':''} ${phonicsSelection===w?'selected':''}" aria-label="拼词 ${w}">${esc(s.phonics.includes(w)?w:w.replace(/[aeiou]/,'_'))}${s.phonics.includes(w)?' ✓':''}<small>点击听发音</small></button>`).join('')}</div><div class="phonics-vowels">${[...'aeiou'].map(v=>`<button data-vowel="${v}" aria-label="元音字母 ${v}">${v}</button>`).join('')}</div>`;
 $('#letter-game').querySelectorAll('[data-phonics-word]').forEach(b=>b.addEventListener('click',()=>{phonicsSelection=b.dataset.phonicsWord;speakDynamic(phonicsSelection,b);renderPhonics(c,game.state().lesson);$('#letter-feedback').textContent='选择这个单词缺少的元音字母。';}));
 $('#letter-game').querySelectorAll('[data-vowel]').forEach(b=>b.addEventListener('click',()=>{speakDynamic(b.dataset.vowel,b);if(!phonicsSelection){$('#letter-feedback').textContent='先点一个单词，听一听。';return;}const word=phonicsSelection;if(game.phonics(word,b.dataset.vowel)){phonicsSelection=null;renderPhonics(c,game.state().lesson);$('#letter-feedback').textContent=`${word} 拼好了！再点单词跟读。`;tone(true);}else $('#letter-feedback').textContent='这个字母不匹配，再听单词试试。';}));
}
function renderGrade4Phonics(c,s){
 $('#letter-description').textContent=`教材 p.${c.phonicsPages}：听完整单词，再选择它的拼读规律。a-e / i-e / o-e / u-e 中的词尾 e 通常不发音；me / he / she / we 的词尾 e 读长音。按钮用范词示范发音。`;
 $('#letter-game').classList.add('phonics-game');
 const patterns=[...new Set(['a-e','i-e','o-e','u-e','-e',...c.phonics.map(w=>Object.entries(G4_PATTERN_EXAMPLES).find(([,sample])=>sample===w)?.[0]).filter(Boolean)])];
 $('#letter-game').innerHTML=`<div class="phonics-words">${c.phonics.map(w=>`<button data-g4-phonics-word="${esc(w)}" class="${s.phonics.includes(w)?'matched':''} ${phonicsSelection===w?'selected':''}" aria-label="拼读 ${esc(w)}">${esc(w)}${s.phonics.includes(w)?' ✓':''}<small>点击听完整单词</small></button>`).join('')}</div><div class="g4-phonics-patterns">${patterns.map(p=>`<button data-g4-pattern="${p}">${p.startsWith('short ')?'短元音 '+p.slice(6):p}<small>听 ${G4_PATTERN_EXAMPLES[p]}</small></button>`).join('')}</div>`;
 $('#letter-game').querySelectorAll('[data-g4-phonics-word]').forEach(b=>b.addEventListener('click',()=>{phonicsSelection=b.dataset.g4PhonicsWord;speakDynamic(phonicsSelection,b);renderGrade4Phonics(c,game.state().lesson);$('#letter-feedback').textContent='选择这个单词的拼读规律。';}));
 $('#letter-game').querySelectorAll('[data-g4-pattern]').forEach(b=>b.addEventListener('click',()=>{const pattern=b.dataset.g4Pattern;speakDynamic(G4_PATTERN_EXAMPLES[pattern],b);if(!phonicsSelection){$('#letter-feedback').textContent='先点击一个单词，听完整发音。';return;}const word=phonicsSelection;if(game.phonics(word,pattern)){phonicsSelection=null;renderGrade4Phonics(c,game.state().lesson);$('#letter-feedback').textContent=`${word} 的拼读规律找对啦！再点单词跟读。`;tone(true);}else $('#letter-feedback').textContent='再观察拼写、听完整词，试试另一种规律。';}));
}
function renderGrade4LowerPhonics(c,s){
 $('#letter-description').textContent=`教材 p.${c.phonicsPages}：听完整单词，找字母组合。ir / ur 常读相同的音；horse / fork 的 or 与 w 后 homework / world 的 or 不同。范词按钮播放完整词，不把字母名称当作音素。`;
 $('#letter-game').classList.add('phonics-game');const patterns=[...new Set(c.phonics.map(w=>G4L_PHONICS[w]))];
 $('#letter-game').innerHTML=`<div class="phonics-words">${c.phonics.map(w=>`<button data-g4l-phonics-word="${esc(w)}" class="${s.phonics.includes(w)?'matched':''} ${phonicsSelection===w?'selected':''}" aria-label="拼读 ${esc(w)}">${esc(w)}${s.phonics.includes(w)?' ✓':''}<small>点击听完整单词</small></button>`).join('')}</div><div class="g4-phonics-patterns">${patterns.map(p=>`<button data-g4l-pattern="${p}">${p==='w-or'?'w 后的 or':p}<small>听 ${G4L_PATTERN_EXAMPLES[p]}</small></button>`).join('')}</div>`;
 $('#letter-game').querySelectorAll('[data-g4l-phonics-word]').forEach(b=>b.addEventListener('click',()=>{phonicsSelection=b.dataset.g4lPhonicsWord;speakDynamic(phonicsSelection,b);renderGrade4LowerPhonics(c,game.state().lesson);$('#letter-feedback').textContent='看拼写、听单词，选择对应的字母组合。';}));
 $('#letter-game').querySelectorAll('[data-g4l-pattern]').forEach(b=>b.addEventListener('click',()=>{const pattern=b.dataset.g4lPattern;speakDynamic(G4L_PATTERN_EXAMPLES[pattern],b);if(!phonicsSelection){$('#letter-feedback').textContent='先点击一个单词，听一听。';return;}const word=phonicsSelection;if(game.phonics(word,pattern)){phonicsSelection=null;renderGrade4LowerPhonics(c,game.state().lesson);$('#letter-feedback').textContent=`${word} 的字母组合找对啦！再点单词跟读。`;tone(true);}else $('#letter-feedback').textContent='这个字母组合不匹配，再听一次完整单词。';}));
}
function showCompletion(c){if(document.querySelector('dialog[open]')||game.state().chapter.id!==c.id)return;const {lesson:s,profile}=game.state();if(!goals(c.id,s,profile).every(Boolean))return;$('#completion-title').textContent=`${c.name} · 完成！`;$('#completion-copy').textContent=`你获得了「${c.reward}」。可以再玩一遍，也可以继续下一站。`;const reward={pack:'bag',paint:'flag',puppet:'assembled-puppet',show:'assembled-puppet',photo:'panda',cafe:'bread',party:'cake',festival:'panda'};$('#reward-image').src=img(c.rewardSprite||reward[c.kind]);$('#reward-image').dataset.say=c.rewardSprite||(reward[c.kind]==='assembled-puppet'?'puppet':reward[c.kind]);const voiced=Object.values(s.talks).filter(t=>t.mode==='voice').length,texted=Object.values(s.talks).filter(t=>t.mode==='text').length;$('#completion-review').textContent=`完成 3 个任务 · ${voiced} 次录音对话${texted?` · ${texted} 次文字对话`:''}。${voiced?'打开录音册，听听自己的声音！':'还可以留在这里，录下自己的英语。'}`;$('#continue-button').textContent=c.id==='g6lr'?'查看毕业成果':c.id==='g6ur2'?'进入六年级下册':c.id==='g5lr2'?'进入六年级上册':c.id==='g5ur2'?'进入五年级下册':c.id==='g4lr2'?'进入五年级上册':c.id==='g4r2'?'进入四年级下册':c.id==='lr2'?'进入四年级上册':c.id==='r2'?'进入三年级下册':'去下一站';$('#completion-dialog').showModal();}
function renderGrade6Phonics(c,s){
 $('#letters-dialog h2').textContent='语音与词形工坊';$('#letter-next').hidden=true;$('#letter-description').textContent=`教材 p.${c.phonicsPages}：${c.phonicNote} 听示范、选规律，再自己跟读；匹配只检查规律，不给口音打分。`;
 const patterns=[...new Set(Object.values(c.patterns))];$('#letter-game').className='phonics-game';
 $('#letter-game').innerHTML=`<div class="phonics-words">${c.phonics.map(w=>`<button data-g6-word="${esc(w)}" class="${s.phonics.includes(w)?'matched':''} ${phonicsSelection===w?'selected':''}">${esc(w)}${s.phonics.includes(w)?' ✓':''}<small>点击听示范</small></button>`).join('')}</div><div class="g4-phonics-patterns">${patterns.map(p=>`<button data-g6-pattern="${esc(p)}">${esc(p)}</button>`).join('')}</div>`;
 $('#letter-game').querySelectorAll('[data-g6-word]').forEach(b=>b.addEventListener('click',()=>{phonicsSelection=b.dataset.g6Word;speakDynamic(g6Sample(c,phonicsSelection),b);renderGrade6Phonics(c,game.state().lesson);}));
 $('#letter-game').querySelectorAll('[data-g6-pattern]').forEach(b=>b.addEventListener('click',()=>{if(!phonicsSelection){$('#letter-feedback').textContent='先点一个词或句子。';return;}if(game.phonics(phonicsSelection,b.dataset.g6Pattern)){phonicsSelection=null;renderGrade6Phonics(c,game.state().lesson);$('#letter-feedback').textContent='规律匹配正确！再听一遍、自己跟读。';}else $('#letter-feedback').textContent='再看教材提示，试另一种规律。';}));
}
function renderGrade5Phonics(c,s){
 $('#letters-dialog h2').textContent='五年级拼读工坊';$('#letter-next').hidden=true;$('#letter-description').textContent=`教材 p.${c.phonicsPages}：听完整单词，再选对应规律。同一组合可能有不同发音，oo、ow、th、wh 按本单元范词区分。`;
 $('#letter-game').classList.add('phonics-game');const patterns=[...new Set(c.phonics.map(w=>g5Pattern(c,w)))];
 $('#letter-game').innerHTML=`<div class="phonics-words">${c.phonics.map(w=>`<button data-g5-word="${esc(w)}" class="${s.phonics.includes(w)?'matched':''} ${phonicsSelection===w?'selected':''}">${esc(w)}${s.phonics.includes(w)?' ✓':''}<small>点击听完整单词</small></button>`).join('')}</div><div class="g4-phonics-patterns">${patterns.map(p=>`<button data-g5-pattern="${esc(p)}">${esc(p)}<small>听 ${G5_PATTERN_EXAMPLES[p]}</small></button>`).join('')}</div>`;
 $('#letter-game').querySelectorAll('[data-g5-word]').forEach(b=>b.addEventListener('click',()=>{phonicsSelection=b.dataset.g5Word;speakDynamic(phonicsSelection,b);renderGrade5Phonics(c,game.state().lesson);}));
 $('#letter-game').querySelectorAll('[data-g5-pattern]').forEach(b=>b.addEventListener('click',()=>{const p=b.dataset.g5Pattern;speakDynamic(G5_PATTERN_EXAMPLES[p],b);if(!phonicsSelection){$('#letter-feedback').textContent='先点一个单词，听一听。';return;}if(game.phonics(phonicsSelection,p)){phonicsSelection=null;renderGrade5Phonics(c,game.state().lesson);$('#letter-feedback').textContent='匹配正确！再点单词跟读。';tone(true);}else $('#letter-feedback').textContent='再听一次，注意这个组合的发音。';}));
}
function next(){const {chapter:c}=game.state(),i=CHAPTERS.findIndex(x=>x.id===c.id);if(i===CHAPTERS.length-1){$('#completion-dialog').close();mapBook=c.book;renderMap();$('#map-dialog').showModal();return;}$('#completion-dialog').close();game.go(CHAPTERS[i+1].id);}
function replayChapter(){stopSpeech();keys.clear();drag=null;game.resetChapter();toast('本关重新开始啦！已解锁关卡和录音册都保留。',4);}
function requestReplay(){const {chapter:c,lesson:s,profile}=game.state();if(goals(c.id,s,profile).every(Boolean))replayChapter();else $('#reset-dialog').showModal();}

function trimSprite(image,region){
 const [nx,ny,nw,nh]=region,x=Math.floor(nx*image.width),y=Math.floor(ny*image.height),w=Math.floor(nw*image.width),h=Math.floor(nh*image.height);
 const source=document.createElement('canvas');source.width=w;source.height=h;const ctx=source.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,x,y,w,h,0,0,w,h);
 const data=ctx.getImageData(0,0,w,h),pixels=data.data,seen=new Uint8Array(w*h),labels=new Uint16Array(w*h),queue=new Uint32Array(w*h),components=[];
 // Isolate connected sprite bodies: generated sheets sometimes intrude into a neighbouring cell.
 for(let start=0;start<w*h;start++){if(seen[start]||pixels[start*4+3]<=25)continue;let head=0,tail=1,left=w,top=h,right=0,bottom=0;queue[0]=start;seen[start]=1;const id=components.length+1;
  while(head<tail){const at=queue[head++],px=at%w,py=Math.floor(at/w);labels[at]=id;left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);
   const near=[at-w,at+w];if(px>0)near.push(at-1);if(px<w-1)near.push(at+1);for(const next of near)if(next>=0&&next<w*h&&!seen[next]&&pixels[next*4+3]>25){seen[next]=1;queue[tail++]=next;}}
  components.push({id,size:tail,left,top,right,bottom});
 }
 const sorted=components.sort((a,b)=>b.size-a.size),main=sorted[0];if(!main)return '';
 const chosen=sorted.filter(c=>c===main||(c.size>main.size*.22&&c.left>2&&c.top>2&&c.right<w-3&&c.bottom<h-3));let left=Math.min(...chosen.map(c=>c.left)),top=Math.min(...chosen.map(c=>c.top)),right=Math.max(...chosen.map(c=>c.right)),bottom=Math.max(...chosen.map(c=>c.bottom));
 const allowed=new Set(chosen.map(c=>c.id));for(const c of sorted)if(c.left>=left-8&&c.right<=right+8&&c.top>=top-8&&c.bottom<=bottom+8)allowed.add(c.id);
 for(let i=0;i<w*h;i++)if(!allowed.has(labels[i]))pixels[i*4+3]=0;ctx.putImageData(data,0,0);
 const canvas=document.createElement('canvas');canvas.width=right-left+1;canvas.height=bottom-top+1;canvas.getContext('2d').drawImage(source,left,top,canvas.width,canvas.height,0,0,canvas.width,canvas.height);return canvas.toDataURL();
}
function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});}
async function loadArt(){const [characters,props,more,lowerItems,lowerPeople,g4School,g4Home,g4People,g4Extra,g4lFarm,g4lClothes,g4lSchool,g5Food,g5Nature,g5Activities,g6City,g6Jobs,g6Past]=await Promise.all(['assets/characters.png','assets/props.png','assets/animals-food.png','assets/lower-items.png','assets/lower-characters.png','assets/grade4-school.png','assets/grade4-home-food.png','assets/grade4-people.png','assets/grade4-extra.png','assets/grade4-lower-farm-clock.png','assets/grade4-lower-clothes.png','assets/grade4-lower-school.png','assets/grade5-food-home.png','assets/grade5-nature-seasons.png','assets/grade5-activities.png','assets/grade6-city.png','assets/grade6-jobs-books.png','assets/grade6-feelings-past.png'].map(loadImage));const regions={explorer:[0,0,.265,.425],fox:[.27,0,.265,.425],cat:[.535,0,.25,.425],bird:[.785,0,.215,.425],house:[0,.645,.303,.355]};for(const [name,region]of Object.entries(regions))sprites[name]=trimSprite(characters,region);
 const names=['bag','pencil','ruler','eraser','crayon','book','pencil box','pen','head','body','arm','leg','milk','juice','bread','cake'];const moreNames=['duck','pig','bear','dog','elephant','monkey','tiger','panda','water','egg','fish','rice','plate','candle','flag','bush'];
 [names,moreNames].forEach((list,index)=>list.forEach((name,i)=>sprites[name]=trimSprite(index?more:props,[(i%4)/4,Math.floor(i/4)/4,.25,.25])));
 [LOWER_ITEMS,LOWER_PEOPLE].forEach((list,index)=>list.forEach((name,i)=>sprites[name]=trimSprite(index?lowerPeople:lowerItems,[(i%4)/4,Math.floor(i/4)/4,.25,.25])));sprites.student=sprites.schoolboy;sprites.family=sprites.mother;
 [G4_SCHOOL_SPRITES,G4_HOME_SPRITES,G4_PEOPLE_SPRITES].forEach((list,index)=>list.forEach((name,i)=>sprites[name]=trimSprite([g4School,g4Home,g4People][index],[(i%4)/4,Math.floor(i/4)/4,.25,.25])));G4_EXTRA_SPRITES.forEach((name,i)=>sprites[name]=trimSprite(g4Extra,[(i%2)/2,Math.floor(i/2)/2,.5,.5]));sprites.toy=sprites.car;
 [G4L_FARM_SPRITES,G4L_CLOTHES_SPRITES].forEach((list,index)=>list.forEach((name,i)=>sprites[name]=trimSprite(index?g4lClothes:g4lFarm,[(i%4)/4,Math.floor(i/4)/4,.25,.25])));G4L_SCHOOL_SPRITES.forEach((name,i)=>sprites[name]=trimSprite(g4lSchool,[(i%2)/2,Math.floor(i/2)/2,.5,.5]));
 G6_SPRITES.forEach((list,index)=>list.forEach((name,i)=>sprites[name]=trimSprite([g6City,g6Jobs,g6Past][index],[(i%4)/4,Math.floor(i/4)/4,.25,.25])));
 [G5_FOOD_SPRITES,G5_NATURE_SPRITES,G5_ACTIVITY_SPRITES].forEach((list,index)=>list.forEach((name,i)=>sprites[name]=trimSprite([g5Food,g5Nature,g5Activities][index],[(i%4)/4,Math.floor(i/4)/4,.25,.25])));
 const puppet=document.createElement('canvas');puppet.width=220;puppet.height=340;const ctx=puppet.getContext('2d');const images=await Promise.all(PARTS.map(p=>loadImage(sprites[p])));[[75,0,70,75],[68,70,85,125],[15,80,195,135],[60,187,100,150]].forEach((r,i)=>ctx.drawImage(images[i],...r));sprites['assembled-puppet']=puppet.toDataURL();
 $('#brand-icon').src=img('house');$('#guide-portrait').src=img('fox');$('#dialogue-avatar').src=img('fox');$('#puppet-player').innerHTML=PARTS.map(p=>`<img class="actor-${p}" src="${img(p)}" alt="${p}" data-say="${p}" role="button" tabindex="0" aria-label="听 ${p} 的发音">`).join('');}

document.addEventListener('click',event=>{const target=event.target.closest('[data-say]');if(target){event.stopPropagation();pronounceTarget(target);return;}const action=event.target.closest('[data-lower-action]');if(action){performLowerAction(action.dataset.lowerAction,action.dataset.value,action);return;}const book=event.target.closest('[data-book]');if(book){game.switchBook(book.dataset.book);return;}const mapTab=event.target.closest('[data-map-book]');if(mapTab){mapBook=mapTab.dataset.mapBook;renderMap();}});
document.addEventListener('keydown',event=>{const target=event.target.closest('[data-say]');if(target&&target.tagName!=='BUTTON'&&['Enter',' '].includes(event.key)){event.preventDefault();pronounceTarget(target);}});
$('#playfield').addEventListener('click',e=>{if(e.target.closest('button,.zone,[data-say]'))return;const p=coordinates(e);moveTarget={x:Math.max(70,Math.min(930,p.x)),y:Math.max(125,Math.min(535,p.y))};selectedItem=null;});
document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.target.matches('input,textarea')||document.querySelector('dialog[open]'))return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){keys.add(key);e.preventDefault();}if(key==='e'&&game.state().chapter.book!=='upper'){performLowerAction('interact');e.preventDefault();}if(['1','2','3'].includes(key)&&game.state().chapter.book==='upper')performMove(MOVES[Number(key)-1].id);});document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();recorder.stop();}});
$('#chapter-list').addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(!b)return;const chapter=CHAPTERS.find(c=>c.id===b.dataset.chapter);if(!game.go(b.dataset.chapter)){renderMap();$('#map-dialog').showModal();}if(chapter)speakDynamic(chapterSpeech(chapter),$(`[data-chapter="${chapter.id}"]`));});
$('#map-button').addEventListener('click',()=>{recorder.stop();mapBook=game.state().chapter.book;renderMap();$('#map-dialog').showModal();});$('#album-button').addEventListener('click',showAlbum);
$('#trial-switch').addEventListener('change',e=>{game.setTrial(e.target.checked);try{localStorage.setItem('windbell-trial-v2',String(e.target.checked));}catch{}renderMap();});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$('#album-dialog').addEventListener('close',()=>{$('#recordings-list').querySelectorAll('audio').forEach(a=>a.pause());albumURLs.forEach(URL.revokeObjectURL);albumURLs=[];});
$('#record-button').addEventListener('click',()=>{if(recorder.active){recorder.stop();return;}stopSpeech();clearTake();const {chapter}=game.state();recorder.start({chapter:chapter.id,node:node().key,deviceId:$('#mic-device').value});});
$('#mic-device').addEventListener('change',()=>voiceStatus('已切换麦克风，下次录音会使用它。','idle'));
navigator.mediaDevices?.addEventListener('devicechange',()=>{if(!recorder.active&&!recorder.pending)refreshMicrophones();});
refreshMicrophones();
$('#listen-button').addEventListener('click',listen);$('#hint-button').addEventListener('click',()=>{$('#examples').hidden=!$('#examples').hidden;$('#hint-button').textContent=$('#examples').hidden?'看说法':'收起说法';});
$('#save-take').addEventListener('click',()=>persistTake(false));$('#send-button').addEventListener('click',sendTake);$('#discard-take').addEventListener('click',()=>{clearTake();voiceStatus('这段录音已删除，可以重新录一段。','idle');});
$('#prepare-speech').addEventListener('click',async()=>{
 const button=$('#prepare-speech');if(recorder.active||recorder.pending||take)return;button.disabled=true;button.dataset.speechState='loading';
 try{voiceStatus('准备设备英语识别 · 首次下载约 65 MB，录音不会上传','preparing');await prepareBrowserSpeech(undefined,p=>voiceStatus(p.percent===null?'正在准备设备上的英语识别…':`正在下载英语识别组件 · 本部分 ${p.percent}%`,'preparing'));
  const clip=pronunciationBank.get(audioKey('I have a ruler.'));const response=await fetch(clip);if(!response.ok)throw new Error('示范音频没有加载成功。');voiceStatus('正在设备上识别示范音频，不使用麦克风…','preparing');const result=await transcribe(await response.blob());button.dataset.speechState='ready';voiceStatus(`识别测试：${result.text||'未识别出文字'} · 可开始录音，回听后确认文字`,'ready');
 }catch(error){button.dataset.speechState='error';voiceStatus(error.message,'error');}finally{button.disabled=false;}
});
$('#progress-export').addEventListener('click',()=>{if(progressExportURL)URL.revokeObjectURL(progressExportURL);const blob=new Blob([progressFile(game.snapshot())],{type:'application/json'});progressExportURL=URL.createObjectURL(blob);const a=$('#progress-download');a.href=progressExportURL;a.download='windbell-progress-'+new Date().toISOString().slice(0,10)+'.json';a.hidden=false;$('#progress-show-text').hidden=false;a.click();$('#progress-transfer-status').textContent='进度备份已生成；若没有自动下载，可点“下载进度备份”。可以在另一网址或设备导入；录音请在录音册下载。';});
$('#progress-show-text').addEventListener('click',()=>{$('#progress-text-title').textContent='游戏进度备份';$('#progress-text-help').textContent='浏览器没有下载文件时，可全选、复制这里的备份文本。另一台设备打开教材地图，选择“粘贴进度”导入。文本不包含录音。';$('#progress-text').value=progressFile(game.snapshot());$('#progress-text').readOnly=true;$('#confirm-progress-paste').hidden=true;$('#progress-text-dialog').showModal();});
$('#progress-paste').addEventListener('click',()=>{$('#progress-text-title').textContent='粘贴游戏进度';$('#progress-text-help').textContent='粘贴原设备导出的完整进度文本，再读取并验证。';$('#progress-text').value='';$('#progress-text').readOnly=false;$('#confirm-progress-paste').hidden=false;$('#progress-text-dialog').showModal();});
$('#confirm-progress-paste').addEventListener('click',()=>{try{pendingProgressImport=readProgressFile($('#progress-text').value);$('#progress-text-dialog').close();$('#import-progress-description').textContent=`读取到 ${pendingProgressImport.completed.length} 个有效通关记录。导入会替换当前游戏进度，录音册保留；之后可恢复导入前的进度。`;$('#import-progress-dialog').showModal();}catch(error){$('#progress-text-help').textContent=error.message;}});
$('#progress-import').addEventListener('click',()=>$('#progress-file').click());
$('#progress-file').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>4*1024*1024)throw new Error('请选择小于 4 MB 的进度文件。');pendingProgressImport=readProgressFile(await file.text());$('#import-progress-description').textContent=`读取到 ${pendingProgressImport.completed.length} 个有效通关记录。导入会替换当前游戏进度，录音册保留；之后可恢复导入前的进度。`;$('#import-progress-dialog').showModal();}catch(error){$('#progress-transfer-status').textContent=error.message;}finally{event.target.value='';}});
function applyImportedProgress(data){const trial=game.state().trial;cancelVoice();game=createAdventure(data,handleEvent,trial);handleEvent({type:'chapter'});mapBook=game.state().chapter.book;renderMap();$('#progress-restore').hidden=false;}
$('#confirm-progress-import').addEventListener('click',()=>{if(!pendingProgressImport)return;try{localStorage.setItem(PROGRESS_BACKUP_KEY,progressFile(game.snapshot()));applyImportedProgress(pendingProgressImport);pendingProgressImport=null;$('#import-progress-dialog').close();$('#progress-transfer-status').textContent='进度已导入。可用“恢复导入前进度”撤回。';}catch(error){$('#progress-transfer-status').textContent='没有足够空间备份旧进度，未导入。请先导出旧进度。';$('#import-progress-dialog').close();}});
$('#progress-restore').addEventListener('click',()=>{try{const backup=localStorage.getItem(PROGRESS_BACKUP_KEY);if(!backup)return;applyImportedProgress(readProgressFile(backup));$('#progress-transfer-status').textContent='已恢复导入前的进度，录音册保留。';}catch{$('#progress-transfer-status').textContent='备份暂时无法读取，请使用之前导出的进度文件。';}});
try{$('#progress-restore').hidden=!localStorage.getItem(PROGRESS_BACKUP_KEY);}catch{}
$('#text-mode').addEventListener('click',()=>{$('#text-panel').hidden=!$('#text-panel').hidden;if(!$('#text-panel').hidden)$('#text-answer').focus();});
function sendText(){const text=$('#text-answer').value.trim();if(game.talk(text,'text').ok){$('#text-answer').value='';$('#text-panel').hidden=true;}}
$('#send-text').addEventListener('click',sendText);$('#text-answer').addEventListener('keydown',e=>{if(e.key==='Enter')sendText();});
$('#sound-button').addEventListener('click',()=>{soundOn=!soundOn;$('#sound-button span').textContent=soundOn?'声音开':'声音关';$('#sound-button').setAttribute('aria-label',soundOn?'关闭声音':'开启声音');if(!soundOn)stopSpeech();});
$('#reset-button').addEventListener('click',requestReplay);$('#replay-button').addEventListener('click',requestReplay);$('#confirm-reset').addEventListener('click',()=>{$('#reset-dialog').close();replayChapter();});
$('#replay-completed-button').addEventListener('click',()=>{$('#completion-dialog').close();replayChapter();});
$('#next-button').addEventListener('click',next);$('#continue-button').addEventListener('click',next);$('#stay-button').addEventListener('click',()=>$('#completion-dialog').close());
$('#letters-button').addEventListener('click',showLetters);$('#letter-next').addEventListener('click',()=>{letterOffset+=6;letterSelection=null;renderLetters();});
window.addEventListener('pagehide',()=>{recorder.cancel();requestController?.abort();save();});
try{await Promise.all([loadArt(),fetch('assets/audio/manifest.json').then(r=>{if(!r.ok)throw new Error('Audio manifest unavailable');return r.json();}).then(lines=>lines.forEach(line=>pronunciationBank.set(audioKey(line.text),`assets/audio/${line.id}.${SITE_CONFIG.audioExtension||'wav'}`)))]);loaded=true;render();save();requestAnimationFrame(loop);await updateRecordCount();if(browserSpeechMode){$('#prepare-speech').hidden=false;$('.brand span').textContent='网页版 · 三至六年级上下册';voiceStatus('录音留在当前浏览器 · 第一次可先检查设备英语识别','idle');}else fetch('/api/status').then(r=>r.json()).then(status=>{if(!status.ready)voiceStatus('本地识别正在启动；你可以先操作游戏、录音和回听。','idle');}).catch(()=>voiceStatus('录音可保存和回听，本地识别暂未连接。','idle'));}catch(e){$('#scene-hint').textContent='游戏素材没有加载成功，请刷新页面重试。';console.error(e);}

matchMedia('(max-width:540px)').addEventListener('change',()=>{if([G4L_BOOK,...G5_BOOKS,...G6_BOOKS].includes(game.state().chapter.book)){grade4TrayPage=0;selectedItem=null;render();}});
