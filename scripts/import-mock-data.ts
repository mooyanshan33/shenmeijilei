/import { createClient } from '@supabase/supabase-js';
import { aestheticTypes, contributions, aestheticLogs } from '../src/data/mockData';

const supabaseUrl = 'https://tefbzxcdrlepzhgjfpdq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZmJ6eGNkcmxlcHpoZ2pmcGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MTI3MDAsImV4cCI6MjA5MDQ4ODcwMH0.dqhci98lb_3k8SKZcRoofQ24Zz7lPzzgE_aFzO3ShIQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importAestheticTypes() {
  console.log('正在导入审美类型数据...');
  
  for (const aesthetic of aestheticTypes) {
    const { error } = await supabase
      .from('aesthetic_types')
      .upsert({
        id: aesthetic.id,
        name: aesthetic.name,
        name_en: aesthetic.nameEn,
        origin: aesthetic.origin,
        era: aesthetic.era,
        description: aesthetic.description,
        features: aesthetic.features,
        cover_image: aesthetic.coverImage,
        gallery: aesthetic.gallery,
        related_artists: aesthetic.relatedArtists,
        tags: aesthetic.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(`导入审美类型 ${aesthetic.name} 失败:`, error);
    } else {
      console.log(`✅ 成功导入: ${aesthetic.name}`);
    }
  }
}

async function importContributions() {
  console.log('\n正在导入创意工坊数据...');
  
  for (const contribution of contributions) {
    const { error } = await supabase
      .from('contributions')
      .upsert({
        id: contribution.id,
        user_id: contribution.userId,
        user_name: contribution.userName,
        user_avatar: contribution.userAvatar,
        image_url: contribution.imageUrl,
        caption: contribution.caption,
        tags: contribution.tags,
        likes: contribution.likes,
        comments: contribution.comments,
        created_at: contribution.createdAt,
      });

    if (error) {
      console.error(`导入帖子 ${contribution.id} 失败:`, error);
    } else {
      console.log(`✅ 成功导入帖子: ${contribution.caption.slice(0, 20)}...`);
    }
  }
}

async function importLogs() {
  console.log('\n正在导入美学日志数据...');
  
  for (const log of aestheticLogs) {
    const { error } = await supabase
      .from('aesthetic_logs')
      .upsert({
        id: log.id,
        user_id: log.userId,
        date: log.date,
        content: log.content,
        image_url: log.imageUrl,
        tags: log.tags,
        created_at: log.createdAt,
      });

    if (error) {
      console.error(`导入日志 ${log.id} 失败:`, error);
    } else {
      console.log(`✅ 成功导入日志: ${log.content.slice(0, 30)}...`);
    }
  }
}

async function main() {
  console.log('🚀 开始导入 mock 数据到 Supabase...\n');
  
  try {
    await importAestheticTypes();
    await importContributions();
    await importLogs();
    
    console.log('\n🎉 数据导入完成！');
  } catch (error) {
    console.error('❌ 数据导入失败:', error);
    process.exit(1);
  }
}

main();
