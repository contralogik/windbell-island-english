export const COLORS={red:'#e96952',green:'#74a35c',yellow:'#f3cd59',blue:'#509dbd',black:'#343f43',brown:'#9d6b48',white:'#fff9ed',orange:'#efa047'};
export const STATIONERY=['pencil','ruler','eraser','crayon','book','pencil box','pen'];
export const ANIMALS=['duck','pig','cat','bear','dog','elephant','monkey','bird','tiger','panda'];
export const FOOD=['bread','juice','egg','milk','water','cake','fish','rice'];
import {LOWER_CHAPTERS,lowerDialogue,interpretLowerSpeech,COUNT_WORDS} from './curriculum-lower.js';
import {GRADE4_CHAPTERS,G4_BOOK,grade4Dialogue,interpretGrade4Speech} from './curriculum-grade4.js';
import {GRADE4_LOWER_CHAPTERS,G4L_BOOK,grade4LowerDialogue,interpretGrade4LowerSpeech} from './curriculum-grade4-lower.js';
import {GRADE6_CHAPTERS,G6_BOOKS,grade6Dialogue,interpretGrade6Speech} from './curriculum-grade6.js';
import {GRADE5_CHAPTERS,G5U_BOOK,G5L_BOOK,G5_BOOKS,grade5Dialogue,interpretGrade5Speech} from './curriculum-grade5.js';
export {GRADE4_CHAPTERS} from './curriculum-grade4.js';
export {LOWER_CHAPTERS} from './curriculum-lower.js';
export const UPPER_CHAPTERS=[
 {id:'u1',unit:'Unit 1',title:'Hello!',name:'开学大冒险',pages:'2–11',kind:'pack',letters:'',hint:'拖动文具装进背包；点击空地移动。和小狐狸认识一下！',goals:['介绍自己的名字','装好七件探险文具','向伙伴展示一件文具'],words:[...STATIONERY,'bag'],expressions:['Hello! / Hi!','I’m … / My name’s …','What’s your name?','I have a ruler / an eraser.','Goodbye! / Bye!'],reward:'探险背包'},
 {id:'u2',unit:'Unit 2',title:'Colours',name:'彩虹修路队',pages:'12–21',kind:'paint',letters:'ABCD',hint:'把颜料拖到木板和旗子上。按英文标记修出一条彩色路。',goals:['和伙伴打招呼','涂好八个颜色机关','说出你看见的颜色'],words:Object.keys(COLORS),expressions:['Good morning! / Good afternoon!','This is …','Nice to meet you. / Nice to meet you, too.','I see red.','Colour it brown.'],reward:'彩虹通行证'},
 {id:'u3',unit:'Unit 3',title:'Look at me!',name:'木偶工坊',pages:'22–31',kind:'puppet',letters:'EFGHI',hint:'把四组零件放到木偶的正确位置，再操作木偶走到三个舞台标记。',goals:['组装自己的木偶','问候并介绍木偶','完成三个动作机关'],words:['face','ear','eye','nose','mouth','arm','hand','head','body','leg','foot'],expressions:['How are you?','I’m fine, thank you. / Very well, thanks.','Let’s make a puppet! Great!','Look at me! / This is my face.','Let’s go to school!'],reward:'你的木偶演员'},
 {id:'r1',unit:'Recycle 1',title:'木偶剧团开演',name:'木偶剧团开演',pages:'32–35',kind:'show',letters:'ABCDEFGHI',hint:'搭好三面彩旗，介绍自己，操纵你的木偶登台表演。',goals:['用三面彩旗布置舞台','介绍自己和伙伴','完成木偶的三段表演'],words:[...STATIONERY,...Object.keys(COLORS),'head','arm','hand','body','leg','foot'],expressions:['Hello! I’m …','This is …','Nice to meet you.','How are you?','Look at me!'],reward:'剧团首演海报'},
 {id:'u4',unit:'Unit 4',title:'We love animals',name:'森林摄影师',pages:'36–45',kind:'photo',letters:'JKLMN',hint:'动物会走动和藏起来。等它现身，点击它拍照，收集十张照片。',goals:['拍到十种动物','告诉伙伴这是什么动物','介绍远处的动物'],words:[...ANIMALS,'zoo'],expressions:['What’s this? / What’s that?','It’s a duck / dog / panda.','Cool! I like it.'],reward:'森林动物相册'},
 {id:'u5',unit:'Unit 5',title:'Let’s eat!',name:'营地小餐厅',pages:'46–55',kind:'cafe',letters:'OPQRST',hint:'按三位客人的订单，把食物放到对应餐盘。上完菜，换你用英语点餐。',goals:['为三位客人配餐','向客人上菜并回应感谢','自己向店员点一杯饮品'],words:FOOD,expressions:['I’d like some juice, please.','Here you are.','Have some bread.','Can I have some water, please?','Thank you. / You’re welcome.'],reward:'营地小厨师'},
 {id:'u6',unit:'Unit 6',title:'Happy birthday!',name:'生日派对策划师',pages:'56–65',kind:'party',letters:'UVWXYZ',hint:'先询问年龄，再按来宾人数摆盘、按年龄插蜡烛，送上祝福。',goals:['询问寿星的年龄','摆好餐盘和生日蜡烛','送上生日祝福并回答年龄'],words:['one','two','three','four','five','six','seven','eight','nine','ten','brother','plate'],expressions:['How many plates? Five.','How old are you?','I’m six (years old).','Happy birthday! Thank you.','This one, please. / Sure.'],reward:'生日派对照片'},
 {id:'r2',unit:'Recycle 2',title:'森林庆典',name:'森林庆典',pages:'66–69',kind:'festival',letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',hint:'给五位动物朋友配餐、数好餐盘，再主持你的森林庆典。',goals:['完成五位动物的订单','准备五套餐具','用英语招呼朋友并介绍动物'],words:[...ANIMALS,...FOOD,'one','two','three','four','five','six','seven','eight','nine','ten'],expressions:['What’s your name?','It’s a panda.','I’d like some …, please.','How many …?','Happy birthday!'],reward:'风铃岛庆典纪念章'}
];
export const CHINESE={pencil:'铅笔',ruler:'尺子',eraser:'橡皮',crayon:'蜡笔',book:'书','pencil box':'铅笔盒',pen:'钢笔',bag:'书包',head:'头',body:'身体',arm:'手臂',leg:'腿',hand:'手',foot:'脚',face:'脸',ear:'耳朵',eye:'眼睛',nose:'鼻子',mouth:'嘴',duck:'鸭',pig:'猪',cat:'猫',bear:'熊',dog:'狗',elephant:'大象',monkey:'猴',bird:'鸟',tiger:'老虎',panda:'熊猫',bread:'面包',juice:'果汁',egg:'鸡蛋',milk:'牛奶',water:'水',cake:'蛋糕',fish:'鱼',rice:'米饭',plate:'餐盘',candle:'蜡烛',red:'红',green:'绿',yellow:'黄',blue:'蓝',black:'黑',brown:'棕',white:'白',orange:'橙'};
export const BOOKS=[{id:'upper',name:'三年级上册',first:'u1',shortName:'三上'},{id:'lower',name:'三年级下册',first:'l1',shortName:'三下'},{id:G4_BOOK,name:'四年级上册',first:'g41',shortName:'四上'},{id:G4L_BOOK,name:'四年级下册',first:'g4l1',shortName:'四下'},{id:G5U_BOOK,name:'五年级上册',first:'g5u1',shortName:'五上'},{id:G5L_BOOK,name:'五年级下册',first:'g5l1',shortName:'五下'},{id:'grade6upper',name:'六年级上册',first:'g6u1',shortName:'六上'},{id:'grade6lower',name:'六年级下册',first:'g6l1',shortName:'六下'}];
UPPER_CHAPTERS.forEach(c=>c.book='upper');
export const CHAPTERS=[...UPPER_CHAPTERS,...LOWER_CHAPTERS,...GRADE4_CHAPTERS,...GRADE4_LOWER_CHAPTERS,...GRADE5_CHAPTERS,...GRADE6_CHAPTERS];
export const chaptersForBook=book=>CHAPTERS.filter(c=>c.book===book);
export const NUMBERS=COUNT_WORDS;
export const ORDERS=[{who:'fox',name:'Fox',items:['bread','milk','egg']},{who:'cat',name:'Cat',items:['fish','rice','water']},{who:'bird',name:'Bird',items:['cake','juice']}];
export const FESTIVAL_ORDERS=[{who:'panda',name:'Panda',items:['rice','water']},{who:'monkey',name:'Monkey',items:['bread','juice']},{who:'tiger',name:'Tiger',items:['fish','milk']},{who:'duck',name:'Duck',items:['egg','water']},{who:'bear',name:'Bear',items:['cake','milk']}];
export const PARTS=['head','body','arm','leg'];
export const MOVES=[{id:'wave',text:'Wave your arms.',name:'挥手臂',key:'1'},{id:'clap',text:'Clap your hands.',name:'拍手',key:'2'},{id:'stamp',text:'Stamp your foot.',name:'跺脚',key:'3'}];

export function dialogue(id,s,profile){
 if(G6_BOOKS.includes(CHAPTERS.find(c=>c.id===id)?.book))return grade6Dialogue(CHAPTERS.find(c=>c.id===id),s);
 if(G5_BOOKS.includes(CHAPTERS.find(c=>c.id===id)?.book))return grade5Dialogue(CHAPTERS.find(c=>c.id===id),s);
 if(GRADE4_LOWER_CHAPTERS.some(c=>c.id===id))return grade4LowerDialogue(id,s);
 if(GRADE4_CHAPTERS.some(c=>c.id===id))return grade4Dialogue(id,s,profile);
 if(LOWER_CHAPTERS.some(c=>c.id===id))return lowerDialogue(id,s,profile);
 const talks=s.talks||{};
 const node=(key,npc,help,examples,mode,values=[])=>({key,npc,help,examples,mode,values});
 switch(id){
 case 'u1':return !talks.name?node('name',"Hello! What's your name?",'打个招呼，介绍你自己的名字。',["Hello! I'm Bella.","My name's Bella."],'name'):!talks.tool?node('tool','What do you have?','选一件背包里的文具，用英语告诉伙伴。',['I have a ruler.','I have an eraser.'],'tool',s.packed||[]):node('bye','Goodbye!','可以向小狐狸道别。',['Goodbye!','Bye!'],'bye');
 case 'u2':return !talks.greet?node('greet','Good morning! Nice to meet you.','回应问候，两种说法都可以。',['Good morning!','Nice to meet you, too.'],'greet'):node('colour','I see blue. What do you see?','说出任意一种教材里的颜色。',['I see red.','I see green.'],'colour',Object.keys(COLORS));
 case 'u3':return !talks.how?node('how','How are you?','回应伙伴的问候。',["I'm fine, thank you.",'Very well, thanks.'],'how'):node('body','Let’s make a puppet!','介绍自己木偶的一个身体部位。',['Great! This is my head.','This is my arm.'],'body',['head','body','arm','leg','face','ear','eye','nose','mouth','hand','foot']);
 case 'r1':return !talks.name?node('name',"Welcome! What's your name?",'用你自己的名字介绍演员。',[`Hello! I'm ${profile.name}.`],'name'):node('introduce','Nice to meet you!','把木偶介绍给观众。',['This is my puppet.','This is Bella.'],'introduce');
 case 'u4':return !talks.this?node('this',"What's this?",'告诉伙伴，你拍到了什么动物。',["It's a cat.","It's a panda."],'animal',s.photos||[]):node('that',"What's that?",'介绍远处的另一种动物。',["It's a duck.","It's a bear."],'animal',s.photos||[]);
 case 'u5':return !talks.serve?node('serve','Thank you!','客人收到食物后道谢，你怎么回应？',["You're welcome.",'Here you are.'],'serve'):node('drink','What would you like?','换你当客人：想喝哪种饮品？',['I’d like some milk, please.','Can I have some water, please?'],'drink',['milk','juice','water']);
 case 'u6':return !talks.askAge?node('askAge','Hello! It’s my birthday!','问问小狐狸几岁，蛋糕要放这么多根蜡烛。',['How old are you?'],'askAge'):!talks.birthday?node('birthday',`I'm ${NUMBERS[profile.partyAge]} years old!`,'向寿星送上祝福。',['Happy birthday!'],'birthday'):node('age','Thank you! How old are you?','说说自己的年龄，1–10 都可以。',["I'm eight years old.","I'm nine."],'age');
 case 'r2':return !talks.welcome?node('welcome','Hello! Nice to meet you!','欢迎朋友们来参加庆典。',['Hello! Nice to meet you, too.','Have some bread.'],'welcome'):node('animal',"What's that?",'介绍一位你邀请来的动物朋友。',["It's a panda.","It's a tiger."],'animal',['panda','monkey','tiger','duck','bear']);
 }
}

export function interpretSpeech(raw,node){
 if(node?.g6)return interpretGrade6Speech(raw,node);
 if(node?.g5)return interpretGrade5Speech(raw,node);
 if(node?.g4l)return interpretGrade4LowerSpeech(raw,node);
 if(node?.g4)return interpretGrade4Speech(raw,node);
 if(node?.lower)return interpretLowerSpeech(raw,node);
 const text=String(raw||'').trim().replace(/[’‘]/g,"'");
 const lower=text.toLowerCase().replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();
 if(!lower||!node)return {ok:false,reason:'还没有识别出句子。可以重录，或使用文字回答。'};
 const result=(value,reply)=>({ok:true,value,reply});
 const contains=w=>new RegExp(`\\b${w.replace(/ /g,'\\s+')}\\b`).test(lower);
 switch(node.mode){
 case 'name':{const m=text.match(/(?:my name(?:'s| is)|i(?:'m| am))\s+([a-z][a-z '\-]{0,28})/i);if(m){const value=m[1].replace(/[.!?,].*$/,'').trim();if(!/^(fine|good|well|happy|hungry|[1-9]|six|seven|eight|nine|ten)\b/i.test(value))return result(value,`Hello, ${value}! Nice to meet you!`);}break;}
 case 'tool':{const value=node.values.find(contains);if(value&&/\bi have\b/.test(lower))return result(value,`Great! You have ${value==='eraser'?'an':'a'} ${value}.`);break;}
 case 'colour':{const value=node.values.find(contains);if(value&&/\bi see\b/.test(lower))return result(value,`Yes! I see ${value}, too.`);break;}
 case 'body':{const value=node.values.find(contains);if(value&&/this is|look at/.test(lower))return result(value,`Great! Let’s move the ${value}.`);break;}
 case 'animal':{const value=node.values.find(contains);if(value&&/it(?:'s| is)|this is|that is/.test(lower))return result(value,'Cool! I like it.');break;}
 case 'drink':{const value=node.values.find(contains);if(value&&/i(?:'d| would) like|can i have|i want/.test(lower))return result(value,`Here you are! Have some ${value}.`);break;}
 case 'age':{const i=NUMBERS.findIndex((n,i)=>i>0&&i<=10&&contains(n));const digits=lower.match(/\b(10|[1-9])\b/);const n=digits?Number(digits[1]):i;if(n>0&&n<=10&&/i(?:'m| am)/.test(lower))return result(n,`You’re ${NUMBERS[n]}! Thank you!`);break;}
 case 'introduce':if(/this is\s+\S/.test(lower))return result(text,'Nice to meet you!');break;
 case 'greet':if(/good morning|good afternoon|nice to meet you/.test(lower))return result('hello','Nice to meet you, too!');break;
 case 'how':if(/fine|very well/.test(lower))return result('fine','Great! Let’s make a puppet!');break;
 case 'serve':if(/you(?:'re| are) welcome|here you are/.test(lower))return result('served','Thank you!');break;
 case 'askAge':if(/how old are you/.test(lower))return result('asked','I’m six years old!');break;
 case 'birthday':if(/happy birthday/.test(lower))return result('birthday','Thank you! How old are you?');break;
 case 'welcome':if(/hello|hi\b|nice to meet you|have some/.test(lower))return result('welcome','Thank you!');break;
 case 'bye':if(/bye|goodbye/.test(lower))return result('bye','See you!');break;
 }
 return {ok:false,reason:'伙伴还没有听懂这句话。可以看说法、重录；识别有误时也能改正文字。'};
}
