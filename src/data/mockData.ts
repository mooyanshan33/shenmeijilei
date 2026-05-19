import type { AestheticType, Contribution, AestheticLog, UserProfile, AestheticCategory, AestheticVideo } from '@/types';
import { avatarUrlFromSeed } from '@/lib/avatars';
import { getGalleryImageUrl } from '@/lib/gallery';

export const aestheticTypes: AestheticType[] = [
  {
    id: '1',
    name: '侘寂',
    nameEn: 'Wabi-Sabi',
    origin: '日本',
    era: '15世纪至今',
    description: '侘寂是日本传统美学中最具代表性的概念之一，强调在不完美中寻找美，接受生命的无常和缺陷。它欣赏朴素、谦逊、不对称、粗糙或不规则的美，认为真正的美存在于朴素和谦逊之中。',
    features: [
      '接受不完美与无常',
      '欣赏自然老化过程',
      '简约而朴素的设计',
      '不对称的构图',
      '天然材料的使用'
    ],
    coverImage: '/aesthetic-wabi-sabi.jpg',
    gallery: ['/aesthetic-wabi-sabi.jpg'],
    relatedArtists: ['千利休', '柳宗悦']
  },
  {
    id: '2',
    name: '极简主义',
    nameEn: 'Minimalism',
    origin: '西方',
    era: '1960年代至今',
    description: '极简主义是一种将设计元素简化到最基本形式的艺术风格。它强调"少即是多"，通过去除多余的装饰，让观者专注于作品的本质和核心内容。极简主义追求纯粹、简洁和秩序。',
    features: [
      '简洁的几何形状',
      '大量留白空间',
      '有限的色彩 palette',
      '功能性优先',
      '去除多余装饰'
    ],
    coverImage: '/aesthetic-minimalism.jpg',
    gallery: ['/aesthetic-minimalism.jpg'],
    relatedArtists: ['Donald Judd', 'Dan Flavin']
  },
  {
    id: '3',
    name: '赛博朋克',
    nameEn: 'Cyberpunk',
    origin: '科幻文学',
    era: '1980年代至今',
    description: '赛博朋克是一种融合高科技与低端生活的科幻美学风格。它以霓虹灯光、雨夜城市、人工智能和虚拟现实为视觉特征，探讨科技发展对社会和人性的影响。视觉风格通常充满未来感和颓废感。',
    features: [
      '霓虹灯光与暗色调对比',
      '高科技与废墟并存',
      '雨夜城市景观',
      '人机融合元素',
      '反乌托邦氛围'
    ],
    coverImage: getGalleryImageUrl('赛博朋克1.png'),
    gallery: [getGalleryImageUrl('赛博朋克1.png'), getGalleryImageUrl('赛博朋克2.png')],
    relatedArtists: ['Syd Mead', 'Simon Stålenhag']
  },
  {
    id: '4',
    name: '新中式',
    nameEn: 'Neo-Chinese',
    origin: '中国',
    era: '21世纪',
    description: '新中式是将传统中式元素与现代设计理念相结合的美学风格。它保留了中国传统文化的精髓，如山水意境、对称布局、木质结构，同时融入现代简约的设计语言，创造出既有东方韵味又符合现代审美的空间。',
    features: [
      '传统与现代的融合',
      '中式元素的现代化演绎',
      '自然材质的运用',
      '意境营造',
      '对称与平衡'
    ],
    coverImage: '/aesthetic-neo-chinese.jpg',
    gallery: ['/aesthetic-neo-chinese.jpg'],
    relatedArtists: ['贝聿铭', '马岩松']
  },
  {
    id: '5',
    name: '波普艺术',
    nameEn: 'Pop Art',
    origin: '英国/美国',
    era: '1950-1970年代',
    description: '波普艺术是一种源于大众文化的艺术运动，它将广告、漫画和日常物品等流行文化元素融入艺术创作。波普艺术以鲜艳的色彩、大胆的图形和重复的元素为特征，挑战传统艺术的精英主义。',
    features: [
      '鲜艳的原色运用',
      '大众文化图像',
      '重复与复制',
      '漫画风格元素',
      '商业艺术手法'
    ],
    coverImage: '/aesthetic-pop-art.jpg',
    gallery: ['/aesthetic-pop-art.jpg'],
    relatedArtists: ['Andy Warhol', 'Roy Lichtenstein']
  },
  {
    id: '6',
    name: '装饰艺术',
    nameEn: 'Art Deco',
    origin: '法国',
    era: '1920-1940年代',
    description: '装饰艺术是一种充满魅力和奢华感的设计风格，以其几何形状、对称图案和豪华材质著称。它代表了现代性与传统的结合，在20世纪初的建筑、家具和时尚领域产生了深远影响。',
    features: [
      '几何图案与对称',
      '金色与黑色的搭配',
      '太阳放射状图案',
      '奢华材质的使用',
      '流线型设计'
    ],
    coverImage: '/aesthetic-art-deco.jpg',
    gallery: ['/aesthetic-art-deco.jpg'],
    relatedArtists: ['Erté', 'Tamara de Lempicka']
  }
];

export const contributions: Contribution[] = [
  {
    id: '1',
    userId: 'user2',
    userName: '城市漫步者',
    userAvatar: avatarUrlFromSeed('user2'),
    imageUrl: getGalleryImageUrl('赛博朋克1.png'),
    caption: '雨夜霓虹，城市的另一种面孔',
    tags: ['赛博朋克', '城市', '夜景'],
    likes: 256,
    isLiked: true,
    comments: 45,
    createdAt: '2024-01-15T18:20:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    userName: '城市漫步者',
    userAvatar: avatarUrlFromSeed('user2'),
    imageUrl: getGalleryImageUrl('赛博朋克2.png'),
    caption: '霓虹灯下的未来都市，科技与废墟的交织',
    tags: ['赛博朋克', '未来', '建筑'],
    likes: 189,
    isLiked: false,
    comments: 32,
    createdAt: '2024-01-14T20:15:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    userName: '美学探索者',
    userAvatar: avatarUrlFromSeed('user1'),
    imageUrl: '/aesthetic-minimalism.jpg',
    caption: '今日发现的极简建筑，光影与空间的完美对话',
    tags: ['极简主义', '建筑', '光影'],
    likes: 128,
    isLiked: false,
    comments: 23,
    createdAt: '2024-01-13T10:30:00Z'
  },
  {
    id: '4',
    userId: 'user3',
    userName: '禅意生活',
    userAvatar: avatarUrlFromSeed('user3'),
    imageUrl: '/aesthetic-wabi-sabi.jpg',
    caption: '不完美中的完美，岁月的痕迹',
    tags: ['侘寂', '禅意', '生活'],
    likes: 89,
    isLiked: false,
    comments: 12,
    createdAt: '2024-01-12T09:15:00Z'
  },
  {
    id: '5',
    userId: 'user4',
    userName: '东方美学',
    userAvatar: avatarUrlFromSeed('user4'),
    imageUrl: '/aesthetic-neo-chinese.jpg',
    caption: '新中式空间的静谧之美',
    tags: ['新中式', '室内设计', '东方'],
    likes: 167,
    isLiked: false,
    comments: 31,
    createdAt: '2024-01-11T14:45:00Z'
  }
];

export const aestheticLogs: AestheticLog[] = [
  {
    id: '1',
    userId: 'user2',
    date: '2024-01-15',
    content: '赛博朋克的霓虹灯光，科技与颓废的交织，让人既向往又警惕。这种美学风格不仅仅是视觉的享受，更是对未来的思考。',
    imageUrl: getGalleryImageUrl('赛博朋克1.png'),
    tags: ['赛博朋克', '观察', '未来'],
    createdAt: '2024-01-15T21:30:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    date: '2024-01-13',
    content: '今天深入了解了侘寂美学，在不完美中寻找美的理念让我深受触动。那些岁月留下的痕迹，那些不完美的纹理，恰恰是生命最真实的印记。',
    tags: ['侘寂', '思考', '感悟'],
    createdAt: '2024-01-13T20:00:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    date: '2024-01-08',
    content: '极简主义教会我做减法的重要性。生活中太多的噪音和干扰，只有去除多余，才能看到真正重要的东西。',
    tags: ['极简主义', '生活', '哲学'],
    createdAt: '2024-01-08T19:15:00Z'
  }
];

export const userProfile: UserProfile = {
  id: 'user1',
  name: '美学探索者',
  avatar: avatarUrlFromSeed('user1-profile'),
  bio: '在美的世界中不断探索与积累',
  logCount: 12,
  contributionCount: 8,
  favoriteCount: 45
};

export const aestheticCategories: AestheticCategory[] = [
  { id: '1', name: '核类美学', icon: 'radioactive' },
  { id: '2', name: '互联网美学', icon: 'language' },
  { id: '3', name: '海洋学术', icon: 'water' },
  { id: '4', name: '蒸汽朋克', icon: 'settings' },
  { id: '5', name: '复古未来', icon: 'rocket_launch' },
  { id: '6', name: '极简主义', icon: 'check_box_outline_blank' },
];

export const aestheticVideos: AestheticVideo[] = [
  {
    id: '1',
    title: '什么是“核类美学”？从 Weirdcore 到 Dreamcore 的视觉奇观',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    videoUrl: '#',
    duration: '12:45',
    views: '12.5万',
    author: '美学研究室',
    category: '核类美学'
  },
  {
    id: '2',
    title: '海洋学术美学：深海、神话与维多利亚时代的科学探索',
    thumbnail: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&auto=format&fit=crop&q=60',
    videoUrl: '#',
    duration: '08:20',
    views: '8.3万',
    author: '艺术漫谈',
    category: '海洋学术'
  },
  {
    id: '3',
    title: '互联网美学史：从 Windows 95 到 Vaporwave 的视觉演变',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
    videoUrl: '#',
    duration: '15:10',
    views: '20.1万',
    author: '数字考古学家',
    category: '互联网美学'
  }
];
