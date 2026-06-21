import type { AestheticType } from '@/types';
import { CLASSICAL_AESTHETICS } from './aestheticDatabase';
import { ART_MOVEMENT_AESTHETICS } from './artMovements';
import { INTERNET_AESTHETICS } from './internetAesthetics';
import { getManagedImageUrl } from '@/lib/gallery';

// 设计与空间美学
const DESIGN_AESTHETICS: AestheticType[] = [
  {
    id: 'gothic',
    nameCn: '哥特式',
    nameEn: 'Gothic',
    coverImage: getManagedImageUrl('completeDatabase-001'),
    galleryImages: [
      getManagedImageUrl('completeDatabase-002'),
      getManagedImageUrl('completeDatabase-003'),
      getManagedImageUrl('completeDatabase-004')
    ],
    summary: '哥特式建筑以尖拱、飞扶壁与彩窗营造神圣崇高的垂直感。',
    origin: '12-16世纪，欧洲',
    history: '哥特式源于法国，后传遍欧洲，是中世纪宗教热情的建筑表达。',
    keyFeatures: ['尖拱', '飞扶壁', '肋拱', '彩窗玻璃', '垂直线条'],
    colorPalette: [
      { name: '教堂灰', hex: '#4A5568' },
      { name: '彩窗蓝', hex: '#2B6CB0' },
      { name: '烛光金', hex: '#D69E2E' }
    ],
    keywords: ['哥特', '教堂', '尖拱', '飞扶壁', '彩窗', '中世纪'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['dark-academia', 'gothic-revival', 'dark-victorian'],
    timeline: [
      { year: '1140年', event: '圣德尼修道院' },
      { year: '1260年', event: '沙特尔大教堂' },
      { year: '1430年', event: '哥特晚期' }
    ],
    popularityScore: 84,
    communityPostsCount: 256,
    categoryId: 'design-interior',
    subcategoryId: 'architecture',
    moodTags: ['mysterious', 'solemn', 'awe-inspiring'],
    era: 'medieval',
    region: 'europe'
  },
  {
    id: 'industrial',
    nameCn: '工业风',
    nameEn: 'Industrial Style',
    coverImage: getManagedImageUrl('completeDatabase-005'),
    galleryImages: [
      getManagedImageUrl('completeDatabase-006'),
      getManagedImageUrl('completeDatabase-007'),
      getManagedImageUrl('completeDatabase-008')
    ],
    summary: '工业风展现建筑的原始结构，以裸露的砖墙、金属与混凝土为美。',
    origin: '1970s-现代，美国纽约',
    history: '工业风源于艺术家对废弃仓库的改造，将工业空间转化为生活空间。',
    keyFeatures: ['裸露结构', '原始材料', '复古工业', '开放空间', '功能美学'],
    colorPalette: [
      { name: '金属灰', hex: '#A0AEC0' },
      { name: '砖红', hex: '#9B2C2C' },
      { name: '混凝土', hex: '#718096' }
    ],
    keywords: ['工业风', '仓库', '金属', '混凝土', '砖墙', '复古'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['brutalism', 'neo-brutalism', 'steampunk'],
    timeline: [
      { year: '1970年', event: '阁楼运动开始' },
      { year: '2000年', event: '商业空间应用' },
      { year: '2020年', event: '持续流行' }
    ],
    popularityScore: 90,
    communityPostsCount: 345,
    categoryId: 'design-interior',
    subcategoryId: 'architecture',
    moodTags: ['raw', 'edgy', 'urban'],
    era: 'contemporary',
    region: 'north-america'
  },
  {
    id: 'scandinavian',
    nameCn: '北欧风',
    nameEn: 'Scandinavian Style',
    coverImage: getManagedImageUrl('completeDatabase-009'),
    galleryImages: [
      getManagedImageUrl('completeDatabase-010'),
      getManagedImageUrl('completeDatabase-011'),
      getManagedImageUrl('completeDatabase-012')
    ],
    summary: '北欧风以简洁、自然光线与温馨质感创造舒适宜居的生活空间。',
    origin: '1950s-现代，北欧',
    history: '北欧设计强调功能与美观的结合，追求"为所有人的好设计"。',
    keyFeatures: ['简洁线条', '天然材料', '充足光线', '功能性', '温馨质感'],
    colorPalette: [
      { name: '北欧白', hex: '#F7FAFC' },
      { name: '原木色', hex: '#D4C4A8' },
      { name: '灰蓝色', hex: '#A0AEC0' }
    ],
    keywords: ['北欧', '极简', '温馨', '功能', '自然', '家居'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['minimalism', 'wabi-sabi', 'japanese-wabi'],
    timeline: [
      { year: '1940年', event: '现代北欧设计萌芽' },
      { year: '1960年', event: '黄金时代' },
      { year: '2010年', event: '全球流行' }
    ],
    popularityScore: 96,
    communityPostsCount: 489,
    categoryId: 'design-interior',
    subcategoryId: 'architecture',
    moodTags: ['calm', 'cozy', 'minimal'],
    era: 'contemporary',
    region: 'europe'
  }
];

// 东方与地域美学
const EASTERN_REGIONAL_AESTHETICS: AestheticType[] = [
  {
    id: 'japanese-wabi',
    nameCn: '日式侘寂',
    nameEn: 'Japanese Wabi-Sabi',
    coverImage: getManagedImageUrl('completeDatabase-013'),
    galleryImages: [
      getManagedImageUrl('completeDatabase-014'),
      getManagedImageUrl('completeDatabase-015'),
      getManagedImageUrl('completeDatabase-016')
    ],
    summary: '日式侘寂空间以自然材料、简洁布局与岁月痕迹创造宁静氛围。',
    origin: '16世纪-现代，日本',
    history: '日式空间美学源于茶道，追求空间与自然的和谐共生。',
    keyFeatures: ['榻榻米', '障子门', '天然素材', '简洁布局', '光影运用'],
    colorPalette: [
      { name: '榻榻米色', hex: '#D4B483' },
      { name: '障子白', hex: '#F7FAFC' },
      { name: '桧木色', hex: '#97733F' }
    ],
    keywords: ['日式', '侘寂', '榻榻米', '障子', '自然', '简约'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['wabi-sabi', 'zen', 'scandinavian'],
    timeline: [
      { year: '1582年', event: '待庵' },
      { year: '1620年', event: '桂离宫' },
      { year: '1980年', event: '全球影响' }
    ],
    popularityScore: 93,
    communityPostsCount: 398,
    categoryId: 'eastern-regional',
    subcategoryId: 'japanese',
    moodTags: ['calm', 'minimal', 'harmonious'],
    era: 'contemporary',
    region: 'asia'
  },
  {
    id: 'neo-chinese',
    nameCn: '新中式',
    nameEn: 'Neo-Chinese',
    coverImage: getManagedImageUrl('completeDatabase-017'),
    galleryImages: [
      getManagedImageUrl('completeDatabase-018'),
      getManagedImageUrl('completeDatabase-019'),
      getManagedImageUrl('completeDatabase-020')
    ],
    summary: '新中式融合传统中国美学与现代设计语言，创造当代东方意境。',
    origin: '2000s-现代，中国',
    history: '新中式是对传统中式风格的现代诠释，追求意境而非形式复制。',
    keyFeatures: ['明式线条', '当代材质', '东方意境', '留白美学', '文化符号'],
    colorPalette: [
      { name: '中国红', hex: '#9B2C2C' },
      { name: '宣纸白', hex: '#F7FAFC' },
      { name: '墨黑', hex: '#1A202C' }
    ],
    keywords: ['新中式', '东方', '意境', '明式', '留白', '现代'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['chinese-scholar', 'zen', 'japanese-wabi'],
    timeline: [
      { year: '2000年', event: '新中式萌芽' },
      { year: '2010年', event: '商业空间应用' },
      { year: '2022年', event: '设计成熟' }
    ],
    popularityScore: 91,
    communityPostsCount: 356,
    categoryId: 'eastern-regional',
    subcategoryId: 'chinese',
    moodTags: ['elegant', 'serene', 'contemplative'],
    era: 'contemporary',
    region: 'asia'
  }
];

// 情绪与场景美学
const MOOD_SCENE_AESTHETICS: AestheticType[] = [
  {
    id: 'comfortcore',
    nameCn: '舒适核',
    nameEn: 'Comfortcore',
    coverImage: getManagedImageUrl('completeDatabase-021'),
    galleryImages: [
      getManagedImageUrl('completeDatabase-022'),
      getManagedImageUrl('completeDatabase-023'),
      getManagedImageUrl('completeDatabase-024')
    ],
    summary: '舒适核追求极致的温暖与慰藉，以柔软质感、暖色调与熟悉事物为核心。',
    origin: '2020s-现代，互联网',
    history: '舒适核在疫情期间兴起，成为对抗焦虑的视觉避风港。',
    keyFeatures: ['柔软质感', '温暖色调', '熟悉物品', '居家氛围', '感官慰藉'],
    colorPalette: [
      { name: '米白', hex: '#FFFFF0' },
      { name: '暖棕', hex: '#744210' },
      { name: '淡粉', hex: '#FED7E2' }
    ],
    keywords: ['舒适', '温暖', '居家', '柔软', '慰藉', '治愈'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['cottagecore', 'grandmacore', 'scandinavian'],
    timeline: [
      { year: '2020年', event: '疫情期间兴起' },
      { year: '2021年', event: 'TikTok流行' },
      { year: '2023年', event: '持续流行' }
    ],
    popularityScore: 89,
    communityPostsCount: 312,
    categoryId: 'mood-scene',
    subcategoryId: 'mood',
    moodTags: ['comforting', 'warm', 'safe'],
    era: 'contemporary',
    region: 'global'
  },
  {
    id: 'quietcore',
    nameCn: '安静核',
    nameEn: 'Quietcore',
    coverImage: getManagedImageUrl('completeDatabase-025'),
    galleryImages: [
      getManagedImageUrl('completeDatabase-026'),
      getManagedImageUrl('completeDatabase-027'),
      getManagedImageUrl('completeDatabase-028')
    ],
    summary: '安静核拥抱宁静与沉默，在喧嚣世界中寻找内心的平静。',
    origin: '2020s-现代，互联网',
    history: '安静核是对信息过载的反叛，追求留白与简约的生活方式。',
    keyFeatures: ['宁静氛围', '极简构图', '自然声音', '沉默之美', '内心平静'],
    colorPalette: [
      { name: '淡灰', hex: '#E2E8F0' },
      { name: '天空蓝', hex: '#63B3ED' },
      { name: '苔绿', hex: '#48BB78' }
    ],
    keywords: ['安静', '宁静', '沉默', '简约', '内心', '平静'],
    representativeArtists: [],
    representativeWorks: [],
    relatedAesthetics: ['zen', 'solitudecore', 'scandinavian'],
    timeline: [
      { year: '2021年', event: '概念提出' },
      { year: '2022年', event: '社交媒体传播' },
      { year: '2023年', event: '生活方式趋势' }
    ],
    popularityScore: 85,
    communityPostsCount: 278,
    categoryId: 'mood-scene',
    subcategoryId: 'mood',
    moodTags: ['calm', 'peaceful', 'serene'],
    era: 'contemporary',
    region: 'global'
  }
];

// 完整数据库整合
export const COMPLETE_AESTHETICS: AestheticType[] = [
  ...CLASSICAL_AESTHETICS,
  ...ART_MOVEMENT_AESTHETICS,
  ...DESIGN_AESTHETICS,
  ...INTERNET_AESTHETICS,
  ...EASTERN_REGIONAL_AESTHETICS,
  ...MOOD_SCENE_AESTHETICS
];

// 获取所有美学
export function getAllAesthetics(): AestheticType[] {
  return COMPLETE_AESTHETICS;
}

// 根据ID获取美学
export function getAestheticById(id: string): AestheticType | undefined {
  return COMPLETE_AESTHETICS.find(a => a.id === id);
}

// 获取每日推荐
export function getDailyPicks(): AestheticType[] {
  const shuffled = [...COMPLETE_AESTHETICS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 6);
}

// 获取热门美学
export function getTrendingAesthetics(): AestheticType[] {
  return [...COMPLETE_AESTHETICS]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 10);
}

// 搜索美学
export function searchAesthetics(query: string, filters?: any): AestheticType[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  return COMPLETE_AESTHETICS.filter(aesthetic => {
    const matchesQuery = !normalizedQuery || 
      aesthetic.nameCn.toLowerCase().includes(normalizedQuery) ||
      aesthetic.nameEn.toLowerCase().includes(normalizedQuery) ||
      aesthetic.keywords.some(k => k.toLowerCase().includes(normalizedQuery)) ||
      aesthetic.summary.toLowerCase().includes(normalizedQuery);

    const matchesCategory = !filters?.categoryId || aesthetic.categoryId === filters.categoryId;
    const matchesSubcategory = !filters?.subcategoryId || aesthetic.subcategoryId === filters.subcategoryId;
    const matchesMood = !filters?.mood?.length || filters.mood.some((m: string) => aesthetic.moodTags.includes(m));
    const matchesEra = !filters?.era || aesthetic.era === filters.era;
    const matchesRegion = !filters?.region || aesthetic.region === filters.region;

    return matchesQuery && matchesCategory && matchesSubcategory && matchesMood && matchesEra && matchesRegion;
  });
}

// 获取相似美学
export function getSimilarAesthetics(aestheticId: string, count: number = 5): AestheticType[] {
  const aesthetic = getAestheticById(aestheticId);
  if (!aesthetic) return [];

  return COMPLETE_AESTHETICS
    .filter(a => a.id !== aestheticId)
    .map(a => {
      let score = 0;
      
      if (a.categoryId === aesthetic.categoryId) score += 3;
      if (a.subcategoryId === aesthetic.subcategoryId) score += 2;
      
      const commonKeywords = a.keywords.filter(k => aesthetic.keywords.includes(k));
      score += commonKeywords.length;
      
      const commonMoods = a.moodTags.filter(m => aesthetic.moodTags.includes(m));
      score += commonMoods.length * 2;
      
      if (a.region === aesthetic.region) score += 1;
      if (a.era === aesthetic.era) score += 1;
      
      return { aesthetic: a, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(x => x.aesthetic);
}
