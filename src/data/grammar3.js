/* Грамматика A2, часть 3 (юниты 29–40): будущее, сравнение, модальные, наречия,
   something/anything, Present Perfect, too/enough, артикль the. */

GRAMMAR.push({
  id:"going_to", lvl:"A2", title:"Be going to — планы и намерения", en:"be going to", icon:"🗓️", tag:"будущее", timeline:"future",
  rule:`<p><b>Собираюсь, планирую</b>: <b class=s>кто</b> + <b class=v>am / is / are</b> + <b class=v>going to</b> + глагол.</p>
<p><span class=ex>I <b class=v>am going to buy</b> a car. She <b class=v>is going to study</b> medicine. We <b class=v>are going to move</b> to London.</span></p>
<table><tr><th>−</th><th>?</th></tr>
<tr><td>I'm <b>not</b> going to work tomorrow.</td><td><b>Are</b> you going to buy it? — Yes, I am.</td></tr>
<tr><td>He <b>isn't</b> going to come.</td><td><b>What are</b> you going to do?</td></tr></table>
<p>Второе значение — <b>очевидное предсказание</b> (видим признаки): <span class=ex>Look at the clouds! It <b>is going to rain</b>.</span></p>`,
  blocks:[["I","am going to","buy a car."],["She","is going to","study medicine."],["Are","you going to","buy it?"]],
  tips:["Три части, ничего не теряем: <span class=no>I going to call</span> → I <b>am</b> going to call.","После going to — начальная форма: <span class=no>going to buys</span>."],
  ex:[{en:"I am going to buy a car.",ru:"Я собираюсь купить машину."},{en:"She is going to study medicine.",ru:"Она собирается изучать медицину."},{en:"Look at the sky! It is going to rain.",ru:"Посмотри на небо! Сейчас пойдёт дождь."},{en:"What are you going to do tomorrow?",ru:"Что ты собираешься делать завтра?"},{en:"We aren't going to stay here.",ru:"Мы не собираемся здесь оставаться."}],
  drills:[
    {t:"choice",q:"I ___ going to visit my parents.",o:["am","is","are"],a:"am"},
    {t:"choice",q:"She ___ going to study medicine.",o:["is","am","are"],a:"is"},
    {t:"choice",q:"They are going ___ move to London.",o:["to","—","for"],a:"to"},
    {t:"choice",q:"Look at the sky! It ___ rain.",o:["is going to","goes to","going to"],a:"is going to"},
    {t:"choice",q:"___ you going to buy it?",o:["Are","Do","Will"],a:"Are"},
    {t:"choice",q:"He ___ going to come. (не)",o:["isn't","doesn't","not"],a:"isn't"},
    {t:"gap",q:"We are going ___ (have) a party.",a:["to have"]},
    {t:"gap",q:"What ___ you going to do tonight?",a:["are"]},
    {t:"build",en:"I am going to learn English.",ru:"Я собираюсь учить английский.",extra:["will"]},
    {t:"build",en:"What are you going to do tomorrow?",ru:"Что ты собираешься делать завтра?",extra:["is"]},
    {t:"tr",ru:"Я собираюсь купить машину.",a:["I am going to buy a car.","I'm going to buy a car."]},
    {t:"tr",ru:"Она не собирается приходить.",a:["She is not going to come.","She isn't going to come.","She's not going to come."]},
    {t:"err",q:"He going to call you.",w:"going",c:"is going",a:"He is going to call you."}
  ]
});

GRAMMAR.push({
  id:"will", lvl:"A2", title:"Will — предсказания, обещания, решения", en:"will / won't", icon:"🔮", tag:"будущее", timeline:"future",
  rule:`<p><b>will</b> + глагол — одна форма для всех: <span class=ex>I <b class=v>will help</b>. She <b class=v>will come</b>.</span> Кратко: <b>I'll, she'll</b>. Отрицание: <b>won't</b> (= will not).</p>
<p>Когда говорим <b>will</b>:</p>
<ul><li><b>предсказание, мнение</b>: I think it <b>will</b> rain tomorrow. You <b>will</b> like it.</li>
<li><b>решение прямо сейчас</b>: The phone is ringing. — I'<b>ll</b> answer it!</li>
<li><b>обещание, предложение помощи</b>: I'<b>ll</b> call you. I'<b>ll</b> help you with the bags.</li></ul>
<table><tr><th>going to</th><th>will</th></tr>
<tr><td>план, решили заранее: I'm going to buy a car (уже решил)</td><td>спонтанно, мнение, обещание: I'll buy it! (решил только что)</td></tr></table>
<p>Вопрос: <b>Will</b> you help me? — Yes, I will. / No, I won't.</p>`,
  blocks:[["I","will help","you."],["It","won't","rain."],["Will","you","marry me?"]],
  tips:["<span class=no>She will comes</span> → She will <b>come</b>.","<span class=no>I will to go</span> → I will <b>go</b>."],
  ex:[{en:"I think it will rain tomorrow.",ru:"Думаю, завтра будет дождь."},{en:"Don't worry, I'll help you.",ru:"Не волнуйся, я тебе помогу."},{en:"I'll call you tonight.",ru:"Я позвоню тебе вечером."},{en:"She won't come.",ru:"Она не придёт."},{en:"Will you be at home? — Yes, I will.",ru:"Ты будешь дома? — Да."},{en:"I'll have a coffee, please.",ru:"Я буду кофе, пожалуйста."}],
  drills:[
    {t:"choice",q:"I think it ___ rain tomorrow.",o:["will","is going","wills"],a:"will"},
    {t:"choice",q:"Don't worry, I ___ help you.",o:["will","am","going to"],a:"will"},
    {t:"choice",q:"She ___ come. (не)",o:["won't","will not to","doesn't will"],a:"won't"},
    {t:"choice",q:"___ you marry me?",o:["Will","Do","Are"],a:"Will"},
    {t:"choice",q:"The phone is ringing. — I ___ answer it!",o:["will","am going to","going"],a:"will",why:"решение прямо сейчас"},
    {t:"choice",q:"I ___ buy a new car next year. (уже решил)",o:["am going to","will","going to"],a:"am going to",why:"план → going to"},
    {t:"choice",q:"We ___ be late. (не будем)",o:["won't","don't","aren't"],a:"won't"},
    {t:"gap",q:"I promise I ___ call you.",a:["will","'ll"]},
    {t:"gap",q:"Will she come? — No, she ___.",a:["won't","will not"]},
    {t:"build",en:"It will be cold tomorrow.",ru:"Завтра будет холодно.",extra:["is"]},
    {t:"build",en:"I'll have a coffee, please.",ru:"Я буду кофе, пожалуйста.",extra:["am"]},
    {t:"tr",ru:"Я тебе помогу.",a:["I will help you.","I'll help you."]},
    {t:"tr",ru:"Он не придёт.",a:["He won't come.","He will not come."]},
    {t:"err",q:"She will comes.",w:"comes",c:"come",a:"She will come."}
  ]
});

GRAMMAR.push({
  id:"comp", lvl:"A2", title:"Сравнение: bigger, more expensive", en:"comparatives", icon:"📏", tag:"прилагательные", timeline:null,
  rule:`<p>«Больше, чем», «дороже, чем» — <b>сравнительная степень</b> + <b>than</b> (чем).</p>
<table><tr><th>Прилагательное</th><th>Правило</th><th>Примеры</th></tr>
<tr><td>короткое (1 слог)</td><td>+ <b>er</b></td><td>tall → tall<b>er</b>, old → old<b>er</b>, cheap → cheap<b>er</b></td></tr>
<tr><td>короткое: гласная + согласная</td><td>удваиваем + er</td><td>big → bi<b>gg</b>er, hot → ho<b>tt</b>er</td></tr>
<tr><td>на -y</td><td>y → <b>ier</b></td><td>happy → happ<b>ier</b>, easy → eas<b>ier</b></td></tr>
<tr><td>длинное (2+ слога)</td><td><b>more</b> + слово</td><td><b>more</b> expensive, <b>more</b> interesting</td></tr>
<tr><td>исключения</td><td></td><td>good → <b>better</b>, bad → <b>worse</b>, far → <b>further</b></td></tr></table>
<p><span class=ex>My brother is <b>taller than</b> me. This phone is <b>more expensive than</b> that one. Today is <b>better than</b> yesterday.</span></p>
<p>Усилить: <b>much</b> better, <b>a lot</b> bigger. Чуть-чуть: <b>a bit</b> cheaper.</p>`,
  blocks:[["My brother","is taller","than me."],["This phone","is more expensive","than that one."]],
  tips:["Не смешивай: <span class=no>more taller</span>, <span class=no>more better</span>.","«Чем» — <b>than</b>, а не <span class=no>then</span> (then = потом)."],
  ex:[{en:"My brother is taller than me.",ru:"Мой брат выше меня."},{en:"This book is more interesting than that one.",ru:"Эта книга интереснее той."},{en:"Today is hotter than yesterday.",ru:"Сегодня жарче, чем вчера."},{en:"Her car is better than mine.",ru:"Её машина лучше моей."},{en:"A plane is faster than a car.",ru:"Самолёт быстрее машины."}],
  drills:[
    {t:"gap",q:"My brother is ___ (tall) than me.",a:["taller"]},
    {t:"gap",q:"This book is ___ (interesting) than that one.",a:["more interesting"]},
    {t:"gap",q:"Today is ___ (hot) than yesterday.",a:["hotter"],hint:"удвой t"},
    {t:"gap",q:"Her car is ___ (good) than mine.",a:["better"],hint:"исключение"},
    {t:"gap",q:"This test is ___ (easy) than the last one.",a:["easier"],hint:"y → ier"},
    {t:"gap",q:"Moscow is ___ (big) than Tver.",a:["bigger"]},
    {t:"gap",q:"The weather is ___ (bad) today.",a:["worse"],hint:"исключение"},
    {t:"gap",q:"This hotel is ___ (expensive) than that one.",a:["more expensive"]},
    {t:"choice",q:"A plane is ___ than a car.",o:["faster","more fast","fastest"],a:"faster"},
    {t:"choice",q:"She is ___ than her sister.",o:["more beautiful","beautifuler","beautifuller"],a:"more beautiful"},
    {t:"build",en:"My flat is smaller than yours.",ru:"Моя квартира меньше твоей.",extra:["more"]},
    {t:"tr",ru:"Она старше меня.",a:["She is older than me.","She is older than I am.","She's older than me."]},
    {t:"tr",ru:"Это дешевле.",a:["It is cheaper.","This is cheaper.","It's cheaper."]},
    {t:"err",q:"He is more tall than me.",w:"more tall",c:"taller",a:"He is taller than me."}
  ]
});

GRAMMAR.push({
  id:"sup", lvl:"A2", title:"Самый: the biggest, the most expensive", en:"superlatives", icon:"🏆", tag:"прилагательные", timeline:null,
  rule:`<p>«Самый» — <b>превосходная степень</b>, всегда с <b>the</b>:</p>
<table><tr><th>Прилагательное</th><th>Правило</th><th>Примеры</th></tr>
<tr><td>короткое</td><td>the + <b>est</b></td><td>the tall<b>est</b>, the old<b>est</b>, the bi<b>ggest</b>, the happ<b>iest</b></td></tr>
<tr><td>длинное</td><td>the <b>most</b> + слово</td><td>the <b>most</b> expensive, the <b>most</b> beautiful</td></tr>
<tr><td>исключения</td><td></td><td>good → the <b>best</b>, bad → the <b>worst</b>, far → the <b>furthest</b></td></tr></table>
<p><span class=ex>He is <b>the tallest</b> boy in the class. It is <b>the most expensive</b> restaurant in town. This is <b>the best</b> day of my life.</span></p>
<p>После превосходной степени — <b>in</b> (место, группа) или <b>of</b> (время, «из всех»): the biggest city <b>in</b> Russia, the best day <b>of</b> my life.</p>
<p>Три ступени: <b>big → bigger → the biggest</b>; <b>good → better → the best</b>.</p>`,
  blocks:[["He is","the tallest","boy in the class."],["It is","the most expensive","restaurant in town."]],
  tips:["Не забывай <b>the</b>: <span class=no>She is best student</span> → She is <b>the</b> best student.","<span class=no>the most nice</span> → the nice<b>st</b> (nice — короткое)."],
  ex:[{en:"He is the tallest boy in the class.",ru:"Он самый высокий мальчик в классе."},{en:"It is the most expensive restaurant in town.",ru:"Это самый дорогой ресторан в городе."},{en:"This is the best day of my life.",ru:"Это лучший день в моей жизни."},{en:"Everest is the highest mountain in the world.",ru:"Эверест — самая высокая гора в мире."},{en:"Which is the biggest city in Russia?",ru:"Какой город в России самый большой?"}],
  drills:[
    {t:"gap",q:"He is ___ (tall) boy in the class.",a:["the tallest"]},
    {t:"gap",q:"It is ___ (expensive) restaurant in town.",a:["the most expensive"]},
    {t:"gap",q:"She is ___ (good) student.",a:["the best"]},
    {t:"gap",q:"This is ___ (bad) film!",a:["the worst"]},
    {t:"gap",q:"Which is ___ (big) city in Russia?",a:["the biggest"]},
    {t:"gap",q:"Who is ___ (happy) person you know?",a:["the happiest"]},
    {t:"choice",q:"Everest is ___ mountain in the world.",o:["the highest","the most high","higher"],a:"the highest"},
    {t:"choice",q:"Три ступени: good → ?",o:["better → the best","gooder → the goodest","more good → the most good"],a:"better → the best"},
    {t:"choice",q:"It's the best day ___ my life.",o:["of","in","at"],a:"of"},
    {t:"build",en:"This is the best day of my life.",ru:"Это лучший день в моей жизни.",extra:["better"]},
    {t:"tr",ru:"Это самый дешёвый телефон.",a:["This is the cheapest phone.","It is the cheapest phone.","It's the cheapest phone."]},
    {t:"tr",ru:"Она самая лучшая.",a:["She is the best.","She's the best."]},
    {t:"err",q:"She is the most nice girl.",w:"most nice",c:"nicest",a:"She is the nicest girl."}
  ]
});

GRAMMAR.push({
  id:"must_have", lvl:"A2", title:"Must / have to / mustn't — надо и нельзя", en:"must / have to", icon:"⚠️", tag:"модальные", timeline:null,
  rule:`<table><tr><th>Форма</th><th>Смысл</th><th>Пример</th></tr>
<tr><td><b>must</b></td><td>должен (так считаю я, правило)</td><td>You <b>must</b> stop at a red light. I <b>must</b> call my mum.</td></tr>
<tr><td><b>have to / has to</b></td><td>вынужден (обстоятельства, начальство)</td><td>I <b>have to</b> work on Saturday. She <b>has to</b> wear a uniform.</td></tr>
<tr><td><b>mustn't</b></td><td>нельзя! (запрет) 🚫</td><td>You <b>mustn't</b> smoke here.</td></tr>
<tr><td><b>don't have to</b></td><td>не обязательно, можно не 🙂</td><td>You <b>don't have to</b> come if you are busy.</td></tr></table>
<p>Главная ловушка: <b>mustn't</b> и <b>don't have to</b> — противоположные! <span class=ex>You mustn't pay</span> = платить запрещено; <span class=ex>You don't have to pay</span> = платить не нужно.</p>
<p>Must — без to и без -s: <span class=no>must to go, musts</span>. Вопрос обычно через have to: <b>Do</b> you <b>have to</b> work? <b>Does</b> he <b>have to</b>…?</p>`,
  blocks:[["You","must","stop here."],["I","have to","work on Saturday."],["You","mustn't","smoke here."]],
  tips:["<span class=no>She must to go</span> → She must <b>go</b>.","<span class=no>He have to</span> → He <b>has</b> to."],
  ex:[{en:"You must see a doctor.",ru:"Тебе нужно к врачу."},{en:"I have to work on Saturday.",ru:"Мне приходится работать в субботу."},{en:"You mustn't smoke here.",ru:"Здесь нельзя курить."},{en:"You don't have to come.",ru:"Тебе не обязательно приходить."},{en:"Does he have to get up early?",ru:"Ему приходится рано вставать?"}],
  drills:[
    {t:"choice",q:"You ___ smoke here. (запрещено)",o:["mustn't","don't have to","must"],a:"mustn't"},
    {t:"choice",q:"You ___ come if you are busy. (не обязательно)",o:["don't have to","mustn't","must"],a:"don't have to"},
    {t:"choice",q:"I ___ go to work tomorrow. (вынужден)",o:["have to","must to","has to"],a:"have to"},
    {t:"choice",q:"She ___ wear a uniform at work.",o:["has to","have to","must to"],a:"has to"},
    {t:"choice",q:"You ___ be quiet in the library.",o:["must","have","musts"],a:"must"},
    {t:"choice",q:"Does he ___ get up early?",o:["have to","has to","must"],a:"have to"},
    {t:"choice",q:"«Платить не нужно» = You ___ pay.",o:["don't have to","mustn't","must"],a:"don't have to"},
    {t:"gap",q:"I ___ finish this today. (обязан)",a:["must","have to"]},
    {t:"gap",q:"You ___ park here. (нельзя)",a:["mustn't","must not","can't"]},
    {t:"build",en:"You must see a doctor.",ru:"Тебе нужно к врачу.",extra:["to"]},
    {t:"tr",ru:"Тебе нельзя здесь парковаться.",a:["You mustn't park here.","You must not park here.","You can't park here."]},
    {t:"tr",ru:"Мне не нужно рано вставать.",a:["I don't have to get up early.","I do not have to get up early."]},
    {t:"err",q:"She must to go.",w:"to",c:"",a:"She must go."},
    {t:"err",q:"He have to work.",w:"have",c:"has",a:"He has to work."}
  ]
});

GRAMMAR.push({
  id:"should", lvl:"A2", title:"Should — совет", en:"should / shouldn't", icon:"💡", tag:"модальные", timeline:null,
  rule:`<p><b>should</b> + глагол — «стоит, следует», мягкий совет: <span class=ex>You <b class=v>should see</b> a doctor. You <b class=v>shouldn't eat</b> so much sugar.</span></p>
<table><tr><th>+</th><th>−</th><th>?</th></tr>
<tr><td>You <b>should</b> rest.</td><td>You <b>shouldn't</b> smoke.</td><td><b>Should</b> I call her? — Yes, you should.</td></tr></table>
<p>Шкала силы: <b>can</b> (можешь) → <b>should</b> (стоит) → <b>have to</b> (надо) → <b>must</b> (обязан).</p>
<p>Как спросить совета: <span class=ex><b>What should I do?</b> — Что мне делать?</span></p>`,
  blocks:[["You","should","see a doctor."],["You","shouldn't","smoke."],["Should","I","call her?"]],
  tips:["<span class=no>You should to sleep</span> → You should <b>sleep</b>.","Форма одна для всех: he should, she should (без -s)."],
  ex:[{en:"You should see a doctor.",ru:"Тебе стоит сходить к врачу."},{en:"You shouldn't eat so much sugar.",ru:"Тебе не стоит есть столько сахара."},{en:"Should I call her?",ru:"Мне позвонить ей?"},{en:"What should I do?",ru:"Что мне делать?"},{en:"You should learn English every day.",ru:"Тебе стоит учить английский каждый день."}],
  drills:[
    {t:"choice",q:"You look tired. You ___ go to bed.",o:["should","shouldn't","must to"],a:"should"},
    {t:"choice",q:"He ___ eat so much sugar. (не стоит)",o:["shouldn't","should","don't should"],a:"shouldn't"},
    {t:"choice",q:"___ I call her?",o:["Should","Do","Am"],a:"Should"},
    {t:"choice",q:"You should ___ more water.",o:["drink","drinking","to drink"],a:"drink"},
    {t:"choice",q:"What ___ I do?",o:["should","do","am"],a:"should"},
    {t:"gap",q:"It's cold. You ___ take a coat.",a:["should"]},
    {t:"gap",q:"She ___ drive so fast. (не стоит)",a:["shouldn't","should not"]},
    {t:"build",en:"You should learn English every day.",ru:"Тебе стоит учить английский каждый день.",extra:["to"]},
    {t:"build",en:"You shouldn't smoke.",ru:"Тебе не стоит курить.",extra:["don't"]},
    {t:"tr",ru:"Тебе стоит отдохнуть.",a:["You should rest.","You should have a rest.","You should relax."]},
    {t:"tr",ru:"Мне стоит ему позвонить?",a:["Should I call him?"]},
    {t:"err",q:"You should to sleep more.",w:"to",c:"",a:"You should sleep more."}
  ]
});

GRAMMAR.push({
  id:"would_like", lvl:"A2", title:"Would like / want to — хочу", en:"would like, want to", icon:"🙏", tag:"модальные", timeline:null,
  rule:`<p><b>would like</b> (кратко <b>'d like</b>) — вежливое «хочу, хотел бы». Так заказывают, просят, предлагают:</p>
<p><span class=ex>I<b>'d like</b> a coffee, please. I<b>'d like to</b> book a table. <b>Would you like</b> some tea? — Yes, please. / No, thank you.</span></p>
<table><tr><th>like</th><th>would like</th></tr>
<tr><td>вообще нравится: I <b>like</b> coffee.</td><td>хочу сейчас: I<b>'d like</b> a coffee.</td></tr>
<tr><td>Do you like tea?</td><td>Would you like some tea?</td></tr></table>
<p><b>want + to</b> — прямое «хочу»: <span class=ex>I <b>want to</b> sleep. She <b>wants to</b> go home.</span> Would like — вежливее.</p>
<p>Ответ на предложение: <span class=ex>Would you like to dance? — <b>I'd love to!</b></span></p>`,
  blocks:[["I","'d like","a coffee, please."],["Would","you like","some tea?"],["I","want to","sleep."]],
  tips:["После would like — существительное или <b>to</b> + глагол: I'd like <b>to go</b>, не <span class=no>I'd like go</span>.","«'d» в <b>I'd like</b> — это would, а не had."],
  ex:[{en:"I'd like a coffee, please.",ru:"Мне, пожалуйста, кофе."},{en:"Would you like some tea?",ru:"Хотите чаю?"},{en:"I'd like to book a table.",ru:"Я хотел бы забронировать столик."},{en:"I want to go home.",ru:"Я хочу домой."},{en:"Would you like to dance? — I'd love to!",ru:"Потанцуем? — С удовольствием!"}],
  drills:[
    {t:"choice",q:"___ a cup of tea, please.",o:["I'd like","I like","I am liking"],a:"I'd like"},
    {t:"choice",q:"___ you like some coffee?",o:["Would","Do","Are"],a:"Would"},
    {t:"choice",q:"I want ___ home.",o:["to go","go","going"],a:"to go"},
    {t:"choice",q:"She would like ___ a doctor.",o:["to be","be","being"],a:"to be"},
    {t:"choice",q:"Would you like to dance? — Yes, ___",o:["I'd love to.","I would.","I like."],a:"I'd love to."},
    {t:"choice",q:"«Я вообще люблю чай» = I ___ tea.",o:["like","would like","'d like"],a:"like"},
    {t:"gap",q:"I ___ like to book a table, please.",a:["would","'d"]},
    {t:"gap",q:"He wants ___ (buy) a new phone.",a:["to buy"]},
    {t:"build",en:"I'd like to order, please.",ru:"Я хотел бы сделать заказ.",extra:["like"]},
    {t:"build",en:"Would you like some water?",ru:"Хотите воды?",extra:["do"]},
    {t:"tr",ru:"Я хотел бы чай.",a:["I would like tea.","I'd like tea.","I would like some tea.","I'd like some tea.","I'd like a tea."]},
    {t:"tr",ru:"Я хочу спать.",a:["I want to sleep."]},
    {t:"err",q:"I would like go home.",w:"go",c:"to go",a:"I would like to go home."}
  ]
});

GRAMMAR.push({
  id:"adv_manner", lvl:"A2", title:"Как? Наречия на -ly", en:"adverbs of manner", icon:"🏎️", tag:"наречия", timeline:null,
  rule:`<p><b>Прилагательное</b> описывает предмет (какой?), <b>наречие</b> — действие (как?):</p>
<p><span class=ex>He is a <b class=o>slow</b> driver. → He drives <b class=v>slowly</b>.</span></p>
<table><tr><th>Правило</th><th>Примеры</th></tr>
<tr><td>+ <b>ly</b></td><td>quick → quick<b>ly</b>, careful → careful<b>ly</b>, quiet → quiet<b>ly</b></td></tr>
<tr><td>-y → <b>ily</b></td><td>happy → happ<b>ily</b>, easy → eas<b>ily</b></td></tr>
<tr><td>исключения</td><td>good → <b>well</b>, fast → <b>fast</b>, hard → <b>hard</b>, late → <b>late</b></td></tr></table>
<p>Наречие стоит <b>после</b> глагола или дополнения: <span class=ex>She speaks English <b>well</b>. He works <b>hard</b>.</span></p>
<p>После to be, look, feel, sound — <b>прилагательное</b>: <span class=ex>She is <b>happy</b>. It looks <b>good</b>.</span></p>`,
  blocks:[["She","speaks English","well."],["He","drives","slowly."]],
  tips:["<span class=no>She speaks English good</span> → She speaks English <b>well</b>.","Hardly ≠ hard: hardly = «едва». He works <b>hard</b> (усердно)."],
  ex:[{en:"She speaks English well.",ru:"Она хорошо говорит по-английски."},{en:"He drives very slowly.",ru:"Он водит очень медленно."},{en:"They work hard.",ru:"Они усердно работают."},{en:"Please speak quietly.",ru:"Пожалуйста, говорите тихо."},{en:"She sings beautifully.",ru:"Она красиво поёт."}],
  drills:[
    {t:"choice",q:"She speaks English ___.",o:["well","good","goodly"],a:"well"},
    {t:"choice",q:"He drives very ___.",o:["slowly","slow","slowly."],a:"slowly"},
    {t:"choice",q:"This is a ___ car.",o:["fast","fastly","faster"],a:"fast",why:"какая машина? — прилагательное"},
    {t:"choice",q:"They work ___.",o:["hard","hardly","hardy"],a:"hard"},
    {t:"choice",q:"She sings ___.",o:["beautifully","beautiful","beauty"],a:"beautifully"},
    {t:"choice",q:"Be ___!",o:["careful","carefully","care"],a:"careful",why:"после be — прилагательное"},
    {t:"choice",q:"The soup tastes ___.",o:["good","well","goodly"],a:"good",why:"после taste — прилагательное"},
    {t:"gap",q:"Please speak ___ (quiet).",a:["quietly"]},
    {t:"gap",q:"He answered ___ (happy).",a:["happily"]},
    {t:"gap",q:"She runs very ___ (fast).",a:["fast"],hint:"исключение"},
    {t:"build",en:"She walks very quickly.",ru:"Она ходит очень быстро.",extra:["quick"]},
    {t:"tr",ru:"Он хорошо готовит.",a:["He cooks well."]},
    {t:"tr",ru:"Говори медленно, пожалуйста.",a:["Speak slowly, please.","Please speak slowly."]},
    {t:"err",q:"She speaks English very good.",w:"good",c:"well",a:"She speaks English very well."}
  ]
});

GRAMMAR.push({
  id:"some_compounds", lvl:"A2", title:"Something, anybody, nowhere, everything", en:"some- / any- / no- / every-", icon:"🧭", tag:"местоимения", timeline:null,
  rule:`<p>Те же правила, что у some / any, но «склеенные» слова:</p>
<table><tr><th></th><th>-thing (что-то)</th><th>-body / -one (кто-то)</th><th>-where (где-то)</th></tr>
<tr><th>some- (+)</th><td>something</td><td>somebody, someone</td><td>somewhere</td></tr>
<tr><th>any- (−, ?)</th><td>anything</td><td>anybody, anyone</td><td>anywhere</td></tr>
<tr><th>no- (= not any)</th><td>nothing</td><td>nobody, no one</td><td>nowhere</td></tr>
<tr><th>every- (все)</th><td>everything</td><td>everybody, everyone</td><td>everywhere</td></tr></table>
<p><span class=ex>There is <b>something</b> in the box. Is there <b>anybody</b> at home? I don't know <b>anyone</b> here. <b>Nobody</b> knows. <b>Everything</b> is ready.</span></p>
<p><b>No-</b> уже отрицание, второе «не» не нужно: <span class=ex>I have <b>nothing</b></span> = <span class=ex>I <b>don't</b> have <b>anything</b></span>.</p>
<p>Глагол после них — в единственном числе: Every<b>body is</b> here. Some<b>one wants</b> to see you.</p>`,
  blocks:[["There is","something","in the box."],["Nobody","knows","the answer."],["Everybody","is","here."]],
  tips:["<span class=no>I don't have nothing</span> (двойное отрицание) → I don't have <b>anything</b> / I have <b>nothing</b>.","Предложение, просьба — some-: Would you like <b>something</b> to drink?"],
  ex:[{en:"There is something in the box.",ru:"В коробке что-то есть."},{en:"Is there anybody at home?",ru:"Дома кто-нибудь есть?"},{en:"I don't know anyone here.",ru:"Я здесь никого не знаю."},{en:"Nobody knows the answer.",ru:"Никто не знает ответа."},{en:"Everything is ready.",ru:"Всё готово."},{en:"Let's go somewhere nice.",ru:"Пойдём куда-нибудь в приятное место."}],
  drills:[
    {t:"choice",q:"There is ___ in the box. (что-то)",o:["something","anything","nothing"],a:"something"},
    {t:"choice",q:"Is there ___ at home?",o:["anybody","somebody","nobody"],a:"anybody"},
    {t:"choice",q:"I don't know ___ here.",o:["anybody","somebody","nobody"],a:"anybody"},
    {t:"choice",q:"___ is ready. (всё)",o:["Everything","Anything","Something"],a:"Everything"},
    {t:"choice",q:"I have ___ to do. (ничего)",o:["nothing","anything","something"],a:"nothing"},
    {t:"choice",q:"Let's go ___ nice. (куда-нибудь)",o:["somewhere","anywhere","nowhere"],a:"somewhere"},
    {t:"choice",q:"Everybody ___ here.",o:["is","are"],a:"is"},
    {t:"gap",q:"Would you like ___ to drink? (что-нибудь, предложение)",a:["something"]},
    {t:"gap",q:"___ knows the answer. (никто)",a:["Nobody","No one"]},
    {t:"build",en:"Everybody likes pizza.",ru:"Все любят пиццу.",extra:["like"]},
    {t:"tr",ru:"Никто не знает.",a:["Nobody knows.","No one knows."]},
    {t:"tr",ru:"Я ничего не вижу.",a:["I can't see anything.","I don't see anything.","I see nothing.","I can see nothing."]},
    {t:"err",q:"I don't have nothing.",w:"nothing",c:"anything",a:"I don't have anything."}
  ]
});

GRAMMAR.push({
  id:"pres_perf", lvl:"A2", title:"Present Perfect: опыт и результат", en:"Present Perfect", icon:"🔗", tag:"Present Perfect", timeline:"perfect",
  rule:`<p><b>have / has + третья форма</b> глагола (V3): <span class=ex>I <b class=v>have seen</b> this film. She <b class=v>has been</b> to London.</span></p>
<p>Когда: действие в прошлом <b>без точного времени</b>, важен результат или опыт <b>сейчас</b>.</p>
<ul><li><b>опыт</b>: Have you <b>ever</b> been to Paris? I have <b>never</b> eaten sushi.</li>
<li><b>результат</b>: I have lost my keys (и сейчас их нет). She has <b>just</b> arrived.</li>
<li><b>already / yet</b>: I've <b>already</b> finished. Have you finished <b>yet</b>? — Not <b>yet</b>.</li></ul>
<table><tr><th>Present Perfect</th><th>Past Simple</th></tr>
<tr><td>когда — не важно: I <b>have been</b> to London.</td><td>есть время: I <b>went</b> to London <b>in 2015</b>.</td></tr></table>
<p>Третья форма: правильные — как Past (work<b>ed</b>); неправильные: go → <b>gone</b>, see → <b>seen</b>, be → <b>been</b>, eat → <b>eaten</b>, do → <b>done</b>, have → <b>had</b>, buy → <b>bought</b>, write → <b>written</b>, take → <b>taken</b>, give → <b>given</b>, make → <b>made</b>, read → <b>read</b>.</p>`,
  blocks:[["I","have seen","this film."],["She","has just","arrived."],["Have","you ever","been to Paris?"]],
  tips:["С yesterday, last year, in 2010 — только Past Simple: <span class=no>I have seen him yesterday</span> → I <b>saw</b> him yesterday.","<b>Been</b> и <b>gone</b>: She has <b>been</b> to Paris (ездила и вернулась) / She has <b>gone</b> to Paris (уехала и там)."],
  ex:[{en:"I have never been to Paris.",ru:"Я никогда не был в Париже."},{en:"Have you ever eaten sushi?",ru:"Ты когда-нибудь ел суши?"},{en:"She has just finished her work.",ru:"Она только что закончила работу."},{en:"I have lost my keys.",ru:"Я потерял ключи."},{en:"We have already seen this film.",ru:"Мы уже видели этот фильм."},{en:"Have you finished yet? — Not yet.",ru:"Ты уже закончил? — Ещё нет."}],
  drills:[
    {t:"choice",q:"I ___ never been to Paris.",o:["have","has","am"],a:"have"},
    {t:"choice",q:"She ___ just finished her work.",o:["has","have","is"],a:"has"},
    {t:"choice",q:"Have you ever ___ sushi?",o:["eaten","ate","eat"],a:"eaten"},
    {t:"choice",q:"We have ___ this film.",o:["seen","saw","see"],a:"seen"},
    {t:"choice",q:"He ___ lost his keys.",o:["has","have","did"],a:"has"},
    {t:"choice",q:"I ___ to London in 2015.",o:["went","have been","have gone"],a:"went",why:"есть время (2015) → Past Simple"},
    {t:"choice",q:"Have you finished? — Not ___.",o:["yet","already","just"],a:"yet"},
    {t:"choice",q:"She has ___ to Paris. (ездила и вернулась)",o:["been","gone","went"],a:"been"},
    {t:"gap",q:"I have ___ (be) to Italy twice.",a:["been"]},
    {t:"gap",q:"They have ___ (buy) a new house.",a:["bought"]},
    {t:"gap",q:"___ you ever been to London?",a:["Have"]},
    {t:"build",en:"Have you ever been to London?",ru:"Ты когда-нибудь был в Лондоне?",extra:["did"]},
    {t:"build",en:"I have just had lunch.",ru:"Я только что пообедал.",extra:["has"]},
    {t:"tr",ru:"Я уже поел.",a:["I have already eaten.","I've already eaten.","I have eaten already.","I've eaten already."]},
    {t:"tr",ru:"Она никогда не видела снег.",a:["She has never seen snow.","She's never seen snow."]},
    {t:"err",q:"I have saw this film.",w:"saw",c:"seen",a:"I have seen this film."}
  ]
});

GRAMMAR.push({
  id:"too_enough", lvl:"A2", title:"Too и enough — слишком и достаточно", en:"too / enough", icon:"🌡️", tag:"прилагательные", timeline:null,
  rule:`<table><tr><th>too</th><th>enough</th></tr>
<tr><td><b>слишком</b> (плохо, чересчур) — стоит <b>перед</b> прилагательным</td><td><b>достаточно</b> — стоит <b>после</b> прилагательного, но <b>перед</b> существительным</td></tr>
<tr><td>This coffee is <b>too hot</b>. It's <b>too expensive</b>.</td><td>The room is <b>big enough</b>. We have <b>enough money</b>.</td></tr>
<tr><td><b>too much</b> sugar, <b>too many</b> people</td><td><b>not</b> old <b>enough</b> — недостаточно взрослый</td></tr></table>
<p><span class=ex>It's <b>too</b> cold to swim. He is <b>not</b> tall <b>enough</b> to play basketball. Is the water warm <b>enough</b>?</span></p>
<p>Не путай <b>too</b> (слишком) и <b>very</b> (очень): very hot — просто жарко; too hot — так жарко, что плохо.</p>`,
  blocks:[["This coffee","is too","hot."],["The room","is big","enough."]],
  tips:["<span class=no>He is enough tall</span> → He is tall <b>enough</b>.","<span class=no>enough big room</span> → a big <b>enough</b> room / <b>enough</b> space."],
  ex:[{en:"This coffee is too hot.",ru:"Этот кофе слишком горячий."},{en:"The room is big enough.",ru:"Комната достаточно большая."},{en:"We don't have enough time.",ru:"У нас недостаточно времени."},{en:"He is not old enough to drive.",ru:"Он недостаточно взрослый, чтобы водить."},{en:"There are too many people here.",ru:"Здесь слишком много людей."}],
  drills:[
    {t:"choice",q:"This coffee is ___ hot. I can't drink it.",o:["too","enough","very"],a:"too"},
    {t:"choice",q:"He is not old ___ to drive.",o:["enough","too","very"],a:"enough"},
    {t:"choice",q:"We don't have ___ time.",o:["enough","too","many"],a:"enough"},
    {t:"choice",q:"There are ___ many people here.",o:["too","enough","very"],a:"too"},
    {t:"choice",q:"Is the water warm ___?",o:["enough","too","so"],a:"enough"},
    {t:"choice",q:"I ate ___ much cake.",o:["too","enough","very"],a:"too"},
    {t:"gap",q:"This bag is ___ heavy for me. (слишком)",a:["too"]},
    {t:"gap",q:"The room is big ___. (достаточно)",a:["enough"]},
    {t:"build",en:"The room is big enough.",ru:"Комната достаточно большая.",extra:["too"]},
    {t:"build",en:"It is too cold to swim.",ru:"Слишком холодно, чтобы купаться.",extra:["enough"]},
    {t:"tr",ru:"Это слишком дорого.",a:["It is too expensive.","It's too expensive.","This is too expensive."]},
    {t:"tr",ru:"У меня достаточно денег.",a:["I have enough money.","I've got enough money."]},
    {t:"err",q:"He is enough tall.",w:"enough tall",c:"tall enough",a:"He is tall enough."}
  ]
});

GRAMMAR.push({
  id:"the", lvl:"A2", title:"Артикль the: тот самый", en:"the vs a / an", icon:"🎯", tag:"артикли", timeline:null,
  rule:`<table><tr><th>a / an — один из многих</th><th>the — тот самый, конкретный</th></tr>
<tr><td>впервые упоминаем: I have <b>a</b> dog.</td><td>уже известно: <b>The</b> dog is black.</td></tr>
<tr><td>любой: Give me <b>a</b> pen.</td><td>единственный: <b>the</b> sun, <b>the</b> moon, <b>the</b> door (эта)</td></tr>
<tr><td></td><td>превосходная степень: <b>the</b> best</td></tr>
<tr><td></td><td>инструменты: play <b>the</b> piano; the cinema, the station, the centre</td></tr></table>
<p><b>Без артикля</b>:</p>
<ul><li>страны и города: Russia, Moscow (но <b>the</b> USA, <b>the</b> UK)</li>
<li>еда: have breakfast, lunch, dinner</li>
<li>языки, виды спорта: speak English, play football</li>
<li>готовые пары: at home, at work, to school, by bus, by car, on foot</li>
<li>вообще, в целом: I like music. Dogs are friendly.</li></ul>`,
  blocks:[["I have","a","dog."],["The","dog","is black."],["I go to work","by","bus."]],
  tips:["Первое упоминание — <b>a</b>, второе и дальше — <b>the</b>.","<span class=no>I like the music</span> (вообще) → I like music."],
  ex:[{en:"I have a dog. The dog is black.",ru:"У меня есть собака. Собака чёрная."},{en:"The sun is hot.",ru:"Солнце горячее."},{en:"He plays the piano.",ru:"Он играет на пианино."},{en:"We have breakfast at 8.",ru:"Мы завтракаем в 8."},{en:"She lives in Moscow.",ru:"Она живёт в Москве."},{en:"I go to work by bus.",ru:"Я езжу на работу на автобусе."}],
  drills:[
    {t:"choice",q:"I have a dog. ___ dog is black.",o:["The","A","—"],a:"The",why:"второе упоминание"},
    {t:"choice",q:"She lives in ___ Moscow.",o:["—","the","a"],a:"—"},
    {t:"choice",q:"___ sun is hot.",o:["The","A","—"],a:"The",why:"единственное в своём роде"},
    {t:"choice",q:"He plays ___ piano.",o:["the","a","—"],a:"the"},
    {t:"choice",q:"We have ___ breakfast at 8.",o:["—","the","a"],a:"—"},
    {t:"choice",q:"This is ___ best cafe in town.",o:["the","a","—"],a:"the"},
    {t:"choice",q:"They are from ___ USA.",o:["the","a","—"],a:"the"},
    {t:"choice",q:"I go to work ___ bus.",o:["by","by the","by a"],a:"by"},
    {t:"choice",q:"I like ___ music.",o:["—","the","a"],a:"—",why:"вообще, в целом"},
    {t:"gap",q:"Open ___ window, please. (это окно)",a:["the"]},
    {t:"gap",q:"I saw ___ man. The man was tall.",a:["a"]},
    {t:"tr",ru:"Солнце жёлтое.",a:["The sun is yellow."]},
    {t:"tr",ru:"Я играю в футбол.",a:["I play football."]},
    {t:"err",q:"I like the music.",w:"the",c:"",a:"I like music."}
  ]
});
