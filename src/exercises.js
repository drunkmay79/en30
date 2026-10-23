/* ===== Упражнения: каждый тип рисует себя в host и вызывает ctx.done(result) =====
   result: {ok:true|false|'almost', grade:0..3|null, expected, got, why, html, perKey} */

const Ex = {
  kind:{choice:'Выбери',gap:'Впиши',build:'Собери предложение',tr:'Переведи',err:'Найди ошибку',match:'Соедини пары',wchoice:'Слово',cchoice:'Фраза',wtype:'Напиши слово',listen:'Послушай и выбери',dict:'Диктант',letters:'Вставь буквы',scramble:'Собери слово',shadow:'Повтори за диктором',say:'Скажи по-английски',dialog:'Диалог',read:'Чтение',card:'Новое слово',lesson:'Правило',recap:'Напоминание'},
  render(item, host, ctx){
    host.innerHTML=''; const w=U.h('div',{class:'ex fade'}); host.appendChild(w);
    const fn=Ex.types[item.t];
    if(!fn){ w.textContent='Неизвестный тип: '+item.t; ctx.done({ok:true,grade:null}); return; }
    w.appendChild(U.h('div',{class:'kind'},Ex.kind[item.t]||item.t));
    fn(item,w,ctx);
  },
  gapHtml(q, fill){
    let s=U.esc(q).replace(/\(([^)]*)\)/g,'<span class=hint>($1)</span>');
    return s.replace(/___/g, fill!=null?'<span class="gap filled">'+U.esc(fill)+'</span>':'<span class=gap>&nbsp;</span>');
  },
  spk(text, opts){ opts=opts||{}; const b=U.h('button',{class:'spk',title:'Озвучить',type:'button'},opts.slow?'🐢':'🔊');
    b.onclick=()=>{ b.classList.add('playing'); Speech.say(text,{rate:opts.slow?0.6:undefined,onend:()=>b.classList.remove('playing')}); }; return b; },
  input(opts){ opts=opts||{}; const i=U.h('input',{class:'inp',type:'text',autocomplete:'off',autocapitalize:'off',autocorrect:'off',spellcheck:'false',placeholder:opts.ph||'',lang:'en'}); return i; },
  focus(i){ setTimeout(()=>{ try{ i.focus(); }catch(e){} },60); },
  hintBtn(it, w, ctx){ if(!it.unit) return; const u=Content.units[it.unit]; if(!u) return;
    const box=U.h('div',{class:'card flat tight',hidden:true}); const b=U.h('button',{class:'btn sm soft',type:'button'},'💡 Правило: '+u.title);
    b.onclick=()=>{ if(box.hidden){ box.innerHTML='<div class=rule>'+u.rule+'</div>'; box.hidden=false; it._hint=true; } else box.hidden=true; };
    w.appendChild(U.h('div',{class:'row',style:'margin-top:10px'},b)); w.appendChild(box); },
  capHint(it,g){ return it._hint&&g>1?1:g; },
  mark(host, cls){ host.classList.add(cls); },
  /* формула-блоки юнита */
  blocksHtml(u){ if(!u.blocks) return ''; return '<div class=formula>'+u.blocks.map(r=>'<div class=fr><span class="blk s">'+U.esc(r[0])+'</span><span class="blk v">'+U.esc(r[1])+'</span>'+(r[2]?'<span class="blk o">'+U.esc(r[2])+'</span>':'')+'</div>').join('')+'</div><div class=legend><span class="blk s">кто</span><span class="blk v">действие</span><span class="blk o">остальное</span></div>'; },
  timeline(kind){ if(!kind) return '';
    const W=600,H=90,y=50; let marks='';
    const dot=(x,c)=>'<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+c+'"/>';
    if(kind==='habit'||kind==='both'){ for(let x=60;x<=540;x+=60) marks+=dot(x,'var(--o)'); }
    if(kind==='now'||kind==='both'){ marks+='<rect x="270" y="'+(y-10)+'" width="60" height="20" rx="10" fill="var(--v)" opacity=".85"/>'; }
    if(kind==='past'){ marks+='<text x="120" y="'+(y+9)+'" font-size="26" text-anchor="middle" fill="var(--v)">✕</text><text x="120" y="22" font-size="14" text-anchor="middle" fill="var(--muted)">yesterday</text>'; }
    if(kind==='future'){ marks+='<text x="480" y="'+(y+9)+'" font-size="26" text-anchor="middle" fill="var(--v)">✕</text><text x="480" y="22" font-size="14" text-anchor="middle" fill="var(--muted)">tomorrow</text>'; }
    if(kind==='perfect'){ marks+='<line x1="140" y1="'+y+'" x2="290" y2="'+y+'" stroke="var(--v)" stroke-width="8" stroke-linecap="round"/><text x="140" y="22" font-size="14" text-anchor="middle" fill="var(--muted)">когда-то</text><polygon points="286,'+(y-10)+' 302,'+y+' 286,'+(y+10)+'" fill="var(--v)"/>'; }
    const lbl={habit:'обычно, каждый день',now:'прямо сейчас',past:'в прошлом',future:'в будущем',perfect:'было → важно сейчас',both:'обычно  /  сейчас'}[kind]||'';
    return '<svg class=tl viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="'+y+'" x2="580" y2="'+y+'" stroke="var(--line)" stroke-width="4"/><polygon points="580,'+(y-7)+' 596,'+y+' 580,'+(y+7)+'" fill="var(--line)"/><line x1="300" y1="'+(y-18)+'" x2="300" y2="'+(y+18)+'" stroke="var(--pri)" stroke-width="3"/>'+marks+'<text x="300" y="'+(y+36)+'" font-size="14" text-anchor="middle" fill="var(--pri)" font-weight="700">now · сейчас</text><text x="40" y="'+(y+36)+'" font-size="13" fill="var(--muted)">прошлое</text><text x="560" y="'+(y+36)+'" font-size="13" text-anchor="end" fill="var(--muted)">будущее</text><text x="300" y="16" font-size="14" text-anchor="middle" fill="var(--text)">'+U.esc(lbl)+'</text></svg>'; },
  lessonEl(u){
    const el=U.h('div',{class:'lesson'});
    el.appendChild(U.h('div',{class:'row'},U.h('span',{class:'tag '+u.lvl.toLowerCase()},u.lvl),U.h('span',{class:'muted'},u.en)));
    el.appendChild(U.h('h2',null,u.icon+' '+u.title));
    if(u.timeline) el.appendChild(U.h('div',{html:Ex.timeline(u.timeline)}));
    el.appendChild(U.h('div',{class:'rule',html:u.rule}));
    el.appendChild(U.h('div',{html:Ex.blocksHtml(u)}));
    const exl=U.h('div',{class:'exlist'}); u.ex.forEach(e=>{ exl.appendChild(U.h('div',{class:'it'},Ex.spk(e.en),U.h('div',null,U.h('div',{class:'en'},e.en),U.h('div',{class:'ru'},e.ru)))); });
    el.appendChild(U.h('h3',null,'Примеры — послушай и повтори')); el.appendChild(exl);
    if(u.tips&&u.tips.length) el.appendChild(U.h('div',{class:'tips',html:'<b>Частые ошибки</b><ul>'+u.tips.map(t=>'<li>'+t+'</li>').join('')+'</ul>'}));
    return el;
  },
  wordHead(w, opts){ opts=opts||{}; const d=U.h('div',{class:'wcard'});
    if(opts.em!==false) d.appendChild(U.h('div',{class:'em'},w.em||'💬'));
    if(opts.en) d.appendChild(U.h('div',{class:'en'},w.en,' ',Ex.spk(w.en)));
    if(opts.ru) d.appendChild(U.h('div',{class:'ru'},w.ru));
    return d; },
  /* общий блок «микрофон → распознано → сравнение» */
  micUI(host, expected, onScore, onDenied){
    const wrap=U.h('div'); const heard=U.h('div',{class:'heard'},'Нажми на микрофон и скажи фразу');
    const mic=U.h('button',{class:'mic',type:'button',title:'Говорить'},'🎤'); let rec=null, busy=false, denied=false;
    const deny=msg=>{ heard.textContent=msg; if(denied) return; denied=true; mic.disabled=true; mic.style.opacity='.4'; if(onDenied) onDenied(); };
    mic.onclick=()=>{
      if(busy){ try{ rec&&rec.stop(); }catch(e){} return; }
      Speech.stop(); busy=true; mic.classList.add('rec'); mic.textContent='⏹'; heard.textContent='Слушаю…';
      rec=Speech.listen({
        onInterim:t=>{ heard.textContent=t; },
        onError:e=>{ if(e==='not-allowed'||e==='service-not-allowed'||e==='audio-capture') deny('Микрофон здесь недоступен — скажи фразу вслух и оцени себя.'); else if(e==='network') deny('Распознаванию нужен интернет — пока оцени себя сам.'); else heard.textContent=e==='no-speech'?'Ничего не услышал. Попробуй ещё раз.':'Ошибка распознавания: '+e; },
        onEnd:(fin,alts)=>{ busy=false; mic.classList.remove('rec'); mic.textContent='🎤'; if(!fin){ if(heard.textContent==='Слушаю…') heard.textContent='Ничего не услышал. Попробуй ещё раз.'; return; }
          let best=null; for(const alt of alts){ const d=Txt.bestDiff(alt,expected); if(!best||d.score>best.score){ best=d; best.heard=alt; } }
          heard.textContent='Услышал: «'+best.heard+'»'; onScore(best); }
      });
      if(!rec){ busy=false; mic.classList.remove('rec'); mic.textContent='🎤'; deny('Распознавание недоступно в этом браузере — оцени себя сам.'); }
    };
    wrap.appendChild(mic); wrap.appendChild(heard); host.appendChild(wrap); return {mic,heard};
  },
  selfGrade(host, ctx, extra){ const row=U.h('div',{class:'row',style:'margin-top:12px'}); row.appendChild(U.h('button',{class:'btn ok grow',type:'button',onclick:()=>ctx.done(Object.assign({ok:true,grade:2,self:true},extra||{}))},'Получилось 👍'));
    row.appendChild(U.h('button',{class:'btn grow',type:'button',onclick:()=>ctx.done(Object.assign({ok:'almost',grade:1,self:true},extra||{}))},'Было сложно')); host.appendChild(row); },
  types:{}
};

/* ---------- Урок и карточка ---------- */
Ex.types.lesson=function(it,w,ctx){ const u=Content.units[it.unit]; w.appendChild(Ex.lessonEl(u));
  w.appendChild(U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:()=>{ if(!P.units[u.id]) P.units[u.id]={h:[],seen:true}; P.units[u.id].seen=true; ctx.done({ok:true,grade:null}); }},'К упражнениям →'))); };

Ex.types.recap=function(it,w,ctx){ const u=Content.units[it.unit]; w.appendChild(U.h('h2',{style:'margin-top:0'},u.icon+' '+u.title)); w.appendChild(U.h('p',{class:'muted'},'Коротко вспомним правило — и к заданиям.'));
  if(u.timeline) w.appendChild(U.h('div',{html:Ex.timeline(u.timeline)})); w.appendChild(U.h('div',{html:Ex.blocksHtml(u)}));
  const exl=U.h('div',{class:'exlist'}); u.ex.slice(0,3).forEach(e=>exl.appendChild(U.h('div',{class:'it'},Ex.spk(e.en),U.h('div',null,U.h('div',{class:'en'},e.en),U.h('div',{class:'ru'},e.ru))))); w.appendChild(exl);
  if(u.tips&&u.tips.length) w.appendChild(U.h('div',{class:'tips',html:'<b>Не забудь</b><ul>'+u.tips.map(t=>'<li>'+t+'</li>').join('')+'</ul>'}));
  const full=U.h('div',{class:'card flat tight',hidden:true,html:'<div class=rule>'+u.rule+'</div>'}); const fb=U.h('button',{class:'btn sm soft',type:'button',onclick:()=>{ full.hidden=!full.hidden; }},'📖 Полное правило'); w.appendChild(U.h('div',{class:'row',style:'margin-top:10px'},fb)); w.appendChild(full);
  const go=U.h('button',{class:'btn pri big',type:'button',onclick:()=>ctx.done({ok:true,grade:null})},'Помню, к заданиям →'); w.appendChild(U.h('div',{class:'actions'},go)); };

Ex.types.card=function(it,w,ctx){ const o=Content.get(it.key); const d=U.h('div',{class:'wcard'});
  d.appendChild(U.h('div',{class:'em'},o.em||'💬')); d.appendChild(U.h('div',{class:'en'},o.en,' ',Ex.spk(o.en),' ',Ex.spk(o.en,{slow:true}))); d.appendChild(U.h('div',{class:'ru'},o.ru));
  if(o.exEn) d.appendChild(U.h('div',{class:'exm'},Ex.spk(o.exEn),' ',o.exEn,U.h('div',{class:'r'},o.exRu)));
  w.appendChild(d); if(P.settings.autoSpeak) setTimeout(()=>Speech.say(o.en),250);
  w.appendChild(U.h('p',{class:'muted center'},'Послушай, повтори вслух 2 раза и представь картинку.'));
  const acts=U.h('div',{class:'actions'});
  acts.appendChild(U.h('button',{class:'btn soft',type:'button',onclick:()=>{ SRS.markKnown(it.key); ctx.done({ok:true,grade:null,known:true}); }},'Уже знаю ✅'));
  acts.appendChild(U.h('button',{class:'btn pri',type:'button',onclick:()=>{ SRS.ensure(it.key); ctx.done({ok:true,grade:null}); }},'Учу →'));
  w.appendChild(acts); };

/* ---------- Грамматика ---------- */
Ex.types.choice=function(it,w,ctx){ let done=false;
  const q=U.h('div',{class:'q',html:Ex.gapHtml(it.q)}); w.appendChild(q); if(it.ru) w.appendChild(U.h('div',{class:'ru'},it.ru));
  const two=it.o.every(o=>o.length<=12)&&it.o.length<=4; const opts=U.h('div',{class:'opts'+(two?' two':'')}); const order=it.keep?it.o:U.shuffle(it.o); const btns=[];
  order.forEach(o=>{ const b=U.h('button',{class:'opt',type:'button'},o); btns.push(b);
    b.onclick=()=>{ if(done) return; done=true; const ok=o===it.a; b.classList.add(ok?'ok':'bad'); if(!ok) btns.forEach(x=>{ if(x.textContent===it.a) x.classList.add('ok'); }); btns.forEach(x=>x.disabled=true);
      q.innerHTML=Ex.gapHtml(it.q,it.a); const full=it.q.includes('___')?it.q.replace(/___/g,it.a).replace(/\s*\([^)]*\)/g,''):null; if(full&&P.settings.autoSpeak) Speech.say(full);
      ctx.done({ok,grade:Ex.capHint(it,ok?3:0),expected:it.a,got:o,why:it.why,say:full}); }; opts.appendChild(b); });
  w.appendChild(opts); Ex.hintBtn(it,w,ctx); };

Ex.types.gap=function(it,w,ctx){ let done=false;
  const q=U.h('div',{class:'q',html:Ex.gapHtml(it.q)}); w.appendChild(q); if(it.ru) w.appendChild(U.h('div',{class:'ru'},it.ru));
  const inp=Ex.input({ph:it.hint?'Подсказка: '+it.hint:'Впиши слово'}); w.appendChild(inp);
  const check=()=>{ if(done) return; const val=inp.value.trim(); if(!val) return; done=true; const m=Txt.match(val,it.a); inp.disabled=true; inp.classList.add(m.ok===true?'ok':m.ok==='almost'?'ok':'bad');
    q.innerHTML=Ex.gapHtml(it.q,it.a[0]); const full=it.q.replace(/___/g,it.a[0]).replace(/\s*\([^)]*\)/g,''); if(P.settings.autoSpeak) Speech.say(full);
    ctx.done({ok:m.ok,grade:Ex.capHint(it,m.ok===true?3:m.ok==='almost'?1:0),expected:it.a[0],got:val,why:it.hint?'Подсказка была: '+it.hint:'',say:full}); };
  inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); check(); } };
  w.appendChild(U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:check},'Проверить'))); Ex.hintBtn(it,w,ctx); Ex.focus(inp); };

Ex.types.build=function(it,w,ctx){ let done=false;
  const words=it.en.split(' '); const last=words[words.length-1]; const punct=/[.?!]$/.test(last)?last.slice(-1):''; const clean=words.map(x=>x.replace(/[.?!,]$/,''));
  const extra=(it.extra||[]).filter(x=>!clean.includes(x)); const pool=U.shuffle(clean.concat(extra));
  w.appendChild(U.h('div',{class:'q'},it.ru||'Собери предложение')); const ans=U.h('div',{class:'tiles'}); const pl=U.h('div',{class:'tiles pool'}); const chosen=[];
  const punctEl=U.h('span',{class:'tile',style:'border:0;box-shadow:none;background:transparent;padding-left:0'},punct);
  const redraw=()=>{ ans.innerHTML=''; if(!chosen.length) ans.appendChild(U.h('span',{class:'muted',style:'padding:8px 4px'},'Нажимай на слова по порядку')); chosen.forEach((t,i)=>{ const b=U.h('button',{class:'tile',type:'button'},t.w); b.onclick=()=>{ if(done) return; chosen.splice(i,1); pool2.push(t); redraw(); }; ans.appendChild(b); }); if(punct&&chosen.length) ans.appendChild(punctEl);
    pl.innerHTML=''; pool2.forEach((t,i)=>{ const b=U.h('button',{class:'tile',type:'button'},t.w); b.onclick=()=>{ if(done) return; pool2.splice(i,1); chosen.push(t); redraw(); }; pl.appendChild(b); }); };
  let pool2=pool.map((wd,i)=>({w:wd,i})); redraw(); w.appendChild(ans); w.appendChild(pl);
  const check=()=>{ if(done||!chosen.length) return; done=true; const got=chosen.map(t=>t.w).join(' '); const ok=Txt.canon(got)===Txt.canon(it.en);
    U.qa('.tile',ans).forEach(b=>b.classList.add(ok?'ok':'bad')); if(P.settings.autoSpeak) Speech.say(it.en);
    ctx.done({ok,grade:Ex.capHint(it,ok?3:0),expected:it.en,got:got+punct,say:it.en}); };
  w.appendChild(U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:check},'Проверить'))); Ex.hintBtn(it,w,ctx); };

Ex.types.tr=function(it,w,ctx){ let done=false;
  w.appendChild(U.h('div',{class:'q'},it.em?it.em+' ':'',it.ru)); const inp=Ex.input({ph:'Напиши по-английски'}); w.appendChild(inp);
  const hint=U.h('div',{class:'muted',style:'margin-top:8px'}); w.appendChild(hint);
  const check=()=>{ if(done) return; const val=inp.value.trim(); if(!val) return; done=true; const m=Txt.match(val,it.a); inp.disabled=true; inp.classList.add(m.ok?'ok':'bad'); if(P.settings.autoSpeak) Speech.say(m.best);
    let html=''; if(m.ok!==true){ const d=Txt.wordDiff(m.best,val); html=Txt.diffHtml(d.parts); }
    ctx.done({ok:m.ok,grade:Ex.capHint(it,m.ok===true?3:m.ok==='almost'?1:0),expected:m.best,got:val,html,say:m.best}); };
  inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); check(); } };
  const hb=U.h('button',{class:'btn sm soft',type:'button'},'💡 Подсказка'); hb.onclick=()=>{ it._hint=true; const words=it.a[0].split(' '); hint.textContent='Слов: '+words.length+'. Начало: '+words[0]+' …'; };
  w.appendChild(U.h('div',{class:'actions'},hb,U.h('button',{class:'btn pri grow',type:'button',onclick:check},'Проверить'))); Ex.hintBtn(it,w,ctx); Ex.focus(inp); };

Ex.types.err=function(it,w,ctx){ let step=1, done=false;
  w.appendChild(U.h('div',{class:'q'},'Нажми на слово с ошибкой:')); const ws=U.h('div',{class:'words'}); const wrong=it.w.split(' ').map(x=>x.replace(/[.?!,]$/,'').toLowerCase());
  const toks=it.q.split(' '); const spans=[];
  toks.forEach((tk,i)=>{ const s=U.h('span',{class:'w'},tk); spans.push(s); s.onclick=()=>{ if(step!==1||done) return; const clean=tk.replace(/[.?!,]$/,'').toLowerCase(); const hit=wrong.includes(clean); step=2;
      if(hit){ s.classList.add('ok'); phase2(); } else { s.classList.add('bad'); spans.forEach((x,j)=>{ if(wrong.includes(toks[j].replace(/[.?!,]$/,'').toLowerCase())) x.classList.add('ok'); }); done=true; if(P.settings.autoSpeak) Speech.say(it.a); ctx.done({ok:false,grade:0,expected:it.a,got:it.q,why:'Ошибка была в слове «'+it.w+'».',say:it.a}); } }; ws.appendChild(s); });
  w.appendChild(ws); const p2=U.h('div'); w.appendChild(p2);
  function phase2(){ p2.appendChild(U.h('div',{class:'q',style:'margin-top:14px'},'Верно! Как правильно?')); const inp=Ex.input({ph:it.c===''?'Лишнее слово? Нажми «Удалить»':'Правильный вариант'}); p2.appendChild(inp);
    const fin=(val,del)=>{ if(done) return; done=true; let ok; if(it.c===''){ ok=del||Txt.canon(val)==='' ; } else ok=Txt.match(val,[it.c]).ok; inp.disabled=true; inp.classList.add(ok?'ok':'bad'); if(P.settings.autoSpeak) Speech.say(it.a);
      ctx.done({ok:ok===true||ok==='almost'?ok:false,grade:Ex.capHint(it,ok===true?3:ok==='almost'?1:0),expected:it.a,got:del?'(удалить «'+it.w+'»)':val,say:it.a}); };
    inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); if(inp.value.trim()||it.c==='') fin(inp.value.trim(),false); } };
    const acts=U.h('div',{class:'actions'}); if(it.c==='') acts.appendChild(U.h('button',{class:'btn soft grow',type:'button',onclick:()=>fin('',true)},'Удалить слово')); acts.appendChild(U.h('button',{class:'btn pri grow',type:'button',onclick:()=>{ if(inp.value.trim()||it.c==='') fin(inp.value.trim(),false); }},'Проверить')); p2.appendChild(acts); Ex.focus(inp); }
  Ex.hintBtn(it,w,ctx); };

/* ---------- Слова ---------- */
Ex.types.match=function(it,w,ctx){ const objs=it.keys.map(k=>Content.get(k)); const left=U.shuffle(objs), right=U.shuffle(objs); let pick=null; const errs={}; let left_n=objs.length;
  w.appendChild(U.h('div',{class:'q'},'Соедини слово и перевод')); const grid=U.h('div',{class:'match'}); const L=[],R=[];
  for(let i=0;i<objs.length;i++){ const lo=left[i], ro=right[i];
    const lb=U.h('button',{class:'opt',type:'button'},lo.en); lb.onclick=()=>{ if(lb.classList.contains('gone')) return; L.forEach(x=>x.classList.remove('pick')); lb.classList.add('pick'); pick=lo; Speech.say(lo.en); };
    const rb=U.h('button',{class:'opt',type:'button'},(ro.em?ro.em+' ':'')+ro.ru); rb.onclick=()=>{ if(!pick||rb.classList.contains('gone')) return; const lb2=L.find(x=>x.textContent===pick.en);
      if(ro.key===pick.key){ lb2.classList.remove('pick'); lb2.classList.add('ok','gone'); rb.classList.add('ok','gone'); pick=null; left_n--; if(left_n===0){ const perKey={}; objs.forEach(o=>perKey[o.key]=errs[o.key]?1:3); const total=Object.values(errs).reduce((a,b)=>a+b,0); ctx.done({ok:total===0?true:'almost',grade:null,perKey,expected:'',got:'',why:total?'Ошибок: '+total:''}); } }
      else { errs[pick.key]=(errs[pick.key]||0)+1; rb.classList.add('bad'); lb2.classList.add('bad'); setTimeout(()=>{ rb.classList.remove('bad'); lb2.classList.remove('bad'); },500); } };
    L.push(lb); R.push(rb); grid.appendChild(lb); grid.appendChild(rb); }
  w.appendChild(grid); };

Ex.types.wchoice=function(it,w,ctx){ const o=Content.get(it.key); const opts=U.shuffle([it.key].concat(it.opts)).map(k=>Content.get(k)); let done=false; const dir=it.dir||'ru2en';
  if(dir==='en2ru'){ w.appendChild(Ex.wordHead(o,{en:true})); if(P.settings.autoSpeak) setTimeout(()=>Speech.say(o.en),200); } else w.appendChild(Ex.wordHead(o,{ru:true}));
  const grid=U.h('div',{class:'opts two'}); const btns=[];
  opts.forEach(x=>{ const b=U.h('button',{class:'opt',type:'button'},dir==='en2ru'?x.ru:x.en); btns.push(b); b.onclick=()=>{ if(done) return; done=true; const ok=x.key===it.key; b.classList.add(ok?'ok':'bad'); if(!ok) btns[opts.indexOf(o)].classList.add('ok'); btns.forEach(y=>y.disabled=true); Speech.say(o.en);
      ctx.done({ok,grade:ok?3:0,expected:dir==='en2ru'?o.ru:o.en,got:dir==='en2ru'?x.ru:x.en,why:o.exEn?o.exEn+' — '+o.exRu:''}); }; grid.appendChild(b); });
  w.appendChild(grid); };
Ex.types.cchoice=function(it,w,ctx){ const o=Content.get(it.key); const opts=U.shuffle([it.key].concat(it.opts)).map(k=>Content.get(k)); let done=false;
  w.appendChild(U.h('div',{class:'q'},(o.em||'💬')+' '+o.ru)); const grid=U.h('div',{class:'opts'}); const btns=[];
  opts.forEach(x=>{ const b=U.h('button',{class:'opt',type:'button'},x.en); btns.push(b); b.onclick=()=>{ if(done) return; done=true; const ok=x.key===it.key; b.classList.add(ok?'ok':'bad'); if(!ok) btns[opts.indexOf(o)].classList.add('ok'); btns.forEach(y=>y.disabled=true); Speech.say(o.en); ctx.done({ok,grade:ok?3:0,expected:o.en,got:x.en}); }; grid.appendChild(b); });
  w.appendChild(grid); };

Ex.types.wtype=function(it,w,ctx){ const o=Content.get(it.key); let done=false; w.appendChild(Ex.wordHead(o,{ru:true}));
  const inp=Ex.input({ph:'Напиши по-английски'}); w.appendChild(inp);
  const check=()=>{ if(done) return; const val=inp.value.trim(); if(!val) return; done=true; const m=Txt.match(val,[o.en]); inp.disabled=true; inp.classList.add(m.ok?'ok':'bad'); Speech.say(o.en);
    ctx.done({ok:m.ok,grade:m.ok===true?3:m.ok==='almost'?1:0,expected:o.en,got:val,why:o.exEn?o.exEn+' — '+o.exRu:''}); };
  inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); check(); } };
  w.appendChild(U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:check},'Проверить'))); Ex.focus(inp); };

Ex.types.listen=function(it,w,ctx){ const o=Content.get(it.key); const opts=U.shuffle([it.key].concat(it.opts)).map(k=>Content.get(k)); let done=false;
  w.appendChild(U.h('div',{class:'q center'},'Что ты слышишь?')); const row=U.h('div',{class:'row',style:'justify-content:center;margin-bottom:14px'}); const big=U.h('button',{class:'btn pri',type:'button',style:'font-size:28px;min-width:90px'},'🔊'); big.onclick=()=>Speech.say(o.en); row.appendChild(big); row.appendChild(Ex.spk(o.en,{slow:true})); w.appendChild(row);
  setTimeout(()=>Speech.say(o.en),300); const grid=U.h('div',{class:'opts two'}); const btns=[];
  opts.forEach(x=>{ const b=U.h('button',{class:'opt',type:'button'},x.en); btns.push(b); b.onclick=()=>{ if(done) return; done=true; const ok=x.key===it.key; b.classList.add(ok?'ok':'bad'); if(!ok) btns[opts.indexOf(o)].classList.add('ok'); btns.forEach(y=>y.disabled=true); ctx.done({ok,grade:ok?3:0,expected:o.en,got:x.en,why:(o.em||'')+' '+o.ru}); }; grid.appendChild(b); });
  w.appendChild(grid); };

/* ---------- Правописание ---------- */
Ex.types.dict=function(it,w,ctx){ const o=it.key?Content.get(it.key):null; const text=it.text||o.en; let done=false; const sentence=!!it.text;
  w.appendChild(U.h('div',{class:'q center'},sentence?'Послушай и запиши предложение':'Послушай и запиши слово')); const row=U.h('div',{class:'row',style:'justify-content:center;margin-bottom:14px'}); const big=U.h('button',{class:'btn pri',type:'button',style:'font-size:28px;min-width:90px'},'🔊'); big.onclick=()=>Speech.say(text); row.appendChild(big); row.appendChild(Ex.spk(text,{slow:true})); w.appendChild(row);
  setTimeout(()=>Speech.say(text),300); const inp=Ex.input({ph:sentence?'Запиши, что услышал':'Запиши слово'}); w.appendChild(inp);
  const check=()=>{ if(done) return; const val=inp.value.trim(); if(!val) return; done=true; const m=Txt.match(val,[text]); inp.disabled=true; inp.classList.add(m.ok?'ok':'bad'); let html=''; if(m.ok!==true&&sentence) html=Txt.diffHtml(Txt.wordDiff(text,val).parts);
    ctx.done({ok:m.ok,grade:Ex.capHint(it,m.ok===true?3:m.ok==='almost'?1:0),expected:text,got:val,why:o?(o.em||'')+' '+o.ru:(it.ru||''),html}); };
  inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); check(); } };
  w.appendChild(U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:check},'Проверить'))); Ex.focus(inp); };

Ex.types.letters=function(it,w,ctx){ const o=Content.get(it.key); let done=false; const en=o.en;
  const chars=en.split(''); const idx=[]; chars.forEach((c,i)=>{ if(/[a-z]/i.test(c)&&i>0&&c!==' ') idx.push(i); }); const hideN=Math.max(1,Math.round(idx.length*0.45)); const hide=new Set(U.pick(idx,hideN));
  const masked=chars.map((c,i)=>hide.has(i)?'_':c).join(''); w.appendChild(Ex.wordHead(o,{ru:true}));
  w.appendChild(U.h('div',{class:'q center',style:'letter-spacing:.25em;font-family:ui-monospace,Consolas,monospace'},masked));
  const inp=Ex.input({ph:'Напиши слово целиком'}); w.appendChild(inp);
  const check=()=>{ if(done) return; const val=inp.value.trim(); if(!val) return; done=true; const ok=Txt.norm(val)===Txt.norm(en); const almost=!ok&&Txt.lev(Txt.norm(val),Txt.norm(en))===1; inp.disabled=true; inp.classList.add(ok?'ok':'bad'); Speech.say(en);
    ctx.done({ok:ok?true:almost?'almost':false,grade:ok?3:almost?1:0,expected:en,got:val,why:o.exEn?o.exEn+' — '+o.exRu:''}); };
  inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); check(); } };
  w.appendChild(U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:check},'Проверить'))); Ex.focus(inp); };

Ex.types.scramble=function(it,w,ctx){ const o=Content.get(it.key); let done=false; const en=o.en; let letters=en.split('').map((c,i)=>({c,i})); let tries=0; do{ letters=U.shuffle(letters); tries++; }while(letters.map(x=>x.c).join('')===en&&tries<10);
  w.appendChild(Ex.wordHead(o,{ru:true})); const ans=U.h('div',{class:'tiles'}); const pool=U.h('div',{class:'tiles pool'}); const chosen=[];
  const redraw=()=>{ ans.innerHTML=''; chosen.forEach((t,i)=>{ const b=U.h('button',{class:'tile letter',type:'button'},t.c); b.onclick=()=>{ if(done) return; chosen.splice(i,1); letters.push(t); redraw(); }; ans.appendChild(b); }); pool.innerHTML=''; letters.forEach((t,i)=>{ const b=U.h('button',{class:'tile letter',type:'button'},t.c); b.onclick=()=>{ if(done) return; letters.splice(i,1); chosen.push(t); redraw(); if(chosen.length===en.length) check(); }; pool.appendChild(b); }); };
  const check=()=>{ if(done||!chosen.length) return; done=true; const got=chosen.map(t=>t.c).join(''); const ok=got.toLowerCase()===en.toLowerCase(); U.qa('.tile',ans).forEach(b=>b.classList.add(ok?'ok':'bad')); Speech.say(en); ctx.done({ok,grade:ok?3:0,expected:en,got,why:o.exEn?o.exEn+' — '+o.exRu:''}); };
  redraw(); w.appendChild(ans); w.appendChild(pool); w.appendChild(U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:check},'Проверить'))); };

/* ---------- Говорение ---------- */
Ex.types.shadow=function(it,w,ctx){ let best=null, attempts=0, finished=false;
  w.appendChild(U.h('div',{class:'q'},Ex.spk(it.en),' ',it.en,' ',Ex.spk(it.en,{slow:true}))); w.appendChild(U.h('div',{class:'ru'},it.ru));
  if(P.settings.autoSpeak) setTimeout(()=>Speech.say(it.en),250);
  w.appendChild(U.h('p',{class:'muted'},'Послушай, потом скажи так же: нажми микрофон и говори.'));
  const res=U.h('div'); w.appendChild(res);
  if(Speech.canListen()){ const acts=U.h('div',{class:'actions',hidden:true}); const next=U.h('button',{class:'btn pri grow',type:'button'},'Дальше ✓'); acts.appendChild(next);
    Ex.micUI(w,[it.en],d=>{ attempts++; if(!best||d.score>best.score) best=d; res.innerHTML='<div class=fb '+(d.score>=0.85?'ok':d.score>=0.5?'warn':'bad')+'>'+Txt.diffHtml(d.parts)+'<div class=why>Совпало '+Math.round(d.score*100)+'%</div></div>';
      if(d.score>=0.85){ fin(); } else { acts.hidden=false; if(attempts>=3) fin(); } }, ()=>{ if(finished) return; finished=true; Ex.selfGrade(w,{done:r=>ctx.done(r)},{expected:it.en}); });
    w.appendChild(acts); next.onclick=fin; }
  else { w.appendChild(U.h('div',{class:'tips'},'В этом браузере нет распознавания речи. Повтори фразу вслух 2–3 раза, копируя интонацию.')); Ex.selfGrade(w,ctx,{expected:it.en}); }
  function fin(){ if(finished) return; finished=true; const sc=best?best.score:0; ctx.done({ok:sc>=0.85?true:sc>=0.6?'almost':false,grade:sc>=0.85?3:sc>=0.6?1:0,expected:it.en,got:best?best.heard:'',html:best?Txt.diffHtml(best.parts):''}); } };

Ex.types.say=function(it,w,ctx){ let best=null, attempts=0, finished=false, revealed=false;
  w.appendChild(U.h('div',{class:'q'},(it.em?it.em+' ':''),it.ru)); const rev=U.h('div',{class:'muted',style:'min-height:24px'}); w.appendChild(rev);
  const hb=U.h('button',{class:'btn sm soft',type:'button'},'👁 Показать ответ'); hb.onclick=()=>{ revealed=true; it._hint=true; rev.innerHTML=''; rev.appendChild(Ex.spk(it.a[0])); rev.appendChild(document.createTextNode(' '+it.a[0])); Speech.say(it.a[0]); }; w.appendChild(U.h('div',{class:'row'},hb));
  const res=U.h('div'); w.appendChild(res);
  if(Speech.canListen()){ const acts=U.h('div',{class:'actions',hidden:true}); const next=U.h('button',{class:'btn pri grow',type:'button'},'Дальше ✓'); acts.appendChild(next);
    Ex.micUI(w,it.a,d=>{ attempts++; if(!best||d.score>best.score) best=d; res.innerHTML='<div class=fb '+(d.score>=0.85?'ok':d.score>=0.5?'warn':'bad')+'>'+Txt.diffHtml(d.parts)+'<div class=why>Совпало '+Math.round(d.score*100)+'%</div></div>'; if(d.score>=0.85) fin(); else { acts.hidden=false; if(attempts>=3) fin(); } }, ()=>{ if(finished) return; finished=true; hb.click(); Ex.selfGrade(w,{done:r=>ctx.done(Object.assign(r,{grade:Math.min(r.grade,1)}))},{expected:it.a[0]}); });
    w.appendChild(acts); next.onclick=fin; }
  else { w.appendChild(U.h('div',{class:'tips'},'Скажи фразу вслух, потом открой ответ и сравни.')); Ex.selfGrade(w,ctx,{expected:it.a[0]}); }
  function fin(){ if(finished) return; finished=true; const sc=best?best.score:0; let g=sc>=0.85?3:sc>=0.6?1:0; if(revealed&&g>1) g=1; ctx.done({ok:sc>=0.85?true:sc>=0.6?'almost':false,grade:g,expected:it.a[0],got:best?best.heard:'',html:best?Txt.diffHtml(best.parts):''}); } };

Ex.types.dialog=function(it,w,ctx){ const d=DIALOGS.find(x=>x.id===it.id); const box=U.h('div',{class:'dialog'}); w.appendChild(U.h('div',{class:'q'},d.icon+' '+d.title)); w.appendChild(U.h('p',{class:'muted'},'Собеседник говорит — ты отвечаешь. Реплики с 🎤 — твои.')); w.appendChild(box);
  const ctl=U.h('div'); w.appendChild(ctl); let i=0; const scores=[]; let canL=Speech.canListen();
  function manual(bub,ln){ ctl.innerHTML=''; bub.innerHTML=''; bub.appendChild(Ex.spk(ln[1])); bub.appendChild(document.createTextNode(' '+ln[1])); bub.appendChild(U.h('span',{class:'r'},ln[2])); const nb=U.h('button',{class:'btn pri',type:'button'},'Сказал вслух → дальше'); nb.onclick=()=>{ scores.push({s:0.9,self:true}); i++; step(); }; ctl.appendChild(U.h('div',{class:'row',style:'justify-content:center;margin-top:8px'},nb)); }
  function step(){ ctl.innerHTML=''; if(i>=d.lines.length){ finish(); return; } const ln=d.lines[i]; const me=ln[0]==='B';
    if(!me){ const b=U.h('div',{class:'line'},U.h('div',{class:'bubble'},Ex.spk(ln[1]),' ',ln[1],U.h('span',{class:'r'},ln[2]))); box.appendChild(b); b.scrollIntoView({block:'nearest'}); let moved=false; const go=()=>{ if(moved) return; moved=true; i++; setTimeout(step,350); }; Speech.say(ln[1],{onend:go}); setTimeout(go,6000); }
    else { const bub=U.h('div',{class:'bubble'},U.h('span',{class:'r'},'Скажи: '+ln[2])); const b=U.h('div',{class:'line me'},bub); box.appendChild(b); b.scrollIntoView({block:'nearest'});
      const hb=U.h('button',{class:'btn sm soft',type:'button'},'👁 Подсказка'); hb.onclick=()=>{ bub.innerHTML=''; bub.appendChild(Ex.spk(ln[1])); bub.appendChild(document.createTextNode(' '+ln[1])); bub.appendChild(U.h('span',{class:'r'},ln[2])); scores.push({hint:true}); };
      ctl.appendChild(U.h('div',{class:'row',style:'justify-content:center'},hb));
      if(canL){ let got=false; Ex.micUI(ctl,[ln[1]],sc=>{ if(got) return; got=true; bub.innerHTML=''; bub.appendChild(U.h('div',{html:Txt.diffHtml(sc.parts)})); bub.appendChild(U.h('span',{class:'r'},ln[1])); scores.push({s:sc.score}); i++; setTimeout(step,600); }, ()=>{ if(got) return; got=true; canL=false; manual(bub,ln); });
        const skip=U.h('button',{class:'btn sm ghost',type:'button'},'Пропустить →'); skip.onclick=()=>{ if(got) return; got=true; bub.innerHTML=''; bub.appendChild(document.createTextNode(ln[1])); bub.appendChild(U.h('span',{class:'r'},ln[2])); scores.push({s:0}); i++; step(); }; ctl.appendChild(U.h('div',{class:'row',style:'justify-content:center'},skip)); }
      else manual(bub,ln); } }
  function finish(){ const ss=scores.filter(x=>x.s!=null).map(x=>x.s); const avg=ss.length?ss.reduce((a,b)=>a+b,0)/ss.length:0; const hints=scores.filter(x=>x.hint).length; const g=avg>=0.8?3:avg>=0.55?2:avg>0?1:0;
    ctx.done({ok:avg>=0.8?true:avg>=0.5?'almost':false,grade:g,expected:'',got:'',why:'Средняя точность: '+Math.round(avg*100)+'%'+(hints?', подсказок: '+hints:'')}); }
  step(); };

/* ---------- Чтение ---------- */
Ex.types.read=function(it,w,ctx){ const tx=TEXTS.find(t=>t.id===it.id); w.appendChild(U.h('div',{class:'row'},U.h('span',{class:'tag '+tx.lvl.toLowerCase()},tx.lvl),U.h('h2',{style:'margin:6px 0'},tx.icon+' '+tx.title)));
  const t=U.h('div',{class:'text'},tx.text); const tr=U.h('span',{class:'tr',hidden:true},tx.ru); t.appendChild(tr); w.appendChild(t);
  const row=U.h('div',{class:'row',style:'margin-top:10px'}); const sp=U.h('button',{class:'btn sm soft',type:'button'},'🔊 Прослушать'); sp.onclick=()=>Speech.say(tx.text); const tb=U.h('button',{class:'btn sm soft',type:'button'},'Перевод'); tb.onclick=()=>{ tr.hidden=!tr.hidden; }; row.appendChild(sp); row.appendChild(tb); w.appendChild(row);
  const qbox=U.h('div'); w.appendChild(qbox); let qi=0, right=0; const start=U.h('div',{class:'actions'},U.h('button',{class:'btn pri big',type:'button',onclick:()=>{ start.remove(); ask(); }},'К вопросам →')); w.appendChild(start);
  function ask(){ qbox.innerHTML=''; if(qi>=tx.qs.length){ P.read[tx.id]=(P.read[tx.id]||0)+1; const g=right===tx.qs.length?3:right>=2?2:right>=1?1:0; ctx.done({ok:right===tx.qs.length?true:right>0?'almost':false,grade:g,expected:'',got:'',why:'Верно '+right+' из '+tx.qs.length}); return; }
    const q=tx.qs[qi]; qbox.appendChild(U.h('div',{class:'q',style:'margin-top:14px'},(qi+1)+'. '+q.q)); const opts=U.h('div',{class:'opts'}); let done=false; U.shuffle(q.o).forEach(o=>{ const b=U.h('button',{class:'opt',type:'button'},o); b.onclick=()=>{ if(done) return; done=true; const ok=o===q.a; if(ok) right++; b.classList.add(ok?'ok':'bad'); if(!ok) U.qa('.opt',opts).forEach(x=>{ if(x.textContent===q.a) x.classList.add('ok'); }); setTimeout(()=>{ qi++; ask(); },ok?600:1500); }; opts.appendChild(b); }); qbox.appendChild(opts); } };
