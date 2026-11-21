/* Block World – first English for Hebrew speakers, grade 2 (listening first) */
const GAME={id:'blockEnglish2',title:'עולם האנגלית',subject:'אנגלית כיתה ב׳',home:'../',
  tagline:'מקשיבים 🔊, בוחרים ואוספים יהלומים! לחצו על 🔊 כדי לשמוע שוב.',arcadeTime:90,arcadeStars:[5,8,12],wrongPenalty:2,
  modes:[{key:'spell',name:'שולחן האיות',icon:'🔨',desc:'שומעים מילה קצרה ובונים אותה מקוביות של אותיות.',prefix:'s-',max:18,open:()=>spellSel()}],
  spellTopic:'words',spellExtra:lv=>lv<3?0:1};

const TOPICS={abc:{name:'אותיות',world:'מערת האותיות',icon:'🔤',c:'#7d7d7d'},
  words:{name:'מילים ראשונות',world:'יער החיות',icon:'🐶',c:'#4f9a3a'},
  colnum:{name:'צבעים ומספרים',world:'גן הצבעים',icon:'🎨',c:'#b5651d'}};
const TYPES={
 l_hear:['abc','שמיעת שם של אות',1],
 l_case:['abc','אות גדולה ואות קטנה',1],
 l_first:['abc','באיזו אות מתחילה המילה',2],
 l_order:['abc','סדר האלף־בית',3],
 w_hear:['words','שומעים מילה ובוחרים תמונה',1],
 w_pic:['words','תמונה → מילה באנגלית',2],
 w_mean:['words','שומעים מילה → פירוש בעברית',2],
 w_he2en:['words','עברית → אנגלית',3],
 c_color:['colnum','שומעים צבע ובוחרים',1],
 c_num:['colnum','שומעים מספר ובוחרים',1],
 c_colorword:['colnum','צבע → מילה באנגלית',2],
 c_count:['colnum','סופרים באנגלית',2],
 c_numword:['colnum','מספר → מילה באנגלית',3],
 spell:['words','איות (שולחן האיות)',1]
};
const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOOK={B:'DPE',D:'BPO',E:'FB',F:'EP',M:'NW',N:'MH',P:'BRD',Q:'OG',U:'VW',V:'UW',W:'MV',C:'GO',G:'CQ',I:'LJT',J:'IL',O:'QC'};
/* easy, picturable words for little kids */
const EASY=['dog','cat','cow','pig','duck','fish','bird','lion','frog','bee','horse','monkey','elephant','rabbit','apple','banana','egg','milk','cake','pizza','sun','moon','star','tree','flower','car','bus','ball','hat','book'].map(vw).filter(Boolean);
const COLS=['red','blue','green','yellow','black','white','pink','purple','brown','orange'];
const COLHE={red:'אדום',blue:'כחול',green:'ירוק',yellow:'צהוב',black:'שחור',white:'לבן',pink:'ורוד',purple:'סגול',brown:'חום',orange:'כתום'};
const big=t=>`<span style="font-size:40px;font-weight:800" class="en">${t}</span>`;
const letterOpts=(c,pool)=>{const wr=[];for(const x of shuffle(pool))if(x!==c&&!wr.includes(x)&&wr.length<3)wr.push(x);while(wr.length<3){const x=pick(ABC);if(x!==c&&!wr.includes(x))wr.push(x)}const o=txtOpts(c,wr);o.opts=o.opts.map(big);return o};

const G={
l_hear(d){const L=pick(ABC);return{text:'🎧 איזו אות שמעתם?',say:L,...letterOpts(L,(LOOK[L]||'').split('').concat(shuffle(ABC).slice(0,3))),
  exp:`שמעתם את האות ${big(L)} ${sayBtn(L)}`}},
l_case(d){const L=pick(ABC),up=Math.random()<.5||d===1;const c=up?L.toLowerCase():L;const pool=(LOOK[L]||'').split('').concat(shuffle(ABC).slice(0,4));
  const o=letterOpts(c,pool.map(x=>up?x.toLowerCase():x));
  return{text:up?`איזו אות קטנה מתאימה ל־${big(L)}?`:`איזו אות גדולה מתאימה ל־${big(L.toLowerCase())}?`,say:L,...o,exp:`${big(L)} ו־${big(L.toLowerCase())} הן אותה אות – גדולה וקטנה.`}},
l_first(d){const w=pick(EASY);const f=w.en[0];return{text:`${w.e} באיזו אות מתחילה המילה?`,say:w.en,...letterOpts(f,shuffle('abcdefghijklmnoprstw'.split('')).slice(0,5)),
  exp:`${EN('<b>'+w.en+'</b>')} מתחילה באות ${big(f)}. ${sayBtn(w.en)}`}},
l_order(d){const i=R(0,24);const L=ABC[i],nx=ABC[i+1];return{text:`איזו אות באה <b>אחרי</b> ${big(L)}?`,say:L,...letterOpts(nx,[ABC[i+2],ABC[Math.max(0,i-1)],ABC[(i+5)%26]].filter(Boolean)),
  exp:`${ABC.slice(Math.max(0,i-2),i+3).join(' ')} – אחרי ${L} באה ${nx}.`}},

w_hear(d){const w=pick(EASY);const wr=shuffle(EASY.filter(x=>x.en!==w.en&&x.e!==w.e)).slice(0,3);const arr=shuffle([w,...wr]);
  return{text:'🎧 הקשיבו ובחרו את התמונה:',say:w.en,opts:arr.map(x=>x.e),ans:arr.indexOf(w),cls:'emoji',exp:`${EN('<b>'+w.en+'</b>')} = ${w.he} ${w.e} ${sayBtn(w.en)}`}},
w_pic(d){const w=pick(EASY);const wr=shuffle(EASY.filter(x=>x.en!==w.en)).slice(0,3).map(x=>x.en);const o=txtOpts(w.en,wr);o.opts=o.opts.map(EN);
  return{text:'איך קוראים לזה באנגלית?',svg:`<div class="emo">${w.e}</div>`,...o,sayAfter:w.en,exp:`${w.e} = ${EN('<b>'+w.en+'</b>')} ${sayBtn(w.en)}`}},
w_mean(d){const w=pick(EASY);const wr=shuffle(EASY.filter(x=>x.he!==w.he)).slice(0,3).map(x=>x.he);
  return{text:'🎧 מה פירוש המילה ששמעתם?',say:w.en,...txtOpts(w.he,wr),exp:`${EN('<b>'+w.en+'</b>')} = ${w.he} ${w.e}`}},
w_he2en(d){const w=pick(EASY);const wr=shuffle(EASY.filter(x=>x.en!==w.en)).slice(0,3).map(x=>x.en);const o=txtOpts(w.en,wr);o.opts=o.opts.map(EN);
  return{text:`איך אומרים באנגלית: <b>${w.he}</b>?`,...o,sayAfter:w.en,exp:`${w.he} = ${EN('<b>'+w.en+'</b>')} ${sayBtn(w.en)}`}},

c_color(d){const c=pick(COLS);const wr=shuffle(COLS.filter(x=>x!==c)).slice(0,3);const arr=shuffle([c,...wr]);
  return{text:'🎧 הקשיבו ובחרו את הצבע:',say:c,opts:arr.map(x=>colorBox(x,56)),ans:arr.indexOf(c),cls:'emoji',exp:`${EN('<b>'+c+'</b>')} = ${COLHE[c]} ${colorBox(c,22)}`}},
c_colorword(d){const c=pick(COLS);const o=txtOpts(c,shuffle(COLS.filter(x=>x!==c)).slice(0,3));o.opts=o.opts.map(EN);
  return{text:'איך אומרים את הצבע הזה באנגלית?',svg:`<div class="center">${colorBox(c,90)}</div>`,...o,sayAfter:c,exp:`${colorBox(c,22)} = ${EN('<b>'+c+'</b>')} (${COLHE[c]}) ${sayBtn(c)}`}},
c_num(d){const n=R(1,d===1?10:20);const o=numOpts(n,[n+1,n-1,n+10>20?n-10:n+10].filter(x=>x>0&&x<=20));o.opts=o.opts.map(x=>`<span style="font-size:34px">${x}</span>`);
  return{text:'🎧 איזה מספר שמעתם?',say:NUMS[n],...o,exp:`${EN('<b>'+NUMS[n]+'</b>')} = ${n} ${sayBtn(NUMS[n])}`}},
c_count(d){const n=R(1,d===2?6:10),e=pick(['🍎','⭐','🐟','🎈','🐞','🌸']);const o=txtOpts(NUMS[n],[NUMS[n+1],NUMS[n-1]||NUMS[n+2],NUMS[Math.min(20,n+3)]]);o.opts=o.opts.map(EN);
  return{text:`כמה ${e} יש? ${EN('<b>How many?</b>')}`,svg:`<div class="emo" style="font-size:40px">${e.repeat(n)}</div>`,...o,sayAfter:NUMS[n],exp:`יש ${n}: ${EN('<b>'+NUMS[n]+'</b>')} ${sayBtn(NUMS[n])}`}},
c_numword(d){const n=R(1,20);const o=txtOpts(NUMS[n],[NUMS[n===20?18:n+1],NUMS[n===1?3:n-1],NUMS[(n+9)%20+1]]);o.opts=o.opts.map(EN);
  return{text:`איך כותבים באנגלית את המספר ${big(n)}?`,...o,sayAfter:NUMS[n],exp:`${n} = ${EN('<b>'+NUMS[n]+'</b>')} ${sayBtn(NUMS[n])}`}}
};

/* spelling: short words with pictures */
GAME.spell=[['cat','dog','sun','egg','hat','bus'],['pig','bee','cow','car','bed','red'],['fish','frog','milk','cake','tree','book'],['duck','bear','lion','moon','star','door'],['apple','horse','snake','mouse','water','bread'],['pizza','sheep','green','plane','train','black']].map(L=>L.map(vw));
