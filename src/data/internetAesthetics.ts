import { getManagedImageUrl } from '@/lib/gallery';
import type {
  AestheticType,
  RepresentativeArtist,
  RepresentativeWork,
  ColorPalette,
  TimelineEntry,
} from '@/types';

// Helper functions
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

const createPalette = (name: string, hex: string): ColorPalette => ({ name, hex });

const createTimelineEntry = (year: string, event: string): TimelineEntry => ({ year, event });

// 4. 互联网美学 (Internet Aesthetics)
export const INTERNET_AESTHETICS: AestheticType[] = [
  {
    id: 'vaporwave',
    nameCn: '蒸汽波',
    nameEn: 'Vaporwave',
    coverImage: getManagedImageUrl('internetAesthetics-001'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-002'),
      getManagedImageUrl('internetAesthetics-003'),
      getManagedImageUrl('internetAesthetics-004')
    ],
    summary: '蒸汽波将80/90年代消费文化、日本City Pop与古希腊美学拼贴成怀旧梦境。',
    origin: '2010s-现代，互联网',
    history: '蒸汽波源于2010年代初的网络音乐场景，后发展为视觉美学。',
    keyFeatures: ['复古科技', '希腊雕塑', '日文元素', '渐变色彩', '赛博怀旧'],
    colorPalette: [
      createPalette('蒸汽粉', '#ED64A6'),
      createPalette('蒸汽蓝', '#2B6CB0'),
      createPalette('蒸汽紫', '#9F7AEA')
    ],
    keywords: ['蒸汽波', '复古', '赛博', '80年代', '日本', '雕塑'],
    representativeArtists: [
      createArtist('macintosh', 'Macintosh Plus', '美国', '2010s'),
      createArtist('vektroid', 'Vektroid', '美国', '2010s')
    ],
    representativeWorks: [
      createWork('floral', 'Floral Shoppe', 'Macintosh Plus', '2011年')
    ],
    relatedAesthetics: ['synthwave', 'outrun', 'mallsoft'],
    timeline: [
      createTimelineEntry('2011年', 'Floral Shoppe发布'),
      createTimelineEntry('2015年', '主流化'),
      createTimelineEntry('2020年', '持续演变')
    ],
    popularityScore: 92,
    communityPostsCount: 412,
    categoryId: 'internet',
    subcategoryId: 'retro-tech',
    moodTags: ['nostalgic', 'surreal', 'dreamy'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'synthwave',
    nameCn: '合成波',
    nameEn: 'Synthwave',
    coverImage: getManagedImageUrl('internetAesthetics-005'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-006'),
      getManagedImageUrl('internetAesthetics-007'),
      getManagedImageUrl('internetAesthetics-008')
    ],
    summary: '合成波将80年代合成器音乐、赛博朋克视觉与怀旧未来主义融为一体。',
    origin: '2010s-现代，互联网',
    history: '合成波源于对80年代影视配乐的怀旧，《怪奇物语》后进入主流。',
    keyFeatures: ['80年代复古', '霓虹灯光', '网格地平线', '未来怀旧', '电子音乐'],
    colorPalette: [
      createPalette('霓虹粉', '#F687B3'),
      createPalette('霓虹蓝', '#63B3ED'),
      createPalette('日落橙', '#ED8936')
    ],
    keywords: ['合成波', '80年代', '霓虹', '赛博', '怀旧', '未来'],
    representativeArtists: [
      createArtist('carpenter', 'Carpenter Brut', '法国', '2010s'),
      createArtist('perturbator', 'Perturbator', '法国', '2010s')
    ],
    representativeWorks: [
      createWork('outrun', 'OutRun', '世嘉', '1986年'),
      createWork('stranger', '怪奇物语', 'Netflix', '2016年')
    ],
    relatedAesthetics: ['vaporwave', 'outrun', 'cyberpunk'],
    timeline: [
      createTimelineEntry('2010年', '音乐场景萌芽'),
      createTimelineEntry('2016年', '怪奇物语带动'),
      createTimelineEntry('2020年', '主流流行')
    ],
    popularityScore: 91,
    communityPostsCount: 389,
    categoryId: 'internet',
    subcategoryId: 'retro-tech',
    moodTags: ['energetic', 'nostalgic', 'futuristic'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'y2k',
    nameCn: 'Y2K',
    nameEn: 'Y2K Aesthetic',
    coverImage: getManagedImageUrl('internetAesthetics-009'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-010'),
      getManagedImageUrl('internetAesthetics-011'),
      getManagedImageUrl('internetAesthetics-012')
    ],
    summary: 'Y2K美学拥抱千禧年之交的科技乐观主义，闪亮、塑料感与未来感并存。',
    origin: '1998-2005年，全球',
    history: 'Y2K美学源于千禧年虫危机前后的科技乐观，2020年代后复兴。',
    keyFeatures: ['闪亮质感', '塑料材质', '科技图形', '未来时尚', '千禧年标志'],
    colorPalette: [
      createPalette('Y2K银', '#E2E8F0'),
      createPalette('Y2K粉', '#F687B3'),
      createPalette('Y2K蓝', '#63B3ED')
    ],
    keywords: ['Y2K', '千禧年', '科技', '闪亮', '塑料', '未来'],
    representativeArtists: [
      createArtist('britney', '布兰妮', '美国', '1981年生'),
      createArtist('paris', '帕丽斯·希尔顿', '美国', '1981年生')
    ],
    representativeWorks: [
      createWork('imac', 'iMac G3', '苹果', '1998年'),
      createWork('razr', '摩托罗拉RAZR', '摩托罗拉', '2004年')
    ],
    relatedAesthetics: ['vaporwave', 'mcbling', 'cyber-y2k'],
    timeline: [
      createTimelineEntry('1998年', 'iMac发布'),
      createTimelineEntry('2000年', '千禧年高峰'),
      createTimelineEntry('2020年', 'Y2K复兴')
    ],
    popularityScore: 94,
    communityPostsCount: 478,
    categoryId: 'internet',
    subcategoryId: 'y2k',
    moodTags: ['futuristic', 'glamorous', 'playful'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'frutiger-aero',
    nameCn: 'Frutiger Aero',
    nameEn: 'Frutiger Aero',
    coverImage: getManagedImageUrl('internetAesthetics-013'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-014'),
      getManagedImageUrl('internetAesthetics-015'),
      getManagedImageUrl('internetAesthetics-016')
    ],
    summary: 'Frutiger Aero是2000年代中晚期的"清新科技"美学，玻璃质感、绿叶与人类主义设计。',
    origin: '2004-2010年，全球',
    history: 'Frutiger Aero得名于Windows Aero与Frutiger字体，代表了Web 2.0的乐观。',
    keyFeatures: ['玻璃质感', '清新色彩', '绿叶元素', '人类主义', '3D图标'],
    colorPalette: [
      createPalette('微软蓝', '#3182CE'),
      createPalette('清新绿', '#38B2AC'),
      createPalette('玻璃白', '#F7FAFC')
    ],
    keywords: ['Frutiger Aero', 'Vista', 'Wii', 'Web 2.0', '清新', '科技'],
    representativeArtists: [],
    representativeWorks: [
      createWork('vista', 'Windows Vista', '微软', '2006年'),
      createWork('wii', 'Wii', '任天堂', '2006年')
    ],
    relatedAesthetics: ['y2k', 'webcore', 'skeuomorphism'],
    timeline: [
      createTimelineEntry('2006年', 'Vista/Wii发布'),
      createTimelineEntry('2009年', 'Windows 7'),
      createTimelineEntry('2022年', '互联网怀旧')
    ],
    popularityScore: 87,
    communityPostsCount: 298,
    categoryId: 'internet',
    subcategoryId: 'retro-internet',
    moodTags: ['nostalgic', 'optimistic', 'clean'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'dreamcore',
    nameCn: '梦核',
    nameEn: 'Dreamcore',
    coverImage: getManagedImageUrl('internetAesthetics-017'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-018'),
      getManagedImageUrl('internetAesthetics-019'),
      getManagedImageUrl('internetAesthetics-020')
    ],
    summary: '梦核探索潜意识梦境，以模糊、低质图像与超现实组合创造不安的熟悉感。',
    origin: '2010s-现代，互联网',
    history: '梦核源于2010年代末的互联网图像分享，探索集体潜意识与怀旧。',
    keyFeatures: ['低质图像', '模糊朦胧', '超现实组合', '似曾相识', '不安氛围'],
    colorPalette: [
      createPalette('梦核白', '#E2E8F0'),
      createPalette('梦核灰', '#A0AEC0'),
      createPalette('褪色黄', '#FEFCBF')
    ],
    keywords: ['梦核', '怪异', '梦境', '超现实', '低质', '怀旧'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['weirdcore', 'liminal-space', 'surrealism'],
    timeline: [
      createTimelineEntry('2018年', '萌芽'),
      createTimelineEntry('2020年', 'TikTok传播'),
      createTimelineEntry('2022年', '成熟')
    ],
    popularityScore: 85,
    communityPostsCount: 276,
    categoryId: 'internet',
    subcategoryId: 'dream-weird',
    moodTags: ['dreamlike', 'unsettling', 'nostalgic'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'liminal-space',
    nameCn: '阈限空间',
    nameEn: 'Liminal Space',
    coverImage: getManagedImageUrl('internetAesthetics-021'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-022'),
      getManagedImageUrl('internetAesthetics-023'),
      getManagedImageUrl('internetAesthetics-024')
    ],
    summary: '阈限空间是那些"在两者之间"的空间，空荡、过时，却带着奇怪的熟悉感。',
    origin: '2019-现代，互联网',
    history: '阈限空间源于4chan的"The Backrooms"，后发展为完整的美学运动。',
    keyFeatures: ['空荡空间', '过时设计', '怪异照明', '无限重复', '似曾相识'],
    colorPalette: [
      createPalette('购物中心绿', '#2F855A'),
      createPalette('酒店地毯红', '#9B2C2C'),
      createPalette('荧光灯白', '#E2E8F0')
    ],
    keywords: ['阈限', '空荡', 'Backrooms', '怀旧', '怪异', '空间'],
    representativeArtists: [],
    representativeWorks: [
      createWork('backrooms', 'The Backrooms', '佚名', '2019年')
    ],
    relatedAesthetics: ['dreamcore', 'weirdcore', 'vaporwave'],
    timeline: [
      createTimelineEntry('2019年', 'The Backrooms'),
      createTimelineEntry('2020年', 'Reddit社区'),
      createTimelineEntry('2022年', 'TikTok流行')
    ],
    popularityScore: 90,
    communityPostsCount: 345,
    categoryId: 'internet',
    subcategoryId: 'dream-weird',
    moodTags: ['eerie', 'nostalgic', 'unsettling'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'cottagecore',
    nameCn: '田园核',
    nameEn: 'Cottagecore',
    coverImage: getManagedImageUrl('internetAesthetics-025'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-026'),
      getManagedImageUrl('internetAesthetics-027'),
      getManagedImageUrl('internetAesthetics-028')
    ],
    summary: '田园核美化乡村生活，以田园诗、手工制作与自然共生逃离现代压力。',
    origin: '2018-现代，互联网',
    history: '田园核源于Tumblr与Instagram，在2020年疫情期间流行。',
    keyFeatures: ['田园小屋', '手工烘焙', '复古服饰', '花卉图案', '自然生活'],
    colorPalette: [
      createPalette('草地绿', '#48BB78'),
      createPalette('花朵粉', '#FED7E2'),
      createPalette('小麦黄', '#FEFCBF')
    ],
    keywords: ['田园', '乡村', '烘焙', '自然', '逃离', '浪漫'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['fairycore', 'grandmacore', 'dark-academia'],
    timeline: [
      createTimelineEntry('2018年', 'Tumblr萌芽'),
      createTimelineEntry('2020年', '疫情流行'),
      createTimelineEntry('2022年', '主流化')
    ],
    popularityScore: 93,
    communityPostsCount: 456,
    categoryId: 'internet',
    subcategoryId: 'nature-core',
    moodTags: ['peaceful', 'wholesome', 'nostalgic'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'dark-academia',
    nameCn: '暗黑学术',
    nameEn: 'Dark Academia',
    coverImage: getManagedImageUrl('internetAesthetics-029'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-030'),
      getManagedImageUrl('internetAesthetics-031'),
      getManagedImageUrl('internetAesthetics-032')
    ],
    summary: '暗黑学术浪漫化古典教育，以哥特式怀旧、文学热情与悲剧美学为核心。',
    origin: '2015-现代，互联网',
    history: '暗黑学术源于Tumblr，受《秘密历史》《哈利波特》等作品影响。',
    keyFeatures: ['古典文学', '哥特建筑', '复古学院风', '秋冬色调', '知识热情'],
    colorPalette: [
      createPalette('学院棕', '#744210'),
      createPalette('羊毛灰', '#4A5568'),
      createPalette('酒红', '#9B2C2C')
    ],
    keywords: ['暗黑学术', '学院', '文学', '哥特', '牛津', '怀旧'],
    representativeArtists: [],
    representativeWorks: [
      createWork('history', '秘密历史', '唐娜·塔特', '1992年')
    ],
    relatedAesthetics: ['light-academia', 'gothic', 'dark-victorian'],
    timeline: [
      createTimelineEntry('2015年', 'Tumblr起源'),
      createTimelineEntry('2020年', 'TikTok爆发'),
      createTimelineEntry('2022年', '成熟风格')
    ],
    popularityScore: 95,
    communityPostsCount: 512,
    categoryId: 'internet',
    subcategoryId: 'academic',
    moodTags: ['melancholic', 'romantic', 'scholarly'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'coquette',
    nameCn: '娇媚风',
    nameEn: 'Coquette',
    coverImage: getManagedImageUrl('internetAesthetics-033'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-034'),
      getManagedImageUrl('internetAesthetics-035'),
      getManagedImageUrl('internetAesthetics-036')
    ],
    summary: '娇媚风拥抱极致女性化，以粉色、蕾丝、芭蕾元素与浪漫怀旧为标志。',
    origin: '2020-现代，互联网',
    history: '娇媚风源于TikTok，是对Y2K与洛丽塔美学的当代诠释。',
    keyFeatures: ['粉色系', '蕾丝元素', '芭蕾美学', '复古甜心', '浪漫装饰'],
    colorPalette: [
      createPalette('芭蕾粉', '#FED7E2'),
      createPalette('玫瑰红', '#F687B3'),
      createPalette('奶油白', '#FFFFF0')
    ],
    keywords: ['娇媚', '粉色', '芭蕾', '蕾丝', '甜心', '复古'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['y2k', 'balletcore', 'princesscore'],
    timeline: [
      createTimelineEntry('2020年', 'TikTok起源'),
      createTimelineEntry('2021年', '快速传播'),
      createTimelineEntry('2023年', '主流时尚')
    ],
    popularityScore: 92,
    communityPostsCount: 434,
    categoryId: 'internet',
    subcategoryId: 'feminine',
    moodTags: ['feminine', 'romantic', 'playful'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'cyberpunk',
    nameCn: '赛博朋克',
    nameEn: 'Cyberpunk',
    coverImage: getManagedImageUrl('internetAesthetics-037'),
    galleryImages: [
      getManagedImageUrl('internetAesthetics-038'),
      getManagedImageUrl('internetAesthetics-039'),
      getManagedImageUrl('internetAesthetics-040')
    ],
    summary: '赛博朋克描绘高科技、低生活的反乌托邦未来，霓虹灯光与东方元素交织。',
    origin: '1980s-现代，科幻文学',
    history: '赛博朋克源于吉布森的《神经漫游者》，《银翼杀手》定义了其视觉风格。',
    keyFeatures: ['霓虹灯光', '未来都市', '高科技', '东方元素', '反乌托邦'],
    colorPalette: [
      createPalette('霓虹粉', '#F687B3'),
      createPalette('霓虹青', '#38B2AC'),
      createPalette('夜黑', '#1A202C')
    ],
    keywords: ['赛博朋克', '霓虹', '未来', '都市', '高科技', '反乌托邦'],
    representativeArtists: [
      createArtist('gibson', '吉布森', '美国', '1948年生'),
      createArtist('otomo', '大友克洋', '日本', '1954年生')
    ],
    representativeWorks: [
      createWork('neuromancer', '神经漫游者', '吉布森', '1984年'),
      createWork('blade', '银翼杀手', '斯科特', '1982年'),
      createWork('akira', '阿基拉', '大友克洋', '1988年')
    ],
    relatedAesthetics: ['synthwave', 'steampunk', 'vaporwave'],
    timeline: [
      createTimelineEntry('1982年', '银翼杀手'),
      createTimelineEntry('1984年', '神经漫游者'),
      createTimelineEntry('2020年', '赛博朋克2077')
    ],
    popularityScore: 96,
    communityPostsCount: 534,
    categoryId: 'internet',
    subcategoryId: 'futurist',
    moodTags: ['futuristic', 'dystopian', 'vibrant'],
    era: 'contemporary',
    region: 'global'
  }
];
