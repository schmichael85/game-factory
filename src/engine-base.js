'use strict';
/* ========== helpers ========== */
const $=s=>document.querySelector(s);
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const M=s=>`<bdi dir="ltr">${s}</bdi>`;
const f1=n=>Math.round(n*10)/10;
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* English text inside Hebrew (RTL) page */
const EN=s=>`<bdi dir="ltr" lang="en" class="en">${s}</bdi>`;
/* stacked fraction a/b, and mixed number w a/b */
const FR=(a,b)=>`<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const MIX=(w,a,b)=>a?`<span class="mixed">${w?`<b>${w}</b>`:''}${FR(a,b)}</span>`:M(w);
const fixDeg=s=>String(s).replace(/(\d+°)/g,'<bdi dir="ltr">$1</bdi>');
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);

/* ========== answer options ========== */
function numOpts(c,extras,unit=''){const set=[c];
  for(const e of shuffle(extras)){if(set.length>=4)break;if(e>0&&Number.isInteger(e)&&!set.includes(e))set.push(e)}
  let k=1;while(set.length<4){const st=c>=40?5:c>=12?2:1;for(const v of shuffle([c+k*st,c-k*st]))if(set.length<4&&v>0&&!set.includes(v))set.push(v);k++}
  const arr=shuffle(set);return{opts:arr.map(v=>unit==='°'?M(v+'°'):unit?M(v)+unit:M(v)),ans:arr.indexOf(c)}}
function txtOpts(correct,wrongs){const w=[];for(const x of wrongs)if(x!==correct&&!w.includes(x))w.push(x);
  const arr=shuffle([correct,...w.slice(0,3)]);return{opts:arr,ans:arr.indexOf(correct)}}
/* pick n distinct items from arr that are not equal (by key) to `not` */
function others(arr,not,n=3,key=x=>x){const k0=key(not);return shuffle(arr.filter(x=>key(x)!==k0)).slice(0,n)}

/* ========== svg ========== */
const svgW=(inner,w=300,h=200)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
function pt(cx,cy,L,deg){const r=deg*Math.PI/180;return[f1(cx+L*Math.cos(r)),f1(cy-L*Math.sin(r))]}
function arc(cx,cy,r,a1,a2,cls='arc'){const p=pt(cx,cy,r,a1),q=pt(cx,cy,r,a2);return`<path class="${cls}" d="M${p} A${r} ${r} 0 ${a2-a1>180?1:0} 0 ${q}"/>`}
function lbl(x,y,t,q){return`<text class="lbl${q?' q':''}" x="${f1(x)}" y="${f1(y+6)}">${t}</text>`}
function rightMark(cx,cy,a,s=16){const p=pt(cx,cy,s,a),q=pt(cx,cy,s,a+90);const c=[f1(p[0]+q[0]-cx),f1(p[1]+q[1]-cy)];return`<path d="M${p} L${c} L${q}" fill="none" stroke="#e94f37" stroke-width="3"/>`}
function polyFig(P,extra=''){return svgW(`<polygon class="shp" points="${P.map(p=>p.join(',')).join(' ')}"/>`+extra)}

/* ========== sound ========== */
let AC=null;
function beep(f,d=.12,type='square',v=.05,when=0){if(S&&S.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();
  const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;const t=AC.currentTime+when;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.03)}catch(e){}}
const SND={ok(){beep(660,.1);beep(990,.16,'square',.05,.09)},bad(){beep(180,.28,'sawtooth',.045)},
  win(){[523,659,784,1046].forEach((f,i)=>beep(f,.2,'square',.05,i*.12))},boom(){beep(110,.35,'sawtooth',.07);beep(70,.4,'square',.05,.05)},
  click(){beep(500,.05,'square',.03)},shoot(){beep(300,.12,'triangle',.07);beep(200,.15,'triangle',.05,.05)}};

/* ========== speech (English pronunciation, works offline with the system voices) ========== */
let VOICE=null;
function pickVoice(){try{const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  VOICE=vs.find(v=>/en[-_]US/i.test(v.lang)&&/natural|google|samantha|aria|jenny|zira/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}catch(e){}}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
const canSpeak=()=>'speechSynthesis' in window;
function say(text,rate=.85){if(!text||!canSpeak())return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';if(VOICE)u.voice=VOICE;u.rate=rate;speechSynthesis.speak(u)}catch(e){}}
const sayBtn=(text,id='')=>canSpeak()?`<button class="say" ${id?`id="${id}"`:''} data-say="${esc(text)}" title="השמעה">🔊</button>`:'';
/* any [data-say] button inside el speaks its text */
function wireSay(el){(el||document).querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();say(b.dataset.say)})}
