/* Block World – Shapes & geometry, grade 2 */
const GAME={id:'blockGeometry2',title:'עולם הצורות',subject:'צורות כיתה ב׳',home:'../',
  tagline:'בחר משחק, אסוף כוכבים ויהלומים ותהיה אלוף הצורות!',
  arcadeTime:90,arcadeStars:[5,8,12],wrongPenalty:2,builderTopic:'shp',
  builderText:{unit:'קוביות',area:'קוביות',showPerim:false,help:'לחצו או גררו על הלוח כדי להניח קוביות (לחיצה על קובייה מורידה אותה). כל הקוביות צריכות לגעת זו בזו.'},
  modes:[{key:'builder',name:'בנאי הקוביות',icon:'🧱',desc:'בנו מגדלים, שורות, ריבועים ומלבנים מקוביות.',prefix:'b-',max:36,open:()=>builder(firstOpen(GAME.missions.length,'b-'))}]};

const TOPICS={shp:{name:'צורות',world:'יער הצורות',icon:'🔷',c:'#4f9a3a'},
  meas:{name:'אורך ומדידה',world:'מכרה הסרגלים',icon:'📏',c:'#7d7d7d'},
  pat:{name:'דפוסים וסימטריה',world:'גן הפרפרים',icon:'🦋',c:'#b5651d'}};
const TYPES={
 s_name:['shp','שמות של צורות',1],
 s_sides:['shp','ספירת צלעות וקודקודים',1],
 s_which:['shp','זיהוי צורה מתוך כמה צורות',2],
 s_3d:['shp','גופים (כדור, קובייה, גליל…)',2],
 s_count:['shp','ספירת צורות בציור',3],
 m_count:['meas','מדידה בקוביות',1],
 m_compare:['meas','השוואת אורכים',1],
 m_ruler:['meas','מדידה בסרגל',2],
 m_unit:['meas','ס"מ או מטר?',2],
 m_add:['meas','חיבור וחיסור אורכים',3],
 m_perim:['meas','היקף – סכום הצלעות',3],
 p_next:['pat','מה בא אחר כך בדפוס',1],
 p_num:['pat','דפוסים של מספרים',2],
 p_sym:['pat','קו סימטריה',2],
 build:['shp','בנייה מקוביות',1]
};

/* ---------- drawing ---------- */
const FILL=['#f9d43a','#6ab04c','#4aa3df','#ff8fc8','#f39c12','#a77bd8'];
function regPoly(n,cx,cy,r,rot=-90){const P=[];for(let j=0;j<n;j++){const a=(rot+j*360/n)*Math.PI/180;P.push([f1(cx+r*Math.cos(a)),f1(cy+r*Math.sin(a))])}return P}
function shapeSvg(k,cx,cy,s,fill){/* k: circle, triangle, square, rect, pent, hex */
  const st=`fill="${fill}" stroke="#2b2b2b" stroke-width="3" stroke-linejoin="round"`;
  if(k==='circle')return`<circle cx="${cx}" cy="${cy}" r="${s}" ${st}/>`;
  if(k==='square')return`<rect x="${cx-s}" y="${cy-s}" width="${2*s}" height="${2*s}" ${st}/>`;
  if(k==='rect')return`<rect x="${cx-s*1.5}" y="${cy-s*.8}" width="${3*s}" height="${1.6*s}" ${st}/>`;
  const n={triangle:3,pent:5,hex:6}[k];return`<polygon points="${regPoly(n,cx,cy,s*1.15).map(p=>p.join(',')).join(' ')}" ${st}/>`}
const SHP={circle:['עיגול',0],triangle:['משולש',3],square:['ריבוע',4],rect:['מלבן',4],pent:['מחומש',5],hex:['משושה',6]};
const miniShape=k=>`<svg viewBox="0 0 100 80" width="90" height="72">${shapeSvg(k,50,40,k==='rect'?18:26,pick(FILL))}</svg>`;
function blocksBar(n,y,color,x0=20,u=24){let s='';for(let i=0;i<n;i++)s+=`<rect x="${x0+i*u}" y="${y}" width="${u}" height="${u}" fill="${color}" stroke="#2b2b2b" stroke-width="2.5"/>`;return s}
function ruler(x0,u,n,y){let s=`<rect x="${x0-8}" y="${y}" width="${n*u+16}" height="44" fill="#f7e7a1" stroke="#7a6a2a" stroke-width="2"/>`;
  for(let i=0;i<=n;i++)s+=`<line x1="${x0+i*u}" y1="${y}" x2="${x0+i*u}" y2="${y+16}" stroke="#333" stroke-width="2"/><text x="${x0+i*u}" y="${y+36}" font-size="15" font-weight="700" text-anchor="middle" fill="#222">${i}</text>`;return s}

const G={
s_name(d){const ks=d===1?['circle','triangle','square','rect']:Object.keys(SHP);const k=pick(ks);
  const wr=others(Object.keys(SHP),k).map(x=>SHP[x][0]);
  return{text:'מה שם הצורה?',svg:svgW(shapeSvg(k,150,100,55,pick(FILL))),...txtOpts(SHP[k][0],wr),
   exp:{circle:'<b>עיגול</b> – עגול, בלי צלעות ובלי פינות.',triangle:'<b>משולש</b> – 3 צלעות ו־3 קודקודים (פינות).',square:'<b>ריבוע</b> – 4 צלעות <b>שוות</b> ו־4 פינות ישרות.',rect:'<b>מלבן</b> – 4 צלעות ו־4 פינות ישרות. הצלעות שמול זו את זו שוות.',pent:'<b>מחומש</b> – 5 צלעות.',hex:'<b>משושה</b> – 6 צלעות.'}[k]}},
s_sides(d){const k=pick(['triangle','square','rect','pent','hex']);const n=SHP[k][1];const corners=d>=2&&Math.random()<.5;
  return{text:corners?'כמה <b>קודקודים</b> (פינות) יש לצורה?':'כמה <b>צלעות</b> יש לצורה?',svg:svgW(shapeSvg(k,150,100,55,pick(FILL))),...numOpts(n,[n+1,n-1,n+2].filter(x=>x>=2)),
   exp:`ל${SHP[k][0]} יש ${n} צלעות ו־${n} קודקודים. טיפ: סמנו באצבע כל צלע וספרו.`}},
s_which(d){const k=pick(Object.keys(SHP).filter(x=>x!=='rect'||d>=2));const ks=[k,...others(Object.keys(SHP).filter(x=>!(k==='square'&&x==='rect')&&!(k==='rect'&&x==='square')),k)];
  const arr=shuffle(ks);return{text:`איזו צורה היא <b>${SHP[k][0]}</b>?`,opts:arr.map(miniShape),ans:arr.indexOf(k),cls:'emoji',exp:`זה ה${SHP[k][0]}: ${miniShape(k)}`}},
s_3d(d){const B=[['⚽','כדור'],['🎲','קובייה'],['🥫','גליל'],['📦','תיבה'],['🍦','חרוט'],['🏀','כדור'],['🧊','קובייה']];const b=pick(B);
  return{text:'לאיזה גוף זה דומה?',svg:`<div class="emo">${b[0]}</div>`,...txtOpts(b[1],['כדור','קובייה','גליל','תיבה','חרוט'].filter(x=>x!==b[1]).sort(()=>Math.random()-.5).slice(0,3)),
   exp:`${b[0]} דומה ל<b>${b[1]}</b>.`}},
s_count(d){const target=pick(['triangle','square','circle']);const n=R(2,6);const items=[];for(let i=0;i<n;i++)items.push(target);for(let i=0;i<R(3,6);i++)items.push(pick(['triangle','square','circle','rect'].filter(x=>x!==target)));
  const sh=shuffle(items);let s='';sh.forEach((k,i)=>{const cx=40+(i%6)*45,cy=45+Math.floor(i/6)*60;s+=shapeSvg(k,cx,cy,k==='rect'?10:16,pick(FILL))});
  return{text:`כמה <b>${SHP[target][0].replace('עיגול','עיגולים').replace('משולש','משולשים').replace('ריבוע','ריבועים')}</b> יש בציור?`,svg:svgW(s,300,Math.ceil(sh.length/6)*60+30),...numOpts(n,[n+1,n-1,sh.length,n+2]),
   exp:`יש ${n}. טיפ: סמנו כל צורה שספרתם כדי לא לספור פעמיים.`}},

m_count(d){const n=R(3,d===1?8:11);return{text:'כמה קוביות אורכו של הפס?',svg:svgW(blocksBar(n,70,'#6ab04c',(300-n*24)/2),300,170),...numOpts(n,[n+1,n-1,n+2]),exp:`סופרים את הקוביות אחת־אחת: ${n}.`}},
m_compare(d){let a=R(3,10),b;do{b=R(3,10)}while(b===a&&d===1);const s=blocksBar(a,40,'#4aa3df')+blocksBar(b,110,'#e94f37');
  const ans=a===b?2:a>b?0:1;return{text:'איזה פס <b>ארוך</b> יותר?',svg:svgW(s,300,170),opts:['🟦 הכחול','🟥 האדום','הם שווים'],ans,cls:'three',
   exp:`הכחול: ${a} קוביות, האדום: ${b} קוביות. ${a===b?'אותו אורך!':`${a>b?'הכחול':'האדום'} ארוך יותר.`}`}},
m_ruler(d){const u=22,x0=18,start=d===3&&Math.random()<.6?R(1,4):0,n=R(2,12-start);
  const s=ruler(x0,u,12,110)+`<rect x="${x0+start*u}" y="78" width="${n*u}" height="22" rx="4" fill="#f39c12" stroke="#2b2b2b" stroke-width="2.5"/><polygon points="${x0+(start+n)*u},78 ${x0+(start+n)*u+16},89 ${x0+(start+n)*u},100" fill="#f9d43a" stroke="#2b2b2b" stroke-width="2"/>`;
  return{text:'מה אורך העיפרון? (בס"מ)',svg:svgW(s,300,170),...numOpts(n,[start+n,n+1,n-1].filter(x=>x!==n)),
   exp:start?`העיפרון מתחיל ב־${start} ונגמר ב־${start+n}. האורך: ${M(`${start+n} − ${start} = ${n}`)} ס"מ.`:`העיפרון מתחיל ב־0 ונגמר ב־${n}, אז האורך ${n} ס"מ.`}},
m_unit(d){const o=pick([['מחק','ס"מ'],['עיפרון','ס"מ'],['כף יד','ס"מ'],['מחברת','ס"מ'],['חצר בית הספר','מטר'],['מגרש כדורגל','מטר'],['רחוב','מטר'],['בריכה','מטר']]);
  return{text:`במה נוח למדוד את האורך של <b>${o[0]}</b>?`,opts:['סנטימטרים (ס"מ)','מטרים'],ans:o[1]==='ס"מ'?0:1,exp:'דברים קטנים מודדים בסנטימטרים. דברים גדולים וארוכים מודדים במטרים. במטר אחד יש 100 ס"מ.'}},
m_add(d){const a=R(4,15),b=R(2,10);if(Math.random()<.5)return{text:`אורך העיפרון ${a} ס"מ ואורך המחק ${b} ס"מ. שמים אותם בשורה. מה האורך ביחד?`,...numOpts(a+b,[a-b,a+b+1,a+b-1].filter(x=>x>0)),exp:`${M(`${a} + ${b} = ${a+b}`)} ס"מ.`};
  const big=a+b;return{text:`סרט באורך ${big} ס"מ. גזרנו ממנו ${b} ס"מ. כמה ס"מ נשארו?`,...numOpts(a,[big+b,a+1,a-1].filter(x=>x>0)),exp:`${M(`${big} − ${b} = ${a}`)} ס"מ.`}},
m_perim(d){if(Math.random()<.5){const w=R(3,9),h=R(2,6);const s=`<rect x="70" y="50" width="160" height="90" fill="#a6dc84" stroke="#1f3d12" stroke-width="3"/>`+lbl(150,40,w)+lbl(150,162,w)+lbl(55,95,h)+lbl(245,95,h);
    return{text:'מה ההיקף של המלבן? (מחברים את כל הצלעות)',svg:svgW(s,300,180),...numOpts(2*(w+h),[w+h,w*h,2*w+h]),exp:`${M(`${w} + ${h} + ${w} + ${h} = ${2*(w+h)}`)}`}}
  const a=R(3,9),b=R(3,9),c=R(3,9);const s=`<polygon points="60,150 240,150 150,35" fill="#a6dc84" stroke="#1f3d12" stroke-width="3"/>`+lbl(150,168,a)+lbl(92,88,b)+lbl(208,88,c);
  return{text:'מה ההיקף של המשולש? (מחברים את כל הצלעות)',svg:svgW(s,300,180),...numOpts(a+b+c,[a+b,a+c,a+b+c+1,a*3]),exp:`${M(`${a} + ${b} + ${c} = ${a+b+c}`)}`}},

p_next(d){const sets=[['🟥','🟦','🟨','🟩'],['🍎','🍌','🍇','🍊'],['⭐','🌙','☀️','☁️'],['🐶','🐱','🐭','🐰']];const S0=pick(sets);
  const pat=d===1?pick([[0,1],[0,0,1]]):pick([[0,1,2],[0,1,1],[0,0,1,1],[0,1,2,1]]);const len=pat.length*2+R(0,pat.length-1);
  const seq=[];for(let i=0;i<len;i++)seq.push(S0[pat[i%pat.length]]);const ans=S0[pat[len%pat.length]];
  return{text:'מה בא אחר כך?',svg:`<div class="emo" style="font-size:44px;letter-spacing:6px">${seq.join('')} ❓</div>`,...txtOpts(ans,S0.filter(x=>x!==ans)),cls:'emoji',
   exp:`הדפוס חוזר על עצמו: ${pat.map(i=>S0[i]).join('')} – ושוב מההתחלה. לכן הבא הוא ${ans}.`}},
p_num(d){const st=pick(d===2?[2,5,10]:[2,3,5,10]),down=d===3&&Math.random()<.4;let a=down?R(30,90):R(0,30);a=down?a-a%st:a;
  const seq=[];for(let i=0;i<4;i++)seq.push(down?a-i*st:a+i*st);const ans=down?a-4*st:a+4*st;if(ans<0)return G.p_num(d);
  return{text:`מה המספר הבא? ${M(seq.join(', ')+', ?')}`,...numOpts(ans,[ans+1,ans-1,down?ans-st:ans+st,down?ans+st:ans-st].filter(x=>x>=0)),
   exp:`בכל פעם ${down?'יורדים':'עולים'} ב־${st}: ${M(`${seq[3]} ${down?'−':'+'} ${st} = ${ans}`)}.`}},
p_sym(d){const W=4,H=5,cells=new Set();for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(Math.random()<.45)cells.add(x+','+y);if(cells.size<3)cells.add('3,2').add('2,2').add('3,1');
  const full=new Set();for(const c of cells){const[x,y]=c.split(',').map(Number);full.add(x+','+y);full.add((2*W-1-x)+','+y)}
  const sym=Math.random()<.5;if(!sym){const right=[...full].filter(c=>+c.split(',')[0]>=W);const c=pick(right);full.delete(c);const[x,y]=c.split(',').map(Number);const alt=(Math.min(2*W-1,x+1))+','+((y+1)%H);if(full.has(alt))full.add(x+','+((y+2)%H));else full.add(alt)}
  const u=26,x0=150-W*u,y0=20;let s='';for(let y=0;y<H;y++)for(let x=0;x<2*W;x++)s+=`<rect x="${x0+x*u}" y="${y0+y*u}" width="${u}" height="${u}" fill="${full.has(x+','+y)?'#4aa3df':'#fffdf3'}" stroke="#c9c2a6" stroke-width="1"/>`;
  s+=`<line x1="150" y1="8" x2="150" y2="${y0+H*u+12}" stroke="#d62d20" stroke-width="3.5" stroke-dasharray="8 6"/>`;
  let isSym=true;for(const c of full){const[x,y]=c.split(',').map(Number);if(!full.has((2*W-1-x)+','+y))isSym=false}
  return{text:'האם הקו האדום הוא <b>קו סימטריה</b>? (אם נקפל את הדף לאורך הקו – שני הצדדים יהיו זהים?)',svg:svgW(s,300,170),opts:['✔ כן','✘ לא'],ans:isSym?0:1,
   exp:isSym?'כן! כל משבצת צבועה בצד אחד – יש לה "תאומה" באותו מקום בצד השני, כמו במראה.':'לא. יש משבצות צבועות שאין להן "תאומה" בצד השני של הקו.'}}
};

GAME.missions=[
 {t:'בנו מגדל של 4 קוביות',area:4,tower:1,hint:'מגדל = קוביות אחת מעל השנייה, בעמודה אחת.'},
 {t:'בנו שורה של 6 קוביות',area:6,line:1,hint:'שורה = קוביות אחת ליד השנייה, באותו גובה.'},
 {t:'בנו ריבוע מ־4 קוביות',area:4,square:1,hint:'שתי קוביות למטה ושתי קוביות מעליהן.'},
 {t:'בנו מלבן: 3 קוביות לאורך ו־2 לגובה',area:6,rect:1,w:3,h:2,hint:'שורה של 3 קוביות, ומעליה עוד שורה של 3.'},
 {t:'בנו צורה כלשהי מ־5 קוביות',area:5,hint:'כל צורה טובה – העיקר 5 קוביות שנוגעות זו בזו.'},
 {t:'בנו מגדל של 7 קוביות',area:7,tower:1,hint:'עמודה אחת, 7 קוביות זו מעל זו.'},
 {t:'בנו ריבוע מ־9 קוביות',area:9,square:1,hint:'3 שורות, ובכל שורה 3 קוביות.'},
 {t:'בנו מלבן מ־8 קוביות: 4 לאורך ו־2 לגובה',area:8,rect:1,w:4,h:2,hint:'שתי שורות של 4 קוביות.'},
 {t:'בנו מלבן מ־10 קוביות: 5 לאורך ו־2 לגובה',area:10,rect:1,w:5,h:2,hint:'שתי שורות של 5 קוביות: 5 + 5 = 10.'},
 {t:'בנו מלבן מ־12 קוביות: 4 לאורך ו־3 לגובה',area:12,rect:1,w:4,h:3,hint:'שלוש שורות של 4 קוביות: 4 + 4 + 4 = 12.'},
 {t:'בנו ריבוע מ־16 קוביות',area:16,square:1,hint:'4 שורות, ובכל שורה 4 קוביות.'},
 {t:'בנו צורה כלשהי מ־10 קוביות',area:10,hint:'כל צורה טובה – העיקר 10 קוביות שנוגעות זו בזו. אפשר גם בית או פירמידה!'}];
