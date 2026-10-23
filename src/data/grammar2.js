/* Грамматика, часть 2 (юниты 15–28): предлоги, повелительное, местоимения-объекты,
   притяжательный 's, like + -ing, Present Continuous, исчисляемые, was/were, Past Simple. */

GRAMMAR.push({
  id:"prep_place", lvl:"A1", title:"Предлоги места: in, on, under…", en:"prepositions of place", icon:"📦", tag:"предлоги", timeline:null,
  rule:`<table><tr><th>Предлог</th><th>Значение</th><th>Пример</th></tr>
<tr><td><b>in</b></td><td>внутри 📦</td><td>in the box, in the kitchen, in Moscow</td></tr>
<tr><td><b>on</b></td><td>на поверхности 🧱</td><td>on the table, on the wall, on the floor</td></tr>
<tr><td><b>under</b></td><td>под ⬇️</td><td>under the bed</td></tr>
<tr><td><b>next to / near</b></td><td>рядом, около ↔️</td><td>next to the bank</td></tr>
<tr><td><b>behind</b></td><td>позади, за</td><td>behind the house</td></tr>
<tr><td><b>in front of</b></td><td>перед</td><td>in front of the cinema</td></tr>
<tr><td><b>between</b></td><td>между</td><td>between the shop and the cafe</td></tr>
<tr><td><b>opposite</b></td><td>напротив</td><td>opposite the station</td></tr>
<tr><td><b>at</b></td><td>в точке, «у»</td><td>at home, at work, at school, at the bus stop</td></tr></table>
<p>Запомни готовые пары: <b>at</b> home / work / school, <b>in</b> the kitchen / the car, <b>on</b> the bus / the left.</p>`,
  blocks:[["The cat","is","in the box."],["The keys","are","on the table."]],
  tips:["<span class=no>in home</span> → <b>at</b> home; <span class=no>in work</span> → <b>at</b> work.","<span class=no>in the table</span> (внутри стола?) → <b>on</b> the table."],
  ex:[{en:"The cat is in the box.",ru:"Кошка в коробке."},{en:"The keys are on the table.",ru:"Ключи на столе."},{en:"The ball is under the bed.",ru:"Мяч под кроватью."},{en:"The bank is next to the post office.",ru:"Банк рядом с почтой."},{en:"I am at home.",ru:"Я дома."},{en:"The shop is between the bank and the cafe.",ru:"Магазин между банком и кафе."}],
  drills:[
    {t:"choice",q:"Кошка в коробке. The cat is ___ the box.",o:["in","on","under"],a:"in"},
    {t:"choice",q:"Книга на столе. The book is ___ the table.",o:["on","in","at"],a:"on"},
    {t:"choice",q:"Мяч под кроватью. The ball is ___ the bed.",o:["under","on","behind"],a:"under"},
    {t:"choice",q:"Банк рядом с почтой. The bank is ___ the post office.",o:["next to","between","under"],a:"next to"},
    {t:"choice",q:"I am ___ home.",o:["at","in","on"],a:"at"},
    {t:"choice",q:"She lives ___ Moscow.",o:["in","at","on"],a:"in"},
    {t:"choice",q:"Машина перед домом. The car is ___ the house.",o:["in front of","behind","under"],a:"in front of"},
    {t:"gap",q:"The shop is ___ the bank and the cafe. (между)",a:["between"]},
    {t:"gap",q:"The picture is ___ the wall. (на)",a:["on"]},
    {t:"build",en:"The keys are on the table.",ru:"Ключи на столе.",extra:["in"]},
    {t:"build",en:"My bag is under the chair.",ru:"Моя сумка под стулом.",extra:["on"]},
    {t:"tr",ru:"Телефон в сумке.",a:["The phone is in the bag."]},
    {t:"tr",ru:"Он на работе.",a:["He is at work."]},
    {t:"err",q:"He is in work.",w:"in",c:"at",a:"He is at work."}
  ]
});

GRAMMAR.push({
  id:"prep_time", lvl:"A1", title:"Предлоги времени: at, in, on", en:"at / in / on (time)", icon:"⏰", tag:"предлоги", timeline:null,
  rule:`<p>Три предлога — три «размера» времени. Чем точнее момент, тем «меньше» предлог:</p>
<table><tr><th>Предлог</th><th>С чем</th><th>Примеры</th></tr>
<tr><td><b>at</b> — точка ⏰</td><td>время на часах, night, the weekend</td><td>at 7 o'clock, at noon, at night, at the weekend</td></tr>
<tr><td><b>on</b> — день 📅</td><td>дни недели, даты</td><td>on Monday, on 5 May, on my birthday, on Sundays</td></tr>
<tr><td><b>in</b> — период 🗓️</td><td>месяцы, годы, сезоны, части дня</td><td>in May, in 2020, in winter, in the morning, in the evening</td></tr></table>
<p><b>Без предлога</b>: today, tomorrow, yesterday, every day, next week, last year, this morning.</p>`,
  blocks:[["I get up","at","7 o'clock."],["We meet","on","Monday."],["It's cold","in","winter."]],
  tips:["<b>in</b> the morning, но <b>at</b> night.","<span class=no>on next week</span> → next week (без предлога)."],
  ex:[{en:"I get up at 7 o'clock.",ru:"Я встаю в 7 часов."},{en:"We have English on Monday.",ru:"У нас английский в понедельник."},{en:"My birthday is in May.",ru:"Мой день рождения в мае."},{en:"She works in the morning.",ru:"Она работает по утрам."},{en:"I sleep at night.",ru:"Ночью я сплю."},{en:"See you tomorrow.",ru:"Увидимся завтра."}],
  drills:[
    {t:"choice",q:"I get up ___ 7 o'clock.",o:["at","in","on"],a:"at"},
    {t:"choice",q:"My birthday is ___ May.",o:["in","at","on"],a:"in"},
    {t:"choice",q:"We have English ___ Monday.",o:["on","in","at"],a:"on"},
    {t:"choice",q:"She works ___ the morning.",o:["in","at","on"],a:"in"},
    {t:"choice",q:"I sleep ___ night.",o:["at","in","on"],a:"at"},
    {t:"choice",q:"He was born ___ 1990.",o:["in","at","on"],a:"in"},
    {t:"choice",q:"See you ___ Friday.",o:["on","in","at"],a:"on"},
    {t:"choice",q:"I have a lesson ___ tomorrow.",o:["—","at","on"],a:"—",why:"tomorrow — без предлога"},
    {t:"gap",q:"The shop opens ___ 9 a.m.",a:["at"]},
    {t:"gap",q:"It is very cold ___ winter.",a:["in"]},
    {t:"tr",ru:"Увидимся в понедельник.",a:["See you on Monday."]},
    {t:"tr",ru:"Я работаю по вечерам.",a:["I work in the evening.","I work in the evenings."]},
    {t:"err",q:"The party is in Saturday.",w:"in",c:"on",a:"The party is on Saturday."}
  ]
});

GRAMMAR.push({
  id:"imper", lvl:"A1", title:"Просьбы и команды: Open! Don't! Let's!", en:"imperative, let's", icon:"📣", tag:"глагол", timeline:null,
  rule:`<p><b>Команда или просьба</b> — просто глагол без подлежащего: <span class=ex><b class=v>Open</b> the door. <b class=v>Sit</b> down, please.</span></p>
<p><b>Запрет</b> — <b>Don't</b> + глагол: <span class=ex><b class=v>Don't open</b> the window. <b class=v>Don't be</b> late.</span></p>
<p><b>Давай(те)</b> — <b>Let's</b> + глагол: <span class=ex><b class=v>Let's go</b>! <b class=v>Let's have</b> a coffee.</span></p>
<p><b>Please</b> делает просьбу вежливой; ставится в начале или в конце: <span class=ex>Please help me. Help me, please.</span></p>`,
  blocks:[["Open","the door,","please."],["Don't","be","late."],["Let's","go","home."]],
  tips:["<span class=no>Not touch!</span> → <b>Don't</b> touch!","<span class=no>Let's to go</span> → Let's <b>go</b>."],
  ex:[{en:"Open the door, please.",ru:"Откройте дверь, пожалуйста."},{en:"Don't be late.",ru:"Не опаздывай."},{en:"Let's have a coffee.",ru:"Давай выпьем кофе."},{en:"Sit down, please.",ru:"Садитесь, пожалуйста."},{en:"Don't worry!",ru:"Не волнуйся!"}],
  drills:[
    {t:"choice",q:"___ the door, please.",o:["Close","Closes","Closing"],a:"Close"},
    {t:"choice",q:"___ worry!",o:["Don't","Not","Doesn't"],a:"Don't"},
    {t:"choice",q:"___ go to the park!",o:["Let's","Let","Lets"],a:"Let's"},
    {t:"choice",q:"Please ___ me your phone.",o:["give","gives","to give"],a:"give"},
    {t:"choice",q:"___ quiet, please. (будьте)",o:["Be","Are","Is"],a:"Be"},
    {t:"gap",q:"___ touch it! (запрет)",a:["Don't","Do not"]},
    {t:"build",en:"Don't be late.",ru:"Не опаздывай.",extra:["not"]},
    {t:"build",en:"Let's have a coffee.",ru:"Давай выпьем кофе.",extra:["go"]},
    {t:"tr",ru:"Садитесь, пожалуйста.",a:["Sit down, please.","Please sit down.","Please, sit down."]},
    {t:"tr",ru:"Не беги!",a:["Don't run!","Do not run!"]},
    {t:"tr",ru:"Давай пойдём домой.",a:["Let's go home."]},
    {t:"err",q:"Not touch it!",w:"Not",c:"Don't",a:"Don't touch it!"}
  ]
});

GRAMMAR.push({
  id:"obj_pron", lvl:"A1", title:"Me, him, her, them — кого? кому?", en:"object pronouns", icon:"🎯", tag:"местоимения", timeline:null,
  rule:`<p>Когда местоимение стоит <b>после глагола или предлога</b> (кого? кому? с кем?), оно меняет форму:</p>
<table><tr><th>Кто</th><th>Кого / кому</th><th>Пример</th></tr>
<tr><td>I</td><td><b>me</b></td><td>Call <b>me</b>. — Позвони мне.</td></tr>
<tr><td>you</td><td><b>you</b></td><td>I see <b>you</b>.</td></tr>
<tr><td>he</td><td><b>him</b></td><td>I know <b>him</b>.</td></tr>
<tr><td>she</td><td><b>her</b></td><td>Look at <b>her</b>.</td></tr>
<tr><td>it</td><td><b>it</b></td><td>I like <b>it</b>.</td></tr>
<tr><td>we</td><td><b>us</b></td><td>Help <b>us</b>!</td></tr>
<tr><td>they</td><td><b>them</b></td><td>Give it to <b>them</b>.</td></tr></table>
<p>Три ряда вместе: <b class=s>She</b> (она) — <b class=o>her</b> (её, ей) — <b>her</b> (её вещь): <span class=ex>She loves her dog. I love her.</span></p>`,
  blocks:[["I","like","her."],["Call","me","tomorrow."]],
  tips:["<span class=no>He likes she</span> → He likes <b>her</b>.","<span class=no>Me love you</span> → <b>I</b> love you (в начале — I)."],
  ex:[{en:"Call me tomorrow.",ru:"Позвони мне завтра."},{en:"I know him.",ru:"Я его знаю."},{en:"She loves him.",ru:"Она его любит."},{en:"Can you help us?",ru:"Можешь нам помочь?"},{en:"Give it to them.",ru:"Отдай это им."}],
  drills:[
    {t:"choice",q:"I like ___. (она)",o:["her","she","hers"],a:"her"},
    {t:"choice",q:"Call ___ tomorrow. (я)",o:["me","I","my"],a:"me"},
    {t:"choice",q:"Give it to ___. (они)",o:["them","they","their"],a:"them"},
    {t:"choice",q:"Do you know ___? (он)",o:["him","he","his"],a:"him"},
    {t:"choice",q:"Can you help ___? (мы)",o:["us","we","our"],a:"us"},
    {t:"choice",q:"___ loves ___. (он … её)",o:["He … her","Him … she","He … she"],a:"He … her"},
    {t:"gap",q:"This is my dog. I love ___.",a:["it","him","her"]},
    {t:"gap",q:"Where is Anna? I can't see ___.",a:["her"]},
    {t:"build",en:"She loves him.",ru:"Она его любит.",extra:["he"]},
    {t:"build",en:"Please call me tonight.",ru:"Пожалуйста, позвони мне вечером.",extra:["I"]},
    {t:"tr",ru:"Помоги мне!",a:["Help me!"]},
    {t:"tr",ru:"Я знаю их.",a:["I know them."]},
    {t:"err",q:"He likes she.",w:"she",c:"her",a:"He likes her."},
    {t:"err",q:"Me love you.",w:"Me",c:"I",a:"I love you."}
  ]
});

GRAMMAR.push({
  id:"poss_s", lvl:"A1", title:"Чей? Tom's, my mother's", en:"possessive 's", icon:"🔑", tag:"существительные", timeline:null,
  rule:`<p>Чтобы сказать «чья вещь», к <b>владельцу</b> добавляем <b>'s</b>: <span class=ex><b>Tom's</b> book — книга Тома; <b>my mother's</b> car — машина моей мамы.</span></p>
<table><tr><th>Случай</th><th>Форма</th><th>Пример</th></tr>
<tr><td>один владелец</td><td><b>'s</b></td><td>Anna's bag, the dog's bed</td></tr>
<tr><td>много владельцев (-s)</td><td><b>s'</b></td><td>my parents' house, the students' room</td></tr>
<tr><td>неправильное мн. число</td><td><b>'s</b></td><td>the children's room, men's shoes</td></tr></table>
<p>Порядок: сначала <b>кто</b>, потом <b>что</b> — наоборот русскому: «машина брата» → <b>my brother's car</b>.</p>
<p>Для предметов обычно <b>of</b>: the door <b>of</b> the car (или the car door).</p>`,
  blocks:[["This is","Tom's","car."],["My","parents'","house is big."]],
  tips:["<b>'s</b> — это ещё и <b>is</b>: Tom's a doctor = Tom is a doctor. Смотри на контекст.","<span class=no>the car of Tom</span> — понятно, но так не говорят: <b>Tom's car</b>."],
  ex:[{en:"This is Tom's car.",ru:"Это машина Тома."},{en:"My mother's name is Olga.",ru:"Мою маму зовут Ольга."},{en:"My parents' house is in the country.",ru:"Дом моих родителей за городом."},{en:"Whose phone is this? — It's Anna's.",ru:"Чей это телефон? — Анны."},{en:"The children's room is big.",ru:"Детская комната большая."}],
  drills:[
    {t:"choice",q:"This is ___ car.",o:["Tom's","Toms","Tom"],a:"Tom's"},
    {t:"choice",q:"My ___ name is Olga.",o:["mother's","mothers","mother"],a:"mother's"},
    {t:"choice",q:"The ___ room is big. (комната детей)",o:["children's","childrens'","childrens"],a:"children's"},
    {t:"choice",q:"My ___ house is in the country. (дом родителей)",o:["parents'","parent's","parents"],a:"parents'"},
    {t:"choice",q:"Как сказать «машина брата»?",o:["my brother's car","my car's brother","the car of brother"],a:"my brother's car"},
    {t:"gap",q:"Whose phone is this? — It's ___. (Anna)",a:["Anna's"]},
    {t:"gap",q:"This is my ___ bag. (sister)",a:["sister's"]},
    {t:"build",en:"This is my sister's bag.",ru:"Это сумка моей сестры.",extra:["sisters"]},
    {t:"tr",ru:"Это машина моего брата.",a:["This is my brother's car.","It is my brother's car.","It's my brother's car."]},
    {t:"tr",ru:"Собака Тома большая.",a:["Tom's dog is big."]},
    {t:"err",q:"This is Annas book.",w:"Annas",c:"Anna's",a:"This is Anna's book."}
  ]
});

GRAMMAR.push({
  id:"like_ing", lvl:"A1", title:"Like / love / hate + -ing", en:"like + -ing", icon:"❤️", tag:"глагол", timeline:null,
  rule:`<p>После <b>like, love, hate, enjoy, don't mind</b> действие ставим в форму <b>-ing</b>: <span class=ex>I like <b class=v>swimming</b>. She hates <b class=v>cooking</b>.</span></p>
<p>Как пишем <b>-ing</b>:</p>
<table><tr><th>Правило</th><th>Примеры</th></tr>
<tr><td>обычно + ing</td><td>read → read<b>ing</b>, play → play<b>ing</b></td></tr>
<tr><td>немая -e уходит</td><td>mak<span class=no>e</span> → mak<b>ing</b>, danc<span class=no>e</span> → danc<b>ing</b></td></tr>
<tr><td>короткий слог: удваиваем согласную</td><td>swim → swi<b>mm</b>ing, run → ru<b>nn</b>ing, sit → si<b>tt</b>ing</td></tr></table>
<p>Шкала: <b>love</b> ❤️ → <b>like</b> 🙂 → <b>don't mind</b> 😐 → <b>don't like</b> 🙁 → <b>hate</b> 💔.</p>`,
  blocks:[["I","like","swimming."],["She","hates","getting up early."]],
  tips:["<span class=no>I like swim</span> → I like swim<b>ming</b>.","Не путай с «хотел бы»: I like coffee (вообще) / I'd like a coffee (сейчас)."],
  ex:[{en:"I like swimming.",ru:"Я люблю плавать."},{en:"She hates getting up early.",ru:"Она ненавидит рано вставать."},{en:"We love travelling.",ru:"Мы обожаем путешествовать."},{en:"He enjoys reading.",ru:"Ему нравится читать."},{en:"Do you like cooking?",ru:"Ты любишь готовить?"}],
  drills:[
    {t:"choice",q:"I love ___ to music.",o:["listening","listen","to listening"],a:"listening"},
    {t:"choice",q:"She hates ___ up early.",o:["getting","get","gets"],a:"getting"},
    {t:"choice",q:"Do you like ___?",o:["cooking","cook","cooks"],a:"cooking"},
    {t:"choice",q:"They enjoy ___ football.",o:["playing","play","to playing"],a:"playing"},
    {t:"gap",q:"He enjoys ___ (read).",a:["reading"]},
    {t:"gap",q:"We like ___ (swim).",a:["swimming"],hint:"удвой согласную"},
    {t:"gap",q:"They love ___ (dance).",a:["dancing"],hint:"убери e"},
    {t:"gap",q:"I hate ___ (run).",a:["running"],hint:"удвой согласную"},
    {t:"build",en:"I like playing football.",ru:"Я люблю играть в футбол.",extra:["play"]},
    {t:"build",en:"She doesn't like cooking.",ru:"Она не любит готовить.",extra:["cook"]},
    {t:"tr",ru:"Я люблю готовить.",a:["I like cooking.","I love cooking."]},
    {t:"tr",ru:"Он ненавидит ждать.",a:["He hates waiting."]},
    {t:"err",q:"She likes swim.",w:"swim",c:"swimming",a:"She likes swimming."}
  ]
});

GRAMMAR.push({
  id:"pc", lvl:"A1", title:"Present Continuous: что происходит сейчас", en:"Present Continuous", icon:"🏃", tag:"Present Continuous", timeline:"now",
  rule:`<p><b>Present Continuous</b> — действие идёт <b>прямо сейчас</b>: <span class=ex>I <b class=v>am working</b>. Look! It <b class=v>is raining</b>.</span></p>
<p>Формула: <b class=s>кто</b> + <b class=v>am / is / are</b> + <b class=v>глагол-ing</b>.</p>
<table><tr><th>+</th><th>−</th><th>?</th></tr>
<tr><td>I <b>am</b> read<b>ing</b>.</td><td>I <b>am not</b> reading.</td><td><b>Am</b> I reading?</td></tr>
<tr><td>She <b>is</b> read<b>ing</b>.</td><td>She <b>isn't</b> reading.</td><td><b>Is</b> she reading?</td></tr>
<tr><td>They <b>are</b> read<b>ing</b>.</td><td>They <b>aren't</b> reading.</td><td><b>Are</b> they reading?</td></tr></table>
<p>Маркеры: <b>now, at the moment, Look!, Listen!, today, this week</b>.</p>
<p>Правописание -ing: sit → si<b>tt</b>ing, writ<span class=no>e</span> → writ<b>ing</b>, play → play<b>ing</b>.</p>`,
  blocks:[["I","am reading","a book."],["She","is cooking","dinner."],["Are","you","listening?"]],
  tips:["Нужны <b>обе</b> части: <span class=no>I working</span>, <span class=no>I am work</span> → I <b>am working</b>.","Вопрос — с am/is/are, без do: <span class=no>Do you reading?</span> → <b>Are</b> you reading?"],
  ex:[{en:"I am reading a book.",ru:"Я читаю книгу (сейчас)."},{en:"She is cooking dinner now.",ru:"Она сейчас готовит ужин."},{en:"Look! It is raining.",ru:"Смотри! Идёт дождь."},{en:"They are playing football.",ru:"Они играют в футбол."},{en:"What are you doing?",ru:"Что ты делаешь?"},{en:"The children are sleeping.",ru:"Дети спят."}],
  drills:[
    {t:"choice",q:"Look! It ___ raining.",o:["is","are","am"],a:"is"},
    {t:"choice",q:"They ___ playing football now.",o:["are","is","am"],a:"are"},
    {t:"choice",q:"I ___ reading a book at the moment.",o:["am","is","are"],a:"am"},
    {t:"choice",q:"She is ___ TV.",o:["watching","watch","watches"],a:"watching"},
    {t:"choice",q:"___ you listening to me?",o:["Are","Do","Is"],a:"Are"},
    {t:"choice",q:"He ___ sleeping. (не)",o:["isn't","doesn't","not"],a:"isn't"},
    {t:"gap",q:"He is ___ (sit) on the sofa.",a:["sitting"],hint:"удвой t"},
    {t:"gap",q:"We are ___ (write) a letter.",a:["writing"],hint:"убери e"},
    {t:"gap",q:"What ___ you doing?",a:["are"]},
    {t:"build",en:"She is cooking dinner now.",ru:"Она сейчас готовит ужин.",extra:["cooks"]},
    {t:"build",en:"What are you doing?",ru:"Что ты делаешь?",extra:["do"]},
    {t:"tr",ru:"Я сейчас работаю.",a:["I am working now.","I'm working now.","Now I am working."]},
    {t:"tr",ru:"Дети спят.",a:["The children are sleeping.","The kids are sleeping."]},
    {t:"err",q:"He is play football now.",w:"play",c:"playing",a:"He is playing football now."},
    {t:"err",q:"I working now.",w:"working",c:"am working",a:"I am working now."}
  ],
  gen:"pc"
});

GRAMMAR.push({
  id:"ps_vs_pc", lvl:"A1", title:"Обычно или сейчас? Simple против Continuous", en:"Present Simple vs Continuous", icon:"⚖️", tag:"Present Continuous", timeline:"both",
  rule:`<table><tr><th>Present Simple 🔁</th><th>Present Continuous ▶️</th></tr>
<tr><td><b>обычно, всегда, каждый день</b>; факты, привычки, расписания</td><td><b>сейчас, в данный момент</b>; временно, в процессе</td></tr>
<tr><td>I <b>drink</b> coffee every morning.</td><td>I <b>am drinking</b> coffee now.</td></tr>
<tr><td>She <b>works</b> in a bank.</td><td>She <b>is working</b> today.</td></tr>
<tr><td>always, usually, often, every day, on Mondays</td><td>now, at the moment, Look!, Listen!, today, this week</td></tr></table>
<p><b>Глаголы состояния</b> не бывают в Continuous: <b>like, love, hate, want, need, know, understand, believe, have</b> (владеть): <span class=ex>I <b>want</b> tea</span>, <span class=no>I am wanting tea</span>.</p>
<p>Сравни: <span class=ex>What <b>do</b> you <b>do</b>?</span> — Кем ты работаешь? / <span class=ex>What <b>are</b> you <b>doing</b>?</span> — Что ты сейчас делаешь?</p>`,
  blocks:[["I usually","drink","coffee."],["I","am drinking","tea now."]],
  tips:["Ищи маркер: every day → Simple; now / Look! → Continuous.","Хочу, знаю, люблю, понимаю — всегда Simple."],
  ex:[{en:"I usually drink coffee, but today I am drinking tea.",ru:"Обычно я пью кофе, но сегодня пью чай."},{en:"Be quiet! The baby is sleeping.",ru:"Тише! Ребёнок спит."},{en:"She studies English every day.",ru:"Она учит английский каждый день."},{en:"What do you do? — I'm a teacher.",ru:"Кем ты работаешь? — Я учитель."},{en:"What are you doing? — I'm cooking.",ru:"Что ты делаешь? — Готовлю."}],
  drills:[
    {t:"choice",q:"I usually ___ coffee.",o:["drink","am drinking"],a:"drink",why:"usually → Simple"},
    {t:"choice",q:"Be quiet! The baby ___.",o:["is sleeping","sleeps"],a:"is sleeping",why:"сейчас → Continuous"},
    {t:"choice",q:"She ___ English every day.",o:["studies","is studying"],a:"studies"},
    {t:"choice",q:"Look! He ___ to us.",o:["is coming","comes"],a:"is coming"},
    {t:"choice",q:"I ___ this song.",o:["like","am liking"],a:"like",why:"like — глагол состояния"},
    {t:"choice",q:"What ___ now?",o:["are you doing","do you do"],a:"are you doing"},
    {t:"choice",q:"What ___? — I'm a teacher.",o:["do you do","are you doing"],a:"do you do"},
    {t:"choice",q:"I ___ a new phone. (хочу)",o:["want","am wanting"],a:"want"},
    {t:"gap",q:"Listen! Someone ___ (sing).",a:["is singing"]},
    {t:"gap",q:"My father ___ (work) in a bank.",a:["works"]},
    {t:"gap",q:"We ___ (not / understand) this. (отрицание)",a:["don't understand","do not understand"]},
    {t:"tr",ru:"Сейчас идёт дождь.",a:["It is raining now.","It's raining now.","It is raining."]},
    {t:"tr",ru:"Я читаю каждый день.",a:["I read every day."]},
    {t:"err",q:"I am knowing him.",w:"am knowing",c:"know",a:"I know him."},
    {t:"err",q:"She is go to school every day.",w:"is go",c:"goes",a:"She goes to school every day."}
  ]
});

GRAMMAR.push({
  id:"count", lvl:"A2", title:"Считаем или нет? some / any", en:"countable & uncountable, some / any", icon:"🥛", tag:"существительные", timeline:null,
  rule:`<table><tr><th>Исчисляемые 🍎🍎</th><th>Неисчисляемые 🥛</th></tr>
<tr><td>можно посчитать: a book, two books, an egg</td><td>«масса»: water, bread, milk, money, sugar, rice, information, advice, furniture, news, hair, time, music</td></tr>
<tr><td>есть a/an и множественное число</td><td><b>нет</b> a/an, <b>нет</b> -s: <span class=no>a bread, two breads</span></td></tr>
<tr><td>How <b>many</b> apples?</td><td>How <b>much</b> water?</td></tr></table>
<p>Чтобы «посчитать» неисчисляемое, берём «упаковку»: <b>a cup of</b> tea, <b>a glass of</b> water, <b>a piece of</b> advice, <b>a slice of</b> bread.</p>
<p><b>some</b> — «немного, несколько» в утверждении и в предложении/просьбе: <span class=ex>I have <b>some</b> money. Would you like <b>some</b> tea?</span></p>
<p><b>any</b> — в отрицании и вопросе: <span class=ex>I don't have <b>any</b> money. Have you got <b>any</b> brothers?</span></p>`,
  blocks:[["I have","some","money."],["I don't have","any","money."],["Do you have","any","questions?"]],
  tips:["<span class=no>an information, advices, furnitures</span> — всегда единственное число.","Hair (волосы) — неисчисляемое: She has long hair (не <span class=no>hairs</span>)."],
  ex:[{en:"I need some money.",ru:"Мне нужны деньги."},{en:"There isn't any milk.",ru:"Молока нет."},{en:"Have you got any brothers?",ru:"У тебя есть братья?"},{en:"Would you like some tea?",ru:"Хочешь чаю?"},{en:"Can I have a glass of water?",ru:"Можно стакан воды?"}],
  drills:[
    {t:"choice",q:"I need ___ money.",o:["some","a","many"],a:"some"},
    {t:"choice",q:"There isn't ___ milk.",o:["any","some","a"],a:"any",why:"отрицание → any"},
    {t:"choice",q:"Have you got ___ brothers?",o:["any","some","a"],a:"any"},
    {t:"choice",q:"Would you like ___ tea? (предложение)",o:["some","any","a"],a:"some",why:"предложение → some"},
    {t:"choice",q:"She has ___ apple.",o:["an","some","any"],a:"an"},
    {t:"choice",q:"Что из этого НЕ считают?",o:["bread","apple","egg"],a:"bread"},
    {t:"choice",q:"Что из этого НЕ считают?",o:["money","coin","dollar"],a:"money"},
    {t:"choice",q:"Can I have a ___ of water?",o:["glass","piece","slice"],a:"glass"},
    {t:"gap",q:"Can I have ___ water, please? (немного)",a:["some"]},
    {t:"gap",q:"We haven't got ___ sugar. (отрицание)",a:["any"]},
    {t:"tr",ru:"У нас нет сахара.",a:["We don't have any sugar.","We haven't got any sugar.","We do not have any sugar.","We have no sugar."]},
    {t:"tr",ru:"Хочешь кофе?",a:["Would you like some coffee?","Would you like a coffee?","Do you want some coffee?"]},
    {t:"err",q:"I have a bread.",w:"a",c:"some",a:"I have some bread."},
    {t:"err",q:"Give me an advice.",w:"an",c:"some",a:"Give me some advice."}
  ]
});

GRAMMAR.push({
  id:"much_many", lvl:"A2", title:"Сколько? much, many, a lot of, a few, a little", en:"much / many / a lot of", icon:"🔢", tag:"существительные", timeline:null,
  rule:`<table><tr><th></th><th>Исчисляемые 🍎🍎</th><th>Неисчисляемые 🥛</th></tr>
<tr><th>сколько?</th><td>How <b>many</b> books?</td><td>How <b>much</b> water? How <b>much</b> is it?</td></tr>
<tr><th>много (+)</th><td><b>a lot of</b> / lots of books</td><td><b>a lot of</b> / lots of water</td></tr>
<tr><th>много (−, ?)</th><td>not <b>many</b> books</td><td>not <b>much</b> time</td></tr>
<tr><th>немного</th><td><b>a few</b> friends</td><td><b>a little</b> milk</td></tr></table>
<p>Простое правило: в утверждении говори <b>a lot of</b> — подходит ко всему. <b>Much / many</b> — в вопросах и отрицаниях.</p>
<p><b>How much is it?</b> — Сколько стоит? (самый нужный вопрос в магазине).</p>`,
  blocks:[["How many","friends","have you got?"],["How much","money","do you need?"],["I have","a lot of","work."]],
  tips:["<span class=no>How much books?</span> → How <b>many</b> books?","<span class=no>I have much money</span> — в утверждении лучше <b>a lot of</b> money."],
  ex:[{en:"How many brothers have you got?",ru:"Сколько у тебя братьев?"},{en:"How much is it?",ru:"Сколько это стоит?"},{en:"I don't have much time.",ru:"У меня мало времени."},{en:"There are a lot of people here.",ru:"Здесь много людей."},{en:"I have a few friends in London.",ru:"У меня есть несколько друзей в Лондоне."},{en:"There is a little milk in the fridge.",ru:"В холодильнике есть немного молока."}],
  drills:[
    {t:"choice",q:"How ___ sugar do you want?",o:["much","many"],a:"much"},
    {t:"choice",q:"How ___ friends have you got?",o:["many","much"],a:"many"},
    {t:"choice",q:"I don't have ___ time.",o:["much","many"],a:"much"},
    {t:"choice",q:"There are ___ cars in the street.",o:["a lot of","much","a little"],a:"a lot of"},
    {t:"choice",q:"I have ___ friends here. (немного)",o:["a few","a little","much"],a:"a few"},
    {t:"choice",q:"There is ___ milk. (немного)",o:["a little","a few","many"],a:"a little"},
    {t:"choice",q:"How ___ is this bag?",o:["much","many"],a:"much"},
    {t:"choice",q:"We don't have ___ eggs.",o:["many","much"],a:"many"},
    {t:"gap",q:"How ___ people are there?",a:["many"]},
    {t:"gap",q:"How ___ does it cost?",a:["much"]},
    {t:"build",en:"How many people are there?",ru:"Сколько там людей?",extra:["much"]},
    {t:"tr",ru:"Сколько это стоит?",a:["How much is it?","How much is this?","How much does it cost?"]},
    {t:"tr",ru:"У меня много работы.",a:["I have a lot of work.","I have lots of work.","I've got a lot of work."]},
    {t:"err",q:"How much books do you have?",w:"much",c:"many",a:"How many books do you have?"}
  ]
});

GRAMMAR.push({
  id:"was_were", lvl:"A2", title:"Was / were — был, была, были", en:"was / were", icon:"🕰️", tag:"Past Simple", timeline:"past",
  rule:`<p>Глагол to be в прошлом имеет две формы:</p>
<table><tr><th>Кто</th><th>+</th><th>−</th><th>?</th></tr>
<tr><td>I / he / she / it</td><td><b>was</b></td><td>wasn't</td><td><b>Was</b> she…?</td></tr>
<tr><td>we / you / they</td><td><b>were</b></td><td>weren't</td><td><b>Were</b> you…?</td></tr></table>
<p><span class=ex>I <b class=v>was</b> at home yesterday. They <b class=v>were</b> at school. <b class=v>Was</b> it cold? — Yes, it was.</span></p>
<p>Маркеры прошлого: <b>yesterday, last week / year / night, in 2010, two days ago, then</b>.</p>
<p><b>There was / there were</b>: <span class=ex>There was a cafe here. There were a lot of people.</span></p>`,
  blocks:[["I","was","at home yesterday."],["They","were","at school."],["Was","it","cold?"]],
  tips:["<b>You</b> — всегда were, даже если один: <span class=no>you was</span> → you <b>were</b>.","Два дня <b>назад</b> — two days <b>ago</b> (ago стоит в конце)."],
  ex:[{en:"I was at home yesterday.",ru:"Вчера я был дома."},{en:"They were at school.",ru:"Они были в школе."},{en:"It was cold last night.",ru:"Прошлой ночью было холодно."},{en:"Were you at the party? — No, I wasn't.",ru:"Ты был на вечеринке? — Нет."},{en:"Where were you yesterday?",ru:"Где ты был вчера?"},{en:"There were a lot of people.",ru:"Там было много людей."}],
  drills:[
    {t:"choice",q:"I ___ at home yesterday.",o:["was","were"],a:"was"},
    {t:"choice",q:"They ___ at school.",o:["were","was"],a:"were"},
    {t:"choice",q:"She ___ not happy.",o:["was","were"],a:"was"},
    {t:"choice",q:"___ you at the party?",o:["Were","Was"],a:"Were"},
    {t:"choice",q:"It ___ cold last night.",o:["was","were","is"],a:"was"},
    {t:"choice",q:"We ___ in London last year.",o:["were","was","are"],a:"were"},
    {t:"choice",q:"Was he at work? — Yes, he ___.",o:["was","were","is"],a:"was"},
    {t:"gap",q:"Where ___ you yesterday?",a:["were"]},
    {t:"gap",q:"There ___ a lot of people.",a:["were"]},
    {t:"gap",q:"The film ___ very good. (было)",a:["was"]},
    {t:"build",en:"Was he at work yesterday?",ru:"Он был вчера на работе?",extra:["were"]},
    {t:"build",en:"We were very tired.",ru:"Мы очень устали.",extra:["was"]},
    {t:"tr",ru:"Вчера я устал.",a:["I was tired yesterday.","Yesterday I was tired."]},
    {t:"tr",ru:"Они были в кино.",a:["They were at the cinema.","They were in the cinema."]},
    {t:"err",q:"You was late.",w:"was",c:"were",a:"You were late."}
  ],
  gen:"was"
});

GRAMMAR.push({
  id:"past_reg", lvl:"A2", title:"Past Simple: правильные глаголы -ed", en:"Past Simple (regular)", icon:"📼", tag:"Past Simple", timeline:"past",
  rule:`<p>Прошедшее время <b>правильных</b> глаголов — просто <b>+ed</b>, одна форма для всех: <span class=ex>I <b class=v>worked</b>. She <b class=v>worked</b>. They <b class=v>worked</b>.</span></p>
<table><tr><th>Правило</th><th>Примеры</th></tr>
<tr><td>обычно + ed</td><td>work → work<b>ed</b>, play → play<b>ed</b>, want → want<b>ed</b></td></tr>
<tr><td>кончается на -e: + d</td><td>live → live<b>d</b>, like → like<b>d</b></td></tr>
<tr><td>согласная + y: y → ied</td><td>study → stud<b>ied</b>, try → tr<b>ied</b></td></tr>
<tr><td>короткий слог: удваиваем</td><td>stop → sto<b>pp</b>ed, plan → pla<b>nn</b>ed</td></tr></table>
<p>Произношение -ed: /t/ после глухих (work<b>ed</b>, stopp<b>ed</b>), /d/ после звонких (play<b>ed</b>, liv<b>ed</b>), /ɪd/ после t, d (want<b>ed</b>, need<b>ed</b>).</p>`,
  blocks:[["I","worked","a lot yesterday."],["She","lived","in Paris in 2010."]],
  tips:["Не добавляй -s в прошедшем: <span class=no>She workeds</span>.","Маркер прошлого обязателен по смыслу: yesterday, last week, ago, in 2010."],
  ex:[{en:"I worked a lot yesterday.",ru:"Вчера я много работал."},{en:"She lived in Paris in 2010.",ru:"В 2010 году она жила в Париже."},{en:"We played tennis last week.",ru:"На прошлой неделе мы играли в теннис."},{en:"He stopped the car.",ru:"Он остановил машину."},{en:"They studied English at school.",ru:"Они учили английский в школе."}],
  drills:[
    {t:"gap",q:"Yesterday I ___ (work) a lot.",a:["worked"]},
    {t:"gap",q:"She ___ (live) in Paris in 2010.",a:["lived"]},
    {t:"gap",q:"We ___ (play) tennis last week.",a:["played"]},
    {t:"gap",q:"He ___ (stop) the car.",a:["stopped"],hint:"удвой p"},
    {t:"gap",q:"They ___ (study) English at school.",a:["studied"],hint:"y → ied"},
    {t:"gap",q:"I ___ (watch) a film last night.",a:["watched"]},
    {t:"gap",q:"She ___ (want) a new phone.",a:["wanted"]},
    {t:"gap",q:"We ___ (visit) our grandmother on Sunday.",a:["visited"]},
    {t:"choice",q:"Last summer we ___ in Italy.",o:["stayed","stay","stays"],a:"stayed"},
    {t:"choice",q:"Как читается -ed в «wanted»?",o:["/ɪd/","/t/","/d/"],a:"/ɪd/",why:"после t и d — /ɪd/"},
    {t:"build",en:"I visited my grandmother last Sunday.",ru:"В прошлое воскресенье я навестил бабушку.",extra:["visit"]},
    {t:"tr",ru:"Мы вчера смотрели телевизор.",a:["We watched TV yesterday.","Yesterday we watched TV."]},
    {t:"tr",ru:"Он жил в Лондоне.",a:["He lived in London."]},
    {t:"err",q:"He plaied football.",w:"plaied",c:"played",a:"He played football."}
  ]
});

GRAMMAR.push({
  id:"past_irr", lvl:"A2", title:"Past Simple: неправильные глаголы", en:"Past Simple (irregular)", icon:"🧩", tag:"Past Simple", timeline:"past",
  rule:`<p>Самые частые глаголы — <b>неправильные</b>: у них своя форма прошедшего, которую нужно просто запомнить. Хорошая новость: форма одна для всех лиц.</p>
<table><tr><th>Глагол</th><th>Past</th><th></th><th>Глагол</th><th>Past</th></tr>
<tr><td>go — идти</td><td><b>went</b></td><td></td><td>see — видеть</td><td><b>saw</b></td></tr>
<tr><td>have — иметь</td><td><b>had</b></td><td></td><td>come — приходить</td><td><b>came</b></td></tr>
<tr><td>do — делать</td><td><b>did</b></td><td></td><td>get — получать</td><td><b>got</b></td></tr>
<tr><td>make — делать</td><td><b>made</b></td><td></td><td>take — брать</td><td><b>took</b></td></tr>
<tr><td>say — сказать</td><td><b>said</b></td><td></td><td>know — знать</td><td><b>knew</b></td></tr>
<tr><td>buy — покупать</td><td><b>bought</b></td><td></td><td>think — думать</td><td><b>thought</b></td></tr>
<tr><td>eat — есть</td><td><b>ate</b></td><td></td><td>drink — пить</td><td><b>drank</b></td></tr>
<tr><td>write — писать</td><td><b>wrote</b></td><td></td><td>read — читать</td><td><b>read</b> [red]</td></tr>
<tr><td>give — давать</td><td><b>gave</b></td><td></td><td>find — находить</td><td><b>found</b></td></tr>
<tr><td>meet — встречать</td><td><b>met</b></td><td></td><td>sleep — спать</td><td><b>slept</b></td></tr>
<tr><td>tell — рассказать</td><td><b>told</b></td><td></td><td>speak — говорить</td><td><b>spoke</b></td></tr>
<tr><td>sit — сидеть</td><td><b>sat</b></td><td></td><td>leave — уходить</td><td><b>left</b></td></tr>
<tr><td>put — класть</td><td><b>put</b></td><td></td><td>feel — чувствовать</td><td><b>felt</b></td></tr>
<tr><td>run — бежать</td><td><b>ran</b></td><td></td><td>begin — начинать</td><td><b>began</b></td></tr></table>
<p>Учи группами по созвучию: <b>bought, thought, brought, taught</b>; <b>met, slept, left, felt</b>; <b>came, gave, ate</b>.</p>`,
  blocks:[["I","went","to the cinema."],["She","bought","a new car."]],
  tips:["<span class=no>goed, buyed, eated</span> — нет таких слов.","Read в прошедшем пишется так же, но читается [red]."],
  ex:[{en:"I went to the cinema yesterday.",ru:"Вчера я ходил в кино."},{en:"She bought a new car.",ru:"Она купила новую машину."},{en:"We had breakfast at 8.",ru:"Мы позавтракали в 8."},{en:"He saw a good film.",ru:"Он посмотрел хороший фильм."},{en:"They ate pizza.",ru:"Они ели пиццу."},{en:"I got up late.",ru:"Я встал поздно."}],
  drills:[
    {t:"gap",q:"Yesterday I ___ (go) to the cinema.",a:["went"]},
    {t:"gap",q:"She ___ (have) breakfast at 8.",a:["had"]},
    {t:"gap",q:"We ___ (see) a good film.",a:["saw"]},
    {t:"gap",q:"He ___ (buy) a new car.",a:["bought"]},
    {t:"gap",q:"They ___ (eat) pizza.",a:["ate"]},
    {t:"gap",q:"I ___ (get) up late.",a:["got"]},
    {t:"gap",q:"Tom ___ (write) a letter.",a:["wrote"]},
    {t:"gap",q:"We ___ (meet) at the station.",a:["met"]},
    {t:"gap",q:"She ___ (take) a taxi.",a:["took"]},
    {t:"gap",q:"I ___ (drink) a cup of coffee.",a:["drank"]},
    {t:"gap",q:"He ___ (come) home at 10.",a:["came"]},
    {t:"gap",q:"They ___ (make) a cake.",a:["made"]},
    {t:"choice",q:"Last night I ___ very well.",o:["slept","sleeped","sleep"],a:"slept"},
    {t:"choice",q:"She ___ me the truth.",o:["told","telled","tell"],a:"told"},
    {t:"build",en:"We went to the park yesterday.",ru:"Вчера мы ходили в парк.",extra:["go"]},
    {t:"tr",ru:"Она купила хлеб.",a:["She bought bread.","She bought some bread."]},
    {t:"tr",ru:"Я видел его вчера.",a:["I saw him yesterday.","Yesterday I saw him."]},
    {t:"err",q:"I goed home.",w:"goed",c:"went",a:"I went home."}
  ],
  gen:"past"
});

GRAMMAR.push({
  id:"past_neg_q", lvl:"A2", title:"Past Simple: didn't и Did…?", en:"Past Simple (−, ?)", icon:"⏪", tag:"Past Simple", timeline:"past",
  rule:`<p>В отрицании и вопросе помощник <b>did</b> берёт прошедшее время на себя, а глагол возвращается в <b>начальную форму</b>:</p>
<table><tr><th>+</th><th>−</th><th>?</th></tr>
<tr><td>I <b>went</b> home.</td><td>I <b>didn't go</b> home.</td><td><b>Did</b> you <b>go</b> home?</td></tr>
<tr><td>She <b>bought</b> bread.</td><td>She <b>didn't buy</b> bread.</td><td><b>Did</b> she <b>buy</b> bread?</td></tr></table>
<p>Краткие ответы: <span class=ex>Yes, I <b>did</b>. / No, I <b>didn't</b>.</span> С вопросительным словом: <span class=ex><b>Where did</b> you go? <b>What did</b> she say?</span></p>
<p>Для was/were помощник не нужен: <span class=ex>I <b>wasn't</b> there. <b>Were</b> you at home?</span></p>`,
  blocks:[["I","didn't go","home."],["Did","you","see him?"],["Where","did you","go?"]],
  tips:["<span class=no>Did she went?</span> → Did she <b>go</b>? Прошедшее время — только в одном месте.","<span class=no>I didn't went</span> → I didn't <b>go</b>."],
  ex:[{en:"I didn't see him yesterday.",ru:"Я не видел его вчера."},{en:"Did you go to the party?",ru:"Ты ходил на вечеринку?"},{en:"She didn't like the film.",ru:"Ей не понравился фильм."},{en:"Where did they live in 2010?",ru:"Где они жили в 2010-м?"},{en:"Did you sleep well? — Yes, I did.",ru:"Ты хорошо спал? — Да."}],
  drills:[
    {t:"choice",q:"I ___ see him yesterday.",o:["didn't","don't","wasn't"],a:"didn't"},
    {t:"choice",q:"___ you go to the party?",o:["Did","Do","Were"],a:"Did"},
    {t:"choice",q:"She didn't ___ the film.",o:["like","liked","likes"],a:"like",why:"после didn't — начальная форма"},
    {t:"choice",q:"Where ___ they live in 2010?",o:["did","do","were"],a:"did"},
    {t:"choice",q:"Did you sleep well? — Yes, I ___.",o:["did","do","was"],a:"did"},
    {t:"choice",q:"Did he call? — No, he ___.",o:["didn't","doesn't","wasn't"],a:"didn't"},
    {t:"choice",q:"___ you at home yesterday?",o:["Were","Did","Was"],a:"Were",why:"с to be помощник did не нужен"},
    {t:"gap",q:"What time ___ you get up?",a:["did"]},
    {t:"gap",q:"We ___ go out last night. (отрицание)",a:["didn't","did not"]},
    {t:"gap",q:"Did she ___ (buy) a new dress?",a:["buy"]},
    {t:"build",en:"Did you have a good weekend?",ru:"Хорошо провёл выходные?",extra:["had"]},
    {t:"build",en:"I didn't understand the question.",ru:"Я не понял вопрос.",extra:["understood"]},
    {t:"tr",ru:"Ты видел его?",a:["Did you see him?"]},
    {t:"tr",ru:"Я вчера не работал.",a:["I didn't work yesterday.","I did not work yesterday.","Yesterday I didn't work."]},
    {t:"err",q:"Did she went home?",w:"went",c:"go",a:"Did she go home?"},
    {t:"err",q:"He didn't came.",w:"came",c:"come",a:"He didn't come."}
  ],
  gen:"past_q"
});
