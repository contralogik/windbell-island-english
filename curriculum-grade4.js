export const G4_BOOK='grade4upper';
export const CLASSROOM_ITEMS=['blackboard','window','door','light','picture',"teacher's desk",'computer','fan','TV'];
export const CLEAN_SPOTS=['blackboard','window','floor'];
export const BAG_ITEMS={'English book':1,'maths book':1,'Chinese book':1,storybook:3,notebook:1,candy:5,toy:1,key:2};
export const LOCKERS=[['English book','maths book'],['Chinese book','storybook'],['notebook','candy'],['toy','key']];
export const FRIENDS=[
 {name:'Mike',pronoun:'he',clue:'He has glasses and his shoes are blue.',look:'glasses · blue shoes'},
 {name:'Amy',pronoun:'she',clue:'She has long hair and her shoes are brown.',look:'long hair · brown shoes'},
 {name:'John',pronoun:'he',clue:'He is tall and strong. He has short hair.',look:'tall and strong · short hair'},
 {name:'Lily',pronoun:'she',clue:'She has glasses and her shoes are purple.',look:'glasses · purple shoes'}
];
export const FRIEND_ROUNDS=FRIENDS.slice(0,3);
export const ROOMS=['bedroom','living room','study','kitchen','bathroom'];
export const ROOM_SPRITES={bedroom:'bed','living room':'sofa',study:'desk',kitchen:'fridge',bathroom:'bathroom'};
export const DISHES=['beef','chicken','noodles','soup','vegetables'];
export const CUTLERY=['chopsticks','bowl','fork','knife','spoon'];
export const DINNER_ORDERS=[
 {who:'fox',name:'Fox',items:['beef','vegetables'],tools:['knife','fork']},
 {who:'cat',name:'Cat',items:['noodles','chicken'],tools:['chopsticks','bowl']},
 {who:'bird',name:'Bird',items:['soup'],tools:['spoon','bowl']}
];
export const FINAL_ORDERS=[{who:'fox',name:'Fox',items:['noodles','soup'],tools:['bowl','spoon','chopsticks']}];
export const STORY_FAMILY=[
 {id:'father',word:'father',sprite:'father',job:'doctor',tool:'medical bag',pronoun:'he'},
 {id:'mother',word:'mother',sprite:'mother',job:'cook',tool:'spoon',pronoun:'she'},
 {id:'uncle',word:'uncle',sprite:'uncle',job:'driver',tool:'key',pronoun:'he'},
 {id:'aunt',word:'aunt',sprite:'aunt',job:'nurse',tool:'medical bag',pronoun:'she'},
 {id:'cousin',word:'cousin',sprite:'cousin',job:'farmer',tool:'vegetables',pronoun:'he'},
 {id:'baby',word:'baby brother',sprite:'baby brother',job:null,tool:null,pronoun:'he'}
];
export const RELAY=[{item:'picture',place:'wall',sprite:'window'},{item:'English book',place:'schoolbag',sprite:'schoolbag'},{item:'glasses',place:'Mike',sprite:'Mike'}];
const e=(id,unit,title,name,pages,kind,goals,words,expressions,phonics,phonicsPages,reward,rewardSprite,hint)=>({id,book:G4_BOOK,unit,title,name,pages,kind,goals,words,expressions,phonics,phonicsPages,reward,rewardSprite,hint,letters:''});
export const GRADE4_CHAPTERS=[
 e('g41','Unit 1','My classroom','教室焕新行动','2–11','classroom-renovation',['布置九件教室设施','拿扫帚打扫三处污渍','用英语介绍教室和位置'],[...CLASSROOM_ITEMS,'classroom','wall','floor','really','near','clean','help'],['We have a new classroom.',"What's in the classroom?",'Let’s go and see!','Where is it?',"It’s near the window.",'Let’s clean the classroom!','Let me clean the windows.'],['cake','face','name','make'],'6','新教室钥匙','key','把底部设施拖到房间里的标记。拿起扫帚，走近污渍清扫；把你的新教室介绍给伙伴。'),
 e('g42','Unit 2','My schoolbag','书包失物侦探','12–21','bag-detective',['根据颜色领回自己的书包','搜索四个柜子并装好用品','报告书包的颜色和内容'],['schoolbag',...Object.keys(BAG_ITEMS),'lost','so much','cute'],["What’s in your schoolbag?",'An English book, a maths book and three storybooks.','What colour is it?',"It’s blue and white.",'I lost my schoolbag.','Thank you so much!'],['like','kite','five','nine','rice'],'16','失物侦探徽章','schoolbag','先说出蓝白书包的颜色，再领回它。走近四个失物柜搜寻，找到的用品才能装进书包。'),
 e('g43','Unit 3','My friends','朋友线索侦探','22–31','friend-detective',['按外貌线索找到三位朋友','说出每位朋友的名字','描述朋友的身高和体格'],['strong','friendly','quiet','hair','shoe','glasses','his','or','right','hat','her','tall','short','long'],["What’s his name?",'His name is Mike.','Her name is Amy.',"He’s tall and strong.","Who’s he?",'He has glasses and his shoes are blue.'],['nose','note','Coke','Mr Jones'],'26','朋友侦探合影','Mike','听伙伴描述外貌，观察四位朋友，走近你认为正确的人确认，再录音介绍名字。错误人选可以重新寻找。'),
 e('g4r1','Recycle 1','School adventure','校园快递接力','32–35','school-relay',['把图画送到窗边并盖章','把英语书送进书包并盖章','把眼镜送给 Mike 并介绍他'],['picture','window','near','schoolbag','English book','glasses','strong','friendly','quiet'],["It’s near the window.",'I have an English book.','His name is Mike.'],['cake','name','like','rice','nose','note'],'34–35','校园接力通行证','picture','按路线把三件包裹送到目标。完成当前站的英语报告后，走近目标按 E 盖章，下一站才开放。'),
 e('g44','Unit 4','My home','家中寻人寻物','36–45','home-search',['走近探索家里的五个房间','找到 Amy 并说明位置','找到钥匙并用复数回答'],[...ROOMS,'bed','phone','table','sofa','fridge','find','them'],['Is she in the living room?',"No, she isn’t.","She’s in the study.",'Where are the keys?','Are they on the table?',"No, they aren’t. They’re in the door."],['use','cute','excuse'],'40','家的藏宝地图','house','点击房间走过去，再点一次或按 E 探索。找到 Amy，再搜门上的钥匙；回答时区分 she 和 they。'),
 e('g45','Unit 5',"Dinner's ready",'森林晚餐主厨','46–55','dinner-chef',['把五道菜逐一准备好','给三位朋友送菜和餐具','自己点餐并选择餐具'],[...DISHES,...CUTLERY,'vegetable','dinner','ready','help yourself','pass','try'],["What’s for dinner?",'What would you like?',"I’d like some soup and bread, please.",'Help yourself.','Would you like a knife and fork?','No, thanks. I can use chopsticks.','Pass me the bowl.'],['me','he','she','we'],'50','森林晚餐主厨勋章','noodles','把菜放到备餐台，走近按 E 准备。准备好的菜才能送给客人；还要送对餐具，最后开口为自己点餐。'),
 e('g46','Unit 6','Meet my family!','家庭职业小镇','56–65','family-careers',['拼出故事家庭的六位成员','配好五份职业牌和工具','数家人并介绍叔叔和职业'],['parents','cousin','uncle','aunt','baby brother','doctor','cook','driver','farmer','nurse','people','but','little','puppy','football player','job','basketball'],['How many people are there in your family?','My family has six people.','Is this your uncle?',"Yes, it is. He’s a driver.","What’s your aunt’s job?","She’s a nurse."],['face','rice','nose','use','me','we','bag','mum','six','leg','dog'],'60','家庭职业故事相册','nurse','这是故事里的一家六口。把照片拼进相册，配上职业牌，再把工作工具送给对应家人；宝宝不用工作。'),
 e('g4r2','Recycle 2','Family dinner adventure','家庭晚餐大冒险','66–69','family-dinner-final',['找到钥匙、报告位置并开门','准备晚餐、送餐具并开饭','介绍家人和职业，拍合影'],[...ROOMS,...DISHES,...CUTLERY,'keys','parents','uncle','aunt','cousin','doctor','cook','driver','farmer','nurse'],["They’re on the sofa.","I’d like some noodles, please.",'I can use chopsticks.','Pass me the chopsticks.','My family has six people.',"She’s a nurse."],['cake','face','like','rice','nose','note','use','cute','me','we','bag','dog'],'69','四年级上册探险奖章','picture','三幕连起来玩：找钥匙开门 → 准备家庭晚餐 → 介绍职业拍合影。每幕需要实际操作和英语报告。')
];
export const G4_PHONICS={cake:'a-e',face:'a-e',name:'a-e',make:'a-e',like:'i-e',kite:'i-e',five:'i-e',nine:'i-e',rice:'i-e',nose:'o-e',note:'o-e',Coke:'o-e','Mr Jones':'o-e',use:'u-e',cute:'u-e',excuse:'u-e',me:'-e',he:'-e',she:'-e',we:'-e',bag:'short a',mum:'short u',six:'short i',leg:'short e',dog:'short o'};
export const G4_PATTERN_EXAMPLES={'a-e':'cake','i-e':'rice','o-e':'nose','u-e':'use','-e':'me','short a':'bag','short e':'leg','short i':'six','short o':'dog','short u':'mum'};
const node=(key,npc,help,examples,mode,extra={})=>({key,npc,help,examples,mode,g4:true,...extra});
export function grade4Dialogue(id,s){const t=s.talks,g=s.g4;
 switch(id){
 case 'g41':return !t.classroom?node('classroom',"What's in the classroom?",'布置好教室，再说出黑板和电脑。',['A blackboard and a computer.','We have a blackboard and a computer.'],'classroom',{blocked:g.placed.length<CLASSROOM_ITEMS.length}):!t.pictureLocation?node('pictureLocation','Where is the picture?','看看图画和窗户的位置。',["It's near the window."],'pictureLocation'):node('cleanOffer',"Let's clean the classroom!",'用 Let me 表达你愿意帮忙打扫什么。',['Let me clean the windows.','Let me clean the blackboard.','Let me clean the floor.'],'cleanOffer');
 case 'g42':return !t.bagColour?node('bagColour','What colour is your schoolbag?','失物卡提示：你的书包是蓝白色。先报告颜色，再领回。',["It's blue and white."],'bagColour'):node('bagContents',"What's in your schoolbag?",'装好所有用品，向伙伴介绍里面的英语书和数学书。',['An English book and a maths book.','I have an English book and a maths book.'],'bagContents',{blocked:Object.entries(BAG_ITEMS).some(([w,n])=>g.bagPacked[w]!==n)});
 case 'g43':{const i=Math.min(g.friendsFound.length,2),f=FRIEND_ROUNDS[i];if(g.friendsFound.length<3)return node(`friend-${i}`,g.friendGuess===f.name?`What's ${f.pronoun==='he'?'his':'her'} name?`:f.clue,'观察外貌，走近正确的人确认，再介绍名字。',[`${f.pronoun==='he'?'His':'Her'} name is ${f.name}.`],'friendName',{expected:f.name,pronoun:f.pronoun,blocked:g.friendGuess!==f.name});return node('friendLook','Tell me about John.','John 已加入探险队，介绍他的身高和体格。',["He's tall and strong."],'friendLook');}
 case 'g4r1':{const i=Math.min(g.relayStamps.length,2);return i===0?node('relay-0','Where is the picture?','先送图画，再报告它的位置，最后走近盖章。',["It's near the window."],'pictureLocation',{blocked:!g.relayDelivered.includes(0)}):i===1?node('relay-1',"What's in your schoolbag?",'先送书，再报告书包里有什么。',['I have an English book.'],'relayBag',{blocked:!g.relayDelivered.includes(1)}):node('relay-2',"What's his name?",'把眼镜送给 Mike，介绍他后盖最后的章。',['His name is Mike.'],'friendName',{expected:'Mike',pronoun:'he',blocked:!g.relayDelivered.includes(2)});}
 case 'g44':return !t.homeNo?node('homeNo','Is Amy in the living room?','先探索客厅；Amy 不在这里。',["No, she isn't."],'homeNo',{blocked:!g.homeRooms.includes('living room')}):!t.homeWhere?node('homeWhere','Where is Amy?','探索书房找到 Amy 后，说明她在哪里。',["She's in the study."],'homeWhere',{blocked:!g.homeRooms.includes('study')}):node('homeKeys','Are the keys on the table?','搜门找到钥匙后，用 they 描述它们的位置。',["No, they aren't. They're in the door.","They're in the door."],'keysLocation',{expected:'in the door',blocked:!g.homeKeys});
 case 'g45':return !t.dinnerRequest?node('dinnerRequest','What would you like?','先招待好客人，再为自己点菜；喜欢哪种都可以。',DISHES.map(w=>`I'd like some ${w}, please.`),'dinnerRequest',{blocked:!ordersReady(g,DINNER_ORDERS)}):!t.dinnerUtensils?node('dinnerUtensils','Would you like a knife and fork?','你可以要刀叉，也可以说明自己会用筷子。',['No, thanks. I can use chopsticks.','Yes, please.'],'dinnerUtensils'):node('dinnerPass','What do you need?','请求你的餐具，角色会把它送给你。',[`Pass me the ${g.ownUtensils==='fork'?'fork':'chopsticks'}, please.`],'passUtensil',{expected:g.ownUtensils==='fork'?'fork':'chopsticks'});
 case 'g46':return !t.familyCount?node('familyCount','How many people are there in your family?','拼完相册，数数这户故事家庭。',['My family has six people.'],'familyCount',{blocked:g.familySlots.length<6}):!t.familyUncle?node('familyUncle','Is this your uncle?','现在指的是相册里的 uncle，确认他的身份。',["Yes, it is. He's a driver."],'familyUncle'):!t.familyAunt?node('familyAunt',"What's your aunt's job?",'配好 aunt 的职业牌，再介绍她的工作。',["She's a nurse."],'job',{expected:'nurse',pronoun:'she',blocked:g.jobs.aunt!=='nurse'}):node('familyFather',"What's your father's job?",'配好 father 的职业牌，再介绍他的工作。',["He's a doctor."],'job',{expected:'doctor',pronoun:'he',blocked:g.jobs.father!=='doctor'});
 case 'g4r2':if(g.finalStage===0)return node('finalKeys','Where are the keys?','走近沙发找到钥匙，再报告位置并去开门。',["They're on the sofa."],'keysLocation',{expected:'on the sofa',blocked:!g.finalKeys});if(g.finalStage===1)return !t.finalMeal?node('finalMeal','What would you like?','先把晚餐和餐具送好，再为自己点面条。',["I'd like some noodles, please."],'finalMeal',{blocked:!ordersReady(g,FINAL_ORDERS)}):node('finalTools','What do you need?','开口要筷子，之后到开饭铃旁按 E。',['Pass me the chopsticks, please.'],'passUtensil',{expected:'chopsticks'});return !t.finalAunt?node('finalAunt',"What's your aunt's job?",'把两张职业牌配好，介绍 aunt。',["She's a nurse."],'job',{expected:'nurse',pronoun:'she',blocked:g.jobs.aunt!=='nurse'||g.jobs.uncle!=='driver'}):node('finalCount','How many people are there in your family?','数一数合影里的六位家人，再按 E 拍合影。',['My family has six people.'],'familyCount');
 }
}
export function ordersReady(g,orders){return orders.every(o=>o.items.every(w=>g.dinnerServed[o.who]?.includes(w))&&o.tools.every(w=>g.dinnerTools[o.who]?.includes(w)));}
export function interpretGrade4Speech(raw,n){
 const text=String(raw||'').toLowerCase().replace(/[’‘‛]/g,"'").replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();
 const ok=(value,reply='Great! Let’s keep exploring!')=>({ok:true,value,reply});
 if(n.blocked)return {ok:false,reason:'先完成场景里的探索或操作，再用英语报告。'};
 const affirmative=!/\b(?:not|don't|doesn't|isn't|aren't|can't|hasn't|haven't|no)\b/.test(text);
 switch(n.mode){
 case 'classroom':if(affirmative&&/^(?:we have|i see|there is|there are|a|one)\b/.test(text)&&text.includes('blackboard')&&text.includes('computer'))return ok('classroom','We have a new classroom!');break;
 case 'pictureLocation':if(affirmative&&/\b(?:it(?:'s| is)|the picture is) near the window\b/.test(text))return ok('near the window',"Yes! It's near the window.");break;
 case 'cleanOffer':{const m=text.match(/\blet me clean (?:the )?(windows?|blackboard|floor)\b/);if(m)return ok(m[1],'Thank you for your help!');break;}
 case 'bagColour':if(/\bit(?:'s| is) blue and white\b/.test(text)&&affirmative)return ok('blue and white','Here is your schoolbag!');break;
 case 'bagContents':if(affirmative&&/^(?:i have|an english book|there is|there are)\b/.test(text)&&text.includes('english book')&&/maths? book/.test(text))return ok('books','Your schoolbag is ready!');break;
 case 'relayBag':if(affirmative&&/\bi have an english book\b/.test(text))return ok('English book');break;
 case 'friendName':{const p=n.pronoun==='he'?'his':'her';if(new RegExp(`\\b${p} name is ${n.expected.toLowerCase()}\\b`).test(text)&&affirmative)return ok(n.expected,`Hello, ${n.expected}!`);break;}
 case 'friendLook':if(affirmative&&/\bhe(?:'s| is) tall and strong\b/.test(text))return ok('tall and strong','John is tall and strong!');break;
 case 'homeNo':if(/\bno she (?:isn't|is not)\b/.test(text))return ok('no',"She's in another room.");break;
 case 'homeWhere':if(affirmative&&/\bshe(?:'s| is) in the study\b/.test(text))return ok('study',"Yes! She's in the study.");break;
 case 'keysLocation':if(new RegExp(`\\bthey(?:'re| are) ${n.expected}\\b`).test(text)&&!new RegExp(`they(?: are not| aren't) ${n.expected}`).test(text))return ok(n.expected,`Yes! They're ${n.expected}.`);break;
 case 'dinnerRequest':case 'finalMeal':{const foods=[...DISHES,'bread'].filter(w=>new RegExp(`\\b${w}\\b`).test(text));if(foods.length&&/^(?:i'd like|i would like|can i have)\b/.test(text)&&affirmative&&(n.mode!=='finalMeal'||foods.includes('noodles')))return ok(foods,`Here you are! Have some ${foods.join(' and ')}.`);break;}
 case 'dinnerUtensils':if(/\bno thanks\b/.test(text)&&/\bi can use chopsticks\b/.test(text))return ok('chopsticks','Here are your chopsticks!');if(/\byes please\b/.test(text))return ok('fork','Here are your knife and fork!');break;
 case 'passUtensil':if(new RegExp(`\\bpass me (?:the )?${n.expected}\\b`).test(text)&&affirmative)return ok(n.expected,n.expected==='chopsticks'?'Here are your chopsticks!':'Here is your fork!');break;
 case 'familyCount':{const numbers=text.match(/\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/g)||[];if(/\bmy family has (?:six|6) people\b|\bthere are (?:six|6) people\b/.test(text)&&affirmative&&numbers.every(n=>n==='six'||n==='6'))return ok(6,'Six people! What a lovely family!');break;}
 case 'familyUncle':if(/\byes it is\b/.test(text))return ok('uncle',"He's your uncle. He's a driver.");break;
 case 'job':if(new RegExp(`\\b${n.pronoun}(?:'s| is) a ${n.expected}\\b`).test(text)&&affirmative)return ok(n.expected,`Yes! ${n.pronoun==='she'?'She':'He'} is a ${n.expected}.`);break;
 }
 return {ok:false,reason:'再观察场景，用完整的英语句子说一说。名字、位置、数量和职业要符合你的发现。'};
}
export const G4_AUDIO=[...FRIENDS.flatMap(f=>[f.name,f.clue,f.look,`${f.pronoun==='he'?'His':'Her'} name is ${f.name}.`,`Hello, ${f.name}!`]),...ROOMS.map(r=>`Go to the ${r}.`),'blue and white','red and yellow','green and black','We have a new classroom!','A blackboard and a computer.',"Yes! It's near the window.",'Thank you for your help!','Here is your schoolbag!','Your schoolbag is ready!','I have an English book and a maths book.','I have an English book.','John is tall and strong!',"She's in another room.","Yes! She's in the study.","They're in the door.","They're on the sofa.","Yes! They're in the door.","Yes! They're on the sofa.",'Six people! What a lovely family!',"He's your uncle. He's a driver.",'Here are your chopsticks!','Here are your knife and fork!','Here are your fork!',...DISHES.flatMap(w=>[`I'd like some ${w}, please.`,`Here you are! Have some ${w}.`]),'Here you are! Have some soup and bread.',...CUTLERY.map(w=>`Pass me the ${w}, please.`),...STORY_FAMILY.filter(f=>f.job).map(f=>`Yes! ${f.pronoun==='she'?'She':'He'} is a ${f.job}.`),'short hair','long hair','blue shoes','brown shoes','purple shoes','tall and strong','broom','medical bag'];
