import json
import random

# 预定义的单词库（简化版，实际应用中应使用更完整的词库）
# 这里为了演示，我构建一个包含不同词性的基础词库
WORD_BANK = {
    "noun": [
        ("apple", "/ˈæpəl/", "苹果", "I eat an apple.", "我吃了一个苹果。"),
        ("book", "/bʊk/", "书", "Read a book.", "读一本书。"),
        ("cat", "/kæt/", "猫", "The cat is cute.", "这只猫很可爱。"),
        ("dog", "/dɔɡ/", "狗", "I have a dog.", "我有一只狗。"),
        ("egg", "/ɛɡ/", "鸡蛋", "Boil an egg.", "煮个鸡蛋。"),
        ("fish", "/fɪʃ/", "鱼", "Fish swim in water.", "鱼在水里游。"),
        ("girl", "/ɡɜrl/", "女孩", "She is a girl.", "她是个女孩。"),
        ("home", "/hoʊm/", "家", "Go home.", "回家。"),
        ("ice", "/aɪs/", "冰", "Ice is cold.", "冰是冷的。"),
        ("job", "/dʒɑb/", "工作", "Good job.", "干得好。"),
        ("key", "/ki/", "钥匙", "Where is my key?", "我的钥匙在哪？"),
        ("love", "/lʌv/", "爱", "I love you.", "我爱你。"),
        ("money", "/ˈmʌni/", "钱", "Time is money.", "时间就是金钱。"),
        ("name", "/neɪm/", "名字", "My name is Tom.", "我叫汤姆。"),
        ("orange", "/ˈɔrɪndʒ/", "橙子", "An orange is round.", "橙子是圆的。"),
        ("pen", "/pɛn/", "钢笔", "I have a pen.", "我有一支钢笔。"),
        ("queen", "/kwin/", "女王", "The queen is here.", "女王来了。"),
        ("rain", "/reɪn/", "雨", "It is raining.", "下雨了。"),
        ("sun", "/sʌn/", "太阳", "The sun is hot.", "太阳很热。"),
        ("tree", "/tri/", "树", "Climb a tree.", "爬树。"),
        ("umbrella", "/ʌmˈbrɛlə/", "雨伞", "Take an umbrella.", "带把伞。"),
        ("van", "/væn/", "货车", "A white van.", "一辆白色货车。"),
        ("water", "/ˈwɔtər/", "水", "Drink some water.", "喝点水。"),
        ("box", "/bɑks/", "盒子", "Open the box.", "打开盒子。"),
        ("zoo", "/zu/", "动物园", "Go to the zoo.", "去动物园。"),
        ("bed", "/bɛd/", "床", "Go to bed.", "去睡觉。"),
        ("car", "/kɑr/", "车", "Drive a car.", "开车。"),
        ("door", "/dɔr/", "门", "Open the door.", "开门。"),
        ("eye", "/aɪ/", "眼睛", "Close your eyes.", "闭上眼睛。"),
        ("face", "/feɪs/", "脸", "Wash your face.", "洗脸。"),
        ("hand", "/hænd/", "手", "Wash your hands.", "洗手。"),
        ("head", "/hɛd/", "头", "Nod your head.", "点头。"),
        ("idea", "/aɪˈdiə/", "主意", "Good idea.", "好主意。"),
        ("juice", "/dʒus/", "果汁", "Orange juice.", "橙汁。"),
        ("kite", "/kaɪt/", "风筝", "Fly a kite.", "放风筝。"),
        ("leg", "/lɛɡ/", "腿", "My leg hurts.", "我的腿疼。"),
        ("milk", "/mɪlk/", "牛奶", "Drink milk.", "喝牛奶。"),
        ("nose", "/noʊz/", "鼻子", "Touch your nose.", "摸摸鼻子。"),
        ("park", "/pɑrk/", "公园", "Walk in the park.", "在公园散步。"),
        ("room", "/rum/", "房间", "Clean the room.", "打扫房间。"),
        ("school", "/skul/", "学校", "Go to school.", "去上学。"),
        ("tea", "/ti/", "茶", "Cup of tea.", "一杯茶。"),
        ("voice", "/vɔɪs/", "声音", "Loud voice.", "大声。"),
        ("way", "/weɪ/", "路", "This way.", "这边走。"),
        ("year", "/jɪr/", "年", "Last year.", "去年。"),
        ("zero", "/ˈzɪroʊ/", "零", "Zero point.", "零点。"),
        ("bird", "/bɜrd/", "鸟", "A bird flies.", "鸟在飞。"),
        ("cake", "/keɪk/", "蛋糕", "Eat cake.", "吃蛋糕。"),
        ("desk", "/dɛsk/", "书桌", "On the desk.", "在桌子上。"),
        ("food", "/fud/", "食物", "Good food.", "好吃的食物。")
    ],
    "adj": [
        ("big", "/bɪɡ/", "大的", "A big house.", "大房子。"),
        ("cold", "/koʊld/", "冷的", "Cold water.", "冷水。"),
        ("dry", "/draɪ/", "干的", "Dry clothes.", "干衣服。"),
        ("easy", "/ˈizi/", "容易的", "It is easy.", "这很容易。"),
        ("fast", "/fæst/", "快的", "Run fast.", "跑得快。"),
        ("good", "/ɡʊd/", "好的", "Good boy.", "好孩子。"),
        ("hot", "/hɑt/", "热的", "Hot tea.", "热茶。"),
        ("ill", "/ɪl/", "生病的", "He is ill.", "他病了。"),
        ("kind", "/kaɪnd/", "友好的", "Be kind.", "友善点。"),
        ("long", "/lɔŋ/", "长的", "Long hair.", "长发。"),
        ("mad", "/mæd/", "生气的", "Are you mad?", "你生气了吗？"),
        ("new", "/nu/", "新的", "New car.", "新车。"),
        ("old", "/oʊld/", "老的", "Old man.", "老人。"),
        ("poor", "/pʊr/", "穷的", "Poor guy.", "可怜的家伙。"),
        ("quiet", "/ˈkwaɪət/", "安静的", "Be quiet.", "安静。"),
        ("red", "/rɛd/", "红色的", "Red apple.", "红苹果。"),
        ("sad", "/sæd/", "伤心的", "Don't be sad.", "别伤心。"),
        ("tall", "/tɔl/", "高的", "Tall tree.", "高树。"),
        ("ugly", "/ˈʌɡli/", "丑的", "Ugly duckling.", "丑小鸭。"),
        ("warm", "/wɔrm/", "温暖的", "Warm day.", "温暖的一天。"),
        ("young", "/jʌŋ/", "年轻的", "Young people.", "年轻人。"),
        ("busy", "/ˈbɪzi/", "忙的", "I am busy.", "我很忙。"),
        ("clean", "/klin/", "干净的", "Clean room.", "干净的房间。"),
        ("dirty", "/ˈdɜrti/", "脏的", "Dirty hands.", "脏手。"),
        ("early", "/ˈɜrli/", "早的", "Wake up early.", "早起。"),
        ("full", "/fʊl/", "满的", "Full moon.", "满月。"),
        ("great", "/ɡreɪt/", "棒的", "Great job.", "干得棒。"),
        ("happy", "/ˈhæpi/", "快乐的", "Happy birthday.", "生日快乐。"),
        ("late", "/leɪt/", "晚的", "Don't be late.", "别迟到。"),
        ("nice", "/naɪs/", "好的", "Nice to meet you.", "很高兴见到你。"),
        ("open", "/ˈoʊpən/", "开着的", "Open door.", "开着的门。"),
        ("ready", "/ˈrɛdi/", "准备好的", "Are you ready?", "准备好了吗？"),
        ("small", "/smɔl/", "小的", "Small box.", "小盒子。"),
        ("true", "/tru/", "真的", "True story.", "真实故事。"),
        ("wet", "/wɛt/", "湿的", "Wet floor.", "湿地板。"),
        ("wrong", "/rɔŋ/", "错的", "Wrong way.", "错路。"),
        ("black", "/blæk/", "黑色的", "Black cat.", "黑猫。"),
        ("blue", "/blu/", "蓝色的", "Blue sky.", "蓝天。"),
        ("green", "/ɡrin/", "绿色的", "Green grass.", "绿草。"),
        ("white", "/waɪt/", "白色的", "White snow.", "白雪。"),
        ("yellow", "/ˈjɛloʊ/", "黄色的", "Yellow banana.", "黄香蕉。"),
        ("hard", "/hɑrd/", "困难的/硬的", "Work hard.", "努力工作。"),
        ("soft", "/sɔft/", "软的", "Soft bed.", "软床。"),
        ("rich", "/rɪtʃ/", "富有的", "Rich man.", "富人。"),
        ("safe", "/seɪf/", "安全的", "Safe trip.", "安全旅途。"),
        ("strong", "/strɔŋ/", "强壮的", "Strong man.", "强壮的人。"),
        ("weak", "/wik/", "虚弱的", "Weak body.", "虚弱的身体。"),
        ("wide", "/waɪd/", "宽的", "Wide road.", "宽路。"),
        ("deep", "/dip/", "深的", "Deep sea.", "深海。"),
        ("high", "/haɪ/", "高的", "High mountain.", "高山。")
    ],
    "verb": [
        ("ask", "/æsk/", "问", "Ask me.", "问我。"),
        ("buy", "/baɪ/", "买", "Buy food.", "买食物。"),
        ("call", "/kɔl/", "打电话", "Call me.", "给我打电话。"),
        ("do", "/du/", "做", "Do it.", "做这件事。"),
        ("eat", "/it/", "吃", "Eat apple.", "吃苹果。"),
        ("fly", "/flaɪ/", "飞", "Birds fly.", "鸟飞。"),
        ("go", "/ɡoʊ/", "去", "Go away.", "走开。"),
        ("help", "/hɛlp/", "帮助", "Help me.", "帮帮我。"),
        ("jump", "/dʒʌmp/", "跳", "Jump high.", "跳得高。"),
        ("keep", "/kip/", "保持", "Keep quiet.", "保持安静。"),
        ("love", "/lʌv/", "爱", "Love peace.", "爱和平。"),
        ("move", "/muv/", "移动", "Move it.", "移动它。"),
        ("need", "/nid/", "需要", "Need help.", "需要帮助。"),
        ("open", "/ˈoʊpən/", "打开", "Open it.", "打开它。"),
        ("play", "/pleɪ/", "玩", "Play games.", "玩游戏。"),
        ("run", "/rʌn/", "跑", "Run fast.", "快跑。"),
        ("say", "/seɪ/", "说", "Say yes.", "说是。"),
        ("talk", "/tɔk/", "谈话", "Talk to me.", "跟我说话。"),
        ("use", "/juz/", "使用", "Use pen.", "用钢笔。"),
        ("visit", "/ˈvɪzɪt/", "参观", "Visit museum.", "参观博物馆。"),
        ("walk", "/wɔk/", "走", "Walk away.", "走开。"),
        ("wait", "/weɪt/", "等待", "Wait for me.", "等我。"),
        ("work", "/wɜrk/", "工作", "Work hard.", "努力工作。"),
        ("yell", "/jɛl/", "大叫", "Don't yell.", "别大叫。"),
        ("zoom", "/zum/", "急速移动", "Zoom in.", "放大。"),
        ("add", "/æd/", "增加", "Add sugar.", "加糖。"),
        ("beg", "/bɛɡ/", "乞求", "I beg you.", "我求你。"),
        ("cut", "/kʌt/", "切", "Cut paper.", "切纸。"),
        ("die", "/daɪ/", "死", "Flowers die.", "花谢了。"),
        ("end", "/ɛnd/", "结束", "End story.", "结束故事。"),
        ("fix", "/fɪks/", "修理", "Fix car.", "修车。"),
        ("get", "/ɡɛt/", "得到", "Get money.", "拿到钱。"),
        ("hit", "/hɪt/", "打", "Hit ball.", "打球。"),
        ("join", "/dʒɔɪn/", "加入", "Join us.", "加入我们。"),
        ("kick", "/kɪk/", "踢", "Kick ball.", "踢球。"),
        ("let", "/lɛt/", "让", "Let go.", "放手。"),
        ("meet", "/mit/", "遇见", "Meet friend.", "见朋友。"),
        ("nod", "/nɑd/", "点头", "Nod head.", "点头。"),
        ("pay", "/peɪ/", "支付", "Pay money.", "付钱。"),
        ("quit", "/kwɪt/", "退出", "Quit game.", "退出游戏。"),
        ("read", "/rid/", "读", "Read book.", "读书。"),
        ("sit", "/sɪt/", "坐", "Sit down.", "坐下。"),
        ("try", "/traɪ/", "尝试", "Try again.", "再试一次。"),
        ("vote", "/voʊt/", "投票", "Vote for him.", "投他一票。"),
        ("win", "/wɪn/", "赢", "Win game.", "赢比赛。"),
        ("mix", "/mɪks/", "混合", "Mix colors.", "混合颜色。"),
        ("cry", "/kraɪ/", "哭", "Don't cry.", "别哭。"),
        ("dry", "/draɪ/", "弄干", "Dry hair.", "弄干头发。"),
        ("fry", "/fraɪ/", "油炸", "Fry egg.", "煎蛋。"),
        ("hug", "/hʌɡ/", "拥抱", "Hug me.", "抱抱我。")
    ],
    "misc": [
        ("up", "/ʌp/", "向上", "Look up.", "向上看。"),
        ("down", "/daʊn/", "向下", "Sit down.", "坐下。"),
        ("in", "/ɪn/", "在里面", "Come in.", "进来。"),
        ("out", "/aʊt/", "在外面", "Go out.", "出去。"),
        ("on", "/ɑn/", "在上面", "On the table.", "在桌上。"),
        ("off", "/ɔf/", "离开", "Turn off.", "关掉。"),
        ("here", "/hɪr/", "这里", "Come here.", "来这里。"),
        ("there", "/ðɛr/", "那里", "Go there.", "去那里。"),
        ("now", "/naʊ/", "现在", "Do it now.", "现在做。"),
        ("then", "/ðɛn/", "那时", "See you then.", "那时见。"),
        ("why", "/waɪ/", "为什么", "Why not?", "为什么不？"),
        ("how", "/haʊ/", "如何", "How are you?", "你好吗？"),
        ("what", "/wʌt/", "什么", "What is this?", "这是什么？"),
        ("who", "/hu/", "谁", "Who is he?", "他是谁？"),
        ("when", "/wɛn/", "什么时候", "When to go?", "什么时候去？"),
        ("where", "/wɛr/", "哪里", "Where is it?", "它在哪里？"),
        ("yes", "/jɛs/", "是", "Yes, I do.", "是的，我愿意。"),
        ("no", "/noʊ/", "不", "No, thanks.", "不，谢谢。"),
        ("not", "/nɑt/", "不", "Not me.", "不是我。"),
        ("very", "/ˈvɛri/", "非常", "Very good.", "非常好。"),
        ("too", "/tu/", "也/太", "Me too.", "我也是。"),
        ("so", "/soʊ/", "所以/如此", "So happy.", "如此快乐。"),
        ("if", "/ɪf/", "如果", "If you can.", "如果你能。"),
        ("but", "/bʌt/", "但是", "But why?", "但是为什么？"),
        ("and", "/ænd/", "和", "You and me.", "你和我。"),
        ("or", "/ɔr/", "或者", "Tea or coffee?", "茶还是咖啡？"),
        ("for", "/fɔr/", "为了", "For you.", "为了你。"),
        ("with", "/wɪð/", "和", "With me.", "和我一起。"),
        ("from", "/frʌm/", "来自", "From China.", "来自中国。"),
        ("to", "/tu/", "去/给", "To school.", "去学校。"),
        ("at", "/æt/", "在", "At home.", "在家。"),
        ("by", "/baɪ/", "通过", "By bus.", "乘公交。"),
        ("of", "/ʌv/", "的", "Cup of tea.", "一杯茶。"),
        ("about", "/əˈbaʊt/", "关于", "About you.", "关于你。"),
        ("again", "/əˈɡɛn/", "再一次", "Try again.", "再试一次。"),
        ("all", "/ɔl/", "全部", "All of us.", "我们所有人。"),
        ("any", "/ˈɛni/", "任何", "Any time.", "任何时间。"),
        ("back", "/bæk/", "后面", "Go back.", "回去。"),
        ("before", "/bɪˈfɔr/", "在之前", "Before lunch.", "午饭前。"),
        ("after", "/ˈæftər/", "在之后", "After school.", "放学后。"),
        ("just", "/dʒʌst/", "仅仅", "Just one.", "只要一个。"),
        ("more", "/mɔr/", "更多", "More water.", "更多水。"),
        ("much", "/mʌtʃ/", "许多", "Too much.", "太多了。"),
        ("some", "/sʌm/", "一些", "Some food.", "一些食物。"),
        ("such", "/sʌtʃ/", "这样的", "Such a day.", "这样的一天。"),
        ("that", "/ðæt/", "那个", "That one.", "那个。"),
        ("this", "/ðɪs/", "这个", "This one.", "这个。"),
        ("well", "/wɛl/", "好", "Well done.", "做得好。"),
        ("ever", "/ˈɛvər/", "曾经", "Ever seen?", "见过吗？"),
        ("never", "/ˈnɛvər/", "从不", "Never give up.", "永不放弃。")
    ]
}

def generate_words(day_num, count=50):
    words = []
    # 简单的轮询策略来分配单词，实际应该根据Day的主题来分配
    # 这里为了确保有数据，我们循环使用 WORD_BANK 中的词
    # 真实场景下应该有足够500个不重复的高频词
    
    # 为了演示，我们混合生成
    all_words = WORD_BANK["noun"] + WORD_BANK["adj"] + WORD_BANK["verb"] + WORD_BANK["misc"]
    
    # 简单的伪随机选择，保证每天不一样但固定
    random.seed(day_num) 
    selected = random.sample(all_words, count)
    
    for i, (word, ipa, meaning, ex_en, ex_cn) in enumerate(selected):
        words.append({
            "id": f"d{day_num}_{i+1:03d}",
            "word": word,
            "ipa": ipa,
            "pos": "mix", # 简化处理
            "meaning_cn": meaning,
            "example_en": ex_en,
            "example_cn": ex_cn,
            "hint": f"首字母 {word[0]}"
        })
    return words

# 读取现有的 plan.json
try:
    with open('/home/ubuntu/english_vocab_10days/client/src/data/plan.json', 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: plan.json not found")
    exit(1)

# 填充 Day 3 - Day 10 的数据
for day in data['days']:
    if day['day'] >= 3:
        day['words'] = generate_words(day['day'])
        print(f"Generated {len(day['words'])} words for Day {day['day']}")

# 写回文件
with open('/home/ubuntu/english_vocab_10days/client/src/data/plan.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated plan.json with generated words.")
