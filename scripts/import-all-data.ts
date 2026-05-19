import { createClient } from '@supabase/supabase-js';
import { aestheticTypes, contributions, aestheticLogs, aestheticCategories, aestheticVideos } from '../src/data/mockData';

const supabaseUrl = 'https://tefbzxcdrlepzhgjfpdq.supabase.co';
const serviceRoleKey = 'YOUR_SERVICE_ROLE_KEY';

console.log('========================================');
console.log('🚀 Supabase 数据导入脚本');
console.log('========================================');
console.log('\n📋 使用说明：');
console.log('1. 在 Supabase 控制台获取 Service Role Key');
console.log('2. 修改此文件中的 serviceRoleKey 变量');
console.log('3. 确保已在 Supabase 中创建以下表：');
console.log('   - aesthetic_types');
console.log('   - aesthetic_categories');
console.log('   - aesthetic_videos');
console.log('   - contributions');
console.log('   - aesthetic_logs');
console.log('   - likes');
console.log('   - contribution_comments');
console.log('   - profiles');
console.log('4. 运行此脚本导入数据\n');

console.log('========================================');
console.log('📁 要导入的数据：');
console.log(`   - 审美类型: ${aestheticTypes.length} 条`);
console.log(`   - 分类: ${aestheticCategories.length} 条`);
console.log(`   - 视频: ${aestheticVideos.length} 条`);
console.log(`   - 创意工坊帖子: ${contributions.length} 条`);
console.log(`   - 美学日志: ${aestheticLogs.length} 条`);
console.log('========================================\n');

console.log('⚠️  注意：请先在 Supabase 控制台中手动创建这些表');
console.log('   或者使用 SQL 编辑器执行以下建表语句：\n');

console.log(`
-- ========================================
-- 审美类型表 (aesthetic_types)
-- ========================================
CREATE TABLE aesthetic_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  origin TEXT,
  era TEXT,
  description TEXT,
  features TEXT[],
  cover_image TEXT,
  gallery TEXT[],
  related_artists TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 分类表 (aesthetic_categories)
-- ========================================
CREATE TABLE aesthetic_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 视频表 (aesthetic_videos)
-- ========================================
CREATE TABLE aesthetic_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  thumbnail TEXT,
  video_url TEXT,
  duration TEXT,
  views TEXT,
  author TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 创意工坊帖子表 (contributions)
-- ========================================
CREATE TABLE contributions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  image_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 点赞表 (likes)
-- ========================================
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id TEXT NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contribution_id, user_id)
);

-- ========================================
-- 评论表 (contribution_comments)
-- ========================================
CREATE TABLE contribution_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id TEXT NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT,
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 美学日志表 (aesthetic_logs)
-- ========================================
CREATE TABLE aesthetic_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 用户资料表 (profiles)
-- ========================================
CREATE TABLE profiles (
  id TEXT PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar TEXT,
  bio TEXT,
  log_count INTEGER DEFAULT 0,
  contribution_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 创建触发器自动更新更新时间
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_aesthetic_types_updated_at
  BEFORE UPDATE ON aesthetic_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 启用行级安全策略 (RLS)
-- ========================================
ALTER TABLE aesthetic_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE aesthetic_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE aesthetic_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contribution_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aesthetic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 创建 RLS 策略
-- ========================================
-- 审美类型：所有人可读
CREATE POLICY "Everyone can read aesthetic types"
  ON aesthetic_types FOR SELECT
  USING (true);

-- 分类：所有人可读
CREATE POLICY "Everyone can read aesthetic categories"
  ON aesthetic_categories FOR SELECT
  USING (true);

-- 视频：所有人可读
CREATE POLICY "Everyone can read aesthetic videos"
  ON aesthetic_videos FOR SELECT
  USING (true);

-- 帖子：所有人可读，用户可创建自己的帖子
CREATE POLICY "Everyone can read contributions"
  ON contributions FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own contributions"
  ON contributions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own contributions"
  ON contributions FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own contributions"
  ON contributions FOR DELETE
  USING (auth.uid()::text = user_id);

-- 点赞：所有人可读，用户可创建/删除自己的点赞
CREATE POLICY "Everyone can read likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid()::text = user_id);

-- 评论：所有人可读，用户可创建/删除自己的评论
CREATE POLICY "Everyone can read comments"
  ON contribution_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own comments"
  ON contribution_comments FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own comments"
  ON contribution_comments FOR DELETE
  USING (auth.uid()::text = user_id);

-- 日志：用户只能看自己的日志
CREATE POLICY "Users can read their own logs"
  ON aesthetic_logs FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own logs"
  ON aesthetic_logs FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own logs"
  ON aesthetic_logs FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own logs"
  ON aesthetic_logs FOR DELETE
  USING (auth.uid()::text = user_id);

-- 资料：所有人可读，用户可编辑自己的资料
CREATE POLICY "Everyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id);
`);
