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

// 2. 艺术运动 (Art Movements)
export const ART_MOVEMENT_AESTHETICS: AestheticType[] = [
  {
    id: 'baroque',
    nameCn: '巴洛克',
    nameEn: 'Baroque',
    coverImage: getManagedImageUrl('artMovements-001'),
    galleryImages: [
      getManagedImageUrl('artMovements-002'),
      getManagedImageUrl('artMovements-003'),
      getManagedImageUrl('artMovements-004')
    ],
    summary: '巴洛克艺术以戏剧性、动感与华丽装饰著称，追求强烈的情感冲击。',
    origin: '1600-1750年，意大利',
    history: '巴洛克始于罗马，随后传遍欧洲，是天主教会反宗教改革的艺术表达。',
    keyFeatures: ['戏剧性光影', '动感构图', '华丽装饰', '情感张力', '宏大叙事'],
    colorPalette: [
      createPalette('金色', '#FFD700'),
      createPalette('酒红', '#7B341E'),
      createPalette('深蓝', '#1A365D')
    ],
    keywords: ['巴洛克', '戏剧性', '动感', '华丽', '光影', '宗教'],
    representativeArtists: [
      createArtist('caravaggio', '卡拉瓦乔', '意大利', '1571-1610年'),
      createArtist('bernini', '贝尼尼', '意大利', '1598-1680年'),
      createArtist('rubens', '鲁本斯', '佛兰德斯', '1577-1640年')
    ],
    representativeWorks: [
      createWork('calling', '圣马太蒙召', '卡拉瓦乔', '1600年'),
      createWork('apollo', '阿波罗与达芙妮', '贝尼尼', '1625年')
    ],
    relatedAesthetics: ['rococo', 'neoclassicism', 'art-deco'],
    timeline: [
      createTimelineEntry('1600年', '巴洛克兴起'),
      createTimelineEntry('1650年', '巴洛克高峰'),
      createTimelineEntry('1750年', '转向洛可可')
    ],
    popularityScore: 81,
    communityPostsCount: 223,
    categoryId: 'art-movements',
    subcategoryId: 'historical-art',
    moodTags: ['dramatic', 'opulent', 'intense'],
    era: 'early-modern',
    region: 'europe'
  },
  {
    id: 'rococo',
    nameCn: '洛可可',
    nameEn: 'Rococo',
    coverImage: getManagedImageUrl('artMovements-005'),
    galleryImages: [
      getManagedImageUrl('artMovements-006'),
      getManagedImageUrl('artMovements-007'),
      getManagedImageUrl('artMovements-008')
    ],
    summary: '洛可可艺术以轻盈、精致与享乐主义为特色，是贵族优雅生活的写照。',
    origin: '1720-1770年，法国',
    history: '洛可可是对巴洛克沉重感的反叛，迎合法国宫廷的享乐品味。',
    keyFeatures: ['精致曲线', '柔和色彩', '田园主题', '享乐主义', '装饰艺术'],
    colorPalette: [
      createPalette('薄荷绿', '#B2F5EA'),
      createPalette('淡粉', '#FED7E2'),
      createPalette('鹅黄', '#FEFCBF')
    ],
    keywords: ['洛可可', '精致', '享乐', '宫廷', '装饰', '优雅'],
    representativeArtists: [
      createArtist('boucher', '布歇', '法国', '1703-1770年'),
      createArtist('fragonard', '弗拉戈纳尔', '法国', '1732-1806年')
    ],
    representativeWorks: [
      createWork('swing', '秋千', '弗拉戈纳尔', '1767年'),
      createWork('venus', '维纳斯的梳妆', '布歇', '1746年')
    ],
    relatedAesthetics: ['baroque', 'dark-victorian', 'coquette'],
    timeline: [
      createTimelineEntry('1720年', '洛可可兴起'),
      createTimelineEntry('1750年', '洛可可高峰'),
      createTimelineEntry('1789年', '法国大革命后衰落')
    ],
    popularityScore: 76,
    communityPostsCount: 198,
    categoryId: 'art-movements',
    subcategoryId: 'historical-art',
    moodTags: ['playful', 'elegant', 'opulent'],
    era: 'early-modern',
    region: 'europe'
  },
  {
    id: 'neoclassicism',
    nameCn: '新古典主义',
    nameEn: 'Neoclassicism',
    coverImage: getManagedImageUrl('artMovements-009'),
    galleryImages: [
      getManagedImageUrl('artMovements-010'),
      getManagedImageUrl('artMovements-011'),
      getManagedImageUrl('artMovements-012')
    ],
    summary: '新古典主义回归希腊罗马的理性与秩序，追求庄严、简洁与永恒之美。',
    origin: '1750-1850年，欧洲/美国',
    history: '新古典主义是对洛可可的反叛，呼应启蒙运动的理性精神。',
    keyFeatures: ['理性秩序', '古典主题', '简洁构图', '历史叙事', '建筑复兴'],
    colorPalette: [
      createPalette('大理石白', '#F7FAFC'),
      createPalette('皇家蓝', '#2B6CB0'),
      createPalette('深红', '#7B341E')
    ],
    keywords: ['新古典', '理性', '秩序', '罗马', '希腊', '历史'],
    representativeArtists: [
      createArtist('david', '大卫', '法国', '1748-1825年'),
      createArtist('canova', '卡诺瓦', '意大利', '1757-1822年'),
      createArtist('ingres', '安格尔', '法国', '1780-1867年')
    ],
    representativeWorks: [
      createWork('horatii', '荷拉斯兄弟之誓', '大卫', '1784年'),
      createWork('napoleon', '拿破仑加冕', '大卫', '1807年')
    ],
    relatedAesthetics: ['ancient-greek', 'ancient-roman', 'art-deco'],
    timeline: [
      createTimelineEntry('1750年', '庞贝古城发掘'),
      createTimelineEntry('1789年', '法国大革命时期'),
      createTimelineEntry('1820年', '转向浪漫主义')
    ],
    popularityScore: 73,
    communityPostsCount: 167,
    categoryId: 'art-movements',
    subcategoryId: 'historical-art',
    moodTags: ['dignified', 'orderly', 'serious'],
    era: 'early-modern',
    region: 'europe'
  },
  {
    id: 'impressionism',
    nameCn: '印象派',
    nameEn: 'Impressionism',
    coverImage: getManagedImageUrl('artMovements-013'),
    galleryImages: [
      getManagedImageUrl('artMovements-014'),
      getManagedImageUrl('artMovements-015'),
      getManagedImageUrl('artMovements-016')
    ],
    summary: '印象派捕捉瞬间的光影变化，以明亮色彩和自由笔触革新了绘画语言。',
    origin: '1860-1890年，法国巴黎',
    history: '印象派艺术家走出画室，直面自然，追求对光线和色彩的即时感受。',
    keyFeatures: ['光影捕捉', '明亮色彩', '自由笔触', '瞬间印象', '户外写生'],
    colorPalette: [
      createPalette('薰衣草紫', '#9F7AEA'),
      createPalette('草绿', '#68D391'),
      createPalette('晨曦金', '#F6E05E')
    ],
    keywords: ['印象派', '光影', '色彩', '瞬间', '户外', '巴黎'],
    representativeArtists: [
      createArtist('monet', '莫奈', '法国', '1840-1926年'),
      createArtist('renoir', '雷诺阿', '法国', '1841-1919年'),
      createArtist('degas', '德加', '法国', '1834-1917年')
    ],
    representativeWorks: [
      createWork('sunrise', '日出·印象', '莫奈', '1872年'),
      createWork('lilies', '睡莲', '莫奈', '1906年'),
      createWork('dance', '煎饼磨坊的舞会', '雷诺阿', '1876年')
    ],
    relatedAesthetics: ['post-impressionism', 'pointillism', 'plein-air'],
    timeline: [
      createTimelineEntry('1863年', '落选者沙龙'),
      createTimelineEntry('1874年', '首届印象派展览'),
      createTimelineEntry('1886年', '第八届印象派展览')
    ],
    popularityScore: 94,
    communityPostsCount: 387,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['bright', 'airy', 'vibrant'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'post-impressionism',
    nameCn: '后印象派',
    nameEn: 'Post-Impressionism',
    coverImage: getManagedImageUrl('artMovements-017'),
    galleryImages: [
      getManagedImageUrl('artMovements-018'),
      getManagedImageUrl('artMovements-019'),
      getManagedImageUrl('artMovements-020')
    ],
    summary: '后印象派在印象派基础上更强调主观情感与形式结构，开启现代艺术之门。',
    origin: '1880-1905年，法国',
    history: '后印象派艺术家各自探索，共同特点是超越印象派的客观再现。',
    keyFeatures: ['主观色彩', '形式结构', '情感表达', '象征意味', '个人风格'],
    colorPalette: [
      createPalette('梵高黄', '#F6E05E'),
      createPalette('深邃蓝', '#2B6CB0'),
      createPalette('塞尚绿', '#38A169')
    ],
    keywords: ['后印象派', '梵高', '塞尚', '高更', '色彩', '情感'],
    representativeArtists: [
      createArtist('vangogh', '梵高', '荷兰', '1853-1890年'),
      createArtist('cezanne', '塞尚', '法国', '1839-1906年'),
      createArtist('gauguin', '高更', '法国', '1848-1903年')
    ],
    representativeWorks: [
      createWork('starry', '星夜', '梵高', '1889年'),
      createWork('sunflowers', '向日葵', '梵高', '1888年'),
      createWork('apple', '苹果篮', '塞尚', '1893年')
    ],
    relatedAesthetics: ['impressionism', 'expressionism', 'fauvism'],
    timeline: [
      createTimelineEntry('1880年', '后印象派萌芽'),
      createTimelineEntry('1888年', '梵高阿尔勒时期'),
      createTimelineEntry('1905年', '野兽派出现')
    ],
    popularityScore: 96,
    communityPostsCount: 456,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['intense', 'expressive', 'vibrant'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'expressionism',
    nameCn: '表现主义',
    nameEn: 'Expressionism',
    coverImage: getManagedImageUrl('artMovements-021'),
    galleryImages: [
      getManagedImageUrl('artMovements-022'),
      getManagedImageUrl('artMovements-023'),
      getManagedImageUrl('artMovements-024')
    ],
    summary: '表现主义以强烈的色彩与扭曲的形式表达内心的焦虑与情感爆发。',
    origin: '1905-1930年，德国/奥地利',
    history: '表现主义反映了一战前欧洲的紧张气氛，强调主观情感的极端表达。',
    keyFeatures: ['扭曲形式', '强烈色彩', '情感爆发', '社会批判', '内心世界'],
    colorPalette: [
      createPalette('血橙红', '#DD6B20'),
      createPalette('尖叫蓝', '#2C5282'),
      createPalette('紧张绿', '#2F855A')
    ],
    keywords: ['表现主义', '焦虑', '扭曲', '色彩', '情感', '德国'],
    representativeArtists: [
      createArtist('munch', '蒙克', '挪威', '1863-1944年'),
      createArtist('kirchner', '基希纳', '德国', '1880-1938年'),
      createArtist('kandinsky', '康定斯基', '俄罗斯', '1866-1944年')
    ],
    representativeWorks: [
      createWork('scream', '呐喊', '蒙克', '1893年'),
      createWork('street', '柏林街景', '基希纳', '1913年')
    ],
    relatedAesthetics: ['fauvism', 'surrealism', 'abstract-expressionism'],
    timeline: [
      createTimelineEntry('1905年', '桥社创立'),
      createTimelineEntry('1911年', '青骑士创立'),
      createTimelineEntry('1933年', '纳粹迫害')
    ],
    popularityScore: 78,
    communityPostsCount: 203,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['intense', 'anxious', 'provocative'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'fauvism',
    nameCn: '野兽派',
    nameEn: 'Fauvism',
    coverImage: getManagedImageUrl('artMovements-025'),
    galleryImages: [
      getManagedImageUrl('artMovements-026'),
      getManagedImageUrl('artMovements-027'),
      getManagedImageUrl('artMovements-028')
    ],
    summary: '野兽派以狂野大胆的色彩运用著称，色彩脱离写实成为独立的情感表达。',
    origin: '1905-1910年，法国',
    history: '野兽派得名于批评家对其"野兽般"色彩的惊叹，是20世纪首个前卫艺术运动。',
    keyFeatures: ['大胆色彩', '平涂色彩', '简化形式', '情感色彩', '视觉冲击'],
    colorPalette: [
      createPalette('马蒂斯红', '#E53E3E'),
      createPalette('野性绿', '#38B2AC'),
      createPalette('纯粹黄', '#ECC94B')
    ],
    keywords: ['野兽派', '色彩', '马蒂斯', '狂野', '大胆', '前卫'],
    representativeArtists: [
      createArtist('matisse', '马蒂斯', '法国', '1869-1954年'),
      createArtist('derain', '德兰', '法国', '1880-1954年'),
      createArtist('vlaminck', '弗拉芒克', '法国', '1876-1958年')
    ],
    representativeWorks: [
      createWork('dance', '舞蹈', '马蒂斯', '1909年'),
      createWork('hat', '戴帽子的妇人', '马蒂斯', '1905年')
    ],
    relatedAesthetics: ['post-impressionism', 'expressionism', 'cubism'],
    timeline: [
      createTimelineEntry('1905年', '野兽派得名'),
      createTimelineEntry('1908年', '野兽派高峰'),
      createTimelineEntry('1910年', '转向立体主义')
    ],
    popularityScore: 74,
    communityPostsCount: 176,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['vibrant', 'bold', 'energetic'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'cubism',
    nameCn: '立体主义',
    nameEn: 'Cubism',
    coverImage: getManagedImageUrl('artMovements-029'),
    galleryImages: [
      getManagedImageUrl('artMovements-030'),
      getManagedImageUrl('artMovements-031'),
      getManagedImageUrl('artMovements-032')
    ],
    summary: '立体主义拆解物体为几何碎片，从多个视角同时展现，颠覆传统透视。',
    origin: '1907-1920年，法国巴黎',
    history: '立体主义由毕加索和布拉克创立，是20世纪最具革命性的艺术运动。',
    keyFeatures: ['几何分解', '多重视角', '平面化', '拼贴技法', '分析/综合立体主义'],
    colorPalette: [
      createPalette('立体棕', '#744210'),
      createPalette('分解灰', '#A0AEC0'),
      createPalette('结构蓝', '#2B6CB0')
    ],
    keywords: ['立体主义', '毕加索', '几何', '解构', '多视角', '拼贴'],
    representativeArtists: [
      createArtist('picasso', '毕加索', '西班牙', '1881-1973年'),
      createArtist('braque', '布拉克', '法国', '1882-1963年'),
      createArtist('gris', '胡安·格里斯', '西班牙', '1887-1927年')
    ],
    representativeWorks: [
      createWork('avignon', '亚维农少女', '毕加索', '1907年'),
      createWork('guernica', '格尔尼卡', '毕加索', '1937年')
    ],
    relatedAesthetics: ['fauvism', 'futurism', 'constructivism'],
    timeline: [
      createTimelineEntry('1907年', '《亚维农少女》'),
      createTimelineEntry('1909年', '分析立体主义'),
      createTimelineEntry('1912年', '综合立体主义')
    ],
    popularityScore: 87,
    communityPostsCount: 289,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['analytical', 'fragmented', 'revolutionary'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'futurism',
    nameCn: '未来主义',
    nameEn: 'Futurism',
    coverImage: getManagedImageUrl('artMovements-033'),
    galleryImages: [
      getManagedImageUrl('artMovements-034'),
      getManagedImageUrl('artMovements-035'),
      getManagedImageUrl('artMovements-036')
    ],
    summary: '未来主义赞美速度、机器与暴力，主张彻底抛弃传统，拥抱现代性。',
    origin: '1909-1930年，意大利',
    history: '未来主义由马里内蒂发表宣言开始，影响遍及艺术、建筑、文学等领域。',
    keyFeatures: ['速度动感', '机器美学', '动态模糊', '视觉碎片', '反叛传统'],
    colorPalette: [
      createPalette('金属银', '#E2E8F0'),
      createPalette('速度红', '#E53E3E'),
      createPalette('工业黑', '#1A202C')
    ],
    keywords: ['未来主义', '速度', '机器', '现代性', '反叛', '意大利'],
    representativeArtists: [
      createArtist('marinetti', '马里内蒂', '意大利', '1876-1944年'),
      createArtist('boccioni', '波丘尼', '意大利', '1882-1916年'),
      createArtist('carra', '卡拉', '意大利', '1881-1966年')
    ],
    representativeWorks: [
      createWork('manifesto', '未来主义宣言', '马里内蒂', '1909年'),
      createWork('forms', '空间中连续的独特形式', '波丘尼', '1913年')
    ],
    relatedAesthetics: ['cubism', 'constructivism', 'vaporwave'],
    timeline: [
      createTimelineEntry('1909年', '未来主义宣言'),
      createTimelineEntry('1913年', '雕塑高峰'),
      createTimelineEntry('1916年', '波丘尼去世')
    ],
    popularityScore: 68,
    communityPostsCount: 145,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['energetic', 'aggressive', 'dynamic'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'dada',
    nameCn: '达达主义',
    nameEn: 'Dadaism',
    coverImage: getManagedImageUrl('artMovements-037'),
    galleryImages: [
      getManagedImageUrl('artMovements-038'),
      getManagedImageUrl('artMovements-039'),
      getManagedImageUrl('artMovements-040')
    ],
    summary: '达达主义以反艺术、反理性、反美学的姿态，挑战所有既定规则。',
    origin: '1916-1923年，瑞士苏黎世',
    history: '达达主义是对一战荒谬的回应，追求无意义与偶然性的艺术表达。',
    keyFeatures: ['反艺术', '现成品', '拼贴', '随机', '挑衅', '虚无'],
    colorPalette: [
      createPalette('虚无黑', '#000000'),
      createPalette('混乱白', '#FFFFFF'),
      createPalette('偶然灰', '#718096')
    ],
    keywords: ['达达', '反艺术', '现成品', '杜尚', '随机', '挑衅'],
    representativeArtists: [
      createArtist('duchamp', '杜尚', '法国', '1887-1967年'),
      createArtist('tzara', '查拉', '罗马尼亚', '1896-1963年'),
      createArtist('hoch', '汉娜·霍赫', '德国', '1889-1978年')
    ],
    representativeWorks: [
      createWork('fountain', '泉', '杜尚', '1917年'),
      createWork('lhooq', 'L.H.O.O.Q.', '杜尚', '1919年')
    ],
    relatedAesthetics: ['surrealism', 'fluxus', 'punk'],
    timeline: [
      createTimelineEntry('1916年', '伏尔泰酒馆创立'),
      createTimelineEntry('1917年', '《泉》展出'),
      createTimelineEntry('1923年', '达达解散')
    ],
    popularityScore: 79,
    communityPostsCount: 198,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['provocative', 'absurd', 'anti-establishment'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'surrealism',
    nameCn: '超现实主义',
    nameEn: 'Surrealism',
    coverImage: getManagedImageUrl('artMovements-041'),
    galleryImages: [
      getManagedImageUrl('artMovements-042'),
      getManagedImageUrl('artMovements-043'),
      getManagedImageUrl('artMovements-044')
    ],
    summary: '超现实主义探索梦境与潜意识，创造理性之外的奇妙视觉世界。',
    origin: '1924-1960年，法国巴黎',
    history: '超现实主义由布勒东发表宣言开始，深受弗洛伊德精神分析学影响。',
    keyFeatures: ['梦境元素', '潜意识', '自动写作', '奇妙组合', '错视绘画'],
    colorPalette: [
      createPalette('达利红', '#9B2C2C'),
      createPalette('梦境蓝', '#2B6CB0'),
      createPalette('时间金', '#D69E2E')
    ],
    keywords: ['超现实', '梦境', '潜意识', '达利', '马格利特', '奇妙'],
    representativeArtists: [
      createArtist('dali', '达利', '西班牙', '1904-1989年'),
      createArtist('magritte', '马格利特', '比利时', '1898-1967年'),
      createArtist('ernst', '恩斯特', '德国', '1891-1976年')
    ],
    representativeWorks: [
      createWork('memory', '记忆的永恒', '达利', '1931年'),
      createWork('son', '人类之子', '马格利特', '1964年')
    ],
    relatedAesthetics: ['dada', 'magic-realism', 'dreamcore'],
    timeline: [
      createTimelineEntry('1924年', '超现实主义宣言'),
      createTimelineEntry('1931年', '《记忆的永恒》'),
      createTimelineEntry('1966年', '布勒东去世')
    ],
    popularityScore: 93,
    communityPostsCount: 401,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['surreal', 'dreamlike', 'unsettling'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'bauhaus',
    nameCn: '包豪斯',
    nameEn: 'Bauhaus',
    coverImage: getManagedImageUrl('artMovements-045'),
    galleryImages: [
      getManagedImageUrl('artMovements-046'),
      getManagedImageUrl('artMovements-047'),
      getManagedImageUrl('artMovements-048')
    ],
    summary: '包豪斯主张艺术与技术结合，追求功能主义与简洁形式，影响了整个现代设计。',
    origin: '1919-1933年，德国魏玛',
    history: '包豪斯由格罗皮乌斯创立，被纳粹关闭后，其理念传播到全世界。',
    keyFeatures: ['功能主义', '几何形式', '基础课程', '工业设计', '国际风格'],
    colorPalette: [
      createPalette('包豪斯红', '#E53E3E'),
      createPalette('包豪斯黄', '#ECC94B'),
      createPalette('包豪斯蓝', '#3182CE')
    ],
    keywords: ['包豪斯', '功能', '几何', '设计', '现代', '建筑'],
    representativeArtists: [
      createArtist('gropius', '格罗皮乌斯', '德国', '1883-1969年'),
      createArtist('kandinsky', '康定斯基', '俄罗斯', '1866-1944年'),
      createArtist('mies', '密斯·凡·德·罗', '德国', '1886-1969年')
    ],
    representativeWorks: [
      createWork('dessau', '包豪斯校舍', '格罗皮乌斯', '1926年'),
      createWork('teapot', 'MT49茶壶', '布兰德', '1924年')
    ],
    relatedAesthetics: ['constructivism', 'minimalism', 'swiss-design'],
    timeline: [
      createTimelineEntry('1919年', '包豪斯创立'),
      createTimelineEntry('1926年', '德绍校舍'),
      createTimelineEntry('1933年', '包豪斯关闭')
    ],
    popularityScore: 91,
    communityPostsCount: 323,
    categoryId: 'art-movements',
    subcategoryId: 'modern-art',
    moodTags: ['minimal', 'functional', 'modernist'],
    era: 'modern',
    region: 'europe'
  },
  {
    id: 'minimalism',
    nameCn: '极简主义',
    nameEn: 'Minimalism',
    coverImage: getManagedImageUrl('artMovements-049'),
    galleryImages: [
      getManagedImageUrl('artMovements-050'),
      getManagedImageUrl('artMovements-051'),
      getManagedImageUrl('artMovements-052')
    ],
    summary: '极简主义去除一切非必要元素，以纯粹的几何形式探索物的本质。',
    origin: '1960-1975年，美国纽约',
    history: '极简主义是对抽象表现主义的反叛，强调客观性与观者直接体验。',
    keyFeatures: ['几何极简', '重复序列', '工业材料', '空间探索', '非表达性'],
    colorPalette: [
      createPalette('极简白', '#F7FAFC'),
      createPalette('极简黑', '#1A202C'),
      createPalette('钢铁灰', '#A0AEC0')
    ],
    keywords: ['极简', '几何', '重复', '工业', '客观', '极少'],
    representativeArtists: [
      createArtist('jud', '贾德', '美国', '1928-1994年'),
      createArtist('flavin', '弗莱文', '美国', '1933-1996年'),
      createArtist('andre', '安德烈', '美国', '1935-2024年')
    ],
    representativeWorks: [
      createWork('stacks', '无题', '贾德', '1964年'),
      createWork('lights', '无题', '弗莱文', '1963年')
    ],
    relatedAesthetics: ['bauhaus', 'conceptual-art', 'zen'],
    timeline: [
      createTimelineEntry('1964年', '极简主义命名'),
      createTimelineEntry('1968年', '国际展览'),
      createTimelineEntry('1975年', '转向观念艺术')
    ],
    popularityScore: 88,
    communityPostsCount: 312,
    categoryId: 'art-movements',
    subcategoryId: 'contemporary-art',
    moodTags: ['minimal', 'calm', 'meditative'],
    era: 'contemporary',
    region: 'north-america'
  },
  {
    id: 'pop-art',
    nameCn: '波普艺术',
    nameEn: 'Pop Art',
    coverImage: getManagedImageUrl('artMovements-053'),
    galleryImages: [
      getManagedImageUrl('artMovements-054'),
      getManagedImageUrl('artMovements-055'),
      getManagedImageUrl('artMovements-056')
    ],
    summary: '波普艺术拥抱大众文化，将消费品、名人、漫画转化为艺术作品。',
    origin: '1950-1970年，英国/美国',
    history: '波普艺术挑战高雅与通俗的界限，是消费社会的艺术反映。',
    keyFeatures: ['大众文化', '复制技法', '名人肖像', '日常物品', '商业美学'],
    colorPalette: [
      createPalette('金宝红', '#E53E3E'),
      createPalette('漫画黄', '#ECC94B'),
      createPalette('商业蓝', '#3182CE')
    ],
    keywords: ['波普', '沃霍尔', '消费', '大众', '复制', '名人'],
    representativeArtists: [
      createArtist('warhol', '沃霍尔', '美国', '1928-1987年'),
      createArtist('lichtenstein', '利希滕斯坦', '美国', '1923-1997年'),
      createArtist('oldenburg', '奥登堡', '瑞典', '1929-2022年')
    ],
    representativeWorks: [
      createWork('soup', '坎贝尔汤罐', '沃霍尔', '1962年'),
      createWork('marilyn', '玛丽莲双联画', '沃霍尔', '1962年')
    ],
    relatedAesthetics: ['vaporwave', 'y2k', 'consumerist'],
    timeline: [
      createTimelineEntry('1952年', '独立团体成立'),
      createTimelineEntry('1962年', '沃霍尔展览'),
      createTimelineEntry('1987年', '沃霍尔去世')
    ],
    popularityScore: 95,
    communityPostsCount: 432,
    categoryId: 'art-movements',
    subcategoryId: 'contemporary-art',
    moodTags: ['vibrant', 'playful', 'ironic'],
    era: 'contemporary',
    region: 'north-america'
  }
];
