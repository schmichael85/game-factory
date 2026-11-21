/* Block World – Geometry, grade 5 */
const GAME={id:'blockGeometry',legacy:'blockGeometryV1',title:'עולם הקוביות',subject:'גאומטריה כיתה ה׳',home:'../',
  tagline:'בחר משחק, אסוף כוכבים ויהלומים ותהיה אלוף הגאומטריה!',builderTopic:'area',
  modes:[{key:'builder',name:'בנאי הקוביות',icon:'🧱',desc:'בנו צורות מקוביות לפי משימות של שטח והיקף.',prefix:'b-',max:36,open:()=>builder(firstOpenMission())},
         {key:'cannon',name:'תותח הזוויות',icon:'🎯',desc:'כוונו את התותח בזווית הנכונה ופגעו במטרות!',prefix:'c-',max:18,open:()=>cannonSel()}]};
const TOPICS={angles:{name:'זוויות',world:'מכרה הזוויות',icon:'📐',c:'#7d7d7d'},shapes:{name:'צורות ומשולשים',world:'יער הצורות',icon:'🔺',c:'#4f9a3a'},area:{name:'היקף ושטח',world:'כפר הבנאים',icon:'🏠'}};
const TYPES={
 ang_classify:['angles','סוגי זוויות (חדה, ישרה, קהה)',1],
 ang_estimate:['angles','הערכת גודל של זווית',1],
 ang_tri:['angles','זווית חסרה במשולש (סכום 180°)',1],
 ang_line:['angles','זוויות צמודות על קו ישר',2],
 ang_right:['angles','השלמה לזווית ישרה',2],
 ang_point:['angles','זוויות סביב נקודה / במרובע (360°)',3],
 sh_tri_sides:['shapes','סוגי משולשים לפי צלעות',1],
 sh_tri_angles:['shapes','סוגי משולשים לפי זוויות',1],
 sh_quad:['shapes','זיהוי מרובעים',1],
 sh_poly:['shapes','שמות של מצולעים',1],
 sh_truth:['shapes','תכונות של צורות (נכון / לא נכון)',2],
 sh_exist:['shapes','האם משולש כזה קיים?',3],
 ar_grid:['area','שטח והיקף על משבצות',1],
 ar_rect_p:['area','היקף מלבן',1],
 ar_rect_a:['area','שטח מלבן',1],
 ar_square:['area','שטח והיקף של ריבוע',2],
 ar_missing:['area','מציאת צלע חסרה',2],
 ar_tri:['area','שטח משולש',3],
 ar_para:['area','שטח מקבילית',3],
 build:['area','בנייה לפי שטח והיקף (בנאי)',1],
 cannon:['angles','הערכת זוויות (תותח)',1]
};

/* svg */
function angleFig(deg,rot=0,noMark=false){
  const flat=rot===0;const cx=150,cy=flat?165:100,L=flat?125:85;
  const p=pt(cx,cy,L,rot),q=pt(cx,cy,L,rot+deg);
  let s=`<line class="ray" x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}"/><line class="ray" x1="${cx}" y1="${cy}" x2="${q[0]}" y2="${q[1]}"/>`;
  s+=(deg===90&&!noMark)?rightMark(cx,cy,rot,20):arc(cx,cy,30,rot,rot+deg);
  s+=`<circle cx="${cx}" cy="${cy}" r="5" fill="#2b1d0e"/>`;return svgW(s)}
function triPts(a,b){const r=Math.PI/180,c=180-a-b;const AC=Math.sin(b*r)/Math.sin(c*r);const P=[[0,0],[1,0],[AC*Math.cos(a*r),AC*Math.sin(a*r)]];
  const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);const mnx=Math.min(...xs),mxx=Math.max(...xs),mxy=Math.max(...ys);
  const sc=Math.min(210/(mxx-mnx),135/mxy);const off=(210-(mxx-mnx)*sc)/2;
  return P.map(p=>[f1(45+(p[0]-mnx)*sc+off),f1(172-p[1]*sc)])}
function triFig(P,labels,sides,extra=''){
  const cen=[(P[0][0]+P[1][0]+P[2][0])/3,(P[0][1]+P[1][1]+P[2][1])/3];
  let s=`<polygon class="shp" points="${P.map(p=>p.join(',')).join(' ')}"/>`;
  if(labels)P.forEach((p,i)=>{if(!labels[i])return;const a=P[(i+1)%3],b=P[(i+2)%3];const u=[a[0]-p[0],a[1]-p[1]],v=[b[0]-p[0],b[1]-p[1]];const lu=Math.hypot(...u),lv=Math.hypot(...v);
    const bx=u[0]/lu+v[0]/lv,by=u[1]/lu+v[1]/lv,bl=Math.hypot(bx,by)||1;const ang=Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(lu*lv))));
    const k=Math.max(28,Math.min(62,Math.min(lu,lv)*.45,24/Math.sin(ang/2)));s+=lbl(p[0]+bx/bl*k,p[1]+by/bl*k,labels[i],labels[i]==='?')});
  if(sides)for(let i=0;i<3;i++){if(sides[i]==null)continue;const p=P[i],q=P[(i+1)%3];const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;const dx=mx-cen[0],dy=my-cen[1],L=Math.hypot(dx,dy)||1;s+=lbl(mx+dx/L*17,my+dy/L*17,sides[i],sides[i]==='?')}
  return svgW(s+extra)}
function tick(p,q,n){const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy);const ux=dx/L,uy=dy/L,nx=-uy,ny=ux;let s='';
  for(let i=0;i<n;i++){const o=(i-(n-1)/2)*7;const cx=mx+ux*o,cy=my+uy*o;s+=`<line class="tick" x1="${f1(cx-nx*8)}" y1="${f1(cy-ny*8)}" x2="${f1(cx+nx*8)}" y2="${f1(cy+ny*8)}"/>`}return s}
function rectFig(w,h,lw,lh){const sc=Math.min(200/w,120/h);const W=w*sc,H=h*sc,x=(300-W)/2,y=(175-H)/2+2;
  return svgW(`<rect class="shp" x="${f1(x)}" y="${f1(y)}" width="${f1(W)}" height="${f1(H)}"/>`+rightMark(x,y+H,0,12)+lbl(150,y+H+18,lw,lw==='?')+lbl(x-20,y+H/2,lh,lh==='?'))}

const POLY=['משולש','מרובע','מחומש','משושה','משובע','מתומן'];
const POLYL=['למשולש','למרובע','למחומש','למשושה','למשובע','למתומן'];
const QUADS=['ריבוע','מלבן','מעוין','מקבילית','טרפז'];
const QEXP=['<b>ריבוע</b>: 4 צלעות שוות ו־4 זוויות ישרות.','<b>מלבן</b>: 4 זוויות ישרות, והצלעות הנגדיות שוות.','<b>מעוין</b>: 4 צלעות שוות, אבל הזוויות אינן ישרות.','<b>מקבילית</b>: שני זוגות של צלעות מקבילות, והזוויות אינן ישרות.','<b>טרפז</b>: רק זוג אחד של צלעות מקבילות.'];
const TRUE_ST=[['כל ריבוע הוא גם מלבן','לריבוע יש 4 זוויות ישרות – ולכן הוא מלבן מיוחד.'],['כל ריבוע הוא גם מעוין','לריבוע יש 4 צלעות שוות – ולכן הוא מעוין מיוחד.'],['סכום הזוויות במרובע הוא 360°','אפשר לחלק כל מרובע לשני משולשים: 180° + 180° = 360°.'],['במשולש שווה צלעות כל זווית היא 60°','180° מתחלקות שווה בשווה בין 3 זוויות: 180 : 3 = 60.'],['במקבילית הצלעות הנגדיות שוות זו לזו','זו אחת התכונות של מקבילית.'],['משולש ישר־זווית יכול להיות גם שווה שוקיים','למשל משולש שהזוויות שלו 90°, 45°, 45°.']];
const FALSE_ST=[['כל מלבן הוא ריבוע','במלבן הצלעות לא חייבות להיות כולן שוות, ולכן לא כל מלבן הוא ריבוע.'],['במשולש יכולות להיות שתי זוויות ישרות','90° + 90° = 180°, ולא נשאר מקום לזווית השלישית.'],['במעוין כל הזוויות שוות','במעוין הצלעות שוות, אבל הזוויות לא חייבות להיות שוות.'],['לטרפז יש שני זוגות של צלעות מקבילות','לטרפז יש רק זוג אחד של צלעות מקבילות.'],['משולש יכול להיות גם ישר־זווית וגם קהה־זווית','90° ועוד זווית שגדולה מ־90° זה כבר יותר מ־180°.'],['סכום הזוויות במשולש הוא 360°','סכום הזוויות במשולש הוא 180°.'],['לכל מקבילית יש 4 זוויות ישרות','רק למלבן (וגם לריבוע) יש 4 זוויות ישרות.']];

function polyomino(n,W=7,H=5){const set=new Set(['3,2']);let guard=0;while(set.size<n&&guard++<500){const[x,y]=pick([...set]).split(',').map(Number);const[dx,dy]=pick([[1,0],[-1,0],[0,1],[0,-1]]);const nx=x+dx,ny=y+dy;if(nx>=0&&nx<W&&ny>=0&&ny<H)set.add(nx+','+ny)}return[...set].map(s=>s.split(',').map(Number))}

const G={
ang_classify(d){let k=Math.random()<.15?3:R(0,2),deg;
  if(k===0)deg=d===1?R(4,14)*5:R(3,16)*5;else if(k===1)deg=90;else if(k===2)deg=d===1?R(22,32)*5:R(20,33)*5;else deg=180;
  const txt=d>=2&&Math.random()<.5;
  return{text:txt?`זווית של ${M(deg+'°')} היא זווית…`:'איזו זווית מופיעה בציור?',svg:txt?'':angleFig(deg,d>=2?R(0,5)*30:0),
   opts:['חדה','ישרה','קהה','שטוחה'],ans:k,exp:'זווית <b>חדה</b> קטנה מ־90°. זווית <b>ישרה</b> שווה בדיוק ל־90°. זווית <b>קהה</b> גדולה מ־90° וקטנה מ־180°. זווית <b>שטוחה</b> שווה ל־180° – היא נראית כמו קו ישר.'}},
ang_estimate(d){const deg=R(2,34)*5,sp=d===1?40:d===2?25:15;
  const ex=[deg+sp,deg-sp,deg+2*sp,deg-2*sp,deg+3*sp,deg-3*sp].filter(v=>v>=5&&v<=175);
  return{text:'בערך כמה מעלות יש בזווית?',svg:angleFig(deg,d===3?R(0,5)*30:0,true),...numOpts(deg,ex,'°'),
   exp:`הזווית היא ${M(deg+'°')}. טיפ: השוו אותה לזווית ישרה (90°) – ${deg===90?'זו בדיוק זווית ישרה!':deg<90?'היא קטנה ממנה, כלומר חדה.':'היא גדולה ממנה, כלומר קהה.'}`}},
ang_tri(d){let a,b,c;do{if(d===1){a=R(3,10)*10;b=R(3,10)*10}else if(d===2){a=R(5,24)*5;b=R(5,24)*5}else{a=R(20,110);b=R(20,110)}c=180-a-b}while(c<20);
  return{text:'מה גודל הזווית שמסומנת בסימן שאלה?',svg:triFig(triPts(a,b),[a+'°',b+'°','?']),...numOpts(c,[a+b,360-a-b,c+10,c-10,180-a,180-b],'°'),
   exp:`סכום הזוויות בכל משולש הוא 180°, ולכן: ${M(`180 − ${a} − ${b} = ${c}`)}`}},
ang_line(d){const x=R(3,33)*5,y=180-x,cx=150,cy=150;const q=pt(cx,cy,125,x);
  let s=`<line class="ray" x1="20" y1="150" x2="280" y2="150"/><line class="ray" x1="${cx}" y1="${cy}" x2="${q[0]}" y2="${q[1]}"/>`+arc(cx,cy,30,0,x)+arc(cx,cy,22,x,180,'arc2');
  const p1=pt(cx,cy,56,x/2),p2=pt(cx,cy,52,(x+180)/2);s+=lbl(p1[0],p1[1],x+'°')+lbl(p2[0],p2[1],'?',true)+`<circle cx="${cx}" cy="${cy}" r="5" fill="#2b1d0e"/>`;
  return{text:'שתי הזוויות יחד יוצרות קו ישר. מה גודל הזווית שמסומנת בסימן שאלה?',svg:svgW(s),...numOpts(y,[90-x,360-x,x,y+10,y-10],'°'),
   exp:`זוויות צמודות יוצרות יחד קו ישר, ולכן סכומן 180°: ${M(`180 − ${x} = ${y}`)}`}},
ang_right(d){const x=R(2,16)*5,y=90-x,cx=95,cy=175;const p=pt(cx,cy,140,0),u=pt(cx,cy,140,90),m=pt(cx,cy,140,x);
  let s=`<line class="ray" x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}"/><line class="ray" x1="${cx}" y1="${cy}" x2="${u[0]}" y2="${u[1]}"/><line class="ray" x1="${cx}" y1="${cy}" x2="${m[0]}" y2="${m[1]}"/>`;
  s+=rightMark(cx,cy,0,13)+arc(cx,cy,42,0,x)+arc(cx,cy,34,x,90,'arc2');const l1=pt(cx,cy,x<30?105:72,x/2),l2=pt(cx,cy,y<30?105:72,(x+90)/2);s+=lbl(l1[0],l1[1],x+'°')+lbl(l2[0],l2[1],'?',true);
  return{text:'הזווית הגדולה היא זווית ישרה. מה גודל הזווית שמסומנת בסימן שאלה?',svg:svgW(s),...numOpts(y,[180-x,x,y+10,y-5,90+x],'°'),
   exp:`זווית ישרה היא 90°, ולכן: ${M(`90 − ${x} = ${y}`)}`}},
ang_point(d){let a,b,c,e;do{a=R(8,28)*5;b=R(8,28)*5;c=R(8,28)*5;e=360-a-b-c}while(e<45||e>150);
  if(Math.random()<.5){const cx=150,cy=100;const angs=[0,a,a+b,a+b+c];let s='';
    angs.forEach(t=>{const q=pt(cx,cy,88,t);s+=`<line class="ray" x1="${cx}" y1="${cy}" x2="${q[0]}" y2="${q[1]}"/>`});
    const vals=[a,b,c,'?'],sz=[a,b,c,e];angs.forEach((t,i)=>{const l=pt(cx,cy,52,t+sz[i]/2);s+=lbl(l[0],l[1],vals[i]==='?'?'?':vals[i]+'°',vals[i]==='?')});
    s+=`<circle cx="${cx}" cy="${cy}" r="5" fill="#2b1d0e"/>`;
    return{text:'ארבע זוויות סביב נקודה אחת. מה גודל הזווית שמסומנת בסימן שאלה?',svg:svgW(s),...numOpts(e,[180-a-b,e+10,e-10,360-a-b,e+20],'°'),
     exp:`זוויות סביב נקודה משלימות סיבוב שלם – 360°: ${M(`360 − ${a} − ${b} − ${c} = ${e}`)}`}}
  return{text:`במרובע יש שלוש זוויות בגודל ${M(a+'°, '+b+'°, '+c+'°')}. מה גודל הזווית הרביעית?`,svg:'',...numOpts(e,[180-a,e+10,e-10,e+20,Math.abs(180-a-b)],'°'),
   exp:`סכום הזוויות במרובע הוא 360°: ${M(`360 − ${a} − ${b} − ${c} = ${e}`)}`}},
sh_tri_sides(d){const k=R(0,2);let a,b;if(k===0){a=b=60}else if(k===1){a=b=pick([40,45,50,70,75])}else{[a,b]=pick([[40,75],[35,60],[50,80],[30,65],[45,95],[70,40],[55,35]])}
  const P=triPts(a,b);const len=i=>Math.hypot(P[i][0]-P[(i+1)%3][0],P[i][1]-P[(i+1)%3][1]);const L=[len(0),len(1),len(2)],mx=Math.max(...L),tg=R(8,15);
  let n=L.map(v=>Math.max(3,Math.round(v/mx*tg)));
  if(k===0)n=[tg,tg,tg];if(k===1){n[2]=n[1];if(n[0]===n[1])n[0]+=n[0]>4?-2:2}if(k===2){let g=0;while(new Set(n).size<3&&g++<20)n[R(0,2)]++}
  const names=['שווה צלעות','שווה שוקיים','שונה צלעות'];const ex=['במשולש <b>שווה צלעות</b> כל שלוש הצלעות שוות.','במשולש <b>שווה שוקיים</b> יש שתי צלעות שוות (השוקיים).','במשולש <b>שונה צלעות</b> כל הצלעות באורכים שונים.'];
  const txt=d>=2&&Math.random()<.5;
  return{text:txt?`אורכי הצלעות של משולש הם ${M(shuffle(n).join(', '))} ס"מ. איזה משולש זה?`:'איזה משולש מופיע בציור? (אורכי הצלעות בס"מ)',svg:txt?'':triFig(P,null,n),opts:names,ans:k,exp:ex[k]+' '+ex.filter((_,i)=>i!==k).join(' ')}},
sh_tri_angles(d){const k=R(0,2);let a,b;
  if(k===0){do{a=R(10,16)*5;b=R(10,16)*5}while(180-a-b<25||180-a-b>=90)}else if(k===1){a=90;b=R(5,13)*5}else{a=R(20,26)*5;b=R(4,Math.floor((150-a)/5))*5}
  const A=[a,b,180-a-b];
  const swap=Math.random()<.5;const P2=swap?triPts(b,a):triPts(a,b);const labs=swap?[b,a,180-a-b]:[a,b,180-a-b];
  const names=['חד־זווית','ישר־זווית','קהה־זווית'];const ex=['במשולש <b>חד־זווית</b> כל שלוש הזוויות חדות (קטנות מ־90°).','במשולש <b>ישר־זווית</b> יש זווית של 90°.','במשולש <b>קהה־זווית</b> יש זווית אחת שגדולה מ־90°.'];
  const txt=d>=2&&Math.random()<.5;
  return{text:txt?`הזוויות של משולש הן ${M(shuffle(A).map(v=>v+'°').join(', '))}. איזה משולש זה?`:'איזה משולש מופיע בציור?',svg:txt?'':triFig(P2,labs.map(v=>v+'°')),opts:names,ans:k,exp:ex[k]+' '+ex.filter((_,i)=>i!==k).join(' ')}},
sh_quad(d){const k=R(0,4);let P,ex='';
  if(k===0){P=[[90,35],[210,35],[210,155],[90,155]];ex=rightMark(90,155,0,12)+rightMark(210,155,90,12)+[0,1,2,3].map(i=>tick(P[i],P[(i+1)%4],1)).join('')}
  else if(k===1){P=[[45,55],[255,55],[255,150],[45,150]];ex=rightMark(45,150,0,12)+rightMark(255,150,90,12)+tick(P[0],P[1],1)+tick(P[2],P[3],1)+tick(P[1],P[2],2)+tick(P[3],P[0],2)}
  else if(k===2){P=[[65,160],[175,160],[230,65],[120,65]];ex=[0,1,2,3].map(i=>tick(P[i],P[(i+1)%4],1)).join('')}
  else if(k===3){P=[[40,160],[200,160],[260,70],[100,70]];ex=tick(P[0],P[1],1)+tick(P[2],P[3],1)+tick(P[1],P[2],2)+tick(P[3],P[0],2)}
  else{P=[[40,160],[260,160],[205,60],[105,60]]}
  const wr=shuffle(QUADS.filter((_,i)=>i!==k)).slice(0,3);
  return{text:'מה השם המדויק ביותר של הצורה?',svg:polyFig(P,ex),...txtOpts(QUADS[k],wr),exp:QEXP[k]+(k<2?' (ריבוע הוא גם מלבן וגם מעוין, אבל "ריבוע" הוא השם המדויק ביותר.)':'')}},
sh_poly(d){const i=R(0,5),n=i+3;
  if(d>=2&&Math.random()<.5){return{text:`כמה צלעות יש ${POLYL[i]}?`,svg:'',...numOpts(n,[n+1,n-1,n+2,n-2].filter(v=>v>=3)),exp:`${POLYL[i]} יש ${n} צלעות (ו־${n} קודקודים).`}}
  const P=[];for(let j=0;j<n;j++){const a=-90+j*360/n;P.push([f1(150+80*Math.cos(a*Math.PI/180)),f1(102+80*Math.sin(a*Math.PI/180))])}
  const wr=shuffle(POLY.filter((_,j)=>j!==i)).slice(0,3);
  return{text:'מה שם המצולע? (ספרו את הצלעות)',svg:polyFig(P),...txtOpts(POLY[i],wr),exp:`למצולע הזה יש ${n} צלעות, ולכן הוא ${POLY[i]}.`}},
sh_truth(d){const askTrue=Math.random()<.5;
  if(askTrue){const t=pick(TRUE_ST),f=shuffle(FALSE_ST).slice(0,3);return{text:'איזו טענה <b>נכונה</b>?',svg:'',...txtOpts(t[0],f.map(x=>x[0])),exp:t[1]}}
  const f=pick(FALSE_ST),t=shuffle(TRUE_ST).slice(0,3);return{text:'איזו טענה <b>לא נכונה</b>?',svg:'',...txtOpts(f[0],t.map(x=>x[0])),exp:f[1]}},
sh_exist(d){const fmt=a=>M(a.map(v=>v+'°').join(', '));let a=R(4,14)*5,b=R(4,Math.floor((175-a)/5)-1)*5;const good=[a,b,180-a-b];
  const bads=[];const deltas=shuffle([10,-10,20,-20,30,5,-5]);for(const dd of deltas){if(bads.length>=3)break;const x=R(4,12)*5,y=R(4,12)*5,z=180+dd-x-y;if(z>0)bads.push([x,y,z])}
  while(bads.length<3)bads.push([90,90,10]);
  const arr=shuffle([good,...bads]);return{text:'איזו שלישייה יכולה להיות הזוויות של משולש?',svg:'',opts:arr.map(fmt),ans:arr.indexOf(good),
   exp:`רק שלישייה שסכומה בדיוק 180° יכולה להיות זוויות של משולש: ${M(`${good[0]} + ${good[1]} + ${good[2]} = 180`)}`}},
ar_grid(d){const n=d===1?R(4,8):R(5,10);const cells=polyomino(n);const p=perimOf(cells);const askP=d>=2&&Math.random()<.55;const cs=30,ox=45,oy=25;
  let s='';for(let x=0;x<=7;x++)s+=`<line class="grid" x1="${ox+x*cs}" y1="${oy}" x2="${ox+x*cs}" y2="${oy+5*cs}"/>`;for(let y=0;y<=5;y++)s+=`<line class="grid" x1="${ox}" y1="${oy+y*cs}" x2="${ox+7*cs}" y2="${oy+y*cs}"/>`;
  cells.forEach(([x,y])=>s+=`<rect class="cell" x="${ox+x*cs}" y="${oy+y*cs}" width="${cs}" height="${cs}"/>`);
  if(!askP)return{text:'כל משבצת היא סמ"ר אחד. מה השטח של הצורה הירוקה?',svg:svgW(s),...numOpts(n,[p,n+1,n-1,n+2],' סמ"ר'),exp:`סופרים את המשבצות הירוקות: יש ${n} משבצות, ולכן השטח הוא ${n} סמ"ר.`};
  return{text:'הצלע של כל משבצת היא 1 ס"מ. מה ההיקף של הצורה הירוקה?',svg:svgW(s),...numOpts(p,[n,p+2,p-2,p+1],' ס"מ'),exp:`ההיקף הוא האורך של כל הקו שמקיף את הצורה. סופרים את כל הצלעות החיצוניות: ${p} ס"מ. (שימו לב: ${n} זה מספר המשבצות – זה השטח, לא ההיקף.)`}},
ar_rect_p(d){const mx=d===1?10:d===2?15:25;let w=R(2,mx),h=R(2,mx);if(w===h)w++;if(h>w)[w,h]=[h,w];const p=2*(w+h);
  return{text:'מה ההיקף של המלבן? (האורכים בס"מ)',svg:rectFig(w,h,w,h),...numOpts(p,[w*h,w+h,2*w+h,p+2],' ס"מ'),exp:`היקף = סכום כל הצלעות: ${M(`${w} + ${h} + ${w} + ${h} = ${p}`)} ס"מ.`}},
ar_rect_a(d){const mx=d===1?9:d===2?12:20;let w=R(2,mx),h=R(2,Math.min(mx,12));if(w===h)w++;if(h>w)[w,h]=[h,w];const a=w*h;
  return{text:'מה השטח של המלבן? (האורכים בס"מ)',svg:rectFig(w,h,w,h),...numOpts(a,[2*(w+h),w+h,a+w,a-h],' סמ"ר'),exp:`שטח מלבן = אורך × רוחב: ${M(`${w} × ${h} = ${a}`)} סמ"ר.`}},
ar_square(d){const s=R(2,12);const v=pick(d>=3?['sa','sp','ps','as']:['sa','sp']);
  if(v==='sa')return{text:'מה השטח של הריבוע? (אורך הצלע בס"מ)',svg:rectFig(1,1,s,s),...numOpts(s*s,[4*s,2*s,s*s+s,s*s-s],' סמ"ר'),exp:`שטח ריבוע = צלע × צלע: ${M(`${s} × ${s} = ${s*s}`)} סמ"ר.`};
  if(v==='sp')return{text:'מה ההיקף של הריבוע? (אורך הצלע בס"מ)',svg:rectFig(1,1,s,s),...numOpts(4*s,[s*s,2*s,3*s,4*s+4],' ס"מ'),exp:`לריבוע 4 צלעות שוות: ${M(`4 × ${s} = ${4*s}`)} ס"מ.`};
  if(v==='ps')return{text:`ההיקף של ריבוע הוא ${4*s} ס"מ. מה אורך הצלע שלו?`,svg:'',...numOpts(s,[2*s,s+2,s-1,4*s-4].filter(x=>x!==4*s),' ס"מ'),exp:`לריבוע 4 צלעות שוות, ולכן: ${M(`${4*s} : 4 = ${s}`)} ס"מ.`};
  return{text:`השטח של ריבוע הוא ${s*s} סמ"ר. מה אורך הצלע שלו?`,svg:'',...numOpts(s,[s*s/2,s+1,s-1,s*s/4,2*s],' ס"מ'),exp:`מחפשים מספר שכפול עצמו נותן ${s*s}: ${M(`${s} × ${s} = ${s*s}`)}, ולכן הצלע היא ${s} ס"מ.`}},
ar_missing(d){let w=R(2,10),h=R(2,10);if(w===h)h=h<10?h+1:h-1;
  if(Math.random()<.5){const A=w*h;return{text:`השטח של המלבן הוא ${A} סמ"ר. מה אורך הצלע שמסומנת בסימן שאלה? (בס"מ)`,svg:rectFig(w,h,w,'?'),...numOpts(h,[A-w,A/2,h+1,h-1,w],' ס"מ'),exp:`שטח = אורך × רוחב, ולכן: ${M(`${A} : ${w} = ${h}`)} ס"מ.`}}
  const P=2*(w+h);return{text:`ההיקף של המלבן הוא ${P} ס"מ. מה אורך הצלע שמסומנת בסימן שאלה? (בס"מ)`,svg:rectFig(w,h,w,'?'),...numOpts(h,[P-w,P/2,P/2-w+1,P-2*w,h+2],' ס"מ'),
   exp:`חצי מההיקף (${P/2}) הוא צלע ארוכה אחת ועוד צלע קצרה אחת, ולכן: ${M(`${P/2} − ${w} = ${h}`)} ס"מ.`}},
ar_tri(d){let b,h;do{b=R(4,16);h=R(3,12)}while((b*h)%2);const ans=b*h/2;
  const hp=Math.min(130,Math.max(60,h/b*220)),ax=R(90,210),ay=172-hp;
  const P=[[40,172],[260,172],[ax,f1(ay)]];
  const ex=`<line class="dash" x1="${ax}" y1="${f1(ay)}" x2="${ax}" y2="172"/>`+rightMark(ax,172,0,10)+lbl(150,190,b)+lbl(ax+18,ay+hp/2,h,false);
  return{text:'מה השטח של המשולש? (הבסיס והגובה בס"מ, הגובה מסומן בקו מקווקו)',svg:triFig(P,null,null,ex).replace('viewBox="0 0 300 200"','viewBox="0 0 300 205"'),...numOpts(ans,[b*h,b+h,2*(b+h),ans+b],' סמ"ר'),
   exp:`שטח משולש = (בסיס × גובה) : 2 = ${M(`(${b} × ${h}) : 2 = ${ans}`)} סמ"ר. (בלי החלוקה ב־2 היינו מקבלים שטח של מלבן שלם.)`}},
ar_para(d){const b=R(4,14),h=R(3,10),s=h+R(1,4);const ans=b*h;
  const P=[[45,165],[200,165],[255,60],[100,60]];
  const ex=`<line class="dash" x1="100" y1="60" x2="100" y2="165"/>`+rightMark(100,165,0,10)+lbl(122,185,b)+lbl(112,118,h)+lbl(58,105,s);
  return{text:'מה השטח של המקבילית? (האורכים בס"מ, הגובה מסומן בקו מקווקו)',svg:polyFig(P,ex),...numOpts(ans,[b*s,2*(b+s),ans%2?ans+1:ans/2,b+h],' סמ"ר'),
   exp:`שטח מקבילית = בסיס × גובה: ${M(`${b} × ${h} = ${ans}`)} סמ"ר. שימו לב: משתמשים בגובה (הקו המקווקו), לא בצלע המשופעת (${s}).`}}
};

/* builder missions */
const GEO_MISSIONS=[
 {t:'בנו מלבן ששטחו 6 משבצות',area:6,rect:1},
 {t:'בנו ריבוע ששטחו 9 משבצות',area:9,square:1},
 {t:'בנו צורה כלשהי ששטחה 7 משבצות',area:7},
 {t:'בנו מלבן שהיקפו 12',perim:12,rect:1},
 {t:'בנו ריבוע שהיקפו 16',perim:16,square:1},
 {t:'בנו מלבן ששטחו 12 משבצות והיקפו 14',area:12,perim:14,rect:1},
 {t:'בנו מלבן ששטחו 12 משבצות והיקפו 16',area:12,perim:16,rect:1},
 {t:'בנו מלבן ששטחו 16 משבצות – אבל שלא יהיה ריבוע!',area:16,rect:1,notSquare:1},
 {t:'בנו צורה ששטחה 6 משבצות והיקפה 14',area:6,perim:14},
 {t:'בנו צורה ששטחה 5 משבצות והיקפה 12',area:5,perim:12},
 {t:'בנו צורה ששטחה 8 משבצות והיקפה 16',area:8,perim:16},
 {t:'בנו מלבן ששטחו 24 משבצות והיקפו 20',area:24,perim:20,rect:1}];
GAME.missions=GEO_MISSIONS;
function firstOpenMission(){return firstOpen(GAME.missions.length,'b-')}

/* ---------- CANNON ---------- */
/* ---------- CANNON ---------- */
const CL=[{prot:'full',tol:8},{prot:'full',tol:6},{prot:'half',tol:8},{prot:'half',tol:6},{prot:'none',tol:8},{prot:'none',tol:6}];
function cannonSel(){setMode('cannon');clearTimers();
  let h=`<div class="panel"><h2>🎯 תותח הזוויות</h2><div style="font-size:17px">התותח עומד על הקרקע. <b>0°</b> זה ימינה לאורך הקרקע, <b>90°</b> זה ישר למעלה, ו־<b>180°</b> זה שמאלה. הקלידו את הזווית של המטרה ולחצו "אש!". בכל שלב 8 מטרות.</div></div><div class="panel"><div class="lvls">`;
  CL.forEach((c,i)=>{const open=i===0||(S.stars['c-'+(i-1)]||0)>0;h+=`<button class="lv" ${open?'':'disabled'} data-i="${i}">${open?i+1:'🔒'}<span class="s">${open?smallStars(S.stars['c-'+i]||0):''}</span></button>`});
  h+=`</div><div class="muted" style="margin-top:8px">שלבים 1–2: מד־זווית מלא · 3–4: מד־זווית חלקי · 5–6: בלי מד־זווית – רק הערכה! ⭐ = 4 פגיעות · ⭐⭐ = 6 · ⭐⭐⭐ = 7</div></div>`;
  scr('cansel').innerHTML=fixDeg(h);$('#scr-cansel').querySelectorAll('.lv').forEach(b=>b.onclick=()=>{SND.click();startCannon(+b.dataset.i)});show('cansel')}
let CN={};const CX=300,CY=300;
function startCannon(lv){clearTimers();CN={lv,shot:0,hits:0,n:8,aim:90,target:0,busy:false,prev:-99};const c=CL[lv];
  let prot='';if(c.prot!=='none'){prot+=`<path d="M${CX-170} ${CY} A170 170 0 0 1 ${CX+170} ${CY} Z" fill="#ffffff66" stroke="#555" stroke-width="2"/>`;
    const step=c.prot==='full'?10:45;for(let a=0;a<=180;a+=c.prot==='full'?5:15){const big=a%step===0;const p=pt(CX,CY,170,a),q=pt(CX,CY,big?150:160,a);prot+=`<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#333" stroke-width="${big?2.5:1.2}"/>`;
      if(big&&(c.prot!=='full'||a%30===0)){const l=pt(CX,CY,134,a);prot+=`<text x="${l[0]}" y="${l[1]+5}" font-size="14" font-weight="800" text-anchor="middle" fill="#222">${a}</text>`}}}
  prot+=`<text x="${CX+250}" y="${CY+28}" font-size="18" font-weight="800" fill="#fff" text-anchor="middle">0°</text><text x="${CX-250}" y="${CY+28}" font-size="18" font-weight="800" fill="#fff" text-anchor="middle">180°</text><text x="${CX}" y="22" font-size="18" font-weight="800" fill="#1d3b6b" text-anchor="middle">90° ↑</text>`;
  scr('cannon').innerHTML=`<div class="panel"><div class="phead"><div class="big">🎯 שלב ${lv+1}</div><div class="big">מטרה <span id="cShot">1</span>/8 · פגיעות: <span id="cHits">0</span></div></div>
   <svg class="cv" viewBox="0 0 600 340" id="cv"><rect x="0" y="${CY}" width="600" height="40" fill="#8a5a32"/><rect x="0" y="${CY}" width="600" height="10" fill="#5fae3a"/>
    ${prot}<g id="rev"></g><g id="tgt"></g>
    <g id="barrel" transform="rotate(-90 ${CX} ${CY})"><rect x="${CX}" y="${CY-9}" width="70" height="18" fill="#3a3a3a" stroke="#111" stroke-width="2"/><rect x="${CX+58}" y="${CY-11}" width="14" height="22" fill="#222"/></g>
    <rect x="${CX-22}" y="${CY-14}" width="44" height="24" fill="#7a7a7a" stroke="#222" stroke-width="3"/><circle cx="${CX}" cy="${CY}" r="7" fill="#222"/>
    <rect id="ball" x="-20" y="-20" width="12" height="12" fill="#222"/><g id="parts"></g></svg>
   <div class="row" style="justify-content:center;margin-top:12px"><button class="btn stone" data-d="-10">−10</button><button class="btn stone" data-d="-1">−1</button>
    <input class="num" id="cIn" type="number" min="0" max="180" inputmode="numeric" placeholder="?"><span class="big">°</span>
    <button class="btn stone" data-d="1">+1</button><button class="btn stone" data-d="10">+10</button><button class="btn red" id="fire">💥 אש!</button></div>
   <div class="fb center" id="cfb"></div></div><div class="center"><button class="btn stone" id="cBack">↩ חזרה</button></div>`;
  $('#scr-cannon').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const v=parseInt($('#cIn').value);$('#cIn').value=Math.max(0,Math.min(180,(isNaN(v)?90:v)+ +b.dataset.d))});
  $('#fire').onclick=fire;$('#cIn').addEventListener('keydown',e=>{if(e.key==='Enter')fire()});$('#cBack').onclick=()=>{clearTimers();cannonSel()};
  show('cannon');newTarget()}
function newTarget(){let a;do{a=R(2,34)*5}while(Math.abs(a-CN.prev)<20);CN.prev=a;CN.target=a;CN.busy=false;
  const p=pt(CX,CY,235,a);CN.tp=p;$('#tgt').innerHTML=`<g><rect x="${p[0]-18}" y="${p[1]-18}" width="36" height="36" fill="#c9a26b" stroke="#5a3d1a" stroke-width="3"/><circle cx="${p[0]}" cy="${p[1]}" r="13" fill="#fff" stroke="#c9302c" stroke-width="5"/><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#c9302c"/></g>`;
  $('#rev').innerHTML='';$('#cfb').innerHTML='<span class="muted">באיזו זווית נמצאת המטרה?</span>';$('#cShot').textContent=CN.shot+1;$('#cIn').value='';$('#fire').disabled=false;setTimeout(()=>{try{$('#cIn').focus()}catch(e){}},50)}
function anim(dur,step,done){const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/dur);step(k);if(k<1)requestAnimationFrame(f);else done&&done()};requestAnimationFrame(f)}
function fire(){if(CN.busy)return;const v=parseInt($('#cIn').value);if(isNaN(v)||v<0||v>180){$('#cfb').innerHTML='<span style="color:#c9302c;font-weight:700">הקלידו מספר בין 0 ל־180</span>';return}
  CN.busy=true;$('#fire').disabled=true;const from=CN.aim;
  anim(450,k=>{CN.aim=from+(v-from)*k;$('#barrel').setAttribute('transform',`rotate(${-CN.aim} ${CX} ${CY})`)},()=>{SND.shoot();const ball=$('#ball');
    anim(500,k=>{const p=pt(CX,CY,70+220*k,v);ball.setAttribute('x',p[0]-6);ball.setAttribute('y',p[1]-6)},()=>{ball.setAttribute('x',-20);
      const hit=Math.abs(v-CN.target)<=CL[CN.lv].tol;CN.shot++;if(hit)CN.hits++;record('cannon','angles',hit);
      const q=pt(CX,CY,235,CN.target);$('#rev').innerHTML=`<line x1="${CX}" y1="${CY}" x2="${q[0]}" y2="${q[1]}" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/>`+arc(CX,CY,60,0,CN.target).replace('class="arc"','fill="none" stroke="#ffd23f" stroke-width="5"')+(()=>{const l=pt(CX,CY,92,CN.target/2);return`<text x="${l[0]}" y="${l[1]+6}" font-size="20" font-weight="800" text-anchor="middle" fill="#ffd23f" stroke="#000" stroke-width="1">${CN.target}°</text>`})();
      $('#cHits').textContent=CN.hits;
      if(hit){SND.boom();explode(CN.tp);$('#tgt').innerHTML='';$('#cfb').innerHTML=`<div class="good">🎯 פגיעה! המטרה הייתה ב־${M(CN.target+'°')} וירית ב־${M(v+'°')}</div>`}
      else{SND.bad();const df=Math.abs(v-CN.target);$('#cfb').innerHTML=`<div class="bad">פספוס! ירית ב־${M(v+'°')}, והמטרה הייתה ב־${M(CN.target+'°')} (הפרש של ${df}°). ${v<CN.target?'היה צריך זווית גדולה יותר – יותר שמאלה.':'היה צריך זווית קטנה יותר – יותר ימינה.'}</div>`}
      timers.push(setTimeout(()=>{if(CN.shot>=CN.n)finishCannon();else newTarget()},hit?1700:2800))})})}
function explode(p){const g=$('#parts');let h='';const ps=[];for(let i=0;i<14;i++){ps.push({x:p[0],y:p[1],vx:R(-90,90),vy:R(-140,20),c:pick(['#c9a26b','#c9302c','#fff','#5a3d1a'])})}
  anim(700,k=>{h='';ps.forEach(o=>{const x=o.x+o.vx*k,y=o.y+o.vy*k+160*k*k;h+=`<rect x="${f1(x)}" y="${f1(y)}" width="8" height="8" fill="${o.c}" opacity="${1-k}"/>`});g.innerHTML=h},()=>g.innerHTML='')}
function finishCannon(){const st=CN.hits>=7?3:CN.hits>=6?2:CN.hits>=4?1:0;if(st)setStars('c-'+CN.lv,st);addHistory('cannon',`שלב ${CN.lv+1}: ${CN.hits}/8 פגיעות`,st);st?SND.win():SND.bad();
  results({title:st?'כל הכבוד, תותחן!':'נסו שוב!',stars:st,line:`פגעת ב־${CN.hits} מתוך 8 מטרות.${st?'':' צריך לפחות 4 כדי לעבור.'}`,again:()=>startCannon(CN.lv),back:cannonSel,next:st&&CN.lv<5?()=>startCannon(CN.lv+1):null,mode:'cannon'})}
