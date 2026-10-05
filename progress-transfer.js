import {restoreProgress} from './engine.js';
export const PROGRESS_BACKUP_KEY='windbell-progress-backup-v2';
export function progressFile(snapshot){return JSON.stringify({format:'windbell-progress',fileVersion:1,progress:snapshot},null,2);}
export function readProgressFile(text){
 if(typeof text!=='string'||text.length>4*1024*1024)throw new Error('进度文件太大。请选择导出的 JSON 进度文件。');
 let parsed;try{parsed=JSON.parse(text);}catch{throw new Error('这不是可读取的 JSON 进度文件。');}
 const raw=parsed?.format==='windbell-progress'?parsed.progress:parsed;
 if(!raw||raw.version!==2||!raw.lessons||typeof raw.lessons!=='object'||Array.isArray(raw.lessons))throw new Error('请选择风铃岛第二版导出的进度文件。');
 return restoreProgress(raw);
}
