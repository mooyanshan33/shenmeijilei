export const GALLERY_BUCKET = 'gallery';

export interface GalleryImage {
  fileName: string;
  category: string;
  tags?: string[];
}

export const galleryImages: GalleryImage[] = [
  {
    fileName: '赛博朋克1.png',
    category: 'aesthetics/cyberpunk',
    tags: ['赛博朋克', '霓虹', '夜景'],
  },
  {
    fileName: '赛博朋克2.png',
    category: 'aesthetics/cyberpunk',
    tags: ['赛博朋克', '未来', '城市'],
  },
  {
    fileName: '抹茶.jpg',
    category: 'color-themes/matcha',
    tags: ['抹茶', '绿色', '清新'],
  },
  {
    fileName: '浅灰-灰.png',
    category: 'color-themes/light-gray',
    tags: ['浅灰', '灰色', '简约'],
  },
  {
    fileName: '浅灰-粉.jpg',
    category: 'color-themes/light-pink',
    tags: ['浅灰', '粉色', '柔和'],
  },
  {
    fileName: '浅灰-黑.png',
    category: 'color-themes/light-black',
    tags: ['浅灰', '黑色', '高级'],
  },
  {
    fileName: '海盐.png',
    category: 'color-themes/sea-salt',
    tags: ['海盐', '蓝色', '清新'],
  },
  {
    fileName: '燕麦.png',
    category: 'color-themes/oat',
    tags: ['燕麦', '米色', '温暖'],
  },
  {
    fileName: '黑-浅灰.png',
    category: 'color-themes/dark-light-gray',
    tags: ['黑色', '浅灰', '对比'],
  },
  {
    fileName: '黑粉.jpg',
    category: 'color-themes/dark-pink',
    tags: ['黑色', '粉色', '时尚'],
  },
];

export function getGalleryImageUrl(fileName: string): string {
  const image = galleryImages.find(img => img.fileName === fileName);
  if (!image) return `/picture/${fileName}`;
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      console.warn('VITE_SUPABASE_URL 未设置，使用本地图片');
      return `/picture/${fileName}`;
    }
    const storageUrl = `${supabaseUrl}/storage/v1/object/public/${GALLERY_BUCKET}/${image.category}/${fileName}`;
    console.log(`图库图片 URL: ${fileName} -> ${storageUrl}`);
    return storageUrl;
  } catch (error) {
    console.warn('获取 Storage URL 失败，使用本地图片:', error);
    return `/picture/${fileName}`;
  }
}

export function getGalleryImagesByCategory(category: string): GalleryImage[] {
  return galleryImages.filter(img => img.category.startsWith(category));
}
