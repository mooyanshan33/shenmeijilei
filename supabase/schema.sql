-- ========================================
-- 审美积累 App - Supabase 数据库 Schema
-- ========================================

-- ========================================
-- 1. 审美类型表 (aesthetic_types)
-- ========================================
CREATE TABLE IF NOT EXISTS aesthetic_types (
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
-- 2. 分类表 (aesthetic_categories)
-- ========================================
CREATE TABLE IF NOT EXISTS aesthetic_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. 视频表 (aesthetic_videos)
-- ========================================
CREATE TABLE IF NOT EXISTS aesthetic_videos (
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
-- 4. 创意工坊帖子表 (contributions)
-- ========================================
CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
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
-- 5. 点赞表 (likes)
-- ========================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contribution_id, user_id)
);

-- ========================================
-- 6. 评论表 (contribution_comments)
-- ========================================
CREATE TABLE IF NOT EXISTS contribution_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT,
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 7. 美学日志表 (aesthetic_logs)
-- ========================================
CREATE TABLE IF NOT EXISTS aesthetic_logs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 8. 用户资料表 (profiles)
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

DROP TRIGGER IF EXISTS update_aesthetic_types_updated_at ON aesthetic_types;
CREATE TRIGGER update_aesthetic_types_updated_at
  BEFORE UPDATE ON aesthetic_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
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
DROP POLICY IF EXISTS "Everyone can read aesthetic types" ON aesthetic_types;
CREATE POLICY "Everyone can read aesthetic types"
  ON aesthetic_types FOR SELECT
  USING (true);

-- 分类：所有人可读
DROP POLICY IF EXISTS "Everyone can read aesthetic categories" ON aesthetic_categories;
CREATE POLICY "Everyone can read aesthetic categories"
  ON aesthetic_categories FOR SELECT
  USING (true);

-- 视频：所有人可读
DROP POLICY IF EXISTS "Everyone can read aesthetic videos" ON aesthetic_videos;
CREATE POLICY "Everyone can read aesthetic videos"
  ON aesthetic_videos FOR SELECT
  USING (true);

-- 帖子：所有人可读
DROP POLICY IF EXISTS "Everyone can read contributions" ON contributions;
CREATE POLICY "Everyone can read contributions"
  ON contributions FOR SELECT
  USING (true);

-- 帖子：用户可创建自己的帖子
DROP POLICY IF EXISTS "Users can create their own contributions" ON contributions;
CREATE POLICY "Users can create their own contributions"
  ON contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 帖子：用户可更新自己的帖子
DROP POLICY IF EXISTS "Users can update their own contributions" ON contributions;
CREATE POLICY "Users can update their own contributions"
  ON contributions FOR UPDATE
  USING (auth.uid() = user_id);

-- 帖子：用户可删除自己的帖子
DROP POLICY IF EXISTS "Users can delete their own contributions" ON contributions;
CREATE POLICY "Users can delete their own contributions"
  ON contributions FOR DELETE
  USING (auth.uid() = user_id);

-- 点赞：所有人可读
DROP POLICY IF EXISTS "Everyone can read likes" ON likes;
CREATE POLICY "Everyone can read likes"
  ON likes FOR SELECT
  USING (true);

-- 点赞：用户可创建自己的点赞
DROP POLICY IF EXISTS "Users can create their own likes" ON likes;
CREATE POLICY "Users can create their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 点赞：用户可删除自己的点赞
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- 评论：所有人可读
DROP POLICY IF EXISTS "Everyone can read comments" ON contribution_comments;
CREATE POLICY "Everyone can read comments"
  ON contribution_comments FOR SELECT
  USING (true);

-- 评论：用户可创建自己的评论
DROP POLICY IF EXISTS "Users can create their own comments" ON contribution_comments;
CREATE POLICY "Users can create their own comments"
  ON contribution_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 评论：用户可删除自己的评论
DROP POLICY IF EXISTS "Users can delete their own comments" ON contribution_comments;
CREATE POLICY "Users can delete their own comments"
  ON contribution_comments FOR DELETE
  USING (auth.uid() = user_id);

-- 日志：用户只能看自己的日志
DROP POLICY IF EXISTS "Users can read their own logs" ON aesthetic_logs;
CREATE POLICY "Users can read their own logs"
  ON aesthetic_logs FOR SELECT
  USING (auth.uid() = user_id);

-- 日志：用户可创建自己的日志
DROP POLICY IF EXISTS "Users can create their own logs" ON aesthetic_logs;
CREATE POLICY "Users can create their own logs"
  ON aesthetic_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 日志：用户可更新自己的日志
DROP POLICY IF EXISTS "Users can update their own logs" ON aesthetic_logs;
CREATE POLICY "Users can update their own logs"
  ON aesthetic_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 日志：用户可删除自己的日志
DROP POLICY IF EXISTS "Users can delete their own logs" ON aesthetic_logs;
CREATE POLICY "Users can delete their own logs"
  ON aesthetic_logs FOR DELETE
  USING (auth.uid() = user_id);

-- 资料：所有人可读
DROP POLICY IF EXISTS "Everyone can read profiles" ON profiles;
CREATE POLICY "Everyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- 资料：用户可编辑自己的资料
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- 完成提示
-- ========================================
SELECT '✅ Database schema created successfully!' AS message;
