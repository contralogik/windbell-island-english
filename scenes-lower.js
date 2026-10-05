import {GUESTS,FAMILY,COUNTRIES,FRUITS,FRUIT_ORDERS,TRAITS,FEATURES,TOYS,PLACES,GATES,COUNT_WORDS,boardChallenge,countryPhrase} from './curriculum-lower.js';
export const LOWER_ITEMS=['pear','apple','orange','banana','watermelon','strawberry','grape','car','boat','cap','ball','map','desk','chair','box','kite'];
export const LOWER_PEOPLE=['father','mother','grandfather','grandmother','brother','sister','schoolboy','schoolgirl','teacher','giraffe','UK','Canada','USA','China','balloon','blackbird'];
export const PLACE_COORDS={'on the desk':{x:310,y:220},'in the desk':{x:310,y:335},'under the desk':{x:310,y:430},'on the chair':{x:590,y:340},'under the chair':{x:590,y:430},'in the box':{x:835,y:325},'on the box':{x:835,y:210}};
export function makeLowerScene(state,h){const {chapter:c,lesson:s,profile}=state,{object,zone,position,imageHtml,sayButton,esc}=h;const objects=[],zones=[],actions=[];let decor='';
 const panel=(html,extra='')=>`<div class="lower-panel ${extra}">${html}</div>`;
 const actionButton=(name,value,text,speech='')=>`<button data-lower-action="${name}" data-value="${esc(value)}" ${name==='roll'&&s.board.pending?'disabled':''} ${speech?`data-action-speech="${esc(speech)}"`:''}>${text}</button>`;
 const token=(name,x,y,w=85,extra={})=>objects.push(object(`token-${name}`,name,x,y,w,95,{item:name,draggable:true,...extra}));
 if(c.id==='l1'){
  GUESTS.forEach((g,i)=>zones.push(zone(`passport-${g.id}`,165+i*220,290,185,250,g.name,{className:'passport-card',ready:!!s.roles[g.id],speech:`${g.name}. I'm from ${countryPhrase(g.country)}.`,html:`${imageHtml(g.sprite)}<b>${sayButton(g.name,g.name,`data-drop-zone="passport-${g.id}"`)}</b><div>${sayButton(`I'm from ${countryPhrase(g.country)}.`,g.country,`data-drop-zone="passport-${g.id}"`)}</div><div>${sayButton(g.pronoun,g.pronoun,`data-drop-zone="passport-${g.id}"`)} / ${sayButton(g.role,g.role,`data-drop-zone="passport-${g.id}"`)}</div><small>${s.passports[g.id]?'国家 ✓':'等待国家章'} · ${s.roles[g.id]?'身份 ✓':'等待身份牌'}</small>`})));
  COUNTRIES.forEach((v,i)=>token(v,165+i*220,485,90));
  zones.push(zone('role-jones',840,100,240,120,'Mr Jones',{className:'teacher-pass',ready:s.roles.jones==='teacher',speech:'Mr Jones. He is a teacher.',html:`${imageHtml('father')}<div>${sayButton('Mr Jones','Mr Jones','data-drop-zone="role-jones"')}<br>${sayButton('he','he','data-drop-zone="role-jones"')} / ${sayButton('teacher','teacher','data-drop-zone="role-jones"')}${s.roles.jones?' ✓':''}</div>`}));
  ['student','teacher'].forEach((v,i)=>token(v,410+i*190,560,80,{sprite:v==='student'?'schoolboy':'teacher',label:`${v} · 身份牌`}));
  decor=panel(`你的护照：${sayButton(countryPhrase(profile.country))} · 拖国家章，再拖身份牌`);
 }else if(c.id==='l2'){
  FAMILY.forEach((f,i)=>{objects.push(object(`family-person-${f}`,f,150+(i%3)*165,225+Math.floor(i/3)*240,90,165,{label:f+(s.familyFound.includes(f)?' ✓':''),speech:f,action:'family-photo',value:f}));const col=i===0||i===2||i===4?0:1,row=i<2?1:i<4?0:2;zones.push(zone(`family-${f}`,725+col*170,175+row*160,145,140,f,{className:'family-slot',ready:s.familyTree.includes(f),sprite:s.familyTree.includes(f)?f:null}));if(s.familyFound.includes(f)&&!s.familyTree.includes(f))token(f,100+i*150,555,70,{sprite:f});});
  decor=panel(`Leo 的虚构家庭 · 找到 ${s.familyFound.length}/6 · 相册 ${s.familyTree.length}/6`);
 }else if(c.id==='l3'){
  [...new Set(TRAITS.map(t=>t.animal))].forEach((a,i)=>zones.push(zone(`animal-${a}`,145+(i%3)*185,225+Math.floor(i/3)*200,145,175,a,{sprite:a,className:'animal-study',speech:a,html:`${imageHtml(a)}<b>${sayButton(a,a,`data-drop-zone="animal-${a}"`)}</b><small>${TRAITS.filter(t=>t.animal===a).map(t=>sayButton(t.word,t.word+(s.observations.includes(t.word)?' ✓':''),`data-drop-zone="animal-${a}"`)).join(' · ')}</small>`})));
  FEATURES.forEach((f,i)=>zones.push(zone(`feature-${i}`,735+(i%2)*175,185+Math.floor(i/2)*145,165,105,f,{className:'feature-slot',speech:f,ready:s.features.includes(f)})));
  TRAITS.forEach((t,i)=>token(t.word,95+i*135,555,90,{sprite:TRAITS.find(x=>x.word===t.word).animal,label:t.word}));
  decor=panel(`${sayButton('elephant','大象拼图')} ${s.features.length}/5 <span>特征词在底部；拼图卡在右上</span>`)+`<div class="feature-tray">${FEATURES.map(f=>actionButton('select-feature',f,esc(f),f)).join('')}</div>`;
 }else if(c.id==='lr1'){
  GATES.forEach((g,i)=>{const locked=i>s.gates.length;objects.push(object(`gate-${i}`,i===0?profile.country:i===1?'father':'elephant',g.x,g.y,120,150,{label:`${g.name}${s.gates.includes(i)?' ✓':locked?' · 未开放':''}`,speech:g.word,action:'gate',value:i}));decor+=`<div class="lower-route ${s.gates.includes(i)?'done':''}" style="${position(g.x,g.y+70,185,80)}">${i+1} · ${locked?'等前一座桥盖章':'先说英语，再按 E 盖章'}</div>`;});
  decor+=panel(`春游路线：${s.gates.length}/3 座桥已通过`);actions.push({name:'interact',text:'E · 附近盖章'});
 }else if(c.id==='l4'){
  ['desk','chair','box'].forEach((f,i)=>objects.push(object(`furniture-${f}`,f,[310,590,835][i],[325,340,320][i],i===0?245:185,245,{label:f,speech:f})));
  PLACES.forEach(p=>{const xy=PLACE_COORDS[p];zones.push(zone(`place-${p}`,xy.x,xy.y,175,65,p,{className:'place-hotspot',speech:p,action:'search',value:p,ready:s.searched.includes(p)}));});
  TOYS.forEach((t,i)=>{if(s.toysFound.includes(t.word)){const placed=s.toysPlaced[t.word];if(placed){const xy=PLACE_COORDS[placed],siblings=TOYS.filter(o=>s.toysPlaced[o.word]===placed),offset=(siblings.findIndex(o=>o.word===t.word)-(siblings.length-1)/2)*90;objects.push(object(`placed-${t.word}`,t.word,xy.x+offset,xy.y-16,55,55,{label:t.word,speech:t.word}));}else token(t.word,170+i*165,550,80,{label:t.word,speech:t.word});}});
  decor=panel(`找回 ${s.toysFound.length}/5 · 收拾 ${Object.keys(s.toysPlaced).length}/5`)+`<div class="toy-instructions">新位置：${TOYS.map(t=>`${sayButton(t.word)} → ${sayButton(t.destination)}`).join(' · ')}</div>`+['desk','chair','box'].map((w,i)=>`<div class="furniture-name" style="${position([310,590,835][i],[165,180,160][i],100,40)}">${sayButton(w)}</div>`).join('');actions.push({name:'interact',text:'E · 附近搜索'});
 }else if(c.id==='l5'){
  FRUITS.forEach((f,i)=>{objects.push(object(`harvest-${f}`,f,135+(i%3)*145,200+Math.floor(i/3)*135,95,110,{label:`${f} · 采摘`,speech:f,action:'harvest',value:f,bob:true,index:i}));if(s.basket[f])token(f,90+i*135,555,72,{label:`${f} ×${s.basket[f]}`,speech:f});});
  FRUIT_ORDERS.forEach((o,i)=>zones.push(zone(`fruit-order-${o.who}`,700+(i===1?175:0),200+(i===2?230:0),170,195,o.name,{className:'order',order:o,items:s.fruitOrders[o.who]||[],ready:o.items.every(f=>s.fruitOrders[o.who]?.includes(f))})));
  if(s.gift)objects.push(object('fruit-gift',s.gift,855,445,95,95,{label:`你的 ${s.gift}`,speech:s.gift}));
  decor=panel(`采过 ${s.harvested.length}/7 种 · ${sayButton('I like '+(profile.fruit==='strawberry'?'strawberries':profile.fruit+'s')+'.')}`);actions.push({name:'interact',text:'E · 附近采摘'});
 }else if(c.id==='l6'){
  if(!s.talks.seeKites){for(let i=0;i<12;i++)objects.push(object(`kite-${i}`,'kite',160+(i%4)*220,190+Math.floor(i/4)*145,75,105,{label:s.kites.includes(i)?'kite ✓':'kite',speech:'kite',action:'mark-kite',value:i,captured:s.kites.includes(i),bob:true,index:i}));objects.push(object('black-bird','blackbird',800,485,75,85,{label:'bird',speech:'bird',action:'bird'}));decor=panel(`风筝标记 ${s.kites.length} · 小黑鸟不计入`);
  }else if(!s.talks.haveCrayons){for(let i=0;i<16;i++)if(!s.crayons.includes(i))objects.push(object(`crayon-${i}`,'crayon',170+(i%4)*200,170+Math.floor(i/4)*110,75,80,{label:'crayon',speech:'crayon',action:'crayon',value:i}));decor=panel(`蜡笔收集 ${s.crayons.length}/16 · ${sayButton(COUNT_WORDS[s.crayons.length])}`);
  }else{
   for(let i=0;i<s.launched;i++)objects.push(object(`launched-kite-${i}`,'kite',170+(i%5)*160,160+Math.floor(i/5)*100,65,85,{label:'kite',speech:'kite',bob:true,index:i}));
   objects.push(object('launch-station','box',150,510,90,100,{label:'放飞站 · 点或 E',speech:'kite',action:'launch'}));
   decor=panel(`目标 ${sayButton(COUNT_WORDS[s.launchTarget])} · 已放飞 ${sayButton(COUNT_WORDS[s.launched])}`)+`<div class="number-targets">${COUNT_WORDS.slice(11).map((w,i)=>actionButton('target',i+11,`${w}${s.launchSuccess.includes(i+11)?' ✓':''}`,w)).join('')}</div>`;
   actions.push({name:'interact',text:'E · 附近放飞'},{name:'recover',text:'收回一只风筝'});
  }
 }else if(c.id==='lr2'){
  const b=s.board,jumps={3:10,12:17,8:4,18:11};const squares=[];
  for(let row=0;row<4;row++)for(let col=0;col<5;col++){const n=(3-row)*5+(row%2===0?5-col:col+1);squares.push(`<button class="board-square ${n===b.pos?'occupied':''} ${b.pending?.landing===n?'landing':''}" data-say="${COUNT_WORDS[n]}" data-square="${n}"><b>${n}</b>${n===b.pos?imageHtml('fox').replace('<img','<img data-say="Fox" role="button" tabindex="0" aria-label="听 Fox 的发音"'):''}${jumps[n]?`<small>${jumps[n]>n?'梯子':'藤蔓'} → ${jumps[n]}</small>`:''}</button>`);}
  decor=`<div class="adventure-board">${squares.join('')}</div><div class="board-side"><h3>骰子 ${b.lastDie||'—'}</h3>${actionButton('roll','',b.pending?'先完成这一轮对话':'掷骰子 · 开始挑战')}<p>终点 20 · 当前位置 ${b.pos}</p><p>${sayButton('banana')} ${b.bananas}/13<br>${sayButton('grape')} ${b.grapes}/20</p><small>到终点后仍可掷骰子集齐水果。</small></div>`;
  if(b.pending){const d=boardChallenge(s);const picture=name=>`<button class="pronounce-picture" data-say="${name}" aria-label="听 ${name} 的发音">${imageHtml(name)}</button>`;const visuals=d.mode==='taste'?[picture('banana')]:d.mode==='location'?[picture('chair'),picture('car')]:Array.from({length:13},()=>picture('banana'));decor+=`<div class="board-challenge ${d.mode}"><strong>${d.mode==='taste'?'表达喜好':d.mode==='location'?'小车在椅子下面':'数一数香蕉'}</strong><div>${visuals.join('')}</div></div>`;}
  actions.push({name:'roll',text:b.pending?'完成对话后才能再掷':'掷骰子',disabled:!!b.pending});
 }
 return {objects,zones,decor,actions};
}
