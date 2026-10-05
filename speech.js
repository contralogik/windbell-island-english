import {SITE_CONFIG} from './site-config.js';
import {transcribeInBrowser,prepareBrowserSpeech} from './browser-speech.js';
export const browserSpeechMode=SITE_CONFIG.mode==='web';
export {prepareBrowserSpeech};
let database;
export async function openRecordings(){
 if(database)return database;
 database=await new Promise((resolve,reject)=>{const r=indexedDB.open('windbell-voice-v2',1);r.onupgradeneeded=()=>{r.result.createObjectStore('recordings',{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return database;
}
async function transaction(mode,work){const db=await openRecordings();return new Promise((resolve,reject)=>{const tx=db.transaction('recordings',mode);let value;work(tx.objectStore('recordings'),v=>value=v);tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
export async function allRecordings(){const rows=await transaction('readonly',(store,set)=>{const r=store.getAll();r.onsuccess=()=>set(r.result);});return rows.sort((a,b)=>b.date-a.date);}
export async function saveRecording(record){const rows=await allRecordings();if(!rows.some(r=>r.id===record.id)&&rows.length>=60)throw new Error('录音册已有 60 段录音。请先删除几段，或下载这段录音。');return transaction('readwrite',store=>store.put(record));}
export async function deleteRecording(id){return transaction('readwrite',store=>store.delete(id));}

async function toWave(blob){
 const context=new AudioContext();let audio;
 try{audio=await context.decodeAudioData(await blob.arrayBuffer());}finally{await context.close();}
 const rate=16000,length=Math.floor(audio.duration*rate),buffer=new ArrayBuffer(44+length*2),view=new DataView(buffer);
 const write=(at,text)=>{for(let i=0;i<text.length;i++)view.setUint8(at+i,text.charCodeAt(i));};
 write(0,'RIFF');view.setUint32(4,36+length*2,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,length*2,true);
 const channels=Array.from({length:audio.numberOfChannels},(_,i)=>audio.getChannelData(i)),ratio=audio.sampleRate/rate;
 for(let i=0;i<length;i++){const at=i*ratio,start=Math.floor(at),fraction=at-start;let sample=0;for(const channel of channels)sample+=(channel[start]||0)*(1-fraction)+(channel[start+1]||0)*fraction;sample=Math.max(-1,Math.min(1,sample/channels.length));view.setInt16(44+i*2,sample<0?sample*32768:sample*32767,true);}
 return new Blob([buffer],{type:'audio/wav'});
}

export class LocalRecorder{
 constructor(onStatus,onTake){this.onStatus=onStatus;this.onTake=onTake;this.active=false;this.pending=false;this.generation=0;}
 async start(context){
  if(this.active||this.pending)return;
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){this.onStatus('浏览器不支持录音。请用最新版 Chrome / Edge / Safari 打开 HTTPS 网页，或使用文字回答。','error');return;}
  const token=++this.generation;this.pending=true;this.onStatus('正在请求麦克风权限…','pending');
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
   if(token!==this.generation){stream.getTracks().forEach(t=>t.stop());return;}
   this.stream=stream;this.context=context;this.chunks=[];
   const mime=['audio/webm;codecs=opus','audio/webm','audio/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
   this.recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});
   this.recorder.ondataavailable=e=>{if(e.data.size)this.chunks.push(e.data);};
   this.recorder.onerror=()=>{this.onStatus('录音中断，请重录。','error');this.cancel();};
   this.recorder.onstop=async()=>{
    this.cleanup();if(token!==this.generation)return;
    const rawBlob=new Blob(this.chunks,{type:this.recorder.mimeType||'audio/webm'});const seconds=(performance.now()-this.started)/1000;
    if(seconds<.6||rawBlob.size<100){this.onStatus('录音太短了。按开始录音，说完后再按停止。','error');return;}
    let blob;try{blob=await toWave(rawBlob);}catch{blob=rawBlob;}
    if(token!==this.generation)return;
    this.onStatus('录音完成，正在识别英语…','transcribing');this.onTake({id:crypto.randomUUID(),date:Date.now(),blob,seconds,chapter:context.chapter,node:context.node,text:'',originalText:''},token);
   };
   this.pending=false;this.active=true;this.started=performance.now();this.recorder.start(250);
   this.onStatus('正在录音 0 秒 · 说完后按停止（最长 20 秒）','recording');
   this.timer=setInterval(()=>{const sec=Math.floor((performance.now()-this.started)/1000);this.onStatus(`正在录音 ${sec} 秒 · 说完后按停止（最长 20 秒）`,'recording');if(sec>=20)this.stop();},250);
  }catch(e){this.pending=false;this.cleanup();if(token===this.generation)this.onStatus(e.name==='NotAllowedError'?'麦克风权限未开启。请在浏览器允许录音，或使用文字回答。':e.name==='NotFoundError'?'没有找到麦克风。接上麦克风后再试。':'录音没有启动，请检查麦克风后重试。','error');}
 }
 stop(){if(this.active&&this.recorder?.state==='recording'){this.active=false;clearInterval(this.timer);this.recorder.stop();this.stream?.getTracks().forEach(t=>t.stop());}}
 cleanup(){this.active=false;this.pending=false;clearInterval(this.timer);this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;}
 cancel(){this.generation++;if(this.recorder?.state==='recording')this.recorder.stop();this.cleanup();}
}

export async function transcribe(blob,signal,onProgress){
 if(browserSpeechMode)return transcribeInBrowser(blob,signal,onProgress);
 const r=await fetch('/api/transcribe',{method:'POST',headers:{'Content-Type':blob.type||'audio/webm'},body:blob,signal});
 const data=await r.json();if(!r.ok)throw new Error(data.error||'本地识别暂时不可用。');return data;
}
