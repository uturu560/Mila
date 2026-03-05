const fs = require("fs");
const path = require("path");

const dailyPath = path.join(__dirname, "daily-words.json");
const data = JSON.parse(fs.readFileSync(dailyPath, "utf8"));
const existingPairs = data.pairs || [];
const usedEmojis = new Set(existingPairs.map((p) => p[2]));

// 1000 new pairs: [Chinese, English, emoji] - each emoji unique and representative
const newPairs = [
  ["熊猫", "panda", "🐼"], ["长颈鹿", "giraffe", "🦒"], ["斑马", "zebra", "🦓"], ["河马", "hippo", "🦛"], ["犀牛", "rhino", "🦏"], ["袋鼠", "kangaroo", "🦘"], ["考拉", "koala", "🐨"], ["猩猩", "orangutan", "🦧"], ["松鼠", "squirrel", "🐿️"], ["刺猬", "hedgehog", "🦔"],
  ["蝙蝠", "bat", "🦇"], ["浣熊", "raccoon", "🦝"], ["獾", "badger", "🦡"], ["骆驼", "camel", "🐫"], ["鹿", "deer", "🦌"], ["孔雀", "peacock", "🦚"], ["鹦鹉", "parrot", "🦜"], ["火烈鸟", "flamingo", "🦩"], ["企鹅", "penguin", "🐧"], ["天鹅", "swan", "🦢"],
  ["鹰", "eagle", "🦅"], ["乌鸦", "crow", "🐦‍⬛"], ["鸽子", "dove", "🕊️"], ["啄木鸟", "woodpecker", "🐦"], ["燕子", "swallow", "🐧"], ["海豚", "dolphin", "🐬"], ["鲸鱼", "whale", "🐋"], ["鲨鱼", "shark", "🦈"], ["海豹", "seal", "🦭"], ["水獭", "otter", "🦦"],
  ["鳄鱼", "crocodile", "🐊"], ["青蛙", "frog", "🐸"], ["蜻蜓", "dragonfly", "🪲"], ["蚂蚁", "ant", "🐜"], ["蜘蛛", "spider", "🕷️"], ["瓢虫", "ladybug", "🐞"], ["蟋蟀", "cricket", "🦗"], ["蚱蜢", "grasshopper", "🦗"], ["蝎子", "scorpion", "🦂"], ["蜈蚣", "centipede", "🐛"],
  ["黄瓜", "cucumber", "🥒"], ["胡萝卜", "carrot", "🥕"], ["西兰花", "broccoli", "🥦"], ["茄子", "eggplant", "🍆"], ["玉米", "corn", "🌽"], ["青椒", "green pepper", "🫑"], ["生菜", "lettuce", "🥬"], ["土豆", "potato", "🥔"], ["番茄", "tomato", "🍅"], ["洋葱", "onion", "🧅"],
  ["大蒜", "garlic", "🧄"], ["蘑菇", "mushroom", "🍄"], ["豌豆", "peas", "🫛"], ["南瓜", "pumpkin", "🎃"], ["菠菜", "spinach", "🥬"], ["芹菜", "celery", "🥬"], ["萝卜", "radish", "🥕"], ["甜菜", "beet", "🫒"], ["芦笋", "asparagus", "🌿"], ["牛油果", "avocado", "🥑"],
  ["桃子", "peach", "🍑"], ["梨", "pear", "🍐"], ["樱桃", "cherry", "🍒"], ["柠檬", "lemon", "🍋"], ["椰子", "coconut", "🥥"], ["芒果", "mango", "🥭"], ["菠萝", "pineapple", "🍍"], ["猕猴桃", "kiwi", "🥝"], ["西瓜", "watermelon", "🍉"], ["蜜瓜", "melon", "🍈"],
  ["蓝莓", "blueberry", "🫐"], ["黑莓", "blackberry", "🫐"], ["石榴", "pomegranate", "🍎"], ["柿子", "persimmon", "🍊"], ["荔枝", "lychee", "🍇"], ["龙眼", "longan", "🍇"], ["山楂", "hawthorn", "🍒"], ["杏", "apricot", "🍑"], ["李子", "plum", "🍑"], ["枣", "date", "🫒"],
  ["披萨", "pizza", "🍕"], ["汉堡", "hamburger", "🍔"], ["薯条", "fries", "🍟"], ["热狗", "hot dog", "🌭"], ["寿司", "sushi", "🍣"], ["三明治", "sandwich", "🥪"], ["炸鸡", "fried chicken", "🍗"], ["沙拉", "salad", "🥗"], ["汤", "soup", "🍲"], ["奶酪", "cheese", "🧀"],
  ["蛋糕", "cake", "🍰"], ["饼干", "cookie", "🍪"], ["巧克力", "chocolate", "🍫"], ["冰淇淋", "ice cream", "🍨"], ["甜甜圈", "donut", "🍩"], ["糖果", "candy", "🍬"], ["蜂蜜", "honey", "🍯"], ["果酱", "jam", "🫙"], ["黄油", "butter", "🧈"], ["酸奶", "yogurt", "🥛"],
  ["啤酒", "beer", "🍺"], ["葡萄酒", "wine", "🍷"], ["鸡尾酒", "cocktail", "🍸"], ["苏打水", "soda", "🥤"], ["冰", "ice", "🧊"], ["盐", "salt", "🧂"], ["糖", "sugar", "🍬"], ["胡椒", "pepper", "🌶️"], ["辣椒", "chili", "🌶️"], ["醋", "vinegar", "🫙"],
  ["衬衫", "shirt", "👔"], ["裤子", "pants", "👖"], ["裙子", "skirt", "👗"], ["外套", "coat", "🧥"], ["毛衣", "sweater", "🧶"], ["袜子", "socks", "🧦"], ["手套", "gloves", "🧤"], ["围巾", "scarf", "🧣"], ["靴子", "boots", "👢"], ["拖鞋", "slippers", "🥿"],
  ["睡衣", "pajamas", "🩳"], ["泳衣", "swimsuit", "🩱"], ["雨衣", "raincoat", "🧥"], ["西装", "suit", "🤵"], ["领带", "tie", "👔"], ["胸针", "brooch", "📌"], ["耳环", "earrings", "💎"], ["手镯", "bracelet", "📿"], ["钱包", "wallet", "👛"], ["太阳镜", "sunglasses", "🕶️"],
  ["学校", "school", "🏫"], ["教室", "classroom", "📗"], ["图书馆", "library", "📚"], ["黑板", "blackboard", "📋"], ["粉笔", "chalk", "🖍️"], ["橡皮", "eraser", "🧽"], ["尺子", "ruler", "📏"], ["计算器", "calculator", "🔢"], ["书包", "schoolbag", "🎒"], ["笔记本", "notebook", "📓"],
  ["字典", "dictionary", "📕"], ["地图", "map", "🗺️"], ["地球仪", "globe", "🌐"], ["显微镜", "microscope", "🔬"], ["望远镜", "telescope", "🔭"], ["试管", "test tube", "🧪"], ["放大镜", "magnifying glass", "🔍"], ["订书机", "stapler", "📎"], ["胶水", "glue", "🩹"], ["胶带", "tape", "📼"],
  ["足球", "soccer", "⚽"], ["篮球", "basketball", "🏀"], ["排球", "volleyball", "🏐"], ["网球", "tennis", "🎾"], ["棒球", "baseball", "⚾"], ["高尔夫", "golf", "⛳"], ["游泳", "swimming", "🏊"], ["跑步", "running", "🏃"], ["骑自行车", "cycling", "🚴"], ["爬山", "hiking", "🥾"],
  ["滑雪", "skiing", "⛷️"], ["滑冰", "skating", "⛸️"], ["冲浪", "surfing", "🏄"], ["钓鱼", "fishing", "🎣"], ["露营", "camping", "⛺"], ["瑜伽", "yoga", "🧘"], ["拳击", "boxing", "🥊"], ["武术", "martial arts", "🥋"], ["举重", "weightlifting", "🏋️"], ["体操", "gymnastics", "🤸"],
  ["医生", "doctor", "🩺"], ["护士", "nurse", "💉"], ["厨师", "chef", "🧑‍🍳"], ["司机", "driver", "🚗"], ["飞行员", "pilot", "🛩️"], ["宇航员", "astronaut", "👨‍🚀"], ["科学家", "scientist", "🔬"], ["工程师", "engineer", "👷"], ["农民", "farmer", "👨‍🌾"], ["渔夫", "fisherman", "🎣"],
  ["律师", "lawyer", "⚖️"], ["法官", "judge", "👨‍⚖️"], ["记者", "journalist", "📰"], ["作家", "writer", "✍️"], ["画家", "painter", "🖌️"], ["摄影师", "photographer", "📷"], ["歌手", "singer", "🎤"], ["演员", "actor", "🎭"], ["舞蹈家", "dancer", "💃"], ["音乐家", "musician", "🎸"],
  ["吉他", "guitar", "🎸"], ["钢琴", "piano", "🎹"], ["小提琴", "violin", "🎻"], ["鼓", "drum", "🥁"], ["喇叭", "trumpet", "🎺"], ["笛子", "flute", "🪗"], ["萨克斯", "saxophone", "🎷"], ["麦克风", "microphone", "🎤"], ["耳机", "headphones", "🎧"], ["收音机", "radio", "📻"],
  ["相机", "camera", "📷"], ["视频", "video", "📹"], ["电影", "film", "🎞️"], ["书", "book", "📕"], ["报纸", "newspaper", "📰"], ["杂志", "magazine", "📰"], ["信", "letter", "✉️"], ["明信片", "postcard", "📮"], ["信封", "envelope", "✉️"], ["邮票", "stamp", "🏷️"],
  ["医院", "hospital", "🏥"], ["药店", "pharmacy", "💊"], ["银行", "bank", "🏦"], ["邮局", "post office", "📬"], ["超市", "supermarket", "🛒"], ["市场", "market", "🏪"], ["餐厅", "restaurant", "🍽️"], ["酒店", "hotel", "🏨"], ["博物馆", "museum", "🏛️"], ["公园", "park", "🏞️"],
  ["动物园", "zoo", "🦁"], ["游乐场", "playground", "🎡"], ["游泳池", "swimming pool", "🏊"], ["体育馆", "gym", "🏋️"], ["电影院", "cinema", "🎦"], ["剧院", "theater", "🎭"], ["教堂", "church", "⛪"], ["寺庙", "temple", "🛕"], ["塔", "tower", "🗼"], ["城堡", "castle", "🏰"],
  ["风", "wind", "💨"], ["云", "cloud", "☁️"], ["雾", "fog", "🌫️"], ["雷", "thunder", "⚡"], ["闪电", "lightning", "⚡"], ["雪", "snow", "❄️"], ["冰雹", "hail", "🌨️"], ["霜", "frost", "🥶"], ["露水", "dew", "💧"], ["台风", "typhoon", "🌀"],
  ["星星", "star", "⭐"], ["流星", "meteor", "☄️"], ["彗星", "comet", "☄️"], ["地球", "Earth", "🌍"], ["火星", "Mars", "🔴"], ["太空", "space", "🪐"], ["宇宙", "universe", "🌌"], ["天空", "sky", "🌤️"], ["黎明", "dawn", "🌄"], ["黄昏", "dusk", "🌇"],
  ["春天", "spring", "🌸"], ["夏天", "summer", "☀️"], ["秋天", "autumn", "🍂"], ["冬天", "winter", "❄️"], ["季节", "season", "🍁"], ["今天", "today", "📅"], ["明天", "tomorrow", "📆"], ["昨天", "yesterday", "🗓️"], ["小时", "hour", "⏰"], ["分钟", "minute", "⏱️"],
  ["秒", "second", "⏱️"], ["星期", "week", "📆"], ["月", "month", "📅"], ["年", "year", "🗓️"], ["假期", "holiday", "🎄"], ["周末", "weekend", "📅"], ["春节", "Spring Festival", "🧧"], ["圣诞节", "Christmas", "🎅"], ["万圣节", "Halloween", "🎃"], ["感恩节", "Thanksgiving", "🦃"],
  ["读", "to read", "📖"], ["听", "to listen", "👂"], ["吃", "to eat", "🍴"], ["喝", "to drink", "🥤"], ["睡", "to sleep", "😴"], ["醒", "to wake", "⏰"], ["坐", "to sit", "🪑"], ["站", "to stand", "🧍"], ["躺", "to lie", "🛏️"], ["飞", "to fly", "✈️"],
  ["游", "to swim", "🏊"], ["爬", "to climb", "🧗"], ["推", "to push", "⏩"], ["拉", "to pull", "⬅️"], ["扔", "to throw", "🤾"], ["接", "to catch", "🤲"], ["踢", "to kick", "🦵"], ["打", "to hit", "👊"], ["抱", "to hug", "🤗"], ["吻", "to kiss", "💋"],
  ["想", "to think", "🤔"], ["知道", "to know", "💡"], ["学习", "to learn", "📚"], ["教", "to teach", "👩‍🏫"], ["问", "to ask", "❓"], ["答", "to answer", "💬"], ["告诉", "to tell", "🗣️"], ["帮助", "to help", "🆘"], ["工作", "to work", "💼"], ["玩", "to play", "🎮"],
  ["休息", "to rest", "😌"], ["等", "to wait", "⏳"], ["开始", "to start", "▶️"], ["完成", "to finish", "✅"], ["停", "to stop", "🛑"], ["继续", "to continue", "▶️"], ["试", "to try", "🔬"], ["需要", "to need", "📌"], ["想要", "to want", "🙏"], ["喜欢", "to like", "👍"],
  ["爱", "to love", "❤️"], ["恨", "to hate", "😠"], ["怕", "to fear", "😨"], ["希望", "to hope", "🤞"], ["相信", "to believe", "✝️"], ["记得", "to remember", "🧠"], ["忘记", "to forget", "💭"], ["理解", "to understand", "💡"], ["同意", "to agree", "🤝"], ["反对", "to disagree", "👎"],
  ["大", "big", "🐘"], ["高", "tall", "📏"], ["长", "long", "📐"], ["宽", "wide", "↔️"], ["厚", "thick", "📕"], ["深", "deep", "🕳️"], ["重", "heavy", "🏋️"], ["轻", "light", "🪶"], ["强", "strong", "💪"], ["弱", "weak", "🩹"],
  ["热", "hot", "🌡️"], ["暖", "warm", "🔥"], ["凉", "cool", "🍃"], ["甜", "sweet", "🍬"], ["酸", "sour", "🍋"], ["苦", "bitter", "😣"], ["辣", "spicy", "🌶️"], ["咸", "salty", "🧂"], ["香", "fragrant", "🌺"], ["臭", "smelly", "🤢"],
  ["干净", "clean", "✨"], ["脏", "dirty", "🪣"], ["满", "full", "🪣"], ["空", "empty", "🈳"], ["对", "correct", "✅"], ["错", "wrong", "❌"], ["容易", "easy", "😊"], ["难", "difficult", "😓"], ["忙", "busy", "📅"], ["闲", "free", "🆓"],
  ["近", "near", "📍"], ["远", "far", "🔭"], ["早", "early", "🌅"], ["晚", "late", "🌙"], ["多", "many", "🔢"], ["少", "few", "🔢"], ["第一", "first", "🥇"], ["第二", "second", "🥈"], ["第三", "third", "🥉"], ["最后", "last", "🏁"],
  ["刀", "knife", "🔪"], ["叉", "fork", "🍴"], ["筷子", "chopsticks", "🥢"], ["锅", "pot", "🫕"], ["平底锅", "pan", "🍳"], ["烤箱", "oven", "🔥"], ["微波炉", "microwave", "📻"], ["洗衣机", "washing machine", "🧺"], ["吸尘器", "vacuum", "🧹"], ["风扇", "fan", "🌀"],
  ["空调", "air conditioner", "❄️"], ["暖气", "heater", "🔥"], ["电池", "battery", "🔋"], ["插头", "plug", "🔌"], ["电线", "wire", "🔌"], ["灯泡", "light bulb", "💡"], ["蜡烛", "candle", "🕯️"], ["火柴", "match", "🔥"], ["打火机", "lighter", "🔥"], ["绳子", "rope", "🪢"],
  ["钉子", "nail", "🔨"], ["螺丝", "screw", "🔩"], ["锤子", "hammer", "🔨"], ["扳手", "wrench", "🔧"], ["锯", "saw", "🪚"], ["梯子", "ladder", "🪜"], ["油漆", "paint", "🖌️"], ["刷子", "brush", "🖌️"], ["扫帚", "broom", "🧹"], ["拖把", "mop", "🪣"],
  ["床单", "bedsheet", "🛏️"], ["被子", "quilt", "🛏️"], ["毯子", "blanket", "🛏️"], ["窗帘", "curtain", "🪟"], ["地毯", "rug", "🟫"], ["花瓶", "vase", "🏺"], ["相框", "photo frame", "🖼️"], ["日历", "calendar", "📅"], ["闹钟", "alarm clock", "⏰"], ["垃圾桶", "trash can", "🗑️"],
  ["牙刷", "toothbrush", "🪥"], ["牙膏", "toothpaste", "🧴"], ["洗发水", "shampoo", "🧴"], ["沐浴露", "shower gel", "🧴"], ["香水", "perfume", "🌸"], ["化妆品", "cosmetics", "💄"], ["口红", "lipstick", "💄"], ["镜子", "mirror", "🪞"], ["浴缸", "bathtub", "🛁"], ["马桶", "toilet", "🚽"],
  ["毛巾", "towel", "🧻"], ["浴袍", "bathrobe", "👘"], ["拖鞋", "slippers", "🥿"], ["衣架", "hanger", "👔"], ["衣柜", "wardrobe", "🪞"], ["抽屉", "drawer", "🗄️"], ["架子", "shelf", "📚"], ["桌子", "desk", "🖥️"], ["椅子", "chair", "💺"], ["沙发", "couch", "🛋️"],
  ["灯", "light", "💡"], ["开关", "switch", "🔘"], ["遥控器", "remote", "📺"], ["充电器", "charger", "🔌"], ["电缆", "cable", "🔌"], ["耳机", "earphones", "🎧"], ["扬声器", "speaker", "🔊"], ["键盘", "keyboard", "⌨️"], ["鼠标", "mouse", "🖱️"], ["屏幕", "screen", "🖥️"],
  ["打印机", "printer", "🖨️"], ["扫描仪", "scanner", "📷"], ["路由器", "router", "📡"], ["冰箱", "fridge", "🧊"], ["炉灶", "stove", "🔥"], ["水槽", "sink", "🚰"], ["水龙头", "faucet", "🚿"], ["烤箱", "oven", "🍞"], ["洗碗机", "dishwasher", "🍽️"], ["烤面包机", "toaster", "🍞"],
  ["咖啡机", "coffee machine", "☕"], ["榨汁机", "juicer", "🧃"], ["搅拌机", "blender", "🫙"], ["开瓶器", "bottle opener", "🍾"], ["罐头", "can", "🥫"], ["瓶子", "bottle", "🍾"], ["罐子", "jar", "🫙"], ["盘子", "dish", "🍽️"], ["碗", "bowl", "🥣"], ["杯子", "mug", "☕"],
  ["勺子", "spoon", "🥄"], ["叉子", "fork", "🍴"], ["刀", "knife", "🔪"], ["砧板", "cutting board", "🥩"], ["围裙", "apron", "👩‍🍳"], ["餐巾", "napkin", "🧻"], ["牙签", "toothpick", "🪥"], ["保鲜膜", "plastic wrap", "📦"], ["铝箔", "aluminum foil", "📦"], ["垃圾袋", "trash bag", "🗑️"],
  ["扫把", "broom", "🧹"], ["簸箕", "dustpan", "🗑️"], ["抹布", "cloth", "🧽"], ["海绵", "sponge", "🧽"], ["消毒液", "disinfectant", "🧴"], ["洗衣粉", "detergent", "🧴"], ["柔顺剂", "fabric softener", "🧴"], ["漂白剂", "bleach", "🧴"], ["杀虫剂", "insecticide", "🐛"], ["除草剂", "herbicide", "🌿"],
  ["药", "medicine", "💊"], ["维生素", "vitamin", "💊"], ["绷带", "bandage", "🩹"], ["创可贴", "band-aid", "🩹"], ["体温计", "thermometer", "🌡️"], ["血压计", "blood pressure monitor", "🩺"], ["口罩", "mask", "😷"], ["手套", "gloves", "🧤"], ["消毒液", "sanitizer", "🧴"], ["急救箱", "first aid kit", "🩹"],
  ["婴儿", "infant", "👶"], ["幼儿", "toddler", "🧒"], ["儿童", "child", "👧"], ["少年", "teenager", "🧑"], ["青年", "youth", "👨"], ["成人", "adult", "👩"], ["老人", "elder", "👴"], ["男人", "man", "👨"], ["女人", "woman", "👩"], ["男孩", "boy", "👦"],
  ["女孩", "girl", "👧"], ["丈夫", "husband", "👨"], ["妻子", "wife", "👩"], ["父母", "parents", "👨‍👩‍👧"], ["祖父母", "grandparents", "👴👵"], ["孙子", "grandson", "👦"], ["孙女", "granddaughter", "👧"], ["叔叔", "uncle", "👨"], ["阿姨", "aunt", "👩"], ["堂兄弟", "cousin", "👫"],
  ["邻居", "neighbor", "🏠"], ["同事", "colleague", "👥"], ["老板", "boss", "💼"], ["顾客", "customer", "🛒"], ["客人", "guest", "👋"], ["主人", "host", "🏠"], ["陌生人", "stranger", "🙍"], ["英雄", "hero", "🦸"], ["国王", "king", "👑"], ["王后", "queen", "👸"],
  ["王子", "prince", "🤴"], ["公主", "princess", "👸"], ["皇帝", "emperor", "👑"], ["士兵", "soldier", "💂"], ["骑士", "knight", "⚔️"], ["海盗", "pirate", "🏴‍☠️"], ["小偷", "thief", "🥷"], ["侦探", "detective", "🔍"], ["魔术师", "magician", "🎩"], ["小丑", "clown", "🤡"],
  ["龙", "dragon", "🐉"], ["凤凰", "phoenix", "🔥"], ["独角兽", "unicorn", "🦄"], ["美人鱼", "mermaid", "🧜‍♀️"], ["精灵", "fairy", "🧚"], ["巨人", "giant", "👹"], ["怪物", "monster", "👾"], ["鬼", "ghost", "👻"], ["吸血鬼", "vampire", "🧛"], ["僵尸", "zombie", "🧟"],
  ["天使", "angel", "😇"], ["魔鬼", "devil", "😈"], ["神仙", "deity", "✨"], ["佛祖", "Buddha", "🙏"], ["圣诞老人", "Santa Claus", "🎅"], ["复活节兔子", "Easter bunny", "🐰"], ["牙仙", "tooth fairy", "🧚"], ["精灵", "elf", "🧝"], ["女巫", "witch", "🧙‍♀️"], ["巫师", "wizard", "🧙"],
  ["剑", "sword", "⚔️"], ["盾", "shield", "🛡️"], ["弓", "bow", "🏹"], ["箭", "arrow", "➡️"], ["枪", "gun", "🔫"], ["炸弹", "bomb", "💣"], ["地雷", "mine", "💣"], ["坦克", "tank", "🚗"], ["火箭", "rocket", "🚀"], ["导弹", "missile", "🚀"],
  ["飞机", "airplane", "✈️"], ["直升机", "helicopter", "🚁"], ["热气球", "hot air balloon", "🎈"], ["火箭", "rocket", "🚀"], ["卫星", "satellite", "🛰️"], ["太空站", "space station", "🛸"], ["飞碟", "UFO", "🛸"], ["机器人", "robot", "🤖"], ["外星人", "alien", "👽"], ["克隆", "clone", "🧬"],
  ["基因", "gene", "🧬"], ["细胞", "cell", "🔬"], ["细菌", "bacteria", "🦠"], ["病毒", "virus", "🦠"], ["疫苗", "vaccine", "💉"], ["药丸", "pill", "💊"], ["注射", "injection", "💉"], ["手术", "surgery", "🏥"], ["X光", "X-ray", "🩻"], ["心电图", "ECG", "📈"],
  ["血", "blood", "🩸"], ["骨头", "bone", "🦴"], ["肌肉", "muscle", "💪"], ["皮肤", "skin", "🤚"], ["头发", "hair", "💇"], ["指甲", "nail", "💅"], ["汗", "sweat", "💦"], ["泪", "tear", "😢"], ["唾液", "saliva", "👅"], ["鼻涕", "snot", "🤧"],
  ["咳嗽", "cough", "🤧"], ["发烧", "fever", "🤒"], ["感冒", "cold", "🤒"], ["头痛", "headache", "🤕"], ["牙痛", "toothache", "🦷"], ["胃痛", "stomachache", "🤢"], ["过敏", "allergy", "🤧"], ["受伤", "injury", "🩹"], ["骨折", "fracture", "🦴"], ["烧伤", "burn", "🔥"],
  ["蜜蜂", "bee", "🐝"], ["黄蜂", "wasp", "🐝"], ["苍蝇", "fly", "🪰"], ["蚊子", "mosquito", "🦟"], ["蟑螂", "cockroach", "🪳"], ["甲虫", "beetle", "🪲"], ["萤火虫", "firefly", "✨"], ["毛毛虫", "caterpillar", "🐛"], ["蚯蚓", "earthworm", "🪱"], ["蜗牛", "snail", "🐌"],
  ["水母", "jellyfish", "🎐"], ["海龟", "turtle", "🐢"], ["海马", "seahorse", "🐴"], ["龙虾", "lobster", "🦞"], ["虾", "shrimp", "🦐"], ["蛤蜊", "clam", "🦪"], ["牡蛎", "oyster", "🦪"], ["扇贝", "scallop", "🦪"], ["乌贼", "squid", "🦑"], ["海参", "sea cucumber", "🥒"],
  ["金鱼", "goldfish", "🐠"], ["热带鱼", "tropical fish", "🐡"], ["鲤鱼", "carp", "🐟"], ["鲑鱼", "salmon", "🐟"], ["鳕鱼", "cod", "🐟"], ["鲶鱼", "catfish", "🐱"], ["鳗鱼", "eel", "🐍"], ["沙丁鱼", "sardine", "🐟"], ["金枪鱼", "tuna", "🐟"], ["比目鱼", "flounder", "🐟"],
  ["麻雀", "sparrow", "🐦"], ["喜鹊", "magpie", "🪶"], ["乌鸦", "crow", "🐦‍⬛"], ["猫头鹰", "owl", "🦉"], ["老鹰", "hawk", "🦅"], ["秃鹰", "vulture", "🦅"], ["鹈鹕", "pelican", "🐦"], ["鹳", "stork", "🦩"], ["鹤", "crane", "🦩"], ["鸭", "duck", "🦆"],
  ["鹅", "goose", "🪿"], ["火鸡", "turkey", "🦃"], ["鸡", "chicken", "🐓"], ["鹌鹑", "quail", "🐣"], ["孔雀", "peacock", "🦚"], ["鸵鸟", "ostrich", "🦩"], ["企鹅", "penguin", "🐧"], ["海鸥", "seagull", "🕊️"], ["信天翁", "albatross", "🕊️"], ["蜂鸟", "hummingbird", "🐦"],
  ["蛇", "snake", "🐍"], ["蟒蛇", "python", "🐍"], ["眼镜蛇", "cobra", "🐍"], ["响尾蛇", "rattlesnake", "🐍"], ["蜥蜴", "lizard", "🦎"], ["壁虎", "gecko", "🦎"], ["变色龙", "chameleon", "🦎"], ["鬣蜥", "iguana", "🦎"], ["鳄鱼", "alligator", "🐊"], ["龟", "tortoise", "🐢"],
  ["青蛙", "frog", "🐸"], ["蟾蜍", "toad", "🐸"], ["蝌蚪", "tadpole", "🐸"], ["蝾螈", "salamander", "🦎"], ["蛇", "serpent", "🐍"], ["恐龙", "dinosaur", "🦕"], ["翼龙", "pterodactyl", "🦖"], ["猛犸象", "mammoth", "🦣"], ["剑齿虎", "sabertooth", "🐯"], ["始祖鸟", "archaeopteryx", "🦕"],
];

// Filter to only pairs whose emoji is not already used
const added = [];
const usedInNew = new Set();
for (const p of newPairs) {
  if (usedEmojis.has(p[2]) || usedInNew.has(p[2])) continue;
  usedInNew.add(p[2]);
  added.push(p);
}

// We need 1000 total new; if we had duplicates, add more from a reserve list
const reserve = [
  ["熊猫", "panda", "🐼"], ["考拉", "koala", "🐨"], ["树懒", "sloth", "🦥"], ["犰狳", "armadillo", "🦔"], ["穿山甲", "pangolin", "🐾"],
  ["火龙果", "dragon fruit", "🐉"], ["百香果", "passion fruit", "🍇"], ["杨桃", "star fruit", "⭐"], ["枇杷", "loquat", "🍊"], ["桑葚", "mulberry", "🫐"],
  ["西兰花", "broccoli", "🥦"], ["芦笋", "asparagus", "🫒"], ["韭菜", "chives", "🌿"], ["姜", "ginger", "🫚"], ["葱", "scallion", "🌱"],
  ["围巾", "scarf", "🧣"], ["背心", "vest", "🦺"], ["短裤", "shorts", "🩳"], ["内衣", "underwear", "🩲"], ["睡衣", "pajamas", "🩳"],
  ["手风琴", "accordion", "🪗"], ["竖琴", "harp", "🎵"], ["三角铁", "triangle", "🔺"], ["木琴", "xylophone", "🎹"], ["口琴", "harmonica", "🎵"],
  ["火山", "volcano", "🌋"], ["沙漠", "desert", "🏜️"], ["峡谷", "canyon", "🏔️"], ["瀑布", "waterfall", "💦"], ["湖", "lake", "🏞️"],
  ["池塘", "pond", "🪷"], ["井", "well", "🕳️"], ["喷泉", "fountain", "⛲"], ["冰山", "iceberg", "🧊"], ["冰川", "glacier", "🏔️"],
  ["龙卷风", "tornado", "🌪️"], ["飓风", "hurricane", "🌀"], ["地震", "earthquake", "🌍"], ["海啸", "tsunami", "🌊"], ["洪水", "flood", "🌊"],
  ["野餐", "picnic", "🧺"], ["烧烤", "barbecue", "🍖"], ["派对", "party", "🎉"], ["婚礼", "wedding", "💒"], ["葬礼", "funeral", "⚫"],
  ["早餐", "breakfast", "🍳"], ["午餐", "lunch", "🥪"], ["晚餐", "dinner", "🍽️"], ["零食", "snack", "🍿"], ["夜宵", "midnight snack", "🌙"],
  ["筷子", "chopsticks", "🥢"], ["勺子", "spoon", "🥄"], ["叉子", "fork", "🍴"], ["餐刀", "knife", "🔪"], ["高脚杯", "wine glass", "🍷"],
  ["茶壶", "teapot", "🫖"], ["咖啡杯", "coffee cup", "☕"], ["马克杯", "mug", "☕"], ["保温杯", "thermos", "🫙"], ["吸管", "straw", "🥤"],
  ["餐盘", "plate", "🍽️"], ["汤碗", "soup bowl", "🥣"], ["沙拉碗", "salad bowl", "🥗"], ["水果盘", "fruit bowl", "🍎"], ["糖果盘", "candy dish", "🍬"],
  ["花瓶", "vase", "🏺"], ["花盆", "flowerpot", "🪴"], ["仙人掌", "cactus", "🌵"], ["向日葵", "sunflower", "🌻"], ["玫瑰", "rose", "🌹"],
  ["郁金香", "tulip", "🌷"], ["百合", "lily", "🤍"], ["菊花", "chrysanthemum", "🌼"], ["莲花", "lotus", "🪷"], ["茉莉", "jasmine", "🌼"],
  ["康乃馨", "carnation", "🌸"], ["雏菊", "daisy", "🌼"], ["紫罗兰", "violet", "💜"], ["兰花", "orchid", "🌺"], ["牡丹", "peony", "🌸"],
  ["竹子", "bamboo", "🎋"], ["松树", "pine tree", "🌲"], ["橡树", "oak tree", "🌳"], ["柳树", "willow", "🌿"], ["枫树", "maple", "🍁"],
  ["棕榈树", "palm tree", "🌴"], ["圣诞树", "Christmas tree", "🎄"], ["苹果树", "apple tree", "🍎"], ["樱桃树", "cherry tree", "🍒"], ["桃树", "peach tree", "🍑"],
  ["草", "grass", "🌿"], ["苔藓", "moss", "🟢"], ["蕨类", "fern", "🌿"], ["芦苇", "reed", "🎋"], ["麦子", "wheat", "🌾"],
  ["水稻", "rice plant", "🌾"], ["玉米", "corn plant", "🌽"], ["棉花", "cotton", "☁️"], ["向日葵", "sunflower", "🌻"], ["薰衣草", "lavender", "💜"],
  ["辣椒", "chili pepper", "🌶️"], ["南瓜", "pumpkin", "🎃"], ["黄瓜", "cucumber", "🥒"], ["西葫芦", "zucchini", "🥒"], ["茄子", "eggplant", "🍆"],
  ["菠菜", "spinach", "🥬"], ["生菜", "lettuce", "🥬"], ["卷心菜", "cabbage", "🥬"], ["花椰菜", "cauliflower", "🥦"], ["韭菜", "leek", "🫒"],
  ["萝卜", "radish", "🥕"], ["甜菜", "beetroot", "🫒"], ["芹菜", "celery", "🥬"], ["茴香", "fennel", "🌿"], ["香菜", "coriander", "🌿"],
  ["薄荷", "mint", "🌿"], ["罗勒", "basil", "🌿"], ["百里香", "thyme", "🌿"], ["迷迭香", "rosemary", "🌿"], ["牛至", "oregano", "🌿"],
  ["桂皮", "cinnamon", "🟤"], ["肉豆蔻", "nutmeg", "🟤"], ["丁香", "clove", "🟤"], ["香草", "vanilla", "🤍"], ["藏红花", "saffron", "🟡"],
  ["姜黄", "turmeric", "🟡"], ["孜然", "cumin", "🟤"], ["咖喱", "curry", "🟡"], ["芥末", "mustard", "🟡"], ["番茄酱", "ketchup", "🍅"],
  ["蛋黄酱", "mayonnaise", "🟡"], ["酱油", "soy sauce", "🫙"], ["鱼露", "fish sauce", "🐟"], ["橄榄油", "olive oil", "🫒"], ["芝麻油", "sesame oil", "🫙"],
  ["蜂蜜", "honey", "🍯"], ["枫糖浆", "maple syrup", "🍁"], ["果酱", "jam", "🫙"], ["花生酱", "peanut butter", "🥜"], ["巧克力酱", "chocolate spread", "🍫"],
  ["面包", "bread", "🍞"], ["吐司", "toast", "🍞"], ["羊角面包", "croissant", "🥐"], ["松饼", "muffin", "🧁"], ["华夫饼", "waffle", "🧇"],
  ["薄饼", "pancake", "🥞"], ["甜甜圈", "donut", "🍩"], ["派", "pie", "🥧"], ["蛋挞", "egg tart", "🥧"], ["曲奇", "cookie", "🍪"],
  ["巧克力", "chocolate", "🍫"], ["软糖", "gummy", "🍬"], ["棉花糖", "marshmallow", "☁️"], ["爆米花", "popcorn", "🍿"], ["薯片", "chips", "🥔"],
  ["坚果", "nuts", "🥜"], ["花生", "peanut", "🥜"], ["杏仁", "almond", "🥜"], ["核桃", "walnut", "🥜"], ["腰果", "cashew", "🥜"],
  ["榛子", "hazelnut", "🥜"], ["开心果", "pistachio", "🥜"], ["瓜子", "sunflower seeds", "🌻"], ["芝麻", "sesame", "⚪"], ["椰子", "coconut", "🥥"],
  ["葡萄干", "raisin", "🍇"], ["无花果", "fig", "🫒"], ["枣", "date", "🫒"], ["杏干", "dried apricot", "🍑"], ["梅子", "prune", "🫒"],
  ["牛肉", "beef", "🥩"], ["猪肉", "pork", "🥓"], ["羊肉", "lamb", "🍖"], ["鸡肉", "chicken meat", "🍗"], ["鸭肉", "duck meat", "🦆"],
  ["鱼片", "fish fillet", "🐟"], ["虾仁", "shrimp meat", "🦐"], ["培根", "bacon", "🥓"], ["香肠", "sausage", "🌭"], ["火腿", "ham", "🥓"],
  ["肉丸", "meatball", "🍖"], ["牛排", "steak", "🥩"], ["烤肉", "kebab", "🍢"], ["汉堡肉", "burger patty", "🍔"], ["热狗", "hot dog", "🌭"],
  ["豆腐", "tofu", "🫘"], ["豆浆", "soy milk", "🥛"], ["纳豆", "natto", "🫘"], ["味噌", "miso", "🫙"], ["腐乳", "fermented tofu", "🫘"],
  ["面条", "noodles", "🍜"], ["米饭", "rice", "🍚"], ["粥", "porridge", "🥣"], ["馒头", "steamed bun", "🍞"], ["包子", "bao", "🥟"],
  ["饺子", "dumpling", "🥟"], ["馄饨", "wonton", "🥟"], ["春卷", "spring roll", "🥟"], ["煎饼", "pancake", "🥞"], ["油条", "youtiao", "🥖"],
  ["饼干", "biscuit", "🍪"], ["蛋糕", "cake", "🍰"], ["布丁", "pudding", "🍮"], ["果冻", "jelly", "🍮"], ["慕斯", "mousse", "🍫"],
  ["马卡龙", "macaron", "🍬"], ["提拉米苏", "tiramisu", "🍰"], ["冰淇淋", "ice cream", "🍦"], ["雪糕", "popsicle", "🍦"], ["奶昔", "milkshake", "🥤"],
  ["柠檬水", "lemonade", "🍋"], ["冰茶", "iced tea", "🍵"], ["热巧克力", "hot chocolate", "☕"], ["拿铁", "latte", "☕"], ["卡布奇诺", "cappuccino", "☕"],
  ["绿茶", "green tea", "🍵"], ["红茶", "black tea", "🍵"], ["茉莉花茶", "jasmine tea", "🌼"], ["乌龙茶", "oolong tea", "🍵"], ["普洱茶", "pu-erh tea", "🍵"],
  ["啤酒", "beer", "🍺"], ["白酒", "baijiu", "🍶"], ["清酒", "sake", "🍶"], ["威士忌", "whiskey", "🥃"], ["伏特加", "vodka", "🍸"],
  ["龙舌兰", "tequila", "🍋"], ["朗姆酒", "rum", "🍹"], ["白兰地", "brandy", "🥃"], ["香槟", "champagne", "🍾"], ["起泡酒", "sparkling wine", "🍾"],
];

// Dedupe reserve by emoji and add until we have 1000 new
for (const p of reserve) {
  if (added.length >= 1000) break;
  if (usedEmojis.has(p[2]) || usedInNew.has(p[2])) continue;
  usedInNew.add(p[2]);
  added.push(p);
}

console.log("Existing pairs:", existingPairs.length);
console.log("New pairs to add:", added.length);

const allPairs = [...existingPairs, ...added];
data.pairs = allPairs;
fs.writeFileSync(dailyPath, JSON.stringify(data, null, 0), "utf8");
console.log("Total pairs now:", allPairs.length);
