// Inspect actual audio before asking a language model to transcribe it.
export const SPEECH_RATE=16000;
export function prepareSpeechSamples(input,rate=SPEECH_RATE){
 if(!(input instanceof Float32Array)||!input.length||rate!==SPEECH_RATE)throw new Error('录音数据不完整，请重新录音。');
 const samples=new Float32Array(input.length);let mean=0;
 for(const value of input){if(!Number.isFinite(value))throw new Error('录音数据不完整，请重新录音。');mean+=value/input.length;}
 let peak=0;for(let i=0;i<input.length;i++){samples[i]=input[i]-mean;peak=Math.max(peak,Math.abs(samples[i]));}
 const frameSize=Math.round(rate*.02),frames=[];let maxRms=0;
 for(let start=0;start<samples.length;start+=frameSize){let sum=0;const end=Math.min(start+frameSize,samples.length);for(let i=start;i<end;i++)sum+=samples[i]**2;const rms=Math.sqrt(sum/(end-start));frames.push({start,end,rms});maxRms=Math.max(maxRms,rms);}
 const threshold=Math.max(.0005,maxRms*.075),active=frames.filter(frame=>frame.rms>=threshold),activeSeconds=active.reduce((sum,frame)=>sum+(frame.end-frame.start)/rate,0);
 // A zero signal, DC offset or a brief click must never become a guessed word.
 if(peak<.003||maxRms<.0005||activeSeconds<.14)return {samples:null,reason:'no-sound',peak,activeSeconds,message:'这段录音没有收到清晰的声音。请回听，检查所选麦克风，靠近后重录。'};
 const padding=Math.round(rate*.18),start=Math.max(0,active[0].start-padding),end=Math.min(samples.length,active.at(-1).end+padding),trimmed=samples.slice(start,end);
 // Keep pauses inside speech. Only trim the leading/trailing quiet and lift quiet input.
 const gain=Math.min(20,.8/peak);if(gain>1)for(let i=0;i<trimmed.length;i++)trimmed[i]*=gain;
 return {samples:trimmed,peak,activeSeconds,gain:Math.max(1,gain),trimmedSeconds:(samples.length-trimmed.length)/rate};
}
export async function decodeSpeechAudio(blob){
 const context=new OfflineAudioContext(1,1,SPEECH_RATE),audio=await context.decodeAudioData(await blob.arrayBuffer());
 if(audio.sampleRate!==SPEECH_RATE)throw new Error('浏览器未能转换录音采样率，请换一个浏览器重试。');
 const samples=new Float32Array(audio.length);for(let c=0;c<audio.numberOfChannels;c++){const channel=audio.getChannelData(c);for(let i=0;i<samples.length;i++)samples[i]+=channel[i]/audio.numberOfChannels;}
 return samples;
}
