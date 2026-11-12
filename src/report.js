/* ===== Отчёт для папы =====
   1) Проверка без подсказок: 10 заданий по уже выученному (слова, диктант, грамматика). На прогресс не влияет.
   2) Оценка: регулярность (дни с занятиями за неделю), точность с первой попытки, результат проверки.
   3) Данные упаковываются в саму ссылку (#r=…): JSON → deflate → base64url. На сервер ничего не уходит.
   4) По ссылке открывается страница отчёта; профиль на устройстве папы не создаётся и не трогается. */

const SITE_URL='https://drunkmay79.github.io/en30/';
const MARKS={5:'отлично',4:'хорошо',3:'удовлетворительно',2:'надо подтянуть'};

const Report = {
  /* --- упаковка --- */
  b64u(bytes){ let s=''; for(let i=0;i<bytes.length;i+=0x8000) s+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000)); return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); },
  unb64u(str){ str=str.replace(/-/g,'+').replace(/_/g,'/'); while(str.length%4) str+='='; const bin=atob(str); const out=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) out[i]=bin.charCodeAt(i); return out; },
  async encode(obj){ const bytes=new TextEncoder().encode(JSON.stringify(obj));
    if(window.CompressionStream){ try{ const st=new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw')); return 'z'+Report.b64u(new Uint8Array(await new Response(st).arrayBuffer())); }catch(e){} }
    return 'j'+Report.b64u(bytes); },
  async decode(code){ const kind=code[0]; const bytes=Report.unb64u(code.slice(1)); let json;
    if(kind==='z'){ if(!window.DecompressionStream) throw new Error('old-browser'); const st=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')); json=await new Response(st).text(); }
    else if(kind==='j') json=new TextDecoder().decode(bytes); else throw new Error('kind');
    const o=JSON.parse(json); if(!o||o.v!==1||!Array.isArray(o.days)||o.days.length!==14||!Array.isArray(o.st)) throw new Error('format'); return o; },

  /* --- данные отчёта ---
     days: 14 дней, старые → сегодня; день = 0 или [минуты, заданий, верно сразу, занятие выполнено, новых слов, подсказок, самооценок]
     st: [серия, лучшая серия, занятий всего, XP, слов в работе, слов уверенно, слов всего, фраз освоено]
     g: темы грамматики с ответами: [номер темы, освоение %, пройдена, сколько дней назад пройдена или -1] */
  build(cs){
    const today=Day.idx(); const days=[];
    for(let i=13;i>=0;i--){ const x=P.days[Day.key(Day.shift(-i))]; days.push(x&&(x.sec||x.n)?[Math.round((x.sec||0)/60),x.n||0,x.ok||0,x.done?1:0,x.nw||0,x.hint||0,x.self||0]:0); }
    const W=Content.wordList; const c=k=>P.cards[k];
    const g=[]; GRAMMAR.forEach((u,i)=>{ const x=P.units[u.id]; if(!x||!x.h||!x.h.length) return; const done=Planner.unitDone(u.id); g.push([i,Planner.unitProg(u.id),done?1:0,done&&x.doneAt!=null?today-x.doneAt:-1]); });
    const weak=W.concat(Content.chunkList).map(o=>({o,k:c(o.key)})).filter(x=>x.k&&x.k.l>0).sort((a,b)=>(b.k.l/(b.k.st||1))-(a.k.l/(a.k.st||1))||b.k.l-a.k.l).slice(0,6).map(x=>[x.o.en,x.o.ru,x.k.l,x.k.st||0]);
    return {v:1,t:Date.now(),d:Day.key(),n:P.name,lvl:Planner.level(),goal:P.settings.goal||30,days,
      st:[P.streak,P.best,Object.values(P.days).filter(d=>d.done).length,P.xp,W.filter(w=>c(w.key)&&c(w.key).s>=1).length,W.filter(w=>c(w.key)&&c(w.key).s>=3).length,W.length,Content.chunkList.filter(x=>c(x.key)&&c(x.key).s>=2).length],
      cu:GRAMMAR.indexOf(Planner.currentUnit()),g,weak,cs:cs||null};
  },

  /* --- оценка по пятибалльной шкале --- */
  grade(rep){
    const last=rep.days.slice(-7); const act=last.filter(x=>x&&(x[0]>=5||x[1]>=10)).length; const full=last.filter(x=>x&&x[3]).length;
    const n=last.reduce((a,x)=>a+(x?x[1]:0),0), ok=last.reduce((a,x)=>a+(x?x[2]:0),0); const acc=n?ok/n:null;
    const reg=act>=6?5:act>=5?4:act>=3?3:2;
    const th=rep.lvl==='hard'?[0.85,0.75,0.6]:[0.9,0.8,0.65];
    const qual=acc==null?null:acc>=th[0]?5:acc>=th[1]?4:acc>=th[2]?3:2;
    const cp=rep.cs&&rep.cs.tot?rep.cs.sc/rep.cs.tot:null; const test=cp==null?null:cp>=0.9?5:cp>=0.75?4:cp>=0.55?3:2;
    const parts=[reg,qual,test].filter(x=>x!=null); const avg=parts.reduce((a,b)=>a+b,0)/parts.length;
    return {act,full,n,acc,reg,qual,test,cp,avg,mark:Math.max(2,Math.min(5,Math.round(avg)))};
  },
  mins(m){ return m>=60?Math.floor(m/60)+' ч '+U.pad(m%60)+' мин':m+' мин'; },
  dateOf(key,shift){ const p=key.split('-').map(Number); const d=new Date(p[0],p[1]-1,p[2],12); if(shift) d.setDate(d.getDate()+shift); return d; },
  fmt(d){ const m=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']; return d.getDate()+' '+m[d.getMonth()]; },
  summaryText(rep){ const g=Report.grade(rep); const mins=rep.days.slice(-7).reduce((a,x)=>a+(x?x[0]:0),0);
    const from=Report.fmt(Report.dateOf(rep.d,-6)), to=Report.fmt(Report.dateOf(rep.d,0));
    return '📘 English 30 · '+rep.n+' · '+from+' — '+to+'\nОценка недели: '+g.mark+' ('+MARKS[g.mark]+')\nДней с занятиями: '+g.act+' из 7 · '+Report.mins(mins)+
      (g.acc!=null?'\nТочность с первой попытки: '+Math.round(g.acc*100)+' %':'')+(rep.cs?'\nПроверка без подсказок: '+Report.num(rep.cs.sc)+' из '+rep.cs.tot:'')+'\nПодробный отчёт по ссылке:'; },
  num(x){ return String(Math.round(x*10)/10).replace('.',','); },

  /* --- проверка без подсказок: только то, что уже выучено --- */
  csItems(){
    const known=U.shuffle(Content.wordList.filter(w=>P.cards[w.key]&&P.cards[w.key].s>=1)); const items=[];
    known.slice(0,4).forEach(w=>items.push({t:'wtype',key:w.key,test:1}));
    known.slice(4,6).forEach(w=>items.push({t:'dict',key:w.key,test:1}));
    const pool=[]; GRAMMAR.forEach(u=>{ const x=P.units[u.id]; if(!x||!(x.seen||x.done)||!x.h||!x.h.length) return;
      u.drills.forEach(d=>{ if(d.t==='gap'||d.t==='tr'||(d.t==='choice'&&d.o.length>=3&&d.q.indexOf('___')>=0)) pool.push(Object.assign({},d,{cu:u.id,hint:undefined,test:1})); }); });
    U.shuffle(pool).slice(0,Math.max(4,10-items.length)).forEach(d=>items.push(d));
    return U.shuffle(items).slice(0,10);
  },
  promptOf(it){ if(it.t==='wtype'){ const o=Content.get(it.key); return (o.em?o.em+' ':'')+o.ru; } if(it.t==='dict') return '🔊 диктант на слух'; if(it.t==='tr') return it.ru; return it.q; },

  /* --- отправка: меню «Поделиться» (Telegram, WhatsApp…); если его нет — ссылку можно скопировать --- */
  async share(cs,host){
    const rep=Report.build(cs); const url=SITE_URL+'#r='+(await Report.encode(rep)); const text=Report.summaryText(rep);
    P.lastReport=Date.now(); Prof.save();
    if(navigator.share){ try{ await navigator.share({title:'English 30 — отчёт',text:text,url:url}); U.toast('Готово: отчёт передан в выбранное приложение'); return 'shared'; }catch(e){ if(e&&e.name==='AbortError') return 'cancel'; } }
    Report.showLink(host||App.root,text,url); return 'link';
  },
  showLink(host,text,url){
    const box=U.h('div',{class:'card fade'}); box.appendChild(U.h('h3',{style:'margin-top:0'},'Скопируй и отправь папе'));
    const ta=U.h('textarea',{class:'inp',rows:'6',readonly:true,style:'font-size:14px'}); ta.value=text+'\n'+url; box.appendChild(ta);
    const b=U.h('button',{class:'btn pri big',type:'button',style:'margin-top:10px'},'📋 Скопировать');
    b.onclick=()=>{ const sel=()=>{ ta.focus(); ta.select(); U.toast('Выдели текст и скопируй'); }; if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(()=>U.toast('Скопировано — вставь в мессенджер')).catch(sel); else sel(); };
    box.appendChild(b); host.appendChild(box); box.scrollIntoView({block:'nearest'});
  },
  lastText(){ return P.lastReport?Report.fmt(new Date(P.lastReport)):null; },
  due(){ if(typeof Auto!=='undefined'&&Auto.on()) return false; const sessions=Object.values(P.days).filter(d=>d.done).length; if(sessions<3) return false; return !P.lastReport||(Date.now()-P.lastReport)>=7*86400000; },
  card(){ const due=Report.due(); const last=Report.lastText();
    const c=U.h('div',{class:'card tight'}); c.appendChild(U.h('div',{class:'row between nowrap'},U.h('div',null,U.h('b',null,'📨 Отчёт папе'),U.h('div',{class:'muted'},due?(last?'Прошла неделя с прошлого отчёта ('+last+')':'Пора отправить первый отчёт'):(last?'Последний отчёт: '+last:'Короткая проверка и ссылка с результатами'))),
      U.h('button',{class:'btn '+(due?'pri':'soft')+' sm',type:'button',onclick:()=>App.go('check')},'Отправить'))); return c; }
};

/* ---------- Проверка перед отчётом ---------- */
Screens.check=function(r){
  const items=Report.csItems();
  r.appendChild(App.back('home','Назад'));
  if(items.length<4){ const c=U.h('div',{class:'card'}); c.appendChild(U.h('h2',{style:'margin-top:0'},'📨 Отчёт папе')); c.appendChild(U.h('p',null,'Пока выучено мало, проверку делать рано. Отправим отчёт о занятиях без неё.'));
    const b=U.h('button',{class:'btn pri big',type:'button'},'📨 Отправить отчёт'); b.onclick=()=>Report.share(null,r); c.appendChild(b); r.appendChild(c); return; }
  const att=(P.csAtt&&P.csAtt.d===Day.key())?P.csAtt.n+1:1;
  const intro=U.h('div',{class:'card'}); intro.appendChild(U.h('h2',{style:'margin-top:0'},'🎯 Проверка перед отчётом'));
  intro.appendChild(U.h('p',null,items.length+' заданий по уже выученному: слова, диктант и грамматика. Подсказок нет, второй попытки тоже. На прогресс проверка не влияет.'));
  intro.appendChild(U.h('p',{class:'muted'},'Результат и твои ответы увидит папа. Это попытка '+att+' за сегодня — номер попытки тоже попадёт в отчёт.'));
  const go=U.h('button',{class:'btn pri big',type:'button'},'Начать проверку'); intro.appendChild(go); r.appendChild(intro); App._enter=go;
  go.onclick=()=>{ P.csAtt={d:Day.key(),n:att}; Prof.save(); run(0); };
  const res=[];
  function run(i){ r.innerHTML=''; App._enter=null; window.scrollTo(0,0);
    if(i>=items.length){ finish(); return; }
    const top=U.h('div',{class:'topbar'}); const prog=U.h('div',{class:'prog'},U.h('i',{style:'width:'+Math.round(i/items.length*100)+'%'}));
    top.appendChild(U.h('div',{class:'row nowrap'},U.h('span',{style:'font-size:22px'},'🎯'),U.h('b',{class:'grow'},'Проверка'),U.h('div',{class:'timer'},(i+1)+' / '+items.length))); top.appendChild(prog); r.appendChild(top);
    const body=U.h('div'); r.appendChild(body); const fb=U.h('div'); r.appendChild(fb); const it=items[i];
    Ex.render(it,body,{done:x=>{ const code=x.ok===true?1:x.ok==='almost'?2:0; res.push([Report.promptOf(it),String(x.expected||''),String(x.got||''),code]);
      const box=U.h('div',{class:'fb '+(code===1?'ok':code===2?'warn':'bad')+' fade'}); box.appendChild(U.h('b',null,code===1?'Верно':code===2?'Почти (опечатка)':'Неверно'));
      if(code!==1) box.appendChild(U.h('div',{class:'ans'},x.expected||'')); fb.appendChild(box);
      const nx=U.h('button',{class:'btn pri big',type:'button'},i+1<items.length?'Дальше →':'Результат →'); nx.onclick=()=>run(i+1); fb.appendChild(U.h('div',{class:'actions'},nx)); App._enter=nx;
      if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); }}); }
  function finish(){ const sc=res.reduce((a,x)=>a+(x[3]===1?1:x[3]===2?0.5:0),0); const cs={sc,tot:res.length,att,it:res};
    const cp=sc/res.length; const m=cp>=0.9?5:cp>=0.75?4:cp>=0.55?3:2;
    const c=U.h('div',{class:'card center fade'}); c.appendChild(U.h('div',{class:'confetti'},m>=4?'🎉':'💪')); c.appendChild(U.h('h2',null,'Проверка: '+Report.num(sc)+' из '+res.length));
    c.appendChild(U.h('p',{class:'muted'},'Оценка за проверку: '+m+' — '+MARKS[m]+'.'));
    const wrong=res.filter(x=>x[3]!==1); if(wrong.length){ const l=U.h('div',{class:'exlist',style:'text-align:left'}); wrong.forEach(x=>l.appendChild(U.h('div',{class:'it'},U.h('div',null,U.h('div',{class:'ru'},x[0]),U.h('div',null,U.h('span',{class:'diff'},U.h('span',{class:'x'},x[2]||'—')),'  →  ',U.h('b',null,x[1])))))); c.appendChild(l); }
    const send=U.h('button',{class:'btn pri big',type:'button',style:'margin-top:12px'},'📨 Отправить отчёт папе'); send.onclick=async()=>{ send.disabled=true; await Report.share(cs,r); send.disabled=false; };
    c.appendChild(send); c.appendChild(U.h('button',{class:'btn ghost',type:'button',onclick:()=>App.go('home')},'Позже')); r.innerHTML=''; r.appendChild(c); App._enter=send; }
};

/* ---------- Страница отчёта (открывается у папы по ссылке) ---------- */
Screens.report=function(r,code){
  const wrap=U.h('div',{class:'report'}); r.appendChild(wrap); wrap.appendChild(U.h('p',{class:'muted',style:'margin-top:24px'},'Открываю отчёт…'));
  Report.decode(code||'').then(rep=>Report.render(wrap,rep)).catch(e=>{ wrap.innerHTML='';
    const c=U.h('div',{class:'card',style:'margin-top:24px'}); c.appendChild(U.h('h2',{style:'margin-top:0'},'Не получилось открыть отчёт'));
    c.appendChild(U.h('p',null,e&&e.message==='old-browser'?'Этот браузер слишком старый для отчёта. Откройте ссылку в Chrome или обновите браузер.':'Ссылка повреждена или обрезана. Попросите отправить отчёт ещё раз и откройте ссылку целиком.')); wrap.appendChild(c); });
};
Report.render=function(wrap,rep){
  wrap.innerHTML=''; const g=Report.grade(rep); const base=Report.dateOf(rep.d,0); const days=rep.days;
  const created=new Date(rep.t); const wk=['вс','пн','вт','ср','чт','пт','сб'];
  wrap.appendChild(U.h('h1',null,'Отчёт: '+rep.n));
  wrap.appendChild(U.h('p',{class:'muted',style:'margin-top:-2px'},'English 30 · за 7 дней по '+Report.fmt(base)+' · создан '+Report.fmt(created)+' в '+U.pad(created.getHours())+':'+U.pad(created.getMinutes())+' · сложность: '+(LEVELS[rep.lvl]||rep.lvl)));
  /* оценка */
  const gc=U.h('div',{class:'card'}); const head=U.h('div',{class:'row nowrap',style:'gap:16px'});
  head.appendChild(U.h('div',{class:'mark m'+g.mark},String(g.mark))); head.appendChild(U.h('div',null,U.h('div',{style:'font-size:22px;font-weight:800'},'Оценка недели: '+MARKS[g.mark]),U.h('div',{class:'muted'},'Среднее из трёх частей: '+Report.num(g.avg))));
  gc.appendChild(head);
  const part=(title,val,mark,note)=>U.h('div',{class:'part'},U.h('div',{class:'grow'},U.h('div',{class:'t'},title),U.h('div',{class:'muted'},note)),U.h('div',{class:'pv'},val),mark!=null?U.h('div',{class:'mark sm m'+mark},String(mark)):U.h('div',{class:'mark sm'},'—'));
  gc.appendChild(part('Регулярность',g.act+' из 7',g.reg,'дней с занятиями; полностью выполнено занятий: '+g.full));
  gc.appendChild(part('Точность',g.acc==null?'—':Math.round(g.acc*100)+' %',g.qual,'ответов верно с первой попытки, '+g.n+' '+U.plural(g.n,'задание','задания','заданий')+' за неделю'));
  gc.appendChild(part('Проверка без подсказок',rep.cs?Report.num(rep.cs.sc)+' из '+rep.cs.tot:'—',g.test,rep.cs?('случайные задания по выученному'+(rep.cs.att>1?'; попытка '+rep.cs.att+' за день':'; с первой попытки')):'проверку не проходили'));
  wrap.appendChild(gc);
  /* занятия по дням */
  const ac=U.h('div',{class:'card'}); const wkMin=days.slice(-7).reduce((a,x)=>a+(x?x[0]:0),0), prevMin=days.slice(0,7).reduce((a,x)=>a+(x?x[0]:0),0);
  ac.appendChild(U.h('h3',{style:'margin-top:0'},'Занятия за две недели'));
  ac.appendChild(U.h('p',{class:'muted',style:'margin-top:-4px'},'Эта неделя: '+Report.mins(wkMin)+' · прошлая: '+Report.mins(prevMin)+'. Цель — около '+rep.goal+' мин в день.'));
  const max=Math.max(rep.goal,...days.map(x=>x?x[0]:0)); const bars=U.h('div',{class:'rbars'});
  days.forEach((x,i)=>{ const d=Report.dateOf(rep.d,i-13); const m=x?x[0]:0; const col=U.h('div',{class:'rb'+(i>=7?' cur':'')});
    col.appendChild(U.h('span',{class:'v'},m?String(m):'')); col.appendChild(U.h('i',{style:'height:'+Math.max(m?4:2,Math.round(m/max*70))+'px',class:x&&x[3]?'done':''}));
    col.appendChild(U.h('span',{class:'l'},wk[d.getDay()])); col.appendChild(U.h('span',{class:'l2'},String(d.getDate()))); bars.appendChild(col); });
  ac.appendChild(bars); ac.appendChild(U.h('div',{class:'legend',style:'margin-top:6px'},U.h('span',{class:'blk o'},'занятие выполнено'),U.h('span',{class:'blk s'},'начато, не закончено')));
  wrap.appendChild(ac);
  /* что выучено */
  const st=rep.st; const nw=days.slice(-7).reduce((a,x)=>a+(x?x[4]:0),0); const doneG=rep.g.filter(x=>x[2]).length; const weekG=rep.g.filter(x=>x[2]&&x[3]>=0&&x[3]<7);
  wrap.appendChild(U.h('div',{class:'grid3'},App.stat(st[4],'слов в работе из '+st[6]),App.stat(st[5],'слов знает уверенно'),App.stat('+'+nw,'новых слов за неделю'),App.stat(doneG+' / '+GRAMMAR.length,'тем грамматики'),App.stat('🔥 '+st[0],'дней подряд'),App.stat(st[2],'занятий всего')));
  const gr=U.h('div',{class:'card'}); gr.appendChild(U.h('h3',{style:'margin-top:0'},'Грамматика'));
  const cu=GRAMMAR[rep.cu]; if(cu) gr.appendChild(U.h('p',null,'Сейчас изучает: ',U.h('b',null,cu.icon+' '+cu.title)));
  if(weekG.length){ gr.appendChild(U.h('div',{class:'muted'},'Пройдено за неделю:')); const l=U.h('ul',{class:'rlist'}); weekG.forEach(x=>{ const u=GRAMMAR[x[0]]; if(u) l.appendChild(U.h('li',null,'✅ '+u.title+' — '+x[1]+' %')); }); gr.appendChild(l); }
  const weakG=rep.g.filter(x=>!x[2]&&x[1]<60&&x[0]!==rep.cu).sort((a,b)=>a[1]-b[1]).slice(0,5);
  if(weakG.length){ gr.appendChild(U.h('div',{class:'muted'},'Темы, которые стоит подтянуть:')); const l=U.h('ul',{class:'rlist'}); weakG.forEach(x=>{ const u=GRAMMAR[x[0]]; if(u) l.appendChild(U.h('li',null,'⚠️ '+u.title+' — '+x[1]+' %')); }); gr.appendChild(l); }
  if(!weekG.length&&!weakG.length&&!cu) gr.appendChild(U.h('p',{class:'muted'},'Пока нет данных.'));
  wrap.appendChild(gr);
  /* проверка: вопросы и ответы */
  if(rep.cs&&rep.cs.it&&rep.cs.it.length){ const cc=U.h('div',{class:'card'}); cc.appendChild(U.h('h3',{style:'margin-top:0'},'Ответы в проверке'));
    const tb=U.h('div',{class:'rtest'}); rep.cs.it.forEach(x=>{ const ok=x[3]===1, al=x[3]===2;
      tb.appendChild(U.h('div',{class:'row nowrap rq'},U.h('div',{class:'ic'},ok?'✅':al?'🟡':'❌'),U.h('div',{class:'grow'},U.h('div',{class:'muted'},x[0]),U.h('div',null,U.h('span',{class:ok?'':'bad-t'},x[2]||'— нет ответа'),ok?'':U.h('span',{class:'muted'},'  →  '),ok?'':U.h('b',null,x[1]))))); });
    cc.appendChild(tb); wrap.appendChild(cc); }
  /* трудные слова */
  if(rep.weak&&rep.weak.length){ const wc=U.h('div',{class:'card'}); wc.appendChild(U.h('h3',{style:'margin-top:0'},'Слова с ошибками'));
    const l=U.h('ul',{class:'rlist'}); rep.weak.forEach(x=>l.appendChild(U.h('li',null,U.h('b',null,x[0]),' — '+x[1]+' · ошибок '+x[2]+' из '+x[3]))); wc.appendChild(l);
    wc.appendChild(U.h('p',{class:'muted',style:'margin-bottom:0'},'Эти слова приложение показывает чаще, пока они не закрепятся.')); wrap.appendChild(wc); }
  /* подсказки и самооценка */
  const hints=days.slice(-7).reduce((a,x)=>a+(x?x[5]:0),0), self=days.slice(-7).reduce((a,x)=>a+(x?x[6]:0),0);
  if(hints||self){ wrap.appendChild(U.h('p',{class:'muted'},'За неделю: подсказок — '+hints+(self?', говорение с самооценкой (без проверки микрофоном) — '+self:'')+'.')); }
  wrap.appendChild(U.h('p',{class:'muted center',style:'margin-top:20px'},'Данные отчёта находятся только в этой ссылке и никуда не отправляются.'));
  wrap.appendChild(U.h('div',{class:'center'},U.h('a',{class:'btn ghost',href:SITE_URL},'Открыть English 30')));
};

/* ===== Автоотправка папе через его Telegram-бота =====
   Ключ бота вводит папа на планшете; он хранится только в памяти этого устройства (не в профиле, не в коде, не в ссылках).
   Запросы к Telegram — «простые» (form-urlencoded), иначе браузер требует предварительную проверку, которую Telegram не поддерживает.
   Сообщения складываются в очередь и уходят, когда есть интернет. */
const Auto = {
  cfg(){ return Store.get('auto',null); }, save(c){ Store.set('auto',c); },
  on(){ const c=Auto.cfg(); return !!(c&&c.token&&c.chat); },
  async api(token,method,params){ const r=await fetch('https://api.telegram.org/bot'+token+'/'+method,{method:'POST',body:new URLSearchParams(params||{})});
    let j=null; try{ j=await r.json(); }catch(e){} if(!j||!j.ok) throw new Error((j&&j.description)||('HTTP '+r.status)); return j.result; },
  push(text){ const q=Store.get('outbox',[]); q.push({text,at:Date.now()}); Store.set('outbox',q.slice(-40)); Auto.flush(); },
  pending(){ return Store.get('outbox',[]).length; },
  async flush(){ if(!Auto.on()||Auto._busy||navigator.onLine===false) return; Auto._busy=true;
    try{ let q=Store.get('outbox',[]); while(q.length){ const c=Auto.cfg(); await Auto.api(c.token,'sendMessage',{chat_id:c.chat,text:q[0].text,disable_web_page_preview:'true'});
        q=Store.get('outbox',[]); q.shift(); Store.set('outbox',q); const c2=Auto.cfg(); c2.lastSent=Date.now(); c2.lastErr=''; Auto.save(c2); } }
    catch(e){ const c=Auto.cfg(); if(c){ c.lastErr=String(e&&e.message||e); Auto.save(c); } }
    Auto._busy=false; },
  /* недельный отчёт: впервые — как только накопилось 3 занятия, дальше раз в 7 дней */
  weeklyDue(){ if(!Auto.on()) return false; const c=Auto.cfg(); if(!c.weekly||!P) return false;
    if(Object.values(P.days).filter(d=>d.done).length<3) return false; return c.lastWeekly==null||Day.idx()-c.lastWeekly>=7; },
  dailyText(s){ const t=Prof.today(); const spent=Math.max(1,Math.round(s.blocks.reduce((a,b)=>a+(b.spent||0),0)/60)); const acc=s.n?Math.round(s.ok/s.n*100):null;
    const g=s.blocks.find(b=>b.id==='grammar'); const u=g&&Content.units[g.unit]; const v=s.blocks.find(b=>b.id==='vocab');
    const L=['✅ '+P.name+': занятие English 30 выполнено','🕐 '+spent+' мин · '+s.n+' '+U.plural(s.n,'задание','задания','заданий')+(acc!=null?' · точность '+acc+' %':'')];
    if(u) L.push('🧱 '+u.title+' — освоение '+Planner.unitProg(u.id)+' %'+(Planner.unitDone(u.id)?', тема пройдена ✅':''));
    if(v&&v.newW) L.push('🗂️ Новых слов: '+v.newW);
    L.push('🔥 Дней подряд: '+P.streak); if(t.hint) L.push('💡 Подсказок сегодня: '+t.hint); if(t.self) L.push('🎤 Говорение без микрофона (самооценка): '+t.self);
    return L.join('\n'); },
  afterSession(s){ if(!Auto.on()||s.free) return; const c=Auto.cfg();
    if(c.daily) Auto.push(Auto.dailyText(s));
    const chk=s.blocks.find(b=>b.id==='check');
    if(chk&&s.cs&&s.cs.it&&s.cs.it.length){ const it=s.cs.it; const sc=it.reduce((a,x)=>a+(x[3]===1?1:x[3]===2?0.5:0),0); const cs={sc,tot:it.length,att:1,it};
      const rep=Report.build(cs); Report.encode(rep).then(code=>Auto.push(Report.summaryText(rep)+'\n'+SITE_URL+'#r='+code));
      const c2=Auto.cfg(); c2.lastWeekly=Day.idx(); Auto.save(c2); P.lastReport=Date.now(); Prof.save(); } }
};
window.addEventListener('online',()=>Auto.flush());

/* ---------- Настройка автоотправки (для папы) ---------- */
Screens.parent=function(r){
  r.appendChild(App.back('more','Ещё')); r.appendChild(U.h('h1',null,'📨 Автоотправка папе'));
  const c=Auto.cfg();
  if(c&&c.pin&&!Auto._unlocked){ const pc=U.h('div',{class:'card'}); pc.appendChild(U.h('p',{style:'margin-top:0'},'Настройки защищены ПИН-кодом.'));
    const pin=U.h('input',{class:'inp',type:'password',inputmode:'numeric',maxlength:'8',placeholder:'ПИН-код',autocomplete:'off'}); pc.appendChild(pin);
    const ok=U.h('button',{class:'btn pri big',type:'button',style:'margin-top:10px'},'Открыть'); ok.onclick=()=>{ if(pin.value===c.pin){ Auto._unlocked=true; App.render(); } else { pin.value=''; U.toast('Неверный ПИН-код'); } };
    pin.onkeydown=e=>{ if(e.key==='Enter') ok.click(); }; pc.appendChild(ok); r.appendChild(pc); Ex.focus(pin); return; }
  if(Auto.on()){ const sc=U.h('div',{class:'card'}); sc.appendChild(U.h('h3',{style:'margin-top:0'},'✅ Включено'));
    sc.appendChild(U.h('p',null,'Бот @'+c.bot+' пишет в чат «'+c.chatName+'».'));
    const what=[]; if(c.daily) what.push('короткое сообщение после каждого занятия'); if(c.weekly) what.push('раз в неделю — отчёт с оценкой и проверкой');
    sc.appendChild(U.h('p',{class:'muted'},'Что приходит: '+(what.join('; ')||'ничего (оба пункта выключены)')+'.'));
    sc.appendChild(U.h('p',{class:'muted'},'Последняя отправка: '+(c.lastSent?Report.fmt(new Date(c.lastSent))+' в '+U.pad(new Date(c.lastSent).getHours())+':'+U.pad(new Date(c.lastSent).getMinutes()):'ещё не было')+'. В очереди: '+Auto.pending()+'.'+(c.lastErr?' Последняя ошибка: '+c.lastErr+'.':'')));
    const row=U.h('div',{class:'grid2'});
    row.appendChild(U.h('button',{class:'btn soft',type:'button',onclick:()=>{ Auto.push('🔔 Проверка связи: English 30 на планшете ('+P.name+') может писать в этот чат.'); U.toast('Сообщение поставлено в очередь'); setTimeout(()=>App.render(),1500); }},'Тестовое сообщение'));
    row.appendChild(U.h('button',{class:'btn soft',type:'button',onclick:async()=>{ const rep=Report.build(null); const code=await Report.encode(rep); Auto.push(Report.summaryText(rep)+'\n'+SITE_URL+'#r='+code); U.toast('Отчёт поставлен в очередь'); setTimeout(()=>App.render(),1500); }},'Отчёт сейчас'));
    sc.appendChild(row);
    const daily=U.h('input',{type:'checkbox',checked:!!c.daily,style:'width:22px;height:22px'}); daily.onchange=()=>{ const x=Auto.cfg(); x.daily=daily.checked; Auto.save(x); };
    const weekly=U.h('input',{type:'checkbox',checked:!!c.weekly,style:'width:22px;height:22px'}); weekly.onchange=()=>{ const x=Auto.cfg(); x.weekly=weekly.checked; Auto.save(x); Session.replanIfFresh(); };
    sc.appendChild(U.h('label',{class:'row nowrap',style:'margin-top:12px'},daily,U.h('span',null,'Сообщение после каждого занятия')));
    sc.appendChild(U.h('label',{class:'row nowrap',style:'margin-top:8px'},weekly,U.h('span',null,'Недельный отчёт с проверкой')));
    const off=U.h('button',{class:'btn ghost',type:'button',style:'color:var(--bad);margin-top:10px'},'Выключить автоотправку'); let armed=false;
    off.onclick=()=>{ if(!armed){ armed=true; off.textContent='Точно выключить? Нажмите ещё раз'; setTimeout(()=>{ armed=false; off.textContent='Выключить автоотправку'; },6000); return; } Store.del('auto'); Store.del('outbox'); Auto._unlocked=false; Session.replanIfFresh(); U.toast('Автоотправка выключена'); App.render(); };
    sc.appendChild(off); r.appendChild(sc); return; }
  /* мастер настройки */
  const st={token:'',bot:'',chat:'',chatName:''};
  const card=U.h('div',{class:'card'}); r.appendChild(card);
  card.appendChild(U.h('p',{style:'margin-top:0'},'Приложение само пришлёт вам в Telegram сообщение после каждого занятия и раз в неделю — отчёт с оценкой. Дочери ничего нажимать не нужно. Для этого нужен ваш собственный бот — это бесплатно и занимает пару минут.'));
  card.appendChild(U.h('h3',null,'1. Создайте бота'));
  card.appendChild(U.h('p',null,'В Telegram откройте ',U.h('a',{href:'https://t.me/BotFather',target:'_blank',rel:'noopener'},'@BotFather'),', отправьте /newbot, придумайте имя и адрес бота (адрес должен заканчиваться на bot). В ответ придёт токен — длинная строка вида 123456789:AA…'));
  card.appendChild(U.h('h3',null,'2. Вставьте токен сюда'));
  const tok=U.h('input',{class:'inp',type:'text',placeholder:'123456789:AA…',autocomplete:'off',autocapitalize:'off',spellcheck:'false',style:'font-size:16px'}); card.appendChild(tok);
  const tokSt=U.h('div',{class:'muted',style:'margin-top:6px;min-height:22px'}); card.appendChild(tokSt);
  const tokBtn=U.h('button',{class:'btn soft',type:'button',style:'margin-top:6px'},'Проверить токен'); card.appendChild(tokBtn);
  const step3=U.h('div',{hidden:true}); card.appendChild(step3);
  tokBtn.onclick=async()=>{ const t=tok.value.trim().replace(/\s+/g,''); if(!/^\d{5,}:[A-Za-z0-9_-]{20,}$/.test(t)){ tokSt.textContent='Это не похоже на токен: нужна строка «цифры:буквы» целиком.'; return; }
    tokSt.textContent='Проверяю…'; try{ const me=await Auto.api(t,'getMe'); st.token=t; st.bot=me.username; tokSt.textContent='✅ Бот найден: @'+me.username; tok.disabled=true; step3.hidden=false;
      const link=step3.querySelector('a.botlink'); link.href='https://t.me/'+me.username; link.textContent='@'+me.username; }
    catch(e){ tokSt.textContent='❌ Telegram не принял токен: '+(e.message||e)+'. Проверьте, что скопирован целиком, и что есть интернет.'; } };
  step3.appendChild(U.h('h3',null,'3. Напишите своему боту'));
  step3.appendChild(U.h('p',null,'Со своего телефона откройте бота ',U.h('a',{class:'botlink',href:'#',target:'_blank',rel:'noopener'},''),' и нажмите «Start» (или отправьте любое сообщение). Потом нажмите кнопку ниже — приложение найдёт ваш чат.'));
  const chatSt=U.h('div',{class:'muted',style:'min-height:22px'}); const chatBtn=U.h('button',{class:'btn soft',type:'button'},'Найти мой чат'); step3.appendChild(chatBtn); step3.appendChild(chatSt);
  const step4=U.h('div',{hidden:true}); step3.appendChild(step4);
  chatBtn.onclick=async()=>{ chatSt.textContent='Ищу…'; try{ const ups=await Auto.api(st.token,'getUpdates',{limit:'50'}); const msgs=ups.map(u=>u.message||u.edited_message).filter(m=>m&&m.chat&&m.chat.type==='private');
      if(!msgs.length){ chatSt.textContent='Пока не вижу сообщений. Нажмите «Start» в боте и попробуйте ещё раз через пару секунд.'; return; }
      const m=msgs[msgs.length-1]; st.chat=String(m.chat.id); st.chatName=[m.chat.first_name,m.chat.last_name].filter(Boolean).join(' ')||m.chat.username||'чат';
      chatSt.textContent='✅ Найден чат: '+st.chatName; step4.hidden=false; }
    catch(e){ chatSt.textContent='❌ Не получилось: '+(e.message||e); } };
  step4.appendChild(U.h('h3',null,'4. Что присылать'));
  const d1=U.h('input',{type:'checkbox',checked:true,style:'width:22px;height:22px'}), d2=U.h('input',{type:'checkbox',checked:true,style:'width:22px;height:22px'});
  step4.appendChild(U.h('label',{class:'row nowrap'},d1,U.h('span',null,'Короткое сообщение после каждого занятия')));
  step4.appendChild(U.h('label',{class:'row nowrap',style:'margin-top:8px'},d2,U.h('span',null,'Раз в неделю — отчёт с оценкой. Для него в занятие раз в неделю добавляется короткая проверка без подсказок.')));
  step4.appendChild(U.h('h3',null,'5. ПИН-код для этих настроек'));
  step4.appendChild(U.h('p',{class:'muted',style:'margin-top:0'},'Без ПИН-кода отключить автоотправку сможет кто угодно. Оставьте поле пустым, если защита не нужна.'));
  const pin=U.h('input',{class:'inp',type:'password',inputmode:'numeric',maxlength:'8',placeholder:'например, 4 цифры',autocomplete:'off'}); step4.appendChild(pin);
  const save=U.h('button',{class:'btn pri big',type:'button',style:'margin-top:12px'},'Включить автоотправку'); step4.appendChild(save);
  save.onclick=()=>{ if(!st.token||!st.chat){ U.toast('Сначала пройдите шаги 2 и 3'); return; }
    Auto.save({token:st.token,bot:st.bot,chat:st.chat,chatName:st.chatName,daily:d1.checked,weekly:d2.checked,pin:pin.value.trim(),since:Date.now(),lastWeekly:null,lastSent:null,lastErr:''});
    Auto._unlocked=false; Auto.push('🔔 English 30 подключён ('+P.name+'). '+(d1.checked?'Буду присылать короткое сообщение после каждого занятия':'')+(d1.checked&&d2.checked?' и ':'')+(d2.checked?'раз в неделю — отчёт с оценкой':'')+'.');
    Session.replanIfFresh(); U.toast('Автоотправка включена'); App.render(); };
};
