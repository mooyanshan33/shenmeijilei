// ==========================================
// Supabase 数据导入脚本
// ==========================================
// 使用方法：
// 1. 安装依赖：npm install @supabase/supabase-js
// 2. 创建 .env 文件，填入你的 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY
// 3. 运行：node import-data.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 初始化 Supabase 客户端（使用服务角色密钥）
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('请在 .env 文件中设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ==========================================
// 导入数据函数
// ==========================================

async function importCategories() {
  console.log('正在导入分类数据...');

  const categories = [
    { id: 'classical', name: '经典美学', name_en: 'Classical Aesthetics' },
    { id: 'art-movements', name: '艺术运动', name_en: 'Art Movements' },
    { id: 'design-interior', name: '设计与空间', name_en: 'Design & Interior' },
    { id: 'internet', name: '互联网美学', name_en: 'Internet Aesthetics' },
    { id: 'mood-scene', name: '情绪与场景', name_en: 'Mood & Scene' },
    { id: 'eastern-regional', name: '东方与地域', name_en: 'Eastern & Regional' }
  ];

  const { error } = await supabase
    .from('aesthetic_categories')
    .upsert(categories, { onConflict: 'id' });

  if (error) {
    console.error('导入分类失败:', error);
    return false;
  }

  console.log('✅ 分类数据导入成功！');
  return true;
}

async function importSubcategories() {
  console.log('正在导入子分类数据...');

  const subcategories = [
    { id: 'classical-core', category_id: 'classical', name: '西方古典', name_en: 'Western Classical' },
    { id: 'eastern-classical', category_id: 'classical', name: '东方古典', name_en: 'Eastern Classical' },
    { id: 'historical-art', category_id: 'art-movements', name: '历史艺术', name_en: 'Historical Art' },
    { id: 'modern-art', category_id: 'art-movements', name: '现代艺术', name_en: 'Modern Art' },
    { id: 'contemporary-art', category_id: 'art-movements', name: '当代艺术', name_en: 'Contemporary Art' },
    { id: 'architecture', category_id: 'design-interior', name: '建筑设计', name_en: 'Architecture' },
    { id: 'graphic-design', category_id: 'design-interior', name: '平面设计', name_en: 'Graphic Design' },
    { id: 'retro-tech', category_id: 'internet', name: '复古科技', name_en: 'Retro Tech' },
    { id: 'y2k', category_id: 'internet', name: 'Y2K体系', name_en: 'Y2K' },
    { id: 'retro-internet', category_id: 'internet', name: '互联网怀旧', name_en: 'Internet Nostalgia' },
    { id: 'dream-weird', category_id: 'internet', name: '梦境怪异', name_en: 'Dream & Weird' },
    { id: 'nature-core', category_id: 'internet', name: '自然系', name_en: 'Nature Cores' },
    { id: 'academic', category_id: 'internet', name: '学院系', name_en: 'Academic' },
    { id: 'feminine', category_id: 'internet', name: '少女系', name_en: 'Feminine' },
    { id: 'street-youth', category_id: 'internet', name: '街头青年', name_en: 'Street & Youth' },
    { id: 'futurist', category_id: 'internet', name: '未来主义', name_en: 'Futurist' },
    { id: 'mood', category_id: 'mood-scene', name: '情绪', name_en: 'Mood' },
    { id: 'scene', category_id: 'mood-scene', name: '场景', name_en: 'Scene' },
    { id: 'time-season', category_id: 'mood-scene', name: '时间季节', name_en: 'Time & Season' },
    { id: 'chinese', category_id: 'eastern-regional', name: '中国', name_en: 'Chinese' },
    { id: 'japanese', category_id: 'eastern-regional', name: '日本', name_en: 'Japanese' },
    { id: 'korean', category_id: 'eastern-regional', name: '韩国', name_en: 'Korean' },
    { id: 'western-regional', category_id: 'eastern-regional', name: '西方地域', name_en: 'Western Regional' }
  ];

  const { error } = await supabase
    .from('aesthetic_subcategories')
    .upsert(subcategories, { onConflict: 'id' });

  if (error) {
    console.error('导入子分类失败:', error);
    return false;
  }

  console.log('✅ 子分类数据导入成功！');
  return true;
}

async function importAesthetics(aesthetics) {
  console.log(`正在导入 ${aesthetics.length} 个美学类型...`);

  const formattedAesthetics = aesthetics.map(a => ({
    id: a.id,
    category_id: a.categoryId,
    subcategory_id: a.subcategoryId,
    name_cn: a.nameCn,
    name_en: a.nameEn,
    cover_image: a.coverImage,
    gallery_images: a.galleryImages,
    summary: a.summary,
    origin: a.origin,
    history: a.history,
    key_features: a.keyFeatures,
    color_palette: JSON.parse(JSON.stringify(a.colorPalette)),
    keywords: a.keywords,
    representative_artists: JSON.parse(JSON.stringify(a.representativeArtists)),
    representative_works: JSON.parse(JSON.stringify(a.representativeWorks)),
    related_aesthetics: a.relatedAesthetics,
    timeline: JSON.parse(JSON.stringify(a.timeline)),
    popularity_score: a.popularityScore,
    community_posts_count: a.communityPostsCount,
    mood_tags: a.moodTags,
    era: a.era,
    region: a.region,
    is_active: true
  }));

  const { error } = await supabase
    .from('aesthetic_types')
    .upsert(formattedAesthetics, { onConflict: 'id' });

  if (error) {
    console.error('导入美学数据失败:', error);
    return false;
  }

  console.log(`✅ ${aesthetics.length} 个美学类型导入成功！`);
  return true;
}

async function main() {
  console.log('🚀 开始导入数据到 Supabase...\n');

  try {
    // 导入分类
    const categorySuccess = await importCategories();
    if (!categorySuccess) return;

    // 导入子分类
    const subcategorySuccess = await importSubcategories();
    if (!subcategorySuccess) return;

    console.log('\n🎉 数据导入完成！');
  } catch (error) {
    console.error('❌ 导入失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件，执行 main
if (require.main === module) {
  main();
}

module.exports = {
  importCategories,
  importSubcategories,
  importAesthetics,
  supabase
};
