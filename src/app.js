/* ===== Приложение: экраны, занятие, навигация ===== */

SRS.dueCountTomorrow=function(){ const t=Day.idx()+1; return Object.keys(P.cards).filter(k=>P.cards[k].s>0&&P.cards[k].due<=t).length; };

/* ---------- PWA: кнопка установки и диагностика ----------
   Chrome присылает beforeinstallprompt, когда сайт можно установить; запоминаем событие
   и показываем свою кнопку. В установленном приложении display-mode = standalone. */
window.__bip=null;
window.addEventListener('beforeinstallprompt',function(e){ e.preventDefault(); window.__bip=e; if(window.PWA) PWA.refresh(); });
window.addEventListener('appinstalled',function(){ window.__bip=null; if(window.U) U.toast('Установлено — запускай с иконки на главном экране'); if(window.PWA) PWA.refresh(); });
const PWA={
  standalone:()=>window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches||window.navigator.standalone===true,
  web:()=>location.protocol.indexOf('http')===0,
  ios:()=>/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),
  hint(){ return PWA.ios()?'Safari → кнопка «Поделиться» → «На экран „Домой“». Потом запускай с иконки.':'В Chrome: меню ⋮ → «Установить приложение» (или «Добавить на главный экран» → «Установить»). Потом запускай с иконки на главном экране, а не из Chrome.'; },
  card(){ if(!PWA.web()||PWA.standalone()) return null; const c=U.h('div',{class:'card tight',id:'installCard'});
    if(window.__bip){ const b=U.h('button',{class:'btn pri big',type:'button'},'📲 Установить как приложение'); b.onclick=()=>{ const e=window.__bip; if(!e) return; e.prompt(); if(e.userChoice) e.userChoice.then(()=>{ window.__bip=null; PWA.refresh(); }).catch(()=>{}); }; c.appendChild(b);
      c.appendChild(U.h('p',{class:'muted',style:'margin:8px 0 0'},'После установки открывай с иконки на главном экране: на весь экран и без интернета.')); }
    else { c.appendChild(U.h('div',null,U.h('b',null,'Сейчас это вкладка браузера.'))); c.appendChild(U.h('p',{class:'muted',style:'margin:6px 0 0'},PWA.hint())); }
    return c; },
  refresh(){ const old=document.getElementById('installCard'); if(!old) return; const n=PWA.card(); if(n) old.replaceWith(n); else old.remove(); },
  statusCard(){ const c=U.h('div',{class:'card'}); c.appendChild(U.h('h3',{style:'margin-top:0'},'Приложение на устройстве'));
    const row=(k,v)=>U.h('div',{class:'row between nowrap',style:'margin:6px 0;gap:12px'},U.h('div',{class:'muted'},k),U.h('div',{style:'text-align:right'},v));
    c.appendChild(row('Режим',PWA.standalone()?'установленное приложение ✅':'вкладка браузера'));
    c.appendChild(row('Откуда открыто',PWA.web()?location.host+location.pathname:'локальный файл'));
    c.appendChild(row('Chrome предлагает установку',window.__bip?'да ✅':(PWA.standalone()?'уже установлено':'нет')));
    const swRow=row('Офлайн-кеш (service worker)','проверяю…'); c.appendChild(swRow);
    if('serviceWorker' in navigator&&PWA.web()) navigator.serviceWorker.getRegistration().then(r=>{ swRow.lastChild.textContent=r&&r.active?'работает ✅':'не установлен'; }).catch(()=>{ swRow.lastChild.textContent='недоступен'; }); else swRow.lastChild.textContent=PWA.web()?'не поддерживается':'не нужен для файла';
    if(!PWA.standalone()&&PWA.web()){ const ic=PWA.card(); if(ic){ ic.className=''; ic.style.marginTop='10px'; c.appendChild(ic); } }
    return c; }
};

const App = {
  root:null, screen:'home', arg:null, _enter:null,
  init(){
    App.root=document.getElementById('app'); Content.init(); Speech.init();
    window.addEventListener('hashchange', App.route);
    document.addEventListener('keydown', e=>{ if(e.key!=='Enter'||!App._enter) return; const a=document.activeElement; if(a&&['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(a.tagName)) return; e.preventDefault(); App._enter.click(); });
    if(location.hash.indexOf('#r=')===0){ Prof.boot(); App.route(); return; }
    if(!Prof.boot()){ location.hash='#onboard'; App.route(); return; }
    Theme.apply(); Prof.recalcStreak(); Prof.save();
    if(!location.hash||location.hash==='#onboard') location.hash='#home';
    App.route();
  },
  go(name,arg){ const h='#'+name+(arg?'/'+arg:''); if(location.hash===h) App.route(); else location.hash=h; },
  route(){ if(location.hash.indexOf('#r=')===0){ App.screen='report'; App.arg=location.hash.slice(3); App.render(); return; }
    const h=(location.hash||'#home').slice(1).split('/'); const name=h[0]||'home', arg=h.slice(1).join('/')||null;
    if(!P&&name!=='onboard'){ location.hash='#onboard'; return; } App.screen=name; App.arg=arg; App.render(); },
  render(){ Speech.stop(); Session.stopTimer(); window.scrollTo(0,0); App._enter=null; const r=App.root; r.innerHTML='';
    const fn=Screens[App.screen]||Screens.home; fn(r,App.arg);
    if(!['session','onboard','report','check'].includes(App.screen)) r.appendChild(App.nav()); },
  nav(){ const tabs=[['home','🏠','Сегодня'],['practice','🎯','Практика'],['stats','📈','Прогресс'],['more','⚙️','Ещё']]; const sub=['grammar','unit','vocab','theme','dialogs','texts'];
    const n=U.h('div',{class:'nav'}); const inner=U.h('div',{class:'in'});
    tabs.forEach(t=>{ const on=App.screen===t[0]||(t[0]==='practice'&&sub.includes(App.screen)); inner.appendChild(U.h('button',{class:on?'on':'',type:'button',onclick:()=>App.go(t[0])},U.h('span',{class:'i'},t[1]),t[2])); });
    n.appendChild(inner); return n; },
  back:(to,label)=>U.h('button',{class:'btn ghost',style:'padding-left:0;margin-top:10px',type:'button',onclick:()=>App.go(to)},'‹ '+label),
  stat:(n,l)=>U.h('div',{class:'stat'},U.h('div',{class:'n'},String(n)),U.h('div',{class:'l'},l)),
  ring(pct,big,small){ const rr=56,c=2*Math.PI*rr; return U.h('div',{class:'ring',html:'<svg width="132" height="132" viewBox="0 0 132 132"><circle cx="66" cy="66" r="'+rr+'" stroke="var(--line)" stroke-width="12" fill="none"/><circle cx="66" cy="66" r="'+rr+'" stroke="'+(pct>=100?'var(--ok)':'var(--pri)')+'" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+(c*(1-Math.min(100,pct)/100))+'"/></svg><div class=c>'+U.esc(big)+'<small>'+U.esc(small)+'</small></div>'}); },
  dateStr(){ const d=new Date(); const days=['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота']; const m=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']; return days[d.getDay()]+', '+d.getDate()+' '+m[d.getMonth()]; },
  tip:()=>U.rnd(['Говори вслух всё, что читаешь: так слова запоминаются вдвое лучше.','Ошибка — это нормально: именно после ошибки мозг закрепляет правило.','Лучше 30 минут каждый день, чем 3 часа раз в неделю.','Представляй картинку к слову, а не русский перевод.','Учи фразы целиком: «How much is it?» полезнее, чем слово «much».','Повторение через день, три, неделю — так работает память.','Печатай слова сам: правописание тренируется только руками.','Не бойся кнопки «Показать ответ» — но сначала попробуй сам.'])
};

const Screens = {};

/* ---------- Первый запуск ---------- */
Screens.onboard=function(r){
  r.appendChild(U.h('div',{class:'hero'},U.h('div',{class:'big-ico'},'📘'),U.h('h1',null,'English 30'),U.h('p',{class:'muted'},'Полчаса в день: грамматика, слова, правописание и говорение. Уровень A1–A2, объяснения по-русски.')));
  const card=U.h('div',{class:'card'}); card.appendChild(U.h('h3',{style:'margin-top:0'},'Как тебя зовут?')); const inp=U.h('input',{class:'inp',placeholder:'Имя',maxlength:'24'}); card.appendChild(inp);
  card.appendChild(U.h('h3',null,'С чего начнём?')); const lv=U.h('div',{class:'opts'}); let level='zero';
  const mk=(id,t,sub)=>{ const b=U.h('button',{class:'opt'+(id===level?' pick':''),type:'button'},U.h('div',null,t),U.h('div',{class:'muted',style:'font-weight:500'},sub)); b.onclick=()=>{ level=id; U.qa('.opt',lv).forEach(x=>x.classList.remove('pick')); b.classList.add('pick'); }; return b; };
  lv.appendChild(mk('zero','С самого начала','Глагол to be, артикли, Present Simple…'));
  lv.appendChild(mk('basic','Знаю основы (A1 пройден)','Начнём с Past Simple и уровня A2'));
  lv.appendChild(mk('test','Пройти мини-тест','15 вопросов — программа подстроится под тебя'));
  card.appendChild(lv);
  const go=U.h('button',{class:'btn pri big',type:'button',style:'margin-top:16px'},'Начать'); go.onclick=()=>{ const name=inp.value.trim()||'Ученик'; Prof.create(name); Theme.apply();
    if(level==='basic'){ GRAMMAR.slice(0,22).forEach(u=>{ P.units[u.id]={h:[1,1,1,1,1,1,1,1],seen:true,last:Day.idx()}; }); P.placed=true; Prof.save(); App.go('home'); }
    else if(level==='test'){ Prof.save(); Session.runFree(Planner.freeBlock('placement'),{onEnd:Screens.placementResult}); }
    else { P.placed=true; Prof.save(); App.go('home'); } };
  card.appendChild(go); r.appendChild(card); Ex.focus(inp);
};
Screens.placementResult=function(sess){ const items=sess.blocks[0].items; const res={}; items.forEach(it=>{ if(it.unit&&res[it.unit]==null) res[it.unit]=it._ok===true; });
  const ids=GRAMMAR.map(u=>u.id); const tested=ids.map(id=>res[id]); const known=[];
  for(let i=0;i<ids.length;i++){ let before=null,after=null; for(let j=i;j>=0;j--){ if(tested[j]!=null){ before=tested[j]; break; } } for(let j=i;j<ids.length;j++){ if(tested[j]!=null){ after=tested[j]; break; } } if(before===true&&after===true) known.push(ids[i]); }
  known.forEach(id=>{ P.units[id]={h:[1,1,1,1,1,1,1,1],seen:true,last:Day.idx()}; }); P.placed=true; Prof.save();
  U.toast('Тест пройден. Освоено тем: '+known.length+' из '+GRAMMAR.length); App.go('home'); };

/* ---------- Сегодня ---------- */
Screens.home=function(r){
  const s=Session.ensurePlan();
  const total=s.blocks.reduce((a,b)=>a+b.items.length,0), done=s.finished?total:s.blocks.reduce((a,b)=>a+(b.done?b.items.length:b.i),0);
  const pct=total?Math.round(done/total*100):0; const fresh=Session.untouched(s);
  r.appendChild(U.h('div',{class:'row between',style:'margin-top:16px'},U.h('div',null,U.h('h1',{style:'margin:0'},'Привет, '+P.name+'!'),U.h('div',{class:'muted'},App.dateStr())),U.h('div',{class:'pill'},'🔥 '+P.streak+' '+U.plural(P.streak,'день','дня','дней'))));
  const card=U.h('div',{class:'card center'}); card.appendChild(s.finished?App.ring(100,'Готово','занятие выполнено'):App.ring(pct,done+' из '+total,'заданий'));
  if(s.finished) card.appendChild(U.h('p',null,'✅ Занятие на сегодня выполнено. Хочешь ещё — начни новое или загляни в «Практику».'));
  const btn=U.h('button',{class:'btn pri big',type:'button',style:'margin-top:12px'},s.finished?'Ещё одно занятие ▶':(fresh?'Начать занятие ▶':'Продолжить занятие ▶'));
  btn.onclick=()=>{ if(s.finished){ P.session=Planner.build(); Prof.save(); } Session.startDaily(); }; card.appendChild(btn); App._enter=btn;
  if(!fresh&&!s.finished){ const b=s.blocks[s.bi]; card.appendChild(U.h('div',{class:'muted',style:'margin-top:8px'},'Блок '+(s.bi+1)+' из '+s.blocks.length+': '+b.icon+' '+b.title+' · задание '+Math.min(b.i+1,b.items.length)+' из '+b.items.length)); }
  r.appendChild(card);
  const inst=PWA.card(); if(inst) r.appendChild(inst);
  if(s.finished||Report.due()) r.appendChild(Report.card());
  if(!s.finished){ const plan=U.h('div',{class:'card plan'}); const mins=Math.max(1,Math.round(Planner.estSum([].concat(...s.blocks.map(b=>b.items)))/60));
    plan.appendChild(U.h('h3',{style:'margin-top:0'},'План на сегодня · '+total+' '+U.plural(total,'задание','задания','заданий')+' · около '+mins+' мин'));
    if(s.lvl) plan.appendChild(U.h('div',{class:'muted',style:'margin:-4px 0 6px'},'Сложность: '+LEVELS[s.lvl]+((P.settings.level||'auto')==='auto'?' (подбирается сама по точности)':'')));
    s.blocks.forEach(b=>{ const st=U.h('div',{class:'step'+(b.done?' done':'')}); st.appendChild(U.h('div',{class:'ic'},b.icon));
      st.appendChild(U.h('div',{class:'grow'},U.h('div',{class:'t'},b.title),U.h('div',{class:'muted'},Session.blockSub(b))));
      st.appendChild(U.h('div',{class:'m'},b.items.length+' · ≈'+Math.max(1,Math.round(Planner.estSum(b.items)/60))+' мин')); plan.appendChild(st); });
    plan.appendChild(U.h('p',{class:'muted',style:'margin-bottom:0'},'Таймера нет: сделал все задания — занятие закончено.'+(Auto.on()?' После занятия папа получает короткий отчёт.':'')));
    r.appendChild(plan); }
  const known=Planner.knownWords().length; const sure=Content.wordList.filter(w=>P.cards[w.key]&&P.cards[w.key].s>=3).length; const unitsDone=GRAMMAR.filter(u=>Planner.unitDone(u.id)).length;
  r.appendChild(U.h('div',{class:'grid3'},App.stat(known,'слов в работе'),App.stat(sure,'слов уверенно'),App.stat(unitsDone,'тем грамматики')));
  r.appendChild(U.h('p',{class:'muted center',style:'margin-top:16px'},'💡 '+App.tip()));
};

/* ---------- Занятие: конечный список заданий, без таймера ---------- */
const Session = {
  s:null, host:null, timer:null, opts:null, body:null, fbEl:null, cntEl:null, progEl:null, t0:0,
  todayPlan(){ const s=P.session; return s&&s.date===Day.key()&&!s.free?s:null; },
  untouched(s){ return !s.finished&&s.bi===0&&s.blocks.every(b=>!b.i&&!b.done); },
  /* план на сегодня; старый план прежней версии (с таймерами), к которому ещё не приступали, заменяем новым */
  ensurePlan(){ let s=Session.todayPlan(); if(!s||(!s.v&&Session.untouched(s))){ s=P.session=Planner.build(); Prof.save(); } return s; },
  replanIfFresh(){ const s=Session.todayPlan(); if(!s||Session.untouched(s)){ P.session=Planner.build(); Prof.save(); return true; } return false; },
  blockSub(b){ const n=b.items.length;
    switch(b.id){
      case 'review': return 'слова и фразы, которые пора вспомнить';
      case 'grammar': { const u=Content.units[b.unit]; if(!u) return n+' заданий'; const us=P.units[u.id]; return u.title+(us&&us.seen?' · освоение '+Planner.unitProg(u.id)+'%':' · новое правило'); }
      case 'vocab': return b.newW!=null?(b.newW?b.newW+' '+U.plural(b.newW,'новое слово','новых слова','новых слов'):'закрепление')+(b.newC?' и '+b.newC+' '+U.plural(b.newC,'фраза','фразы','фраз'):''):'слова';
      case 'spell': return 'диктант, пропущенные буквы, предложения на слух';
      case 'read': return 'короткий текст и вопросы';
      case 'speak': return 'фразы вслух'+(b.dialog?', диалог «'+b.dialog+'»':'');
      case 'check': return 'раз в неделю: задания без подсказок, результат увидит папа';
    } return n+' заданий'; },
  startDaily(){ Session.s=Session.ensurePlan(); Session.opts=null; Prof.save(); App.go('session'); },
  runFree(block,opts){ if(!block||!block.items||!block.items.filter(Boolean).length){ U.toast('Нечего тренировать'); return; } block.items=block.items.filter(Boolean); Object.assign(block,{i:0,spent:0,done:false,n:0,ok:0,rq:0}); Session.s={date:Day.key(),bi:0,blocks:[block],created:Date.now(),finished:false,n:0,ok:0,xp:0,free:true}; Session.opts=opts||null; App.go('session'); },
  reviewBlock(){ const lvl=Planner.level(); const due=SRS.due('w:').concat(SRS.due('c:')).slice(0,30); let items=due.map(k=>Planner.itemFor(k,lvl)); if(items.length<6) items=items.concat(U.pick(Planner.knownWords().filter(w=>!due.includes(w.key)),10-items.length).map(w=>Planner.itemFor(w.key,lvl))); if(!items.length) items=U.pick(Content.wordList,8).map(w=>Planner.wordEx(w.key,'wchoice',lvl)); return {id:'review',title:'Повторение',icon:'🔁',items:U.shuffle(items.filter(Boolean))}; },
  cur(){ return Session.s.blocks[Session.s.bi]; },
  render(r){ if(!Session.s){ const tp=Session.todayPlan(); if(tp&&!tp.finished) Session.s=tp; else { App.go('home'); return; } }
    const s=Session.s; Session.host=r; if(s.finished){ Session.summary(); return; } const b=Session.cur();
    const top=U.h('div',{class:'topbar'}); const exitBtn=U.h('button',{class:'btn icon',type:'button',title:'Выйти (прогресс сохранится)'},'✕'); exitBtn.onclick=()=>Session.exit();
    const prog=U.h('div',{class:'prog'},U.h('i',{style:'width:0%'})); const cnt=U.h('div',{class:'timer',title:'задание в блоке'},''); Session.cntEl=cnt; Session.progEl=prog;
    top.appendChild(U.h('div',{class:'row nowrap'},U.h('span',{style:'font-size:22px'},b.icon),U.h('b',{class:'grow',style:'white-space:nowrap;overflow:hidden;text-overflow:ellipsis'},b.title),cnt,exitBtn));
    top.appendChild(prog); const bl=U.h('div',{class:'blocks'}); s.blocks.forEach((x,i)=>bl.appendChild(U.h('i',{class:i<s.bi?'done':i===s.bi?'cur':''}))); top.appendChild(bl); r.appendChild(top);
    Session.body=U.h('div'); r.appendChild(Session.body); Session.fbEl=U.h('div'); r.appendChild(Session.fbEl);
    Session.startTimer(); Session.showItem(); },
  showItem(){ const b=Session.cur(); Session.fbEl.innerHTML=''; App._enter=null;
    if(b.i>=b.items.length){ Session.finishBlock(); return; }
    const it=b.items[b.i]; Session.progEl.firstChild.style.width=Math.round(b.i/Math.max(1,b.items.length)*100)+'%'; Session.cntEl.textContent=(b.i+1)+' / '+b.items.length;
    Session.t0=Date.now(); Ex.render(it,Session.body,{done:res=>Session.onDone(it,res)}); },
  onDone(it,res){ const s=Session.s, b=Session.cur(); const t=Prof.today(); it._ok=res.ok; it._g=res.grade; let xp=0; const graded=res.grade!=null;
    if(it.test){ const code=res.ok===true?1:res.ok==='almost'?2:0; s.cs=s.cs||{it:[]}; s.cs.it.push([Report.promptOf(it),String(res.expected||''),String(res.got||''),code]); if(!s.free) P.session=s; Prof.save();
      const fb=Session.fbEl; fb.innerHTML=''; const box=U.h('div',{class:'fb '+(code===1?'ok':code===2?'warn':'bad')+' fade'}); box.appendChild(U.h('b',null,code===1?'Верно':code===2?'Почти (опечатка)':'Неверно')); if(code!==1&&res.expected) box.appendChild(U.h('div',{class:'ans'},res.expected));
      fb.appendChild(box); const nx=U.h('button',{class:'btn pri big',type:'button'},'Дальше →'); nx.onclick=()=>Session.next(); fb.appendChild(U.h('div',{class:'actions'},nx)); App._enter=nx; if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); return; }
    if(graded){ const ok=res.ok===true; b.n++; s.n++; t.n++; if(ok){ b.ok++; s.ok++; t.ok++; } xp=ok?10:res.ok==='almost'?6:2;
      if(it.key) SRS.grade(it.key,res.grade);
      if(it.unit&&!it.placement&&Planner.GRAM_TYPES.includes(it.t)){ const u=P.units[it.unit]||(P.units[it.unit]={h:[],seen:true}); u.h=(u.h||[]).concat(ok||res.ok==='almost'?1:0).slice(-30); u.last=Day.idx(); u.n=(u.n||0)+1; if(ok) u.ok=(u.ok||0)+1;
        if(it.di&&!it._re){ u.sh=u.sh||{}; u.sh[it.di]=(u.sh[it.di]||0)+1; } } }
    else xp=res.perKey?8:3;
    if(it.t==='card'&&it.key&&it.key.indexOf('w:')===0&&!it._re) t.nw=(t.nw||0)+1;
    if(graded&&it._hint) t.hint=(t.hint||0)+1; if(res.self) t.self=(t.self||0)+1;
    if(res.perKey) for(const k in res.perKey) SRS.grade(k,res.perKey[k]);
    const requeue=graded&&res.grade===0&&!it._re&&!b.noRequeue&&it.t!=='read'&&it.t!=='dialog'&&(b.rq||0)<3;
    if(requeue){ b.rq=(b.rq||0)+1; const copy=Object.assign({},it,{_re:true,_hint:false,_ok:null,_g:null}); b.items.splice(Math.min(b.items.length,b.i+4),0,copy); }
    s.xp+=xp; t.xp+=xp; P.xp+=xp; if(!s.free) P.session=s; Prof.save();
    if(!graded&&!res.perKey){ Session.next(); return; }
    const fb=Session.fbEl; fb.innerHTML=''; const cls=res.ok===true?'ok':res.ok==='almost'?'warn':'bad'; const box=U.h('div',{class:'fb '+cls+' fade'});
    box.appendChild(U.h('b',null,res.ok===true?'Верно! ':res.ok==='almost'?'Почти! ':'Не совсем. ')); box.appendChild(U.h('span',{style:'opacity:.8'},'+'+xp+' XP'));
    if(res.expected&&res.ok!==true) box.appendChild(U.h('div',{class:'ans'},Ex.spk(res.say||res.expected),' ',res.expected));
    if(res.html) box.appendChild(U.h('div',{html:res.html,style:'margin-top:4px'}));
    if(res.why) box.appendChild(U.h('div',{class:'why',html:res.why}));
    if(requeue) box.appendChild(U.h('div',{class:'why'},'↩ Это задание вернётся через несколько шагов.'));
    fb.appendChild(box); const next=U.h('button',{class:'btn pri big',type:'button'},'Дальше →'); next.onclick=()=>Session.next(); fb.appendChild(U.h('div',{class:'actions'},next)); App._enter=next;
    if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); },
  next(){ const b=Session.cur(); const it=b.items[b.i]; if(it&&Session.t0&&!document.hidden) Planner.recordPace(it,(Date.now()-Session.t0)/1000); Session.t0=0; b.i++; if(!Session.s.free) P.session=Session.s; Session.showItem(); },
  finishBlock(){ const s=Session.s, b=Session.cur(); b.done=true; s.xp+=20; Prof.today().xp+=20; P.xp+=20; Session.stopTimer(); const acc=b.n?Math.round(b.ok/b.n*100):null;
    const r=Session.host; r.innerHTML=''; const card=U.h('div',{class:'card center fade'}); card.appendChild(U.h('div',{class:'confetti'},b.icon)); card.appendChild(U.h('h2',null,'Блок «'+b.title+'» готов'));
    if(b.id==='check'&&s.cs&&s.cs.it){ const it=s.cs.it; const sc=it.reduce((a,x)=>a+(x[3]===1?1:x[3]===2?0.5:0),0);
      card.appendChild(U.h('div',{class:'grid3'},App.stat(it.length,'заданий'),App.stat(Report.num(sc),'верно'),App.stat(Math.round(sc/it.length*100)+'%','результат')));
      card.appendChild(U.h('p',{class:'muted'},'Результат проверки и ответы попадут в недельный отчёт папе.')); }
    else card.appendChild(U.h('div',{class:'grid3'},App.stat(b.n,'заданий'),App.stat(b.ok,'верно сразу'),App.stat(acc==null?'—':acc+'%','точность')));
    let btn;
    if(s.bi<s.blocks.length-1){ const nb=s.blocks[s.bi+1]; card.appendChild(U.h('p',{class:'muted'},'Дальше: '+nb.icon+' '+nb.title+' · '+nb.items.length+' '+U.plural(nb.items.length,'задание','задания','заданий'))); btn=U.h('button',{class:'btn pri big',type:'button'},'Продолжить →'); btn.onclick=()=>{ s.bi++; if(!s.free) P.session=s; Prof.save(); App.render(); }; }
    else { s.finished=true; if(!s.free){ P.session=s; Prof.markDone(); if(s.blocks.some(x=>x.items.some(it=>it&&it.t==='dialog'))) P.dlgIdx=(P.dlgIdx||0)+1; Prof.save(); Auto.afterSession(s); } btn=U.h('button',{class:'btn pri big',type:'button'},'Итоги →'); btn.onclick=()=>Session.summary(); }
    card.appendChild(U.h('div',{class:'actions'},btn)); App._enter=btn; r.appendChild(card); if(!s.free) P.session=s; Prof.save(); },
  summary(){ const s=Session.s; Session.stopTimer(); const r=Session.host||App.root; r.innerHTML=''; const spent=s.blocks.reduce((a,b)=>a+(b.spent||0),0); const acc=s.n?Math.round(s.ok/s.n*100):null;
    const card=U.h('div',{class:'card center fade'}); card.appendChild(U.h('div',{class:'confetti'},s.free?'🎯':'🏆')); card.appendChild(U.h('h2',null,s.free?'Тренировка завершена':'Занятие выполнено!'));
    card.appendChild(U.h('div',{class:'grid3'},App.stat(s.n,'заданий'),App.stat(acc==null?'—':acc+'%','точность'),App.stat(Math.max(1,Math.round(spent/60))+' мин','заняло')));
    card.appendChild(U.h('p',null,'+'+s.xp+' XP'+(s.free?'':' · серия 🔥 '+P.streak+' '+U.plural(P.streak,'день','дня','дней'))));
    if(!s.free) card.appendChild(U.h('button',{class:'btn soft',type:'button',style:'margin:4px 0 8px',onclick:()=>{ Session.s=null; Session.opts=null; App.go('check'); }},'📨 Отправить отчёт папе'));
    if(!s.free){ const unit=Planner.currentUnit(); const dt=SRS.dueCountTomorrow(); card.appendChild(U.h('p',{class:'muted'},'Завтра: '+unit.icon+' '+unit.title+' · '+dt+' '+U.plural(dt,'карточка','карточки','карточек')+' к повторению.')); }
    const btn=U.h('button',{class:'btn pri big',type:'button'},'Готово'); btn.onclick=()=>{ const o=Session.opts; const free=s.free; Session.s=null; Session.opts=null; if(o&&o.onEnd) o.onEnd(s); else App.go(free?'practice':'home'); }; card.appendChild(U.h('div',{class:'actions'},btn)); App._enter=btn; r.appendChild(card); },
  exit(){ Session.stopTimer(); Prof.save(); const s=Session.s; Session.s=null; Session.opts=null; App.go(s&&s.free?'practice':'home'); },
  /* время считается только для статистики («Прогресс» и итог занятия): на экране его нет, и оно ничего не ограничивает */
  startTimer(){ Session.stopTimer(); Session.timer=setInterval(()=>{ if(document.hidden) return; const s=Session.s; if(!s||s.finished) return; const b=s.blocks[s.bi]; if(!b||b.done) return; b.spent=(b.spent||0)+1; const t=Prof.today(); t.sec++; if(t.sec%15===0) Prof.save(); },1000); },
  stopTimer(){ if(Session.timer){ clearInterval(Session.timer); Session.timer=null; } }
};
Screens.session=r=>Session.render(r);

/* ---------- Практика ---------- */
Screens.practice=function(r){ r.appendChild(U.h('h1',null,'🎯 Практика')); r.appendChild(U.h('p',{class:'muted'},'Свободные тренировки сверх ежедневного плана. Всё идёт в прогресс.'));
  const list=U.h('div',{class:'card list tight'});
  const items=[['🧱','Грамматика',GRAMMAR.length+' тем: правило, схема, упражнения',()=>App.go('grammar')],['🗂️','Слова по темам',VOCAB.length+' тем, '+Content.wordList.length+' слов с картинками и озвучкой',()=>App.go('vocab')],['💬','Фразы',Content.chunkList.length+' готовых фраз на каждый день',()=>Session.runFree(Planner.freeBlock('phrases'))],['🗣️','Диалоги',DIALOGS.length+' разговорных ситуаций',()=>App.go('dialogs')],['📖','Тексты',TEXTS.length+' коротких текстов с вопросами',()=>App.go('texts')],['✍️','Правописание','диктант, пропущенные буквы, анаграммы',()=>Session.runFree(Planner.freeBlock('spell'))],['🎤','Говорение','повтор за диктором и перевод вслух',()=>Session.runFree(Planner.freeBlock('speak'))],['🔁','Карточки',SRS.dueCount()+' '+U.plural(SRS.dueCount(),'карточка ждёт','карточки ждут','карточек ждут')+' повторения',()=>Session.runFree(Session.reviewBlock())]];
  items.forEach(x=>list.appendChild(U.h('div',{class:'item',onclick:x[3]},U.h('div',{class:'ic'},x[0]),U.h('div',{class:'grow'},U.h('div',{class:'t'},x[1]),U.h('div',{class:'sub'},x[2])),U.h('div',{class:'right'},'›'))));
  r.appendChild(list); };

Screens.grammar=function(r){ r.appendChild(App.back('practice','Практика')); r.appendChild(U.h('h1',null,'🧱 Грамматика')); const list=U.h('div',{class:'card list tight'}); let last='';
  GRAMMAR.forEach(u=>{ if(u.lvl!==last){ last=u.lvl; list.appendChild(U.h('h3',{style:'margin:10px 4px 4px'},u.lvl==='A1'?'A1 — основа':'A2 — продолжение')); } const p=Planner.unitProg(u.id); const seen=P.units[u.id]&&P.units[u.id].seen;
    list.appendChild(U.h('div',{class:'item',onclick:()=>App.go('unit',u.id)},U.h('div',{class:'ic'},u.icon),U.h('div',{class:'grow'},U.h('div',{class:'t'},u.n+'. '+u.title),U.h('div',{class:'sub'},u.en)),U.h('div',{class:'right'},U.h('div',{class:'bar'+(p<50?' lo':'')},U.h('i',{style:'width:'+p+'%'})),U.h('div',{class:'muted',style:'text-align:right'},seen?p+'%':'новое')))); });
  r.appendChild(list); };
Screens.unit=function(r,id){ const u=Content.units[id]; if(!u){ App.go('grammar'); return; } r.appendChild(App.back('grammar','Грамматика')); const card=U.h('div',{class:'card'}); card.appendChild(Ex.lessonEl(u)); r.appendChild(card);
  const p=Planner.unitProg(u.id); const btn=U.h('button',{class:'btn pri big',style:'margin-top:12px',type:'button',onclick:()=>{ if(!P.units[u.id]) P.units[u.id]={h:[],seen:true}; P.units[u.id].seen=true; Prof.save(); Session.runFree(Planner.freeBlock('unit',u.id)); }},'Тренировать ▶');
  r.appendChild(U.h('div',{class:'card tight'},U.h('div',{class:'row between'},U.h('div',null,'Освоение: ',U.h('b',null,p+'%')),U.h('div',{class:'bar',style:'width:140px'},U.h('i',{style:'width:'+p+'%'}))),btn)); App._enter=btn; };

Screens.vocab=function(r){ r.appendChild(App.back('practice','Практика')); r.appendChild(U.h('h1',null,'🗂️ Слова по темам')); const list=U.h('div',{class:'card list tight'});
  VOCAB.forEach(t=>{ const ws=Content.byTheme[t.id]; const started=ws.filter(w=>P.cards[w.key]).length; const known=ws.filter(w=>P.cards[w.key]&&P.cards[w.key].s>=2).length; const p=Math.round(known/ws.length*100);
    list.appendChild(U.h('div',{class:'item',onclick:()=>App.go('theme',t.id)},U.h('div',{class:'ic'},t.icon),U.h('div',{class:'grow'},U.h('div',{class:'t'},t.title),U.h('div',{class:'sub'},ws.length+' слов · '+t.lvl+(started?' · в работе: '+started:''))),U.h('div',{class:'right'},U.h('div',{class:'bar'+(p<50?' lo':'')},U.h('i',{style:'width:'+p+'%'})),U.h('div',{class:'muted',style:'text-align:right'},p+'%')))); });
  r.appendChild(list); };
Screens.theme=function(r,id){ const t=Content.theme(id); if(!t){ App.go('vocab'); return; } r.appendChild(App.back('vocab','Темы')); r.appendChild(U.h('h1',null,t.icon+' '+t.title));
  const btn=U.h('button',{class:'btn pri big',type:'button',onclick:()=>Session.runFree(Planner.freeBlock('theme',t.id))},'Учить и тренировать ▶'); r.appendChild(btn); App._enter=btn;
  const list=U.h('div',{class:'card list tight'}); const stN=['новое','узнаю','вспоминаю','использую','освоено'];
  Content.byTheme[t.id].forEach(w=>{ const c=P.cards[w.key]; list.appendChild(U.h('div',{class:'item',style:'cursor:default'},U.h('div',{class:'ic'},w.em),U.h('div',{class:'grow'},U.h('div',{class:'t'},w.en),U.h('div',{class:'sub'},w.ru)),U.h('div',{class:'right'},c?stN[c.s]:'—'),Ex.spk(w.en))); });
  r.appendChild(list); };
Screens.dialogs=function(r){ r.appendChild(App.back('practice','Практика')); r.appendChild(U.h('h1',null,'🗣️ Диалоги')); r.appendChild(U.h('p',{class:'muted'},'Собеседника озвучивает диктор, твои реплики — в микрофон. Без микрофона можно читать вслух.')); const list=U.h('div',{class:'card list tight'});
  DIALOGS.forEach(d=>list.appendChild(U.h('div',{class:'item',onclick:()=>Session.runFree(Planner.freeBlock('dialog',d.id))},U.h('div',{class:'ic'},d.icon),U.h('div',{class:'grow'},U.h('div',{class:'t'},d.title),U.h('div',{class:'sub'},d.lines.length+' реплик · '+d.lvl)),U.h('div',{class:'right'},'›')))); r.appendChild(list); };
Screens.texts=function(r){ r.appendChild(App.back('practice','Практика')); r.appendChild(U.h('h1',null,'📖 Тексты')); const list=U.h('div',{class:'card list tight'});
  TEXTS.forEach(t=>list.appendChild(U.h('div',{class:'item',onclick:()=>Session.runFree(Planner.freeBlock('text',t.id))},U.h('div',{class:'ic'},t.icon),U.h('div',{class:'grow'},U.h('div',{class:'t'},t.title),U.h('div',{class:'sub'},t.lvl+(P.read[t.id]?' · прочитан '+P.read[t.id]+' раз':''))),U.h('div',{class:'right'},'›')))); r.appendChild(list); };

/* ---------- Прогресс ---------- */
Screens.stats=function(r){ r.appendChild(U.h('h1',null,'📈 Прогресс')); const days=Object.values(P.days); const total=days.filter(d=>d.done).length; const n=days.reduce((a,d)=>a+d.n,0), ok=days.reduce((a,d)=>a+d.ok,0); const acc=n?Math.round(ok/n*100):0;
  const words=Content.wordList; const chunks=Content.chunkList.filter(c=>P.cards[c.key]&&P.cards[c.key].s>=2).length;
  r.appendChild(U.h('div',{class:'grid3'},App.stat('🔥 '+P.streak,'серия дней'),App.stat(P.best,'лучшая серия'),App.stat(total,'занятий'),App.stat(P.xp,'XP всего'),App.stat(acc+'%','точность'),App.stat(SRS.dueCount(),'к повторению')));
  const wk=U.h('div',{class:'card'}); wk.appendChild(U.h('h3',{style:'margin-top:0'},'Последние 7 дней, минуты')); const w=U.h('div',{class:'week'}); const names=['вс','пн','вт','ср','чт','пт','сб']; let max=1; const arr=[];
  for(let i=6;i>=0;i--){ const d=Day.shift(-i); const k=Day.key(d); const m=P.days[k]?Math.round(P.days[k].sec/60):0; arr.push({d,m,k}); if(m>max) max=m; }
  arr.forEach(x=>{ const el=U.h('div',{class:'d'+(x.k===Day.key()?' today':'')}); el.appendChild(U.h('span',null,x.m?String(x.m):'')); el.appendChild(U.h('i',{style:'height:'+Math.max(3,Math.round(x.m/max*40))+'px'})); el.appendChild(U.h('span',null,names[x.d.getDay()])); w.appendChild(el); }); wk.appendChild(w); r.appendChild(wk);
  const wc=U.h('div',{class:'card'}); wc.appendChild(U.h('h3',{style:'margin-top:0'},'Слова по этапам'));
  [['узнаю',1],['вспоминаю',2],['использую',3],['освоено',4]].forEach(s=>{ const k=words.filter(x=>P.cards[x.key]&&P.cards[x.key].s===s[1]).length; wc.appendChild(U.h('div',{class:'row nowrap',style:'margin:6px 0'},U.h('div',{style:'width:110px'},s[0]),U.h('div',{class:'bar grow'},U.h('i',{style:'width:'+Math.round(k/words.length*100)+'%'})),U.h('div',{style:'width:40px;text-align:right'},String(k)))); });
  wc.appendChild(U.h('p',{class:'muted'},'Всего слов: '+words.length+'. Фраз освоено: '+chunks+' из '+Content.chunkList.length+'.')); r.appendChild(wc);
  const gc=U.h('div',{class:'card'}); gc.appendChild(U.h('h3',{style:'margin-top:0'},'Грамматика')); let any=false;
  GRAMMAR.forEach(u=>{ if(!P.units[u.id]) return; any=true; const p=Planner.unitProg(u.id); gc.appendChild(U.h('div',{class:'row nowrap',style:'margin:6px 0'},U.h('div',{style:'width:28px'},u.icon),U.h('div',{class:'grow',style:'font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis'},u.title),U.h('div',{class:'bar'+(p<50?' lo':''),style:'width:80px;flex:none'},U.h('i',{style:'width:'+p+'%'})),U.h('div',{style:'width:40px;text-align:right;font-size:14px'},p+'%'))); });
  if(!any) gc.appendChild(U.h('p',{class:'muted'},'Пока нет данных — начни первое занятие.')); r.appendChild(gc); };

/* ---------- Ещё ---------- */
App.ABOUT=`<p><b>Почему так устроено занятие.</b> Занятие — готовый список заданий, рассчитанный примерно на выбранное время по твоему реальному темпу. Таймера нет: сделал все задания — занятие закончено. Внимание на одном типе задачи держится 5–8 минут, поэтому задания разбиты на блоки разных навыков: повторение → грамматика → слова → письмо → речь. Такое чередование даёт более прочную память, чем час одного и того же.</p>
<ul>
<li><b>Интервальное повторение.</b> Каждое слово и фраза — карточка. Верный ответ отодвигает следующий показ (1 → 3 → 7 → 14 дней…), ошибка возвращает карточку на сегодня. Алгоритм семейства SM-2, как в Anki.</li>
<li><b>Активное вспоминание.</b> Правило показывается один раз, дальше — только задания. Память крепнет в момент извлечения, а не при перечитывании.</li>
<li><b>Без повторов внутри занятия.</b> Каждое слово попадает только в один блок, каждый пример из правила используется один раз. Возвращается только задание, в котором была ошибка, и не больше трёх на блок.</li>
<li><b>Лестница сложности.</b> Слово проходит этапы: узнать (выбор) → вспомнить (напечатать) → использовать (собрать предложение, сказать). Тип задания выбирается по этапу карточки и по уровню сложности.</li>
<li><b>Уровень подстраивается.</b> При точности выше 88 % включается сложный уровень: больше письма и перевода, больше новых слов, задания «какое время?», где правило нужно выбрать самому. Если стало трудно, уровень снижается.</li>
<li><b>Ошибка как учитель.</b> После неверного ответа — правильный вариант и объяснение. Опечатка засчитывается как «почти».</li>
<li><b>Двойное кодирование.</b> Слово = картинка + звук + пример в контексте. Перевод — последним.</li>
<li><b>Фразы-кирпичи.</b> «How much is it?» учится целиком, как говорят носители: так быстрее заговорить.</li>
<li><b>Говорение с первого дня.</b> Повтор за диктором, перевод вслух, диалоги с распознаванием речи.</li>
<li><b>Грамматика образами.</b> Цветные блоки «кто — действие — остальное», шкала времени, одна таблица на одно правило.</li>
<li><b>Темп по успехам.</b> Тема грамматики закрывается при точности от 75 %; при точности от 90 % хватает одного занятия. Слабые темы возвращаются вкраплениями.</li>
</ul>`;
Screens.more=function(r){ r.appendChild(U.h('h1',null,'⚙️ Ещё'));
  const pc=U.h('div',{class:'card'}); pc.appendChild(U.h('h3',{style:'margin-top:0'},'Профиль')); const nameInp=U.h('input',{class:'inp',value:P.name,style:'font-size:18px',maxlength:'24'}); nameInp.onchange=()=>{ Prof.rename(nameInp.value.trim()||P.name); U.toast('Имя сохранено'); }; pc.appendChild(nameInp);
  const pl=U.h('div',{class:'row',style:'margin-top:10px'}); Prof.list().forEach(p=>pl.appendChild(U.h('button',{class:'btn sm '+(p.id===P.id?'pri':'soft'),type:'button',onclick:()=>{ Prof.load(p.id); Theme.apply(); App.render(); }},p.name)));
  const newBox=U.h('div',{class:'row nowrap',style:'margin-top:8px',hidden:true}); const newInp=U.h('input',{class:'inp',placeholder:'Имя нового профиля',maxlength:'24',style:'font-size:17px'}); const newOk=U.h('button',{class:'btn pri sm',type:'button',onclick:()=>{ const n=newInp.value.trim(); if(n){ Prof.create(n); Theme.apply(); App.go('home'); } }},'Создать'); newBox.appendChild(newInp); newBox.appendChild(newOk);
  pl.appendChild(U.h('button',{class:'btn sm',type:'button',onclick:()=>{ newBox.hidden=!newBox.hidden; if(!newBox.hidden) Ex.focus(newInp); }},'+ Новый')); pc.appendChild(pl); pc.appendChild(newBox);
  let armed=false; const delBtn=U.h('button',{class:'btn sm ghost',style:'color:var(--bad)',type:'button'},'Удалить этот профиль'); delBtn.onclick=()=>{ if(!armed){ armed=true; delBtn.textContent='Точно удалить «'+P.name+'» со всем прогрессом? Нажми ещё раз'; setTimeout(()=>{ armed=false; delBtn.textContent='Удалить этот профиль'; },6000); return; } Prof.remove(P.id); if(P){ Theme.apply(); App.render(); } else App.go('onboard'); };
  pc.appendChild(U.h('div',{style:'margin-top:8px'},delBtn)); r.appendChild(pc);
  const sc=U.h('div',{class:'card'}); sc.appendChild(U.h('h3',{style:'margin-top:0'},'Настройки')); const row=(label,ctrl)=>U.h('div',{class:'row between nowrap',style:'margin:10px 0'},U.h('div',null,label),ctrl);
  const goal=U.h('select',{class:'sel'}); [15,20,30,45,60].forEach(m=>goal.appendChild(U.h('option',{value:m,selected:P.settings.goal===m},'≈ '+m+' мин'))); goal.onchange=()=>{ P.settings.goal=+goal.value; Prof.save(); U.toast(Session.replanIfFresh()?'План на сегодня пересчитан':'Новая длина — со следующего занятия'); }; sc.appendChild(row('Длина занятия',goal));
  const lv=U.h('select',{class:'sel'}); [['auto','Авто (сейчас: '+LEVELS[Planner.autoLevel()]+')'],['easy','Лёгкая'],['normal','Обычная'],['hard','Сложная']].forEach(x=>lv.appendChild(U.h('option',{value:x[0],selected:(P.settings.level||'auto')===x[0]},x[1]))); lv.onchange=()=>{ P.settings.level=lv.value; Prof.save(); U.toast(Session.replanIfFresh()?'План на сегодня пересчитан':'Новая сложность — со следующего занятия'); }; sc.appendChild(row('Сложность',lv));
  sc.appendChild(U.h('p',{class:'muted',style:'margin-top:0'},'Сложная: меньше заданий с выбором ответа, больше письма и перевода, 8 новых слов в день, задания «какое время?», задания с ошибкой возвращаются. «Авто» включает её сама, когда точность выше 88 %.'));
  const voice=U.h('select',{class:'sel',style:'max-width:220px'}); voice.appendChild(U.h('option',{value:''},'авто')); Speech.voices.forEach(v=>voice.appendChild(U.h('option',{value:v.name,selected:P.settings.voice===v.name},v.name.replace(/Microsoft |Google /,'')+' · '+v.lang))); voice.onchange=()=>{ P.settings.voice=voice.value; Prof.save(); Speech.say('Hello! How are you today?'); }; sc.appendChild(row('Голос диктора',voice));
  const rate=U.h('input',{type:'range',min:'0.6',max:'1.1',step:'0.05',value:String(P.settings.rate)}); rate.onchange=()=>{ P.settings.rate=+rate.value; Prof.save(); Speech.say('Nice to meet you.'); }; sc.appendChild(row('Скорость речи',rate));
  const th=U.h('select',{class:'sel'}); [['auto','как в системе'],['light','светлая'],['dark','тёмная']].forEach(x=>th.appendChild(U.h('option',{value:x[0],selected:P.settings.theme===x[0]},x[1]))); th.onchange=()=>{ P.settings.theme=th.value; Prof.save(); Theme.apply(); }; sc.appendChild(row('Тема',th));
  const as=U.h('input',{type:'checkbox',checked:P.settings.autoSpeak,style:'width:22px;height:22px'}); as.onchange=()=>{ P.settings.autoSpeak=as.checked; Prof.save(); }; sc.appendChild(row('Озвучивать автоматически',as));
  sc.appendChild(U.h('p',{class:'muted'},(Speech.canListen()?'✅ Распознавание речи доступно.':'⚠️ Распознавание речи в этом браузере недоступно — говорение будет с самооценкой. Лучше всего работают Chrome и Edge.')+(Speech.voices.length?' Голосов для английского: '+Speech.voices.length+'.':' Голоса ещё загружаются.'))); r.appendChild(sc);
  const dc=U.h('div',{class:'card'}); dc.appendChild(U.h('h3',{style:'margin-top:0'},'Перенос прогресса')); dc.appendChild(U.h('p',{class:'muted'},'Файлом или коротким кодом — на другой телефон или компьютер.'));
  const dl=U.h('button',{class:'btn soft',type:'button'},'⬇ Скачать файл'); dl.onclick=()=>{ const blob=new Blob([Prof.exportJSON()],{type:'application/json'}); const a=U.h('a',{href:URL.createObjectURL(blob),download:'english30-'+Day.key()+'.json'}); document.body.appendChild(a); a.click(); a.remove(); };
  const up=U.h('input',{type:'file',accept:'.json,application/json',hidden:true}); up.onchange=()=>{ const f=up.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ try{ Prof.importJSON(rd.result); Theme.apply(); U.toast('Профиль загружен'); App.go('home'); }catch(e){ U.toast('Не удалось прочитать файл'); } }; rd.readAsText(f); };
  const ul=U.h('button',{class:'btn soft',type:'button',onclick:()=>up.click()},'⬆ Загрузить файл');
  const codeBox=U.h('textarea',{class:'inp',rows:'4',style:'font-size:13px;margin-top:10px;font-family:ui-monospace,Consolas,monospace',placeholder:'Сюда можно вставить код переноса',hidden:true});
  const cp=U.h('button',{class:'btn soft',type:'button'},'📋 Скопировать код'); cp.onclick=()=>{ const code=btoa(unescape(encodeURIComponent(Prof.exportJSON()))); codeBox.hidden=false; codeBox.value=code; const show=()=>{ codeBox.focus(); codeBox.select(); U.toast('Код показан ниже — выдели и скопируй'); }; if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(()=>U.toast('Код скопирован ('+code.length+' символов)')).catch(show); else show(); };
  const ps=U.h('button',{class:'btn soft',type:'button'},'📥 Вставить код'); let pasteMode=false; ps.onclick=()=>{ if(!pasteMode){ pasteMode=true; codeBox.hidden=false; codeBox.value=''; ps.textContent='✅ Загрузить код'; Ex.focus(codeBox); return; } const code=codeBox.value.trim(); if(!code){ U.toast('Вставь код в поле ниже'); return; } try{ Prof.importJSON(decodeURIComponent(escape(atob(code)))); Theme.apply(); U.toast('Профиль загружен'); App.go('home'); }catch(e){ U.toast('Код не распознан'); } };
  dc.appendChild(U.h('div',{class:'grid2'},dl,ul,cp,ps)); dc.appendChild(codeBox); dc.appendChild(up); r.appendChild(dc);
  const rc=U.h('div',{class:'card'}); rc.appendChild(U.h('h3',{style:'margin-top:0'},'📨 Отчёт папе'));
  rc.appendChild(U.h('p',{class:'muted',style:'margin-top:0'},'Короткая проверка без подсказок, потом ссылка с оценкой и результатами — её можно отправить в Telegram, WhatsApp или СМС. '+(Report.lastText()?'Последний отчёт: '+Report.lastText()+'.':'Отчёт ещё не отправляли.')));
  rc.appendChild(U.h('div',{class:'row'},U.h('button',{class:'btn pri',type:'button',onclick:()=>App.go('check')},'Пройти проверку и отправить'),U.h('button',{class:'btn soft',type:'button',onclick:()=>App.go('parent')},Auto.on()?'Автоотправка: включена ✅':'Автоотправка в Telegram')));
  r.appendChild(rc);
  r.appendChild(PWA.statusCard());
  const ab=U.h('div',{class:'card'}); ab.appendChild(U.h('h3',{style:'margin-top:0'},'Как устроено обучение')); ab.appendChild(U.h('div',{class:'rule',html:App.ABOUT})); r.appendChild(ab);
  r.appendChild(U.h('p',{class:'muted center'},'English 30 · сборка '+window.APP_VERSION+' · прогресс хранится в этом браузере')); };

