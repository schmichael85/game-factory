/* Block World – Math (חשבון), grade 5 */
const GAME={id:'blockMath5',title:'עולם המספרים',subject:'חשבון כיתה ה׳',home:'../',
  tagline:'בחר משחק, אסוף כוכבים ויהלומים ותהיה אלוף החשבון!',
  modes:[{key:'wall',name:'קיר השברים',icon:'🧱',desc:'צבעו בדיוק את החלק הנכון של הקיר – שברים ועשרוניים.',prefix:'f-',max:36,open:()=>wall(firstOpen(WALLS.length,'f-'))}]};

const TOPICS={frac:{name:'שברים',world:'מערת השברים',icon:'🍕',c:'#b5651d'},
  dec:{name:'שברים עשרוניים',world:'נהר העשרוניים',icon:'🔟',c:'#2a7bd6'},
  ops:{name:'פעולות ומספרים',world:'מכרה המספרים',icon:'✖️',c:'#7d7d7d'}};
const TYPES={
 fr_pic:['frac','זיהוי שבר מציור',1],
 fr_equiv:['frac','שברים שווים (הרחבה)',1],
 fr_add_same:['frac','חיבור וחיסור שברים עם אותו מכנה',1],
 fr_simplify:['frac','צמצום שברים',2],
 fr_compare:['frac','השוואת שברים',2],
 fr_of_number:['frac','שבר מכמות',2],
 fr_add_diff:['frac','חיבור שברים עם מכנים שונים',3],
 fr_mixed:['frac','מספר מעורב ושבר גדול מ־1',3],
 de_read:['dec','כתיבת שבר עשרוני',1],
 de_compare:['dec','השוואת שברים עשרוניים',1],
 de_add:['dec','חיבור וחיסור עשרוניים',2],
 de_mul10:['dec','כפל וחילוק ב־10 וב־100',2],
 de_round:['dec','עיגול עשרוניים',3],
 de_money:['dec','בעיות כסף עם עשרוניים',3],
 op_place:['ops','ערך הספרה במספר',1],
 op_round:['ops','עיגול מספרים',1],
 op_mul:['ops','כפל במאונך',1],
 op_div:['ops','חילוק',1],
 op_order:['ops','סדר פעולות חשבון',2],
 op_divis:['ops','סימני התחלקות',2],
 op_word:['ops','בעיות מילוליות',3],
 wall:['frac','קיר השברים',1]
};

/* ---------- helpers ---------- */
const fmt=(x,dp=2)=>String(Number(x.toFixed(dp)));          /* 3.40 -> "3.4" */
const big=n=>M(n.toLocaleString('en-US'));                   /* 3,762,415 */
/* fraction options: unique by VALUE, so two "equal" answers never appear together */
function fracOpts(a,b,cands,fillDen){const out=[[a,b]],seen=new Set([a/b]);
  for(const[x,y]of shuffle(cands)){if(out.length>=4)break;if(x>0&&y>0&&!seen.has(x/y)){seen.add(x/y);out.push([x,y])}}
  let g=0;while(out.length<4&&g++<60){const y=fillDen||b,x=R(1,Math.max(2,y+2));if(!seen.has(x/y)){seen.add(x/y);out.push([x,y])}}
  const arr=shuffle(out);return{opts:arr.map(([x,y])=>FR(x,y)),ans:arr.findIndex(([x,y])=>x===a&&y===b)}}
function strOpts(c,cands){const out=[c];for(const x of shuffle(cands))if(out.length<4&&!out.includes(x))out.push(x);const arr=shuffle(out);return{opts:arr.map(M),ans:arr.indexOf(c)}}
function barFig(k,n){const W=260,x0=20,w=W/n;let s='';for(let i=0;i<n;i++)s+=`<rect x="${f1(x0+i*w)}" y="60" width="${f1(w)}" height="70" fill="${i<k?'#e3b22b':'#e9dfc0'}" stroke="#2b2b2b" stroke-width="3"/>`;return svgW(s,300,190)}

const G={
fr_pic(d){const n=d===1?R(3,8):R(5,12),k=R(1,n-1);
  return{text:'איזה חלק מהמלבן צבוע בצהוב?',svg:barFig(k,n),...fracOpts(k,n,[[n-k,n],[k,n-k],[n,k],[k+1,n],[k-1,n]]),
   exp:`המלבן מחולק ל־${n} חלקים שווים, ו־${k} מהם צבועים. לכן הצבוע הוא ${FR(k,n)}. (המכנה = לכמה חלקים חילקנו, המונה = כמה חלקים לקחנו.)`}},
fr_equiv(d){let b=R(2,d===1?6:9),a=R(1,b-1);const g=gcd(a,b);a/=g;b/=g;const m=R(2,d===1?4:6);
  if(Math.random()<.5)return{text:`השלימו: ${M(FR(a,b)+' = '+FR('?',b*m))}`,...numOpts(a*m,[a+m,a*m+1,b*m-a*m,a*(m+1),a+b*m-b]),
    exp:`המכנה גדל פי ${m} (${M(`${b} × ${m} = ${b*m}`)}), ולכן גם המונה גדל פי ${m}: ${M(`${a} × ${m} = ${a*m}`)}.`};
  return{text:`השלימו: ${M(FR(a*m,b*m)+' = '+FR('?',b))}`,...numOpts(a,[a*m,a+1,b-a,m].filter(x=>x!==a)),
    exp:`המכנה קטן פי ${m} (${M(`${b*m} : ${m} = ${b}`)}), ולכן גם המונה קטן פי ${m}: ${M(`${a*m} : ${m} = ${a}`)}.`}},
fr_add_same(d){const n=R(5,d===1?10:12);let a=R(1,n-2),b=R(1,n-1-a);const sub=d>=2&&Math.random()<.5;
  if(sub){const t=a+b;return{text:M(`${FR(t,n)} − ${FR(b,n)} = ?`),...fracOpts(a,n,[[t-b,0],[a+1,n],[a,2*n],[t+b,n],[a-1,n]]),
    exp:`כשהמכנה זהה, מחסרים רק את המונים: ${M(`${t} − ${b} = ${a}`)}. המכנה נשאר ${n}.`}}
  return{text:M(`${FR(a,n)} + ${FR(b,n)} = ?`),...fracOpts(a+b,n,[[a+b,2*n],[a+b+1,n],[a*b,n],[a+b-1,n]]),
   exp:`כשהמכנה זהה, מחברים רק את המונים: ${M(`${a} + ${b} = ${a+b}`)}. המכנה נשאר ${n} – לא מחברים מכנים!`}},
fr_simplify(d){let b=R(3,d===2?8:12),a=R(1,b-1);const g=gcd(a,b);a/=g;b/=g;const m=R(2,d===2?4:6);
  return{text:`צמצמו את השבר עד הסוף: ${M(FR(a*m,b*m)+' = ?')}`,...fracOpts(a,b,[[a+1,b],[a,b+1],[a*m-1,b*m],[b,a],[a*m,b]]),
   exp:`מחלקים את המונה ואת המכנה באותו מספר – ${m}: ${M(`${a*m} : ${m} = ${a}`)}, ${M(`${b*m} : ${m} = ${b}`)}. כך מקבלים ${FR(a,b)}.`}},
fr_compare(d){let a,b,c,e,kind=d===2?pick(['den','num']):pick(['den','num','cross','cross']);
  if(kind==='den'){b=e=R(5,12);a=R(1,b-1);do{c=R(1,b-1)}while(c===a)}
  else if(kind==='num'){a=c=R(1,5);b=R(a+1,12);do{e=R(a+1,12)}while(e===b)}
  else{do{b=R(3,9);e=R(3,9);a=R(1,b-1);c=R(1,e-1)}while(b===e)}
  const x=a/b,y=c/e,eq=Math.abs(x-y)<1e-9;const o=[FR(a,b),FR(c,e),'הם שווים'];const ans=eq?2:x>y?0:1;
  const why=kind==='den'?'כשהמכנים שווים – השבר עם המונה הגדול יותר גדול יותר.':kind==='num'?'כשהמונים שווים – השבר עם המכנה <b>הקטן</b> יותר גדול יותר (החלקים גדולים יותר!).':`מביאים למכנה משותף ${b*e}: ${M(FR(a,b)+' = '+FR(a*e,b*e))} ו־${M(FR(c,e)+' = '+FR(c*b,b*e))}.`;
  return{text:'איזה שבר גדול יותר?',opts:o,ans,cls:'three',exp:why}},
fr_of_number(d){const b=pick([2,3,4,5,6,8,10]),a=R(1,b-1),N=b*R(2,d===2?9:15);const ans=N/b*a;
  const t=pick([[`בכיתה יש ${N} תלמידים. ${FR(a,b)} מהם הגיעו בטיול. כמה תלמידים הגיעו?`],[`בארגז יש ${N} תפוחים. ${FR(a,b)} מהם אדומים. כמה תפוחים אדומים?`],[`כמה הם ${FR(a,b)} מתוך ${N}?`]])[0];
  return{text:t,...numOpts(ans,[N/b,N-ans,N*a,ans+N/b,N/a].filter(Number.isInteger)),
   exp:`קודם מוצאים חלק אחד: ${M(`${N} : ${b} = ${N/b}`)}. אחר כך לוקחים ${a} חלקים: ${M(`${N/b} × ${a} = ${ans}`)}.`}},
fr_add_diff(d){let b2=pick([4,6,8,10,12]),divs=[2,3,4,5,6].filter(x=>b2%x===0&&x<b2),b1=pick(divs),k=b2/b1,a,c;
  do{a=R(1,b1-1);c=R(1,b2-1)}while(a*k+c>=b2);const sub=Math.random()<.4&&a*k>c;
  const res=sub?a*k-c:a*k+c;
  return{text:M(`${FR(a,b1)} ${sub?'−':'+'} ${FR(c,b2)} = ?`),...fracOpts(res,b2,[[sub?Math.abs(a-c):a+c,sub?Math.abs(b1-b2)||1:b1+b2],[sub?Math.abs(a-c):a+c,b2],[res+1,b2],[res-1,b2],[res,b1]]),
   exp:`קודם מביאים למכנה משותף ${b2}: ${M(FR(a,b1)+' = '+FR(a*k,b2))}. ואז: ${M(`${a*k} ${sub?'−':'+'} ${c} = ${res}`)}, כלומר ${FR(res,b2)}.`}},
fr_mixed(d){const q=R(2,9);let p;do{p=R(q+1,q*4)}while(p%q===0);const w=Math.floor(p/q),r=p%q;
  if(Math.random()<.5){const cand=[[w,r],[w+1,r],[w,q-r],[r,w<q?w:1],[w-1||w+2,r]];const seen=new Set();const out=[];for(const[x,y]of cand){const k=x+'/'+y;if(!seen.has(k)&&y>0&&y<q){seen.add(k);out.push([x,y])}}
    const arr=shuffle(out.slice(0,4));return{text:`איך כותבים את ${FR(p,q)} כמספר מעורב?`,opts:arr.map(([x,y])=>MIX(x,y,q)),ans:arr.findIndex(([x,y])=>x===w&&y===r),
      exp:`בודקים כמה פעמים ${q} נכנס ב־${p}: ${M(`${p} : ${q} = ${w}`)} ונשארת שארית ${r}. לכן ${M(FR(p,q)+' = '+MIX(w,r,q))}.`}}
  return{text:`איך כותבים את ${MIX(w,r,q)} כשבר?`,...fracOpts(p,q,[[w+r,q],[w*r+q,q],[p+1,q],[w*q,q+r]]),
   exp:`בכל שלם יש ${q} חלקים: ${M(`${w} × ${q} = ${w*q}`)}, ועוד ${r} – ביחד ${M(`${w*q} + ${r} = ${p}`)}. לכן ${FR(p,q)}.`}},

de_read(d){if(Math.random()<.5){const ten=Math.random()<.5;let k=ten?R(1,9):R(11,99);if(!ten&&k%10===0)k++;const den=ten?10:100;
    const c=ten?`0.${k}`:`0.${k}`;const w=ten?[`0.0${k}`,`${k}`,`1.${k}`,`${k}.0`]:[`0.0${k}`,`${k}`,`${String(k)[0]}.${String(k)[1]}`,`0.${k}0`.slice(0,5)];
    return{text:`איך כותבים את השבר ${FR(k,den)} כשבר עשרוני?`,...strOpts(c,w.filter(x=>Number(x)!==Number(c))),
     exp:`${den===10?'עשיריות – ספרה אחת אחרי הנקודה':'מאיות – שתי ספרות אחרי הנקודה'}: ${FR(k,den)} = ${M(c)}.`}}
  let k=R(11,99);if(k%10===0)k++;const g=gcd(k,100);
  const arr=shuffle([[k,100],[k,10],[k,1000],[Math.floor(k/10),k%10]]).filter((v,i,A)=>A.findIndex(z=>z[0]/z[1]===v[0]/v[1])===i);
  return{text:`איזה שבר שווה ל־${M('0.'+k)}?`,opts:arr.map(([a,b])=>FR(a,b)),ans:arr.findIndex(([a,b])=>a===k&&b===100),
   exp:`שתי ספרות אחרי הנקודה = מאיות: ${M('0.'+k)} = ${FR(k,100)}${g>1?` (ואפשר לצמצם ל־${FR(k/g,100/g)})`:''}.`}},
de_compare(d){let A,B;const t=R(1,9);
  if(Math.random()<.6){A=t*10;do{B=R(11,99)}while(B%10===0||Math.abs(B-A)<3)}else{do{A=R(11,99)}while(A%10===0);do{B=R(11,99)}while(B===A)}
  if(d>=2&&A%10===0&&Math.random()<.25)B=A;
  const sA=fmt(A/100),sB=A===B?(A%10===0?(A/100).toFixed(2):fmt(B/100)):fmt(B/100);const ans=A===B?2:A>B?0:1;
  return{text:'איזה מספר גדול יותר?',opts:[M(sA),M(sB),'הם שווים'],ans,cls:'three',
   exp:`משווים ספרה־ספרה מהנקודה והלאה (אפשר להוסיף אפס בסוף: ${M(sA)} = ${M((A/100).toFixed(2))}, ${M(sB)} = ${M((B/100).toFixed(2))}). מספר הספרות לא קובע!`}},
de_add(d){const A=R(105,899),B=R(11,59)*10;const sub=Math.random()<.5&&A>B;const res=sub?A-B:A+B;
  const sA=fmt(A/100),sB=fmt(B/100),c=fmt(res/100);const wrong=fmt((sub?A-B/10:A+B/10)/100);
  return{text:`${M(`${sA} ${sub?'−':'+'} ${sB} = ?`)}`,...strOpts(c,[wrong,fmt((res+10)/100),fmt((res-100)/100),fmt((res+100)/100),fmt((res-10)/100)].filter(x=>x!==c&&Number(x)>0)),
   exp:`כותבים במאונך כך ש<b>הנקודות אחת מתחת לשנייה</b>: ${M(`${(A/100).toFixed(2)} ${sub?'−':'+'} ${(B/100).toFixed(2)} = ${c}`)}.`}},
de_mul10(d){const x=R(12,999)/100;const op=pick([['×',10],['×',100],[':',10],[':',100]]);const v=op[0]==='×'?x*op[1]:x/op[1];
  const c=fmt(v,4);const alts=[x*10,x*100,x/10,x/100,x*1000,x/1000].map(z=>fmt(z,5)).filter(z=>z!==c);
  return{text:`${M(`${fmt(x)} ${op[0]} ${op[1]} = ?`)}`,...strOpts(c,alts),
   exp:`${op[0]==='×'?'בכפל':'בחילוק'} ב־${op[1]} הנקודה זזה ${op[1]===10?'מקום אחד':'שני מקומות'} ${op[0]==='×'?'ימינה (המספר גדל)':'שמאלה (המספר קטן)'}: ${M(`${fmt(x)} ${op[0]} ${op[1]} = ${c}`)}.`}},
de_round(d){const h=R(101,999);if(h%10===0)return G.de_round(d);const x=h/100;const toWhole=Math.random()<.5;
  const c=toWhole?String(Math.round(x)):fmt(Math.round(x*10)/10,1);const alts=toWhole?[String(Math.floor(x)),String(Math.ceil(x)),fmt(Math.round(x*10)/10,1),String(Math.round(x)+1),String(Math.round(x)-1),String(Math.round(x)+2)]:[fmt(Math.floor(x*10)/10,1),fmt(Math.ceil(x*10)/10,1),String(Math.round(x)),fmt(Math.round(x*10)/10+.2,1),fmt(Math.round(x*10)/10-.2,1),fmt(Math.round(x*10)/10+1,1)];
  return{text:`עגלו את ${M(fmt(x))} ${toWhole?'למספר השלם הקרוב':'לעשיריות'}.`,...strOpts(c,alts.filter(z=>z!==c)),
   exp:`מסתכלים על הספרה ${toWhole?'של העשיריות':'של המאיות'}: אם היא 5 ומעלה – מעגלים למעלה, אחרת – למטה. ${M(fmt(x))} ≈ ${M(c)}.`}},
de_money(d){const a=R(3,15)+pick([.5,.9,.25,.75,.4]),b=R(2,12)+pick([.5,.6,.25,.3]);const pay=a+b<20?20:50;const ch=pay-a-b;
  const c=fmt(ch);return{text:`קניתם מחברת ב־${M(fmt(a))} ש"ח ועט ב־${M(fmt(b))} ש"ח, ושילמתם בשטר של ${pay} ש"ח. כמה עודף תקבלו?`,
   ...strOpts(c,[fmt(a+b),fmt(ch+1),fmt(ch-1),fmt(ch+.1),fmt(pay-a)].filter(x=>x!==c&&Number(x)>0)),
   exp:`קודם מחברים: ${M(`${fmt(a)} + ${fmt(b)} = ${fmt(a+b)}`)}. אחר כך מחסרים מ־${pay}: ${M(`${pay} − ${fmt(a+b)} = ${c}`)} ש"ח.`}},

op_place(d){let n;do{n=R(1000000,9999999)}while(String(n).split('').filter(c=>c==='7').length!==1);const s=String(n),pos=s.length-1-s.indexOf('7');const v=7*10**pos;
  const names=['אחדות','עשרות','מאות','אלפים','עשרות אלפים','מאות אלפים','מיליונים'];
  return{text:`מה הערך של הספרה 7 במספר ${big(n)}?`,...strOpts(v.toLocaleString('en-US'),[7,70,700,7000,70000,700000,7000000].filter(x=>x!==v).map(x=>x.toLocaleString('en-US'))),
   exp:`הספרה 7 נמצאת במקום של ה${names[pos]}, ולכן הערך שלה ${big(v)}.`}},
op_round(d){const n=R(1001,99999);const to=pick([10,100,1000]);const c=Math.round(n/to)*to;
  if(c===n)return G.op_round(d);const dn=Math.floor(n/to)*to,up=Math.ceil(n/to)*to;
  return{text:`עגלו את ${big(n)} ${to===10?'לעשרות':to===100?'למאות':'לאלפים'}.`,...strOpts(c.toLocaleString('en-US'),[dn,up,c+to,c-to,c+2*to,Math.round(n/(to*10))*to*10].filter(x=>x!==c&&x>0).map(x=>x.toLocaleString('en-US'))),
   exp:`מסתכלים על הספרה שמימין ל${to===10?'עשרות':to===100?'מאות':'אלפים'}: 5 ומעלה – למעלה, פחות מ־5 – למטה. ${big(n)} ≈ ${big(c)}.`}},
op_mul(d){let a,b;if(d===1){a=R(12,99);b=R(3,9)}else if(d===2){a=R(102,999);b=R(3,9)}else{a=R(12,99);b=R(12,49)}const c=a*b;
  return{text:M(`${a} × ${b} = ?`),...numOpts(c,[c+10,c-10,c+a,c-a,c+b*10,a*(b+1)]),
   exp:d===3?`מפרקים: ${M(`${a} × ${b} = ${a} × ${Math.floor(b/10)*10} + ${a} × ${b%10} = ${a*Math.floor(b/10)*10} + ${a*(b%10)} = ${c}`)}`:`מפרקים לפי ערך הספרות: ${M(`${a} × ${b} = ${String(a).split('').map((ch,i,A)=>`${ch*10**(A.length-1-i)} × ${b}`).join(' + ')} = ${c}`)}`}},
op_div(d){const b=R(3,9);if(d<3){const q=d===1?R(12,30):R(102,250);const a=q*b;
    return{text:`${M(`${a} : ${b} = ?`)}`,...numOpts(q,[q+1,q-1,q+10,q-10,Math.floor(a/(b+1))]),exp:`בודקים בכפל: ${M(`${q} × ${b} = ${a}`)}, ולכן ${M(`${a} : ${b} = ${q}`)}.`}}
  const q=R(12,60),r=R(1,b-1),a=q*b+r;const c=`${q} (שארית ${r})`;
  return{text:`${M(`${a} : ${b} = ?`)}`,...txtOpts(c,[`${q} (שארית ${(r+1)%b||1})`,`${q+1} (שארית ${r})`,`${q-1} (שארית ${r})`,`${q} (שארית ${b-r===r?r+1:b-r})`].filter(x=>x!==c)),
   exp:`${M(`${q} × ${b} = ${q*b}`)}, ועד ${a} חסרים עוד ${r} – זו השארית. השארית תמיד קטנה מ־${b}.`}},
op_order(d){const a=R(2,9),b=R(2,9),c=R(2,9),e=R(2,6);let ex,v,w;
  const k=d===2?R(0,2):R(0,4);
  if(k===0){ex=`${a} + ${b} × ${c}`;v=a+b*c;w=(a+b)*c}
  else if(k===1){ex=`(${a} + ${b}) × ${c}`;v=(a+b)*c;w=a+b*c}
  else if(k===2){const x=b*c+a;ex=`${x} − ${b} × ${c}`;v=x-b*c;w=(x-b)*c}
  else if(k===3){ex=`${a} × ${b} + ${c} × ${e}`;v=a*b+c*e;w=(a*b+c)*e}
  else{const x=a*e;ex=`${x} : ${e} + ${b} × ${c}`;v=x/e+b*c;w=(x/e+b)*c}
  return{text:`${M(ex+' = ?')}`,...numOpts(v,[w,v+1,v+c,Math.abs(v-c)]),
   exp:`קודם סוגריים, אחר כך כפל וחילוק, ובסוף חיבור וחיסור. ${M(ex+' = '+v)}${w!==v?` (אם מחשבים משמאל לימין בלי לשים לב – מקבלים ${w} בטעות).`:''}`}},
op_divis(d){const k=d===2?pick([2,3,5,10]):pick([3,4,6,9]);let yes;do{yes=R(100,999)*1}while(yes%k);yes=yes;
  const no=[];let g=0;while(no.length<3&&g++<200){const x=R(100,999);if(x%k&&!no.includes(x))no.push(x)}
  const rule={2:'מספר מתחלק ב־2 אם ספרת האחדות זוגית (0, 2, 4, 6, 8).',3:'מספר מתחלק ב־3 אם סכום הספרות שלו מתחלק ב־3.',5:'מספר מתחלק ב־5 אם ספרת האחדות היא 0 או 5.',10:'מספר מתחלק ב־10 אם ספרת האחדות היא 0.',4:'מספר מתחלק ב־4 אם המספר ששתי הספרות האחרונות יוצרות מתחלק ב־4.',6:'מספר מתחלק ב־6 אם הוא מתחלק גם ב־2 וגם ב־3.',9:'מספר מתחלק ב־9 אם סכום הספרות שלו מתחלק ב־9.'}[k];
  const ds=String(yes).split('').map(Number);
  return{text:`איזה מספר מתחלק ב־${k} בלי שארית?`,...numOpts(yes,no),exp:`${rule}${[3,9,6].includes(k)?` למשל ${big(yes)}: ${M(ds.join(' + ')+' = '+ds.reduce((a,b)=>a+b,0))}.`:''}`}},
op_word(d){const t=R(0,4);
  if(t===0){const per=R(12,30),box=R(8,25),sold=R(2,box-1)*per;const c=per*box-sold;return{text:`בכל ארגז יש ${per} תפוחים. בחנות ${box} ארגזים. מכרו ${sold} תפוחים. כמה תפוחים נשארו?`,...numOpts(c,[per*box,c+per,c-per,per*box+sold]),exp:`${M(`${per} × ${box} = ${per*box}`)} תפוחים, ואחרי המכירה: ${M(`${per*box} − ${sold} = ${c}`)}.`}}
  if(t===1){const kids=R(4,9),each=R(15,40),total=kids*each;return{text:`${total} מדבקות חולקו שווה בשווה בין ${kids} ילדים. כמה מדבקות קיבל כל ילד?`,...numOpts(each,[each+1,each-1,total-kids,each+kids]),exp:`מחלקים: ${M(`${total} : ${kids} = ${each}`)}.`}}
  if(t===2){const p=R(12,45),n=R(3,8),pay=Math.ceil(p*n/100)*100;const c=pay-p*n;if(c===0)return G.op_word(d);return{text:`כרטיס לקולנוע עולה ${p} ש"ח. משפחה קנתה ${n} כרטיסים ושילמה ${pay} ש"ח. כמה עודף קיבלה?`,...numOpts(c,[p*n,c+p,Math.abs(c-p)||c+2*p,pay-p]),exp:`${M(`${p} × ${n} = ${p*n}`)}, ועודף: ${M(`${pay} − ${p*n} = ${c}`)} ש"ח.`}}
  if(t===3){const pages=R(120,360),per=pick([12,15,20,24,30]);const days=Math.ceil(pages/per);return{text:`בספר יש ${pages} עמודים. נועה קוראת ${per} עמודים ביום. כמה ימים היא צריכה כדי לסיים את הספר?`,...numOpts(days,[Math.floor(pages/per),days+1,days+2,Math.max(1,days-2)]),exp:`${M(`${pages} : ${per} = ${fmt(pages/per,2)}`)}.${pages%per?' יש שארית – אז צריך עוד יום אחד כדי לסיים: '+days+' ימים.':''}`}}
  const L=R(6,25),W=R(4,15);return{text:`גינה מלבנית באורך ${L} מטר וברוחב ${W} מטר. רוצים לגדר אותה מסביב. כמה מטרים של גדר צריך?`,...numOpts(2*(L+W),[L*W,L+W,2*L+W,4*L]),exp:`גדר מסביב = היקף: ${M(`2 × (${L} + ${W}) = ${2*(L+W)}`)} מטר.`}}
};

/* ---------- FRACTION WALL ---------- */
const WALLS=[
 {r:1,c:4,t:`צבעו ${FR(3,4)} מהקיר`,n:3,h:'הקיר מחולק ל־4 קוביות. צריך לצבוע 3 מהן.'},
 {r:2,c:3,t:`צבעו ${FR(1,2)} מהקיר`,n:3,h:'חצי מ־6 קוביות: 6 : 2 = 3.'},
 {r:1,c:8,t:`צבעו ${FR(5,8)} מהקיר`,n:5},
 {r:2,c:5,t:`צבעו ${FR(3,5)} מהקיר`,n:6,h:'10 קוביות, מחולקות ל־5 קבוצות שוות של 2. צריך 3 קבוצות: 3 × 2 = 6.'},
 {r:2,c:5,t:`צבעו ${M('0.4')} מהקיר`,n:4,h:'0.4 = ארבע עשיריות. בקיר יש 10 קוביות – כל קובייה היא עשירית.'},
 {r:3,c:4,t:`צבעו ${FR(2,3)} מהקיר`,n:8,h:'12 : 3 = 4 קוביות בכל שליש. צריך 2 שלישים: 2 × 4 = 8.'},
 {r:2,c:6,t:`צבעו ${FR(3,4)} מהקיר`,n:9,h:'12 : 4 = 3 קוביות ברבע. צריך 3 רבעים: 3 × 3 = 9.'},
 {r:4,c:5,t:`צבעו ${M('0.35')} מהקיר`,n:7,h:'0.35 = 35 מאיות = 35/100. בקיר יש 20 קוביות, כל קובייה היא 5 מאיות: 35 : 5 = 7.'},
 {r:3,c:4,t:`צבעו ${FR(5,6)} מהקיר`,n:10,h:'12 : 6 = 2 קוביות בכל שישית. צריך 5 שישיות: 5 × 2 = 10.'},
 {r:4,c:6,t:`צבעו ${FR(3,8)} מהקיר`,n:9,h:'24 : 8 = 3 קוביות בכל שמינית. צריך 3 שמיניות: 3 × 3 = 9.'},
 {r:2,c:5,t:`צבעו ${M(FR(1,2)+' + '+FR(1,5))} מהקיר`,n:7,h:'חצי מ־10 זה 5, וחמישית מ־10 זה 2. ביחד: 5 + 2 = 7.'},
 {r:4,c:6,t:`צבעו ${M(FR(1,3)+' + '+FR(1,4))} מהקיר`,n:14,h:'שליש מ־24 זה 8, ורבע מ־24 זה 6. ביחד: 8 + 6 = 14.'}];
let WL={};
function wall(mi){setMode('wall');clearTimers();const w=WALLS[mi],N=w.r*w.c;WL={m:mi,on:new Set(),tries:0,done:false};
  scr('wall').innerHTML=`<div class="panel"><h2>🧱 קיר השברים</h2><div class="mis">${levelButtons(WALLS.length,'f-',mi)}</div></div>
   <div class="panel"><div class="qtext">משימה ${mi+1}: ${w.t}</div><div class="muted">בקיר יש ${N} קוביות. לחצו על קוביות (או גררו) כדי לצבוע אותן בזהב. אפשר לצבוע כל קובייה – המיקום לא משנה, רק הכמות!</div>
   <div class="wall" id="wl" style="grid-template-columns:repeat(${w.c},1fr);max-width:${Math.min(520,w.c*90)}px"></div>
   <div class="center big" id="wlCount"></div>
   <div class="row" style="justify-content:center;margin-top:8px"><button class="btn gold" id="wlCheck">✔ בדיקה</button><button class="btn wood" id="wlHint">💡 רמז</button><button class="btn stone" id="wlClear">🧹 נקה</button><button class="btn stone" id="wlBack">↩ תפריט</button></div>
   <div class="fb" id="wlfb"></div></div>`;
  $('#scr-wall').querySelectorAll('.lv[data-lv]').forEach(b=>b.onclick=()=>{SND.click();wall(+b.dataset.lv)});
  const el=$('#wl');el.innerHTML=Array.from({length:N},(_,i)=>`<div class="wb" data-i="${i}"></div>`).join('');
  let paint=null;const setB=(i,v)=>{if(WL.done||i==null)return;const had=WL.on.has(i);if(v&&!had){WL.on.add(i);beep(700,.03,'square',.02)}else if(!v&&had){WL.on.delete(i);beep(300,.03,'square',.02)}else return;drawWall()};
  const idx=e=>{const t=document.elementFromPoint(e.clientX,e.clientY);return t&&t.dataset&&t.dataset.i!=null&&t.classList.contains('wb')?+t.dataset.i:null};
  el.addEventListener('pointerdown',e=>{const i=idx(e);if(i==null)return;e.preventDefault();paint=!WL.on.has(i);setB(i,paint)});
  el.addEventListener('pointermove',e=>{if(paint===null)return;setB(idx(e),paint)});window.addEventListener('pointerup',()=>paint=null);
  $('#wlCheck').onclick=wallCheck;$('#wlClear').onclick=()=>{WL.on.clear();$('#wlfb').innerHTML='';drawWall()};
  $('#wlHint').onclick=()=>{$('#wlfb').innerHTML=`<div class="bad">💡 ${w.h||`קודם מחלקים את ${N} הקוביות לקבוצות שוות לפי המכנה, ואז לוקחים כמה קבוצות לפי המונה.`}</div>`};$('#wlBack').onclick=menu;
  drawWall();show('wall')}
function drawWall(){$('#wl').querySelectorAll('.wb').forEach(b=>b.classList.toggle('on',WL.on.has(+b.dataset.i)));const w=WALLS[WL.m];$('#wlCount').textContent=`צבועות: ${WL.on.size} מתוך ${w.r*w.c}`}
function wallCheck(){if(WL.done)return;const w=WALLS[WL.m],n=WL.on.size,N=w.r*w.c;if(!n){$('#wlfb').innerHTML='<div class="bad">עוד לא צבעתם אף קובייה 🙂</div>';return}
  WL.tries++;const ok=n===w.n;record('wall','frac',ok);
  if(!ok){SND.bad();$('#wlfb').innerHTML=`<div class="bad"><b>עוד לא…</b> צבעתם ${n} קוביות – ${n>w.n?'יותר מדי':'פחות ממה שצריך'}. נסו שוב!</div>`;return}
  WL.done=true;const sc=WL.tries===1?3:WL.tries===2?2:1;setStars('f-'+WL.m,sc);SND.win();addHistory('wall',`משימה ${WL.m+1}: הצליח בניסיון ${WL.tries}`,sc);
  $('#wlfb').innerHTML=`<div class="good">✔ מעולה! ${w.n} מתוך ${N} קוביות = ${FR(w.n,N)}</div>`;
  setTimeout(()=>results({title:'הקיר מוכן!',stars:sc,line:`הצלחתם בניסיון ה־${WL.tries}.`,again:()=>wall(WL.m),back:menu,next:WL.m<WALLS.length-1?()=>wall(WL.m+1):null,mode:'wall'}),900)}
