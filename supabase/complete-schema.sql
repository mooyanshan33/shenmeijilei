-- ==========================================
-- 完整的审美收集应用数据库结构
-- ==========================================

-- ==========================================
-- 1. 审美分类表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.aesthetic_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 2. 审美子分类表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.aesthetic_subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES aesthetic_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 3. 审美类型表（完整结构）
-- ==========================================
CREATE TABLE IF NOT EXISTS public.aesthetic_types (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES aesthetic_categories(id) ON DELETE SET NULL,
  subcategory_id TEXT REFERENCES aesthetic_subcategories(id) ON DELETE SET NULL,
  name_cn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  gallery_images TEXT[] NOT NULL DEFAULT '{}',
  summary TEXT NOT NULL,
  origin TEXT,
  history TEXT,
  key_features TEXT[] NOT NULL DEFAULT '{}',
  color_palette JSONB NOT NULL DEFAULT '[]',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  representative_artists JSONB NOT NULL DEFAULT '[]',
  representative_works JSONB NOT NULL DEFAULT '[]',
  related_aesthetics TEXT[] NOT NULL DEFAULT '{}',
  timeline JSONB NOT NULL DEFAULT '[]',
  popularity_score INTEGER NOT NULL DEFAULT 0,
  community_posts_count INTEGER NOT NULL DEFAULT 0,
  mood_tags TEXT[] NOT NULL DEFAULT '{}',
  era TEXT,
  region TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. 用户资料表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  log_count INTEGER NOT NULL DEFAULT 0,
  contribution_count INTEGER NOT NULL DEFAULT 0,
  favorite_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 5. 用户投稿表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  aesthetic_id TEXT,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 6. 美学日志表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.aesthetic_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 7. 点赞表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, contribution_id)
);

-- ==========================================
-- 8. 评论表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contribution_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 9. 用户收藏表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aesthetic_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, aesthetic_id)
);

-- ==========================================
-- 10. 举报表
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES contribution_comments(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (contribution_id IS NOT NULL OR comment_id IS NOT NULL)
);

-- ==========================================
-- 索引
-- ==========================================
CREATE INDEX IF NOT EXISTS aesthetic_types_category_idx ON aesthetic_types(category_id);
CREATE INDEX IF NOT EXISTS aesthetic_types_subcategory_idx ON aesthetic_types(subcategory_id);
CREATE INDEX IF NOT EXISTS contributions_user_idx ON contributions(user_id);
CREATE INDEX IF NOT EXISTS contributions_aesthetic_idx ON contributions(aesthetic_id);
CREATE INDEX IF NOT EXISTS aesthetic_logs_user_idx ON aesthetic_logs(user_id);
CREATE INDEX IF NOT EXISTS likes_contribution_idx ON likes(contribution_id);
CREATE INDEX IF NOT EXISTS comments_contribution_idx ON contribution_comments(contribution_id);
CREATE INDEX IF NOT EXISTS favorites_user_idx ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status);

-- ==========================================
-- RLS 策略
-- ==========================================
ALTER TABLE public.aesthetic_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aesthetic_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aesthetic_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aesthetic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 美学数据 - 所有人可读取
CREATE POLICY "aesthetics_select_all" ON public.aesthetic_categories
  FOR SELECT USING (true);
CREATE POLICY "aesthetics_select_all" ON public.aesthetic_subcategories
  FOR SELECT USING (true);
CREATE POLICY "aesthetics_select_all" ON public.aesthetic_types
  FOR SELECT USING (true);

-- 用户资料
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 投稿
CREATE POLICY "contributions_select_all" ON public.contributions
  FOR SELECT USING (true);
CREATE POLICY "contributions_insert_own" ON public.contributions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contributions_update_own" ON public.contributions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contributions_delete_own" ON public.contributions
  FOR DELETE USING (auth.uid() = user_id);

-- 美学日志
CREATE POLICY "logs_select_own" ON public.aesthetic_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "logs_insert_own" ON public.aesthetic_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "logs_update_own" ON public.aesthetic_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "logs_delete_own" ON public.aesthetic_logs
  FOR DELETE USING (auth.uid() = user_id);

-- 点赞
CREATE POLICY "likes_select_all" ON public.likes
  FOR SELECT USING (true);
CREATE POLICY "likes_insert_own" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- 评论
CREATE POLICY "comments_select_all" ON public.contribution_comments
  FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.contribution_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON public.contribution_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 收藏
CREATE POLICY "favorites_select_own" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 举报
CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ==========================================
-- 自动更新资料触发器
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.email, 'user_' || substring(new.id::text from 1 for 8)),
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 权限授予
-- ==========================================
GRANT SELECT ON public.aesthetic_categories TO anon, authenticated;
GRANT SELECT ON public.aesthetic_subcategories TO anon, authenticated;
GRANT SELECT ON public.aesthetic_types TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contributions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aesthetic_logs TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.likes TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.contribution_comments TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_favorites TO authenticated;
GRANT SELECT, INSERT ON public.reports TO authenticated;
