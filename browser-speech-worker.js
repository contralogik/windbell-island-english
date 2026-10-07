import {env,pipeline} from './assets/vendor/transformers/transformers.min.js';
import {prepareSpeechSamples} from './audio-processing.js?v=20261007';
env.allowRemoteModels=false;
env.allowLocalModels=true;
env.localModelPath=new URL('./assets/models/',import.meta.url).href;
env.backends.onnx.wasm.wasmPaths=new URL('./assets/vendor/onnx/',import.meta.url).href;
env.backends.onnx.wasm.numThreads=1;
env.backends.onnx.wasm.proxy=false;
let recognizerPromise,queue=Promise.resolve();
function ready(){
 recognizerPromise??=pipeline('automatic-speech-recognition','whisper-tiny.en',{device:'wasm',dtype:'q8',progress_callback:p=>{if(p.status==='progress')self.postMessage({type:'progress',percent:Math.floor(p.progress||0)});else if(p.status==='initiate'||p.status==='done')self.postMessage({type:'progress',percent:null});}}).catch(error=>{recognizerPromise=null;throw error;});
 return recognizerPromise;
}
self.onmessage=event=>{
 const {id,type,samples}=event.data;const run=async()=>{try{
  if(type==='prepare'){await ready();self.postMessage({id,type:'ready'});return;}
  if(type!=='recognize'||!(samples instanceof Float32Array))throw new Error('没有收到有效的录音。');
  const prepared=prepareSpeechSamples(samples);if(!prepared.samples){self.postMessage({id,type:'result',text:'',reason:prepared.reason,message:prepared.message});return;}
  const recognizer=await ready(),result=await recognizer(samples,{max_new_tokens:128,do_sample:false});self.postMessage({id,type:'result',text:result.text});
 }catch{self.postMessage({id,type:'error',message:'英语识别组件暂未准备好。可稍后重试；录音仍可回听、保存和填写文字。'});}};
 queue=queue.then(run,run);
};
