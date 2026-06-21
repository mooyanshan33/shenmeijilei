import { supabase } from '@/supabase/client';

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

/** 通过 Supabase Storage API 生成公网 URL */
export function getStoragePublicUrl(storagePath: string): string {
  const normalized = storagePath.replace(/^\/+/, '');
  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(normalized);
  return data.publicUrl;
}

/** 将相对路径或 asset key 统一解析为完整公网 URL */
export function resolveStorageImageUrl(input: string | null | undefined): string {
  if (!input?.trim()) return '';

  const value = input.trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith('/storage/v1/object/public/')) {
    return `${SUPABASE_PUBLIC_URL}${value}`;
  }

  if (value.startsWith(`${GALLERY_BUCKET}/`)) {
    return getStoragePublicUrl(value.slice(GALLERY_BUCKET.length + 1));
  }

  return getStoragePublicUrl(value);
}

export function isManagedStorageUrl(url: string): boolean {
  return /\/storage\/v1\/object\/public\/gallery\/managed\//i.test(url);
}

export function getGalleryImageUrl(fileName: string): string {
  const resolvedFileName = resolveGalleryFileName(fileName);
  const image = galleryImages.find((img) => img.fileName === resolvedFileName);

  if (image) {
    return getStoragePublicUrl(`${image.category}/${resolvedFileName}`);
  }

  return getStoragePublicUrl(resolvedFileName);
}

export function getGalleryImagesByCategory(category: string): GalleryImage[] {
  return galleryImages.filter((img) => img.category.startsWith(category));
}

export function getManagedImageUrl(assetKey: string): string {
  return getStoragePublicUrl(`managed/${assetKey}`);
}

export function getAestheticCoverUrl(aestheticId: string): string {
  const aestheticMap: Record<string, string> = {
    'wabi-sabi': 'aesthetics/wabi-sabi.jpg',
    minimalism: 'aesthetics/minimalism.jpg',
    cyberpunk: 'aesthetics/cyberpunk.jpg',
    'neo-chinese': 'aesthetics/neo-chinese.jpg',
    'pop-art': 'aesthetics/pop-art.jpg',
    'art-deco': 'aesthetics/art-deco.jpg',
  };

  const path = aestheticMap[aestheticId] ?? `aesthetics/${aestheticId}.jpg`;
  return getStoragePublicUrl(path);
}
