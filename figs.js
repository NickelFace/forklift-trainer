/* Схемы тренажёра — inline SVG в цветах темы (CSS-переменные).
   FIG[id] = { title, ru, svg, notes:[...] }.  notes — пояснения для человека «с нуля», выводятся
   HTML-списком под схемой (в SVG только короткие подписи, чтобы ничего не обрезалось).
   Привязка к вопросам — поле "fig" в data.json. */
(function(){
const T='var(--txt)', D='var(--dim)', A='var(--acc)', OK='var(--ok)', BAD='var(--bad)', BL='var(--blue)', L='var(--line)', INK='#14181d';
const txt=(x,y,s,o={})=>`<text x="${x}" y="${y}" fill="${o.c||T}" font-size="${o.s||13}" font-weight="${o.w||500}" text-anchor="${o.a||'start'}" font-family="inherit">${s}</text>`;
const arrow=(x1,y1,x2,y2,c=A,w=2.5)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const badge=(x,y,n,c,r=11)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="1.5"/>${txt(x,y+4.5,n,{c:INK,w:800,s:12,a:'middle'})}`;
const defs=`<defs><marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L9,4.5 L0,9 z" fill="context-stroke"/></marker></defs>`;
const wrap=(w,h,body)=>`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${defs}${body}</svg>`;
const ground=(w,y,x0=0)=>`<line x1="${x0}" y1="${y}" x2="${w}" y2="${y}" stroke="${D}" stroke-width="2.5"/>`;
const person=(x,y,c=T,s=1)=>`<g transform="translate(${x},${y}) scale(${s})"><circle cx="0" cy="-30" r="8" fill="${c}"/><path d="M0,-22 v26 M-13,-10 h26 M0,4 l-9,20 M0,4 l9,20" stroke="${c}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;

/* погрузчик, вид сбоку, вилы вправо; 240×100 в локальных координатах; o.loadW — ширина груза */
function fk(x,y,s=1,o={}){
  const lw=o.loadW||58;
  const load = o.load===false ? '' : `<rect x="170" y="${o.loadY??52}" width="${lw}" height="${o.loadH??38}" rx="2" fill="${BL}" fill-opacity=".45" stroke="${BL}" stroke-width="2.5"/>`;
  const op = o.op===false ? '' : `<circle cx="92" cy="30" r="6.5" fill="${T}"/><path d="M83,50 q9,-15 18,0" fill="${T}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M10,62 q-8,0 -8,8 v10 q0,6 6,6 h150 v-26 h-110 z" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <rect x="58" y="40" width="40" height="22" fill="${A}" fill-opacity=".6" stroke="${INK}" stroke-width="2"/>
    <path d="M62,62 v-50 h58 v50 M58,12 h66" fill="none" stroke="${T}" stroke-width="3"/>
    ${op}
    <rect x="150" y="4" width="4" height="92" fill="${T}"/><rect x="160" y="4" width="4" height="92" fill="${T}"/>
    <rect x="164" y="56" width="6" height="36" fill="${T}"/>
    <path d="M166,92 h74" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
    ${load}
    <circle cx="42" cy="86" r="13" fill="${L}" stroke="${T}" stroke-width="3"/><circle cx="42" cy="86" r="4" fill="${T}"/>
    <circle cx="136" cy="85" r="15" fill="${L}" stroke="${T}" stroke-width="3"/><circle cx="136" cy="85" r="4" fill="${T}"/>
  </g>`;
}

const FIG = {};

FIG.fulcrum = { title:'Fulcrum & load centre', ru:'Точка опоры и центр груза', svg: wrap(480,230,`
  ${ground(480,162)}
  ${fk(20,30,1.4,{loadW:100})}
  <path d="M210,168 L196,190 L224,190 z" fill="${BAD}" stroke="${T}" stroke-width="2"/>
  ${txt(210,208,'FULCRUM',{c:BAD,w:800,s:14,a:'middle'})}${txt(210,224,'front axle',{c:D,s:11,a:'middle'})}
  <line x1="328" y1="80" x2="328" y2="192" stroke="${OK}" stroke-width="2.5" stroke-dasharray="6 4"/>
  <line x1="258" y1="80" x2="258" y2="192" stroke="${OK}" stroke-width="2.5" stroke-dasharray="6 4"/>
  <line x1="258" y1="186" x2="328" y2="186" stroke="${OK}" stroke-width="3"/>
  ${txt(345,182,'LOAD CENTRE',{c:OK,w:800,s:14})}${txt(345,200,'600 mm',{c:OK,w:800,s:18})}
  ${txt(262,206,'heel of forks',{c:D,s:11})}${txt(328,70,'centre of load',{c:OK,s:11,a:'middle'})}
  ${txt(80,22,'COUNTERWEIGHT',{c:A,w:800,s:12,a:'middle'})}${arrow(80,28,80,100,A)}
  ${txt(328,22,'LOAD',{c:BL,w:800,s:12,a:'middle'})}${arrow(328,28,328,60,BL)}
`), notes:[
  'Погрузчик — это <b>качели (seesaw)</b>. Груз давит спереди, противовес (<b>counterweight</b>) — сзади, а точка опоры (<b>fulcrum</b>) — передняя ось.',
  '<b>Load centre</b> — расстояние по горизонтали от пятки вил (<b>heel of the forks</b>) до центра груза. Для ровного груза это половина его длины.',
  'Стандартный load centre — <b>600 mm</b>. Чем дальше центр груза от пятки, тем длиннее рычаг и тем меньше можно поднять.'
]};

FIG.capacity = { title:'Load centre vs capacity', ru:'Чем дальше центр груза — тем меньше грузоподъёмность', svg: wrap(480,250,`
  <line x1="60" y1="20" x2="60" y2="200" stroke="${D}" stroke-width="2"/><line x1="60" y1="200" x2="460" y2="200" stroke="${D}" stroke-width="2"/>
  ${txt(26,110,'kg',{c:D,s:12})}${txt(260,236,'load centre, mm',{c:D,s:12,a:'middle'})}
  ${[[110,'400'],[180,'500'],[250,'600'],[320,'700'],[390,'800']].map(([x,l])=>`<line x1="${x}" y1="200" x2="${x}" y2="206" stroke="${D}"/>${txt(x,220,l,{c:D,s:11,a:'middle'})}`).join('')}
  ${[[188,'1000'],[152,'2000'],[116,'3000'],[80,'4000'],[44,'5000']].map(([y,l])=>`<line x1="54" y1="${y}" x2="60" y2="${y}" stroke="${D}"/>${txt(50,y+4,l,{c:D,s:11,a:'end'})}`).join('')}
  <path d="M110,26 C150,46 200,66 250,80 C300,92 360,101 440,110" fill="none" stroke="${A}" stroke-width="3.5"/>
  <line x1="60" y1="80" x2="440" y2="80" stroke="${BAD}" stroke-width="1.5" stroke-dasharray="5 5"/>${txt(444,84,'4200',{c:BAD,s:11})}
  <circle cx="180" cy="61" r="7" fill="${OK}" stroke="${INK}" stroke-width="1.5"/>${txt(192,52,'B · 500 mm',{c:OK,w:800,s:13})}
  <circle cx="250" cy="80" r="7" fill="${A}" stroke="${INK}" stroke-width="1.5"/>${txt(262,74,'rated · 600 mm',{c:A,w:800,s:13})}
  <circle cx="285" cy="88" r="7" fill="${BAD}" stroke="${INK}" stroke-width="1.5"/>${txt(297,106,'C · 650 mm',{c:BAD,w:800,s:13})}
  <circle cx="320" cy="94" r="7" fill="${BAD}" stroke="${INK}" stroke-width="1.5"/>${txt(332,128,'A · 700 mm',{c:BAD,w:800,s:13})}
  ${txt(120,180,'above the line = OK · below = overload',{c:D,s:11})}
`), notes:[
  'Табличка говорит: <b>4200 kg at 600 mm</b> — столько можно поднять, если центр груза на 600 мм от пятки вил.',
  'Отодвинь центр груза дальше — и грузоподъёмность падает: при 700 mm ≈ 3600 kg, при 1000 mm ≈ 2520 kg. Формула для прикидки: <b>rated × 600 ÷ actual</b>.',
  'Задача Q47: груз длиной 1000 mm → центр 500 mm (точка B) — он внутри 600 mm, поэтому 4200 kg поднять можно. Грузы 1300 и 1400 mm (C и A) — уже перегруз.'
]};

FIG.triangle = { title:'Stability triangle', ru:'Треугольник устойчивости — вид сверху', svg: wrap(480,250,`
  <g transform="translate(150,36)">
    <rect x="40" y="0" width="110" height="180" rx="12" fill="${A}" fill-opacity=".9" stroke="${INK}" stroke-width="2"/>
    <rect x="28" y="16" width="20" height="38" rx="5" fill="${L}" stroke="${T}" stroke-width="2.5"/><rect x="142" y="16" width="20" height="38" rx="5" fill="${L}" stroke="${T}" stroke-width="2.5"/>
    <rect x="85" y="134" width="20" height="38" rx="5" fill="${L}" stroke="${T}" stroke-width="2.5"/>
    <path d="M38,35 L152,35 L95,153 z" fill="${OK}" fill-opacity=".3" stroke="${OK}" stroke-width="3"/>
    <circle cx="95" cy="72" r="9" fill="${OK}" stroke="${INK}" stroke-width="2"/>
    <circle cx="158" cy="98" r="9" fill="${BAD}" stroke="${INK}" stroke-width="2"/>
    ${arrow(104,76,146,94,BAD,3)}
    <path d="M60,-14 h70" stroke="${BL}" stroke-width="7" stroke-linecap="round"/>
  </g>
  ${txt(245,16,'FORKS',{c:BL,w:800,s:12,a:'middle'})}
  ${txt(100,60,'front',{c:D,s:12,a:'end'})}${txt(100,76,'wheels',{c:D,s:12,a:'end'})}
  ${txt(100,170,'rear axle',{c:D,s:12,a:'end'})}${txt(100,186,'pivot',{c:D,s:12,a:'end'})}
  ${txt(330,100,'CoG inside',{c:OK,w:800,s:14})}${txt(330,116,'= stable',{c:OK,w:800,s:14})}
  ${txt(330,138,'CoG outside',{c:BAD,w:800,s:14})}${txt(330,154,'= TIP OVER',{c:BAD,w:800,s:14})}
  ${txt(240,236,'green triangle: front wheels + rear axle pivot',{c:D,s:11,a:'middle'})}
`), notes:[
  'Смотрим на погрузчик сверху. Три точки — два передних колеса и шарнир задней оси — образуют <b>stability triangle</b>.',
  'Пока общий центр тяжести (<b>centre of gravity, CoG</b>) машины и груза внутри зелёного треугольника — погрузчик стоит. Вышел за край — опрокидывание.',
  'Что выталкивает CoG наружу: поднятый груз, груз не по центру (side shift), резкий поворот, поворот или движение поперёк склона, ямы и мягкий грунт.'
]};

FIG.ramp = { title:'Ramps: loaded', ru:'Рампа с грузом: груз всегда смотрит вверх по склону', svg: wrap(480,230,`
  <g>
    <path d="M10,130 L225,40 L225,130 z" fill="${L}" fill-opacity=".6" stroke="${D}" stroke-width="2"/>
    <g transform="translate(70,88) rotate(-22.5)">${fk(0,0,.5)}</g>
    ${arrow(96,20,160,-6,OK,3)}${txt(118,24,'UP',{c:OK,w:800,s:16})}
    ${txt(118,150,'drive FORWARD',{c:OK,w:800,s:13,a:'middle'})}${txt(118,166,'вперёд, груз вверх по склону',{c:D,s:11,a:'middle'})}
  </g>
  <g transform="translate(245,0)">
    <path d="M10,130 L225,40 L225,130 z" fill="${L}" fill-opacity=".6" stroke="${D}" stroke-width="2"/>
    <g transform="translate(70,88) rotate(-22.5)">${fk(0,0,.5)}</g>
    ${arrow(160,-6,96,20,OK,3)}${txt(118,24,'DOWN',{c:OK,w:800,s:16})}
    ${txt(118,150,'REVERSE down',{c:OK,w:800,s:13,a:'middle'})}${txt(118,166,'задним ходом, груз всё ещё вверх',{c:D,s:11,a:'middle'})}
  </g>
  <rect x="10" y="184" width="460" height="36" rx="8" fill="${BAD}" fill-opacity=".12" stroke="${BAD}"/>
  ${txt(240,207,'NEVER turn on a ramp · never travel across a slope',{c:BAD,w:800,s:13,a:'middle'})}
`), notes:[
  'С грузом вилы всегда смотрят <b>вверх по склону</b>: вверх едем передом (<b>drive forward</b>), вниз — задним ходом (<b>reverse</b>). Так груз не соскользнёт с вил и центр тяжести остаётся ближе к точке опоры.',
  'Без груза — наоборот: вилы смотрят <b>вниз</b> по склону (задним ходом вверх, передом вниз).',
  'Груз держим низко, мачту наклоняем назад, едем медленно и прямо. Поворот на уклоне выводит центр тяжести из треугольника устойчивости — боковое опрокидывание.'
]};

FIG.powerlines = { title:'Power line exclusion zones', ru:'Минимальные расстояния до ЛЭП', svg: wrap(480,240,`
  ${ground(480,200)}
  ${[[80,'up to 132 kV','3 m',OK,44],[240,'132 – 330 kV','6 m',A,76],[400,'over 330 kV','8 m',BAD,100]].map(([x,v,d,c,r])=>`
    <line x1="${x}" y1="24" x2="${x}" y2="200" stroke="${D}" stroke-width="4"/>
    <line x1="${x-34}" y1="36" x2="${x+34}" y2="36" stroke="${T}" stroke-width="3"/>
    <circle cx="${x}" cy="36" r="${r}" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="2.5" stroke-dasharray="7 5"/>
    ${txt(x,16,v,{c:T,w:700,s:12,a:'middle'})}
    ${txt(x,36+r/2+8,d,{c:c,w:800,s:26,a:'middle'})}`).join('')}
  ${fk(190,145,.55,{load:false,op:false})}
  ${txt(240,226,'no spotter · untrained person: keep OUTSIDE the circle',{c:D,s:11,a:'middle'})}
`), notes:[
  'Три зоны по напряжению линии: до <b>132 kV — 3 m</b>, от 132 до <b>330 kV — 6 m</b>, выше <b>330 kV — 8 m</b>. Это расстояние от любой части погрузчика и груза до провода.',
  'Цифры отличаются по штатам и у разных сетевых компаний — точные значения даёт <b>владелец линии (asset owner)</b>, регулятор штата и SWMS площадки.',
  'Напряжение на глаз не определить — его подтверждает владелец сети письменно. <b>Tiger tails</b> и шары-маркеры делают провода заметнее, но <b>не изолируют</b>.'
]};

FIG.contact = { title:'Contact with a power line', ru:'Задел провод: шесть шагов', svg: wrap(480,210,`
  ${ground(480,140)}
  <line x1="0" y1="20" x2="480" y2="20" stroke="${A}" stroke-width="3"/><line x1="150" y1="20" x2="150" y2="66" stroke="${BAD}" stroke-width="3"/>
  ${fk(20,36,.6,{load:false})}
  ${txt(150,100,'⚡',{s:22,a:'middle'})}
  ${badge(60,60,'1',OK)}${txt(60,118,'STAY',{c:OK,w:800,s:14,a:'middle'})}
  ${person(250,112,OK)}${arrow(200,96,232,86,OK,3)}
  ${badge(250,52,'4',A)}${txt(250,158,'feet together',{c:A,w:800,s:12,a:'middle'})}
  ${[300,330,360,390].map(x=>`<path d="M${x},136 q10,-14 20,0" fill="none" stroke="${OK}" stroke-width="3"/>`).join('')}
  ${badge(350,110,'5',OK)}${txt(350,160,'shuffle ≥ 10 m',{c:OK,w:800,s:13,a:'middle'})}
  ${txt(240,196,'step potential: voltage spreads in rings on the ground',{c:D,s:11,a:'middle'})}
`), notes:[
  '<b>1. Stay on the machine.</b> Остаться на погрузчике: он под напряжением, а земля рядом — тоже. Опасно касаться машины и земли одновременно.',
  '<b>2. Warn people</b> — крикнуть всем держаться подальше и не трогать погрузчик. <b>3.</b> Если безопасно — отъехать назад тем же путём, разорвав контакт.',
  '<b>4.</b> Сходить только если нельзя остаться (пожар): <b>прыгнуть</b>, ноги вместе, не касаясь машины и земли одновременно. <b>5.</b> Уйти шаркающими шажками (<b>shuffle</b>) со сведёнными ногами не меньше 10 m — так между ногами не будет разности напряжения.',
  '<b>6.</b> Позвонить 000 и в электросеть; никого не подпускать, пока линию не обесточат; доложить, повесить бирку на машину.'
]};

FIG.travel = { title:'Travelling with a load', ru:'Высота груза при движении', svg: wrap(480,200,`
  ${ground(480,148)}
  ${fk(30,36,1.1)}
  <line x1="296" y1="137" x2="296" y2="148" stroke="${OK}" stroke-width="3"/>
  ${txt(310,132,'100–150 mm',{c:OK,w:800,s:16})}${txt(310,148,'just clear of the ground',{c:D,s:11})}
  <path d="M200,42 q-14,-16 -28,-6" fill="none" stroke="${A}" stroke-width="3" marker-end="url(#ah)"/>${txt(166,30,'mast tilted BACK',{c:A,w:800,s:13,a:'end'})}
  ${txt(240,182,'low load = low CoG + clear vision + nothing to hit overhead',{c:D,s:11,a:'middle'})}
`), notes:[
  'При движении груз держат чуть над землёй — <b>100–150 mm</b> (примерно ширина ладони), мачта наклонена назад (<b>mast tilted back</b>), чтобы груз «лежал» на вилах.',
  'Низко — значит низкий центр тяжести, открытый обзор, нечего зацепить сверху (провода, трубы, дверные проёмы).',
  'Если большой груз закрывает обзор — ехать <b>задним ходом (in reverse)</b>, груз позади; исключение — рампа, там груз всё равно смотрит вверх. Помогает <b>spotter</b>, сигнал на перекрёстках, малая скорость.'
]};

FIG.prestart = { title:'Pre-start walk-around', ru:'Осмотр перед запуском — 7 пунктов', svg: wrap(480,210,`
  ${ground(480,170)}
  ${fk(60,50,1.2,{load:false,op:false})}
  ${badge(110,153,'1',BAD,13)}${badge(223,152,'1',BAD,13)}
  ${badge(340,146,'2',A,13)}
  ${badge(248,30,'3',BL,13)}
  ${badge(190,138,'4',OK,13)}
  ${badge(112,104,'5',A,13)}
  ${badge(154,104,'6',OK,13)}
  ${badge(170,52,'7',BL,13)}
  ${txt(400,60,'BEFORE',{c:T,w:800,s:14,a:'middle'})}${txt(400,78,'starting',{c:D,s:12,a:'middle'})}
  ${txt(400,110,'walk around',{c:D,s:12,a:'middle'})}${txt(400,126,'the machine',{c:D,s:12,a:'middle'})}
`), notes:[
  '<b>1 · Tyres and wheels</b> — шины, диски, гайки. <b>2 · Fork arms and carriage</b> — вилы и каретка: трещины, износ, фиксаторы.',
  '<b>3 · Mast, chains, hydraulic rams</b> — мачта, цепи, гидроцилиндры. <b>4 · Hoses and fluid levels</b> — шланги, масло, охлаждение, топливо, подтёки под машиной.',
  '<b>5 · Data plate and decals</b> — табличка и наклейки читаемы. <b>6 · Seat, seatbelt, restraint</b> — сиденье и ремень. <b>7 · Overhead guard and load backrest</b> — защитная крыша и спинка каретки.',
  'Потом запуск и <b>post-start checks</b>: приборы, клаксон, свет и сигналы, тормоза, руль до упора в обе стороны, все гидрофункции. Когда: перед каждым использованием, каждую смену, при смене оператора, после удара.'
]};

FIG.guards = { title:'Guards on a forklift', ru:'Защитные элементы и что они защищают', svg: wrap(480,210,`
  ${ground(480,170)}
  ${fk(60,50,1.2,{load:false})}
  <path d="M130,64 h78 M134,66 v60 M204,66 v60" stroke="${OK}" stroke-width="5" stroke-opacity=".8" fill="none"/>
  <rect x="257" y="117" width="7" height="43" fill="${A}"/>
  ${badge(170,40,'1',OK,13)}
  ${badge(282,110,'2',A,13)}
  ${badge(150,142,'3',BL,13)}
  ${badge(248,60,'4',BAD,13)}
  ${badge(76,160,'5',D,13)}
  ${badge(154,100,'6',T,13)}
  ${txt(400,80,'GUARDS',{c:T,w:800,s:14,a:'middle'})}${txt(400,98,'protect you from',{c:D,s:12,a:'middle'})}${txt(400,114,'the machine',{c:D,s:12,a:'middle'})}${txt(400,130,'and the load',{c:D,s:12,a:'middle'})}
`), notes:[
  '<b>1 · Overhead guard (ROPS/FOPS)</b> — защитная крыша: от падающих предметов и при опрокидывании. <b>2 · Load backrest extension</b> — спинка каретки: груз не упадёт назад на оператора.',
  '<b>3 · Fan belt / engine guard</b> — кожух ремня и двигателя: не затянет в ремни и шкивы. <b>4 · Chain and sprocket guard</b> — кожух цепей мачты: не затянет руку.',
  '<b>5 · Exhaust / muffler guard</b> — кожух выхлопа: от ожогов. <b>6 · Seatbelt / restraint</b> — ремень: удерживает в защитной зоне.',
  'Зеркала, маячок, сигнал заднего хода — это предупреждающие устройства, а не guards.'
]};

FIG.dataplate = { title:'Data plate (capacity plate)', ru:'Заводская табличка — без неё работать нельзя', svg: wrap(480,230,`
  <rect x="20" y="14" width="300" height="200" rx="10" fill="${L}" fill-opacity=".55" stroke="${T}" stroke-width="2.5"/>
  <rect x="20" y="14" width="300" height="34" rx="10" fill="${A}"/><rect x="20" y="34" width="300" height="14" fill="${A}"/>
  ${txt(170,37,'FORKLIFT DATA PLATE',{c:INK,w:800,s:15,a:'middle'})}
  ${[['Model / serial no.','FL-2500 · 0048231'],['Truck weight (unladen)','4 350 kg'],['RATED CAPACITY','4 200 kg'],['LOAD CENTRE','600 mm'],['Max lift height','4 500 mm'],['Attachment · de-rated cap.','Side shift · 4 000 kg'],['Tyre size / pressure','7.00-12 · 800 kPa']].map(([k,v],i)=>{const hi=i===2||i===3;
    return `${hi?`<rect x="26" y="${54+i*22}" width="288" height="22" rx="4" fill="${A}" fill-opacity=".14"/>`:''}${txt(34,70+i*22,k,{c:hi?A:D,w:hi?800:500,s:hi?12:11.5})}${txt(308,70+i*22,v,{c:hi?A:T,w:hi?800:600,s:hi?14:12,a:'end'})}`;}).join('')}
  ${txt(400,60,'NO PLATE',{c:BAD,w:800,s:16,a:'middle'})}${txt(400,80,'= DO NOT USE',{c:BAD,w:800,s:14,a:'middle'})}
  ${txt(400,120,'tag out',{c:T,s:12,a:'middle'})}${txt(400,138,'remove key',{c:T,s:12,a:'middle'})}${txt(400,156,'report',{c:T,s:12,a:'middle'})}
`), notes:[
  '<b>Data plate</b> — металлическая табличка на погрузчике. Главные строки: <b>rated capacity</b> (сколько можно поднять) и <b>load centre</b> (при каком расстоянии до центра груза).',
  'Нет таблички — неизвестны ни грузоподъёмность, ни load centre, значит машиной пользоваться <b>нельзя</b>: заглушить, вынуть ключ, бирка <b>Out of Service</b>, доложить руководителю.',
  'Навесное оборудование (<b>attachment</b>) требует своей таблички со сниженной грузоподъёмностью. Добавлять противовес без письменного одобрения производителя и новой таблички запрещено.'
]};

FIG.dock = { title:'Loading dock', ru:'Погрузочный док: плита и башмаки', svg: wrap(480,210,`
  <rect x="0" y="110" width="170" height="70" fill="${L}" stroke="${D}" stroke-width="2"/>${txt(85,150,'DOCK',{c:D,w:800,s:14,a:'middle'})}
  <rect x="250" y="64" width="220" height="68" rx="5" fill="${BL}" fill-opacity=".3" stroke="${BL}" stroke-width="2.5"/>${txt(360,104,'TRUCK',{c:BL,w:800,s:14,a:'middle'})}
  <circle cx="295" cy="146" r="16" fill="${L}" stroke="${T}" stroke-width="3"/><circle cx="420" cy="146" r="16" fill="${L}" stroke="${T}" stroke-width="3"/>
  <path d="M268,162 l10,-14 l0,14 z M322,162 l-10,-14 l0,14 z" fill="${A}" stroke="${INK}"/>
  ${txt(295,186,'wheel chocks',{c:A,w:800,s:12,a:'middle'})}
  <rect x="160" y="105" width="100" height="9" rx="2" fill="${OK}" stroke="${INK}" stroke-width="1.5"/>
  ${txt(210,94,'dock plate',{c:OK,w:800,s:13,a:'middle'})}
  ${fk(20,58,.5,{op:false})}
  ${txt(400,40,'park brake ON',{c:T,w:700,s:12,a:'middle'})}
`), notes:[
  'Между доком и кузовом грузовика есть зазор. Через него кладут <b>dock plate / bridging plate</b> — мост, рассчитанный на вес погрузчика вместе с грузом и закреплённый, чтобы не сдвинулся.',
  'Перед заездом грузовик фиксируют: под колёса — <b>wheel chocks</b> (башмаки), стояночный тормоз включён, где положено — <b>trailer restraint</b>.',
  'Иначе грузовик может откатиться, и погрузчик упадёт в зазор.'
]};

FIG.rearswing = { title:'Rear end swing', ru:'Занос задней части при повороте — вид сверху', svg: wrap(480,240,`
  <g transform="translate(130,40)">
    <rect x="0" y="40" width="130" height="76" rx="10" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <rect x="130" y="58" width="80" height="7" fill="${T}"/><rect x="130" y="91" width="80" height="7" fill="${T}"/>
    <rect x="104" y="28" width="16" height="26" rx="4" fill="${L}" stroke="${T}" stroke-width="2.5"/><rect x="104" y="102" width="16" height="26" rx="4" fill="${L}" stroke="${T}" stroke-width="2.5"/>
    <g transform="rotate(32 12 78)"><rect x="4" y="65" width="16" height="26" rx="4" fill="${L}" stroke="${T}" stroke-width="2.5"/></g>
    ${txt(70,83,'counterweight',{c:INK,w:800,s:11,a:'middle'})}
    <path d="M0,116 A120,120 0 0 0 -40,6" fill="none" stroke="${BAD}" stroke-width="4" stroke-dasharray="8 5" marker-end="url(#ah)"/>
    ${arrow(214,78,250,78,OK,3)}
  </g>
  ${txt(80,30,'REAR SWINGS OUT',{c:BAD,w:800,s:14,a:'middle'})}
  ${txt(60,180,'steering',{c:D,s:12,a:'middle'})}${txt(60,196,'= rear wheels',{c:D,s:12,a:'middle'})}
  ${person(40,110,BAD,.9)}
  ${txt(400,110,'front',{c:OK,w:800,s:13,a:'middle'})}${txt(400,126,'turns',{c:OK,w:800,s:13,a:'middle'})}
  ${txt(240,228,'check behind you before every turn',{c:D,s:11,a:'middle'})}
`), notes:[
  'У погрузчика рулят <b>задние</b> колёса. Поэтому при повороте передняя часть идёт туда, куда ты крутишь, а <b>хвост с противовесом выносит в противоположную сторону</b> широкой дугой.',
  'Эта дуга гораздо шире, чем кажется из кресла, и находится за спиной — в слепой зоне. Там могут стоять люди, стеллажи, стены, другая техника.',
  'Перед поворотом — проверить, что сзади и сбоку никого нет.'
]};

FIG.hierarchy = { title:'Hierarchy of control', ru:'Иерархия мер контроля — сверху самые надёжные', svg: wrap(480,250,`
  ${[['1 · ELIMINATE',OK],['2 · SUBSTITUTE',OK],['3 · ISOLATE',A],['4 · ENGINEERING',A],['5 · ADMINISTRATIVE',BAD],['6 · PPE',BAD]].map(([k,c],i)=>{
    const w=420-i*56, x=(480-w)/2, y=12+i*36;
    return `<rect x="${x}" y="${y}" width="${w}" height="30" rx="7" fill="${c}" fill-opacity="${.55-i*.06}" stroke="${c}" stroke-width="2"/>${txt(240,y+20,k,{c:T,w:800,s:13,a:'middle'})}`;
  }).join('')}
  ${txt(14,120,'most',{c:OK,w:800,s:12})}${txt(14,136,'effective',{c:OK,s:11})}
  ${txt(466,190,'least',{c:BAD,w:800,s:12,a:'end'})}${txt(466,206,'effective',{c:BAD,s:11,a:'end'})}
  ${txt(240,244,'start at the top; use PPE only when nothing above is possible',{c:D,s:11,a:'middle'})}
`), notes:[
  'Когда нашли опасность, меры выбирают сверху вниз. <b>Eliminate</b> — убрать опасность совсем. <b>Substitute</b> — заменить на менее опасное (электропогрузчик вместо дизеля в помещении).',
  '<b>Isolate</b> — отделить людей от опасности барьерами, зонами, надземными переходами. <b>Engineering</b> — техника: защитные кожухи, маячок, сигнал заднего хода, ограничитель скорости.',
  '<b>Administrative</b> — правила: SWMS, обучение, знаки, план движения. <b>PPE</b> — средства защиты (жилет, каска, ботинки) — последняя линия, они не убирают опасность.',
  'Меры применяют сразу при выявлении опасности и заново при любом изменении условий; затем проверяют, что они работают.'
]};

FIG.tipping = { title:'If the forklift tips over', ru:'Опрокидывание: остаться в кресле', svg: wrap(480,230,`
  ${ground(480,170)}
  <g transform="rotate(26 170 170)">${fk(40,70,1,{op:false})}</g>
  <g transform="translate(166,118) rotate(26)">${person(0,0,OK)}</g>
  ${arrow(190,76,140,56,OK,3)}${txt(132,52,'LEAN AWAY',{c:OK,w:800,s:14,a:'end'})}
  ${txt(380,50,'✓ stay in the seat',{c:OK,w:800,s:14,a:'middle'})}${txt(380,70,'✓ seatbelt on',{c:OK,w:700,s:13,a:'middle'})}${txt(380,90,'✓ grip the wheel, brace feet',{c:OK,w:700,s:13,a:'middle'})}
  ${txt(380,130,'✗ DO NOT JUMP',{c:BAD,w:800,s:16,a:'middle'})}
  ${txt(240,210,'the overhead guard comes down on anyone who jumps',{c:D,s:11,a:'middle'})}
`), notes:[
  'Если погрузчик начал опрокидываться — <b>не прыгать</b>. Прыгнувшего, как правило, придавливает защитной крышей (<b>overhead guard</b>), которая опускается вместе с машиной. Это самая частая причина гибели операторов.',
  'Правильно: остаться в кресле, ремень пристёгнут, крепко держаться за руль, упереться ногами и <b>отклониться в сторону, противоположную падению</b>.',
  'Ремень (<b>seatbelt</b>) и нужен для этого — он держит тебя внутри защитной зоны. Где ремень установлен, его ношение обязательно по закону.'
]};

FIG.parking = { title:'Parking & shutdown', ru:'Парковка: место, положение, отключение', svg: wrap(480,220,`
  ${ground(480,150)}
  ${fk(30,50,1,{load:false,op:false})}
  ${arrow(290,112,290,142,OK,3)}${txt(304,134,'forks flat on the ground',{c:OK,w:800,s:13})}
  <path d="M196,56 q-14,-14 -28,-4" fill="none" stroke="${A}" stroke-width="3" marker-end="url(#ah)"/>${txt(160,44,'mast tilted forward',{c:A,w:800,s:13,a:'end'})}
  <path d="M60,140 l10,-14 l0,14 z" fill="${A}" stroke="${INK}"/>${txt(46,168,'chock if any slope',{c:A,s:12})}
  <rect x="330" y="30" width="60" height="30" rx="6" fill="${L}" stroke="${T}" stroke-width="2"/>${txt(360,50,'🔑',{s:16,a:'middle'})}${txt(410,42,'KEY OUT',{c:T,w:800,s:13})}${txt(410,58,'park brake ON',{c:D,s:11})}
  ${txt(240,200,'level ground · designated area · clear of exits, walkways, fire equipment',{c:D,s:11,a:'middle'})}
`), notes:[
  '<b>Место (location)</b>: ровный твёрдый грунт, отведённая зона; не загораживать выходы, пожарное оборудование, пешеходные дорожки, проезды; не на уклоне.',
  '<b>Положение (set-up)</b>: вилы опущены плашмя на пол, мачта наклонена вперёд, рычаги в нейтраль, стояночный тормоз (<b>park brake</b>) включён.',
  '<b>Отключение (shut down)</b>: двигатель заглушен, <b>ключ вынут</b> и убран, на уклоне — башмаки под колёса; поставить на зарядку или заправить по правилам площадки.',
  'Ключ вынимают, чтобы погрузчик не завёл посторонний или человек без лицензии, не было случайного запуска и угона.'
]};

FIG.hazrisk = { title:'Hazard → Risk → Control', ru:'Опасность, риск и мера контроля', svg: wrap(480,150,`
  <rect x="14" y="20" width="140" height="90" rx="10" fill="${A}" fill-opacity=".16" stroke="${A}" stroke-width="2.5"/>
  ${txt(84,46,'HAZARD',{c:A,w:800,s:16,a:'middle'})}${txt(84,68,'may cause harm',{c:T,s:12,a:'middle'})}${txt(84,94,'wet floor',{c:D,s:11,a:'middle'})}
  ${arrow(158,65,182,65,D,3)}
  <rect x="186" y="20" width="140" height="90" rx="10" fill="${BAD}" fill-opacity=".16" stroke="${BAD}" stroke-width="2.5"/>
  ${txt(256,46,'RISK',{c:BAD,w:800,s:16,a:'middle'})}${txt(256,68,'likelihood × harm',{c:T,s:12,a:'middle'})}${txt(256,94,'skid, tip over',{c:D,s:11,a:'middle'})}
  ${arrow(330,65,354,65,D,3)}
  <rect x="358" y="20" width="108" height="90" rx="10" fill="${OK}" fill-opacity=".16" stroke="${OK}" stroke-width="2.5"/>
  ${txt(412,46,'CONTROL',{c:OK,w:800,s:16,a:'middle'})}${txt(412,68,'reduce the risk',{c:T,s:12,a:'middle'})}${txt(412,94,'clean, slow down',{c:D,s:11,a:'middle'})}
  ${txt(240,138,'exam wording: HAZARD = something that may cause harm · RISK = what could happen',{c:D,s:10.5,a:'middle'})}
`), notes:[
  '<b>Hazard</b> (опасность) — любая вещь, ситуация или действие, которые <b>могут</b> причинить вред: мокрый пол, провода над головой, пешеходы рядом.',
  '<b>Risk</b> (риск) — насколько <b>вероятно</b>, что опасность реально навредит, и насколько <b>серьёзно</b>. Мокрый пол → занос и опрокидывание.',
  '<b>Control</b> (мера контроля) — то, что снижает риск: убрать лужу, снизить скорость, оградить зону. На экзамене эти два определения спрашивают дословно.'
]};

FIG.confined = { title:'Confined spaces & batteries', ru:'Замкнутые пространства: выхлоп и водород', svg: wrap(480,200,`
  <rect x="14" y="14" width="220" height="140" rx="10" fill="${L}" fill-opacity=".45" stroke="${D}" stroke-width="2"/>
  ${fk(26,62,.62,{load:false})}
  ${[[170,46],[192,34],[182,62],[208,54],[160,30]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="${BAD}" fill-opacity=".6"/>`).join('')}
  ${txt(186,24,'CO',{c:BAD,w:800,s:14,a:'middle'})}
  ${txt(124,146,'engine indoors ✗',{c:BAD,w:800,s:13,a:'middle'})}
  <rect x="246" y="14" width="220" height="140" rx="10" fill="${L}" fill-opacity=".45" stroke="${D}" stroke-width="2"/>
  <rect x="276" y="80" width="90" height="50" rx="5" fill="${OK}" fill-opacity=".35" stroke="${OK}" stroke-width="2.5"/>${txt(321,110,'BATTERY',{c:OK,w:800,s:12,a:'middle'})}
  ${[[290,58],[314,48],[336,62],[326,36],[300,34]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="${A}" fill-opacity=".8"/>`).join('')}
  ${txt(400,60,'H₂',{c:A,w:800,s:18,a:'middle'})}${txt(400,80,'explosive',{c:A,w:700,s:12,a:'middle'})}
  ${txt(356,146,'charging → ventilate',{c:OK,w:800,s:13,a:'middle'})}
  ${txt(240,186,'confined space? use an ELECTRIC forklift',{c:T,w:700,s:12,a:'middle'})}
`), notes:[
  'Двигатель внутреннего сгорания (дизель, бензин, газ) в замкнутом помещении накапливает выхлоп — угарный газ <b>CO</b>: без цвета и запаха, быстро убивает. Плюс двигатель сжигает кислород — можно задохнуться.',
  'Зарядка свинцово-кислотного аккумулятора выделяет <b>водород (hydrogen)</b> — взрывается от одной искры. Заряжать только в проветриваемом месте, без огня и курения.',
  'Для замкнутых пространств безопаснее <b>электрический</b> погрузчик: нет выхлопа. Может понадобиться разрешение (permit), контроль воздуха, вентиляция.'
]};

FIG.refuel = { title:'Refuelling', ru:'Заправка — только с заглушенным двигателем', svg: wrap(480,150,`
  ${fk(20,24,.62,{load:false})}
  <rect x="210" y="46" width="34" height="66" rx="5" fill="${L}" stroke="${T}" stroke-width="2.5"/><path d="M244,56 q24,0 24,24 v12" fill="none" stroke="${T}" stroke-width="3.5"/>
  ${txt(227,88,'⛽',{s:18,a:'middle'})}
  <circle cx="330" cy="70" r="30" fill="none" stroke="${BAD}" stroke-width="5"/><line x1="309" y1="49" x2="351" y2="91" stroke="${BAD}" stroke-width="5"/>${txt(330,78,'🔥',{s:20,a:'middle'})}
  ${txt(380,52,'engine OFF',{c:OK,w:800,s:14})}${txt(380,72,'key out',{c:OK,w:700,s:13})}${txt(380,92,'no smoking',{c:BAD,w:700,s:13})}${txt(380,112,'ventilated area',{c:D,s:12})}
  ${txt(240,140,'risk: FIRE and EXPLOSION',{c:BAD,w:800,s:12,a:'middle'})}
`), notes:[
  'Заправлять с работающим двигателем нельзя: пары топлива и газ LPG легко вспыхивают от горячего двигателя, выхлопа, искры или статики. Риск — <b>fire and explosion</b>.',
  'Порядок: заглушить двигатель, вынуть ключ, никакого огня и курения, заправка только в отведённом проветриваемом месте.'
]};

FIG.onefork = { title:'One fork arm — never', ru:'Груз на одной виле — нельзя', svg: wrap(480,170,`
  <g transform="translate(16,12)">
    <rect x="0" y="0" width="200" height="124" rx="10" fill="${BAD}" fill-opacity=".1" stroke="${BAD}" stroke-width="2"/>
    <rect x="50" y="28" width="80" height="8" fill="${T}"/>
    <g transform="rotate(-18 120 58)"><rect x="60" y="34" width="86" height="46" fill="${BL}" fill-opacity=".45" stroke="${BL}" stroke-width="2.5"/></g>
    ${txt(100,112,'✗ tips sideways',{c:BAD,w:800,s:14,a:'middle'})}
  </g>
  <g transform="translate(264,12)">
    <rect x="0" y="0" width="200" height="124" rx="10" fill="${OK}" fill-opacity=".1" stroke="${OK}" stroke-width="2"/>
    <rect x="50" y="28" width="80" height="8" fill="${T}"/><rect x="50" y="88" width="80" height="8" fill="${T}"/>
    <rect x="62" y="36" width="90" height="52" fill="${BL}" fill-opacity=".45" stroke="${BL}" stroke-width="2.5"/>
    ${txt(100,112,'✓ two forks, half each',{c:OK,w:800,s:14,a:'middle'})}
  </g>
  ${txt(240,160,'each fork is rated for HALF the load',{c:D,s:11,a:'middle'})}
`), notes:[
  'Две причины, почему нельзя везти груз на одной виле. <b>1.</b> Груз неустойчив: центр тяжести уходит вбок от оси машины — боковое опрокидывание или груз падает.',
  '<b>2.</b> Каждая вила рассчитана на <b>половину</b> грузоподъёмности. Одна вила под полным грузом гнётся, трескается, ломается. Это ещё и нарушение инструкции производителя — незаконно.'
]};

FIG.platform = { title:'Passengers & work platforms', ru:'Пассажиры — нет; люлька — только одобренная', svg: wrap(480,200,`
  ${ground(480,150)}
  ${fk(20,50,1,{load:false})}
  <rect x="190" y="40" width="80" height="70" rx="4" fill="${OK}" fill-opacity=".2" stroke="${OK}" stroke-width="3"/>
  <path d="M190,62 h80 M190,84 h80" stroke="${OK}" stroke-width="2"/>
  ${person(230,100,T,.8)}
  ${txt(230,30,'approved platform',{c:OK,w:800,s:12,a:'middle'})}
  ${txt(380,50,'PASSENGERS',{c:BAD,w:800,s:15,a:'middle'})}${txt(380,70,'✗ NO',{c:BAD,w:800,s:18,a:'middle'})}
  ${txt(380,100,'no seat · no belt',{c:D,s:12,a:'middle'})}${txt(380,116,'no protection',{c:D,s:12,a:'middle'})}
  ${txt(240,184,'nobody rides on the forks, the load or the counterweight',{c:D,s:11,a:'middle'})}
`), notes:[
  'Погрузчик рассчитан на <b>одного</b> оператора: второго сиденья, ремня и защиты нет. Пассажир падает, при опрокидывании вылетает и попадает под защитную крышу, может задеть рычаги.',
  'Единственное исключение — специально сделанная и одобренная рабочая платформа (<b>work platform, man cage</b>), надёжно закреплённая, по письменной процедуре. Оператор при этом остаётся в кресле, и платформа — только для подъёма, не для перемещения.',
  'Никогда не поднимать и не опускать груз над людьми: груз может соскользнуть или упасть при отказе гидравлики.'
]};

FIG.jib = { title:'Jib attachment', ru:'Jib (стрела с крюком): длинный рычаг и качающийся груз', svg: wrap(480,230,`
  ${ground(480,160)}
  ${fk(10,60,1,{load:false})}
  <path d="M176,120 L360,62" stroke="${T}" stroke-width="7" stroke-linecap="round"/>
  <path d="M360,62 v34 q0,9 -7,9" fill="none" stroke="${T}" stroke-width="3.5"/>
  <rect x="326" y="108" width="64" height="44" rx="3" fill="${BL}" fill-opacity=".45" stroke="${BL}" stroke-width="2.5"/>
  <path d="M356,106 q-16,-22 -32,-34" fill="none" stroke="${BAD}" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#ah)"/>${txt(318,66,'swings',{c:BAD,w:800,s:13,a:'end'})}
  <path d="M146,164 L134,184 L158,184 z" fill="${BAD}" stroke="${T}" stroke-width="2"/>${txt(146,200,'fulcrum',{c:BAD,w:800,s:11,a:'middle'})}
  ${arrow(176,196,358,196,A,3)}${txt(268,216,'load centre — far forward',{c:A,w:800,s:13,a:'middle'})}
  ${txt(100,24,'capacity ↓↓ · own data plate · know hook SWL',{c:T,w:700,s:12})}
`), notes:[
  '<b>Jib</b> — стрела с крюком, надевается на вилы. Она сама весит и выносит груз далеко вперёд от точки опоры (<b>fulcrum</b>), поэтому грузоподъёмность <b>резко падает</b>, и тем сильнее, чем длиннее вылет.',
  'Груз на крюке висит свободно и качается — центр тяжести «гуляет». Ехать медленно, груз как можно ниже.',
  'Для jib нужна отдельная табличка со сниженной грузоподъёмностью по каждому положению стрелы, и нужно знать <b>SWL</b> (safe working load) крюков. То же правило для любой навески: одобрена, установлена по инструкции, своя табличка.'
]};

FIG.attachments = { title:'8 attachments', ru:'Восемь навесок и правило для каждой', svg: wrap(480,330,`
  ${[
    ['Rotator',`<circle cx="0" cy="0" r="15" fill="none" stroke="${A}" stroke-width="3.5"/><path d="M11,-11 l7,-2 l-2,7" fill="none" stroke="${A}" stroke-width="3"/>`],
    ['Drum handler',`<rect x="-10" y="-15" width="20" height="30" rx="4" fill="${BL}" fill-opacity=".5" stroke="${BL}" stroke-width="2.5"/><path d="M-10,-6 h20 M-10,6 h20" stroke="${BL}" stroke-width="2"/>`],
    ['Carpet pole',`<rect x="-18" y="-3" width="36" height="6" fill="${T}"/><circle cx="4" cy="0" r="10" fill="${BL}" fill-opacity=".5" stroke="${BL}" stroke-width="2.5"/>`],
    ['Jib + hooks',`<path d="M-15,9 L13,-11 v11 q0,6 -5,6" fill="none" stroke="${T}" stroke-width="3.5"/>`],
    ['Roll / bale clamp',`<path d="M-13,-13 q-7,13 0,26 M13,-13 q7,13 0,26" fill="none" stroke="${T}" stroke-width="3.5"/><circle cx="0" cy="0" r="9" fill="${BL}" fill-opacity=".5" stroke="${BL}" stroke-width="2.5"/>`],
    ['Work platform',`<rect x="-15" y="-11" width="30" height="24" fill="${OK}" fill-opacity=".25" stroke="${OK}" stroke-width="2.5"/><circle cx="0" cy="-4" r="4" fill="${T}"/><path d="M0,0 v9" stroke="${T}" stroke-width="2.5"/>`],
    ['Fork extensions',`<rect x="-18" y="-3" width="22" height="6" fill="${T}"/><rect x="4" y="-3" width="14" height="6" fill="${A}"/>`],
    ['Brick / block clamp',`<rect x="-15" y="-9" width="30" height="18" fill="${BL}" fill-opacity=".5" stroke="${BL}" stroke-width="2.5"/><path d="M-18,-12 v24 M18,-12 v24" stroke="${T}" stroke-width="3.5"/>`]
  ].map(([n,ic],i)=>{const col=i%2, row=Math.floor(i/2), x=14+col*232, y=12+row*74;
    return `<rect x="${x}" y="${y}" width="220" height="62" rx="10" fill="${L}" fill-opacity=".4" stroke="${L}"/><g transform="translate(${x+36},${y+31})">${ic}</g>${badge(x+204,y+16,String(i+1),A,10)}${txt(x+72,y+37,n,{c:T,w:800,s:14})}`;}).join('')}
  ${txt(240,320,'all: approved · fitted per manufacturer · own de-rated data plate',{c:D,s:11,a:'middle'})}
`), notes:[
  '<b>1 · Rotator</b> (ротатор, крутит вилы): следи за клиренсом — хватает ли места под вращение. <b>2 · Drum handler</b> (захват для бочек): до подъёма прочитать <b>SDS</b> — что в бочке.',
  '<b>3 · Carpet pole</b> (штырь для рулонов): ехать задним ходом. <b>4 · Jib with hooks</b> (стрела): узнать <b>SWL</b> крюков.',
  '<b>5 · Roll / bale clamp</b> (зажим): для бумажных рулонов. <b>6 · Work platform</b> (люлька): оператор остаётся в кресле.',
  '<b>7 · Fork extensions</b> (удлинители): не длиннее <b>1,5 ×</b> исходной вилы. <b>8 · Brick / block clamp</b> (захват для кирпича): спланировать путь с запасом на поворот.',
  'Общее правило: навеска одобрена для этой машины, установлена по инструкции производителя, на погрузчике есть отдельная табличка со сниженной грузоподъёмностью.'
]};

FIG.weather = { title:'Weather & environment', ru:'Шесть опасных погодных условий', svg: wrap(480,190,`
  ${[['🌧','Heavy rain'],['💨','Strong wind'],['⛈','Storms'],['🌫','Fog / dust'],['🌡','Heat / cold'],['🌊','Flooding / mud']].map(([ic,n],i)=>{const col=i%3,row=Math.floor(i/3),x=14+col*154,y=12+row*76;
    return `<rect x="${x}" y="${y}" width="144" height="64" rx="10" fill="${L}" fill-opacity=".4" stroke="${L}"/>${txt(x+28,y+42,ic,{s:26,a:'middle'})}${txt(x+54,y+38,n,{c:T,w:800,s:13})}`;}).join('')}
  ${txt(240,180,'get the forecast → plan the day, not react to it',{c:A,w:700,s:12,a:'middle'})}
`), notes:[
  '<b>Heavy rain</b> — скользко, длиннее тормозной путь. <b>Strong wind</b> — порывы валят высокий или широкий груз. <b>Storms</b> — гроза, молния.',
  '<b>Fog, dust, smoke</b> — плохая видимость. <b>Extreme heat / cold</b> — тепловой удар, лёд, иней. <b>Flooding, mud</b> — вода прячет ямы и люки.',
  'Прогноз погоды нужен, чтобы <b>спланировать заранее</b>: перенести или остановить работу, выбрать маршруты и твёрдый грунт, закрепить груз, добавить освещение, СИЗ, перерывы. Незапланированная опасность превращается в управляемую.'
]};

FIG.ground = { title:'Ground conditions', ru:'Поверхности: что отмечать как опасное (K.E.19)', svg: wrap(480,230,`
  ${['Backfilled ground','Potholes','Cracked bitumen','Railway tracks','Cracked concrete','Rough uneven','Soft soil','Sloping surface','Trench covers'].map((s,i)=>{const col=i%3,row=Math.floor(i/3),x=14+col*154,y=12+row*46;
    return `<rect x="${x}" y="${y}" width="144" height="38" rx="8" fill="${BAD}" fill-opacity=".14" stroke="${BAD}" stroke-opacity=".7" stroke-width="1.5"/>${txt(x+12,y+25,'✓',{c:BAD,w:800,s:15})}${txt(x+32,y+24,s,{c:T,w:600,s:12})}`;}).join('')}
  ${['Hard compacted soil','Firm level site','Smooth concrete'].map((s,i)=>{const x=14+i*154,y=166;
    return `<rect x="${x}" y="${y}" width="144" height="38" rx="8" fill="${OK}" fill-opacity=".14" stroke="${OK}" stroke-opacity=".7" stroke-width="1.5"/>${txt(x+12,y+25,'–',{c:OK,w:800,s:15})}${txt(x+32,y+24,s,{c:D,w:600,s:12})}`;}).join('')}
  ${txt(240,222,'red = tick as unsafe (9) · green = suitable, leave blank (3)',{c:D,s:11,a:'middle'})}
`), notes:[
  'В задании список из 12 поверхностей; отметить нужно <b>девять</b> опасных: насыпной грунт (проседает), ямы, битый асфальт, рельсы, битый бетон, неровная поверхность, мягкая почва, уклон, крышки траншей (могут не выдержать).',
  'Три не отмечаем — они пригодны: твёрдый утрамбованный грунт, ровная твёрдая площадка, гладкий бетонный пол.'
]};

FIG.traffic = { title:'Traffic management methods', ru:'Пять способов развести людей и технику (K.E.16)', svg: wrap(480,230,`
  ${[['A','High impact barrier',`<rect x="0" y="10" width="48" height="9" fill="${A}"/><rect x="5" y="19" width="5" height="12" fill="${A}"/><rect x="38" y="19" width="5" height="12" fill="${A}"/>`],
     ['B','Temporary barriers',`<path d="M0,26 l10,-12 l10,12 l10,-12 l10,12 l10,-12" fill="none" stroke="${BAD}" stroke-width="3"/>`],
     ['C','Vehicle route · guardrail & gates',`<rect x="0" y="8" width="48" height="22" fill="none" stroke="${BL}" stroke-width="3" stroke-dasharray="7 4"/>`],
     ['D','Overhead walkways',`<rect x="0" y="4" width="48" height="7" fill="${OK}"/><rect x="5" y="11" width="4" height="20" fill="${OK}"/><rect x="39" y="11" width="4" height="20" fill="${OK}"/>`],
     ['E','Bollards & marked walkways',`<circle cx="7" cy="20" r="5" fill="${A}"/><circle cx="24" cy="20" r="5" fill="${A}"/><circle cx="41" cy="20" r="5" fill="${A}"/><path d="M0,32 h48" stroke="${T}" stroke-width="2.5" stroke-dasharray="5 4"/>`]
    ].map(([k,n,ic],i)=>{const y=10+i*40;
    return `<rect x="14" y="${y}" width="452" height="34" rx="8" fill="${L}" fill-opacity=".4"/>${badge(34,y+17,k,T,12)}<g transform="translate(60,${y+1})">${ic}</g>${txt(124,y+22,n,{c:T,w:700,s:13})}`;}).join('')}
  ${txt(240,222,'separate people from forklifts physically first',{c:D,s:11,a:'middle'})}
`), notes:[
  '<b>A · High impact barrier</b> — тяжёлый стальной барьер вдоль стены, отделяет пешеходную дорожку. <b>B · Temporary barriers</b> — временные раздвижные ограждения со знаком No Entry.',
  '<b>C · Vehicle route with guardrail and gates</b> — огороженный маршрут техники с воротами, пешеходы снаружи. <b>D · Overhead walkways</b> — надземные переходы: люди наверху, погрузчики внизу.',
  '<b>E · Bollards and marked walkways</b> — столбики и размеченные дорожки, в том числе на парковке и перекрёстках. Сначала физическое разделение, потом правила, знаки, сигнальщики, жилеты.'
]};

window.FIG = FIG;
})();
