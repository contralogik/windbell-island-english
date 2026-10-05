export const G5U_BOOK='grade5upper',G5L_BOOK='grade5lower';
export const G5_BOOKS=[G5U_BOOK,G5L_BOOK];
export const TRAITS=[
 {word:'old',who:'Mr Grey',pronoun:'He',sprite:'grandfather',clue:'Mr Grey 已经七十岁了。'},
 {word:'young',who:'Ms Green',pronoun:'She',sprite:'teacher',clue:'Ms Green 刚开始当老师，今年二十五岁。'},
 {word:'funny',who:'Mike',pronoun:'He',sprite:'Mike',clue:'Mike 讲了一个笑话，大家笑了起来。'},
 {word:'kind',who:'Ms Green',pronoun:'She',sprite:'teacher',clue:'有人摔倒时，Ms Green 温柔地安慰他。'},
 {word:'strict',who:'Robin',pronoun:'He',sprite:'Robin',clue:'Robin 坚持让大家先完成作业再玩。'},
 {word:'polite',who:'Amy',pronoun:'She',sprite:'Amy',clue:'Amy 借东西时说 please，收到后说 thank you。'},
 {word:'hard-working',who:'Robin',pronoun:'He',sprite:'Robin',clue:'Robin 每天认真做完自己的工作。'},
 {word:'helpful',who:'Amy',pronoun:'She',sprite:'Amy',clue:'Amy 主动帮伙伴收拾书包。'},
 {word:'clever',who:'Robin',pronoun:'He',sprite:'Robin',clue:'Robin 找到了谜题的解法，还会说两种语言。'},
 {word:'shy',who:'Oliver',pronoun:'He',sprite:'schoolboy',clue:'Oliver 初次见面时，轻声躲在伙伴身后。'}
];
export const WEEK=[
 {day:'Monday',subjects:['Chinese','English'],sprite:'Chinese book'},
 {day:'Tuesday',subjects:['maths','science'],sprite:'maths book'},
 {day:'Wednesday',subjects:['art','PE'],sprite:'picture'},
 {day:'Thursday',subjects:['maths','English','music'],sprite:'music class'},
 {day:'Friday',subjects:['English','computer class'],sprite:'computer'},
 {day:'Saturday',subjects:['read books','play football'],sprite:'book'},
 {day:'Sunday',subjects:['wash my clothes','do homework','watch TV'],sprite:'TV'}
];
export const SUBJECTS=[...new Set(WEEK.flatMap(d=>d.subjects))];
export const MEALS=[
 {who:'Fox',sprite:'fox',food:'sandwich',drink:'water',taste:'fresh',note:'要 sandwich + water；喜欢新鲜的食物。'},
 {who:'Amy',sprite:'Amy',food:'salad',drink:'tea',taste:'healthy',note:'要 salad + tea；想选健康的食物。'},
 {who:'Mike',sprite:'Mike',food:'hamburger',drink:'milk',taste:'delicious',note:'要 hamburger + milk；觉得它很美味。'},
 {who:'Cat',sprite:'cat',food:'ice cream',drink:'water',taste:'sweet',note:'要 ice cream + water；喜欢甜味。'},
 {who:'Robin',sprite:'Robin',food:'noodles',drink:'tea',taste:'hot',note:'要 noodles + tea；这份面条口味是辣的。'}
];
export const MENU=['sandwich','salad','hamburger','ice cream','noodles','water','tea','milk'];
export const SKILLS=[
 {word:'play the pipa',sprite:'pipa',sequence:['1','3','2'],buttons:['1','2','3'],instruction:'按照琴谱 1 → 3 → 2 点弦。'},
 {word:'draw cartoons',sprite:'cartoon sketchbook',sequence:['head','body','arm'],buttons:['head','body','arm'],instruction:'给漫画角色依次盖上头、身体、手臂。'},
 {word:'do kung fu',sprite:'kung fu dummy',sequence:['wave','clap','stamp'],buttons:['wave','clap','stamp'],instruction:'组合动作：挥臂 → 拍手 → 跺脚。'},
 {word:'play basketball',sprite:'basketball station',sequence:['left','middle','right'],buttons:['left','middle','right'],instruction:'篮筐依次移到左、中、右，选择对应方向投篮。'}
];
export const ROOM=[
 {word:'photo',zone:'above',phrase:'above the bed',sprite:'photo'},
 {word:'plant',zone:'beside',phrase:'beside the bed',sprite:'plant'},
 {word:'bike',zone:'behind',phrase:'behind the bed',sprite:'bike'},
 {word:'water bottle',zone:'in front of',phrase:'in front of the bed',sprite:'water bottle'},
 {word:'clock',zone:'between',phrase:'between the bed and the plant',sprite:'clock'}
];
export const PARK=['forest','river','lake','mountain','hill','tree','bridge','village','house','building'];
export const SURVEY=[{word:'lake',present:true,plural:false},{word:'river',present:false,plural:false},{word:'trees',present:true,plural:true},{word:'tall buildings',present:false,plural:true}];
export const DAILY=[
 {word:'do morning exercises',hour:7,sprite:'morning exercises'},
 {word:'eat breakfast',hour:8,sprite:'breakfast'},
 {word:'have English class',hour:9,sprite:'English book'},
 {word:'play sports',hour:4,sprite:'ball'},
 {word:'eat dinner',hour:6,sprite:'rice'}
];
export const WEEKEND=[{word:'clean my room',sprite:'broom'},{word:'go for a walk',sprite:'go for a walk'},{word:'go shopping',sprite:'go shopping'},{word:'take a dancing class',sprite:'dancing'}];
export const SEASONS=[
 {word:'spring',activity:'go on a picnic',sprite:'spring tree',prop:'picnic',pieces:['bread','apple','water'],instruction:'把面包、苹果、水装进野餐篮。'},
 {word:'summer',activity:'go swimming',sprite:'sunny',prop:'swimming',pieces:['1','2','3'],instruction:'依次走近三个泳圈，完成游泳路线。'},
 {word:'autumn',activity:'pick apples',sprite:'apple tree',prop:'apple',pieces:['1','2','3'],instruction:'走近树下，摘下三只苹果。'},
 {word:'winter',activity:'make a snowman',sprite:'snowy',prop:'snowman',pieces:['snowball','carrot','hat'],instruction:'把雪球、胡萝卜和帽子装到雪人上。'}
];
export const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
// School events are an island schedule; movable holidays are never represented as fixed real-world dates.
export const EVENTS=[
 {word:"New Year's Day",month:'January',sprite:'present'},
 {word:'Tree Planting Day',month:'March',sprite:'tree'},
 {word:'English party',month:'April',sprite:'microphone'},
 {word:'singing contest',month:'May',sprite:'microphone'},
 {word:"Children's Day",month:'June',sprite:'balloon'},
 {word:'summer vacation',month:'July',sprite:'swimming'},
 {word:'school trip',month:'October',sprite:'map'},
 {word:'American Thanksgiving Day',month:'November',sprite:'salad'},
 {word:'Christmas',month:'December',sprite:'present'}
];
export const ORDINALS={1:'first',2:'second',3:'third',4:'fourth',5:'fifth',12:'twelfth',20:'twentieth',21:'twenty-first',23:'twenty-third',30:'thirtieth'};
export const DATES=[
 {word:'art show',month:'May',day:1,sprite:'picture'},
 {word:'reading festival',month:'May',day:2,sprite:'book'},
 {word:'sports meet',month:'May',day:3,sprite:'ball'},
 {word:'English test',month:'May',day:4,sprite:'English book'},
 {word:'school trip',month:'May',day:5,sprite:'map'},
 {word:"Grandpa's birthday",month:'June',day:12,sprite:'cake'},
 {word:"Grandma's birthday",month:'June',day:20,sprite:'cake'},
 {word:"Amy's birthday",month:'June',day:21,sprite:'cake'},
 {word:"Mike's birthday",month:'June',day:23,sprite:'cake'},
 {word:"Robin's birthday",month:'June',day:30,sprite:'present'}
];
export const OWNERS=[
 {word:'mine',label:'我 · my',item:'yellow picture',sprite:'picture'},
 {word:'yours',label:'你 · your',item:'water bottle',sprite:'water bottle'},
 {word:'his',label:'Mike · his',item:'blue cap',sprite:'cap'},
 {word:'hers',label:'Amy · her',item:'storybook',sprite:'storybook'},
 {word:'ours',label:'我和你 · our',item:'football',sprite:'ball'},
 {word:'theirs',label:'John 和 Amy · their',item:'schoolbag',sprite:'schoolbag'}
];
export const PETS=[
 {word:'eating',sprite:'dog eating',prop:'food bowl',instruction:'给小狗食物。'},
 {word:'drinking',sprite:'dog drinking',prop:'water bottle',instruction:'给小狗水。'},
 {word:'sleeping',sprite:'dog sleeping',prop:'bed',instruction:'让小狗躺在床上。'},
 {word:'jumping',sprite:'rabbit jumping',prop:'ball',instruction:'给兔子弹跳球。'},
 {word:'climbing',sprite:'monkey climbing',prop:'tree',instruction:'把小猴送到攀爬树旁。'},
 {word:'playing',sprite:'dog playing',prop:'toy',instruction:'给小狗玩具。'}
];
export const RULES=[
 {word:'Keep to the right.',sprite:'bridge',activity:'doing morning exercises',instruction:'经过桥时，先选右侧通道，再走近桥头通过。'},
 {word:'Talk quietly.',sprite:'library',activity:'reading a book',instruction:'把音量调成 quiet，再走近图书馆登记。'},
 {word:'Take turns.',sprite:'pipa',activity:'listening to music',instruction:'先让 Amy 体验，再让 Mike，最后轮到你。'},
 {word:'Keep your desk clean.',sprite:'tidy desk',activity:'having an English class',instruction:'把桌上的 pencil、book、crayon 放回收纳箱。'},
 {word:'Work quietly.',sprite:'cartoon sketchbook',activity:'eating lunch',instruction:'关闭喇叭，安静完成最后一站。'}
];
const chapter=(id,book,unit,title,name,pages,kind,goals,words,expressions,phonics,phonicsPages,rewardSprite,hint)=>({id,book,unit,title,name,pages,kind,goals,words,expressions,phonics,phonicsPages,rewardSprite,reward:name+'纪念章',hint,letters:''});
export const GRADE5_UPPER_CHAPTERS=[
 chapter('g5u1',G5U_BOOK,'Unit 1',"What's he like?",'人物线索调查','2–11','g5-detective',['发现十条人物行为线索','配好十张性格卡','用完整英语介绍人物'],TRAITS.map(x=>x.word).concat(['know','our','Ms','will','sometimes','robot','him','speak','finish']),['Is he young? No, he isn’t.','What’s she like? She’s kind.'],['baby','happy','windy','sunny','sorry'], '6','Robin','走近人物查看行为线索，配上性格卡，再向狐狸报告并归档。'),
 chapter('g5u2',G5U_BOOK,'Unit 2','My week','一周计划工程师','12–21','g5-week',['安排五个上课日','安排两天周末活动','逐日介绍自己的安排'],WEEK.map(x=>x.day).concat(['weekend','wash my clothes','watch TV','do homework','read books','play football','cooking','often','park','tired','play sports','should','every','day','schedule']),['What do you have on Thursdays? I have maths, English and music.','Do you often read books on Saturdays? Yes, I do.','I often wash my clothes on Sundays.'],['feet','beef','meet','tea','read','eat'],'16','calendar','切换星期，照日程卡排课和安排周末；可以换掉卡片，再报告安排。'),
 chapter('g5u3',G5U_BOOK,'Unit 3','What would you like?','风铃餐厅主理人','22–31','g5-restaurant',['给五位客人配好餐食','用英语点食物和饮品','说明喜爱的食物与口味'],MENU.concat(['fresh','healthy','delicious','hot','sweet','drink','thirsty','favourite','food','onion']),['What would you like to eat? I’d like a sandwich, please.','What would you like to drink? I’d like some water.','My favourite food is salad. It is healthy.'],['cow','flower','wow','down','snow','yellow','slow','window'],'26','salad','看客人便签，先准备食物和饮料；和狐狸演一遍点餐，再走近出餐铃。'),
 chapter('g5ur1',G5U_BOOK,'Recycle 1','Recycle 1','校园开放日','32–35','g5-upper-recycle1',['介绍来访老师','安排星期四课程','为客人点餐并上菜'],['kind','strict','Thursday','maths','English','music','sandwich','water','fresh'],['She is kind.','I have maths, English and music on Thursdays.','I’d like a sandwich, please.'],['happy','feet','tea','cow','snow'],'6、16、26','schoolbag','三幕开放日：性格调查 → 排课 → 餐厅点餐。每幕都要完成操作和报告。'),
 chapter('g5u4',G5U_BOOK,'Unit 4','What can you do?','才艺游乐场','36–45','g5-skills',['完成琵琶与漫画挑战','完成武术与投篮挑战','报告自己的本领和 Robin 的本领'],['sing English songs','play the pipa','do kung fu','dance','draw cartoons','cook','swim','play basketball','play ping-pong','speak English','party','learn','wonderful','no problem','send','email'],['What can you do? I can play the pipa.','Can you do any kung fu? Yes, I can.','Can Robin swim? No, he can’t.'],['book','look','football','good','balloon','food','zoo','noodles'],'40','pipa','按琴谱、盖漫画、组合动作、瞄准投篮；完成挑战后开口介绍本领。'),
 chapter('g5u5',G5U_BOOK,'Unit 5','There is a big bed','树屋布置师','46–55','g5-room',['按五种方位布置房间','介绍物体的真实位置','用 there is / there are 描述房间'],ROOM.map(x=>x.word).concat(['above','beside','behind','between','in front of','bed','picture','grandparent','their','house','lots of','flower','dirty','everywhere','mouse']),['There is a big bed.','The photo is above the bed.','There are two pictures in my room.'],['rainbow','paint','wait','say','way','birthday','Monday'],'50','plant','把物品拖到床周围的方位槽；可取回重摆。放好后报告位置，整理两幅画。'),
 chapter('g5u6',G5U_BOOK,'Unit 6','In a nature park','自然公园修桥队','56–65','g5-park',['修好两座桥','走近四处调查公园','用单数与复数问答介绍发现'],PARK.concat(['go boating','rabbit','high']),['Is there a lake in the park? Yes, there is.','Is there a river in the forest? No, there isn’t.','Are there any tall buildings? No, there aren’t.'],['house','mouse','sound','count'],'60','bridge','拖入桥梁接通路线，再走近景点调查；有些事物确实不存在，要如实回答。'),
 chapter('g5ur2',G5U_BOOK,'Recycle 2','Recycle 2','树屋庆典大冒险','66–69','g5-upper-recycle2',['准备一段才艺表演','布置庆典树屋','修桥并调查公园'],['play the pipa','photo','plant','clock','bike','water bottle','lake','trees','bridge'],['I can play the pipa.','The photo is above the bed.','Are there any trees? Yes, there are.'],['good','balloon','rainbow','say','house','mouse'],'40、50、60','house','三幕庆典：琵琶挑战 → 树屋布置 → 修桥调查。')
];
export const GRADE5_LOWER_CHAPTERS=[
 chapter('g5l1',G5L_BOOK,'Unit 1','My day','岛民一日规划','2–11','g5-routine',['安排五段日常时间','完成四项周末活动','用 at 和 often 介绍安排'],DAILY.map(x=>x.word).concat(WEEKEND.map(x=>x.word),['when','after','start','usually','Spain','a.m.','p.m.','why','busy','always','island','cave']),['When do you eat breakfast? I eat breakfast at eight o’clock.','What do you do on the weekend? I often clean my room.'],['clean','class','clock','plate','eggplant','play'],'6','clock','拨时钟、配活动，再走近日程铃启动；周末四个活动也可以亲手完成。'),
 chapter('g5l2',G5L_BOOK,'Unit 2','My favourite season','四季旅行工坊','12–21','g5-seasons',['完成春夏秋冬四种活动','自己选择最喜欢的季节','用 because 说出选择理由'],SEASONS.map(x=>x.word).concat(SEASONS.map(x=>x.activity),['season','which','best','snow','because','vacation','all','pink','lovely','leaves','fall']),['Which season do you like best? I like autumn best.','Why? Because I can pick apples.'],['brown','brother','library','green','grapes','grow'],'16','snowman','春天装野餐篮，夏天走泳圈路线，秋天摘苹果，冬天装雪人；自己决定最爱的季节。'),
 chapter('g5l3',G5L_BOOK,'Unit 3','My school calendar','校园活动日历','22–31','g5-calendar',['安排一月至五月的活动','安排六月至十二月的活动','报告活动月份和秋游计划'],MONTHS.concat(['sports meet','school trip','singing contest','the Great Wall','National Day','American Thanksgiving Day','Christmas','act out','riddle']),['When is the party? It’s in April.','When is the trip this year? It’s in October. We’ll go to the Great Wall.'],['China','chicken','lunch','teacher','sheep','fish','shirt','shorts'],'26','calendar','翻动月份日历，把活动拖入该月，再报告日期。校园活动采用岛上给定安排。'),
 chapter('g5lr1',G5L_BOOK,'Recycle 1','Recycle 1','四季营地计划','32–35','g5-lower-recycle1',['启动早餐日程','完成秋日摘苹果','安排秋游并介绍计划'],['eat breakfast','autumn','pick apples','October','school trip','the Great Wall'],['I eat breakfast at eight o’clock.','I like autumn best. Because I can pick apples.','It’s in October. We’ll go to the Great Wall.'],['clock','plate','brown','grapes','China','sheep'],'6、16、26','picnic','三幕营地：早餐时间 → 秋天采摘 → 十月秋游。'),
 chapter('g5l4',G5L_BOOK,'Unit 4','When is the art show?','日期邮递员','36–45','g5-dates',['投递五项五月活动','投递五封六月生日邀请','说清月份和十种序数日期'],Object.values(ORDINALS).concat(['other','special','art show','reading festival','kitten','diary','fur','open']),['When is the art show? It’s on May first.','My birthday is on April fourth.','It’s on June twenty-first.'],['three','thin','maths','birthday','this','that','mother','brother'],'40','present','选择月份、序数日，把邀请卡交给邮箱。报告具体日期后才能投递。'),
 chapter('g5l5',G5L_BOOK,'Unit 5','Whose dog is it?','宠物与失物照护站','46–55','g5-pets',['用六种代词归还失物','完成六种宠物照护','报告所属关系与正在进行的动作'],OWNERS.map(x=>x.word).concat(PETS.map(x=>x.word),['each other','excited']),['Whose is it? It’s hers.','What is the dog doing? It is eating.','Is he drinking water? No, he isn’t. He’s eating.'],['sing','ring','young','long','think','ink','trunk','pink'],'50','dog playing','看失物上的主人标签归还，再给宠物食物、水、玩具等。画面会切换到真正的动作状态。'),
 chapter('g5l6',G5L_BOOK,'Unit 6','Work quietly!','机器人展馆巡游','56–65','g5-rules',['正确通过桥与图书馆','排队体验并整理书桌','报告进行中的活动与五条规则'],['doing morning exercises','having an English class','eating lunch','reading a book','listening to music','Keep to the right.','Keep your desk clean.','Talk quietly.','Take turns.','Work quietly.','bamboo','exhibition','sushi','teach'],['What are they doing? They’re reading a book.','Talk quietly, please.','Keep your desk clean.'],['what','when','where','whose','who'],'60','Robin','选右侧过桥、调低音量、让伙伴先玩、收拾桌面；实际做到后用英语提醒规则。'),
 chapter('g5lr2',G5L_BOOK,'Recycle 2','Recycle 2','夏日展会总动员','66–69','g5-lower-recycle2',['投递艺术展邀请','照护宠物并报告动作','保持桌面整洁完成展会'],['first','May','mine','hers','eating','playing','Keep your desk clean.','having an English class'],['It’s on May first.','It is eating.','Keep your desk clean.'],['thin','this','sing','pink','what','who'],'40、50、60','present','三幕展会：五月一日邀请 → 宠物照护 → 整理展馆。')
];
export const GRADE5_CHAPTERS=[...GRADE5_UPPER_CHAPTERS,...GRADE5_LOWER_CHAPTERS];
export const G5_PHONICS={baby:'y /i/',happy:'y /i/',windy:'y /i/',sunny:'y /i/',sorry:'y /i/',feet:'ee',beef:'ee',meet:'ee',tea:'ea',read:'ea',eat:'ea',cow:'ow /aʊ/',flower:'ow /aʊ/',wow:'ow /aʊ/',down:'ow /aʊ/',snow:'ow /əʊ/',yellow:'ow /əʊ/',slow:'ow /əʊ/',window:'ow /əʊ/',book:'oo /ʊ/',look:'oo /ʊ/',football:'oo /ʊ/',good:'oo /ʊ/',balloon:'oo /uː/',food:'oo /uː/',zoo:'oo /uː/',noodles:'oo /uː/',rainbow:'ai',paint:'ai',wait:'ai',say:'ay',way:'ay',birthday:'ay',Monday:'ay',house:'ou',mouse:'ou',sound:'ou',count:'ou',clean:'cl',class:'cl',clock:'cl',plate:'pl',eggplant:'pl',play:'pl',brown:'br',brother:'br',library:'br',green:'gr',grapes:'gr',grow:'gr',China:'ch',chicken:'ch',lunch:'ch',teacher:'ch',sheep:'sh',fish:'sh',shirt:'sh',shorts:'sh',three:'th /θ/',thin:'th /θ/',maths:'th /θ/',this:'th /ð/',that:'th /ð/',mother:'th /ð/',sing:'ng',ring:'ng',young:'ng',long:'ng',think:'nk',ink:'nk',trunk:'nk',pink:'nk',what:'wh /w/',when:'wh /w/',where:'wh /w/',whose:'wh /h/',who:'wh /h/'};
// A word can illustrate different patterns in different books (birthday: ay / th).
export function g5Pattern(c,w){return c.book===G5L_BOOK&&c.id==='g5l4'&&w==='birthday'?'th /θ/':c.book===G5L_BOOK&&['g5l4','g5lr2'].includes(c.id)&&w==='brother'?'th /ð/':G5_PHONICS[w];}
export const G5_PATTERN_EXAMPLES={'y /i/':'happy',ee:'feet',ea:'tea','ow /aʊ/':'cow','ow /əʊ/':'snow','oo /ʊ/':'book','oo /uː/':'food',ai:'rainbow',ay:'say',ou:'house',cl:'clock',pl:'plate',br:'brown',gr:'green',ch:'China',sh:'sheep','th /θ/':'thin','th /ð/':'this',ng:'sing',nk:'pink','wh /w/':'what','wh /h/':'who'};
export function g5Part(c,g){const map={g5u1:'traits',g5u2:'week',g5u3:'meals',g5u4:'skills',g5u5:'room',g5u6:'park',g5l1:'daily',g5l2:'seasons',g5l3:'calendar',g5l4:'dates',g5l5:'pets',g5l6:'rules'};return map[c.id]||({g5ur1:['traits','week','meals'],g5ur2:['skills','room','park'],g5lr1:['daily','seasons','calendar'],g5lr2:['dates','pets','rules']}[c.id]?.[Math.min(g.stage,2)]);}
export const g5Final=c=>/r[12]$/.test(c.id);
export function g5Tasks(c,part){const lists={traits:TRAITS,week:WEEK,meals:MEALS,skills:SKILLS,room:ROOM,park:SURVEY,daily:DAILY,seasons:SEASONS,calendar:EVENTS,dates:DATES,pets:PETS,rules:RULES};let list=lists[part]||[];if(c.id==='g5ur1')list=part==='traits'?[TRAITS[3],TRAITS[4]]:part==='week'?[WEEK[3]]:[MEALS[0]];if(c.id==='g5ur2'&&part==='skills')list=[SKILLS[0]];if(c.id==='g5lr1')list=part==='daily'?[DAILY[1]]:part==='seasons'?[SEASONS[2]]:[EVENTS[6]];if(c.id==='g5lr2')list=part==='dates'?[DATES[0]]:part==='pets'?[PETS[0],PETS[5]]:[RULES[3]];return list;}
export const g5Key=(part,i,kind)=>`${part}-${i}-${kind}`;
export function g5Nodes(c,part,i,g,blocked=false){const r=g5Tasks(c,part)[i]||g5Tasks(c,part).at(-1);const n=(kind,npc,help,examples,extra={})=>({key:g5Key(part,i,kind),g5:true,mode:'g5',npc,help,examples,blocked,...extra});const both=(x)=>[x,x.replace(/It is/g,"It's").replace(/He is/g,"He's").replace(/She is/g,"She's").replace(/They are/g,"They're")];
 if(part==='traits')return [n('describe',`What's ${r.pronoun==='He'?'he':'she'} like?`,'根据你刚发现的行为线索，介绍这个人物。',both(`${r.pronoun} is ${r.word}.`))];
 if(part==='week'){const weekend=['Saturday','Sunday'].includes(r.day);return [n('plan',weekend?'What do you do on the weekend?':`What do you have on ${r.day}s?`,'先配好本日全部课程或活动，再用完整句子报告。',[weekend?`I often ${r.subjects.join(' and ')} on ${r.day}s.`:`I have ${r.subjects.join(', ').replace(/, ([^,]*)$/,' and $1')} on ${r.day}s.`]),...(r.day==='Saturday'?[n('often','Do you often read books on Saturdays?','根据这张日程，回答是否经常看书。',['Yes, I do.'])]:[])];}
 if(part==='meals')return [n('eat','What would you like to eat?','按这位客人的便签，扮演客人点餐。',[`I'd like ${['sandwich','hamburger'].includes(r.food)?'a':'some'} ${r.food}, please.`]),n('drink','What would you like to drink?','餐盘和饮品要与订单一致。',[`I'd like some ${r.drink}, please.`]),n('taste',"What's your favourite food?",'说出本单最喜爱的食物，并描述便签里的口味。',[`My favourite food is ${r.food}. It is ${r.taste}.`])];
 if(part==='skills')return [n('can','What can you do for the party?','先亲手完成这个才艺挑战，再介绍刚获得的本领。',[`I can ${r.word}.`]),...(i===g5Tasks(c,part).length-1?[n('robin','Can Robin swim?','教材中的 Robin 不会游泳；用否定完整回答。',["No, he can't.","No, he cannot."])]:[])];
 if(part==='room')return [n('place',`Where is the ${r.word}?`,'物品必须摆到任务要求的位置，英语要和实际布置一致。',[`The ${r.word} is ${r.phrase}.`,`It is ${r.phrase}.`,`It's ${r.phrase}.`]),...(i===g5Tasks(c,part).length-1?[n('bed','What is in your room?','介绍房间中的一张大床。',['There is a big bed.']),n('pictures','How many pictures are there?','把两幅 picture 放到画框区，再用 there are 描述。',['There are two pictures in my room.','There are two pictures.'])]:[])];
 if(part==='park')return [n('survey',`${r.plural?'Are there any':'Is there a'} ${r.word} ${r.word==='river'?'in the forest':'in the park'}?`,'走近调查点；森林内没有河，桥下的水在森林外。按调查区域的景物回答。',[r.present?`Yes, there ${r.plural?'are':'is'}.`:`No, there ${r.plural?"aren't":"isn't"}.`,...(r.present?[]:[`No, there ${r.plural?'are':'is'} not.`])])];
 if(part==='daily')return [n('time',`When do you ${r.word}?`,'时钟和活动正确后，再用 at 报告时间。',[`I ${r.word} at ${['zero','one','two','three','four','five','six','seven','eight','nine'][r.hour]} o'clock.`,`I usually ${r.word} at ${r.hour} o'clock.`]),...(i===g5Tasks(c,part).length-1&&!g5Final(c)?[n('weekend','What do you do on the weekend?','先完成四项周末活动，再说一项你常做的事。',WEEKEND.map(w=>`I often ${w.word} on the weekend.`))]:[])];
 if(part==='seasons'){const fav=SEASONS.find(x=>x.word===g.favorite)||r;return [n('season','Which season do you like best?','完成活动后，点击选择你最喜欢的季节。',[`I like ${fav.word} best.`],{blocked:blocked||!g.favorite}),n('reason','Why?','用 because 解释你刚才选的季节。',[`Because I can ${fav.activity}.`,`I like ${fav.word} best because I can ${fav.activity}.`],{blocked:blocked||!g.favorite})];}
 if(part==='calendar')return [n('month',`When is ${r.word==='school trip'?'the trip this year':r.word==='English party'?'the party':'the '+r.word.toLowerCase()}?`,'把活动放进正确月份，使用 in 回答。',[`It is in ${r.month}.`,`It's in ${r.month}.`]),...(r.word==='school trip'?[n('trip','What will you do on the school trip?','岛上计划去长城；用 we will 或 we’ll 说计划。',["We'll go to the Great Wall.",'We will go to the Great Wall.'])]:[])];
 if(part==='dates')return [n('date',`When is ${r.word.includes('birthday')?r.word:'the '+r.word}?`,'选择正确月份和序数日后，用 on 报告具体日期。',[`It is on ${r.month} ${ORDINALS[r.day]}.`,`It's on ${r.month} ${ORDINALS[r.day]}.`])];
 if(part==='pets'){const owners=g5Final(c)?OWNERS.filter(o=>['mine','hers'].includes(o.word)):OWNERS;return [...(i===0?owners.map(o=>n('owner-'+o.word,`Whose ${o.item} is it?`,'先按主人标签归还失物，再用名词性物主代词回答。',[`It is ${o.word}.`,`It's ${o.word}.`],{owner:o.word})):[]),n('doing',`What is the ${r.word==='climbing'?'monkey':r.word==='jumping'?'rabbit':'dog'} doing?`,'先送上正确的照护道具，再观察画面里的动作。',[`It is ${r.word}.`,`It's ${r.word}.`]),...(i===0?[n('negative','Is he drinking water?','现在画面是在吃饭，否定后说出真实动作。',["No, he isn't. He is eating.","No, he isn't. He's eating.",'No, he is not. He is eating.'])]:[])];}
 if(part==='rules')return [n('rule','What should we do here?','先做到本关规则，再用英语提醒大家。',[r.word,r.word.replace('.',' please.')]),n('doing','What are they doing?','活动牌代表本展台的同伴，使用 they are 报告正在进行的动作。',[`They are ${r.activity}.`,`They're ${r.activity}.`])];
 return [];
}
export function grade5Dialogue(c,s){const g=s.g5,part=g5Part(c,g),i=Math.min(g.round,g5Tasks(c,part).length-1);let blocked=false;const r=g5Tasks(c,part)[i];
 if(part==='traits')blocked=!g.seen.includes(r.word)||g.choice!==r.word;
 if(part==='week')blocked=!r.subjects.every(w=>g.schedule[r.day]?.includes(w))||g.schedule[r.day]?.length!==r.subjects.length;
 if(part==='meals')blocked=g.food!==r.food||g.drink!==r.drink;
 if(part==='skills')blocked=g.combo.length!==r.sequence.length;
 if(part==='room')blocked=g.room[r.word]!==r.zone;
 if(part==='park')blocked=!g.bridge.includes('west')||!g.bridge.includes('east')||!g.survey.includes(r.word);
 if(part==='daily')blocked=g.hour!==r.hour||g.activity!==r.word;
 if(part==='seasons')blocked=!r.pieces.every(p=>g.seasonPieces[r.word]?.includes(p));
 if(part==='calendar')blocked=g.month!==r.month||g.calendar[r.word]!==r.month;
 if(part==='dates')blocked=g.month!==r.month||g.date!==r.day||g.invitation!==r.word;
 if(part==='pets')blocked=g.pet!==r.word;
 if(part==='rules')blocked=!g.ruleDone.includes(r.word);
 const nodes=g5Nodes(c,part,i,g,blocked);for(const n of nodes){if(n.owner)n.blocked=!g.returned.includes(n.owner);if(n.key.endsWith('-pictures'))n.blocked=g.pictures!==2;if(n.key.endsWith('-weekend'))n.blocked=!WEEKEND.every(w=>g.weekend.includes(w.word));if(!s.talks[n.key])return n;}return nodes.at(-1);
}
export const normalizeG5=raw=>String(raw||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[-–]/g,' ').replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ').trim();
export function interpretGrade5Speech(raw,n){if(!n)return {ok:false,reason:'暂时没有对话任务。'};if(n.blocked)return {ok:false,reason:'先完成本轮场景操作，再观察结果开口报告。'};let text=normalizeG5(raw).replace(/^their (?=(?:doing|reading|listening|having|eating))/,"they're ");
 for(const [digit,word] of Object.entries(ORDINALS))text=text.replace(new RegExp(`\\b${digit}(?:st|nd|rd|th)\\b`,'g'),normalizeG5(word));
 const convert=t=>t.replace(/\b[1-9]\b/g,m=>['zero','one','two','three','four','five','six','seven','eight','nine'][Number(m)]).replace(/\bi would like\b/g,"i'd like").replace(/\bmy favorite\b/g,'my favourite').replace(/\bcan not\b/g,'cannot');
 if(n.examples.some(x=>convert(normalizeG5(x))===convert(text)))return {ok:true,value:n.key,reply:'Great! Your report matches the scene.'};
 return {ok:false,reason:'用完整句子说出你的发现。人物、位置、时间和动作都要符合画面；点“看说法”可以听示范。'};
}
export function grade5Audio(){const all=['Great!','Great! Your report matches the scene.',...Object.values(G5_PATTERN_EXAMPLES),...TRAITS.map(x=>x.who),...SUBJECTS,...SKILLS.flatMap(x=>x.buttons),...ROOM.flatMap(x=>[x.zone,x.phrase]),...SURVEY.map(x=>x.word),...PETS.map(x=>x.prop),...OWNERS.flatMap(x=>[x.item,`${x.item}. ${x.word}.`]),...Array.from({length:12},(_,i)=>`${i+1} o'clock`),'quiet','loud','left','right','Amy','Mike','me','bridge','west','east','picnic','snowball','food bowl'];for(const c of GRADE5_CHAPTERS){const parts=g5Final(c)?[0,1,2].map(stage=>g5Part(c,{stage})): [g5Part(c,{stage:0})];for(const part of parts)g5Tasks(c,part).forEach((r,i)=>{for(const favorite of (part==='seasons'?SEASONS.map(s=>s.word):[null]))for(const n of g5Nodes(c,part,i,{favorite})){all.push(n.npc,...n.examples);}});}return [...new Set(all)];}
