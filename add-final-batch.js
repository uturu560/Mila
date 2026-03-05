const fs = require("fs");
const path = require("path");

const dailyPath = path.join(__dirname, "daily-words.json");
const data = JSON.parse(fs.readFileSync(dailyPath, "utf8"));
const existing = data.pairs || [];
const usedEmojis = new Set(existing.map((p) => p[2]));

// Generate candidate emojis from Unicode ranges (Misc Symbols, Dingbats, Emoticons, Misc Symbols and Pictographs, Supplemental Symbols)
const ranges = [
  [0x1f300, 0x1f5ff], // Misc Symbols and Pictographs
  [0x1f600, 0x1f64f], // Emoticons
  [0x1f680, 0x1f6ff], // Transport and Map
  [0x1f900, 0x1f9ff], // Supplemental Symbols and Pictographs
  [0x1fa00, 0x1fa6f], // Chess Symbols
  [0x1fa70, 0x1faff], // Symbols and Pictographs Extended-A
  [0x2600, 0x26ff],   // Misc symbols
  [0x2700, 0x27bf],   // Dingbats
];

const candidateEmojis = [];
for (const [start, end] of ranges) {
  for (let u = start; u <= end; u++) {
    try {
      const c = String.fromCodePoint(u);
      if (!usedEmojis.has(c)) candidateEmojis.push(c);
    } catch (_) {}
  }
}

// 523 [Chinese, English] pairs - we'll assign emojis from candidateEmojis
const wordPairs = [
  ["树懒", "sloth"], ["野牛", "bison"], ["河狸", "beaver"], ["渡渡鸟", "dodo"], ["臭鼬", "skunk"],
  ["牡蛎", "oyster"], ["扁面包", "flatbread"], ["火锅", "hotpot"], ["豆", "beans"], ["青柠", "lime"],
  ["拐杖", "crutch"], ["风筝", "kite"], ["回旋镖", "boomerang"], ["魔杖", "magic wand"], ["皮纳塔", "pinata"],
  ["套娃", "nesting dolls"], ["溜溜球", "yo-yo"], ["长笛", "flute"], ["硬币", "coin"], ["救生衣", "life jacket"],
  ["螺丝刀", "screwdriver"], ["门铃", "doorbell"], ["盆栽", "potted plant"], ["锄头", "hoe"], ["缝纫针", "sewing needle"],
  ["结", "knot"], ["木头", "wood"], ["岩石", "rock"], ["羽毛", "feather"], ["翅膀", "wing"],
  ["玫瑰", "rose"], ["枯萎的花", "wilted flower"], ["花蕾", "blossom"], ["三叶草", "clover"], ["枫叶", "maple leaf"],
  ["落叶", "fallen leaf"], ["棕榈树", "palm"], ["栗子", "chestnut"], ["青苹果", "green apple"], ["红薯", "sweet potato"],
  ["玉米卷", "taco"], ["饭团", "rice ball"], ["咖喱", "curry"], ["意大利面", "spaghetti"], ["章鱼烧", "takoyaki"],
  ["便当", "bento"], ["甜饼", "rice cracker"], ["月饼", "moon cake"], ["棒棒糖", "lollipop"], ["奶瓶", "baby bottle"],
  ["干杯", "clinking glasses"], ["外卖", "takeout box"], ["计时器", "timer"], ["怀表", "mantelpiece clock"], ["书签", "bookmark"],
  ["日元", "yen"], ["信用卡", "credit card"], ["收据", "receipt"], ["斧头", "axe"], ["镐", "pick"],
  ["齿轮", "gear"], ["链子", "chains"], ["手杖", "probing cane"], ["保险箱", "safe"], ["消防栓", "fire extinguisher"],
  ["烟", "cigarette"], ["棺材", "coffin"], ["骨灰瓮", "funeral urn"], ["工厂", "factory"], ["日本城堡", "japanese castle"],
  ["雕像", "statue of liberty"], ["清真寺", "mosque"], ["犹太教堂", "synagogue"], ["加油站", "fuel pump"], ["红绿灯", "traffic light"],
  ["路障", "construction"], ["锚", "anchor"], ["独木舟", "canoe"], ["快艇", "speedboat"], ["客轮", "passenger ship"],
  ["渡轮", "ferry"], ["摩托艇", "motor boat"], ["小船", "ship"], ["高铁", "high-speed train"], ["轻轨", "light rail"],
  ["电车", "tram"], ["单轨", "monorail"], ["登山铁路", "mountain railway"], ["有轨电车", "tram car"], ["迎面而来的巴士", "oncoming bus"],
  ["无轨电车", "trolleybus"], ["迷你巴士", "minibus"], ["警车", "police car"], ["跑车", "sport utility vehicle"], ["卡车", "delivery truck"],
  ["拖车", "articulated lorry"], ["拖拉机", "tractor"], ["滑板车", "kick scooter"], ["摩托车", "motorcycle"], ["轮椅", "wheelchair"],
  ["停止标志", "stop sign"], ["帆船", "sailboat"], ["雪山", "snow-capped mountain"], ["富士山", "mount fuji"], ["沙滩", "beach with umbrella"],
  ["荒岛", "desert island"], ["丛林", "jungle"], ["古典建筑", "classical building"], ["建筑", "building construction"], ["砖", "brick"],
  ["小屋", "hut"], ["废弃房屋", "derelict house"], ["爱情酒店", "love hotel"], ["便利店", "convenience store"], ["百货", "department store"],
  ["世界地图", "world map"], ["日本地图", "map of japan"], ["卷轴", "scroll"], ["发件箱", "outbox tray"], ["打开的文件夹", "open folder"],
  ["撕下的日历", "tear-off calendar"], ["卡片索引", "card index"], ["上升图表", "chart increasing"], ["下降图表", "chart decreasing"], ["条形图", "bar chart"],
  ["剪贴板", "clipboard"], ["图钉", "pushpin"], ["圆图钉", "round pushpin"], ["回形针", "paperclips"], ["三角尺", "triangular ruler"],
  ["卡片盒", "card file box"], ["文件柜", "file cabinet"], ["锁", "locked"], ["开锁", "unlocked"], ["锁和笔", "locked with pen"],
  ["钥匙锁", "locked with key"], ["锤子和镐", "hammer and pick"], ["锤子和扳手", "hammer and wrench"], ["匕首", "dagger"], ["交叉的剑", "crossed swords"],
  ["手枪", "pistol"], ["弓和箭", "bow and arrow"], ["扳手", "wrench"], ["螺母和螺栓", "nut and bolt"], ["夹子", "clamp"],
  ["潜水", "diving"], ["跑步者", "runner"], ["滑雪者", "skier"], ["冲浪者", "surfer"], ["划船", "rowing"],
  ["骑马", "horse racing"], ["游泳者", "swimmer"], ["举重者", "weight lifter"], ["高尔夫球手", "golfer"], ["登山者", "mountain climber"],
  ["自行车手", "bicyclist"], ["赛马", "horse racing"], ["足球", "soccer ball"], ["篮球", "basketball"], ["排球", "volleyball"],
  ["橄榄球", "football"], ["棒球", "baseball"], ["垒球", "softball"], ["网球", "tennis"], ["台球", "billiards"],
  ["保龄球", "bowling"], ["板球", "cricket"], ["曲棍球", "field hockey"], ["冰球", "ice hockey"], ["飞镖", "dart"],
  ["钓鱼竿", "fishing pole"], ["拳击手套", "boxing glove"], ["武术服", "martial arts uniform"], ["奖牌", "medal"], ["奖杯", "trophy"],
  ["体育场", "stadium"], ["赛马场", "horse racing"], ["滑雪场", "ski"], ["帐篷", "tent"], ["背包", "backpack"],
  ["睡袋", "sleeping bag"], ["登山靴", "hiking boot"], ["滑雪板", "skis"], ["雪橇", "sled"], ["冰鞋", "ice skate"],
  ["弓箭", "bow and arrow"], ["钓鱼", "fishing"], ["游泳", "swimming"], ["冲浪", "surfing"], ["划船", "rowing boat"],
  ["独木舟", "canoe"], ["帆板", "sailboat"], ["潜水", "scuba"], ["水肺", "diving"], ["救生圈", "life buoy"],
  ["沙滩球", "beach ball"], ["雨伞", "beach umbrella"], ["防晒霜", "sunscreen"], ["比基尼", "bikini"], ["泳裤", "swim trunks"],
  ["浴巾", "bath towel"], ["拖鞋", "flip flops"], ["凉鞋", "sandal"], ["运动鞋", "athletic shoe"], ["高跟鞋", "high heel"],
  ["靴子", "boot"], ["雨靴", "rain boot"], ["雪靴", "snow boot"], ["工作靴", "work boot"], ["马靴", "cowboy boot"],
  ["凉鞋", "sandal"], ["人字拖", "thong sandal"], ["木屐", "clog"], ["芭蕾舞鞋", "ballet shoes"], ["婴儿鞋", "baby shoe"],
  ["领结", "bow tie"], ["领带", "necktie"], ["围巾", "scarf"], ["手套", "gloves"], ["棒球帽", "baseball cap"],
  ["礼帽", "top hat"], ["毕业帽", "graduation cap"], ["王冠", "crown"], ["头盔", "helmet"], ["警帽", "police cap"],
  ["护士帽", "nurse cap"], ["厨师帽", "chef hat"], ["魔术帽", "magic hat"], ["小丑帽", "clown hat"], ["生日帽", "party hat"],
  ["圣诞帽", "santa hat"], ["睡帽", "sleeping cap"], ["浴帽", "shower cap"], ["发带", "headband"], ["发夹", "hair clip"],
  ["梳子", "comb"], ["发刷", "hair brush"], ["吹风机", "hair dryer"], ["卷发棒", "curling iron"], ["直发器", "straightener"],
  ["剃须刀", "razor"], ["电动剃须刀", "electric razor"], ["指甲刀", "nail clippers"], ["指甲锉", "nail file"], ["睫毛膏", "mascara"],
  ["眼影", "eye shadow"], ["腮红", "blush"], ["粉底", "foundation"], ["遮瑕膏", "concealer"], ["散粉", "powder"],
  ["唇线笔", "lip liner"], ["眉笔", "eyebrow pencil"], ["眼线笔", "eyeliner"], ["假睫毛", "false eyelashes"], ["化妆刷", "makeup brush"],
  ["粉扑", "powder puff"], ["化妆棉", "cotton pad"], ["卸妆液", "makeup remover"], ["洗面奶", "facial cleanser"], ["爽肤水", "toner"],
  ["精华液", "serum"], ["面霜", "moisturizer"], ["眼霜", "eye cream"], ["防晒霜", "sunscreen"], ["面膜", "face mask"],
  ["身体乳", "body lotion"], ["护手霜", "hand cream"], ["润唇膏", "lip balm"], ["除臭剂", "deodorant"], ["止汗剂", "antiperspirant"],
  ["香水", "perfume"], ["古龙水", "cologne"], ["精油", "essential oil"], ["香薰", "aromatherapy"], ["蜡烛", "scented candle"],
  ["肥皂", "bar soap"], ["沐浴露", "body wash"], ["洗发水", "shampoo"], ["护发素", "conditioner"], ["发膜", "hair mask"],
  ["染发剂", "hair dye"], ["脱毛膏", "hair removal cream"], ["剃须膏", "shaving cream"], ["牙膏", "toothpaste"], ["牙线", "dental floss"],
  ["漱口水", "mouthwash"], ["舌刮", "tongue scraper"], ["电动牙刷", "electric toothbrush"], ["牙签", "toothpick"], ["假牙", "dentures"],
  ["牙套", "braces"], ["牙冠", "dental crown"], ["牙桥", "dental bridge"], ["种植牙", "dental implant"], ["洗牙", "dental cleaning"],
  ["绷带", "bandage"], ["创可贴", "band-aid"], ["纱布", "gauze"], ["医用胶带", "medical tape"], ["冰袋", "ice pack"],
  ["热敷", "heat pack"], ["体温计", "thermometer"], ["血压计", "blood pressure monitor"], ["血糖仪", "glucose meter"], ["脉搏血氧仪", "pulse oximeter"],
  ["听诊器", "stethoscope"], ["注射器", "syringe"], ["输液", "IV drip"], ["药片", "pill"], ["胶囊", "capsule"],
  ["药水", "liquid medicine"], ["药膏", "ointment"], ["眼药水", "eye drops"], ["鼻喷", "nasal spray"], ["吸入器", "inhaler"],
  ["轮椅", "wheelchair"], ["拐杖", "crutch"], ["助行器", "walker"], ["病床", "hospital bed"], ["担架", "stretcher"],
  ["氧气瓶", "oxygen tank"], ["呼吸机", "ventilator"], ["除颤器", "defibrillator"], ["手术刀", "scalpel"], ["镊子", "tweezers"],
  ["缝合针", "suture needle"], ["止血钳", "hemostat"], ["扩张器", "speculum"], ["窥镜", "endoscope"], ["超声波", "ultrasound"],
  ["X光机", "X-ray machine"], ["CT扫描", "CT scan"], ["核磁共振", "MRI"], ["心电图", "ECG"], ["脑电图", "EEG"],
  ["血糖试纸", "glucose test strip"], ["验孕棒", "pregnancy test"], ["避孕套", "condom"], ["宫内节育器", "IUD"], ["避孕药", "birth control pill"],
  ["维生素", "vitamin"], ["钙片", "calcium supplement"], ["鱼油", "fish oil"], ["益生菌", "probiotic"], ["褪黑素", "melatonin"],
  ["止痛药", "pain reliever"], ["退烧药", "fever reducer"], ["抗组胺药", "antihistamine"], ["止咳药", "cough medicine"], ["泻药", "laxative"],
  ["止泻药", "antidiarrheal"], ["抗酸药", "antacid"], ["安眠药", "sleeping pill"], ["抗抑郁药", "antidepressant"], ["抗生素", "antibiotic"],
  ["创可贴", "adhesive bandage"], ["急救包", "first aid kit"], ["灭火器", "fire extinguisher"], ["烟雾报警器", "smoke detector"], ["一氧化碳报警器", "carbon monoxide detector"],
  ["安全帽", "safety helmet"], ["护目镜", "safety goggles"], ["耳塞", "earplugs"], ["防毒面具", "gas mask"], ["防护服", "hazmat suit"],
  ["手套", "safety gloves"], ["护膝", "knee pad"], ["护肘", "elbow pad"], ["护腕", "wrist guard"], ["护踝", "ankle guard"],
  ["护齿", "mouth guard"], ["护胸", "chest protector"], ["护腿", "shin guard"], ["头盔", "sports helmet"], ["面罩", "face mask"],
  ["护颈", "neck brace"], ["腰托", "back brace"], ["拐杖", "walking stick"], ["助听器", "hearing aid"], ["眼镜", "eyeglasses"],
  ["隐形眼镜", "contact lenses"], ["放大镜", "magnifying glass"], ["望远镜", "binoculars"], ["显微镜", "microscope"], ["单筒望远镜", "monocular"],
  ["相机", "camera"], ["镜头", "camera lens"], ["三脚架", "tripod"], ["闪光灯", "flash"], ["遥控器", "remote shutter"],
  ["滤镜", "filter"], ["相机包", "camera bag"], ["存储卡", "memory card"], ["读卡器", "card reader"], ["电池", "battery"],
  ["充电器", "charger"], ["移动电源", "power bank"], ["数据线", "USB cable"], ["耳机", "earphones"], ["扬声器", "speaker"],
  ["麦克风", "microphone"], ["混音器", "mixer"], ["调音台", "audio mixer"], ["效果器", "effects pedal"], ["节拍器", "metronome"],
  ["音叉", "tuning fork"], ["乐谱", "sheet music"], ["乐谱架", "music stand"], ["琴弓", "violin bow"], ["琴弦", "guitar string"],
  ["鼓槌", "drumstick"], ["鼓皮", "drum head"], ["拨片", "guitar pick"], ["变调夹", "capo"], ["变调夹", "capo"],
  ["口琴", "harmonica"], ["手风琴", "accordion"], ["竖琴", "harp"], ["木琴", "xylophone"], ["马林巴", "marimba"],
  ["三角铁", "triangle"], ["铃鼓", "tambourine"], ["沙锤", "maracas"], ["响板", "castanets"], ["铙钹", "cymbals"],
  ["锣", "gong"], ["编钟", "chimes"], ["钟琴", "glockenspiel"], ["管钟", "tubular bells"], ["风铃", "wind chimes"],
  ["笛子", "bamboo flute"], ["箫", "xiao"], ["唢呐", "suona"], ["二胡", "erhu"], ["古筝", "guzheng"],
  ["琵琶", "pipa"], ["扬琴", "yangqin"], ["古琴", "guqin"], ["阮", "ruan"], ["笙", "sheng"],
  ["埙", "xun"], ["编钟", "bianzhong"], ["木鱼", "wooden fish"], ["磬", "qing"], ["钹", "bo"],
  ["鼓", "drum"], ["大鼓", "bass drum"], ["小鼓", "snare drum"], ["定音鼓", "timpani"], ["邦戈鼓", "bongo"],
  ["康加鼓", "conga"], ["手鼓", "djembe"], ["太鼓", "taiko"], ["军鼓", "military drum"], ["铃鼓", "tambourine"],
  ["沙球", "shaker"], ["牛铃", "cowbell"], ["木块", "wood block"], ["刮板", "guiro"], ["卡巴萨", "cabasa"],
  ["音树", "wind chime"], ["雨声器", "rain stick"], ["海浪鼓", "ocean drum"], ["雷声板", "thunder sheet"], ["风笛", "bagpipes"],
  ["风琴", "organ"], ["键盘", "keyboard"], ["合成器", "synthesizer"], ["电子琴", "electronic keyboard"], ["电钢琴", "electric piano"],
  ["电吉他", "electric guitar"], ["贝斯", "bass guitar"], ["尤克里里", "ukulele"], ["曼陀林", "mandolin"], ["班卓琴", "banjo"],
  ["竖琴", "harp"], ["大键琴", "harpsichord"], ["古钢琴", "clavichord"], ["管风琴", "pipe organ"], ["手风琴", "accordion"],
  ["口风琴", "melodica"], ["卡林巴", "kalimba"], ["拇指琴", "thumb piano"], ["迪吉里杜管", "didgeridoo"], ["排箫", "pan flute"],
  ["陶笛", "ocarina"], ["哨子", "whistle"], ["卡祖笛", "kazoo"], ["牛角号", "vuvuzela"], ["小号", "trumpet"],
  ["长号", "trombone"], ["圆号", "french horn"], ["大号", "tuba"], ["短号", "cornet"], ["次中音号", "euphonium"],
  ["上低音号", "baritone horn"], ["苏萨号", "sousaphone"], ["单簧管", "clarinet"], ["双簧管", "oboe"], ["巴松管", "bassoon"],
  ["长笛", "flute"], ["短笛", "piccolo"], ["萨克斯", "saxophone"], ["竖笛", "recorder"], ["风笛", "bagpipes"],
  ["口琴", "harmonica"], ["手风琴", "accordion"], ["管风琴", "organ"], ["电子琴", "synthesizer"], ["鼓机", "drum machine"],
  ["采样器", "sampler"], ["效果器", "effects unit"], ["调音器", "tuner"], ["节拍器", "metronome"], ["音叉", "tuning fork"],
  ["乐谱", "music stand"], ["谱架", "music stand"], ["琴凳", "piano bench"], ["琴盖", "piano lid"], ["琴键", "piano key"],
  ["琴弦", "piano string"], ["音锤", "piano hammer"], ["踏板", "piano pedal"], ["弱音踏板", "soft pedal"], ["延音踏板", "sustain pedal"],
  ["调音栓", "tuning peg"], ["琴桥", "bridge"], ["指板", "fretboard"], ["品丝", "fret"], ["琴身", "body"],
  ["琴颈", "neck"], ["琴头", "headstock"], ["音孔", "sound hole"], ["拾音器", "pickup"], ["音量旋钮", "volume knob"],
  ["音色旋钮", "tone knob"], ["开关", "switch"], ["插孔", "jack"], ["背带", "strap"], ["琴包", "gig bag"],
  ["琴盒", "case"], ["支架", "stand"], ["谱架", "music stand"], ["话筒架", "microphone stand"], ["落地灯", "floor lamp"],
  ["台灯", "desk lamp"], ["吊灯", "chandelier"], ["壁灯", "wall lamp"], ["床头灯", "bedside lamp"], ["夜灯", "night light"],
  ["手电筒", "flashlight"], ["灯笼", "lantern"], ["烛台", "candlestick"], ["油灯", "oil lamp"], ["煤气灯", "gas lamp"],
  ["霓虹灯", "neon sign"], ["路灯", "street light"], ["车灯", "car light"], ["刹车灯", "brake light"], ["转向灯", "turn signal"],
  ["雾灯", "fog light"], ["远光灯", "high beam"], ["近光灯", "low beam"], ["倒车灯", "reverse light"], ["仪表盘", "dashboard"],
  ["速度表", "speedometer"], ["油表", "fuel gauge"], ["水温表", "temperature gauge"], ["转速表", "tachometer"], ["里程表", "odometer"],
  ["安全带", "seatbelt"], ["安全气囊", "airbag"], ["方向盘", "steering wheel"], ["档把", "gear shift"], ["手刹", "parking brake"],
  ["油门", "accelerator"], ["刹车", "brake pedal"], ["离合器", "clutch"], ["后视镜", "rearview mirror"], ["侧视镜", "side mirror"],
  ["雨刷", "windshield wiper"], ["挡风玻璃", "windshield"], ["天窗", "sunroof"], ["敞篷", "convertible top"], ["后备箱", "trunk"],
  ["引擎盖", "hood"], ["排气管", "exhaust pipe"], ["消音器", "muffler"], ["催化转换器", "catalytic converter"], ["油箱", "fuel tank"],
  ["散热器", "radiator"], ["风扇", "cooling fan"], ["水泵", "water pump"], ["机油泵", "oil pump"], ["发电机", "alternator"],
  ["启动机", "starter"], ["电池", "car battery"], ["火花塞", "spark plug"], ["点火线圈", "ignition coil"], ["节气门", "throttle body"],
  ["空气滤清器", "air filter"], ["机油滤清器", "oil filter"], ["燃油滤清器", "fuel filter"], ["变速箱", "transmission"], ["差速器", "differential"],
  ["传动轴", "drive shaft"], ["半轴", "axle"], ["悬挂", "suspension"], ["减震器", "shock absorber"], ["弹簧", "spring"],
  ["稳定杆", "stabilizer bar"], ["转向机", "steering rack"], ["球头", "ball joint"], ["轴承", "bearing"], ["刹车片", "brake pad"],
  ["刹车盘", "brake disc"], ["刹车鼓", "brake drum"], ["刹车油", "brake fluid"], ["离合器片", "clutch disc"], ["飞轮", "flywheel"],
  ["皮带", "belt"], ["链条", "chain"], ["轮胎", "tire"], ["轮毂", "wheel"], ["轮辋", "rim"],
  ["气门嘴", "valve stem"], ["备胎", "spare tire"], ["千斤顶", "jack"], ["扳手", "wrench"], ["螺丝刀", "screwdriver"],
  ["钳子", "pliers"], ["锤子", "hammer"], ["锯", "saw"], ["钻", "drill"], ["磨光机", "sander"],
  ["电焊", "welder"], ["热风枪", "heat gun"], ["喷枪", "spray gun"], ["压缩机", "compressor"], ["发电机", "generator"],
  ["水泵", "water pump"], ["油泵", "oil pump"], ["液压泵", "hydraulic pump"], ["真空泵", "vacuum pump"], ["离心泵", "centrifugal pump"],
  ["齿轮泵", "gear pump"], ["活塞泵", "piston pump"], ["隔膜泵", "diaphragm pump"], ["潜水泵", "submersible pump"], ["污水泵", "sewage pump"],
  ["消防泵", "fire pump"], ["灌溉泵", "irrigation pump"], ["热水泵", "heat pump"], ["气泵", "air pump"], ["打气筒", "bicycle pump"],
  ["血压计", "sphygmomanometer"], ["听诊器", "stethoscope"], ["体温计", "thermometer"], ["血糖仪", "glucometer"], ["脉搏血氧仪", "pulse oximeter"],
  ["体重秤", "scale"], ["体脂秤", "body fat scale"], ["婴儿秤", "baby scale"], ["厨房秤", "kitchen scale"], ["行李秤", "luggage scale"],
  ["电子秤", "digital scale"], ["机械秤", "mechanical scale"], ["天平", "balance scale"], ["砝码", "weight"], ["卷尺", "tape measure"],
  ["直尺", "ruler"], ["三角尺", "set square"], ["量角器", "protractor"], ["卡尺", "caliper"], ["千分尺", "micrometer"],
  ["水平仪", "level"], ["铅垂线", "plumb line"], ["测距仪", "rangefinder"], ["激光测距", "laser measure"], ["湿度计", "hygrometer"],
  ["气压计", "barometer"], ["风速计", "anemometer"], ["雨量计", "rain gauge"], ["光度计", "light meter"], ["声级计", "sound level meter"],
  ["pH计", "pH meter"], ["电导率仪", "conductivity meter"], ["溶解氧仪", "dissolved oxygen meter"], ["浊度计", "turbidity meter"], ["折射仪", "refractometer"],
  ["显微镜", "microscope"], ["望远镜", "telescope"], ["放大镜", "magnifying glass"], ["内窥镜", "endoscope"], ["腹腔镜", "laparoscope"],
  ["关节镜", "arthroscope"], ["胃镜", "gastroscope"], ["结肠镜", "colonoscope"], ["支气管镜", "bronchoscope"], ["膀胱镜", "cystoscope"],
  ["耳镜", "otoscope"], ["眼底镜", "ophthalmoscope"], ["阴道镜", "colposcope"], ["皮肤镜", "dermatoscope"], ["显微镜", "microscope"],
];

const need = 523;
const available = candidateEmojis.slice(0, need);
const toAdd = [];
for (let i = 0; i < Math.min(need, wordPairs.length, available.length); i++) {
  toAdd.push([wordPairs[i][0], wordPairs[i][1], available[i]]);
}

console.log("Candidates (unused emoji):", candidateEmojis.length);
console.log("Word pairs:", wordPairs.length);
console.log("Adding:", toAdd.length);

data.pairs = [...existing, ...toAdd];
fs.writeFileSync(dailyPath, JSON.stringify(data, null, 0), "utf8");
console.log("New total:", data.pairs.length);
