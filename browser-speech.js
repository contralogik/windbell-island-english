// Audio stays in this device. The worker only downloads public model/runtime files.
export class BrowserRecognizer{
 constructor(workerFactory=()=>new Worker(new URL('./browser-speech-worker.js',import.meta.url),{type:'module'})){this.workerFactory=workerFactory;this.pending=new Map();this.counter=0;}
 request(type,samples,signal,onProgress=()=>{}){
  if(signal?.aborted)return Promise.reject(new DOMException('已取消','AbortError'));
  if(!this.worker){this.worker=this.workerFactory();this.worker.onmessage=event=>{
   const msg=event.data;if(msg.type==='progress'){for(const request of this.pending.values())request.onProgress(msg);return;}
   const request=this.pending.get(msg.id);if(!request)return;this.pending.delete(msg.id);request.cleanup();msg.type==='error'?request.reject(new Error(msg.message)):request.resolve(msg);
  };this.worker.onerror=()=>{for(const request of this.pending.values()){request.cleanup();request.reject(new Error('这个浏览器未能启动英语识别。仍可回听、填写文字和保存录音。'));}this.pending.clear();this.worker?.terminate();this.worker=null;};}
  const id=++this.counter;return new Promise((resolve,reject)=>{
   const abort=()=>{const request=this.pending.get(id);if(!request)return;this.pending.delete(id);request.cleanup();reject(new DOMException('已取消','AbortError'));if(this.pending.size===0){this.worker?.terminate();this.worker=null;}};
   const timer=setTimeout(()=>{const request=this.pending.get(id);if(!request)return;this.pending.delete(id);request.cleanup();reject(new Error('英语识别准备较慢。录音仍可回听和保存，也可填写文字后发送。'));if(this.pending.size===0){this.worker?.terminate();this.worker=null;}},180000);
   const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);};
   this.pending.set(id,{resolve,reject,cleanup,onProgress});signal?.addEventListener('abort',abort,{once:true});
   try{this.worker.postMessage({id,type,samples},samples?[samples.buffer]:[]);}catch(error){this.pending.delete(id);cleanup();reject(error);}
  });
 }
 prepare(signal,onProgress){return this.request('prepare',null,signal,onProgress);}
 recognize(samples,signal,onProgress){return this.request('recognize',samples,signal,onProgress);}
}
let recognizer;
const instance=()=>recognizer??=new BrowserRecognizer();
export const prepareBrowserSpeech=(signal,onProgress)=>instance().prepare(signal,onProgress);
export async function transcribeInBrowser(blob,signal,onProgress){
 if(signal?.aborted)throw new DOMException('已取消','AbortError');
 const context=new OfflineAudioContext(1,1,16000),audio=await context.decodeAudioData(await blob.arrayBuffer());
 const samples=new Float32Array(audio.length);for(let c=0;c<audio.numberOfChannels;c++){const channel=audio.getChannelData(c);for(let i=0;i<samples.length;i++)samples[i]+=channel[i]/audio.numberOfChannels;}
 const result=await instance().recognize(samples,signal,onProgress);return {text:String(result.text||'').trim(),uncertain:true,engine:'Whisper tiny.en · browser',local:true};
}
