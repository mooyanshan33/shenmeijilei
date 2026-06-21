import { getManagedImageUrl } from '@/lib/gallery';
import type {
  AestheticType,
  AestheticCategory,
  AestheticSubcategory,
  MoodOption,
  ColorExplorationOption,
  Contribution,
  RepresentativeArtist,
  RepresentativeWork,
  ColorPalette,
  TimelineEntry,
} from '@/types';

// Mock Mood Options
export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'melancholy', name: '忧郁', nameEn: 'Melancholy', color: '#4A5568' },
  { id: 'longing', name: '思念', nameEn: 'Longing', color: '#9F7AEA' },
  { id: 'comfort', name: '舒适', nameEn: 'Comfort', color: '#48BB78' },
  { id: 'quiet', name: '宁静', nameEn: 'Quiet', color: '#63B3ED' },
  { id: 'solitude', name: '独处', nameEn: 'Solitude', color: '#718096' },
  { id: 'daydream', name: '白日梦', nameEn: 'Daydream', color: '#F6AD55' },
  { id: 'nostalgic', name: '怀旧', nameEn: 'Nostalgic', color: '#ECC94B' },
  { id: 'energetic', name: '活力', nameEn: 'Energetic', color: '#FC8181' },
];

// Mock Color Options
export const COLOR_EXPLORATION_OPTIONS: ColorExplorationOption[] = [
  { id: 'white', name: '白色', hex: '#FFFFFF' },
  { id: 'black', name: '黑色', hex: '#000000' },
  { id: 'blue', name: '蓝色', hex: '#3182CE' },
  { id: 'green', name: '绿色', hex: '#38A169' },
  { id: 'pink', name: '粉色', hex: '#ED64A6' },
  { id: 'yellow', name: '黄色', hex: '#D69E2E' },
  { id: 'purple', name: '紫色', hex: '#805AD5' },
  { id: 'red', name: '红色', hex: '#E53E3E' },
];

// Helper to create a representative artist
const createArtist = (
  id: string,
  name: string,
  nationality: string,
  lifespan: string
): RepresentativeArtist => ({
  id,
  name,
  nationality,
  lifespan,
});

// Helper to create a representative work
const createWork = (
  id: string,
  title: string,
  artist: string,
  year: string
): RepresentativeWork => ({
  id,
  title,
  artist,
  year,
});

// Helper to create color palette
const createPalette = (name: string, hex: string): ColorPalette => ({ name, hex });

// Helper to create timeline entry
const createTimelineEntry = (year: string, event: string): TimelineEntry => ({ year, event });

// 完整分类树结构
export const CATEGORIES: AestheticCategory[] = [
  {
    id: 'classical',
    name: '经典美学',
    nameEn: 'Classical Aesthetics',
    subcategories: [
      { id: 'classical-core', name: '西方古典', nameEn: 'Western Classical', aesthetics: ['ancient-greek', 'ancient-roman', 'sublime', 'romantic-aesthetic'] },
      { id: 'eastern-classical', name: '东方古典', nameEn: 'Eastern Classical', aesthetics: ['chinese-scholar', 'zen', 'mono-no-aware', 'yugen', 'wabi-sabi', 'zen-garden'] }
    ]
  },
  {
    id: 'art-movements',
    name: '艺术运动',
    nameEn: 'Art Movements',
    subcategories: [
      { id: 'historical-art', name: '历史艺术', nameEn: 'Historical Art', aesthetics: ['baroque', 'rococo', 'neoclassicism'] },
      { id: 'modern-art', name: '现代艺术', nameEn: 'Modern Art', aesthetics: ['impressionism', 'post-impressionism', 'expressionism', 'fauvism', 'cubism', 'futurism', 'dada', 'surrealism', 'bauhaus'] },
      { id: 'contemporary-art', name: '当代艺术', nameEn: 'Contemporary Art', aesthetics: ['minimalism', 'pop-art'] }
    ]
  },
  {
    id: 'design-interior',
    name: '设计与空间',
    nameEn: 'Design & Interior',
    subcategories: [
      { id: 'architecture', name: '建筑设计', nameEn: 'Architecture', aesthetics: ['gothic', 'industrial', 'scandinavian', 'neo-chinese', 'japanese-wabi', 'mediterranean', 'art-deco', 'mid-century', 'brutalism'] },
      { id: 'graphic-design', name: '平面设计', nameEn: 'Graphic Design', aesthetics: ['swiss-design', 'memphis', 'glassmorphism', 'neo-brutalism', 'claymorphism', 'skeuomorphism'] }
    ]
  },
  {
    id: 'internet',
    name: '互联网美学',
    nameEn: 'Internet Aesthetics',
    subcategories: [
      { id: 'retro-tech', name: '复古科技', nameEn: 'Retro Tech', aesthetics: ['vaporwave', 'synthwave', 'outrun', 'mallsoft'] },
      { id: 'y2k', name: 'Y2K体系', nameEn: 'Y2K', aesthetics: ['y2k', 'cyber-y2k', 'mcbling'] },
      { id: 'retro-internet', name: '互联网怀旧', nameEn: 'Internet Nostalgia', aesthetics: ['frutiger-aero', 'webcore', 'internetcore', 'windowscore'] },
      { id: 'dream-weird', name: '梦境怪异', nameEn: 'Dream & Weird', aesthetics: ['dreamcore', 'weirdcore', 'liminal-space', 'oddcore', 'traumacore', 'nostalgiacore'] },
      { id: 'nature-core', name: '自然系', nameEn: 'Nature Cores', aesthetics: ['cottagecore', 'fairycore', 'forestcore', 'naturecore', 'raincore', 'oceancore', 'cloudcore', 'spacecore', 'meadowcore', 'mushroomcore'] },
      { id: 'academic', name: '学院系', nameEn: 'Academic', aesthetics: ['dark-academia', 'light-academia'] },
      { id: 'feminine', name: '少女系', nameEn: 'Feminine', aesthetics: ['coquette', 'balletcore', 'princesscore', 'dollcore', 'pinkcore', 'cutecore', 'fairy-kei', 'mori-girl'] },
      { id: 'street-youth', name: '街头青年', nameEn: 'Street & Youth', aesthetics: ['grunge', 'soft-grunge', 'indie-kid', 'art-hoe', 'normcore', 'clean-girl', 'vsco-girl', 'downtown-girl'] },
      { id: 'futurist', name: '未来主义', nameEn: 'Futurist', aesthetics: ['cyberpunk', 'solarpunk', 'lunarpunk', 'steampunk', 'dieselpunk', 'atompunk', 'biopunk', 'cassette-futurism', 'techwear'] }
    ]
  },
  {
    id: 'mood-scene',
    name: '情绪与场景',
    nameEn: 'Mood & Scene',
    subcategories: [
      { id: 'mood', name: '情绪', nameEn: 'Mood', aesthetics: ['melancholycore', 'longingcore', 'comfortcore', 'quietcore', 'solitudecore', 'daydreamcore', 'nightwalkcore'] },
      { id: 'scene', name: '场景', nameEn: 'Scene', aesthetics: ['mallcore', 'poolcore', 'airportcore', 'hotelcore', 'librarycore', 'classroomcore', 'traincore', 'officecore'] },
      { id: 'time-season', name: '时间季节', nameEn: 'Time & Season', aesthetics: ['summercore', 'autumncore', 'wintercore', 'springcore', 'golden-hour', 'blue-hour', 'midnightcore'] }
    ]
  },
  {
    id: 'eastern-regional',
    name: '东方与地域',
    nameEn: 'Eastern & Regional',
    subcategories: [
      { id: 'chinese', name: '中国', nameEn: 'Chinese', aesthetics: ['neo-chinese', 'guochao', 'tang-style', 'song-yun', 'shanshui', 'oriental-zen'] },
      { id: 'japanese', name: '日本', nameEn: 'Japanese', aesthetics: ['japanese-style', 'showa-aesthetic', 'heisei-nostalgia', 'wabi-sabi', 'mono-no-aware'] },
      { id: 'korean', name: '韩国', nameEn: 'Korean', aesthetics: ['korean-cream', 'korean-film', 'korean-minimal'] },
      { id: 'western-regional', name: '西方地域', nameEn: 'Western Regional', aesthetics: ['parisian-chic', 'cottage-english', 'dark-victorian', 'american-retro'] }
    ]
  }
];



// 社区分享数据
export const COMMUNITY_SHARES: Contribution[] = [
  {
    id: '1',
    userId: 'u1',
    userName: '审美收集者',
    userAvatar: getManagedImageUrl('aestheticDatabase-001'),
    imageUrl: getManagedImageUrl('aestheticDatabase-002'),
    caption: '今天发现的侘寂风小店，太美了',
    tags: ['wabi-sabi', 'japanese', 'cafe'],
    aestheticId: 'wabi-sabi',
    likes: 256,
    isLiked: false,
    comments: 45,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: 'u2',
    userName: '赛博旅人',
    userAvatar: getManagedImageUrl('aestheticDatabase-003'),
    imageUrl: getManagedImageUrl('aestheticDatabase-004'),
    caption: '霓虹夜色，赛博朋克2077既视感',
    tags: ['cyberpunk', 'neon', 'night'],
    aestheticId: 'cyberpunk',
    likes: 567,
    isLiked: true,
    comments: 89,
    createdAt: '2024-01-14T20:15:00Z'
  },
  {
    id: '3',
    userId: 'u3',
    userName: '学院派少女',
    userAvatar: getManagedImageUrl('aestheticDatabase-005'),
    imageUrl: getManagedImageUrl('aestheticDatabase-006'),
    caption: '图书馆的下午，暗黑学术氛围拉满',
    tags: ['dark-academia', 'library', 'books'],
    aestheticId: 'dark-academia',
    likes: 189,
    isLiked: false,
    comments: 23,
    createdAt: '2024-01-13T16:45:00Z'
  },
  {
    id: '4',
    userId: 'u4',
    userName: '复古科技迷',
    userAvatar: getManagedImageUrl('aestheticDatabase-007'),
    imageUrl: getManagedImageUrl('aestheticDatabase-008'),
    caption: '新收藏的Y2K手机，绝了',
    tags: ['y2k', 'vintage', 'tech'],
    aestheticId: 'y2k',
    likes: 423,
    isLiked: true,
    comments: 67,
    createdAt: '2024-01-12T14:20:00Z'
  }
];

// 经典美学数据
export const CLASSICAL_AESTHETICS: AestheticType[] = [
  {
    id: 'ancient-greek',
    nameCn: '古希腊美学',
    nameEn: 'Ancient Greek Aesthetics',
    coverImage: getManagedImageUrl('aestheticDatabase-009'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-010'),
      getManagedImageUrl('aestheticDatabase-011'),
      getManagedImageUrl('aestheticDatabase-012')
    ],
    summary: '古希腊美学强调比例、和谐与理想美，对西方艺术产生了深远影响。',
    origin: '公元前8世纪-公元前146年，古希腊',
    history: '古希腊美学源于对人体和自然的理想化表现，追求黄金比例与几何和谐。',
    keyFeatures: ['黄金比例', '人体理想化', '和谐对称', '大理石雕刻', '神庙建筑'],
    colorPalette: [
      createPalette('大理石白', '#F5F5F0'),
      createPalette('雅典蓝', '#2C5282'),
      createPalette('橄榄绿', '#276749')
    ],
    keywords: ['古典', '理想美', '比例', '和谐', '雕塑', '神庙'],
    representativeArtists: [
      createArtist('phidias', '菲狄亚斯', '古希腊', '公元前480-430年'),
      createArtist('praxiteles', '普拉克西特列斯', '古希腊', '公元前4世纪')
    ],
    representativeWorks: [
      createWork('venus', '维纳斯雕像', '普拉克西特列斯', '公元前350年'),
      createWork('parthenon', '帕特农神庙', '菲狄亚斯', '公元前447年')
    ],
    relatedAesthetics: ['ancient-roman', 'neoclassicism'],
    timeline: [
      createTimelineEntry('公元前800年', '古风时期开始'),
      createTimelineEntry('公元前500年', '古典时期高峰'),
      createTimelineEntry('公元前323年', '希腊化时期')
    ],
    popularityScore: 85,
    communityPostsCount: 234,
    categoryId: 'classical',
    subcategoryId: 'classical-core',
    moodTags: ['elegant', 'harmonious', 'timeless'],
    era: 'ancient',
    region: 'europe'
  },
  {
    id: 'ancient-roman',
    nameCn: '古罗马美学',
    nameEn: 'Ancient Roman Aesthetics',
    coverImage: getManagedImageUrl('aestheticDatabase-013'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-014'),
      getManagedImageUrl('aestheticDatabase-015'),
      getManagedImageUrl('aestheticDatabase-016')
    ],
    summary: '古罗马美学继承了希腊传统，更强调实用性与宏伟壮观。',
    origin: '公元前753年-公元476年，古罗马',
    history: '罗马艺术融合了希腊美学与伊特鲁里亚技术，发展出独特的公共建筑艺术。',
    keyFeatures: ['拱门结构', '混凝土技术', '公共建筑', '写实肖像', '马赛克艺术'],
    colorPalette: [
      createPalette('赭石红', '#9B2C2C'),
      createPalette('陶土色', '#C05621'),
      createPalette('石灰白', '#FFFFF0')
    ],
    keywords: ['罗马', '帝国', '建筑', '拱门', '马赛克', '凯旋'],
    representativeArtists: [
      createArtist('apelles', '阿佩莱斯', '古希腊', '公元前4世纪')
    ],
    representativeWorks: [
      createWork('colosseum', '罗马斗兽场', '韦斯巴芗', '公元80年'),
      createWork('pantheon', '万神殿', '哈德良', '公元126年')
    ],
    relatedAesthetics: ['ancient-greek', 'neoclassicism'],
    timeline: [
      createTimelineEntry('公元前753年', '罗马建城'),
      createTimelineEntry('公元前509年', '共和国时期'),
      createTimelineEntry('公元前27年', '帝国时期')
    ],
    popularityScore: 78,
    communityPostsCount: 189,
    categoryId: 'classical',
    subcategoryId: 'classical-core',
    moodTags: ['grand', 'powerful', 'historic'],
    era: 'ancient',
    region: 'europe'
  },
  {
    id: 'chinese-scholar',
    nameCn: '中国文人美学',
    nameEn: 'Chinese Scholar Aesthetics',
    coverImage: getManagedImageUrl('aestheticDatabase-017'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-018'),
      getManagedImageUrl('aestheticDatabase-019'),
      getManagedImageUrl('aestheticDatabase-020')
    ],
    summary: '中国文人美学追求意境深远、气韵生动，诗书画印融为一体。',
    origin: '魏晋南北朝-明清，中国',
    history: '文人画始于唐代，盛于宋元，强调人格修养与艺术境界的统一。',
    keyFeatures: ['水墨写意', '留白意境', '诗书画印', '梅兰竹菊', '文房四宝'],
    colorPalette: [
      createPalette('墨黑', '#1A202C'),
      createPalette('宣纸白', '#F7FAFC'),
      createPalette('朱砂红', '#9B2C2C')
    ],
    keywords: ['文人', '水墨', '意境', '山水', '书法', '雅集'],
    representativeArtists: [
      createArtist('wangwei', '王维', '中国', '701-761年'),
      createArtist('miyuanzhang', '米芾', '中国', '1051-1107年'),
      createArtist('zhao', '赵孟頫', '中国', '1254-1322年')
    ],
    representativeWorks: [
      createWork('luoshen', '洛神赋图', '顾恺之', '东晋'),
      createWork('fuchun', '富春山居图', '黄公望', '元代')
    ],
    relatedAesthetics: ['zen', 'wabi-sabi', 'shanshui'],
    timeline: [
      createTimelineEntry('公元220年', '魏晋风度萌芽'),
      createTimelineEntry('公元700年', '唐代文人画兴起'),
      createTimelineEntry('公元1100年', '宋元高峰')
    ],
    popularityScore: 92,
    communityPostsCount: 345,
    categoryId: 'classical',
    subcategoryId: 'eastern-classical',
    moodTags: ['elegant', 'contemplative', 'timeless'],
    era: 'medieval',
    region: 'asia'
  },
  {
    id: 'zen',
    nameCn: '禅意美学',
    nameEn: 'Zen Aesthetics',
    coverImage: getManagedImageUrl('aestheticDatabase-021'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-022'),
      getManagedImageUrl('aestheticDatabase-023'),
      getManagedImageUrl('aestheticDatabase-024')
    ],
    summary: '禅意美学追求简约、空寂与当下的觉知，通过极简形式表达深邃哲理。',
    origin: '12世纪-现代，日本',
    history: '禅意美学源于中国禅宗思想，在日本发展为独特的美学体系。',
    keyFeatures: ['极简主义', '留白', '自然素材', '不对称美', '枯山水'],
    colorPalette: [
      createPalette('禅意灰', '#718096'),
      createPalette('苔绿', '#2F855A'),
      createPalette('竹棕', '#744210')
    ],
    keywords: ['禅', '极简', '空寂', '冥想', '茶道', '枯山水'],
    representativeArtists: [
      createArtist('sen', '千利休', '日本', '1522-1591年'),
      createArtist('muso', '梦窗疏石', '日本', '1275-1351年')
    ],
    representativeWorks: [
      createWork('ryoanji', '龙安寺枯山水', '梦窗疏石', '1450年'),
      createWork('tea', '侘寂茶道', '千利休', '16世纪')
    ],
    relatedAesthetics: ['wabi-sabi', 'chinese-scholar', 'oriental-zen'],
    timeline: [
      createTimelineEntry('1191年', '禅宗传入日本'),
      createTimelineEntry('1338年', '室町时代禅意美术'),
      createTimelineEntry('1587年', '千利休茶道')
    ],
    popularityScore: 88,
    communityPostsCount: 298,
    categoryId: 'classical',
    subcategoryId: 'eastern-classical',
    moodTags: ['calm', 'meditative', 'minimal'],
    era: 'medieval',
    region: 'asia'
  },
  {
    id: 'mono-no-aware',
    nameCn: '物哀',
    nameEn: 'Mono no Aware',
    coverImage: getManagedImageUrl('aestheticDatabase-025'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-026'),
      getManagedImageUrl('aestheticDatabase-027'),
      getManagedImageUrl('aestheticDatabase-028')
    ],
    summary: '物哀是对万物短暂易逝的敏感体察，在凋零中发现凄美。',
    origin: '平安时代-现代，日本',
    history: '物哀思想源于《源氏物语》，成为日本美学的核心概念之一。',
    keyFeatures: ['无常感', '季节感知', '凄美', '自然共情', '细腻情感'],
    colorPalette: [
      createPalette('樱花粉', '#FED7E2'),
      createPalette('秋叶红', '#C53030'),
      createPalette('月光白', '#EDF2F7')
    ],
    keywords: ['物哀', '无常', '樱花', '季节', '凄美', '共情'],
    representativeArtists: [
      createArtist('murasaki', '紫式部', '日本', '973-1014年'),
      createArtist('basho', '松尾芭蕉', '日本', '1644-1694年')
    ],
    representativeWorks: [
      createWork('genji', '源氏物语', '紫式部', '1008年'),
      createWork('oku', '奥之细道', '松尾芭蕉', '1689年')
    ],
    relatedAesthetics: ['yugen', 'wabi-sabi', 'melancholycore'],
    timeline: [
      createTimelineEntry('1000年', '《源氏物语》成书'),
      createTimelineEntry('1200年', '能剧美学发展'),
      createTimelineEntry('1700年', '俳句艺术高峰')
    ],
    popularityScore: 85,
    communityPostsCount: 267,
    categoryId: 'classical',
    subcategoryId: 'eastern-classical',
    moodTags: ['melancholic', 'contemplative', 'poetic'],
    era: 'medieval',
    region: 'asia'
  },
  {
    id: 'yugen',
    nameCn: '幽玄',
    nameEn: 'Yugen',
    coverImage: getManagedImageUrl('aestheticDatabase-029'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-030'),
      getManagedImageUrl('aestheticDatabase-031'),
      getManagedImageUrl('aestheticDatabase-032')
    ],
    summary: '幽玄是一种深远神秘的美学境界，在含蓄中暗示无限。',
    origin: '镰仓时代-现代，日本',
    history: '幽玄概念源于能剧理论，强调余情余韵，言有尽而意无穷。',
    keyFeatures: ['含蓄暗示', '神秘深远', '余情余韵', '朦胧之美', '言外之意'],
    colorPalette: [
      createPalette('墨色', '#2D3748'),
      createPalette('雾灰', '#A0AEC0'),
      createPalette('淡墨', '#718096')
    ],
    keywords: ['幽玄', '神秘', '余韵', '含蓄', '能剧', '深远'],
    representativeArtists: [
      createArtist('zeami', '世阿弥', '日本', '1363-1443年')
    ],
    representativeWorks: [
      createWork('noh', '风姿花传', '世阿弥', '1400年')
    ],
    relatedAesthetics: ['mono-no-aware', 'wabi-sabi', 'zen'],
    timeline: [
      createTimelineEntry('1300年', '幽玄概念形成'),
      createTimelineEntry('1400年', '世阿弥完善'),
      createTimelineEntry('1600年', '能剧高峰')
    ],
    popularityScore: 75,
    communityPostsCount: 198,
    categoryId: 'classical',
    subcategoryId: 'eastern-classical',
    moodTags: ['mysterious', 'contemplative', 'profound'],
    era: 'medieval',
    region: 'asia'
  },
  {
    id: 'wabi-sabi',
    nameCn: '侘寂',
    nameEn: 'Wabi-Sabi',
    coverImage: getManagedImageUrl('aestheticDatabase-033'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-034'),
      getManagedImageUrl('aestheticDatabase-035')
    ],
    summary: '侘寂接受不完美之美，欣赏岁月留下的痕迹与自然的质朴。',
    origin: '室町时代-现代，日本',
    history: '侘寂源于茶道，由千利休完善，强调朴素、自然、残缺之美。',
    keyFeatures: ['不完美', '自然质朴', '岁月痕迹', '金缮工艺', '朴素古雅'],
    colorPalette: [
      createPalette('陶土色', '#8B4513'),
      createPalette('铁锈红', '#742A2A'),
      createPalette('麻布色', '#D4C4A8')
    ],
    keywords: ['侘寂', '不完美', '金缮', '朴素', '古雅', '自然'],
    representativeArtists: [
      createArtist('sen', '千利休', '日本', '1522-1591年')
    ],
    representativeWorks: [
      createWork('raku', '乐烧茶碗', '长次郎', '16世纪'),
      createWork('kintsugi', '金缮工艺', '佚名', '16世纪')
    ],
    relatedAesthetics: ['zen', 'mono-no-aware', 'japanese-wabi'],
    timeline: [
      createTimelineEntry('1400年', '侘茶萌芽'),
      createTimelineEntry('1580年', '千利休完善'),
      createTimelineEntry('1900年', '现代侘寂复兴')
    ],
    popularityScore: 95,
    communityPostsCount: 412,
    categoryId: 'classical',
    subcategoryId: 'eastern-classical',
    moodTags: ['calm', 'grounded', 'authentic'],
    era: 'medieval',
    region: 'asia'
  },
  {
    id: 'zen-garden',
    nameCn: '枯山水',
    nameEn: 'Karesansui',
    coverImage: getManagedImageUrl('aestheticDatabase-036'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-037'),
      getManagedImageUrl('aestheticDatabase-038'),
      getManagedImageUrl('aestheticDatabase-039')
    ],
    summary: '枯山水以石为山、以砂为水，在极小空间中创造无限山水意境。',
    origin: '室町时代-现代，日本',
    history: '枯山水由禅宗僧人设计，用于冥想观想，是禅意园林的极致表达。',
    keyFeatures: ['石组配置', '耙沙纹理', '苔藓点缀', '极简构图', '冥想空间'],
    colorPalette: [
      createPalette('砂色', '#EFEFEF'),
      createPalette('石灰', '#A0AEC0'),
      createPalette('苔绿', '#48BB78')
    ],
    keywords: ['枯山水', '石组', '耙沙', '禅宗', '园林', '冥想'],
    representativeArtists: [
      createArtist('muso', '梦窗疏石', '日本', '1275-1351年')
    ],
    representativeWorks: [
      createWork('ryoanji', '龙安寺', '梦窗疏石', '1450年'),
      createWork('daisen', '大仙院', '相阿弥', '1513年')
    ],
    relatedAesthetics: ['zen', 'wabi-sabi', 'japanese-wabi'],
    timeline: [
      createTimelineEntry('1330年', '枯山水起源'),
      createTimelineEntry('1450年', '龙安寺建成'),
      createTimelineEntry('1950年', '现代园林借鉴')
    ],
    popularityScore: 82,
    communityPostsCount: 234,
    categoryId: 'classical',
    subcategoryId: 'eastern-classical',
    moodTags: ['calm', 'meditative', 'minimal'],
    era: 'medieval',
    region: 'asia'
  },
  {
    id: 'sublime',
    nameCn: '崇高美学',
    nameEn: 'Sublime Aesthetics',
    coverImage: getManagedImageUrl('aestheticDatabase-040'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-041'),
      getManagedImageUrl('aestheticDatabase-042'),
      getManagedImageUrl('aestheticDatabase-043')
    ],
    summary: '崇高美学探索自然的巨大与力量，在敬畏中体验超越性的震撼。',
    origin: '18世纪-现代，欧洲',
    history: '崇高概念由伯克和康德哲学化，成为浪漫主义艺术的核心。',
    keyFeatures: ['宏伟壮观', '自然力量', '敬畏感', '尺度对比', '戏剧性光影'],
    colorPalette: [
      createPalette('风暴灰', '#4A5568'),
      createPalette('深渊蓝', '#1A365D'),
      createPalette('闪电白', '#FFFFFF')
    ],
    keywords: ['崇高', '震撼', '宏伟', '自然', '敬畏', '浪漫'],
    representativeArtists: [
      createArtist('turner', '透纳', '英国', '1775-1851年'),
      createArtist('friedrich', '弗里德里希', '德国', '1774-1840年')
    ],
    representativeWorks: [
      createWork('frost', '雾海上的旅人', '弗里德里希', '1818年'),
      createWork('slave', '贩奴船', '透纳', '1840年')
    ],
    relatedAesthetics: ['romantic-aesthetic', 'romanticism'],
    timeline: [
      createTimelineEntry('1757年', '伯克《论崇高》'),
      createTimelineEntry('1790年', '康德《判断力批判》'),
      createTimelineEntry('1820年', '浪漫主义高峰')
    ],
    popularityScore: 72,
    communityPostsCount: 178,
    categoryId: 'classical',
    subcategoryId: 'classical-core',
    moodTags: ['awe-inspiring', 'overwhelming', 'powerful'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'romantic-aesthetic',
    nameCn: '浪漫美学',
    nameEn: 'Romantic Aesthetics',
    coverImage: getManagedImageUrl('aestheticDatabase-044'),
    galleryImages: [
      getManagedImageUrl('aestheticDatabase-045'),
      getManagedImageUrl('aestheticDatabase-046'),
      getManagedImageUrl('aestheticDatabase-047')
    ],
    summary: '浪漫美学强调情感、想象与自然之美，追求崇高与理想。',
    origin: '18世纪末-19世纪中，欧洲',
    history: '浪漫主义运动是对启蒙理性的反叛，强调个人情感与自由。',
    keyFeatures: ['情感表达', '自然崇拜', '想象力', '中世纪复兴', '异国情调'],
    colorPalette: [
      createPalette('浪漫紫', '#805AD5'),
      createPalette('玫瑰红', '#E53E3E'),
      createPalette('夜幕蓝', '#1A365D')
    ],
    keywords: ['浪漫', '情感', '自然', '想象', '哥特', '中世纪'],
    representativeArtists: [
      createArtist('delacroix', '德拉克洛瓦', '法国', '1798-1863年'),
      createArtist('blake', '布莱克', '英国', '1757-1827年')
    ],
    representativeWorks: [
      createWork('liberty', '自由引导人民', '德拉克洛瓦', '1830年'),
      createWork('tyger', '老虎', '布莱克', '1794年')
    ],
    relatedAesthetics: ['sublime', 'gothic', 'dark-victorian'],
    timeline: [
      createTimelineEntry('1780年', '浪漫主义萌芽'),
      createTimelineEntry('1820年', '浪漫主义高峰'),
      createTimelineEntry('1850年', '转向现实主义')
    ],
    popularityScore: 79,
    communityPostsCount: 201,
    categoryId: 'classical',
    subcategoryId: 'classical-core',
    moodTags: ['passionate', 'dreamy', 'dramatic'],
    era: 'modern',
    region: 'europe'
  }
];

// 合并所有审美数据
export const AESTHETICS: AestheticType[] = [
  ...CLASSICAL_AESTHETICS
];

// 辅助函数
export function getAestheticById(id: string): AestheticType | undefined {
  return AESTHETICS.find(a => a.id === id);
}

export function getRandomAesthetics(count: number): AestheticType[] {
  const shuffled = [...AESTHETICS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getDailyPicks(): AestheticType[] {
  return getRandomAesthetics(6);
}

export function getTrendingAesthetics(): AestheticType[] {
  return [...AESTHETICS].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 10);
}

export function searchAesthetics(query: string, filters?: any): AestheticType[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  return AESTHETICS.filter(aesthetic => {
    const matchesQuery = !normalizedQuery || 
      aesthetic.nameCn.toLowerCase().includes(normalizedQuery) ||
      aesthetic.nameEn.toLowerCase().includes(normalizedQuery) ||
      aesthetic.keywords.some(k => k.toLowerCase().includes(normalizedQuery)) ||
      aesthetic.summary.toLowerCase().includes(normalizedQuery);

    return matchesQuery;
  });
}

export function getSimilarAesthetics(aestheticId: string, count: number = 5): AestheticType[] {
  const aesthetic = getAestheticById(aestheticId);
  if (!aesthetic) return [];

  return AESTHETICS
    .filter(a => a.id !== aestheticId)
    .map(a => ({
      aesthetic: a,
      score: 1
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(x => x.aesthetic);
}
