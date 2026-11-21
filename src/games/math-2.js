/* Block World – Math (חשבון), grade 2 */
const GAME={id:'blockMath2',title:'עולם המספרים',subject:'חשבון כיתה ב׳',home:'../',
  tagline:'בחר משחק, אסוף כוכבים ויהלומים ותהיה אלוף החשבון!',arcadeTime:90,arcadeStars:[5,8,12],wrongPenalty:2,
  modes:[{key:'tens',name:'בונים מספרים',icon:'🧱',desc:'בונים מספרים ממוטות של עשרות ומקוביות של אחדות.',prefix:'t-',max:36,open:()=>tens(firstOpen(TENS.length,'t-'))}]};

const TOPICS={add:{name:'חיבור וחיסור',world:'מכרה החיבור',icon:'➕',c:'#7d7d7d'},
  num:{name:'מספרים עד 100',world:'יער המספרים',icon:'🔢',c:'#4f9a3a'},
  mul:{name:'כפל וחילוק',world:'כפר הקבוצות',icon:'✖️',c:'#b5651d'}};
const TYPES={
 a_add20:['add','חיבור עד 20',1],
 a_sub20:['add','חיסור עד 20',1],
 a_add100:['add','חיבור עד 100 (בלי המרה)',2],
 a_sub100:['add','חיסור עד 100 (בלי פריטה)',2],
 a_missing:['add','מספר חסר בתרגיל',2],
 a_carry:['add','חיבור וחיסור עם המרה',3],
 a_word:['add','בעיות מילוליות',3],
 n_blocks:['num','עשרות ואחדות בציור',1],
 n_compare:['num','השוואת מספרים',1],
 n_neigh:['num','לפני ואחרי',1],
 n_skip:['num','סדרות (קפיצות של 2, 5, 10)',2],
 n_even:['num','זוגי ואי־זוגי',2],
 n_place:['num','כמה עשרות וכמה אחדות',2],
 n_build:['num','הרכבת מספרים',3],
 m_groups:['mul','קבוצות שוות',1],
 m_double:['mul','כפול וחצי',2],
 m_table:['mul','לוח הכפל',2],
 m_share:['mul','חילוק לחלקים שווים',3],
 tens:['num','בונים מספרים',1]
};
const FRUIT=['🍎','🍌','🍓','⭐','🐟','🧁','⚽','🌸'];
function groupsHtml(g,n,e){let h='<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:8px 0">';
  for(let i=0;i<g;i++)h+=`<div style="border:3px dashed #8a5a32;padding:6px 8px;font-size:28px;max-width:150px;background:#fffdf3">${e.repeat(n)}</div>`;return h+'</div>'}
/* tens rods + unit cubes */
function tensSvg(t,o){const u=13;let s='';for(let i=0;i<t;i++){const x=12+i*26;for(let j=0;j<10;j++)s+=`<rect x="${x}" y="${10+j*u}" width="${u+4}" height="${u}" fill="#4aa3df" stroke="#1d4f7a" stroke-width="1.5"/>`}
  for(let j=0;j<o;j++){const x=12+t*26+12+(j%3)*20,y=10+Math.floor(j/3)*20;s+=`<rect x="${x}" y="${y}" width="16" height="16" fill="#f9d43a" stroke="#7a6a2a" stroke-width="1.5"/>`}
  const W=Math.max(200,12+t*26+12+3*20+10);return`<svg class="fig" viewBox="0 0 ${W} 150" style="max-width:${Math.min(440,W*1.6)}px">${s}</svg>`}
const he10=['','עשרת אחת','2 עשרות','3 עשרות','4 עשרות','5 עשרות','6 עשרות','7 עשרות','8 עשרות','9 עשרות'];

const G={
a_add20(d){const a=R(1,12),b=R(1,20-a);return{text:M(`${a} + ${b} = ?`),...numOpts(a+b,[a+b+1,a+b-1,Math.abs(a-b)||a+b+2]),exp:`${M(`${a} + ${b} = ${a+b}`)}. טיפ: מתחילים מהמספר הגדול וסופרים קדימה ${Math.min(a,b)}.`}},
a_sub20(d){const a=R(5,20),b=R(1,a-1);return{text:M(`${a} − ${b} = ?`),...numOpts(a-b,[a-b+1,a-b-1,a+b]),exp:`${M(`${a} − ${b} = ${a-b}`)}. טיפ: אפשר לבדוק בחיבור: ${M(`${a-b} + ${b} = ${a}`)}.`}},
a_add100(d){let a,b;do{a=R(10,80);b=R(1,99-a)}while(a%10+b%10>9);return{text:M(`${a} + ${b} = ?`),...numOpts(a+b,[a+b+10,a+b-10,a+b+1]),exp:`עשרות עם עשרות ואחדות עם אחדות: ${M(`${a-a%10} + ${b-b%10} = ${a-a%10+b-b%10}`)}, ${M(`${a%10} + ${b%10} = ${a%10+b%10}`)}. ביחד ${a+b}.`}},
a_sub100(d){let a,b;do{a=R(20,99);b=R(1,a-1)}while(b%10>a%10);return{text:M(`${a} − ${b} = ?`),...numOpts(a-b,[a-b+10,a-b-10,a-b+1].filter(x=>x>=0)),exp:`עשרות מעשרות ואחדות מאחדות: ${M(`${a-a%10} − ${b-b%10} = ${a-a%10-(b-b%10)}`)}, ${M(`${a%10} − ${b%10} = ${a%10-b%10}`)}. ביחד ${a-b}.`}},
a_missing(d){const a=R(2,d===2?10:40),c=a+R(2,d===2?10:40);const sub=Math.random()<.5;
  if(sub)return{text:M(`${c} − ? = ${a}`),...numOpts(c-a,[c+a,c-a+1,c-a-1].filter(x=>x>0)),exp:`כמה צריך להוריד מ־${c} כדי להגיע ל־${a}? ${M(`${c} − ${a} = ${c-a}`)}.`};
  return{text:M(`${a} + ? = ${c}`),...numOpts(c-a,[c+a,c-a+1,c-a-1].filter(x=>x>0)),exp:`כמה חסר מ־${a} עד ${c}? ${M(`${c} − ${a} = ${c-a}`)}.`}},
a_carry(d){if(Math.random()<.5){let a,b;do{a=R(15,75);b=R(5,99-a)}while(a%10+b%10<10);return{text:M(`${a} + ${b} = ?`),...numOpts(a+b,[a+b-10,a+b+10,a+b+1]),exp:`${M(`${a%10} + ${b%10} = ${a%10+b%10}`)} – זה יותר מ־10, אז עשרת אחת עוברת לעשרות. ${M(`${a} + ${b} = ${a+b}`)}.`}}
  let a,b;do{a=R(30,99);b=R(5,a-10)}while(b%10<=a%10);return{text:M(`${a} − ${b} = ?`),...numOpts(a-b,[a-b+10,a-b-10,Math.abs((a-a%10)-(b-b%10))+Math.abs(a%10-b%10)].filter(x=>x>=0)),exp:`אין מספיק אחדות, אז פורטים עשרת אחת ל־10 אחדות. ${M(`${a} − ${b} = ${a-b}`)}.`}},
a_word(d){const t=R(0,3);
  if(t===0){const a=R(10,40),b=R(5,30);return{text:`לדני היו ${a} גולות. הוא קיבל עוד ${b}. כמה גולות יש לו עכשיו?`,...numOpts(a+b,[a+b+1,Math.abs(a-b),a+b-10]),exp:`קיבל עוד – מחברים: ${M(`${a} + ${b} = ${a+b}`)}.`}}
  if(t===1){const a=R(20,60),b=R(5,a-5);return{text:`בעץ היו ${a} תפוחים. נפלו ${b}. כמה תפוחים נשארו על העץ?`,...numOpts(a-b,[a+b,a-b+1,a-b-1]),exp:`נפלו – מחסרים: ${M(`${a} − ${b} = ${a-b}`)}.`}}
  if(t===2){const a=R(10,40),b=R(a+3,a+30);return{text:`לנועה ${a} מדבקות ולתום ${b} מדבקות. כמה מדבקות יש לתום <b>יותר</b> מלנועה?`,...numOpts(b-a,[a+b,b-a+1,b-a-1]),exp:`מחפשים את ההפרש: ${M(`${b} − ${a} = ${b-a}`)}.`}}
  const a=R(5,20),b=R(5,20),c=R(5,20);return{text:`בכיתה ${a} בנים ו־${b} בנות. הצטרפו עוד ${c} ילדים. כמה ילדים בכיתה עכשיו?`,...numOpts(a+b+c,[a+b,a+b+c+1,a+b+c-10]),exp:`${M(`${a} + ${b} + ${c} = ${a+b+c}`)}.`}},

n_blocks(d){const t=R(1,d===1?5:9),o=R(0,9);const n=t*10+o;return{text:'איזה מספר מופיע בציור? (מוט כחול = 10, קובייה צהובה = 1)',svg:tensSvg(t,o),...numOpts(n,[o*10+t,n+10,n-1,n+1].filter(x=>x>0&&x<100)),
  exp:`${t} מוטות = ${t*10}, ועוד ${o} קוביות: ${M(`${t*10} + ${o} = ${n}`)}.`}},
n_compare(d){const a=R(10,99);let b,g=0,mode=d===1?0:R(0,2);
  do{if(g++>20)mode=0;b=mode===0?R(10,99):mode===1?Math.floor(a/10)*10+R(0,9):(a%10)*10+Math.floor(a/10)}while(b===a||b<10);
  return{text:'איזה מספר גדול יותר?',opts:[M(a),M(b)],ans:a>b?0:1,exp:`קודם משווים את העשרות. ${Math.floor(a/10)===Math.floor(b/10)?'העשרות שוות – אז משווים את האחדות.':''} ${M(Math.max(a,b))} גדול יותר.`}},
n_neigh(d){const n=R(11,98);const after=Math.random()<.5;const c=after?n+1:n-1;return{text:`איזה מספר בא <b>${after?'אחרי':'לפני'}</b> ${M(n)}?`,...numOpts(c,[after?n-1:n+1,after?n+10:n-10,c+10].filter(x=>x>0&&x<=100)),exp:`${after?'אחרי':'לפני'} ${n} בא ${c}.`}},
n_skip(d){const st=pick([2,5,10]);let a=R(0,40);a-=a%st;const down=Math.random()<.35;if(down)a+=5*st;const seq=[0,1,2,3].map(i=>down?a-i*st:a+i*st);const c=down?a-4*st:a+4*st;
  return{text:`מה המספר הבא? ${M(seq.join(', ')+', ?')}`,...numOpts(c,[c+1,c-1,down?c-st:c+st].filter(x=>x>=0)),exp:`קופצים ${down?'אחורה':'קדימה'} ב־${st}: ${M(`${seq[3]} ${down?'−':'+'} ${st} = ${c}`)}.`}},
n_even(d){const ev=Math.random()<.5;const par=x=>(x%2===0)===ev;let yes;do{yes=R(10,99)}while(!par(yes));const no=[];while(no.length<3){const x=R(10,99);if(!par(x)&&!no.includes(x))no.push(x)}
  return{text:`איזה מספר הוא <b>${ev?'זוגי':'אי־זוגי'}</b>?`,...numOpts(yes,no),exp:`מסתכלים רק על ספרת האחדות: זוגי נגמר ב־0, 2, 4, 6, 8. אי־זוגי נגמר ב־1, 3, 5, 7, 9.`}},
n_place(d){const n=R(11,99);const askT=Math.random()<.5;const c=askT?Math.floor(n/10):n%10;return{text:`כמה <b>${askT?'עשרות':'אחדות'}</b> יש במספר ${M(n)}?`,...numOpts(c,[askT?n%10:Math.floor(n/10),c+1,c+10,n].filter(x=>x!==c&&x>=0)),
  exp:`במספר ${n}: הספרה השמאלית (${Math.floor(n/10)}) היא העשרות, והספרה הימנית (${n%10}) היא האחדות.`}},
n_build(d){const t=R(2,8),o=R(10,15);const n=t*10+o;return{text:`כמה זה ${t} עשרות ו־${o} אחדות?`,...numOpts(n,[t*10+o%10,Number(`${t}${o}`)%1000,n+10].filter(x=>x<1000)),
  exp:`${o} אחדות = עשרת אחת ועוד ${o-10} אחדות. ביחד: ${M(`${t*10} + ${o} = ${n}`)}.`}},

m_groups(d){const g=R(2,d===1?4:5),n=R(2,5),e=pick(FRUIT);return{text:`כמה ${e} יש בסך הכל?`,svg:groupsHtml(g,n,e),...numOpts(g*n,[g+n,g*n+1,g*n-1,g*(n+1)]),
  exp:`${g} קבוצות, ובכל קבוצה ${n}: ${M(`${Array(g).fill(n).join(' + ')} = ${g*n}`)}, כלומר ${M(`${g} × ${n} = ${g*n}`)}.`}},
m_double(d){const n=R(2,25);if(Math.random()<.5)return{text:`כמה זה <b>פי 2</b> מ־${n}?`,...numOpts(2*n,[n+2,2*n+1,2*n-2]),exp:`פי 2 = לחבר את המספר לעצמו: ${M(`${n} + ${n} = ${2*n}`)}.`};
  const m=2*R(2,25);return{text:`מה <b>חצי</b> של ${m}?`,...numOpts(m/2,[m/2+1,m/2-1,m-2,m*2].filter(x=>x>0)),exp:`חצי = לחלק לשני חלקים שווים: ${M(`${m/2} + ${m/2} = ${m}`)}.`}},
m_table(d){const a=pick(d===2?[2,5,10]:[2,3,4,5,10]),b=R(1,10);return{text:M(`${a} × ${b} = ?`),...numOpts(a*b,[a+b,a*b+a,a*b-a,a*(b+1)].filter(x=>x>0)),
  exp:`${b} פעמים ${a}: ${M(Array(b).fill(a).join(' + ')+' = '+a*b)}.`}},
m_share(d){const k=R(2,5),each=R(2,6),n=k*each,e=pick(FRUIT);return{text:`יש ${n} ${e}. מחלקים אותם שווה בשווה ל־${k} ילדים. כמה יקבל כל ילד?`,svg:`<div class="emo" style="font-size:30px">${e.repeat(n)}</div>`,...numOpts(each,[each+1,each-1,n-k,k].filter(x=>x>0&&x!==each)),
  exp:`${M(`${n} : ${k} = ${each}`)}, כי ${M(`${k} × ${each} = ${n}`)}.`}}
};

/* ---------- TENS & ONES BUILDER ---------- */
const TENS=[{t:'בנו את המספר 23',n:23},{t:'בנו את המספר 40',n:40},{t:'בנו את המספר 57',n:57},{t:'בנו את המספר 18',n:18},
 {t:'בנו מספר שגדול ב־10 מ־35',n:45,h:'10 יותר = עוד מוט אחד של עשרת.'},{t:'בנו את המספר 99',n:99},{t:'בנו את המספר שבא לפני 60',n:59,h:'לפני 60 בא 59: 5 עשרות ו־9 אחדות.'},
 {t:'בנו את המספר הדו־ספרתי הכי קטן',n:10,h:'המספר הדו־ספרתי הכי קטן הוא 10 – עשרת אחת.'},{t:'בנו מספר עם 7 עשרות ו־3 אחדות',n:73},{t:'בנו את המספר שבא אחרי 69',n:70,h:'אחרי 69 בא 70: 7 עשרות ו־0 אחדות.'},
 {t:'בנו את התשובה: 48 + 20',n:68,h:'20 = שני מוטות. 48 ועוד שתי עשרות.'},{t:'בנו את המספר 100',n:100,h:'100 = עשר עשרות!'}];
let TN={};
function tens(mi){setMode('tens');clearTimers();const m=TENS[mi];TN={m:mi,t:0,o:0,tries:0,done:false};
  scr('tens').innerHTML=`<div class="panel"><h2>🧱 בונים מספרים</h2><div class="mis">${levelButtons(TENS.length,'t-',mi)}</div></div>
   <div class="panel"><div class="qtext">משימה ${mi+1}: ${m.t}</div><div class="muted">מוט כחול = 10 (עשרת). קובייה צהובה = 1 (אחד).</div>
   <div id="tnFig"></div><div class="center big" id="tnVal"></div>
   <div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="tP">➕ עשרת</button><button class="btn stone" id="tM">➖ עשרת</button><button class="btn gold" id="oP">➕ אחד</button><button class="btn stone" id="oM">➖ אחד</button></div>
   <div class="row" style="justify-content:center;margin-top:8px"><button class="btn gold" id="tnCheck">✔ בדיקה</button><button class="btn wood" id="tnHint">💡 רמז</button><button class="btn stone" id="tnBack">↩ תפריט</button></div>
   <div class="fb" id="tnfb"></div></div>`;
  $('#scr-tens').querySelectorAll('.lv[data-lv]').forEach(b=>b.onclick=()=>{SND.click();tens(+b.dataset.lv)});
  const ch=(dt,dx)=>{if(TN.done)return;TN.t=Math.max(0,Math.min(10,TN.t+dt));TN.o=Math.max(0,TN.o+dx);
    if(TN.o>9&&TN.t<10){TN.o-=10;TN.t++;$('#tnfb').innerHTML='<div class="good" style="font-size:18px">✨ 10 אחדות = עשרת אחת! החלפנו אותן למוט.</div>'}else if(TN.o>9){TN.o=9}else $('#tnfb').innerHTML='';
    beep(600,.04,'square',.03);drawTens()};
  $('#tP').onclick=()=>ch(1,0);$('#tM').onclick=()=>ch(-1,0);$('#oP').onclick=()=>ch(0,1);$('#oM').onclick=()=>ch(0,-1);
  $('#tnCheck').onclick=tensCheck;$('#tnBack').onclick=menu;
  $('#tnHint').onclick=()=>{const n=m.n;$('#tnfb').innerHTML=`<div class="bad">💡 ${m.h?m.h+' ':''}${n===100?'':`${n} = ${Math.floor(n/10)} עשרות ו־${n%10} אחדות.`}</div>`};
  drawTens();show('tens')}
function drawTens(){$('#tnFig').innerHTML=tensSvg(TN.t,TN.o);$('#tnVal').innerHTML=`${TN.t} עשרות ו־${TN.o} אחדות = ${M(TN.t*10+TN.o)}`}
function tensCheck(){if(TN.done)return;const m=TENS[TN.m],v=TN.t*10+TN.o;TN.tries++;const ok=v===m.n;record('tens','num',ok);
  if(!ok){SND.bad();$('#tnfb').innerHTML=`<div class="bad"><b>עוד לא…</b> בניתם ${v}. ${v<m.n?'צריך יותר.':'זה יותר מדי.'} נסו שוב!</div>`;return}
  TN.done=true;const sc=TN.tries===1?3:TN.tries===2?2:1;setStars('t-'+TN.m,sc);SND.win();addHistory('tens',`משימה ${TN.m+1}: הצליח בניסיון ${TN.tries}`,sc);
  $('#tnfb').innerHTML=`<div class="good">✔ מעולה! ${M(m.n)}</div>`;
  setTimeout(()=>results({title:'משימה הושלמה!',stars:sc,line:`הצלחתם בניסיון ה־${TN.tries}.`,again:()=>tens(TN.m),back:menu,next:TN.m<TENS.length-1?()=>tens(TN.m+1):null,mode:'tens'}),900)}
