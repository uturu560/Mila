const fs = require("fs");
const path = require("path");

const dailyPath = path.join(__dirname, "daily-words.json");
const data = JSON.parse(fs.readFileSync(dailyPath, "utf8"));
const pairs = data.pairs || [];

// Keywords for animals (English and Chinese) - match if pair contains any of these
const animalKeywords = new Set([
  "dog", "cat", "bird", "fish", "rabbit", "mouse", "cow", "sheep", "pig", "hen", "duck", "bee", "butterfly",
  "snail", "turtle", "snake", "lizard", "elephant", "lion", "tiger", "monkey", "bear", "wolf", "fox", "owl",
  "octopus", "crab", "panda", "giraffe", "zebra", "hippo", "rhino", "kangaroo", "koala", "orangutan", "squirrel",
  "hedgehog", "bat", "raccoon", "badger", "camel", "deer", "peacock", "parrot", "flamingo", "penguin", "swan",
  "eagle", "crow", "dove", "dolphin", "whale", "shark", "seal", "otter", "crocodile", "frog", "dragonfly",
  "spider", "ladybug", "cricket", "scorpion", "centipede", "ant", "fly", "mosquito", "cockroach", "earthworm",
  "jellyfish", "seahorse", "lobster", "shrimp", "clam", "squid", "goldfish", "goose", "chicken", "dinosaur",
  "mammoth", "sloth", "dodo", "skunk", "bison", "beaver", "oyster", "starfish", "seahorse", "catfish",
  "tropical fish", "woodpecker", "swallow", "vulture", "pelican", "stork", "crane", "turkey", "quail",
  "ostrich", "seagull", "albatross", "hummingbird", "phoenix", "unicorn", "dragon", "dragon (myth)",
  "狗", "猫", "鸟", "鱼", "兔子", "老鼠", "牛", "羊", "猪", "鸡", "鸭子", "蜜蜂", "蝴蝶", "蜗牛", "乌龟",
  "蛇", "蜥蜴", "大象", "狮子", "老虎", "猴子", "熊", "狼", "狐狸", "猫头鹰", "章鱼", "螃蟹", "海星", "熊猫",
  "长颈鹿", "斑马", "河马", "犀牛", "袋鼠", "考拉", "猩猩", "松鼠", "刺猬", "蝙蝠", "浣熊", "獾", "骆驼", "鹿",
  "孔雀", "鹦鹉", "火烈鸟", "企鹅", "天鹅", "鹰", "乌鸦", "鸽子", "海豚", "鲸鱼", "鲨鱼", "海豹", "水獭", "鳄鱼",
  "青蛙", "蜻蜓", "蜘蛛", "瓢虫", "蟋蟀", "蝎子", "蜈蚣", "蚂蚁", "苍蝇", "蚊子", "蟑螂", "蚯蚓", "水母", "海马",
  "龙虾", "虾", "蛤蜊", "牡蛎", "乌贼", "金鱼", "热带鱼", "鲤鱼", "鲑鱼", "鲶鱼", "鹅", "恐龙", "猛犸象", "树懒",
  "渡渡鸟", "臭鼬", "野牛", "河狸", "穿山甲"
]);

// Keywords for fruits and food (English and Chinese)
const foodKeywords = new Set([
  "apple", "banana", "orange", "grape", "strawberry", "watermelon", "fruit", "food", "meat", "rice", "bread",
  "noodle", "egg", "vegetable", "pizza", "burger", "hamburger", "cake", "cheese", "milk", "tea", "coffee", "juice",
  "cucumber", "carrot", "broccoli", "eggplant", "corn", "pepper", "lettuce", "potato", "tomato", "onion", "garlic",
  "mushroom", "pea", "peas", "beet", "avocado", "peach", "pear", "cherry", "lemon", "coconut", "mango", "pineapple",
  "kiwi", "melon", "blueberry", "sushi", "sandwich", "salad", "soup", "chocolate", "candy", "honey", "jam", "butter",
  "beer", "wine", "cocktail", "ice", "salt", "sugar", "vinegar", "rice", "egg", "meat", "fish fillet", "bacon",
  "sausage", "ham", "tofu", "noodles", "porridge", "dumpling", "wonton", "spring roll", "pancake", "cookie",
  "pie", "donut", "ice cream", "yogurt", "water", "breakfast", "lunch", "dinner", "snack", "oil", "sauce",
  "苹果", "香蕉", "橙子", "葡萄", "草莓", "西瓜", "水果", "食物", "肉", "米饭", "面包", "面条", "鸡蛋", "蔬菜",
  "披萨", "汉堡", "蛋糕", "奶酪", "牛奶", "茶", "咖啡", "果汁", "黄瓜", "胡萝卜", "西兰花", "茄子", "玉米", "青椒",
  "生菜", "土豆", "番茄", "洋葱", "大蒜", "蘑菇", "豌豆", "甜菜", "牛油果", "桃子", "梨", "樱桃", "柠檬", "椰子",
  "芒果", "菠萝", "猕猴桃", "蜜瓜", "蓝莓", "寿司", "三明治", "沙拉", "汤", "巧克力", "糖果", "蜂蜜", "果酱", "黄油",
  "啤酒", "葡萄酒", "鸡尾酒", "冰", "盐", "糖", "醋", "米饭", "鸡蛋", "肉", "豆腐", "面条", "粥", "饺子", "馄饨",
  "春卷", "薄饼", "饼干", "派", "冰淇淋", "酸奶", "水", "早餐", "午餐", "晚餐", "零食", "油", "酱", "饭", "面",
  "鸡", "鸭", "牛肉", "猪肉", "羊肉", "鸡肉", "鱼片", "虾仁", "培根", "香肠", "火腿", "肉丸", "牛排", "烤肉",
  "热狗", "薯条", "炸鸡", "奶酪", "披萨", "汉堡", "热狗", "玉米卷", "卷饼", "天妇罗", "饭团", "咖喱", "意大利面",
  "章鱼烧", "便当", "甜饼", "月饼", "棒棒糖", "奶瓶", "干杯", "外卖", "扁面包", "卷饼", "火锅", "豆", "青柠",
  "扇贝", "奶酪", "花生酱", "羊角面包", "松饼", "华夫饼", "薄饼", "派", "芝麻", "猪肉", "烤肉", "豆腐", "包子",
  "油条", "布丁", "白酒", "威士忌", "朗姆酒", "茶壶", "零食", "烧烤", "姜", "葱", "桂皮", "花生", "杏仁", "核桃"
]);

function normalize(s) {
  if (typeof s !== "string") return "";
  return s.toLowerCase().trim();
}

function matchesKeyword(pair, keywordSet) {
  const zh = normalize(pair[0]);
  const en = normalize(pair[1]);
  for (const kw of keywordSet) {
    const k = normalize(kw);
    if (zh.includes(k) || en.includes(k) || en.includes(kw)) return true;
  }
  return false;
}

const animals = [];
const fruitsAndFood = [];
const other = [];

for (const p of pairs) {
  if (matchesKeyword(p, animalKeywords)) {
    animals.push(p);
  } else if (matchesKeyword(p, foodKeywords)) {
    fruitsAndFood.push(p);
  } else {
    other.push(p);
  }
}

// If a word is in both (e.g. "鸡" chicken - animal and food), prefer animal for L1
const animalSet = new Set(animals.map((x) => x[0] + "|" + x[1]));
const foodOnly = fruitsAndFood.filter((p) => !animalSet.has(p[0] + "|" + p[1]));
const animalOnly = animals.filter((p) => {
  const key = p[0] + "|" + p[1];
  const inFood = fruitsAndFood.some((f) => f[0] + "|" + f[1] === key);
  return !inFood || animalKeywords.has(normalize(p[0])) || animalKeywords.has(normalize(p[1]));
});

const out = {
  animals: animalOnly.length ? animalOnly : animals,
  fruitsAndFood: foodOnly.length ? foodOnly : fruitsAndFood,
  other: other
};

console.log("Animals:", out.animals.length);
console.log("Fruits and food:", out.fruitsAndFood.length);
console.log("Other:", out.other.length);
console.log("Total:", out.animals.length + out.fruitsAndFood.length + out.other.length);

fs.writeFileSync(dailyPath, JSON.stringify(out, null, 0), "utf8");
console.log("Written to daily-words.json");
