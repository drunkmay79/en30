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

/* ---------- Планировщик занятия ---------- */
const Planner = {
  /* освоение темы: точность последних ответов × «насыщенность» (нужно минимум ~14 ответов, то есть два занятия) */
  unitProg(id){ const u=P.units[id]; if(!u||!u.h||!u.h.length) return 0; const h=u.h.slice(-20); const acc=h.reduce((a,b)=>a+b,0)/h.length; return Math.round(acc*100*Math.min(1,h.length/14)); },
  GRAM_TYPES:['choice','gap','build','tr','err'],
  /* тема «закрыта» при 75 % и открывается заново, только если точность упала ниже 50 % */
  unitDone(id){ const u=P.units[id]; if(!u) return false; const p=Planner.unitProg(id); if(p>=75) u.done=true; if(u.done&&p<50) u.done=false; return !!u.done; },
  currentUnit(){ for(const u of GRAMMAR){ if(!Planner.unitDone(u.id)) return u; } return GRAMMAR[GRAMMAR.length-1]; },
  unitsForReview(n, excl){ const seen=GRAMMAR.filter(u=>u.id!==excl&&P.units[u.id]&&P.units[u.id].h&&P.units[u.id].h.length);
    seen.sort((a,b)=>(Planner.unitProg(a.id)-Planner.unitProg(b.id))||((P.units[a.id].last||0)-(P.units[b.id].last||0))); return seen.slice(0,n); },
  knownWords(){ return Content.wordList.filter(w=>{ const c=P.cards[w.key]; return c&&c.s>=1; }); },
  currentTheme(){ for(const t of VOCAB){ if(Content.byTheme[t.id].some(w=>!P.cards[w.key])) return t; } return null; },
  newWords(n){ const t=Planner.currentTheme(); if(!t) return []; return Content.byTheme[t.id].filter(w=>!P.cards[w.key]).slice(0,n); },
  newChunks(n, theme){ const list=Content.chunkList.filter(c=>!P.cards[c.key]); const same=list.filter(c=>theme&&c.theme===theme); const out=same.slice(0,n); for(const c of list){ if(out.length>=n) break; if(!out.includes(c)) out.push(c); } return out; },
  distractors(key,n){ const w=Content.words[key]; const same=Content.byTheme[w.theme].filter(x=>x.key!==key&&x.ru!==w.ru&&x.en!==w.en); let pool=U.shuffle(same).slice(0,n); if(pool.length<n){ const rest=U.shuffle(Content.wordList.filter(x=>x.theme!==w.theme&&x.ru!==w.ru&&x.en!==w.en)); pool=pool.concat(rest.slice(0,n-pool.length)); } return pool.map(x=>x.key); },
  chunkDistractors(key,n){ return U.pick(Content.chunkList.filter(c=>c.key!==key),n).map(c=>c.key); },
  wordEx(key,type){
    const w=Content.words[key]; if(!w) return null;
    switch(type){
      case 'wchoice': return {t:'wchoice',key,dir:U.rnd(['ru2en','ru2en','en2ru']),opts:Planner.distractors(key,3)};
      case 'listen': return {t:'listen',key,opts:Planner.distractors(key,3)};
      case 'say': return {t:'say',ru:w.ru,a:[w.en],key,em:w.em};
      case 'scramble': if(/\s|-/.test(w.en)||w.en.length<3) return {t:'letters',key}; return {t:'scramble',key};
      default: return {t:type,key};
    }
  },
  chunkEx(key,type){ const c=Content.chunks[key]; switch(type){ case 'cchoice': return {t:'cchoice',key,opts:Planner.chunkDistractors(key,3)}; case 'tr': return {t:'tr',ru:c.ru,a:[c.en],key}; default: return {t:'say',ru:c.ru,a:[c.en],key,em:c.em}; } },
  itemFor(key){ const s=SRS.stage(key);
    if(key.startsWith('w:')) return Planner.wordEx(key, s<=1?U.rnd(['wchoice','listen','wchoice']): s===2?U.rnd(['wtype','letters','dict']): U.rnd(['wtype','dict','say','scramble']));
    return Planner.chunkEx(key, s<=1?'cchoice': s===2?'tr':U.rnd(['tr','say'])); },
  unitDrills(unit,n,exclude){ const used=exclude||[]; let d=U.shuffle(unit.drills.filter((x,i)=>!used.includes(i)).map(x=>Object.assign({},x,{unit:unit.id}))).slice(0,n);
    const rank={choice:0,gap:1,build:2,err:2,tr:3}; d.sort((a,b)=>rank[a.t]-rank[b.t]); return d; },
  build(){
    const sessionsBefore=Object.values(P.days).filter(d=>d.done).length;
    const blocks=[];
    /* 1. Повторение */
    const due=SRS.due('w:').concat(SRS.due('c:')).slice(0,24);
    let rev=due.map(k=>Planner.itemFor(k)).filter(Boolean);
    if(rev.length<8){ const extra=U.pick(Planner.knownWords().filter(w=>!due.includes(w.key)),8-rev.length); extra.forEach(w=>rev.push(Planner.itemFor(w.key))); }
    const readDay = sessionsBefore%3===2;
    if(rev.length) blocks.push({id:'review',title:'Повторение',icon:'🔁',sec:readDay?240:300,items:U.shuffle(rev),more:'review'});
    /* 2. Грамматика: новое правило — урок, знакомое — короткое напоминание */
    const unit=Planner.currentUnit(); const us=P.units[unit.id]; const gi=[];
    if(!us||!us.seen) gi.push({t:'lesson',unit:unit.id}); else gi.push({t:'recap',unit:unit.id});
    const drills=Planner.unitDrills(unit,10);
    if(unit.gen){ const g=Gen.make(unit.gen); if(g) drills.splice(3,0,Object.assign(g,{unit:unit.id})); }
    gi.push(...drills);
    Planner.unitsForReview(2,unit.id).forEach((u,i)=>{ const d=Object.assign({},U.rnd(u.drills),{unit:u.id,review:true}); gi.splice(Math.min(gi.length,5+i*4),0,d); });
    blocks.push({id:'grammar',title:'Грамматика',icon:'🧱',sec:480,items:gi,more:'grammar',unit:unit.id});
    /* 3. Слова */
    const theme=Planner.currentTheme(); const nw=Planner.newWords(6); const nc=Planner.newChunks(2, theme?theme.id:null); const vi=[];
    nw.forEach(w=>vi.push({t:'card',key:w.key}));
    nw.forEach(w=>vi.push(Planner.wordEx(w.key,'wchoice')));
    nc.forEach(c=>vi.push({t:'card',key:c.key}));
    if(nw.length>=4) vi.push({t:'match',keys:nw.slice(0,5).map(w=>w.key)});
    nc.forEach(c=>vi.push(Planner.chunkEx(c.key,'cchoice')));
    nw.forEach(w=>vi.push(Planner.wordEx(w.key,'wtype')));
    U.pick(nw,3).forEach(w=>vi.push(Planner.wordEx(w.key,'listen')));
    if(!nw.length){ U.pick(Planner.knownWords(),10).forEach(w=>vi.push(Planner.itemFor(w.key))); }
    blocks.push({id:'vocab',title:theme?theme.title:'Слова',icon:theme?theme.icon:'🗂️',sec:420,items:vi,more:'vocab',theme:theme?theme.id:null});
    /* 4. Правописание */
    const known=U.shuffle(Planner.knownWords()); const pool=known.length>=8?known:known.concat(nw); const sp=[];
    pool.slice(0,3).forEach(w=>sp.push({t:'dict',key:w.key}));
    pool.slice(3,6).forEach(w=>sp.push({t:'letters',key:w.key}));
    pool.slice(6,8).forEach(w=>sp.push(Planner.wordEx(w.key,'scramble')));
    const ex=U.rnd(unit.ex); sp.push({t:'dict',text:ex.en,ru:ex.ru,unit:unit.id});
    blocks.push({id:'spell',title:'Правописание',icon:'✍️',sec:240,items:U.shuffle(sp),more:'spell'});
    /* 5. Чтение (каждое третье занятие) */
    if(readDay){ const tx=TEXTS.slice().sort((a,b)=>((P.read[a.id]||0)-(P.read[b.id]||0)))[0]; blocks.push({id:'read',title:'Чтение',icon:'📖',sec:200,items:[{t:'read',id:tx.id}]}); }
    /* 6. Говорение */
    const sk=[]; U.pick(unit.ex,3).forEach(e=>sk.push({t:'shadow',en:e.en,ru:e.ru,unit:unit.id}));
    const cs=Content.chunkList.filter(c=>P.cards[c.key]); const pickC=cs.length>=2?U.pick(cs,2):U.pick(Content.chunkList,2);
    pickC.forEach(c=>sk.push({t:'say',ru:c.ru,a:[c.en],key:c.key,em:c.em}));
    const dlg=DIALOGS[(P.dlgIdx||0)%DIALOGS.length]; P.dlgIdx=(P.dlgIdx||0)+1; sk.push({t:'dialog',id:dlg.id});
    blocks.push({id:'speak',title:'Говорение',icon:'🎤',sec:300,items:sk,more:'speak'});
    blocks.forEach(b=>{ b.i=0; b.spent=0; b.done=false; b.n=0; b.ok=0; });
    return {date:Day.key(),bi:0,blocks,started:Date.now(),finished:false,n:0,ok:0,xp:0,free:false};
  },
  /* дополнительные задания, когда очередь кончилась, а время осталось */
  more(block){
    switch(block.more){
      case 'review': return U.pick(Planner.knownWords(),3).map(w=>Planner.itemFor(w.key));
      case 'grammar': { const u=Content.units[block.unit]; const out=[]; if(u.gen){ for(let i=0;i<2;i++){ const g=Gen.make(u.gen); if(g) out.push(Object.assign(g,{unit:u.id})); } } const used=block.items.filter(x=>x.unit===u.id&&!x.gen).map(x=>u.drills.findIndex(d=>d.q===x.q&&d.t===x.t&&d.en===x.en&&d.ru===x.ru)); out.push(...Planner.unitDrills(u,2,used)); return out; }
      case 'vocab': { const fresh=block.items.filter(x=>x.t==='card'&&x.key.startsWith('w:')).map(x=>x.key); const keys=fresh.length?fresh:Planner.knownWords().slice(0,6).map(w=>w.key); return U.pick(keys,3).map(k=>Planner.wordEx(k,U.rnd(['wtype','listen','wchoice']))); }
      case 'spell': return U.pick(Planner.knownWords(),3).map(w=>Planner.wordEx(w.key,U.rnd(['letters','dict','scramble'])));
      case 'speak': { const u=Planner.currentUnit(); return U.pick(u.ex,2).map(e=>({t:'shadow',en:e.en,ru:e.ru,unit:u.id})); }
    }
    return [];
  },
  /* свободные блоки для раздела «Практика» */
  freeBlock(kind, arg){
    switch(kind){
      case 'unit': { const u=Content.units[arg]; const items=Planner.unitDrills(u,12); if(u.gen){ for(let i=0;i<3;i++){ const g=Gen.make(u.gen); if(g) items.splice(2+i*3,0,Object.assign(g,{unit:u.id})); } } return {id:'grammar',title:u.title,icon:u.icon,sec:600,items,more:'grammar',unit:u.id}; }
      case 'theme': { const t=Content.theme(arg); const ws=Content.byTheme[t.id]; const fresh=ws.filter(w=>!P.cards[w.key]).slice(0,6); const items=[]; fresh.forEach(w=>items.push({t:'card',key:w.key})); fresh.forEach(w=>items.push(Planner.wordEx(w.key,'wchoice'))); if(fresh.length>=4) items.push({t:'match',keys:fresh.slice(0,5).map(w=>w.key)}); fresh.forEach(w=>items.push(Planner.wordEx(w.key,'wtype')));
        const known=U.pick(ws.filter(w=>P.cards[w.key]&&!fresh.includes(w)),fresh.length?4:10); known.forEach(w=>items.push(Planner.itemFor(w.key))); return {id:'vocab',title:t.title,icon:t.icon,sec:600,items,more:'vocab',theme:t.id}; }
      case 'phrases': { const fresh=Planner.newChunks(4,null); const items=[]; fresh.forEach(c=>items.push({t:'card',key:c.key})); fresh.forEach(c=>items.push(Planner.chunkEx(c.key,'cchoice'))); fresh.forEach(c=>items.push(Planner.chunkEx(c.key,'tr'))); const known=U.pick(Content.chunkList.filter(c=>P.cards[c.key]&&!fresh.includes(c)),4); known.forEach(c=>items.push(Planner.itemFor(c.key))); return {id:'vocab',title:'Фразы',icon:'💬',sec:480,items}; }
      case 'spell': { const known=U.shuffle(Planner.knownWords()); const pool=known.length>=10?known:known.concat(U.pick(Content.wordList,10)); const items=[]; pool.slice(0,4).forEach(w=>items.push({t:'dict',key:w.key})); pool.slice(4,8).forEach(w=>items.push({t:'letters',key:w.key})); pool.slice(8,11).forEach(w=>items.push(Planner.wordEx(w.key,'scramble'))); const u=Planner.currentUnit(); U.pick(u.ex,2).forEach(e=>items.push({t:'dict',text:e.en,ru:e.ru,unit:u.id})); return {id:'spell',title:'Правописание',icon:'✍️',sec:420,items:U.shuffle(items),more:'spell'}; }
      case 'speak': { const u=Planner.currentUnit(); const items=[]; U.pick(u.ex,4).forEach(e=>items.push({t:'shadow',en:e.en,ru:e.ru,unit:u.id})); const cs=Content.chunkList.filter(c=>P.cards[c.key]); (cs.length>=3?U.pick(cs,3):U.pick(Content.chunkList,3)).forEach(c=>items.push({t:'say',ru:c.ru,a:[c.en],key:c.key,em:c.em})); return {id:'speak',title:'Говорение',icon:'🎤',sec:420,items,more:'speak'}; }
      case 'dialog': return {id:'speak',title:DIALOGS.find(d=>d.id===arg).title,icon:'🗣️',sec:600,items:[{t:'dialog',id:arg}]};
      case 'text': return {id:'read',title:TEXTS.find(t=>t.id===arg).title,icon:'📖',sec:600,items:[{t:'read',id:arg}]};
      case 'placement': { const items=[]; GRAMMAR.forEach((u,i)=>{ if(i%2===0&&i<30){ const d=U.rnd(u.drills.filter(x=>x.t==='choice')); if(d) items.push(Object.assign({},d,{unit:u.id,placement:true})); } }); return {id:'test',title:'Мини-тест',icon:'🧪',sec:900,items,noRequeue:true}; }
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
