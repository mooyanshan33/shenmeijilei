export const GALLERY_BUCKET = 'gallery';
const SUPABASE_PUBLIC_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://tefbzxcdrlepzhgjfpdq.supabase.co';

export interface GalleryImage {
  fileName: string;
  category: string;
  tags?: string[];
}

export const galleryImages: GalleryImage[] = [
  {
    fileName: 'cyberpunk-1.png',
    category: 'aesthetics',
    tags: ['赛博朋克', '霓虹', '夜景'],
  },
  {
    fileName: 'cyberpunk-2.png',
    category: 'aesthetics',
    tags: ['赛博朋克', '未来', '城市'],
  },
  {
    fileName: 'matcha.jpg',
    category: 'color-themes',
    tags: ['抹茶', '绿色', '清新'],
  },
  {
    fileName: 'light-gray.png',
    category: 'color-themes',
    tags: ['浅灰', '灰色', '简约'],
  },
  {
    fileName: 'light-pink.jpg',
    category: 'color-themes',
    tags: ['浅灰', '粉色', '柔和'],
  },
  {
    fileName: 'sea-salt.png',
    category: 'color-themes',
    tags: ['海盐', '蓝色', '清新'],
  },
  {
    fileName: 'oat.png',
    category: 'color-themes',
    tags: ['燕麦', '米色', '温暖'],
  },
  {
    fileName: 'dark-light-gray.png',
    category: 'color-themes',
    tags: ['黑色', '浅灰', '对比'],
  },
  {
    fileName: 'dark-pink.jpg',
    category: 'color-themes',
    tags: ['黑色', '粉色', '时尚'],
  },
];

const legacyFileNameMap: Record<string, string> = {
  '赛博朋克1.png': 'cyberpunk-1.png',
  '赛博朋克2.png': 'cyberpunk-2.png',
  '抹茶.jpg': 'matcha.jpg',
  '浅灰-灰.png': 'light-gray.png',
  '浅灰-粉.jpg': 'light-pink.jpg',
  '海盐.png': 'sea-salt.png',
  '燕麦.png': 'oat.png',
  '黑-浅灰.png': 'dark-light-gray.png',
  '黑粉.jpg': 'dark-pink.jpg',
};

function resolveGalleryFileName(fileName: string) {
  return legacyFileNameMap[fileName] ?? fileName;
}

export function getGalleryImageUrl(fileName: string): string {
  const resolvedFileName = resolveGalleryFileName(fileName);
  const image = galleryImages.find(img => img.fileName === resolvedFileName);
  try {
    if (image) {
      return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${image.category}/${resolvedFileName}`;
    }
    return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${resolvedFileName}`;
  } catch (error) {
    console.warn('获取 Storage URL 失败，返回 Supabase 默认地址:', error);
    if (image) {
      return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${image.category}/${resolvedFileName}`;
    }
    return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${resolvedFileName}`;
  }
}

export function getGalleryImagesByCategory(category: string): GalleryImage[] {
  return galleryImages.filter(img => img.category.startsWith(category));
}

export function getManagedImageUrl(assetKey: string): string {
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${GALLERY_BUCKET}/managed/${assetKey}`;
}

export function getAestheticCoverUrl(aestheticId: string): string {
  const aestheticMap: Record<string, string> = {
    'wabi-sabi': 'aesthetics/wabi-sabi.jpg',
    'minimalism': 'aesthetics/minimalism.jpg',
    'cyberpunk': 'aesthetics/cyberpunk.jpg',
    'neo-chinese': 'aesthetics/neo-chinese.jpg',
    'pop-art': 'aesthetics/pop-art.jpg',
    'art-deco': 'aesthetics/art-deco.jpg',
  };

  try {
    const path = aestheticMap[aestheticId] || `aesthetics/${aestheticId}.jpg`;
    return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${path}`;
  } catch {
    const path = aestheticMap[aestheticId] || `aesthetics/${aestheticId}.jpg`;
    return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${path}`;
  }
}
