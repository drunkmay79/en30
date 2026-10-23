/* Грамматика A1, часть 1 (юниты 1–14). Схема юнита:
   id, lvl, title, en, icon, tag, rule(HTML), blocks [[подлежащее, глагол, остальное]...],
   timeline, tips[], ex[{en,ru}], drills[{t:..}]
   Типы drills: choice{q,o,a,why}, gap{q,a[],hint}, build{en,ru,extra[]}, tr{ru,a[]}, err{q,w,c,a} */
const GRAMMAR = [];

GRAMMAR.push({
  id:"be_aff", lvl:"A1", title:"Глагол to be: am / is / are", en:"to be (+)", icon:"🧍", tag:"to be", timeline:null,
  rule:`<p>Глагол <b>to be</b> («быть») — самый частый глагол английского. По-русски мы его не произносим («Я студент»), по-английски он <b>обязателен</b>: <span class=ex>I <b class=v>am</b> a student.</span></p>
<table><tr><th>Кто</th><th>Форма</th><th>Кратко</th></tr>
<tr><td>I</td><td><b class=v>am</b></td><td>I'm</td></tr>
<tr><td>he / she / it</td><td><b class=v>is</b></td><td>he's, she's, it's</td></tr>
<tr><td>we / you / they</td><td><b class=v>are</b></td><td>we're, you're, they're</td></tr></table>
<p>Картинка для памяти: <b>I → am</b>; <b>один человек или предмет → is</b>; <b>много (и всегда you) → are</b>.</p>`,
  blocks:[["I","am","a student"],["She","is","my friend"],["We","are","from Russia"]],
  tips:["«You» всегда с <b>are</b>, даже если это один человек.","Не пропускай to be: <span class=no>She happy</span> → She <b>is</b> happy."],
  ex:[{en:"I am a student.",ru:"Я студент."},{en:"She is my friend.",ru:"Она моя подруга."},{en:"We are from Russia.",ru:"Мы из России."},{en:"It is cold today.",ru:"Сегодня холодно."},{en:"They are at home.",ru:"Они дома."},{en:"You are late.",ru:"Ты опоздал."}],
  drills:[
    {t:"choice",q:"I ___ a teacher.",o:["am","is","are"],a:"am",why:"I → am"},
    {t:"choice",q:"She ___ my sister.",o:["am","is","are"],a:"is",why:"she → is"},
    {t:"choice",q:"We ___ friends.",o:["am","is","are"],a:"are",why:"we → are"},
    {t:"choice",q:"It ___ a big city.",o:["am","is","are"],a:"is",why:"it → is"},
    {t:"choice",q:"You ___ late.",o:["am","is","are"],a:"are",why:"you → всегда are"},
    {t:"gap",q:"My name ___ Anna.",a:["is"],hint:"my name = it"},
    {t:"gap",q:"Tom and I ___ students.",a:["are"],hint:"Tom and I = we"},
    {t:"build",en:"He is a doctor.",ru:"Он врач.",extra:["are"]},
    {t:"build",en:"They are at home.",ru:"Они дома.",extra:["is"]},
    {t:"tr",ru:"Я из Москвы.",a:["I am from Moscow."]},
    {t:"tr",ru:"Она учительница.",a:["She is a teacher."]},
    {t:"err",q:"We is happy.",w:"is",c:"are",a:"We are happy."},
    {t:"err",q:"I is tired.",w:"is",c:"am",a:"I am tired."}
  ],
  gen:"be"
});

GRAMMAR.push({
  id:"be_neg_q", lvl:"A1", title:"To be: отрицание и вопрос", en:"to be (−, ?)", icon:"❓", tag:"to be", timeline:null,
  rule:`<p><b>Отрицание</b> — добавляем <b>not</b> после глагола: <span class=ex>I am <b class=v>not</b> hungry. She is<b class=v>n't</b> here. We are<b class=v>n't</b> ready.</span></p>
<p><b>Вопрос</b> — меняем местами глагол и подлежащее: <span class=ex><b class=v>Are</b> <b class=s>you</b> a student? <b class=v>Is</b> <b class=s>she</b> at home?</span></p>
<table><tr><th>Вопрос</th><th>Да</th><th>Нет</th></tr>
<tr><td>Are you tired?</td><td>Yes, I am.</td><td>No, I'm not.</td></tr>
<tr><td>Is he a doctor?</td><td>Yes, he is.</td><td>No, he isn't.</td></tr>
<tr><td>Are they here?</td><td>Yes, they are.</td><td>No, they aren't.</td></tr></table>
<p>Краткие формы: <b>isn't</b> = is not, <b>aren't</b> = are not. Для «am not» краткой формы нет: <b>I'm not</b>.</p>`,
  blocks:[["She","is not","at home"],["Are","you","ready?"],["Is","he","a doctor?"]],
  tips:["В кратком ответе «Yes, I am» — без сокращения. <span class=no>Yes, I'm</span>.","Вопрос начинается с глагола, не с «Do»: <span class=no>Do you are happy?</span> → <b>Are</b> you happy?"],
  ex:[{en:"I am not hungry.",ru:"Я не голоден."},{en:"She isn't at home.",ru:"Её нет дома."},{en:"Are you a student?",ru:"Ты студент?"},{en:"Is he from Spain?",ru:"Он из Испании?"},{en:"Yes, I am.",ru:"Да."},{en:"No, they aren't.",ru:"Нет."}],
  drills:[
    {t:"choice",q:"She ___ not at home.",o:["is","are","am"],a:"is"},
    {t:"choice",q:"___ you a student?",o:["Are","Is","Am"],a:"Are"},
    {t:"choice",q:"___ he from Spain?",o:["Is","Are","Am"],a:"Is"},
    {t:"choice",q:"Are you tired? — Yes, I ___.",o:["am","is","are"],a:"am"},
    {t:"choice",q:"Is it cold? — No, it ___.",o:["isn't","aren't","am not"],a:"isn't"},
    {t:"gap",q:"I ___ not hungry.",a:["am"],hint:"I → ?"},
    {t:"gap",q:"They ___ not at work.",a:["are"],hint:"they → ?"},
    {t:"build",en:"Is she your sister?",ru:"Она твоя сестра?",extra:["are"]},
    {t:"build",en:"We are not tired.",ru:"Мы не устали.",extra:["is"]},
    {t:"tr",ru:"Ты занят?",a:["Are you busy?"]},
    {t:"tr",ru:"Он не дома.",a:["He is not at home.","He isn't at home.","He's not at home."]},
    {t:"err",q:"Is they ready?",w:"Is",c:"Are",a:"Are they ready?"},
    {t:"err",q:"Do you are happy?",w:"Do",c:"Are",a:"Are you happy?"}
  ],
  gen:"be_q"
});

GRAMMAR.push({
  id:"pron", lvl:"A1", title:"Местоимения: I / my, he / his…", en:"pronouns & possessives", icon:"👤", tag:"местоимения", timeline:null,
  rule:`<p>Есть два ряда слов. Первый — <b class=s>кто делает</b> (подлежащее). Второй — <b class=o>чей</b> (стоит перед существительным).</p>
<table><tr><th>Кто</th><th>Чей</th><th>Пример</th></tr>
<tr><td>I — я</td><td>my — мой</td><td>I love <b>my</b> dog.</td></tr>
<tr><td>you — ты, вы</td><td>your — твой, ваш</td><td>Is this <b>your</b> bag?</td></tr>
<tr><td>he — он</td><td>his — его</td><td>He and <b>his</b> car.</td></tr>
<tr><td>she — она</td><td>her — её</td><td>She and <b>her</b> cat.</td></tr>
<tr><td>it — оно, он (предмет)</td><td>its — его, её</td><td>The city and <b>its</b> streets.</td></tr>
<tr><td>we — мы</td><td>our — наш</td><td>We love <b>our</b> city.</td></tr>
<tr><td>they — они</td><td>their — их</td><td>They and <b>their</b> kids.</td></tr></table>
<p>Внимание: <b>it's</b> = it is («это есть»), а <b>its</b> = «его/её» (о предмете или животном).</p>`,
  blocks:[["This is","my","phone."],["Her","name is","Anna."]],
  tips:["Слово «чей» (my, your…) всегда стоит <b>перед</b> существительным и само по себе не употребляется.","<span class=no>Me am a student</span> → <b>I</b> am a student."],
  ex:[{en:"This is my book.",ru:"Это моя книга."},{en:"Her name is Anna.",ru:"Её зовут Анна."},{en:"His car is red.",ru:"Его машина красная."},{en:"Our house is big.",ru:"Наш дом большой."},{en:"Their children are at school.",ru:"Их дети в школе."}],
  drills:[
    {t:"choice",q:"This is Anna. ___ name is Anna.",o:["Her","His","She"],a:"Her"},
    {t:"choice",q:"I have a dog. ___ name is Rex.",o:["Its","It's","His"],a:"Its",why:"its = его (о животном); it's = it is"},
    {t:"choice",q:"We love ___ city.",o:["our","we","us"],a:"our"},
    {t:"choice",q:"They are with ___ friends.",o:["their","they","them"],a:"their"},
    {t:"choice",q:"He is a doctor. ___ wife is a doctor too.",o:["His","Her","He"],a:"His"},
    {t:"choice",q:"___ are my friends.",o:["They","Their","Them"],a:"They"},
    {t:"gap",q:"This is Tom and this is ___ car.",a:["his"],hint:"Tom → чей?"},
    {t:"gap",q:"I am Olga and this is ___ brother.",a:["my"],hint:"I → чей?"},
    {t:"build",en:"Our house is big.",ru:"Наш дом большой.",extra:["we"]},
    {t:"tr",ru:"Это моя книга.",a:["This is my book.","It is my book."]},
    {t:"tr",ru:"Её зовут Мария.",a:["Her name is Maria."]},
    {t:"err",q:"Me am a student.",w:"Me",c:"I",a:"I am a student."},
    {t:"err",q:"This is she bag.",w:"she",c:"her",a:"This is her bag."}
  ]
});

GRAMMAR.push({
  id:"art", lvl:"A1", title:"Артикли a / an", en:"a / an", icon:"🍎", tag:"артикли", timeline:null,
  rule:`<p><b>a</b> или <b>an</b> ставим перед <b>одним</b> предметом, который можно сосчитать: <span class=ex>a book, a car, an apple</span>. По смыслу это «один, какой-то».</p>
<table><tr><th>a</th><th>an</th></tr>
<tr><td>перед согласным <b>звуком</b>: a cat, a house, a <b>u</b>niversity (звучит «ю»)</td><td>перед гласным <b>звуком</b>: an apple, an egg, an <b>h</b>our (h не читается)</td></tr></table>
<p>Нет артикля a/an: перед множественным числом (<span class=ex>books</span>) и перед тем, что не считают (<span class=ex>water, money</span>).</p>
<p>Профессии — всегда с артиклем: <span class=ex>She is <b>a</b> doctor. He is <b>an</b> engineer.</span></p>`,
  blocks:[["It is","a","car."],["She is","an","engineer."]],
  tips:["Смотри на <b>звук</b>, а не на букву: a <b>u</b>niversity, an <b>h</b>our.","Профессия без артикля — ошибка: <span class=no>I am teacher</span> → I am <b>a</b> teacher."],
  ex:[{en:"I have a cat.",ru:"У меня есть кот."},{en:"She is an engineer.",ru:"Она инженер."},{en:"It is an apple.",ru:"Это яблоко."},{en:"He is a good doctor.",ru:"Он хороший врач."},{en:"We have an hour.",ru:"У нас есть час."}],
  drills:[
    {t:"choice",q:"___ apple",o:["an","a","—"],a:"an"},
    {t:"choice",q:"___ car",o:["a","an","—"],a:"a"},
    {t:"choice",q:"___ orange",o:["an","a","—"],a:"an"},
    {t:"choice",q:"___ hour",o:["an","a","—"],a:"an",why:"h не читается: «ауэр»"},
    {t:"choice",q:"___ university",o:["a","an","—"],a:"a",why:"звучит «юнивёсити» — согласный звук"},
    {t:"choice",q:"___ books",o:["—","a","an"],a:"—",why:"множественное число — без a/an"},
    {t:"choice",q:"She is ___ engineer.",o:["an","a","—"],a:"an"},
    {t:"choice",q:"He is ___ good doctor.",o:["a","an","—"],a:"a"},
    {t:"gap",q:"I have ___ umbrella.",a:["an"],hint:"a или an?"},
    {t:"gap",q:"This is ___ old house.",a:["an"],hint:"old начинается с гласного звука"},
    {t:"tr",ru:"Это яблоко.",a:["It is an apple.","This is an apple."]},
    {t:"tr",ru:"Я учитель.",a:["I am a teacher."]},
    {t:"err",q:"She is a actress.",w:"a",c:"an",a:"She is an actress."},
    {t:"err",q:"He is engineer.",w:"engineer",c:"an engineer",a:"He is an engineer."}
  ],
  gen:"art"
});

GRAMMAR.push({
  id:"plural", lvl:"A1", title:"Множественное число", en:"plurals", icon:"🐈‍⬛", tag:"существительные", timeline:null,
  rule:`<p>Обычно просто <b>+s</b>: <span class=ex>cat → cats, book → books</span>. Но есть правила написания:</p>
<table><tr><th>Окончание</th><th>Правило</th><th>Примеры</th></tr>
<tr><td>-s, -sh, -ch, -x, -o</td><td>+ <b>es</b></td><td>bus → buses, box → boxes, watch → watches, tomato → tomatoes</td></tr>
<tr><td>согласная + y</td><td>y → <b>ies</b></td><td>city → cities, baby → babies (но boy → boys)</td></tr>
<tr><td>-f, -fe</td><td>→ <b>ves</b></td><td>knife → knives, leaf → leaves</td></tr></table>
<p><b>Исключения</b> (учим наизусть): man → <b>men</b>, woman → <b>women</b>, child → <b>children</b>, person → <b>people</b>, foot → <b>feet</b>, tooth → <b>teeth</b>, mouse → <b>mice</b>. Не меняются: sheep, fish.</p>`,
  blocks:[["one cat","→","two cats"],["one child","→","three children"]],
  tips:["<span class=no>childs, mans, peoples</span> — так не говорят.","После числа больше одного всегда множественное: two book<b>s</b>."],
  ex:[{en:"I have two cats.",ru:"У меня две кошки."},{en:"There are three boxes.",ru:"Там три коробки."},{en:"Many people live here.",ru:"Здесь живёт много людей."},{en:"The children are at school.",ru:"Дети в школе."},{en:"Big cities are noisy.",ru:"Большие города шумные."}],
  drills:[
    {t:"gap",q:"one cat → two ___",a:["cats"]},
    {t:"gap",q:"one box → three ___",a:["boxes"],hint:"-x → ?"},
    {t:"gap",q:"one city → two ___",a:["cities"],hint:"согласная + y"},
    {t:"gap",q:"one child → five ___",a:["children"],hint:"исключение"},
    {t:"gap",q:"one man → two ___",a:["men"],hint:"исключение"},
    {t:"gap",q:"one person → ten ___",a:["people"],hint:"исключение"},
    {t:"gap",q:"one watch → two ___",a:["watches"],hint:"-ch → ?"},
    {t:"gap",q:"one foot → two ___",a:["feet"],hint:"исключение"},
    {t:"gap",q:"one boy → two ___",a:["boys"],hint:"гласная + y"},
    {t:"gap",q:"one knife → two ___",a:["knives"],hint:"-fe → ?"},
    {t:"choice",q:"There are three ___ in the room.",o:["women","womans","womens"],a:"women"},
    {t:"choice",q:"I have two ___.",o:["children","childs","childrens"],a:"children"},
    {t:"err",q:"I have two childs.",w:"childs",c:"children",a:"I have two children."},
    {t:"err",q:"There are many citys in Russia.",w:"citys",c:"cities",a:"There are many cities in Russia."}
  ],
  gen:"plural"
});

GRAMMAR.push({
  id:"this_that", lvl:"A1", title:"This / that / these / those", en:"this, that, these, those", icon:"👉", tag:"указательные", timeline:null,
  rule:`<p>Четыре слова «это / то» различаются по двум осям: <b>близко или далеко</b> и <b>один или много</b>.</p>
<table><tr><th></th><th>один</th><th>много</th></tr>
<tr><th>близко 👉📦</th><td><b>this</b> — этот</td><td><b>these</b> — эти</td></tr>
<tr><th>далеко 👉 … 📦</th><td><b>that</b> — тот</td><td><b>those</b> — те</td></tr></table>
<p><span class=ex><b>This</b> is my phone</span> (в руке). <span class=ex><b>That</b> is my house</span> (вон там). <span class=ex><b>These</b> are my keys. <b>Those</b> people are my friends.</span></p>
<p>Звук: this — [ðɪs], короткое «и»; these — [ðiːz], долгое «ии».</p>`,
  blocks:[["This","is","my phone."],["Those","are","my friends."]],
  tips:["С this/that — <b>is</b>, с these/those — <b>are</b>.","«That» ещё значит «что» в сложных предложениях: I think <i>that</i> …, но это позже."],
  ex:[{en:"This is my phone.",ru:"Это мой телефон (в руке)."},{en:"That is my house.",ru:"Вон тот дом — мой."},{en:"These are my keys.",ru:"Это мои ключи (рядом)."},{en:"Those people are my friends.",ru:"Те люди — мои друзья."},{en:"Who is that man?",ru:"Кто тот мужчина?"}],
  drills:[
    {t:"choice",q:"___ is my phone. (в руке)",o:["This","These","Those"],a:"This"},
    {t:"choice",q:"___ are my keys. (в руке)",o:["These","This","That"],a:"These"},
    {t:"choice",q:"___ is my house. (вон там)",o:["That","This","These"],a:"That"},
    {t:"choice",q:"___ are my friends over there. (там)",o:["Those","These","That"],a:"Those"},
    {t:"choice",q:"Who is ___ man over there?",o:["that","this","these"],a:"that"},
    {t:"gap",q:"___ book here is good. (эта)",a:["This"]},
    {t:"gap",q:"___ shoes are mine. (вот эти)",a:["These"]},
    {t:"build",en:"These are my parents.",ru:"Это мои родители.",extra:["this"]},
    {t:"build",en:"That is my car.",ru:"Вон та машина — моя.",extra:["those"]},
    {t:"tr",ru:"Это мой брат. (рядом)",a:["This is my brother."]},
    {t:"tr",ru:"Те дома старые.",a:["Those houses are old."]},
    {t:"err",q:"This are my shoes.",w:"This",c:"These",a:"These are my shoes."}
  ]
});

GRAMMAR.push({
  id:"there_is", lvl:"A1", title:"There is / there are", en:"there is / are", icon:"🛋️", tag:"to be", timeline:null,
  rule:`<p>Когда говорим, что где-то <b>что-то есть</b>, по-английски начинаем с <b>there is / there are</b>: <span class=ex><b>There is</b> a cat on the sofa.</span> — На диване (есть) кошка.</p>
<table><tr><th>Форма</th><th>Когда</th><th>Пример</th></tr>
<tr><td>There <b>is</b></td><td>один предмет или то, что не считают</td><td>There is a bank here. There is some milk.</td></tr>
<tr><td>There <b>are</b></td><td>много</td><td>There are two cats.</td></tr>
<tr><td>There is<b>n't</b> / are<b>n't</b></td><td>нет</td><td>There aren't any shops.</td></tr>
<tr><td><b>Is</b> there…? / <b>Are</b> there…?</td><td>вопрос</td><td>Is there a cafe near here?</td></tr></table>
<p>Порядок: <b>there is</b> → <b class=o>что</b> → <b class=o>где</b>. Место — в конце.</p>`,
  blocks:[["There is","a cat","on the sofa."],["There are","two cats","in the garden."],["Is there","a bank","near here?"]],
  tips:["По-русски место часто стоит первым («В комнате есть окно»), по-английски — в конце: There is a window <b>in the room</b>.","Отвечаем кратко: Yes, there is. / No, there isn't."],
  ex:[{en:"There is a cat on the sofa.",ru:"На диване кошка."},{en:"There are two cats in the garden.",ru:"В саду две кошки."},{en:"There isn't a bank here.",ru:"Здесь нет банка."},{en:"Is there a cafe near here?",ru:"Здесь рядом есть кафе?"},{en:"There are five people in my family.",ru:"В моей семье пять человек."}],
  drills:[
    {t:"choice",q:"There ___ a book on the table.",o:["is","are"],a:"is"},
    {t:"choice",q:"There ___ two cats in the garden.",o:["are","is"],a:"are"},
    {t:"choice",q:"There ___ some milk in the fridge.",o:["is","are"],a:"is",why:"milk не считают → is"},
    {t:"choice",q:"___ there a bank near here?",o:["Is","Are"],a:"Is"},
    {t:"choice",q:"There ___ any chairs here.",o:["aren't","isn't"],a:"aren't"},
    {t:"gap",q:"There ___ five people in my family.",a:["are"]},
    {t:"gap",q:"Is there a shop? — Yes, there ___.",a:["is"]},
    {t:"build",en:"There is a cat on the sofa.",ru:"На диване кошка.",extra:["are"]},
    {t:"build",en:"Are there any shops here?",ru:"Здесь есть магазины?",extra:["is"]},
    {t:"tr",ru:"В комнате есть окно.",a:["There is a window in the room."]},
    {t:"tr",ru:"Здесь нет кафе.",a:["There isn't a cafe here.","There is not a cafe here.","There is no cafe here."]},
    {t:"err",q:"There are a dog here.",w:"are",c:"is",a:"There is a dog here."}
  ]
});

GRAMMAR.push({
  id:"have_got", lvl:"A1", title:"Have got / has got — «у меня есть»", en:"have got", icon:"🎒", tag:"have", timeline:null,
  rule:`<p>«У меня есть …» по-английски: <span class=ex>I <b class=v>have got</b> a car.</span> Кратко: <b>I've got</b>.</p>
<table><tr><th>Кто</th><th>+</th><th>−</th><th>?</th></tr>
<tr><td>I / you / we / they</td><td><b>have got</b> (I've got)</td><td>haven't got</td><td><b>Have</b> you got…?</td></tr>
<tr><td>he / she / it</td><td><b>has got</b> (she's got)</td><td>hasn't got</td><td><b>Has</b> she got…?</td></tr></table>
<p>Краткие ответы: <span class=ex>Yes, I have. / No, she hasn't.</span></p>
<p>В американском варианте чаще просто <b>have</b>: <span class=ex>I have a car. Do you have a car?</span> Оба варианта правильные.</p>`,
  blocks:[["I","have got","a brother."],["She","has got","two cats."],["Have","you got","a pen?"]],
  tips:["<b>she's got</b> = she <b>has</b> got (а не she is).","После he/she/it — <b>has</b>: <span class=no>She have got</span> → She <b>has</b> got."],
  ex:[{en:"I have got a brother.",ru:"У меня есть брат."},{en:"She has got two cats.",ru:"У неё две кошки."},{en:"We haven't got a car.",ru:"У нас нет машины."},{en:"Have you got a pen?",ru:"У тебя есть ручка?"},{en:"Has he got a dog? — Yes, he has.",ru:"У него есть собака? — Да."}],
  drills:[
    {t:"choice",q:"I ___ got a car.",o:["have","has"],a:"have"},
    {t:"choice",q:"She ___ got two brothers.",o:["has","have"],a:"has"},
    {t:"choice",q:"___ you got a pen?",o:["Have","Has","Do"],a:"Have"},
    {t:"choice",q:"He ___ got a dog.",o:["hasn't","haven't","isn't"],a:"hasn't"},
    {t:"choice",q:"Has she got a bike? — Yes, she ___.",o:["has","have","is"],a:"has"},
    {t:"gap",q:"We ___ got a big flat.",a:["have"]},
    {t:"gap",q:"My sister ___ got long hair.",a:["has"]},
    {t:"build",en:"Has she got a bike?",ru:"У неё есть велосипед?",extra:["have"]},
    {t:"build",en:"I have got two sisters.",ru:"У меня две сестры.",extra:["has"]},
    {t:"tr",ru:"У меня есть брат.",a:["I have got a brother.","I have a brother."]},
    {t:"tr",ru:"У него нет машины.",a:["He hasn't got a car.","He has not got a car.","He doesn't have a car.","He does not have a car."]},
    {t:"err",q:"They has got a cat.",w:"has",c:"have",a:"They have got a cat."}
  ]
});

GRAMMAR.push({
  id:"ps_aff", lvl:"A1", title:"Present Simple: что я делаю обычно", en:"Present Simple (+)", icon:"🔁", tag:"Present Simple", timeline:"habit",
  rule:`<p><b>Present Simple</b> — для привычек, фактов, расписаний: что бывает <b>обычно, всегда, каждый день</b>.</p>
<table><tr><th>Кто</th><th>Глагол</th><th>Пример</th></tr>
<tr><td>I / you / we / they</td><td>как в словаре</td><td>I <b class=v>work</b>. They <b class=v>live</b> here.</td></tr>
<tr><td>he / she / it</td><td>+ <b>s</b></td><td>She <b class=v>works</b>. He <b class=v>lives</b> here.</td></tr></table>
<p>Как пишем <b>-s</b>: watch → watch<b>es</b>, go → go<b>es</b>, study → stud<b>ies</b>, play → play<b>s</b>, have → <b>has</b>.</p>
<p>Слова-маркеры: <b>every day, usually, always, often, on Mondays</b>.</p>`,
  blocks:[["I","work","in a bank."],["She","works","in a bank."],["They","live","in Moscow."]],
  tips:["Главная ошибка — забыть <b>-s</b>: <span class=no>He play football</span> → He play<b>s</b> football.","«-s» только у <b>he / she / it</b> (и у «мама», «Том», «кот» — это тоже he/she/it)."],
  ex:[{en:"I work in a bank.",ru:"Я работаю в банке."},{en:"She works in a hospital.",ru:"Она работает в больнице."},{en:"We live in Moscow.",ru:"Мы живём в Москве."},{en:"He goes to work by car.",ru:"Он ездит на работу на машине."},{en:"The shop opens at 9.",ru:"Магазин открывается в 9."},{en:"My sister studies English.",ru:"Моя сестра учит английский."}],
  drills:[
    {t:"choice",q:"She ___ in a bank.",o:["works","work"],a:"works"},
    {t:"choice",q:"I ___ coffee every morning.",o:["drink","drinks"],a:"drink"},
    {t:"choice",q:"He ___ TV in the evening.",o:["watches","watch","watchs"],a:"watches"},
    {t:"choice",q:"My sister ___ English.",o:["studies","study","studys"],a:"studies"},
    {t:"choice",q:"They ___ in Moscow.",o:["live","lives"],a:"live"},
    {t:"choice",q:"Tom ___ a car.",o:["has","have","haves"],a:"has"},
    {t:"gap",q:"The shop ___ (open) at 9.",a:["opens"]},
    {t:"gap",q:"We ___ (go) to school by bus.",a:["go"]},
    {t:"gap",q:"She ___ (go) to work by car.",a:["goes"]},
    {t:"gap",q:"My father ___ (work) in a hospital.",a:["works"]},
    {t:"build",en:"My father works in a hospital.",ru:"Мой отец работает в больнице.",extra:["work"]},
    {t:"tr",ru:"Я живу в Москве.",a:["I live in Moscow."]},
    {t:"tr",ru:"Она любит кофе.",a:["She likes coffee.","She loves coffee."]},
    {t:"err",q:"He play football.",w:"play",c:"plays",a:"He plays football."},
    {t:"err",q:"My mother like tea.",w:"like",c:"likes",a:"My mother likes tea."}
  ],
  gen:"ps"
});

GRAMMAR.push({
  id:"ps_neg", lvl:"A1", title:"Present Simple: отрицание don't / doesn't", en:"Present Simple (−)", icon:"🚫", tag:"Present Simple", timeline:"habit",
  rule:`<p>Чтобы сказать «не делаю», нужен помощник <b>do not = don't</b> или <b>does not = doesn't</b>:</p>
<table><tr><th>Кто</th><th>Отрицание</th><th>Пример</th></tr>
<tr><td>I / you / we / they</td><td><b>don't</b> + глагол</td><td>I <b class=v>don't like</b> fish.</td></tr>
<tr><td>he / she / it</td><td><b>doesn't</b> + глагол</td><td>She <b class=v>doesn't like</b> fish.</td></tr></table>
<p>Важно: после <b>doesn't</b> глагол <b>без -s</b> — буква «s» уже «ушла» в does: <span class=ex>She doesn't <b>like</b></span>, <span class=no>She doesn't likes</span>.</p>`,
  blocks:[["I","don't like","fish."],["She","doesn't like","fish."]],
  tips:["<span class=no>I not like</span>, <span class=no>I no like</span> → I <b>don't</b> like.","С глаголом to be помощник не нужен: I am <b>not</b> tired (не <span class=no>I don't am</span>)."],
  ex:[{en:"I don't like fish.",ru:"Я не люблю рыбу."},{en:"She doesn't work on Sunday.",ru:"Она не работает в воскресенье."},{en:"We don't speak French.",ru:"Мы не говорим по-французски."},{en:"He doesn't eat meat.",ru:"Он не ест мясо."},{en:"I don't understand.",ru:"Я не понимаю."}],
  drills:[
    {t:"choice",q:"I ___ like fish.",o:["don't","doesn't","am not"],a:"don't"},
    {t:"choice",q:"He ___ work on Sunday.",o:["doesn't","don't","isn't"],a:"doesn't"},
    {t:"choice",q:"She doesn't ___ coffee.",o:["drink","drinks"],a:"drink",why:"после doesn't глагол без -s"},
    {t:"choice",q:"We ___ speak French.",o:["don't","doesn't","not"],a:"don't"},
    {t:"choice",q:"My brother ___ eat meat.",o:["doesn't","don't","not"],a:"doesn't"},
    {t:"gap",q:"They ___ live here. (отрицание)",a:["don't","do not"]},
    {t:"gap",q:"It ___ work. (отрицание)",a:["doesn't","does not"]},
    {t:"build",en:"She doesn't live here.",ru:"Она здесь не живёт.",extra:["don't"]},
    {t:"build",en:"I don't like cold weather.",ru:"Я не люблю холодную погоду.",extra:["doesn't"]},
    {t:"tr",ru:"Я не понимаю.",a:["I don't understand.","I do not understand."]},
    {t:"tr",ru:"Он не любит спорт.",a:["He doesn't like sport.","He does not like sport.","He doesn't like sports."]},
    {t:"err",q:"She doesn't likes tea.",w:"likes",c:"like",a:"She doesn't like tea."},
    {t:"err",q:"They doesn't work here.",w:"doesn't",c:"don't",a:"They don't work here."}
  ],
  gen:"ps_neg"
});

GRAMMAR.push({
  id:"ps_q", lvl:"A1", title:"Present Simple: вопрос Do / Does", en:"Present Simple (?)", icon:"🙋", tag:"Present Simple", timeline:"habit",
  rule:`<p>Вопрос начинаем с помощника <b>Do</b> или <b>Does</b>, глагол — без -s:</p>
<table><tr><th>Кто</th><th>Вопрос</th><th>Да / Нет</th></tr>
<tr><td>I / you / we / they</td><td><b>Do</b> you <b class=v>like</b> tea?</td><td>Yes, I <b>do</b>. / No, I <b>don't</b>.</td></tr>
<tr><td>he / she / it</td><td><b>Does</b> she <b class=v>like</b> tea?</td><td>Yes, she <b>does</b>. / No, she <b>doesn't</b>.</td></tr></table>
<p>С вопросительным словом: <span class=ex><b>Where</b> do you live? <b>What</b> does she do?</span></p>
<p>Порядок: <b class=o>Вопрос-слово</b> → <b class=v>do/does</b> → <b class=s>кто</b> → <b class=v>глагол</b> → остальное.</p>`,
  blocks:[["Do","you","like tea?"],["Does","she","work here?"],["Where","do you","live?"]],
  tips:["<span class=no>Does she likes?</span> → Does she <b>like</b>?","<span class=no>You like tea?</span> — без Do это не вопрос, а удивление."],
  ex:[{en:"Do you like pizza?",ru:"Ты любишь пиццу?"},{en:"Does she speak English?",ru:"Она говорит по-английски?"},{en:"Where do you live?",ru:"Где ты живёшь?"},{en:"What time does the film start?",ru:"Во сколько начинается фильм?"},{en:"Do you work here? — Yes, I do.",ru:"Ты здесь работаешь? — Да."}],
  drills:[
    {t:"choice",q:"___ you like pizza?",o:["Do","Does","Are"],a:"Do"},
    {t:"choice",q:"___ she speak English?",o:["Does","Do","Is"],a:"Does"},
    {t:"choice",q:"Does he ___ in Moscow?",o:["live","lives"],a:"live"},
    {t:"choice",q:"Where ___ they work?",o:["do","does","are"],a:"do"},
    {t:"choice",q:"Do you like tea? — Yes, I ___.",o:["do","does","am"],a:"do"},
    {t:"choice",q:"Does she work here? — No, she ___.",o:["doesn't","don't","isn't"],a:"doesn't"},
    {t:"gap",q:"What time ___ the film start?",a:["does"]},
    {t:"gap",q:"___ your parents live in Moscow?",a:["Do"]},
    {t:"build",en:"Do you speak English?",ru:"Ты говоришь по-английски?",extra:["does"]},
    {t:"build",en:"Where does she live?",ru:"Где она живёт?",extra:["do"]},
    {t:"tr",ru:"Ты любишь кофе?",a:["Do you like coffee?"]},
    {t:"tr",ru:"Он работает здесь?",a:["Does he work here?"]},
    {t:"err",q:"Does you live here?",w:"Does",c:"Do",a:"Do you live here?"},
    {t:"err",q:"Do she likes music?",w:"Do",c:"Does",a:"Does she like music?"}
  ],
  gen:"ps_q"
});

GRAMMAR.push({
  id:"wh", lvl:"A1", title:"Вопросительные слова", en:"question words", icon:"🔎", tag:"вопросы", timeline:null,
  rule:`<table><tr><th>Слово</th><th>Перевод</th><th>Пример</th></tr>
<tr><td><b>What</b></td><td>что, какой</td><td>What is your name?</td></tr>
<tr><td><b>Where</b></td><td>где, куда</td><td>Where do you live?</td></tr>
<tr><td><b>When</b></td><td>когда</td><td>When do you get up?</td></tr>
<tr><td><b>Who</b></td><td>кто</td><td>Who is she?</td></tr>
<tr><td><b>Why</b></td><td>почему</td><td>Why are you late?</td></tr>
<tr><td><b>How</b></td><td>как</td><td>How are you?</td></tr>
<tr><td><b>How old</b></td><td>сколько лет</td><td>How old are you?</td></tr>
<tr><td><b>How many / much</b></td><td>сколько</td><td>How many brothers have you got?</td></tr>
<tr><td><b>Which</b></td><td>который (из)</td><td>Which bus goes to the centre?</td></tr>
<tr><td><b>Whose</b></td><td>чей</td><td>Whose bag is this?</td></tr>
<tr><td><b>What time</b></td><td>во сколько</td><td>What time is it?</td></tr></table>
<p>Схема: <b class=o>Wh-слово</b> + <b class=v>is/are</b> или <b class=v>do/does</b> + <b class=s>кто</b> + …</p>`,
  blocks:[["What","is","your name?"],["Where","do you","live?"],["How old","are","you?"]],
  tips:["На «Why?» отвечаем с <b>Because</b>: Why are you late? — <b>Because</b> of the traffic.","«How are you?» — «как дела»; профессию спрашивают «What do you do?»."],
  ex:[{en:"What is your name?",ru:"Как тебя зовут?"},{en:"Where are you from?",ru:"Откуда ты?"},{en:"How old are you?",ru:"Сколько тебе лет?"},{en:"Why are you late?",ru:"Почему ты опоздал?"},{en:"What do you do?",ru:"Кем ты работаешь?"},{en:"What time is it?",ru:"Который час?"}],
  drills:[
    {t:"choice",q:"___ is your name?",o:["What","Where","Who"],a:"What"},
    {t:"choice",q:"___ do you live?",o:["Where","What","When"],a:"Where"},
    {t:"choice",q:"___ old are you?",o:["How","What","Which"],a:"How"},
    {t:"choice",q:"___ is she? — My sister.",o:["Who","What","Where"],a:"Who"},
    {t:"choice",q:"___ are you late? — Because of the traffic.",o:["Why","When","How"],a:"Why"},
    {t:"choice",q:"___ do you go to work? — At 8.",o:["When","Where","Who"],a:"When"},
    {t:"choice",q:"___ are you? — I'm fine, thanks.",o:["How","What","Who"],a:"How"},
    {t:"choice",q:"___ bag is this? — It's mine.",o:["Whose","Who","Which"],a:"Whose"},
    {t:"gap",q:"___ time is it? — It's 5 o'clock.",a:["What"]},
    {t:"build",en:"Where do you work?",ru:"Где ты работаешь?",extra:["does"]},
    {t:"build",en:"How old is your brother?",ru:"Сколько лет твоему брату?",extra:["are"]},
    {t:"tr",ru:"Кто это?",a:["Who is this?","Who is it?","Who is that?"]},
    {t:"tr",ru:"Почему ты здесь?",a:["Why are you here?"]},
    {t:"err",q:"What old are you?",w:"What",c:"How",a:"How old are you?"}
  ]
});

GRAMMAR.push({
  id:"freq", lvl:"A1", title:"Как часто: always, usually, never", en:"adverbs of frequency", icon:"📅", tag:"Present Simple", timeline:"habit",
  rule:`<p>Слова частоты — шкала от 100% до 0%:</p>
<table><tr><th>100%</th><th>90%</th><th>70%</th><th>50%</th><th>10%</th><th>0%</th></tr>
<tr><td><b>always</b><br>всегда</td><td><b>usually</b><br>обычно</td><td><b>often</b><br>часто</td><td><b>sometimes</b><br>иногда</td><td><b>rarely</b><br>редко</td><td><b>never</b><br>никогда</td></tr></table>
<p><b>Где стоит:</b> перед обычным глаголом, но <b>после</b> to be:</p>
<p><span class=ex>I <b>always</b> <b class=v>get up</b> at 7. She <b class=v>is</b> <b>never</b> late.</span></p>
<p>Длинные выражения — в конце: <span class=ex>I go to the gym <b>twice a week</b>. We travel <b>every summer</b>.</span></p>
<p>Вопрос: <b>How often</b> do you…? — Как часто?</p>`,
  blocks:[["I","always get up","at 7."],["She","is never","late."]],
  tips:["<span class=no>I go always</span> → I <b>always</b> go.","<span class=no>She never is late</span> → She <b>is never</b> late.","Never уже отрицание: <span class=no>I don't never</span> → I never…"],
  ex:[{en:"I always get up at 7.",ru:"Я всегда встаю в 7."},{en:"She is never late.",ru:"Она никогда не опаздывает."},{en:"We often go to the cinema.",ru:"Мы часто ходим в кино."},{en:"He sometimes plays football.",ru:"Он иногда играет в футбол."},{en:"How often do you go swimming? — Twice a week.",ru:"Как часто ты плаваешь? — Два раза в неделю."}],
  drills:[
    {t:"choice",q:"I ___ drink coffee in the morning. (100%)",o:["always","never","sometimes"],a:"always"},
    {t:"choice",q:"He is ___ late. (0%)",o:["never","always","often"],a:"never"},
    {t:"choice",q:"Какой порядок верный?",o:["I always go to work by bus.","I go always to work by bus.","Always go I to work by bus."],a:"I always go to work by bus."},
    {t:"choice",q:"Какой порядок верный?",o:["She is usually at home.","She usually is at home.","Usually is she at home."],a:"She is usually at home.",why:"после to be"},
    {t:"choice",q:"How ___ do you go swimming? — Twice a week.",o:["often","many","much"],a:"often"},
    {t:"build",en:"She usually gets up at 7.",ru:"Она обычно встаёт в 7.",extra:["is"]},
    {t:"build",en:"I am never late.",ru:"Я никогда не опаздываю.",extra:["not"]},
    {t:"build",en:"We often go to the cinema.",ru:"Мы часто ходим в кино.",extra:["are"]},
    {t:"tr",ru:"Я иногда играю в футбол.",a:["I sometimes play football.","Sometimes I play football."]},
    {t:"tr",ru:"Он всегда занят.",a:["He is always busy."]},
    {t:"err",q:"She never is late.",w:"never",c:"is never",a:"She is never late."},
    {t:"err",q:"I go always to work by bus.",w:"always",c:"",a:"I always go to work by bus."}
  ]
});

GRAMMAR.push({
  id:"can", lvl:"A1", title:"Can / can't — умею, могу", en:"can / can't", icon:"💪", tag:"модальные", timeline:null,
  rule:`<p><b>can</b> + глагол (без to, без -s): <span class=ex>I <b class=v>can swim</b>. She <b class=v>can swim</b>.</span> Форма одна для всех.</p>
<table><tr><th>+</th><th>−</th><th>?</th></tr>
<tr><td>I <b>can</b> swim.</td><td>I <b>can't</b> (cannot) swim.</td><td><b>Can</b> you swim? — Yes, I can. / No, I can't.</td></tr></table>
<p>Три значения:</p>
<ul><li><b>умение</b>: She can speak three languages.</li>
<li><b>просьба</b>: Can you help me? Can I have a coffee, please?</li>
<li><b>разрешение</b>: Can I open the window? — Yes, you can.</li></ul>`,
  blocks:[["I","can","swim."],["She","can't","drive."],["Can","you","help me?"]],
  tips:["<span class=no>She cans</span>, <span class=no>She can to dance</span> → She <b>can dance</b>.","Вопрос — просто переставляем: <b>Can you</b>…? (без do)."],
  ex:[{en:"I can swim.",ru:"Я умею плавать."},{en:"She can speak three languages.",ru:"Она говорит на трёх языках."},{en:"I can't drive.",ru:"Я не умею водить."},{en:"Can you help me?",ru:"Ты можешь мне помочь?"},{en:"Can I have a coffee, please?",ru:"Можно мне кофе, пожалуйста?"}],
  drills:[
    {t:"choice",q:"She ___ speak three languages.",o:["can","cans","can to"],a:"can"},
    {t:"choice",q:"I ___ swim. (не умею)",o:["can't","don't can","not can"],a:"can't"},
    {t:"choice",q:"Can you ___ me?",o:["help","helps","to help"],a:"help"},
    {t:"choice",q:"___ I open the window?",o:["Can","Do","Am"],a:"Can"},
    {t:"choice",q:"Can he cook? — Yes, he ___.",o:["can","does","is"],a:"can"},
    {t:"gap",q:"___ you drive? — Yes, I can.",a:["Can"]},
    {t:"gap",q:"My grandmother ___ use a computer. (не умеет)",a:["can't","cannot","can not"]},
    {t:"build",en:"Can I have a coffee, please?",ru:"Можно мне кофе, пожалуйста?",extra:["do"]},
    {t:"build",en:"He can play the guitar.",ru:"Он умеет играть на гитаре.",extra:["cans"]},
    {t:"tr",ru:"Я умею плавать.",a:["I can swim."]},
    {t:"tr",ru:"Ты можешь мне помочь?",a:["Can you help me?"]},
    {t:"err",q:"She can to dance.",w:"to",c:"",a:"She can dance."},
    {t:"err",q:"He cans cook.",w:"cans",c:"can",a:"He can cook."}
  ]
});
