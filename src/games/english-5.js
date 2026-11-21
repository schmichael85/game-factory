/* Block World – English for Hebrew speakers, grade 5 */
const GAME={id:'blockEnglish5',title:'עולם האנגלית',subject:'אנגלית כיתה ה׳',home:'../',
  tagline:'בחר משחק, אסוף כוכבים ויהלומים ותהיה אלוף האנגלית! (לחצו 🔊 כדי לשמוע)',
  modes:[{key:'spell',name:'שולחן האיות',icon:'🔨',desc:'שומעים מילה באנגלית ובונים אותה מקוביות של אותיות.',prefix:'s-',max:18,open:()=>spellSel()}],
  spellTopic:'voc',spellExtra:lv=>lv<2?0:lv<4?1:2};

const TOPICS={voc:{name:'אוצר מילים',world:'יער המילים',icon:'🌳',c:'#4f9a3a'},
  gram:{name:'דקדוק',world:'מגדל הדקדוק',icon:'🏰',c:'#7d7d7d'},
  read:{name:'קריאה והבנה',world:'כפר הסיפורים',icon:'📖',c:'#b5651d'}};
const TYPES={
 v_pic:['voc','מה רואים בתמונה',1],
 v_en2he:['voc','תרגום מאנגלית לעברית',1],
 v_he2en:['voc','תרגום מעברית לאנגלית',1],
 v_listen:['voc','הבנת הנשמע – מילים',2],
 v_cat:['voc','מילה שלא שייכת לקבוצה',2],
 v_opposite:['voc','הפכים',3],
 g_be:['gram','am / is / are',1],
 g_a_an:['gram','a / an',1],
 g_pron:['gram','he / she / it / they',1],
 g_have:['gram','have / has',2],
 g_there:['gram','there is / there are',2],
 g_plural:['gram','רבים (cats, boxes, babies)',2],
 g_present:['gram','הווה פשוט (plays / play)',2],
 g_prep:['gram','מילות יחס (in / on / under)',2],
 g_past:['gram','עבר פשוט (went, played)',3],
 g_qword:['gram','מילות שאלה (What, Where…)',3],
 r_fill:['read','השלמת משפט',1],
 r_order:['read','סדר מילים במשפט',2],
 r_translate:['read','הבנת משפט',2],
 r_story:['read','הבנת סיפור קצר',3],
 spell:['voc','איות (שולחן האיות)',1]
};

/* ---------- helpers ---------- */
const enOpts=(c,wrongs)=>{const o=txtOpts(c,wrongs);o.opts=o.opts.map(EN);return o};
const S_=s=>`<div class="ensent" lang="en">${s.replace('___','<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>')}</div>`;   /* English sentence with a blank */
const withEmoji=VOCAB.filter(w=>w.e&&w.cat!=='colors');
const ADJ=[['big','גדול','small','קטן'],['hot','חם','cold','קר'],['happy','שמח','sad','עצוב'],['fast','מהיר','slow','איטי'],['old','ישן','new','חדש'],['long','ארוך','short','קצר'],
  ['good','טוב','bad','רע'],['clean','נקי','dirty','מלוכלך'],['full','מלא','empty','ריק'],['easy','קל','difficult','קשה'],['strong','חזק','weak','חלש'],['early','מוקדם','late','מאוחר'],['wet','רטוב','dry','יבש'],['loud','רועש','quiet','שקט'],['rich','עשיר','poor','עני']];

const G={
v_pic(d){const w=pick(withEmoji);return{text:'מה זה באנגלית?',svg:`<div class="emo">${w.e}</div>`,...enOpts(w.en,vOthers(w).map(x=>x.en)),sayAfter:w.en,
  exp:`${w.e} זה ${EN('<b>'+w.en+'</b>')} – ${w.he}. ${sayBtn(w.en)}`}},
v_en2he(d){const pool=d===1?VOCAB.filter(w=>!['verbs'].includes(w.cat)):VOCAB;const w=pick(pool);
  return{text:`מה פירוש המילה ${EN('<b>'+w.en+'</b>')}?`,say:w.en,...txtOpts(w.he,vOthers(w).map(x=>x.he)),exp:`${EN(w.en)} = <b>${w.he}</b> ${w.e||''}`}},
v_he2en(d){const w=pick(VOCAB);return{text:`איך אומרים באנגלית: <b>${w.he}</b>?`,...enOpts(w.en,vOthers(w).map(x=>x.en)),sayAfter:w.en,
  exp:`${w.he} = ${EN('<b>'+w.en+'</b>')} ${sayBtn(w.en)}`}},
v_listen(d){const w=pick(VOCAB.filter(x=>!x.en.includes(' ')));
  const sim=VOCAB.filter(x=>x.en!==w.en&&!x.en.includes(' ')&&(x.en[0]===w.en[0]||Math.abs(x.en.length-w.en.length)<=1));
  const wr=shuffle(sim).slice(0,3).map(x=>x.en);while(wr.length<3){const x=pick(VOCAB).en;if(x!==w.en&&!wr.includes(x))wr.push(x)}
  return{text:'🎧 הקשיבו ובחרו את המילה ששמעתם:',say:w.en,...enOpts(w.en,wr),exp:`שמעתם ${EN('<b>'+w.en+'</b>')} (${w.he}). ${sayBtn(w.en)}`}},
v_cat(d){const cats=Object.keys(CATS).filter(c=>c!=='colors'||d>=2);const c1=pick(cats);let c2;do{c2=pick(cats)}while(c2===c1);
  const three=shuffle(VOCAB.filter(w=>w.cat===c1)).slice(0,3),odd=pick(VOCAB.filter(w=>w.cat===c2));
  return{text:'איזו מילה <b>לא שייכת</b> לקבוצה?',...enOpts(odd.en,three.map(x=>x.en)),
   exp:`${three.map(x=>EN(x.en)).join(', ')} – כולן ${CATS[c1]}. אבל ${EN('<b>'+odd.en+'</b>')} (${odd.he}) שייכת ל${CATS[c2]}.`}},
v_opposite(d){const p=pick(ADJ),flip=Math.random()<.5;const[a,ah,b,bh]=flip?[p[2],p[3],p[0],p[1]]:p;
  const wr=shuffle(ADJ.filter(x=>x!==p)).slice(0,3).map(x=>pick([x[0],x[2]]));
  return{text:`מה ההפך של ${EN('<b>'+a+'</b>')} (${ah})?`,say:a,...enOpts(b,wr),exp:`ההפך של ${EN(a)} (${ah}) הוא ${EN('<b>'+b+'</b>')} (${bh}).`}},

g_be(d){const subj=pick([['I','am'],['You','are'],['We','are'],['They','are'],['He','is'],['She','is'],['It','is'],['My mother','is'],['The dog','is'],['Tom and Dana','are'],['My friends','are']]);
  const rest=pick(['happy','at home','in the park','hungry','tired','at school','ten years old']);
  return{text:`השלימו: ${S_(`${subj[0]} ___ ${rest}.`)}`,...enOpts(subj[1],['am','is','are']),cls:'three',
   exp:`${EN('I')} → ${EN('am')} · ${EN('he / she / it')} (ואחד) → ${EN('is')} · ${EN('you / we / they')} (ורבים) → ${EN('are')}. לכן: ${EN(`${subj[0]} <b>${subj[1]}</b> ${rest}.`)}`}},
g_a_an(d){const vow=['apple','egg','elephant','orange','ice cream','umbrella','owl','ant','eye','octopus'],con=['dog','banana','book','cat','car','house','pencil','tree','bag','horse'];
  const isV=Math.random()<.5,w=pick(isV?vow:con),c=isV?'an':'a';
  return{text:`השלימו: ${S_(`I have ___ ${w}.`)}`,say:w,...enOpts(c,[isV?'a':'an']),exp:`לפני מילה שמתחילה ב<b>צליל של תנועה</b> (a, e, i, o, u) כותבים ${EN('an')}. אחרת – ${EN('a')}. לכן: ${EN(`${c} ${w}`)}.`}},
g_pron(d){const t=pick([['Dana is my sister.','is ten.','She'],['Yoni is my brother.','likes football.','He'],['I have a dog.','is very big.','It'],['Tom and Noa are my friends.','live near me.','They'],['My father is a doctor.','works in a hospital.','He'],['My grandmother is old.','tells good stories.','She'],['I love my cat.','sleeps on my bed.','It'],['The children are in the park.','are playing.','They']]);
  return{text:`השלימו: ${S_(`${t[0]} ___ ${t[1]}`)}`,...enOpts(t[2],['He','She','It','They']),
   exp:`${EN('He')} = הוא (בן) · ${EN('She')} = היא (בת) · ${EN('It')} = זה (חיה או חפץ) · ${EN('They')} = הם/הן (רבים).`}},
g_have(d){const s=pick([['I','have'],['You','have'],['We','have'],['They','have'],['She','has'],['He','has'],['My brother','has'],['The cat','has'],['Dana','has']]);
  const o=pick(['a red bike','two cats','a big house','many books','a new phone','blue eyes']);
  return{text:`השלימו: ${S_(`${s[0]} ___ ${o}.`)}`,...enOpts(s[1],['have','has']),exp:`${EN('he / she / it')} ושם של אחד → ${EN('has')}. כל השאר (${EN('I, you, we, they')}) → ${EN('have')}.`}},
g_there(d){const pl=Math.random()<.5;const n=pick(['three','two','five','many']);const it=pl?pick([`${n} cats`,`${n} books`,`${n} trees`,`${n} children`]):pick(['a cat','a book','a tree','one apple','a big table']);
  const place=pick(['in the garden','on the table','in my room','in the park','in the box']);
  return{text:`השלימו: ${S_(`There ___ ${it} ${place}.`)}`,...enOpts(pl?'are':'is',['is','are']),exp:`${EN('There is')} = יש (אחד). ${EN('There are')} = יש (הרבה). ${EN(it)} – ${pl?'רבים':'אחד'}.`}},
g_plural(d){const reg=[['cat','cats'],['book','books'],['dog','dogs'],['tree','trees'],['apple','apples']],es=[['box','boxes'],['bus','buses'],['watch','watches'],['dish','dishes'],['tomato','tomatoes']],ies=[['baby','babies'],['story','stories'],['city','cities'],['party','parties']],irr=[['child','children'],['man','men'],['woman','women'],['mouse','mice'],['foot','feet'],['tooth','teeth'],['sheep','sheep'],['fish','fish']];
  const p=pick(d===2?[...reg,...es,...ies]:[...es,...ies,...irr,...irr]);const[s,pl]=p;
  const cands=[s+'s',s+'es',s.replace(/y$/,'ies'),s+'ies',s+'en',s];
  return{text:`מה הרבים של ${EN('<b>'+s+'</b>')}?`,say:s,...enOpts(pl,cands.filter(x=>x!==pl)),sayAfter:pl,
   exp:irr.some(x=>x[0]===s)?`זו מילה יוצאת דופן – צריך לזכור: ${EN(`${s} → <b>${pl}</b>`)}.`:es.some(x=>x[0]===s)?`מילים שנגמרות ב־${EN('s, x, ch, sh, o')} מקבלות ${EN('es')}: ${EN(`${s} → <b>${pl}</b>`)}.`:ies.some(x=>x[0]===s)?`עיצור ואחריו ${EN('y')} – מחליפים ל־${EN('ies')}: ${EN(`${s} → <b>${pl}</b>`)}.`:`בדרך כלל פשוט מוסיפים ${EN('s')}: ${EN(`${s} → <b>${pl}</b>`)}.`}},
g_present(d){const v=pick([['play','plays','football'],['read','reads','a book'],['eat','eats','an apple'],['watch','watches','TV'],['go','goes','to school'],['drink','drinks','milk'],['swim','swims','in the sea'],['like','likes','pizza']]);
  const he=Math.random()<.5;const subj=he?pick(['He','She','My sister','Tom','The boy']):pick(['I','We','They','You','My friends']);
  const c=he?v[1]:v[0];
  return{text:`השלימו: ${S_(`${subj} ___ ${v[2]} every day.`)}`,...enOpts(c,[v[0],v[1],v[0]+'ing'].filter(x=>x!==c)),cls:'three',
   exp:`בהווה פשוט, אחרי ${EN('he / she / it')} (או שם של אחד) מוסיפים ${EN('s')} לפועל: ${EN(`She ${v[1]}`)}. אחרי ${EN('I, you, we, they')} – בלי ${EN('s')}: ${EN(`I ${v[0]}`)}.`}},
g_prep(d){const p=pick([['in','בתוך'],['on','על'],['under','מתחת ל'],['next to','ליד']]);const [obj,objE]=pick([['קופסה','the box'],['שולחן','the table'],['מיטה','the bed'],['כיסא','the chair']]);
  const an=pick([['החתול','The cat'],['הכדור','The ball'],['הכלב','The dog'],['הספר','The book']]);
  const heP=p[0]==='under'?'מתחת ל':p[1]+' ';const heObj=p[0]==='under'?obj:'ה'+obj;
  return{text:`${an[0]} <b>${heP}${heObj}</b>. השלימו: ${S_(`${an[1]} is ___ ${objE}.`)}`,...enOpts(p[0],['in','on','under','next to'].filter(x=>x!==p[0])),
   exp:`${EN('in')} = בתוך · ${EN('on')} = על · ${EN('under')} = מתחת ל · ${EN('next to')} = ליד.`}},
g_past(d){const v=pick([['go','went'],['eat','ate'],['see','saw'],['play','played'],['watch','watched'],['buy','bought'],['swim','swam'],['write','wrote'],['drink','drank'],['visit','visited'],['jump','jumped'],['have','had']]);
  const obj={go:'to the park',eat:'a pizza',see:'a big dog',play:'football',watch:'a movie',buy:'new shoes',swim:'in the sea',write:'a letter',drink:'orange juice',visit:'my grandmother',jump:'into the pool',have:'a party'}[v[0]];
  const subj=pick(['I','We','My brother','They','She']);
  const third=v[0]==='have'?'has':v[0]==='go'?'goes':/(ch|sh|s)$/.test(v[0])?v[0]+'es':v[0]+'s';
  const wr=[v[0],third,v[0]+(v[0].endsWith('e')?'d':'ed')].filter(x=>x!==v[1]);
  return{text:`השלימו: ${S_(`Yesterday ${subj} ___ ${obj}.`)}`,...enOpts(v[1],wr),
   exp:`${EN('Yesterday')} = אתמול, ולכן צריך עבר. ${['play','watch','visit','jump'].includes(v[0])?`פועל רגיל – מוסיפים ${EN('ed')}`:'פועל יוצא דופן – צריך לזכור'}: ${EN(`${v[0]} → <b>${v[1]}</b>`)}.`}},
g_qword(d){const q=pick([['What','is your name?','מה'],['Where','do you live?','איפה'],['Who','is your teacher?','מי'],['When','is your birthday?','מתי'],['How','old are you?','איך / כמה'],['What','color is the sky?','מה'],['Where','is my bag?','איפה'],['Who','is that boy?','מי']]);
  return{text:`השלימו: ${S_(`___ ${q[1]}`)}`,...enOpts(q[0],['What','Where','Who','When','How'].filter(x=>x!==q[0])),
   exp:`${EN('What')} = מה · ${EN('Where')} = איפה · ${EN('Who')} = מי · ${EN('When')} = מתי · ${EN('How')} = איך (${EN('How old')} = בן כמה). כאן: ${EN('<b>'+q[0]+'</b> '+q[1])}`}},

r_fill(d){const t=pick([['I drink ___ in the morning.','milk',['shoes','chair','pencil']],['The ___ is in the sky.','sun',['table','dog','bread']],['I read a ___ every night.','book',['car','apple','door']],['I wash my hands with ___.','water',['cake','hat','bus']],['My dog likes to ___ in the garden.','run',['read','write','cook']],['It is cold. Put on your ___.','coat',['pizza','ruler','fish']],['I write with a ___.','pencil',['banana','bed','tree']],['We sleep in a ___.','bed',['bus','cake','book']],['The ___ is yellow and long.','banana',['tomato','grapes','milk']],['Fish live in the ___.','sea',['sky','bed','shop']],['I can see with my ___.','eyes',['ears','feet','hands']],['A ___ can fly.','bird',['cow','fish','snake']],['We buy food at the ___.','shop',['sea','school','moon']],['It is raining. Take an ___.','umbrella',['apple','egg','orange']],['In winter it is ___.','cold',['hot','happy','fast']]]);
  return{text:`השלימו את המשפט: ${S_(t[0])}`,...enOpts(t[1],t[2]),sayAfter:t[0].replace('___',t[1]),exp:`${EN(t[0].replace('___','<b>'+t[1]+'</b>'))}`}},
r_order(d){const s=pick(['I like to play football.','My sister has a red bike.','We go to school every day.','The cat is on the table.','Dana lives in a big house.','They are in the park.','My father can swim fast.','I have two brothers.','The dog is under the bed.','We eat lunch at home.']);
  const w=s.replace('.','').split(' ');const bad=new Set();let g=0;while(bad.size<3&&g++<50){const x=shuffle(w);x[0]=x[0][0].toUpperCase()+x[0].slice(1);const t=x.join(' ')+'.';if(t!==s)bad.add(t)}
  return{text:'איזה משפט כתוב <b>בסדר הנכון</b>?',...enOpts(s,[...bad]),sayAfter:s,exp:`הסדר באנגלית: מי (נושא) → פועל → השאר. ${EN('<b>'+s+'</b>')}`}},
r_translate(d){const t=pick([['I am hungry.','אני רעב.',['אני עייף.','אני שמח.','אני בבית.']],['Where is my bag?','איפה התיק שלי?',['מה יש בתיק?','זה התיק שלי.','מי לקח את התיק?']],['The dog is sleeping.','הכלב ישן.',['הכלב אוכל.','הכלב רץ.','החתול ישן.']],['I like ice cream.','אני אוהב גלידה.',['אני קונה גלידה.','אני לא אוהב גלידה.','אני אוכל עוגה.']],['My brother is tall.','אחי גבוה.',['אחותי גבוהה.','אחי נמוך.','אבא שלי גבוה.']],['Can you help me?','אתה יכול לעזור לי?',['אני יכול לעזור לך.','אתה רוצה לשחק?','איפה אתה?']],['It is a hot day.','זה יום חם.',['זה יום קר.','זה לילה חם.','היום יורד גשם.']],['We play in the park.','אנחנו משחקים בפארק.',['אנחנו הולכים לבית הספר.','הם משחקים בפארק.','אנחנו בבית.']],['She has a new phone.','יש לה טלפון חדש.',['יש לו טלפון ישן.','היא רוצה טלפון.','יש לה מחשב חדש.']],['The book is on the table.','הספר על השולחן.',['הספר מתחת לשולחן.','העיפרון על השולחן.','הספר בתיק.']]]);
  return{text:`מה פירוש המשפט? ${EN('<b>'+t[0]+'</b>')}`,say:t[0],...txtOpts(t[1],t[2]),exp:`${EN(t[0])} = <b>${t[1]}</b>`}},
r_story(d){const st=pick(STORIES);const q=pick(st.q);
  return{text:`קראו את הסיפור וענו על השאלה:<div class="story">${st.t}</div><div style="margin-top:6px">${EN('<b>'+q[0]+'</b>')}</div>`,say:'',...enOpts(q[1],q[2]),exp:`התשובה בסיפור: ${EN(q[1])}.`}}
};
const STORIES=[
 {t:'My name is Tom. I am eleven years old. I live in Haifa with my mother, my father and my little sister, Maya. I have a dog. His name is Max.',
  q:[['How old is Tom?','eleven',['ten','twelve','eight']],['Where does Tom live?','in Haifa',['in Eilat','in London','in a park']],['What is the name of the dog?','Max',['Maya','Tom','Sam']]]},
 {t:'Dana loves animals. Every morning she gives food to her cat and her two birds. After school she walks in the park with her friend Noa.',
  q:[['What does Dana love?','animals',['pizza','books','music']],['How many birds does Dana have?','two',['one','three','five']],['Who walks in the park with Dana?','Noa',['her cat','her mother','Tom']]]},
 {t:'Today is Saturday. It is sunny and hot. The family goes to the beach. The children swim in the sea and eat ice cream. Dad sleeps under a big umbrella.',
  q:[['What day is it?','Saturday',['Sunday','Monday','Friday']],['Where does the family go?','to the beach',['to school','to the park','to the shop']],['What does Dad do?','he sleeps',['he swims','he eats ice cream','he reads']]]},
 {t:'Ben has a new bike. It is red and fast. Every day he rides his bike to school. Yesterday it rained, so he went to school by bus.',
  q:[['What color is the bike?','red',['blue','green','black']],['How does Ben go to school every day?','by bike',['by bus','by car','on foot']],['Why did Ben take the bus yesterday?','it rained',['it was hot','his bike was broken','he was late']]]},
 {t:'Mia is in the kitchen with her grandmother. They are making a chocolate cake. Mia puts eggs, milk and chocolate in a big bowl. The cake is ready at five o\'clock.',
  q:[['Where is Mia?','in the kitchen',['in the garden','at school','in her room']],['What are they making?','a chocolate cake',['a pizza','a salad','cookies']],['When is the cake ready?','at five o\'clock',['at three o\'clock','in the morning','at night']]]},
 {t:'The zoo is big. There are lions, monkeys and two elephants. The monkeys are funny – they jump and play all day. Omer\'s favorite animal is the giraffe because it is very tall.',
  q:[['How many elephants are there?','two',['one','three','many']],['What do the monkeys do?','jump and play',['sleep all day','swim','eat ice cream']],['What is Omer\'s favorite animal?','the giraffe',['the lion','the monkey','the elephant']]]}];

/* ---------- spelling levels (6 words each, getting longer) ---------- */
GAME.spell=[['cat','dog','sun','egg','hat','bus'],['fish','book','milk','tree','frog','cake'],['apple','horse','bread','chair','water','mouse'],['school','pencil','orange','banana','flower','monkey'],['kitchen','chicken','rabbit','turtle','sister','window'],['elephant','computer','giraffe','mountain','teacher','homework']].map(L=>L.map(vw));
