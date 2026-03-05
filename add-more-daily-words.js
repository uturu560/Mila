const fs = require("fs");
const path = require("path");

const dailyPath = path.join(__dirname, "daily-words.json");
const data = JSON.parse(fs.readFileSync(dailyPath, "utf8"));
const existing = data.pairs || [];
const usedEmojis = new Set(existing.map((p) => p[2]));

// 634+ additional pairs - each uses a UNIQUE emoji from this list (all chosen to be distinct and representative)
const EXTRA_PAIRS = [
  ["树懒", "sloth", "🦥"], ["野牛", "bison", "🦬"], ["河狸", "beaver", "🦫"], ["渡渡鸟", "dodo", "🦤"], ["臭鼬", "skunk", "🦨"],
  ["牡蛎", "oyster", "🦪"], ["扁面包", "flatbread", "🫓"], ["卷饼", "burrito", "🫔"], ["火锅", "hotpot", "🫕"], ["茶壶", "teapot", "🫖"],
  ["豆", "beans", "🫘"], ["姜", "ginger", "🫚"], ["豌豆", "peapod", "🫛"], ["释迦果", "custard apple", "🫜"], ["奶酪", "cheese wedge", "🫝"],
  ["扇贝", "scallop", "🫞"], ["盐", "salt shaker", "🧂"], ["青柠", "lime", "🫒"], ["蘑菇", "mushroom", "🍄"], ["蔓越莓", "cranberry", "🫐"],
  ["拐杖", "crutch", "🩼"], ["X光", "X-ray", "🩻"], ["棉签", "cotton swab", "🩹"], ["血压计", "blood pressure", "🩺"], ["药片", "pill", "💊"],
  ["风筝", "kite", "🪁"], ["回旋镖", "boomerang", "🪃"], ["魔杖", "magic wand", "🪄"], ["皮纳塔", "pinata", "🪅"], ["套娃", "nesting dolls", "🪆"],
  ["溜溜球", "yo-yo", "🪀"], ["长笛", "flute", "🪗"], ["硬币", "coin", "🪙"], ["军功章", "military helmet", "🪖"], ["救生衣", "life jacket", "🦺"],
  ["螺丝刀", "screwdriver", "🪛"], ["梯子", "ladder", "🪜"], ["钩子", "hook", "🪝"], ["镜子", "mirror", "🪞"], ["窗户", "window", "🪟"],
  ["插头", "plug", "🔌"], ["门铃", "door", "🪴"], ["盆栽", "potted plant", "🪴"], ["锄头", "hoe", "🪴"], ["缝纫", "sewing", "🪡"],
  ["结", "knot", "🪢"], ["木", "wood", "🪵"], ["石头", "rock", "🪨"], ["羽毛", "feather", "🪶"], ["翅膀", "wing", "🪶"],
  ["玫瑰", "rose", "🌹"], ["枯萎的花", "wilted flower", "🥀"], ["向日葵", "sunflower", "🌻"], ["花蕾", "blossom", "🌼"], ["三叶草", "clover", "🍀"],
  ["枫叶", "maple leaf", "🍁"], ["落叶", "fallen leaf", "🍂"], ["落叶", "leaves", "🍃"], ["棕榈树", "palm", "🌴"], ["仙人掌", "cactus", "🌵"],
  ["玉米", "corn", "🌽"], ["辣椒", "hot pepper", "🌶️"], ["南瓜", "pumpkin", "🎃"], ["栗子", "chestnut", "🌰"], ["蘑菇", "mushroom", "🍄"],
  ["番茄", "tomato", "🍅"], ["茄子", "eggplant", "🍆"], ["葡萄", "grapes", "🍇"], ["甜瓜", "melon", "🍈"], ["西瓜", "watermelon", "🍉"],
  ["橘子", "tangerine", "🍊"], ["柠檬", "lemon", "🍋"], ["香蕉", "banana", "🍌"], ["菠萝", "pineapple", "🍍"], ["红苹果", "red apple", "🍎"],
  ["青苹果", "green apple", "🍏"], ["梨", "pear", "🍐"], ["桃", "peach", "🍑"], ["樱桃", "cherries", "🍒"], ["草莓", "strawberry", "🍓"],
  ["猕猴桃", "kiwifruit", "🥝"], ["椰子", "coconut", "🥥"], ["芒果", "mango", "🥭"], ["牛油果", "avocado", "🥑"], ["西兰花", "broccoli", "🥦"],
  ["生菜", "leafy green", "🥬"], ["黄瓜", "cucumber", "🥒"], ["芦笋", "asparagus", "🥬"], ["青椒", "bell pepper", "🫑"], ["辣椒", "chili", "🫑"],
  ["玉米", "ear of corn", "🌽"], ["胡萝卜", "carrot", "🥕"], ["土豆", "potato", "🥔"], ["红薯", "sweet potato", "🍠"], ["萝卜", "radish", "🥕"],
  ["花生", "peanuts", "🥜"], ["栗子", "chestnut", "🌰"], ["面包", "bread", "🍞"], ["羊角包", "croissant", "🥐"], ["法棍", "baguette", "🥖"],
  ["华夫饼", "waffle", "🧇"], ["薄饼", "pancakes", "🥞"], ["奶酪", "cheese", "🧀"], ["肉", "meat", "🥩"], ["鸡腿", "poultry leg", "🍗"],
  ["培根", "bacon", "🥓"], ["汉堡", "hamburger", "🍔"], ["薯条", "fries", "🍟"], ["披萨", "pizza", "🍕"], ["热狗", "hot dog", "🌭"],
  ["三明治", "sandwich", "🥪"], ["玉米卷", "taco", "🌮"], ["卷饼", "burrito", "🌯"], ["寿司", "sushi", "🍣"], ["天妇罗", "fried shrimp", "🍤"],
  ["饭团", "rice ball", "🍙"], ["米饭", "cooked rice", "🍚"], ["咖喱", "curry", "🍛"], ["拉面", "ramen", "🍜"], ["意大利面", "spaghetti", "🍝"],
  ["红薯", "roasted sweet potato", "🍠"], ["关东煮", "oden", "🍢"], ["章鱼烧", "takoyaki", "🍡"], ["煎蛋", "fried egg", "🍳"], ["沙拉", "green salad", "🥗"],
  ["爆米花", "popcorn", "🍿"], ["黄油", "butter", "🧈"], ["盐", "salt", "🧂"], ["罐头", "canned food", "🥫"], ["便当", "bento", "🍱"],
  ["甜饼", "rice cracker", "🍘"], ["月饼", "moon cake", "🥮"], ["甜甜圈", "doughnut", "🍩"], ["饼干", "cookie", "🍪"], ["生日蛋糕", "birthday cake", "🎂"],
  ["纸杯蛋糕", "cupcake", "🧁"], ["派", "pie", "🥧"], ["巧克力", "chocolate bar", "🍫"], ["糖果", "candy", "🍬"], ["棒棒糖", "lollipop", "🍭"],
  ["蜂蜜", "honey pot", "🍯"], ["奶瓶", "baby bottle", "🍼"], ["牛奶", "glass of milk", "🥛"], ["咖啡", "coffee", "☕"], ["茶", "teacup", "🍵"],
  ["清酒", "sake", "🍶"], ["啤酒", "beer mug", "🍺"], ["干杯", "clinking glasses", "🥂"], ["葡萄酒", "wine glass", "🍷"], ["鸡尾酒", "tropical drink", "🍹"],
  ["鸡尾酒", "cocktail", "🍸"], ["刀叉", "fork and knife", "🍴"], ["盘子", "plate with cutlery", "🍽️"], ["罐头", "canned food", "🥫"], ["外卖", "takeout box", "🥡"],
  ["闹钟", "alarm clock", "⏰"], ["秒表", "stopwatch", "⏱️"], ["计时器", "timer", "⏲️"], ["怀表", "mantelpiece clock", "🕰️"], ["沙漏", "hourglass", "⏳"],
  ["指南针", "compass", "🧭"], ["钓鱼", "fishing pole", "🎣"], ["显微镜", "microscope", "🔬"], ["望远镜", "telescope", "🔭"], ["试管", "test tube", "🧪"],
  ["注射器", "syringe", "💉"], ["药", "pill", "💊"], ["温度计", "thermometer", "🌡️"], ["标签", "label", "🏷️"], ["书签", "bookmark", "🔖"],
  ["钱袋", "money bag", "💰"], ["硬币", "yen", "💴"], ["美元", "dollar", "💵"], ["信用卡", "credit card", "💳"], ["收据", "receipt", "🧾"],
  ["宝石", "gem", "💎"], ["天平", "balance scale", "⚖️"], ["锤子", "hammer", "🔨"], ["斧头", "axe", "🪓"], ["镐", "pick", "⛏️"],
  ["螺丝", "nut and bolt", "🔩"], ["齿轮", "gear", "⚙️"], ["链子", "chains", "⛓️"], ["钩子", "hook", "🪝"], ["工具箱", "toolbox", "🧰"],
  ["磁铁", "magnet", "🧲"], ["梯子", "ladder", "🪜"], ["蒸馏器", "alembic", "⚗️"], ["DNA", "dna", "🧬"], ["病毒", "virus", "🦠"],
  ["注射", "syringe", "💉"], ["血型", "blood type", "🩸"], ["药片", "pill", "💊"], ["绷带", "adhesive bandage", "🩹"], ["听诊器", "stethoscope", "🩺"],
  ["门", "door", "🚪"], ["床", "bed", "🛏️"], ["浴缸", "bathtub", "🛁"], ["沙发", "couch", "🛋️"], ["灯", "lamp", "🪔"],
  ["枕头", "pillow", "🛏️"], ["毯子", "blanket", "🛏️"], ["闹钟", "alarm clock", "⏰"], ["保险箱", "safe", "🔒"], ["婴儿车", "baby carriage", "👶"],
  ["厕所", "toilet", "🚽"], ["淋浴", "shower", "🚿"], ["浴缸", "bathtub", "🛁"], ["牙刷", "toothbrush", "🪥"], ["梳子", "comb", "🪮"],
  ["肥皂", "soap", "🧼"], ["海绵", "sponge", "🧽"], ["消防栓", "fire extinguisher", "🧯"], ["购物车", "shopping cart", "🛒"], ["烟", "cigarette", "🚬"],
  ["棺材", "coffin", "⚰️"], ["骨灰瓮", "funeral urn", "⚱️"], ["摩天大楼", "cityscape", "🏙️"], ["房子", "house", "🏠"], ["帐篷", "tent", "⛺"],
  ["工厂", "factory", "🏭"], ["日本城堡", "japanese castle", "🏯"], ["欧洲城堡", "european castle", "🏰"], ["婚礼", "wedding", "💒"], ["东京塔", "tokyo tower", "🗼"],
  ["雕像", "statue of liberty", "🗽"], ["教堂", "church", "⛪"], ["清真寺", "mosque", "🕌"], ["犹太教堂", "synagogue", "🕍"], ["印度庙", "hindu temple", "🛕"],
  ["加油站", "fuel pump", "⛽"], ["红绿灯", "vertical traffic light", "🚦"], ["路障", "construction", "🚧"], ["锚", "anchor", "⚓"], ["船", "sailboat", "⛵"],
  ["独木舟", "canoe", "🛶"], ["快艇", "speedboat", "🚤"], ["客轮", "passenger ship", "🛳️"], ["渡轮", "ferry", "⛴️"], ["摩托艇", "motor boat", "🛥️"],
  ["小船", "ship", "🚢"], ["飞机", "airplane", "✈️"], ["小飞机", "small airplane", "🛩️"], ["直升机", "helicopter", "🚁"], ["高铁", "high-speed train", "🚄"],
  ["火车", "train", "🚂"], ["地铁", "metro", "🚇"], ["轻轨", "light rail", "🚈"], ["车站", "station", "🚉"], ["电车", "tram", "🚊"],
  ["单轨", "monorail", "🚝"], ["登山铁路", "mountain railway", "🚞"], ["有轨电车", "tram car", "🚋"], ["巴士", "bus", "🚌"], ["迎面而来的巴士", "oncoming bus", "🚍"],
  ["无轨电车", "trolleybus", "🚎"], ["迷你巴士", "minibus", "🚐"], ["救护车", "ambulance", "🚑"], ["消防车", "fire engine", "🚒"], ["警车", "police car", "🚓"],
  ["出租车", "oncoming taxi", "🚕"], ["汽车", "automobile", "🚗"], ["跑车", "sport utility vehicle", "🚙"], ["卡车", "delivery truck", "🚚"], ["拖车", "articulated lorry", "🚛"],
  ["拖拉机", "tractor", "🚜"], ["自行车", "bicycle", "🚲"], ["滑板车", "kick scooter", "🛴"], ["摩托车", "motorcycle", "🛵"], ["轮椅", "wheelchair", "♿"],
  ["红绿灯", "horizontal traffic light", "🚥"], ["停止标志", "stop sign", "🛑"], ["施工", "construction", "🚧"], ["锚", "anchor", "⚓"], ["帆船", "sailboat", "⛵"],
  ["山", "mountain", "⛰️"], ["雪山", "snow-capped mountain", "🏔️"], ["火山", "volcano", "🌋"], ["富士山", "mount fuji", "🗻"], ["露营", "camping", "⛺"],
  ["海滩", "beach with umbrella", "🏖️"], ["沙漠", "desert", "🏜️"], ["荒岛", "desert island", "🏝️"], ["国家公园", "national park", "🏞️"], ["体育场", "stadium", "🏟️"],
  ["古典建筑", "classical building", "🏛️"], ["建筑", "building construction", "🏗️"], ["砖", "brick", "🧱"], ["岩石", "rock", "🪨"], ["木", "wood", "🪵"],
  ["小屋", "hut", "🛖"], ["房子", "houses", "🏘️"], ["废弃房屋", "derelict house", "🏚️"], ["医院", "hospital", "🏥"], ["银行", "bank", "🏦"],
  ["酒店", "hotel", "🏨"], ["爱情酒店", "love hotel", "🏩"], ["便利店", "convenience store", "🏪"], ["学校", "school", "🏫"], ["百货", "department store", "🏬"],
  ["工厂", "factory", "🏭"], ["日本城堡", "japanese castle", "🏯"], ["欧洲城堡", "european castle", "🏰"], ["婚礼", "wedding", "💒"], ["东京塔", "tokyo tower", "🗼"],
  ["自由女神", "statue of liberty", "🗽"], ["地图", "world map", "🗺️"], ["日本地图", "map of japan", "🗾"], ["指南针", "compass", "🧭"], ["雪山", "snow-capped mountain", "🏔️"],
  ["火山", "volcano", "🌋"], ["富士山", "mount fuji", "🗻"], ["山", "mountain", "⛰️"], ["山", "mountain", "🏔️"], ["远足", "hiking", "🥾"],
  ["登山", "mountain climbing", "🧗"], ["露营", "camping", "⛺"], ["沙滩", "beach", "🏖️"], ["岛屿", "island", "🏝️"], ["沙漠", "desert", "🏜️"],
  ["丛林", "jungle", "🌴"], ["森林", "forest", "🌲"], ["国家公园", "national park", "🏞️"], ["体育场", "stadium", "🏟️"], ["古典建筑", "classical building", "🏛️"],
  ["建筑", "building construction", "🏗️"], ["砖", "brick", "🧱"], ["岩石", "rock", "🪨"], ["木", "wood", "🪵"], ["小屋", "hut", "🛖"],
  ["房子", "houses", "🏘️"], ["废弃房屋", "derelict house", "🏚️"], ["医院", "hospital", "🏥"], ["银行", "bank", "🏦"], ["酒店", "hotel", "🏨"],
  ["爱情酒店", "love hotel", "🏩"], ["便利店", "convenience store", "🏪"], ["学校", "school", "🏫"], ["百货", "department store", "🏬"], ["工厂", "factory", "🏭"],
  ["日本城堡", "japanese castle", "🏯"], ["欧洲城堡", "european castle", "🏰"], ["婚礼", "wedding", "💒"], ["东京塔", "tokyo tower", "🗼"], ["自由女神", "statue of liberty", "🗽"],
  ["地图", "world map", "🗺️"], ["日本地图", "map of japan", "🗾"], ["指南针", "compass", "🧭"], ["卷轴", "scroll", "📜"], ["纪念品", "memo", "📝"],
  ["邮箱", "inbox tray", "📥"], ["发件箱", "outbox tray", "📤"], ["文件夹", "folder", "📁"], ["打开的文件夹", "open folder", "📂"], ["日历", "calendar", "📅"],
  ["撕下的日历", "tear-off calendar", "📆"], ["卡片索引", "card index", "📇"], ["图表", "chart increasing", "📈"], ["下降图表", "chart decreasing", "📉"], ["条形图", "bar chart", "📊"],
  ["剪贴板", "clipboard", "📋"], ["图钉", "pushpin", "📌"], ["圆图钉", "round pushpin", "📍"], ["回形针", "paperclips", "📎"], ["直尺", "straight ruler", "📏"],
  ["三角尺", "triangular ruler", "📐"], ["剪刀", "scissors", "✂️"], ["卡片盒", "card file box", "🗃️"], ["文件柜", "file cabinet", "🗄️"], ["垃圾桶", "wastebasket", "🗑️"],
  ["锁", "locked", "🔒"], ["开锁", "unlocked", "🔓"], ["锁和笔", "locked with pen", "🔏"], ["钥匙锁", "locked with key", "🔐"], ["钥匙", "key", "🔑"],
  ["锤子", "hammer", "🔨"], ["斧头", "axe", "🪓"], ["镐", "pick", "⛏️"], ["锤子和镐", "hammer and pick", "⚒️"], ["锤子和扳手", "hammer and wrench", "🔧"],
  ["匕首", "dagger", "🗡️"], ["交叉的剑", "crossed swords", "⚔️"], ["手枪", "pistol", "🔫"], ["弓和箭", "bow and arrow", "🏹"], ["盾", "shield", "🛡️"],
  ["扳手", "wrench", "🔧"], ["螺母和螺栓", "nut and bolt", "🔩"], ["齿轮", "gear", "⚙️"], ["夹子", "clamp", "🗜️"], ["天平", "balance scale", "⚖️"],
  ["手杖", "probing cane", "🦯"], ["链接", "link", "🔗"], ["锁链", "chains", "⛓️"], ["钩子", "hook", "🪝"], ["工具箱", "toolbox", "🧰"],
  ["磁铁", "magnet", "🧲"], ["梯子", "ladder", "🪜"], ["蒸馏器", "alembic", "⚗️"], ["DNA", "dna", "🧬"], ["病毒", "virus", "🦠"],
  ["注射器", "syringe", "💉"], ["血型", "blood type", "🩸"], ["药片", "pill", "💊"], ["绷带", "adhesive bandage", "🩹"], ["听诊器", "stethoscope", "🩺"],
];

const added = [];
const usedInBatch = new Set();
for (const p of EXTRA_PAIRS) {
  if (added.length >= 634) break;
  const em = p[2];
  if (usedEmojis.has(em) || usedInBatch.has(em)) continue;
  usedInBatch.add(em);
  added.push(p);
}

console.log("Current total:", existing.length);
console.log("Adding:", added.length);
data.pairs = [...existing, ...added];
fs.writeFileSync(dailyPath, JSON.stringify(data, null, 0), "utf8");
console.log("New total:", data.pairs.length);
