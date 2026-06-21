-- ============================================================
-- 创意工坊 (Workshop) 表结构与 RLS 策略
-- ============================================================

-- -------------------- 1. 创建 posts 表 --------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON public.posts USING GIN(tags);

-- -------------------- 2. 创建 likes 表 --------------------
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id) -- 防止重复点赞
);

-- 索引
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes(user_id);

-- -------------------- 3. RLS 策略 --------------------
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- posts 表策略
CREATE POLICY "posts_select_all" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "posts_insert_authenticated" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- likes 表策略
CREATE POLICY "likes_select_all" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "likes_insert_own" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete_own" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- -------------------- 4. Storage Bucket --------------------
-- 在 Supabase Dashboard > Storage 中创建或使用以下 SQL:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'workshop_images',
  'workshop_images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "workshop_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'workshop_images');

CREATE POLICY "workshop_images_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'workshop_images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "workshop_images_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'workshop_images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- -------------------- 5. 有用的 View（可选） --------------------
-- 创建一个 View 方便查询带点赞数的 posts 列表
CREATE OR REPLACE VIEW public.posts_with_likes AS
SELECT
  p.*,
  COUNT(l.id) AS likes_count,
  EXISTS(
    SELECT 1 FROM likes l
    WHERE l.post_id = p.id
    AND l.user_id = auth.uid()
  ) AS is_liked_by_me
FROM posts p
LEFT JOIN likes l ON l.post_id = p.id
GROUP BY p.id;

-- 授予权限
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT ON public.likes TO anon, authenticated;
GRANT INSERT, DELETE ON public.likes TO authenticated;
GRANT SELECT ON public.posts_with_likes TO anon, authenticated;
