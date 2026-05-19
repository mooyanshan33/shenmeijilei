import { getGalleryImageUrl, galleryImages } from '../src/lib/gallery';

console.log('🧪 测试图库 URL 生成\n');

console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('\n生成的图片 URL：');

for (const img of galleryImages) {
  const url = getGalleryImageUrl(img.fileName);
  console.log(`\n📁 ${img.fileName}`);
  console.log(`   分类: ${img.category}`);
  console.log(`   URL: ${url}`);
  console.log(`   标签: ${img.tags?.join(', ') || '无'}`);
}

console.log('\n✅ URL 生成完成！');
console.log('\n请手动检查这些 URL 是否可以在浏览器中打开。');
