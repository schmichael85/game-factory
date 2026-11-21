/* English word bank for Hebrew speakers.  en | he | emoji | category */
const VOCAB_RAW=`
dog|כלב|🐶|animals
cat|חתול|🐱|animals
horse|סוס|🐴|animals
cow|פרה|🐄|animals
bird|ציפור|🐦|animals
fish|דג|🐟|animals
lion|אריה|🦁|animals
monkey|קוף|🐒|animals
elephant|פיל|🐘|animals
rabbit|ארנב|🐰|animals
snake|נחש|🐍|animals
frog|צפרדע|🐸|animals
bear|דוב|🐻|animals
sheep|כבשה|🐑|animals
chicken|תרנגולת|🐔|animals
duck|ברווז|🦆|animals
mouse|עכבר|🐭|animals
tiger|נמר|🐯|animals
giraffe|ג'ירפה|🦒|animals
turtle|צב|🐢|animals
pig|חזיר|🐷|animals
bee|דבורה|🐝|animals
apple|תפוח|🍎|food
banana|בננה|🍌|food
bread|לחם|🍞|food
milk|חלב|🥛|food
egg|ביצה|🥚|food
cheese|גבינה|🧀|food
water|מים|💧|food
cake|עוגה|🍰|food
pizza|פיצה|🍕|food
orange|תפוז|🍊|food
grapes|ענבים|🍇|food
carrot|גזר|🥕|food
tomato|עגבנייה|🍅|food
ice cream|גלידה|🍦|food
chocolate|שוקולד|🍫|food
salad|סלט|🥗|food
rice|אורז|🍚|food
juice|מיץ|🧃|food
cookie|עוגייה|🍪|food
sandwich|כריך|🥪|food
mother|אמא|👩|family
father|אבא|👨|family
brother|אח|👦|family
sister|אחות|👧|family
baby|תינוק|👶|family
grandmother|סבתא|👵|family
grandfather|סבא|👴|family
friend|חבר|🤝|family
teacher|מורה|🧑‍🏫|family
family|משפחה|👨‍👩‍👧‍👦|family
book|ספר|📖|school
pencil|עיפרון|✏️|school
school|בית ספר|🏫|school
bag|תיק|🎒|school
computer|מחשב|💻|school
ruler|סרגל|📏|school
scissors|מספריים|✂️|school
notebook|מחברת|📓|school
homework|שיעורי בית|📝|school
clock|שעון|🕒|school
house|בית|🏠|home
door|דלת|🚪|home
window|חלון|🪟|home
bed|מיטה|🛏️|home
chair|כיסא|🪑|home
table|שולחן||home
kitchen|מטבח|🍳|home
room|חדר||home
garden|גינה|🌷|home
key|מפתח|🔑|home
phone|טלפון|📱|home
lamp|מנורה|💡|home
head|ראש||body
hand|יד|✋|body
eye|עין|👁️|body
nose|אף|👃|body
ear|אוזן|👂|body
mouth|פה|👄|body
foot|כף רגל|🦶|body
leg|רגל|🦵|body
hair|שיער||body
teeth|שיניים|🦷|body
sun|שמש|☀️|nature
moon|ירח|🌙|nature
star|כוכב|⭐|nature
tree|עץ|🌳|nature
flower|פרח|🌸|nature
rain|גשם|🌧️|nature
snow|שלג|❄️|nature
sea|ים|🌊|nature
mountain|הר|⛰️|nature
cloud|ענן|☁️|nature
car|מכונית|🚗|places
bus|אוטובוס|🚌|places
bike|אופניים|🚲|places
train|רכבת|🚆|places
plane|מטוס|✈️|places
boat|סירה|⛵|places
park|פארק|🏞️|places
shop|חנות|🏪|places
hospital|בית חולים|🏥|places
beach|חוף ים|🏖️|places
city|עיר|🏙️|places
shirt|חולצה|👕|clothes
shoes|נעליים|👟|clothes
hat|כובע|🧢|clothes
dress|שמלה|👗|clothes
socks|גרביים|🧦|clothes
coat|מעיל|🧥|clothes
eat|לאכול|🍽️|verbs
drink|לשתות|🥤|verbs
run|לרוץ|🏃|verbs
swim|לשחות|🏊|verbs
read|לקרוא||verbs
write|לכתוב|✍️|verbs
sleep|לישון|😴|verbs
play|לשחק|⚽|verbs
sing|לשיר|🎤|verbs
dance|לרקוד|💃|verbs
jump|לקפוץ||verbs
walk|ללכת|🚶|verbs
open|לפתוח||verbs
cook|לבשל||verbs
draw|לצייר|🎨|verbs
listen|להקשיב||verbs
buy|לקנות|🛒|verbs
help|לעזור||verbs
climb|לטפס|🧗|verbs
wash|לרחוץ|🧼|verbs
red|אדום|🟥|colors
blue|כחול|🟦|colors
green|ירוק|🟩|colors
yellow|צהוב|🟨|colors
black|שחור|⬛|colors
white|לבן|⬜|colors
pink|ורוד|🩷|colors
purple|סגול|🟪|colors
brown|חום|🟫|colors
`;
const VOCAB=VOCAB_RAW.trim().split('\n').map(l=>{const[en,he,e,cat]=l.split('|');return{en,he,e,cat}});
const CATS={animals:'בעלי חיים',food:'אוכל',family:'משפחה ואנשים',school:'בית ספר',home:'בבית',body:'גוף',nature:'טבע',places:'תחבורה ומקומות',clothes:'בגדים',verbs:'פעלים',colors:'צבעים'};
const NUMS=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const COLORS={red:'#d93025',blue:'#1a73e8',green:'#1e8e3e',yellow:'#f9d43a',black:'#202124',white:'#ffffff',pink:'#ff8fc8',purple:'#8e44ad',brown:'#8a5a32',orange:'#f39c12',gray:'#9aa0a6'};
const colorBox=(c,size=70)=>`<span style="display:inline-block;width:${size}px;height:${size}px;background:${COLORS[c]};border:3px solid #222;vertical-align:middle"></span>`;
/* same-category distractors, never sharing the English word or the Hebrew meaning */
function vOthers(w,n=3,pool=VOCAB){const same=pool.filter(x=>x.cat===w.cat&&x.en!==w.en&&x.he!==w.he);const rest=pool.filter(x=>x.cat!==w.cat&&x.en!==w.en&&x.he!==w.he);
  return shuffle(same).concat(shuffle(rest)).slice(0,n)}
const vw=en=>VOCAB.find(x=>x.en===en);
