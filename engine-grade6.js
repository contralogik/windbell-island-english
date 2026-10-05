import {G6_STAGES,g6Stage,g6Task,g6Position,g6Operation,g6Nodes,interpretGrade6Speech} from './curriculum-grade6.js';
const roundBlank=()=>({inspected:false,slots:{},path:[],sequence:[],collected:[],views:[],view:'before',reading:0});
export const grade6Blank=()=>({g6:{stage:0,round:0,...roundBlank(),done:[],receipts:{},bank:12},phonics:[]});
export const G6_NEAR_ACTIONS=['g6-inspect','g6-collect','g6-finish','g6-next-stage'];
const copy=x=>JSON.parse(JSON.stringify(x));
const key=g=>`${g.stage}-${g.round}`;
const clearReports=(s)=>{const prefix=`g6-${s.g6.stage}-${s.g6.round}-`;for(const k of Object.keys(s.talks))if(k.startsWith(prefix))delete s.talks[k];};
export function grade6Goals(c,s){const all=G6_STAGES[c.id].flatMap((st,si)=>st.tasks.map((_,ri)=>`${si}-${ri}`)),n=s.g6.done.filter(k=>all.includes(k)).length;return [n>=Math.ceil(all.length/3),n>=Math.ceil(all.length*2/3),n===all.length&&s.g6.stage===G6_STAGES[c.id].length];}
export function grade6Drop(c,s,item,zone,emit){const g=s.g6,r=g6Task(c,g),slot=r?.slots?.find(x=>x.name===zone);if(!slot||!slot.choices.includes(item))return false;
 if(r.mode==='route'&&JSON.stringify(g.path)!==JSON.stringify(r.path)){emit('先把 Robin 导航到目标建筑，再投递。');return false;}
 if(['change','poster'].includes(r.mode)&&r.views&&g.view!=='now'){emit('切换到 now 再放置；before 用来比较。');return false;}
 if(r.mode==='shop'){const old=g.slots.cart?.[0];const prices={apples:3,jacket:5,umbrella:4};const available=g.bank+(old?prices[old]:0);if(available<prices[item]){emit('游戏币不足，可取回购物袋里的商品再选。');return false;}g.bank=available-prices[item];}
 clearReports(s);if(Array.isArray(slot.answer)){g.slots[zone]??=[];if(!g.slots[zone].includes(item))g.slots[zone].push(item);}else g.slots[zone]=[item];emit('已放入。选错时可取回，再观察结果。',true);return true;
}
export function grade6Action(c,s,name,value,near,emit){const g=s.g6,st=g6Stage(c,g),r=g6Task(c,g);
 if(G6_NEAR_ACTIONS.includes(name)&&!near){emit('先走近目标，再点一次或按 E。');return false;}
 if(name==='g6-next-stage'){if(!st||g.round!==st.tasks.length){emit('本幕全部操作与英语报告完成后才能进入下一幕。');return false;}g.stage++;g.round=0;Object.assign(g,roundBlank());emit(g.stage===G6_STAGES[c.id].length?'冒险完成！':'下一幕开始，进度已保存。',true);return true;}
 if(!r)return false;
 if(name==='g6-finish'){if(!g6Operation(r,g)||!g6Nodes(c,g.stage,g.round,g).every(n=>s.talks[n.key])){emit('先完成操作与全部英语报告，再确认本轮。');return false;}g.receipts[key(g)]=copy({...roundBlank(),...Object.fromEntries(Object.keys(roundBlank()).map(k=>[k,g[k]]))});g.done.push(key(g));g.round++;Object.assign(g,roundBlank());if(g.round===st.tasks.length&&G6_STAGES[c.id].length===1)g.stage++;emit(g.stage===G6_STAGES[c.id].length?'本关完成！可以再玩一遍。':g.round===st.tasks.length?'本幕完成，请走近通行门。':'新任务开始！',true);return true;}
 if(name==='g6-inspect'){if(g.inspected)return false;g.inspected=true;emit(r.clue,true);return true;}
 if(name==='g6-collect'&&r.collect?.includes(value)){if(g.collected.includes(value))return false;g.collected.push(value);emit(`发现照片：${value}`,true);return true;}
 if(name==='g6-view'&&['before','now'].includes(value)){g.view=value;if(!g.views.includes(value))g.views.push(value);return true;}
 if(name==='g6-reading'&&r.measure&&['-1','1','-10','10'].includes(String(value))){clearReports(s);g.reading=Math.max(0,Math.min(200,g.reading+Number(value)));return true;}
 if(name==='g6-route'&&r.path&&['straight','left','right'].includes(value)){const pos=g6Position([...g.path,value]);if(pos.x<0||pos.x>3||pos.y<0||pos.y>3||g.path.length>=12){emit('到边界了。可以点“重走路线”回到起点。');return false;}clearReports(s);g.path.push(value);return true;}
 if(name==='g6-reset-route'&&r.path){clearReports(s);g.path=[];g.slots={};return true;}
 if(name==='g6-sequence'&&r.buttons?.includes(value)){if(r.collect&&!g.collected.includes(value)){emit('先走近发现这张照片，再排进相册。');return false;}clearReports(s);if(r.sequence[g.sequence.length]!==value){g.sequence=[];emit('顺序不对，已回到起点。根据线索重新组合。');return true;}g.sequence.push(value);emit('顺序正确！',true);return true;}
 if(name==='g6-remove'&&value.includes('|')){const [zone,item]=value.split('|');if(!g.slots[zone]?.includes(item))return false;if(r.mode==='shop')g.bank+=({apples:3,jacket:5,umbrella:4}[item]||0);clearReports(s);g.slots[zone]=g.slots[zone].filter(x=>x!==item);return true;}
 return false;
}
export function grade6Phonics(c,s,w,p){if(!c.phonics.includes(w)||c.patterns[w]!==p)return false;if(!s.phonics.includes(w))s.phonics.push(w);return true;}
function sanitize(r,raw){const g=roundBlank();if(!raw||!r)return g;g.inspected=raw.inspected===true;g.view=['before','now'].includes(raw.view)?raw.view:'before';g.views=[...new Set((Array.isArray(raw.views)?raw.views:[]).filter(x=>['before','now'].includes(x)))];g.reading=Number.isInteger(raw.reading)?Math.max(0,Math.min(200,raw.reading)):0;
 for(const sl of r.slots||[])g.slots[sl.name]=[...new Set((Array.isArray(raw.slots?.[sl.name])?raw.slots[sl.name]:[]).filter(x=>sl.choices.includes(x)))].slice(0,Array.isArray(sl.answer)?sl.choices.length:1);
 g.path=(Array.isArray(raw.path)?raw.path:[]).filter(x=>['left','right','straight'].includes(x)).slice(0,12);g.sequence=(Array.isArray(raw.sequence)?raw.sequence:[]).filter(x=>r.buttons?.includes(x)).slice(0,r.sequence?.length||0);g.collected=[...new Set((Array.isArray(raw.collected)?raw.collected:[]).filter(x=>r.collect?.includes(x)))];return g;
}
// Completion is reconstructed from contiguous operation receipts and matching reports.
// Progress flags and a stage number alone never unlock a chapter.
export function restoreGrade6(raw,c){const out=grade6Blank(),g=out.g6,stages=G6_STAGES[c.id];let stopped=false,spent=0;
 for(let si=0;si<stages.length&&!stopped;si++)for(let ri=0;ri<stages[si].tasks.length;ri++){
  const r=stages[si].tasks[ri],receipt=sanitize(r,raw.g6?.receipts?.[`${si}-${ri}`]),nodes=g6Nodes(c,si,ri,receipt);
  if(!g6Operation(r,receipt)||!nodes.every(n=>['text','voice'].includes(raw.talks?.[n.key]?.mode)&&interpretGrade6Speech(raw.talks[n.key].text,n).ok)){g.stage=si;g.round=ri;stopped=true;break;}
  g.done.push(`${si}-${ri}`);g.receipts[`${si}-${ri}`]=receipt;if(r.mode==='shop')spent+=r.price;g.stage=si;g.round=ri+1;
 }
 if(!stopped){g.stage=stages.length;g.round=0;}
 else if(raw.g6?.stage===g.stage&&raw.g6?.round===g.round)Object.assign(g,sanitize(g6Task(c,g),raw.g6));
 // At a completed scene keep its door open until the user explicitly walks through.
 if(g.stage>0&&g.stage<stages.length&&raw.g6?.stage===g.stage-1&&raw.g6?.round===stages[g.stage-1].tasks.length){g.stage--;g.round=stages[g.stage].tasks.length;Object.assign(g,roundBlank());}
 if(g.stage===stages.length&&stages.length>1&&raw.g6?.stage===stages.length-1&&raw.g6?.round===stages.at(-1).tasks.length){g.stage--;g.round=stages.at(-1).tasks.length;}
 const cart=g6Task(c,g)?.mode==='shop'?g.slots.cart?.[0]:null;g.bank=Math.max(0,12-spent-(cart?{apples:3,jacket:5,umbrella:4}[cart]:0));out.phonics=[...new Set((Array.isArray(raw.phonics)?raw.phonics:[]).filter(x=>c.phonics.includes(x)))];return out;
}
export function restoreGrade6Talks(raw,c,s){const g=s.g6;for(const [key,proof] of Object.entries(g.receipts)){const [si,ri]=key.split('-').map(Number);for(const n of g6Nodes(c,si,ri,proof))s.talks[n.key]=copy(raw.talks[n.key]);}if(g6Operation(g6Task(c,g),g))for(const n of g6Nodes(c,g.stage,g.round,g)){const t=raw.talks?.[n.key];if(t&&['text','voice'].includes(t.mode)&&interpretGrade6Speech(t.text,n).ok)s.talks[n.key]=copy(t);}}
