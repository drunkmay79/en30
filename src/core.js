/* ===== Ядро: утилиты, хранилище, профили, интервальное повторение, планировщик, речь ===== */

const U = {
  q:(s,r)=>(r||document).querySelector(s),
  qa:(s,r)=>Array.from((r||document).querySelectorAll(s)),
  h(tag, attrs, ...kids){
    const e=document.createElement(tag);
    if(attrs) for(const k in attrs){
      const v=attrs[k];
      if(k==='class') e.className=v;
      else if(k==='html') e.innerHTML=v;
      else if(k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if(k==='style') e.style.cssText=v;
      else if(v!=null && v!==false) e.setAttribute(k, v===true?'':v);
    }
    kids.flat(3).forEach(c=>{ if(c==null||c===false) return; e.appendChild(typeof c==='string'||typeof c==='number'?document.createTextNode(String(c)):c); });
    return e;
  },
  esc:s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; },
  pick:(a,n)=>U.shuffle(a).slice(0,n),
  rnd:a=>a[Math.floor(Math.random()*a.length)],
  pad:n=>(n<10?'0':'')+n,
  mmss(s){ s=Math.max(0,Math.round(s)); return Math.floor(s/60)+':'+U.pad(s%60); },
  plural(n, one, few, many){ const a=Math.abs(n)%100, b=a%10; if(a>10&&a<20) return many; if(b>1&&b<5) return few; if(b===1) return one; return many; },
  toast(msg){ const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.hidden=false; clearTimeout(U._tt); U._tt=setTimeout(()=>{t.hidden=true;},2400); },
  uid:()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  cap:s=>s? s.charAt(0).toUpperCase()+s.slice(1):s
};

const Day = {
  key(d){ d=d||new Date(); return d.getFullYear()+'-'+U.pad(d.getMonth()+1)+'-'+U.pad(d.getDate()); },
  idx(d){ d=d||new Date(); const loc=new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); return Math.floor(loc.getTime()/86400000); },
  shift(n){ const d=new Date(); d.setDate(d.getDate()+n); return d; }
};

/* ---------- Текст: нормализация, сокращения, сравнение ---------- */
const Txt = {
  CONTR:[["i am","i'm"],["you are","you're"],["he is","he's"],["she is","she's"],["it is","it's"],["we are","we're"],["they are","they're"],
    ["is not","isn't"],["are not","aren't"],["was not","wasn't"],["were not","weren't"],["do not","don't"],["does not","doesn't"],["did not","didn't"],
    ["can not","can't"],["can not","cannot"],["will not","won't"],["would not","wouldn't"],["should not","shouldn't"],["must not","mustn't"],
    ["have not","haven't"],["has not","hasn't"],["had not","hadn't"],["could not","couldn't"],
    ["i will","i'll"],["you will","you'll"],["he will","he'll"],["she will","she'll"],["it will","it'll"],["we will","we'll"],["they will","they'll"],
    ["i would","i'd"],["you would","you'd"],["he would","he'd"],["she would","she'd"],["we would","we'd"],["they would","they'd"],
    ["i have","i've"],["you have","you've"],["we have","we've"],["they have","they've"],
    ["there is","there's"],["what is","what's"],["that is","that's"],["who is","who's"],["where is","where's"],["how is","how's"],["when is","when's"],["let us","let's"]],
  norm(s){ return String(s==null?'':s).toLowerCase().replace(/[’‘`´]/g,"'").replace(/…/g,' ').replace(/[—–]/g,' ').replace(/[.,!?;:"«»()]/g,' ').replace(/\s+/g,' ').trim(); },
  expand(s){ let t=' '+s+' '; for(const p of Txt.CONTR){ t=t.split(' '+p[1]+' ').join(' '+p[0]+' '); } return t.replace(/\s+/g,' ').trim(); },
  canon(s){ return Txt.expand(Txt.norm(s)); },
  lev(a,b){ const m=a.length,n=b.length; if(!m) return n; if(!n) return m; let prev=new Array(n+1); for(let j=0;j<=n;j++) prev[j]=j;
    for(let i=1;i<=m;i++){ const cur=[i]; for(let j=1;j<=n;j++){ cur[j]=Math.min(prev[j]+1, cur[j-1]+1, prev[j-1]+(a[i-1]===b[j-1]?0:1)); } prev=cur; } return prev[n]; },
  /* сравнение ответа с набором допустимых; "…" в конце ответа = «дальше что угодно» */
  match(got, answers){
    const g=Txt.canon(got); if(!g) return {ok:false,best:answers[0]};
    let best=answers[0], bestD=1e9;
    for(const a of answers){
      const open=/…\s*$/.test(a); const c=Txt.canon(a);
      if(open){ if(g.startsWith(c)) return {ok:true,best:a}; continue; }
      const d=Txt.lev(g,c); if(d===0) return {ok:true,best:a};
      if(d<bestD){ bestD=d; best=a; }
    }
    const tol = g.length>=12?2 : g.length>=6?1 : 0;
    if(bestD<=tol) return {ok:'almost',best};
    return {ok:false,best};
  },
  wordDiff(exp, got){
    const a=Txt.canon(exp).split(' ').filter(Boolean), b=Txt.canon(got).split(' ').filter(Boolean);
    const m=a.length,n=b.length; const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
    for(let i=m-1;i>=0;i--) for(let j=n-1;j>=0;j--) dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
    const out=[]; let i=0,j=0,matched=0;
    while(i<m&&j<n){ if(a[i]===b[j]){out.push({w:a[i],c:'m'});matched++;i++;j++;} else if(dp[i+1][j]>=dp[i][j+1]){out.push({w:a[i],c:'x'});i++;} else {out.push({w:b[j],c:'i'});j++;} }
    while(i<m){out.push({w:a[i],c:'x'});i++;} while(j<n){out.push({w:b[j],c:'i'});j++;}
    return {parts:out, score:m?matched/m:0};
  },
  bestDiff(got, answers){ let best=null; for(const a of answers){ const d=Txt.wordDiff(a,got); if(!best||d.score>best.score){ best=d; best.exp=a; } } return best; },
  diffHtml(parts){ return '<span class=diff>'+parts.map(p=>'<span class='+p.c+'>'+U.esc(p.w)+'</span>').join(' ')+'</span>'; }
};

/* ---------- Хранилище и профили ---------- */
const Store = {
  PREFIX:'en30_',
  get(k,def){ try{ const v=localStorage.getItem(Store.PREFIX+k); return v==null?def:JSON.parse(v); }catch(e){ return def; } },
  set(k,v){ try{ localStorage.setItem(Store.PREFIX+k, JSON.stringify(v)); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(Store.PREFIX+k); }catch(e){} }
};

let P = null; /* текущий профиль */
const Prof = {
  list(){ return Store.get('profiles',[]); },
  blank(id,name){ return {id,name,created:Date.now(),v:1,cards:{},units:{},days:{},streak:0,best:0,xp:0,lastDone:null,dlgIdx:0,read:{},
    settings:{rate:0.9,voice:'',goal:30,theme:'auto',autoSpeak:true},session:null,placed:false}; },
  fill(p){ const b=Prof.blank(p.id,p.name); for(const k in b){ if(p[k]==null) p[k]=b[k]; } for(const k in b.settings){ if(p.settings[k]==null) p.settings[k]=b.settings[k]; } return p; },
  load(id){ const p=Store.get('prof_'+id,null); if(!p) return false; P=Prof.fill(p); Store.set('cur',id); return true; },
  save(){ if(P) Store.set('prof_'+P.id,P); },
  create(name){ const id=U.uid(); const l=Prof.list(); l.push({id,name}); Store.set('profiles',l); P=Prof.blank(id,name); Prof.save(); Store.set('cur',id); return P; },
  rename(name){ P.name=name; const l=Prof.list().map(x=>x.id===P.id?{id:x.id,name}:x); Store.set('profiles',l); Prof.save(); },
  remove(id){ Store.del('prof_'+id); const l=Prof.list().filter(x=>x.id!==id); Store.set('profiles',l); if(P&&P.id===id){ P=null; Store.del('cur'); if(l.length) Prof.load(l[0].id); } },
  boot(){ const cur=Store.get('cur',null); if(cur && Prof.load(cur)) return true; const l=Prof.list(); if(l.length && Prof.load(l[0].id)) return true; return false; },
  exportJSON(){ return JSON.stringify(P); },
  importJSON(txt){ const p=JSON.parse(txt); if(!p||!p.cards||!p.name) throw new Error('bad'); p.id=U.uid(); const l=Prof.list(); l.push({id:p.id,name:p.name+' (импорт)'}); p.name=p.name+' (импорт)'; Store.set('profiles',l); P=Prof.fill(p); Prof.save(); Store.set('cur',p.id); return P; },
  today(){ const k=Day.key(); if(!P.days[k]) P.days[k]={sec:0,xp:0,n:0,ok:0,done:false}; return P.days[k]; },
  recalcStreak(){ /* серия = подряд идущие дни с done, заканчивающиеся сегодня или вчера */
    let s=0; for(let i=0;i<400;i++){ const k=Day.key(Day.shift(-i)); const d=P.days[k]; if(d&&d.done) s++; else if(i===0) continue; else break; }
    P.streak=s; if(s>P.best) P.best=s; return s; },
  markDone(){ const t=Prof.today(); if(!t.done){ t.done=true; P.lastDone=Day.key(); Prof.recalcStreak(); } }
};

/* ---------- Содержание: реестр ключей ---------- */
const Content = {
  words:{}, chunks:{}, units:{}, wordList:[], chunkList:[], byTheme:{},
  wkey:(theme,en)=>'w:'+theme+':'+en,
  init(){
    VOCAB.forEach(t=>{ Content.byTheme[t.id]=[]; t.w.forEach(w=>{ const key=Content.wkey(t.id,w[0]); const o={key,en:w[0],ru:w[1],em:w[2],exEn:w[3],exRu:w[4],theme:t.id,kind:'w'}; Content.words[key]=o; Content.wordList.push(o); Content.byTheme[t.id].push(o); }); });
    CHUNKS.forEach((c,i)=>{ const key='c:'+i; const o={key,en:c[0],ru:c[1],em:c[2],theme:c[3],kind:'c'}; Content.chunks[key]=o; Content.chunkList.push(o); });
    GRAMMAR.forEach((u,i)=>{ u.n=i+1; Content.units[u.id]=u; });
  },
  get(key){ return Content.words[key]||Content.chunks[key]||null; },
  theme(id){ return VOCAB.find(t=>t.id===id); }
};

/* ---------- Интервальное повторение (SM-2 с лестницей этапов) ----------
   s: 0 новое, 1 узнаю, 2 вспоминаю, 3 использую, 4 освоено
   n: верных подряд, l: провалов, iv: интервал (дни), ef: лёгкость, due: день */
const SRS = {
  card:key=>P.cards[key]||null,
  ensure(key){ if(!P.cards[key]) P.cards[key]={s:0,iv:0,ef:2.5,n:0,l:0,due:Day.idx(),last:0,st:0,ok:0}; return P.cards[key]; },
  grade(key,g){
    const c=SRS.ensure(key), t=Day.idx(); c.st++; if(g>0) c.ok++;
    if(g===0){ c.l++; c.n=0; c.iv=0; c.ef=Math.max(1.3,c.ef-0.2); c.s=Math.max(1,c.s-1); c.due=t; }
    else {
      c.n++;
      if(g===1){ c.iv=c.n<=1?1:Math.max(1,Math.round(c.iv*1.2)); c.ef=Math.max(1.3,c.ef-0.15); }
      else { c.iv=c.n===1?1:c.n===2?3:Math.round(c.iv*c.ef); if(g===3){ c.iv=Math.round(c.iv*1.3); c.ef=Math.min(3,c.ef+0.1); } }
      c.iv=Math.min(c.iv,120); c.due=t+c.iv;
      if(c.s===0) c.s=1; if(c.n>=2&&c.s<2) c.s=2; if(c.n>=4&&c.s<3) c.s=3; if(c.n>=6&&c.iv>=21) c.s=4;
    }
    c.last=t;
  },
  markKnown(key){ const c=SRS.ensure(key), t=Day.idx(); c.s=2; c.n=2; c.iv=3; c.due=t+3; c.last=t; },
  due(prefix){ const t=Day.idx(); return Object.keys(P.cards).filter(k=>k.startsWith(prefix)&&P.cards[k].s>0&&P.cards[k].due<=t).sort((a,b)=>P.cards[a].due-P.cards[b].due); },
  dueCount(){ return SRS.due('w:').length+SRS.due('c:').length; },
  stage:key=>{ const c=P.cards[key]; return c?c.s:0; }
};

/* ---------- Генераторы дриллов (бесконечная практика) ---------- */
const Gen = {
  SUBJ:[["I","am","do","was"],["You","are","do","were"],["He","is","does","was"],["She","is","does","was"],["It","is","does","was"],["We","are","do","were"],["They","are","do","were"],["My mother","is","does","was"],["My friends","are","do","were"],["Tom","is","does","was"],["The children","are","do","were"],["Anna and Tom","are","do","were"],["My brother","is","does","was"],["The dog","is","does","was"]],
  QSUBJ:[["you","Are","Do","Did"],["he","Is","Does","Did"],["she","Is","Does","Did"],["it","Is","Does","Did"],["they","Are","Do","Did"],["we","Are","Do","Did"],["Tom","Is","Does","Did"],["your parents","Are","Do","Did"],["your sister","Is","Does","Did"],["the shop","Is","Does","Did"]],
  ADJ:["happy","tired","at home","from Russia","in the kitchen","busy","hungry","cold","ready","late","here","at work","in London","thirsty","angry","bored","very nice","in the garden"],
  VERBS:[["work","works","worked","working","in a bank"],["live","lives","lived","living","in Moscow"],["like","likes","liked","liking","coffee"],["play","plays","played","playing","football"],["read","reads","read","reading","books"],["go","goes","went","going","to work by bus"],["watch","watches","watched","watching","TV"],["study","studies","studied","studying","English"],["have","has","had","having","breakfast at 8"],["cook","cooks","cooked","cooking","dinner"],["speak","speaks","spoke","speaking","English"],["drink","drinks","drank","drinking","tea"],["eat","eats","ate","eating","pizza"],["write","writes","wrote","writing","emails"],["buy","buys","bought","buying","bread"],["get up","gets up","got up","getting up","at 7"],["clean","cleans","cleaned","cleaning","the room"],["visit","visits","visited","visiting","friends"]],
  NOUNS:[["cat","cats"],["box","boxes"],["city","cities"],["child","children"],["man","men"],["woman","women"],["bus","buses"],["baby","babies"],["foot","feet"],["tooth","teeth"],["person","people"],["watch","watches"],["knife","knives"],["boy","boys"],["tomato","tomatoes"],["mouse","mice"],["day","days"],["dish","dishes"],["leaf","leaves"],["sheep","sheep"],["glass","glasses"],["family","families"],["key","keys"],["potato","potatoes"]],
  ART:[["apple","an"],["egg","an"],["orange","an"],["hour","an"],["umbrella","an"],["engineer","an"],["old man","an"],["car","a"],["house","a"],["university","a"],["book","a"],["doctor","a"],["dog","a"],["big city","a"],["ice cream","an"],["idea","an"],["uniform","a"],["one-way street","a"],["actor","an"],["cup of tea","a"],["island","an"],["European city","a"]],
  make(id){
    const s=U.rnd(Gen.SUBJ), qs=U.rnd(Gen.QSUBJ), v=U.rnd(Gen.VERBS), adj=U.rnd(Gen.ADJ);
    switch(id){
      case 'be': return {t:'choice',q:s[0]+' ___ '+adj+'.',o:['am','is','are'],a:s[1],gen:1};
      case 'be_q': return Math.random()<0.5 ? {t:'choice',q:'___ '+qs[0]+' '+adj+'?',o:['Am','Is','Are'],a:qs[1],gen:1} : {t:'choice',q:s[0]+' ___ not '+adj+'.',o:['am','is','are'],a:s[1],gen:1};
      case 'ps': return {t:'choice',q:s[0]+' ___ '+v[4]+'.',o:[v[0],v[1]],a:s[2]==='does'?v[1]:v[0],gen:1};
      case 'ps_neg': return {t:'choice',q:s[0]+" ___ "+v[0]+' '+v[4]+'. (отрицание)',o:["don't","doesn't"],a:s[2]==='does'?"doesn't":"don't",gen:1};
      case 'ps_q': return {t:'choice',q:'___ '+qs[0]+' '+v[0]+' '+v[4]+'?',o:['Do','Does'],a:qs[2],gen:1};
      case 'plural': { const n=U.rnd(Gen.NOUNS); return {t:'gap',q:'one '+n[0]+' → two ___',a:[n[1]],gen:1}; }
      case 'art': { const a=U.rnd(Gen.ART); return {t:'choice',q:'___ '+a[0],o:['a','an'],a:a[1],gen:1}; }
      case 'pc': return {t:'choice',q:s[0]+' ___ '+v[3]+' '+v[4]+' now.',o:['am','is','are'],a:s[1],gen:1};
      case 'was': return {t:'choice',q:s[0]+' ___ '+adj+' yesterday.',o:['was','were'],a:s[3],gen:1};
      case 'past': return {t:'gap',q:s[0]+' ___ ('+v[0]+') '+v[4]+' yesterday.',a:[v[2]],gen:1};
      case 'past_q': return Math.random()<0.5 ? {t:'choice',q:'___ '+qs[0]+' '+v[0]+' '+v[4]+' yesterday?',o:['Did','Do','Was'],a:'Did',gen:1} : {t:'choice',q:s[0]+' ___ '+v[0]+' '+v[4]+' yesterday. (отрицание)',o:["didn't","doesn't","wasn't"],a:"didn't",gen:1};
    }
    return null;
  }
};

/* ---------- Задания «какое время?» для смешанной практики ----------
   Ученик сам выбирает время по слову-подсказке: usually → Present Simple, now → Continuous, yesterday → Past.
   Включается, когда пройдены хотя бы два из трёх времён. */
Gen.mix=function(avail){
  const k=U.rnd(avail); const s=U.rnd(Gen.SUBJ.filter(x=>x[0]!=='The dog'&&x[0]!=='It'));
  const verbs=k==='pc'?Gen.VERBS.filter(v=>!['like','live','get up','have'].includes(v[0])):Gen.VERBS; const v=U.rnd(verbs);
  if(k==='ps'){ const a=s[2]==='does'?v[1]:v[0];
    if(Math.random()<0.5){ const mk=U.rnd(['usually','often','always']); return {t:'gap',q:s[0]+' '+mk+' ___ ('+v[0]+') '+v[4]+'.',a:[a],unit:'ps_aff',why:'«'+mk+'» — привычка → Present Simple',mix:1}; }
    const mk=U.rnd(['every day','on Sundays','every evening']); return {t:'gap',q:s[0]+' ___ ('+v[0]+') '+v[4]+' '+mk+'.',a:[a],unit:'ps_aff',why:'«'+mk+'» — привычка → Present Simple',mix:1}; }
  if(k==='pc'){ const a=s[1]+' '+v[3];
    if(Math.random()<0.4) return {t:'gap',q:'Look! '+s[0]+' ___ ('+v[0]+') '+v[4]+'.',a:[a],unit:'pc',why:'«Look!» — прямо сейчас → am / is / are + -ing',mix:1};
    const mk=U.rnd(['now','at the moment','right now']); return {t:'gap',q:s[0]+' ___ ('+v[0]+') '+v[4]+' '+mk+'.',a:[a],unit:'pc',why:'«'+mk+'» — прямо сейчас → am / is / are + -ing',mix:1}; }
  const mk=U.rnd(['yesterday','last week','two days ago','last Sunday']); return {t:'gap',q:s[0]+' ___ ('+v[0]+') '+v[4]+' '+mk+'.',a:[v[2]],unit:'past_irr',why:'«'+mk+'» — прошлое → Past Simple',mix:1};
};

/* ---------- Планировщик занятия ----------
   Занятие — конечный список заданий примерно на P.settings.goal минут, без таймера.
   Время задания оценивается по таблице EST, а по мере занятий — по реальному темпу ученика (P.pace).
   Внутри занятия одно и то же задание не повторяется: слово попадает только в один блок,
   пример из правила используется один раз; вернуться может только задание с ошибкой (не больше 3 на блок).
   Сложность: easy / normal / hard, по умолчанию «авто» по точности последних дней. */
const EST={choice:15,gap:22,build:35,tr:45,err:35,wchoice:12,cchoice:12,listen:14,wtype:22,letters:22,scramble:25,dict:22,dictS:45,match:50,card:14,lesson:180,recap:50,shadow:40,say:40,sayS:45,dialog:150,read:240};
const LEVELS={easy:'лёгкая',normal:'обычная',hard:'сложная'};
const Planner = {
  /* освоение темы: точность последних ответов × «насыщенность». При точности от 90 % хватает 10 ответов
     (тема закрывается за одно занятие), иначе нужно 14 (два занятия). */
  unitProg(id){ const u=P.units[id]; if(!u||!u.h||!u.h.length) return 0; const h=u.h.slice(-20); const acc=h.reduce((a,b)=>a+b,0)/h.length; return Math.round(acc*100*Math.min(1,h.length/(acc>=0.9?10:14))); },
  GRAM_TYPES:['choice','gap','build','tr','err'],
  /* тема «закрыта» при 75 % и открывается заново, только если точность упала ниже 50 % */
  unitDone(id){ const u=P.units[id]; if(!u) return false; const p=Planner.unitProg(id); if(p>=75) u.done=true; if(u.done&&p<50) u.done=false; return !!u.done; },
  currentUnit(){ for(const u of GRAMMAR){ if(!Planner.unitDone(u.id)) return u; } return GRAMMAR[GRAMMAR.length-1]; },
  unitsForReview(n, excl){ const seen=GRAMMAR.filter(u=>u.id!==excl&&P.units[u.id]&&P.units[u.id].h&&P.units[u.id].h.length);
    seen.sort((a,b)=>(Planner.unitProg(a.id)-Planner.unitProg(b.id))||((P.units[a.id].last||0)-(P.units[b.id].last||0))); return seen.slice(0,n); },
  knownWords(){ return Content.wordList.filter(w=>{ const c=P.cards[w.key]; return c&&c.s>=1; }); },
  currentTheme(){ for(const t of VOCAB){ if(Content.byTheme[t.id].some(w=>!P.cards[w.key])) return t; } return null; },
  /* новые слова по порядку тем; на стыке тем берём из следующей, чтобы не было «огрызков» по 2 слова */
  newWords(n){ const out=[]; for(const t of VOCAB){ for(const w of Content.byTheme[t.id]){ if(out.length>=n) return out; if(!P.cards[w.key]) out.push(w); } } return out; },
  newChunks(n, theme){ const list=Content.chunkList.filter(c=>!P.cards[c.key]); const same=list.filter(c=>theme&&c.theme===theme); const out=same.slice(0,n); for(const c of list){ if(out.length>=n) break; if(!out.includes(c)) out.push(c); } return out; },
  distractors(key,n){ const w=Content.words[key]; const same=Content.byTheme[w.theme].filter(x=>x.key!==key&&x.ru!==w.ru&&x.en!==w.en); let pool=U.shuffle(same).slice(0,n); if(pool.length<n){ const rest=U.shuffle(Content.wordList.filter(x=>x.theme!==w.theme&&x.ru!==w.ru&&x.en!==w.en)); pool=pool.concat(rest.slice(0,n-pool.length)); } return pool.map(x=>x.key); },
  chunkDistractors(key,n){ return U.pick(Content.chunkList.filter(c=>c.key!==key),n).map(c=>c.key); },
  HIDE:{easy:0.4,normal:0.5,hard:0.65},
  wordEx(key,type,lvl){
    const w=Content.words[key]; if(!w) return null;
    switch(type){
      case 'wchoice': return {t:'wchoice',key,dir:U.rnd(['ru2en','ru2en','en2ru']),opts:Planner.distractors(key,3)};
      case 'listen': return {t:'listen',key,opts:Planner.distractors(key,3)};
      case 'say': return {t:'say',ru:w.ru,a:[w.en],key,em:w.em};
      case 'letters': return {t:'letters',key,hide:Planner.HIDE[lvl||'normal']};
      case 'scramble': if(/\s|-/.test(w.en)||w.en.length<3) return {t:'letters',key,hide:Planner.HIDE[lvl||'normal']}; return {t:'scramble',key};
      default: return {t:type,key};
    }
  },
  chunkEx(key,type){ const c=Content.chunks[key]; switch(type){ case 'cchoice': return {t:'cchoice',key,opts:Planner.chunkDistractors(key,3)}; case 'tr': return {t:'tr',ru:c.ru,a:[c.en],key}; default: return {t:'say',ru:c.ru,a:[c.en],key,em:c.em}; } },
  /* предложение годится для «собери из плиток»: 3–9 слов, без тире и кавычек */
  sentOkStr(en){ if(!en||/[—–"«»]/.test(en)) return false; const n=en.split(' ').length; return n>=3&&n<=9; },
  sentOk(w){ return !!w&&Planner.sentOkStr(w.exEn); },
  CONFUSERS:['is','are','am','do','does','a','an','the','to','in','on','at','was','were','has','have'],
  confuser(en){ const words=en.toLowerCase().replace(/[.,!?]/g,'').split(' '); const c=U.shuffle(Planner.CONFUSERS).find(x=>!words.includes(x)); return c||'the'; },
  /* текст предложения в задании (для сверки повторов внутри занятия) */
  sentKey(it){ if(!it) return null; let t=null; if(it.t==='build') t=it.en; else if(it.t==='tr'||it.t==='say') t=it.a&&it.a[0]; else if(it.t==='err') t=it.a; else if(it.t==='dict') t=it.text; else if(it.t==='shadow') t=it.en; return t?Txt.canon(t):null; },
  sentBuild(key,lvl){ const w=Content.words[key]; return {t:'build',en:w.exEn,ru:w.exRu,extra:lvl==='hard'?[Planner.confuser(w.exEn)]:[],key}; },
  /* уровень: ручной из настроек или «авто» по точности последних дней (с запасом, чтобы не скакать туда-сюда) */
  autoLevel(){ const ks=Object.keys(P.days).sort().slice(-6); let n=0,ok=0; ks.forEach(k=>{ n+=P.days[k].n||0; ok+=P.days[k].ok||0; });
    const cur=P.autoLvl||'normal'; if(n<25) return cur; const a=ok/n;
    if(a>=0.88) return 'hard'; if(a<0.62) return 'easy'; if(cur==='hard'&&a>=0.78) return 'hard'; if(cur==='easy'&&a<0.7) return 'easy'; return 'normal'; },
  level(){ const s=P.settings.level||'auto'; return s==='auto'?Planner.autoLevel():s; },
  /* какой тип задания дать карточке: по её этапу; на сложном уровне — на ступень выше */
  itemFor(key,lvl){ lvl=lvl||Planner.level(); const e=Math.min(4,SRS.stage(key)+(lvl==='hard'?1:0));
    if(key.startsWith('w:')){ const w=Content.words[key]; let types;
      if(e<=1) types=lvl==='easy'?['wchoice','listen']:['wchoice','listen','wtype'];
      else if(e===2) types=['wtype','letters','dict'];
      else types=['wtype','dict','scramble','wtype','dict','say'].concat(Planner.sentOk(w)?['sent']:[]);
      const t=U.rnd(types); return t==='sent'?Planner.sentBuild(key,lvl):Planner.wordEx(key,t,lvl); }
    return Planner.chunkEx(key, e<=1?'cchoice': e===2?'tr':U.rnd(['tr','say'])); },
  unitDrills(unit,n,exclude){ const used=exclude||[]; let d=U.shuffle(unit.drills.filter((x,i)=>!used.includes(i)).map(x=>Object.assign({},x,{unit:unit.id}))).slice(0,n);
    const rank={choice:0,gap:1,build:2,err:2,tr:3}; d.sort((a,b)=>rank[a.t]-rank[b.t]); return d; },
  /* оценка времени */
  estKey(it){ if(it.t==='dict'&&it.text) return 'dictS'; if(it.t==='say'&&it.a&&it.a[0].split(' ').length>3) return 'sayS'; return it.t; },
  est(it){ if(!it) return 0; const k=Planner.estKey(it); const base=EST[k]||25; const p=P.pace&&P.pace[k]; return p?Math.max(base*0.5,Math.min(base*2,p)):base; },
  estSum(items){ return items.reduce((a,it)=>a+Planner.est(it),0); },
  recordPace(it,sec){ if(!it||!(sec>0)) return; const k=Planner.estKey(it); const base=EST[k]||25; const s=Math.max(base*0.4,Math.min(base*2.5,sec)); P.pace=P.pace||{}; P.pace[k]=P.pace[k]?Math.round((P.pace[k]*0.8+s*0.2)*10)/10:s; },
  mixAvail(){ const ok=id=>P.units[id]&&(P.units[id].seen||P.units[id].done); const out=[]; if(ok('ps_aff')) out.push('ps'); if(ok('pc')) out.push('pc'); if(ok('past_irr')) out.push('past'); return out.length>=2?out:[]; },
  /* примеры из правил: сначала текущая тема, потом пройденные */
  exPool(unit){ const tag=u=>e=>Object.assign({unit:u.id},e); const cur=U.shuffle(unit.ex.map(tag(unit)));
    const prev=U.shuffle([].concat(...GRAMMAR.filter(u=>u.id!==unit.id&&P.units[u.id]&&P.units[u.id].seen).map(u=>u.ex.map(tag(u)))));
    return cur.concat(prev).filter(e=>!/—/.test(e.en)); },
  freshEx(unit,used){ return Planner.exPool(unit).filter(e=>!used.ex.has(Txt.canon(e.en))); },
  grammarBlock(unit,lvl,budget,used){
    const us=P.units[unit.id]||{}; const items=[!us.seen?{t:'lesson',unit:unit.id}:{t:'recap',unit:unit.id}];
    const shown=us.sh||{};
    let cand=unit.drills.map((d,i)=>Object.assign({},d,{unit:unit.id,di:'d'+i}));
    const drillSents=new Set(cand.map(Planner.sentKey).filter(Boolean));
    if(lvl!=='easy') unit.ex.forEach((e,i)=>{ if(Planner.sentOkStr(e.en)&&!drillSents.has(Txt.canon(e.en))&&!used.ex.has(Txt.canon(e.en))) cand.push({t:'build',en:e.en,ru:e.ru,extra:lvl==='hard'?[Planner.confuser(e.en)]:[],unit:unit.id,di:'e'+i,exs:e.en}); });
    cand=U.shuffle(cand).sort((a,b)=>(shown[a.di]||0)-(shown[b.di]||0));
    const isNew=items[0].t==='lesson'; const capChoice={easy:99,normal:5,hard:3}[lvl];
    const reviewN=Math.max(1,({easy:1,normal:2,hard:3})[lvl]-(isNew?1:0));
    const mixAvail=lvl==='easy'?[]:Planner.mixAvail(), mixN=mixAvail.length?(lvl==='hard'&&!isNew?2:1):0;
    const reserve=reviewN*30+mixN*25; let sum=Math.min(Planner.est(items[0]),90); const picked=[]; let nChoice=0;
    for(const c of cand){ if(sum>=budget-reserve) break; const ck=Planner.sentKey(c); if(ck&&used.ex.has(ck)) continue; if(c.t==='choice'){ if(nChoice>=capChoice) continue; nChoice++; } picked.push(c); sum+=Planner.est(c); const sk=Planner.sentKey(c); if(sk) used.ex.add(sk); }
    const rank={choice:0,gap:1,build:2,err:3,tr:4}; picked.sort((a,b)=>rank[a.t]-rank[b.t]);
    if(lvl==='easy'&&unit.gen){ const g=Gen.make(unit.gen); if(g) picked.splice(Math.min(2,picked.length),0,Object.assign(g,{unit:unit.id})); }
    const extra=[]; for(let i=0;i<mixN;i++){ const m=Gen.mix(mixAvail); if(m&&!extra.some(x=>x.q===m.q)) extra.push(m); }
    const have=new Set(picked.map(x=>x.unit+':'+x.di));
    const takeFrom=u=>{ let pool=u.drills.map((d,i)=>Object.assign({},d,{unit:u.id,di:'d'+i,review:true})).filter(d=>!have.has(d.unit+':'+d.di));
      if(lvl==='hard'){ const prod=pool.filter(d=>d.t!=='choice'); if(prod.length) pool=prod; }
      pool=pool.filter(d=>{ const k=Planner.sentKey(d); return !k||!used.ex.has(k); });
      const sh=(P.units[u.id]&&P.units[u.id].sh)||{}; pool=U.shuffle(pool).sort((a,b)=>(sh[a.di]||0)-(sh[b.di]||0)); const d=pool[0]; if(d){ have.add(d.unit+':'+d.di); const k=Planner.sentKey(d); if(k) used.ex.add(k); } return d; };
    Planner.unitsForReview(reviewN,unit.id).forEach(u=>{ const d=takeFrom(u); if(d) extra.push(d); });
    U.shuffle(extra).forEach((x,i,arr)=>{ const pos=Math.min(picked.length,Math.round((i+1)*picked.length/(arr.length+1))+1); picked.splice(pos,0,x); });
    items.push(...picked); sum=Planner.estSum(items)-Math.max(0,Planner.est(items[0])-90);
    /* своя тема закончилась, а время есть — добираем из других пройденных тем (это другой материал, не повтор) */
    const others=Planner.unitsForReview(12,unit.id); let oi=0, guard=0;
    while(sum<budget-20&&others.length&&guard<20){ guard++; const d=takeFrom(others[oi%others.length]); oi++; if(d){ items.push(d); sum+=Planner.est(d); } }
    return items;
  },
  /* сколько новых слов помещается в бюджет блока: от максимума уровня вниз до 3 */
  vocabFit(lvl,f,used,cut,budget){ const max=Math.max(3,Math.round(({easy:5,normal:6,hard:8})[lvl]*f)-(cut||0));
    for(let n=max;n>3;n--){ const trial={keys:new Set(used.keys),ex:new Set(used.ex),due:used.due}; if(Planner.estSum(Planner.vocabBlock(lvl,f,trial,n).items)<=budget) return Planner.vocabBlock(lvl,f,used,n); }
    return Planner.vocabBlock(lvl,f,used,3); },
  vocabBlock(lvl,f,used,n){
    const nw=Planner.newWords(n); const themes=[...new Set(nw.map(w=>w.theme))].map(id=>Content.theme(id));
    const items=[];
    if(!nw.length){ U.shuffle(Planner.knownWords().filter(w=>!used.keys.has(w.key))).slice(0,10).forEach(w=>{ items.push(Planner.itemFor(w.key,lvl)); used.keys.add(w.key); }); }
    else {
      const groups=[]; for(let i=0;i<nw.length;i+=4) groups.push(nw.slice(i,i+4));
      if(groups.length>1&&groups[groups.length-1].length<3){ const tail=groups.pop(); groups[groups.length-1]=groups[groups.length-1].concat(tail); }
      groups.forEach(g=>{ g.forEach(w=>items.push({t:'card',key:w.key}));
        if(lvl==='easy') g.forEach(w=>items.push(Planner.wordEx(w.key,'wchoice',lvl)));
        if(g.length>=3) items.push({t:'match',keys:g.map(w=>w.key)}); else if(lvl!=='easy') g.forEach(w=>items.push(Planner.wordEx(w.key,'wchoice',lvl))); });
      const prod=lvl==='easy'?['wtype']:lvl==='normal'?['wtype','dict']:['wtype','dict','letters'];
      U.shuffle(nw).forEach((w,i)=>items.push(Planner.wordEx(w.key,prod[i%prod.length],lvl)));
      if(lvl!=='easy') U.pick(nw.filter(w=>Planner.sentOk(w)&&!used.ex.has(Txt.canon(w.exEn))),lvl==='hard'?2:1).forEach(w=>{ items.push(Planner.sentBuild(w.key,lvl)); used.ex.add(Txt.canon(w.exEn)); });
      nw.forEach(w=>used.keys.add(w.key));
    }
    /* фразы выбираем после слов: предложение-пример к слову и новая фраза не должны совпадать */
    const nc=Planner.newChunks(6, themes[0]?themes[0].id:null).filter(c=>!used.ex.has(Txt.canon(c.en))).slice(0,f>=0.6?2:1);
    nc.forEach(c=>items.push({t:'card',key:c.key})); nc.forEach(c=>{ items.push(Planner.chunkEx(c.key,lvl==='hard'?'tr':'cchoice')); used.keys.add(c.key); used.ex.add(Txt.canon(c.en)); });
    const title=themes.length?themes.slice(0,2).map(t=>t.title).join(' · '):'Слова';
    return {id:'vocab',title,icon:themes[0]?themes[0].icon:'🗂️',items,theme:themes[0]?themes[0].id:null,newW:nw.length,newC:nc.length};
  },
  spellBlock(lvl,f,used,unit,readDay){
    const known=Content.wordList.filter(w=>P.cards[w.key]&&P.cards[w.key].s>=1&&!used.keys.has(w.key)&&!used.due.has(w.key));
    const pool=U.shuffle(known);
    let plan=lvl==='easy'?['letters','letters','scramble','scramble','dict','dict','S']:lvl==='normal'?['dict','dict','dict','letters','letters','scramble','S']:['dict','dict','dict','letters','letters','letters','S','S'];
    plan=plan.slice(0,Math.max(3,Math.round(plan.length*f)-(readDay?2:0)));
    const exs=Planner.freshEx(unit,used); const items=[]; let wi=0;
    const sent=()=>{ const e=exs.shift(); if(e){ items.push({t:'dict',text:e.en,ru:e.ru,unit:e.unit}); used.ex.add(Txt.canon(e.en)); } };
    /* знакомых слов не хватает (первые дни) — вместо слов диктуем предложения, а не повторяем сегодняшние новые слова */
    for(const p of plan){ if(p==='S'){ sent(); continue; } const w=pool[wi++]; if(!w){ if(p==='dict') sent(); continue; }
      items.push(p==='dict'?{t:'dict',key:w.key}:Planner.wordEx(w.key,p,lvl)); used.keys.add(w.key); }
    return items.length?{id:'spell',title:'Правописание',icon:'✍️',items:U.shuffle(items)}:null;
  },
  speakBlock(lvl,f,used,unit,withDialog){
    const items=[]; const exs=Planner.freshEx(unit,used);
    const nShadow=({easy:3,normal:2,hard:1})[lvl]+(withDialog||lvl!=='easy'?0:1), nSay=({easy:0,normal:1,hard:2})[lvl]+(withDialog||lvl==='easy'?0:1);
    for(let i=0;i<nShadow;i++){ const e=exs.shift(); if(e){ items.push({t:'shadow',en:e.en,ru:e.ru,unit:e.unit}); used.ex.add(Txt.canon(e.en)); } }
    for(let i=0;i<nSay;i++){ const e=exs.shift(); if(e){ items.push({t:'say',ru:e.ru,a:[e.en],unit:e.unit}); used.ex.add(Txt.canon(e.en)); } }
    const okC=c=>!used.keys.has(c.key)&&!used.ex.has(Txt.canon(c.en));
    let cs=U.shuffle(Content.chunkList.filter(c=>P.cards[c.key]&&okC(c))); if(cs.length<2) cs=cs.concat(U.shuffle(Content.chunkList.filter(c=>!P.cards[c.key]&&okC(c))));
    cs.slice(0,2).forEach(c=>{ items.push({t:'say',ru:c.ru,a:[c.en],key:c.key,em:c.em}); used.keys.add(c.key); used.ex.add(Txt.canon(c.en)); });
    let dialog=null; if(withDialog){ dialog=DIALOGS[(P.dlgIdx||0)%DIALOGS.length]; items.push({t:'dialog',id:dialog.id}); }
    return {id:'speak',title:'Говорение',icon:'🎤',items,dialog:dialog?dialog.title:null};
  },
  build(){
    const lvl=Planner.level(); if((P.settings.level||'auto')==='auto') P.autoLvl=lvl;
    const f=(P.settings.goal||30)/30, target=(P.settings.goal||30)*60;
    const sessionsBefore=Object.values(P.days).filter(d=>d.done).length; const readDay=sessionsBefore%3===2;
    const due=SRS.due('w:').concat(SRS.due('c:')); const hasKnown=Object.keys(P.cards).some(k=>P.cards[k].s>=1);
    /* повторению — время по числу карточек, которые пора вспомнить (от 2,5 до 8 мин);
       если долг по повторению большой, новых слов сегодня меньше — иначе старые забудутся */
    const R=hasKnown?Math.max(150*f,Math.min(480*f,due.length*22)):0;
    const cut=Math.max(0,Math.ceil((due.length-25)/10));
    const unit=Planner.currentUnit();
    const make=gBudget=>{ const used={keys:new Set(),ex:new Set(),due:new Set(due)};
      const g={id:'grammar',title:'Грамматика',icon:'🧱',unit:unit.id,items:Planner.grammarBlock(unit,lvl,gBudget,used)};
      const v=Planner.vocabFit(lvl,f,used,cut,420*f);
      const sp=Planner.spellBlock(lvl,f,used,unit,readDay);
      let rd=null; if(readDay){ const tx=TEXTS.slice().sort((a,b)=>((P.read[a.id]||0)-(P.read[b.id]||0)))[0]; rd={id:'read',title:'Чтение: '+tx.title,icon:'📖',items:[{t:'read',id:tx.id}]}; }
      const sk=Planner.speakBlock(lvl,f,used,unit,f>=0.6&&sessionsBefore%2===0);
      return {used,g,v,sp,rd,sk}; };
    /* два прохода: первый меряет блоки слов, письма и речи, второй отдаёт грамматике остаток времени */
    let parts=make(540*f);
    const fixed=[parts.v,parts.sp,parts.rd,parts.sk].filter(Boolean).reduce((a,b)=>a+Planner.estSum(b.items),0);
    parts=make(Math.round(Math.max(300*f,Math.min(600*f,target-R-fixed))));
    const {used,g,v,sp,rd,sk}=parts; const others=[g,v,sp,rd,sk].filter(Boolean);
    const lessonExtra=g.items[0]&&g.items[0].t==='lesson'?Math.max(0,Planner.est(g.items[0])-90):0;
    const rest=target-others.reduce((a,b)=>a+Planner.estSum(b.items),0)+lessonExtra;
    const budget=hasKnown?Math.max(R,Math.min(480*f,rest)):0; const rv=[]; let sum=0;
    const revItem=k=>{ let it=Planner.itemFor(k,lvl); if(!it) return null; const sk1=Planner.sentKey(it); if(sk1&&used.ex.has(sk1)) it=k.startsWith('w:')?Planner.wordEx(k,'wtype',lvl):Planner.chunkEx(k,'cchoice'); const sk2=Planner.sentKey(it); if(sk2) used.ex.add(sk2); return it; };
    for(const k of used.due){ if(sum>=budget) break; if(used.keys.has(k)) continue; const it=revItem(k); if(!it) continue; rv.push(it); used.keys.add(k); sum+=Planner.est(it); }
    /* то, что пора повторить, закончилось — освежаем давно не встречавшиеся слова */
    const warm=Content.wordList.filter(w=>P.cards[w.key]&&P.cards[w.key].s>=1&&!used.keys.has(w.key)).sort((a,b)=>(P.cards[a.key].last||0)-(P.cards[b.key].last||0));
    for(const w of warm){ if(sum>=budget) break; const it=revItem(w.key); if(!it) continue; rv.push(it); used.keys.add(w.key); sum+=Planner.est(it); }
    const blocks=[]; if(rv.length) blocks.push({id:'review',title:'Повторение',icon:'🔁',items:U.shuffle(rv)}); blocks.push(...others);
    blocks.forEach(b=>{ b.items=b.items.filter(Boolean); b.i=0; b.spent=0; b.done=false; b.n=0; b.ok=0; b.rq=0; });
    const est=blocks.reduce((a,b)=>a+Planner.estSum(b.items),0);
    return {v:2,date:Day.key(),bi:0,blocks,created:Date.now(),finished:false,n:0,ok:0,xp:0,free:false,lvl,est,due:due.length};
  },
  /* свободные блоки для раздела «Практика» */
  freeBlock(kind, arg){
    const lvl=Planner.level();
    switch(kind){
      case 'unit': { const u=Content.units[arg]; const items=Planner.unitDrills(u,12); if(u.gen){ for(let i=0;i<2;i++){ const g=Gen.make(u.gen); if(g) items.splice(2+i*4,0,Object.assign(g,{unit:u.id})); } } return {id:'grammar',title:u.title,icon:u.icon,items,unit:u.id}; }
      case 'theme': { const t=Content.theme(arg); const ws=Content.byTheme[t.id]; const fresh=ws.filter(w=>!P.cards[w.key]).slice(0,6); const items=[]; fresh.forEach(w=>items.push({t:'card',key:w.key})); if(fresh.length>=3) items.push({t:'match',keys:fresh.map(w=>w.key)}); else fresh.forEach(w=>items.push(Planner.wordEx(w.key,'wchoice',lvl))); fresh.forEach(w=>items.push(Planner.wordEx(w.key,'wtype',lvl)));
        const known=U.pick(ws.filter(w=>P.cards[w.key]&&!fresh.includes(w)),fresh.length?4:10); known.forEach(w=>items.push(Planner.itemFor(w.key,lvl))); return {id:'vocab',title:t.title,icon:t.icon,items,theme:t.id}; }
      case 'phrases': { const fresh=Planner.newChunks(4,null); const items=[]; fresh.forEach(c=>items.push({t:'card',key:c.key})); fresh.forEach(c=>items.push(Planner.chunkEx(c.key,lvl==='hard'?'tr':'cchoice'))); const known=U.pick(Content.chunkList.filter(c=>P.cards[c.key]&&!fresh.includes(c)),4); known.forEach(c=>items.push(Planner.itemFor(c.key,lvl))); return {id:'vocab',title:'Фразы',icon:'💬',items}; }
      case 'spell': { const known=U.shuffle(Planner.knownWords()); const pool=known.length>=10?known:known.concat(U.pick(Content.wordList,10)); const items=[]; pool.slice(0,4).forEach(w=>items.push({t:'dict',key:w.key})); pool.slice(4,8).forEach(w=>items.push(Planner.wordEx(w.key,'letters',lvl))); pool.slice(8,11).forEach(w=>items.push(Planner.wordEx(w.key,'scramble',lvl))); U.pick(Planner.exPool(Planner.currentUnit()),2).forEach(e=>items.push({t:'dict',text:e.en,ru:e.ru,unit:e.unit})); return {id:'spell',title:'Правописание',icon:'✍️',items:U.shuffle(items)}; }
      case 'speak': { const exs=Planner.exPool(Planner.currentUnit()); const items=[]; exs.slice(0,2).forEach(e=>items.push({t:'shadow',en:e.en,ru:e.ru,unit:e.unit})); exs.slice(2,4).forEach(e=>items.push({t:'say',ru:e.ru,a:[e.en],unit:e.unit})); const cs=Content.chunkList.filter(c=>P.cards[c.key]); (cs.length>=3?U.pick(cs,3):U.pick(Content.chunkList,3)).forEach(c=>items.push({t:'say',ru:c.ru,a:[c.en],key:c.key,em:c.em})); return {id:'speak',title:'Говорение',icon:'🎤',items}; }
      case 'dialog': return {id:'speak',title:DIALOGS.find(d=>d.id===arg).title,icon:'🗣️',items:[{t:'dialog',id:arg}]};
      case 'text': return {id:'read',title:TEXTS.find(t=>t.id===arg).title,icon:'📖',items:[{t:'read',id:arg}]};
      case 'placement': { const items=[]; GRAMMAR.forEach((u,i)=>{ if(i%2===0&&i<30){ const d=U.rnd(u.drills.filter(x=>x.t==='choice')); if(d) items.push(Object.assign({},d,{unit:u.id,placement:true})); } }); return {id:'test',title:'Мини-тест',icon:'🧪',items,noRequeue:true}; }
    }
    return null;
  }
};

/* ---------- Речь: озвучка и распознавание ---------- */
const Speech = {
  voices:[], _loaded:false,
  init(){ if(!('speechSynthesis' in window)) return; const load=()=>{ Speech.voices=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang)); Speech._loaded=true; }; load(); speechSynthesis.onvoiceschanged=load; setTimeout(load,500); },
  canSpeak:()=>('speechSynthesis' in window),
  canListen:()=>!!(window.SpeechRecognition||window.webkitSpeechRecognition),
  pickVoice(){ const want=P&&P.settings.voice; if(want){ const v=Speech.voices.find(v=>v.name===want); if(v) return v; }
    const pref=[/Google US English/i,/Microsoft (Aria|Jenny|Guy|Ana|Michelle)/i,/Samantha/i,/Google UK English Female/i,/Microsoft (Zira|David|Mark)/i,/Daniel/i,/Karen/i,/Moira/i];
    for(const re of pref){ const v=Speech.voices.find(v=>re.test(v.name)); if(v) return v; }
    return Speech.voices.find(v=>/en[-_]US/i.test(v.lang))||Speech.voices[0]||null; },
  say(text, opts){ opts=opts||{}; if(!Speech.canSpeak()) { if(opts.onend) opts.onend(); return; }
    try{ speechSynthesis.cancel(); }catch(e){}
    const u=new SpeechSynthesisUtterance(text); const v=Speech.pickVoice(); if(v) u.voice=v; u.lang=(v&&v.lang)||'en-US'; u.rate=opts.rate||(P?P.settings.rate:0.9); u.pitch=1;
    if(opts.onend) u.onend=opts.onend; u.onerror=()=>{ if(opts.onend) opts.onend(); };
    Speech._u=u; setTimeout(()=>speechSynthesis.speak(u),30); },
  stop(){ try{ speechSynthesis.cancel(); }catch(e){} if(Speech._rec){ try{ Speech._rec.abort(); }catch(e){} Speech._rec=null; } },
  listen(cb){ const R=window.SpeechRecognition||window.webkitSpeechRecognition; if(!R) return null;
    const r=new R(); r.lang='en-US'; r.interimResults=true; r.maxAlternatives=3; r.continuous=false; let fin='', alts=[];
    r.onresult=e=>{ let interim=''; for(let i=e.resultIndex;i<e.results.length;i++){ const res=e.results[i]; if(res.isFinal){ fin=res[0].transcript; alts=Array.from(res).map(a=>a.transcript); } else interim+=res[0].transcript; } if(interim&&cb.onInterim) cb.onInterim(interim); };
    r.onerror=e=>{ if(cb.onError) cb.onError(e.error); };
    r.onend=()=>{ Speech._rec=null; if(cb.onEnd) cb.onEnd(fin, alts.length?alts:[fin]); };
    try{ r.start(); }catch(e){ if(cb.onError) cb.onError('start'); return null; }
    Speech._rec=r; return r; }
};

/* ---------- Оформление темы ---------- */
const Theme = { apply(){ const t=P?P.settings.theme:'auto'; if(t==='auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme',t); } };
