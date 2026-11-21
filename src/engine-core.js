/* ========== modes ========== */
const MODES=Object.assign({quest:{name:'מסע הכרייה',icon:'⛏️'},arcade:{name:'מרוץ נגד השעון',icon:'⏱️'}},
  Object.fromEntries((GAME.modes||[]).map(m=>[m.key,{name:m.name,icon:m.icon}])));
const TKEYS=Object.keys(TOPICS);
const ARC_T=GAME.arcadeTime||60,ARC_ST=GAME.arcadeStars||[6,10,14],ARC_PEN=GAME.wrongPenalty??3;
const QUEST_MAX=TKEYS.length*18,ARC_MAX=(TKEYS.length+1)*3;
const MAX_STARS=QUEST_MAX+ARC_MAX+(GAME.modes||[]).reduce((a,m)=>a+m.max,0);

/* ========== storage: players are shared by all games on this device ========== */
const PKEY='gameFactoryPlayers',DPRE=GAME.id+'V1_';
let KEY=null,P={list:[],cur:null},S=null;
function saveP(){try{localStorage.setItem(PKEY,JSON.stringify(P))}catch(e){}}
function loadP(){let o=null;try{o=JSON.parse(localStorage.getItem(PKEY)||'null')}catch(e){}
  if(o&&Array.isArray(o.list))P=o;
  else{P={list:[],cur:null};/* earlier version kept players per game */
    try{const old=JSON.parse(localStorage.getItem('blockGeometryPlayers')||'null');if(old&&Array.isArray(old.list)){P.list=old.list.slice();P.cur=old.cur}}catch(e){}}
  /* oldest version: one save without profiles */
  if(GAME.legacy)try{const old=localStorage.getItem(GAME.legacy);if(old){const d=JSON.parse(old)||{};const id='p'+Date.now();
    localStorage.setItem(DPRE+id,old);P.list.push({id,name:d.name||'שחקן '+(P.list.length+1)});P.cur=id;localStorage.removeItem(GAME.legacy)}}catch(e){}
  saveP()}
function zeros(v){return Object.fromEntries(Object.keys(MODES).map(k=>[k,typeof v==='function'?v():v]))}
function defState(){return{stars:{},best:{},stats:{},topics:Object.fromEntries(TKEYS.map(k=>[k,{c:0,t:0}])),
  modeTime:zeros(0),modePlays:zeros(0),ratings:zeros(()=>[]),sessions:0,gems:0,totalTime:0,history:[],mute:false,name:''}}
function load(){const d=defState();let o={};try{o=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){}
  S=Object.assign(d,o);for(const k of ['topics','modeTime','modePlays','ratings'])S[k]=Object.assign(defState()[k],o[k]||{})}
function save(){if(!KEY)return;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function totalStars(){return Object.values(S.stars).reduce((a,b)=>a+b,0)}
function starsWith(pre){return Object.keys(S.stars).filter(k=>k.startsWith(pre)).reduce((a,k)=>a+S.stars[k],0)}
function setStars(k,n){if((S.stars[k]||0)<n)S.stars[k]=n;save();hud()}
function hud(){$('#gameTitle').textContent=GAME.title+(S.name?' של '+S.name:'');$('#hudStars').textContent='⭐ '+totalStars();$('#hudGems').textContent='💎 '+S.gems;$('#muteBtn').textContent=S.mute?'🔇':'🔊'}
function record(type,topic,ok){const st=S.stats[type]||(S.stats[type]={c:0,t:0});st.t++;if(ok)st.c++;
  const tp=S.topics[topic];if(tp){tp.t++;if(ok)tp.c++}if(ok)S.gems++;save();hud()}
function addHistory(mode,detail,stars){const d=new Date();
  S.history.unshift({d:d.toLocaleDateString('he-IL')+' '+d.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}),m:mode,x:detail,s:stars});
  S.history=S.history.slice(0,40);S.modePlays[mode]=(S.modePlays[mode]||0)+1;save()}

/* ========== question picking ========== */
let lastType='';
function gen(topic,d){const ok=k=>TYPES[k]&&TYPES[k][0]===topic&&TYPES[k][2]<=d;let cands=Object.keys(G).filter(k=>ok(k)&&k!==lastType);if(!cands.length)cands=Object.keys(G).filter(ok);
  const w=[];cands.forEach(k=>{const n=TYPES[k][2]===d?2:1;for(let i=0;i<n;i++)w.push(k)});
  const t=pick(w);lastType=t;const q=G[t](d);q.type=t;q.topic=topic;return q}

/* ========== screens ========== */
let curMode=null;
function show(id){let el=$('#scr-'+id);if(!el){el=document.createElement('section');el.className='scr';el.id='scr-'+id;$('main').appendChild(el)}
  document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));el.classList.add('on');window.scrollTo(0,0)}
const scr=id=>{show(id);return $('#scr-'+id)};
function setMode(m){curMode=m}
function modal(html){$('#modalBox').innerHTML=html;$('#modal').classList.remove('hidden');wireSay($('#modalBox'))}
function closeModal(){$('#modal').classList.add('hidden')}
function starStr(n,max=3){let s='';for(let i=0;i<max;i++)s+=i<n?'⭐':'<span class="off">⭐</span>';return s}
function smallStars(n){return n?'⭐'.repeat(n):'·'}
const worldStyle=t=>TOPICS[t].c?`background:${TOPICS[t].c};box-shadow:inset -4px -4px 0 rgba(0,0,0,.3),inset 4px 4px 0 rgba(255,255,255,.35)`:'';
/* level picker used by extra modes: n levels, star key prefix, a level opens after the previous one has a star */
function levelButtons(n,pre,cur=-1){let h='';for(let i=0;i<n;i++){const open=i===0||(S.stars[pre+(i-1)]||0)>0;
  h+=`<button class="lv" ${open?'':'disabled'} data-lv="${i}" style="${i===cur?'outline:4px solid #e3b22b':''}">${open?i+1:'🔒'}<span class="s">${open?smallStars(S.stars[pre+i]||0):''}</span></button>`}return h}
function firstOpen(n,pre){for(let i=0;i<n;i++)if(!(S.stars[pre+i]>0))return i;return 0}

/* ---------- players ---------- */
function curP(){return P.list.find(p=>p.id===P.cur)}
function startPlayer(id){P.cur=id;saveP();KEY=DPRE+id;load();const p=curP();S.name=p?p.name:'';S.sessions++;save();
  sessSec=0;breakAt=15*60;hud();closeModal();menu()}
function askName(isNew){modal(`<h2>${isNew?'👋 שחקן חדש – איך קוראים לך?':'✏️ שינוי שם'}</h2><input id="nmIn" maxlength="20" style="font:inherit;font-size:20px;padding:6px;width:80%;text-align:center" value="${isNew?'':esc(S.name||'')}"><div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="nmOk">יאללה!</button>${P.list.length?'<button class="btn stone" id="nmNo">ביטול</button>':''}</div>`);
  const go=()=>{const nm=$('#nmIn').value.trim().slice(0,20);if(!nm){$('#nmIn').focus();return}
    if(isNew){const id='p'+Date.now();P.list.push({id,name:nm});saveP();startPlayer(id)}
    else{S.name=nm;const p=curP();if(p)p.name=nm;saveP();save();hud();closeModal();menu()}};
  $('#nmOk').onclick=go;$('#nmIn').onkeydown=e=>{if(e.key==='Enter')go()};if($('#nmNo'))$('#nmNo').onclick=()=>{if(KEY)closeModal();else whoPlays()};setTimeout(()=>$('#nmIn').focus(),50)}
function whoPlays(){if(!P.list.length)return askName(true);
  modal(`<h2>🎮 מי משחק?</h2><div class="row" style="justify-content:center;gap:10px">${P.list.map(p=>`<button class="btn wood" data-pid="${p.id}">👤 ${esc(p.name)}</button>`).join('')}</div>
   <div class="row" style="justify-content:center;margin-top:14px"><button class="btn" id="newP">➕ שחקן חדש</button>${KEY?'<button class="btn stone" id="whoNo">ביטול</button>':''}</div>`);
  document.querySelectorAll('[data-pid]').forEach(b=>b.onclick=()=>startPlayer(b.dataset.pid));
  $('#newP').onclick=()=>askName(true);if($('#whoNo'))$('#whoNo').onclick=closeModal}

/* ---------- menu ---------- */
function menu(){setMode(null);clearTimers();
  const tile=(go,ic,nm,ds,st,mx)=>`<div class="panel tile" data-go="${go}"><div class="ic">${ic}</div><div class="nm">${nm}</div><div class="ds">${ds}</div><div class="st">⭐ ${st} / ${mx}</div></div>`;
  let t=tile('quest','⛏️','מסע הכרייה',`${TKEYS.length===3?'שלושה':TKEYS.length} עולמות, ${TKEYS.length*6} שלבים. ענו נכון – וכרו יהלומים!`,starsWith('q-'),QUEST_MAX)+
    tile('arcade','⏱️','מרוץ נגד השעון',`כמה שאלות תספיקו לפתור ב־${ARC_T} שניות?`,starsWith('a-'),ARC_MAX);
  for(const m of GAME.modes||[])t+=tile(m.key,m.icon,m.name,m.desc,starsWith(m.prefix),m.max);
  scr('menu').innerHTML=`
  <div class="panel center"><h1>⛏️ שלום ${esc(S.name||'אלוף')}! ⛏️</h1><div class="muted" style="font-size:17px;color:#333">${GAME.tagline}</div></div>
  <div class="tiles">${t}</div>
  <div class="center" style="margin-top:6px"><button class="btn stone" id="parentBtn">👨‍👧 אזור הורים</button>${GAME.home?` <a class="btn stone" style="text-decoration:none;display:inline-block" href="${GAME.home}">🏠 כל המשחקים</a>`:''}</div>`;
  const go={quest:questMap,arcade:arcadeSel};for(const m of GAME.modes||[])go[m.key]=m.open;
  $('#scr-menu').querySelectorAll('[data-go]').forEach(t=>t.onclick=()=>{SND.click();go[t.dataset.go]()});
  $('#parentBtn').onclick=parentGate;show('menu')}

/* ---------- QUEST ---------- */
function questMap(){setMode('quest');clearTimers();
  let h=`<div class="panel"><h2>⛏️ מסע הכרייה</h2><div class="muted">בכל שלב 5 שאלות. 3 תשובות נכונות פותחות את השלב הבא. 5 מתוך 5 = שלושה כוכבים!</div></div><div class="worlds">`;
  for(const t of TKEYS){h+=`<div class="panel"><h3>${TOPICS[t].icon} ${TOPICS[t].world} – ${TOPICS[t].name}</h3><div class="lvls">`;
    for(let i=0;i<6;i++){const st=S.stars[`q-${t}-${i}`]||0;const open=i===0||(S.stars[`q-${t}-${i-1}`]||0)>0;
      h+=`<button class="lv" style="${open?worldStyle(t):''}" ${open?'':'disabled'} data-t="${t}" data-i="${i}">${open?i+1:'🔒'}<span class="s">${open?smallStars(st):''}</span></button>`}
    h+=`</div><div class="muted" style="margin-top:6px">שלבים 1–2: קל · 3–4: בינוני · 5–6: מאתגר</div></div>`}
  h+='</div>';scr('map').innerHTML=h;
  $('#scr-map').querySelectorAll('.lv[data-t]').forEach(b=>b.onclick=()=>{SND.click();startQuest(b.dataset.t,+b.dataset.i)});show('map')}
let Q={};
function startQuest(topic,lvl){Q={kind:'quest',topic,lvl,i:0,ok:0,n:5,diff:[1,1,2,2,3,3][lvl],res:[]};
  scr('play').innerHTML=`<div class="panel"><div class="phead"><div class="big">${TOPICS[topic].icon} ${TOPICS[topic].world} · שלב ${lvl+1}</div><div class="blocks" id="blocks"></div></div>
   <div class="qtext" id="qtext"></div><div id="qfig"></div><div class="opts" id="qopts"></div><div class="fb" id="qfb"></div></div>
   <div class="center"><button class="btn stone" id="quitBtn">↩ חזרה למפה</button></div>`;
  $('#quitBtn').onclick=questMap;show('play');nextQ()}
function drawBlocks(){let h='';for(let i=0;i<Q.n;i++){const r=Q.res[i];h+=`<div class="blk ${r===true?'ore':r===false?'crk':''} ${i===Q.i&&r===undefined?'cur':''}">${r===true?'💎':r===false?'✖':''}</div>`}$('#blocks').innerHTML=h}
function nextQ(){if(Q.kind==='quest'){if(Q.i>=Q.n)return finishQuest();drawBlocks()}
  const topic=Q.topic==='mix'?pick(TKEYS):Q.topic;const d=Q.kind==='arcade'?(Q.correct<4?1:Q.correct<9?2:3):Q.diff;
  const q=gen(topic,d);Q.cur=q;Q.locked=false;
  $('#qtext').innerHTML=fixDeg(q.text)+(q.say?sayBtn(q.say):'');$('#qfig').innerHTML=q.svg||'';$('#qfb').innerHTML='';
  $('#qopts').className='opts'+(q.cls?' '+q.cls:'');
  $('#qopts').innerHTML=q.opts.map((o,i)=>`<button class="opt" data-i="${i}">${fixDeg(o)}</button>`).join('');
  $('#qopts').querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.i));
  wireSay($('#scr-play'));if(q.say)setTimeout(()=>say(q.say),150)}
function answer(i){if(Q.locked)return;Q.locked=true;const q=Q.cur,ok=i===q.ans;record(q.type,q.topic,ok);
  const bs=$('#qopts').querySelectorAll('.opt');bs.forEach(b=>b.disabled=true);bs[q.ans].classList.add('right');if(!ok)bs[i].classList.add('wrong');
  if(q.sayAfter)say(q.sayAfter);
  if(Q.kind==='quest'){Q.res[Q.i]=ok;if(ok)Q.ok++;drawBlocks();
    if(ok){SND.ok();$('#qfb').innerHTML=`<div class="good">${pick(['✔ כל הכבוד!','✔ מצוין!','✔ נכון מאוד!','✔ אלוף!','✔ יפה מאוד!'])} 💎</div>`;setTimeout(()=>{Q.i++;nextQ()},q.sayAfter?1300:900)}
    else{SND.bad();$('#qfb').innerHTML=`<div class="bad"><b>✘ לא בדיוק.</b> ${fixDeg(q.exp)}<div style="margin-top:10px"><button class="btn" id="contBtn">הבנתי, ממשיכים ←</button></div></div>`;wireSay($('#qfb'));$('#contBtn').onclick=()=>{Q.i++;nextQ()}}}
  else arcadeAnswer(ok,q)}
function finishQuest(){const st=Q.ok===5?3:Q.ok===4?2:Q.ok===3?1:0;const k=`q-${Q.topic}-${Q.lvl}`;if(st)setStars(k,st);
  addHistory('quest',`${TOPICS[Q.topic].world} שלב ${Q.lvl+1}: ${Q.ok}/5`,st);if(st)SND.win();else SND.bad();
  results({title:st?'השלב הושלם!':'כמעט! נסו שוב',stars:st,line:`ענית נכון על ${Q.ok} מתוך 5 שאלות.${st?'':' צריך לפחות 3 כדי לעבור.'}`,
   again:()=>startQuest(Q.topic,Q.lvl),back:questMap,next:st&&Q.lvl<5?()=>startQuest(Q.topic,Q.lvl+1):null,mode:'quest'})}

/* ---------- results modal ---------- */
function results(o){
  modal(`<h2>${o.title}</h2><div class="stars">${starStr(o.stars)}</div><div style="font-size:19px;margin-bottom:12px">${o.line}</div>
   <div class="row" style="justify-content:center">${o.next?'<button class="btn gold" id="rNext">לשלב הבא ←</button>':''}<button class="btn" id="rAgain">🔁 שוב</button><button class="btn stone" id="rBack">↩ חזרה</button></div>
   <div style="margin-top:16px;border-top:3px dashed #888;padding-top:10px"><div style="font-weight:700">איך היה המשחק?</div>
   <div class="row" style="justify-content:center;margin-top:6px" id="rate"><button class="mini" data-r="3" style="font-size:28px">😀</button><button class="mini" data-r="2" style="font-size:28px">😐</button><button class="mini" data-r="1" style="font-size:28px">🙁</button></div></div>`);
  $('#rAgain').onclick=()=>{closeModal();o.again()};$('#rBack').onclick=()=>{closeModal();o.back()};if(o.next)$('#rNext').onclick=()=>{closeModal();o.next()};
  $('#rate').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.ratings[o.mode].push(+b.dataset.r);S.ratings[o.mode]=S.ratings[o.mode].slice(-30);save();$('#rate').innerHTML='<span>תודה! 👍</span>'})}

/* ---------- ARCADE ---------- */
let timers=[];function clearTimers(){timers.forEach(t=>{clearInterval(t);clearTimeout(t)});timers=[]}
function arcadeSel(){setMode('arcade');clearTimers();
  const opts=[...TKEYS.map(k=>[k,TOPICS[k].icon+' '+TOPICS[k].name]),['mix','🌀 הכל ביחד']];
  scr('arcsel').innerHTML=`<div class="panel"><h2>⏱️ מרוץ נגד השעון</h2><div class="muted">${ARC_T} שניות. כל תשובה נכונה ברצף מגדילה את הבונוס (×2, ×3…).${ARC_PEN?` טעות מורידה ${ARC_PEN} שניות.`:''} השאלות נעשות קשות יותר ככל שמצליחים!</div></div>
   <div class="tiles">${opts.map(([k,n])=>`<div class="panel tile" data-k="${k}"><div class="nm">${n}</div><div class="st">שיא: ${S.best[k]||0} נק' · ${starStr(S.stars['a-'+k]||0)}</div></div>`).join('')}</div>
   <div class="muted center">⭐ = ${ARC_ST[0]} נכונות · ⭐⭐ = ${ARC_ST[1]} · ⭐⭐⭐ = ${ARC_ST[2]}</div>`;
  $('#scr-arcsel').querySelectorAll('[data-k]').forEach(t=>t.onclick=()=>{SND.click();startArcade(t.dataset.k)});show('arcsel')}
function startArcade(topic){clearTimers();Q={kind:'arcade',topic,score:0,combo:1,correct:0,wrong:0,time:ARC_T};
  scr('play').innerHTML=`<div class="panel"><div class="phead"><div class="big">⏱️ <span id="tleft">${ARC_T}</span></div><div class="timer"><i id="tbar" style="width:100%"></i></div>
   <div class="big">🏆 <span id="score">0</span> <span id="combo" style="color:#c9473a"></span></div></div>
   <div class="qtext" id="qtext"></div><div id="qfig"></div><div class="opts" id="qopts"></div><div class="fb" id="qfb"></div></div>
   <div class="center"><button class="btn stone" id="quitBtn">↩ יציאה</button></div>`;
  $('#quitBtn').onclick=()=>{clearTimers();arcadeSel()};show('play');nextQ();
  timers.push(setInterval(()=>{Q.time-=.25;updTimer();if(Q.time<=0){clearTimers();finishArcade()}},250))}
function updTimer(){const t=Math.max(0,Q.time);$('#tleft').textContent=Math.ceil(t);$('#tbar').style.width=(t/ARC_T*100)+'%';$('#tbar').style.background=t<10?'#c9473a':'#e3b22b'}
function arcadeAnswer(ok,q){if(ok){SND.ok();Q.correct++;Q.score+=10*Q.combo;Q.combo=Math.min(Q.combo+1,5);$('#qfb').innerHTML=`<div class="good">+${10*(Q.combo>1?Q.combo-1:1)}</div>`;timers.push(setTimeout(nextQ,q.sayAfter?900:350))}
  else{SND.bad();Q.wrong++;Q.combo=1;Q.time-=ARC_PEN;updTimer();$('#qfb').innerHTML=`<div class="bad" style="padding:6px 10px">${ARC_PEN?`−${ARC_PEN} שניות. `:''}${fixDeg(q.exp)}</div>`;timers.push(setTimeout(nextQ,2600))}
  $('#score').textContent=Q.score;$('#combo').textContent=Q.combo>1?'×'+Q.combo:''}
function finishArcade(){Q.locked=true;const st=Q.correct>=ARC_ST[2]?3:Q.correct>=ARC_ST[1]?2:Q.correct>=ARC_ST[0]?1:0;if(st)setStars('a-'+Q.topic,st);
  const rec=Q.score>(S.best[Q.topic]||0);if(rec){S.best[Q.topic]=Q.score;save()}SND.win();
  const tn=Q.topic==='mix'?'הכל ביחד':TOPICS[Q.topic].name;addHistory('arcade',`${tn}: ${Q.correct} נכונות, ${Q.wrong} טעויות, ${Q.score} נק'`,st);
  results({title:rec?'🏆 שיא חדש!':'הזמן נגמר!',stars:st,line:`${Q.score} נקודות · ${Q.correct} תשובות נכונות · ${Q.wrong} טעויות`,again:()=>startArcade(Q.topic),back:arcadeSel,mode:'arcade'})}

/* ---------- BUILDER (optional: games that define GAME.missions) ---------- */
function perimOf(cells){const set=new Set(cells.map(c=>c.join(',')));let p=0;for(const[x,y]of cells)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(!set.has((x+dx)+','+(y+dy)))p++;return p}
function hintOf(m){if(m.hint)return m.hint;if(m.square&&m.area)return`בריבוע האורך שווה לרוחב. איזה מספר כפול עצמו נותן ${m.area}?`;
  if(m.square&&m.perim)return`לריבוע 4 צלעות שוות: ${M(`${m.perim} : 4 = ?`)}`;
  if(m.rect&&m.area&&m.perim)return`חפשו אורך ורוחב שהכפל שלהם הוא ${m.area} והסכום שלהם הוא ${m.perim/2} (חצי מההיקף).`;
  if(m.rect&&m.perim)return`אורך + רוחב צריכים להיות ${m.perim/2} (חצי מההיקף).`;
  if(m.rect&&m.notSquare)return`חפשו שני מספרים <b>שונים</b> שהכפל שלהם הוא ${m.area}. (הלוח ברוחב 12 ובגובה 9.)`;
  if(m.rect)return`חפשו שני מספרים שהכפל שלהם הוא ${m.area}.`;
  if(m.perim)return'כדי להגדיל את ההיקף בלי לשנות את השטח – פרשו את הקוביות לצורה ארוכה ומפותלת. כדי להקטין אותו – קבצו אותן יחד לגוש.';
  return`כל צורה טובה – העיקר שיהיו בדיוק ${m.area} קוביות שנוגעות זו בזו בצלע.`}
const BW=12,BH=9,BC=40;let B={cells:new Set(),m:0,tries:0,showP:false};
const BTXT=Object.assign({unit:'משבצות',area:'שטח',showPerim:true},GAME.builderText||{});
function builder(mi){const MISSIONS=GAME.missions;setMode('builder');clearTimers();B={cells:new Set(),m:mi,tries:0,showP:false,done:false};const m=MISSIONS[mi];
  scr('build').innerHTML=`<div class="panel"><h2>🧱 ${MODES.builder.name}</h2><div class="mis">${levelButtons(MISSIONS.length,'b-',mi)}</div></div>
   <div class="panel"><div class="qtext">משימה ${mi+1}: ${m.t}</div><div class="muted">${BTXT.help||'לחצו או גררו על הלוח כדי להניח קוביות (לחיצה על קובייה מורידה אותה). כל קובייה = משבצת אחת, וכל צלע שלה = 1. כל הקוביות צריכות להיות מחוברות לצורה אחת.'}</div>
   <svg class="board" id="board" viewBox="0 0 ${BW*BC} ${BH*BC}"></svg>
   <div class="row" style="justify-content:center"><div class="big" id="bArea">${BTXT.area}: 0</div></div>
   <div class="row" style="justify-content:center;margin-top:8px"><button class="btn gold" id="bCheck">✔ בדיקה</button><button class="btn wood" id="bHint">💡 רמז</button><button class="btn stone" id="bClear">🧹 נקה</button><button class="btn stone" id="bBack">↩ תפריט</button></div>
   <div class="fb" id="bfb"></div></div>`;
  $('#scr-build').querySelectorAll('.lv[data-lv]').forEach(b=>b.onclick=()=>{SND.click();builder(+b.dataset.lv)});
  $('#bCheck').onclick=bCheck;$('#bClear').onclick=()=>{B.cells.clear();B.showP=false;$('#bfb').innerHTML='';drawBoard()};
  $('#bHint').onclick=()=>{$('#bfb').innerHTML=`<div class="bad">💡 ${hintOf(m)}</div>`};$('#bBack').onclick=menu;
  const sv=$('#board');let paint=null;
  const cellAt=e=>{const r=sv.getBoundingClientRect();const x=Math.floor((e.clientX-r.left)/r.width*BW),y=Math.floor((e.clientY-r.top)/r.height*BH);return(x>=0&&x<BW&&y>=0&&y<BH)?x+','+y:null};
  const setC=(c,v)=>{if(!c||B.done)return;const had=B.cells.has(c);if(v&&!had){B.cells.add(c);beep(700,.03,'square',.02)}else if(!v&&had){B.cells.delete(c);beep(300,.03,'square',.02)}else return;B.showP=false;drawBoard()};
  sv.addEventListener('pointerdown',e=>{const c=cellAt(e);if(!c)return;e.preventDefault();paint=!B.cells.has(c);setC(c,paint);try{sv.setPointerCapture(e.pointerId)}catch(_){}});
  sv.addEventListener('pointermove',e=>{if(paint===null)return;setC(cellAt(e),paint)});
  const up=()=>paint=null;sv.addEventListener('pointerup',up);sv.addEventListener('pointercancel',up);
  drawBoard();show('build')}
function drawBoard(){let s='';for(let x=0;x<=BW;x++)s+=`<line x1="${x*BC}" y1="0" x2="${x*BC}" y2="${BH*BC}" stroke="#cbbf98" stroke-width="1.5"/>`;for(let y=0;y<=BH;y++)s+=`<line x1="0" y1="${y*BC}" x2="${BW*BC}" y2="${y*BC}" stroke="#cbbf98" stroke-width="1.5"/>`;
  for(const c of B.cells){const[x,y]=c.split(',').map(Number);const X=x*BC,Y=y*BC;
    s+=`<rect x="${X}" y="${Y}" width="${BC}" height="${BC}" fill="#8a5a32"/><rect x="${X}" y="${Y}" width="${BC}" height="12" fill="#5fae3a"/><rect x="${X+6}" y="${Y+20}" width="6" height="6" fill="#6e4524"/><rect x="${X+24}" y="${Y+28}" width="6" height="6" fill="#6e4524"/><rect x="${X}" y="${Y}" width="${BC}" height="${BC}" fill="none" stroke="#2c1a0b" stroke-width="2"/>`}
  if(B.showP&&BTXT.showPerim){for(const c of B.cells){const[x,y]=c.split(',').map(Number);const X=x*BC,Y=y*BC;
    if(!B.cells.has(x+','+(y-1)))s+=`<line x1="${X}" y1="${Y}" x2="${X+BC}" y2="${Y}" stroke="#e8231a" stroke-width="6" stroke-linecap="round"/>`;
    if(!B.cells.has(x+','+(y+1)))s+=`<line x1="${X}" y1="${Y+BC}" x2="${X+BC}" y2="${Y+BC}" stroke="#e8231a" stroke-width="6" stroke-linecap="round"/>`;
    if(!B.cells.has((x-1)+','+y))s+=`<line x1="${X}" y1="${Y}" x2="${X}" y2="${Y+BC}" stroke="#e8231a" stroke-width="6" stroke-linecap="round"/>`;
    if(!B.cells.has((x+1)+','+y))s+=`<line x1="${X+BC}" y1="${Y}" x2="${X+BC}" y2="${Y+BC}" stroke="#e8231a" stroke-width="6" stroke-linecap="round"/>`}}
  $('#board').innerHTML=s;$('#bArea').textContent=BTXT.area+': '+B.cells.size+' '+BTXT.unit}
function bCheck(){if(B.done)return;const MISSIONS=GAME.missions;const m=MISSIONS[B.m];const cells=[...B.cells].map(c=>c.split(',').map(Number));
  if(!cells.length){$('#bfb').innerHTML='<div class="bad">הלוח ריק – הניחו קוביות קודם 🙂</div>';return}
  B.tries++;const n=cells.length,p=perimOf(cells);
  const seen=new Set([cells[0].join(',')]),st=[cells[0]];while(st.length){const[x,y]=st.pop();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+dx)+','+(y+dy);if(B.cells.has(k)&&!seen.has(k)){seen.add(k);st.push([x+dx,y+dy])}}}
  const conn=seen.size===n;const xs=cells.map(c=>c[0]),ys=cells.map(c=>c[1]);const w=Math.max(...xs)-Math.min(...xs)+1,h=Math.max(...ys)-Math.min(...ys)+1;const isRect=w*h===n;
  const errs=[];if(!conn)errs.push('הקוביות צריכות להיות מחוברות זו לזו (צלע לצלע) לצורה אחת.');
  if(m.area&&n!==m.area)errs.push(`יש לכם <b>${n}</b> קוביות, וצריך <b>${m.area}</b>.`);
  if(m.perim&&p!==m.perim)errs.push(`ההיקף של הצורה שלכם הוא <b>${p}</b> (הקו האדום), וצריך <b>${m.perim}</b>.`);
  if((m.rect||m.square||m.line||m.tower)&&!isRect)errs.push(`הצורה צריכה להיות ${m.square?'ריבוע':m.line?'שורה ישרה':m.tower?'מגדל ישר':'מלבן'} מלא – בלי חורים ובלי בליטות.`);
  else if(m.square&&w!==h)errs.push(`זה מלבן של ${M(w+'×'+h)} – בריבוע האורך והרוחב שווים.`);
  else if(m.line&&h!==1)errs.push('השורה צריכה להיות בגובה של קובייה אחת – כל הקוביות זו ליד זו.');
  else if(m.tower&&w!==1)errs.push('המגדל צריך להיות ברוחב של קובייה אחת – כל הקוביות זו מעל זו.');
  if(m.w&&m.h&&isRect&&!((w===m.w&&h===m.h)||(w===m.h&&h===m.w)))errs.push(`צריך ${m.w} קוביות לאורך ו־${m.h} לרוחב. אצלכם: ${w} ו־${h}.`);
  if(m.notSquare&&isRect&&w===h)errs.push('זה ריבוע! המשימה היא מלבן שאינו ריבוע.');
  B.showP=true;drawBoard();const ok=!errs.length;record('build',GAME.builderTopic,ok);
  if(!ok){SND.bad();$('#bfb').innerHTML=`<div class="bad"><b>עוד לא…</b><br>${errs.join('<br>')}${BTXT.showPerim?'<br><span class="muted">הקו האדום מראה את ההיקף. נסו לשנות ולבדוק שוב!</span>':''}</div>`;return}
  B.done=true;const sc=B.tries===1?3:B.tries===2?2:1;setStars('b-'+B.m,sc);SND.win();addHistory('builder',`משימה ${B.m+1}: הצליח בניסיון ${B.tries}`,sc);
  $('#bfb').innerHTML=`<div class="good">✔ מעולה! ${BTXT.showPerim?`שטח ${n}, היקף ${p}${isRect?` (${M(w+'×'+h)})`:''}`:`${n} קוביות`}</div>`;
  setTimeout(()=>results({title:'משימה הושלמה!',stars:sc,line:`הצלחתם בניסיון ה־${B.tries}.${BTXT.showPerim?` שטח: ${n} משבצות · היקף: ${p}`:''}`,again:()=>builder(B.m),back:menu,next:B.m<MISSIONS.length-1?()=>builder(B.m+1):null,mode:'builder'}),900)}

/* ---------- SPELLING CRAFTING TABLE (optional: games that define GAME.spell) ---------- */
/* GAME.spell = [[{en,he,e},...] per level], 6 words per level */
let SP={};
function spellSel(){setMode('spell');clearTimers();const L=GAME.spell;
  scr('spsel').innerHTML=`<div class="panel"><h2>🔨 שולחן האיות</h2><div style="font-size:17px">שומעים מילה באנגלית, רואים מה היא אומרת – ובונים אותה מקוביות של אותיות! בכל שלב ${L[0].length} מילים.</div></div>
   <div class="panel"><div class="lvls">${levelButtons(L.length,'s-')}</div><div class="muted" style="margin-top:8px">⭐ = עד 4 טעויות · ⭐⭐ = עד 2 · ⭐⭐⭐ = בלי טעויות</div></div>`;
  $('#scr-spsel').querySelectorAll('.lv').forEach(b=>b.onclick=()=>{SND.click();startSpell(+b.dataset.lv)});show('spsel')}
function startSpell(lv){clearTimers();SP={lv,words:shuffle(GAME.spell[lv]),i:0,miss:0};spellWord()}
function spellWord(){const w=SP.words[SP.i],word=w.en.toLowerCase();const extra=GAME.spellExtra?GAME.spellExtra(SP.lv):0;
  let pool=word.replace(/[^a-z]/g,'').split('');const ab='abcdefghijklmnopqrstuvwxyz';for(let k=0;k<extra;k++)pool.push(pick(ab.split('').filter(c=>!pool.includes(c))));
  SP.pool=shuffle(pool).map((c,i)=>({c,i,used:false}));SP.typed=[];SP.word=word;SP.wrongNow=0;
  scr('spell').innerHTML=`<div class="panel"><div class="phead"><div class="big">🔨 שלב ${SP.lv+1} · מילה ${SP.i+1}/${SP.words.length}</div><div class="big">טעויות: <span id="spMiss">${SP.miss}</span></div></div>
   <div class="emo">${w.e||''}</div><div class="center" style="font-size:24px;font-weight:800">${w.he} ${sayBtn(w.en)}</div>
   <div class="slots" id="slots"></div><div class="letters" id="letters"></div>
   <div class="row" style="justify-content:center"><button class="btn stone" id="spBack">⌫ מחיקה</button><button class="btn wood" id="spHint">💡 רמז</button><button class="btn stone" id="spQuit">↩ יציאה</button></div>
   <div class="fb center" id="spfb"></div></div>`;
  wireSay($('#scr-spell'));drawSpell();setTimeout(()=>say(w.en),200);
  $('#spBack').onclick=()=>{const t=SP.typed.pop();if(t!=null){SP.pool[t].used=false;drawSpell()}};
  $('#spHint').onclick=()=>{say(w.en,.6);const n=SP.typed.length;const need=SP.word[n];if(need==null)return;const t=SP.pool.find(x=>!x.used&&x.c===need);if(t){$('#spfb').innerHTML=`<span class="muted">האות הבאה היא: <b class="en">${need}</b></span>`}};
  $('#spQuit').onclick=spellSel}
function drawSpell(){const W=SP.word.replace(/[^a-z]/g,'');
  $('#slots').innerHTML=W.split('').map((_,i)=>{const t=SP.typed[i];return`<div class="slot ${t!=null?'f':''}">${t!=null?SP.pool[t].c:''}</div>`}).join('');
  $('#letters').innerHTML=SP.pool.map((x,i)=>`<button class="ltr" data-i="${i}" ${x.used?'disabled':''}>${x.c}</button>`).join('');
  $('#letters').querySelectorAll('.ltr').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(SP.pool[i].used)return;SP.pool[i].used=true;SP.typed.push(i);beep(700,.03,'square',.02);drawSpell();
    if(SP.typed.length===W.length)spellCheck(W)})}
function spellCheck(W){const got=SP.typed.map(i=>SP.pool[i].c).join('');const w=SP.words[SP.i];
  if(got===W){record('spell',GAME.spellTopic,SP.wrongNow===0);SND.ok();say(w.en);$('#spfb').innerHTML=`<div class="good">✔ ${EN(w.en)} – נכון!</div>`;
    timers.push(setTimeout(()=>{SP.i++;if(SP.i>=SP.words.length)finishSpell();else spellWord()},1300))}
  else{SP.miss++;SP.wrongNow++;$('#spMiss').textContent=SP.miss;SND.bad();
    let k=0;while(k<W.length&&got[k]===W[k])k++;
    $('#spfb').innerHTML=`<div class="bad">עוד לא… ${k?`${k===1?'האות הראשונה נכונה':`${k} האותיות הראשונות נכונות`}. `:''}נסו שוב! ${SP.wrongNow>=2?`<br>המילה היא: <b class="en" style="font-size:24px">${W}</b>`:''}</div>`;
    timers.push(setTimeout(()=>{while(SP.typed.length>k){SP.pool[SP.typed.pop()].used=false}drawSpell()},900))}}
function finishSpell(){const st=SP.miss===0?3:SP.miss<=2?2:SP.miss<=4?1:0;if(st)setStars('s-'+SP.lv,st);addHistory('spell',`שלב ${SP.lv+1}: ${SP.miss} טעויות`,st);st?SND.win():SND.bad();
  results({title:st?'כל הכבוד, אלוף האיות!':'נסו שוב!',stars:st,line:`איית ${SP.words.length} מילים עם ${SP.miss} טעויות.${st?'':' כדי לעבור צריך עד 4 טעויות.'}`,again:()=>startSpell(SP.lv),back:spellSel,next:st&&SP.lv<GAME.spell.length-1?()=>startSpell(SP.lv+1):null,mode:'spell'})}

/* ---------- PARENT ---------- */
function parentGate(){const a=R(12,19),b=R(13,24);
  modal(`<h2>👨‍👧 אזור הורים</h2><div style="font-size:18px">כדי להיכנס, פתרו: ${M(a+' × '+b+' = ?')}</div><div class="row" style="justify-content:center;margin:12px 0"><input class="num" id="pg" type="number" inputmode="numeric"></div>
   <div class="row" style="justify-content:center"><button class="btn" id="pgOk">כניסה</button><button class="btn stone" id="pgNo">ביטול</button></div><div id="pgE" style="color:#c9302c;font-weight:700;margin-top:6px"></div>`);
  const go=()=>{if(+$('#pg').value===a*b){closeModal();parent()}else $('#pgE').textContent='לא נכון'};$('#pgOk').onclick=go;$('#pg').addEventListener('keydown',e=>{if(e.key==='Enter')go()});$('#pgNo').onclick=closeModal;setTimeout(()=>$('#pg').focus(),50)}
const mins=s=>s<60?'פחות מדקה':Math.round(s/60)+' דק\'';
function parent(){setMode(null);clearTimers();
  const pct=o=>o.t?Math.round(o.c/o.t*100)+'%':'—';
  let tp='';for(const k of TKEYS){const o=S.topics[k];tp+=`<tr><td>${TOPICS[k].icon} ${TOPICS[k].name}</td><td>${o.t}</td><td>${pct(o)}</td><td>${o.c?`<span class="bar" style="width:${Math.round(o.c/o.t*120)}px"></span>`:''}</td></tr>`}
  const types=Object.entries(S.stats).filter(([k,o])=>o.t>=3&&TYPES[k]).map(([k,o])=>({k,a:o.c/o.t,o})).sort((x,y)=>x.a-y.a);
  const weak=types.filter(x=>x.a<.75).slice(0,5),strong=types.filter(x=>x.a>=.85).sort((x,y)=>y.o.t-x.o.t).slice(0,5);
  const mt=Math.max(1,...Object.values(S.modeTime));let md='';
  for(const k of Object.keys(MODES)){const r=S.ratings[k]||[];const avg=r.length?r.reduce((a,b)=>a+b,0)/r.length:0;const face=!r.length?'—':avg>=2.5?'😀':avg>=1.7?'😐':'🙁';
    md+=`<tr><td>${MODES[k].icon} ${MODES[k].name}</td><td>${S.modeTime[k]?`<span class="bar" style="width:${Math.round(S.modeTime[k]/mt*120)}px"></span> `:''}${mins(S.modeTime[k]||0)}</td><td>${S.modePlays[k]||0}</td><td>${face} ${r.length?`(${r.length})`:''}</td></tr>`}
  const fav=Object.keys(MODES).sort((a,b)=>(S.modeTime[b]||0)-(S.modeTime[a]||0))[0];
  const hist=S.history.slice(0,12).map(h=>`<tr><td>${h.d}</td><td>${MODES[h.m]?MODES[h.m].icon:''} ${h.x}</td><td>${smallStars(h.s)}</td></tr>`).join('')||'<tr><td colspan="3">עוד אין משחקים</td></tr>';
  scr('parent').innerHTML=`<div class="panel"><h2>👨‍👧 דוח התקדמות${S.name?' – '+esc(S.name):''} · ${GAME.subject}</h2>
   <div class="row" style="font-size:18px;gap:18px"><span>⏳ זמן משחק כולל: <b>${mins(S.totalTime)}</b></span><span>📅 כניסות: <b>${S.sessions}</b></span><span>⭐ כוכבים: <b>${totalStars()}</b> / ${MAX_STARS}</span><span>💎 יהלומים: <b>${S.gems}</b></span></div></div>
   <div class="panel"><h3>לפי נושא</h3><table class="t"><tr><th>נושא</th><th>שאלות</th><th>הצלחה</th><th></th></tr>${tp}</table></div>
   <div class="panel"><h3>⚠️ כדאי לחזק</h3>${weak.length?weak.map(x=>`<span class="tag">${TYPES[x.k][1]} – ${Math.round(x.a*100)}% (${x.o.t})</span>`).join(''):'<span class="muted">אין עדיין נקודות חלשות ברורות (צריך לפחות 3 ניסיונות בכל סוג שאלה).</span>'}
   <h3 style="margin-top:12px">💪 חזק ב־</h3>${strong.length?strong.map(x=>`<span class="tag" style="background:#e3f7d6;border-color:#3d7a22">${TYPES[x.k][1]} – ${Math.round(x.a*100)}%</span>`).join(''):'<span class="muted">עוד אין מספיק נתונים.</span>'}</div>
   <div class="panel"><h3>🎮 איזה סוג משחק הוא אוהב?</h3><table class="t"><tr><th>משחק</th><th>זמן</th><th>משחקים</th><th>דירוג שלו</th></tr>${md}</table>
   <div class="muted" style="margin-top:6px">${S.totalTime>120?`עד עכשיו הכי הרבה זמן ב: <b>${MODES[fav].name}</b>. `:''}"דירוג שלו" = מה שהשחקן בחר בסוף כל משחק (😀/😐/🙁).</div></div>
   <div class="panel"><h3>🕑 משחקים אחרונים</h3><table class="t"><tr><th>מתי</th><th>מה</th><th>כוכבים</th></tr>${hist}</table></div>
   <div class="row" style="justify-content:center"><button class="btn" id="pBack">↩ חזרה למשחק</button><button class="btn wood" id="pName">✏️ שינוי שם השחקן</button><button class="btn red" id="pReset">🗑 איפוס ההתקדמות במשחק הזה</button><button class="btn red" id="pDel">❌ מחיקת שחקן</button></div>`;
  $('#pBack').onclick=menu;$('#pName').onclick=()=>askName(false);
  $('#pDel').onclick=()=>{modal(`<h2>למחוק את ${esc(S.name||'השחקן')}?</h2><div>השחקן וכל ההתקדמות שלו בכל המשחקים יימחקו מהמחשב הזה.</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn red" id="dlY">כן, למחוק</button><button class="btn stone" id="dlN">ביטול</button></div>`);
    $('#dlY').onclick=()=>{const pid=P.cur;try{Object.keys(localStorage).filter(k=>k.endsWith('V1_'+pid)).forEach(k=>localStorage.removeItem(k))}catch(e){}
      P.list=P.list.filter(p=>p.id!==pid);P.cur=null;KEY=null;saveP();S=defState();hud();menu();whoPlays()};$('#dlN').onclick=closeModal};
  $('#pReset').onclick=()=>{modal(`<h2>לאפס את ${GAME.subject}?</h2><div>כל הכוכבים, השיאים והנתונים במשחק הזה יימחקו.</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn red" id="rsY">כן, לאפס</button><button class="btn stone" id="rsN">ביטול</button></div>`);
    $('#rsY').onclick=()=>{const m=S.mute,nm=S.name;S=defState();S.mute=m;S.name=nm;S.sessions=1;save();hud();closeModal();parent()};$('#rsN').onclick=closeModal};show('parent')}

/* ---------- session timer & break ---------- */
let sessSec=0,breakAt=15*60;
setInterval(()=>{if(document.hidden||!curMode||!KEY)return;S.modeTime[curMode]=(S.modeTime[curMode]||0)+1;S.totalTime++;sessSec++;if(sessSec%10===0)save();
  if(sessSec>=breakAt&&$('#modal').classList.contains('hidden')){breakAt=sessSec+5*60;
    modal(`<h2>🕒 עבודה מצוינת!</h2><div style="font-size:19px">שיחקת כבר ${Math.round(sessSec/60)} דקות ואספת ${totalStars()} כוכבים בסך הכל.<br>זה זמן טוב להפסקה – לשתות מים ולזוז קצת 🙂</div>
     <div class="row" style="justify-content:center;margin-top:14px"><button class="btn" id="brStop">סיימתי להיום 👋</button><button class="btn stone" id="brMore">עוד 5 דקות</button></div>`);
    $('#brStop').onclick=()=>{closeModal();clearTimers();menu()};$('#brMore').onclick=closeModal}},1000);

/* ---------- init ---------- */
loadP();S=defState();
$('#homeBtn').onclick=()=>{closeModal();menu()};
$('#whoBtn').onclick=()=>{clearTimers();menu();whoPlays()};
$('#muteBtn').onclick=()=>{S.mute=!S.mute;save();hud();if(S.mute)try{speechSynthesis.cancel()}catch(e){}};
hud();menu();
/* one player on this device: start right away. several: ask who is playing */
if(P.list.length===1){startPlayer(P.list[0].id)}else whoPlays();
