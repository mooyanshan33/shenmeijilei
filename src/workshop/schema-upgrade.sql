-- ============================================================
-- 扩容版 Workshop 数据库表结构与 RLS 策略
-- ============================================================

-- ==========================================
-- 1. 用户资料与角色表 (Profiles)
-- ==========================================
CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. 升级版投稿表 (Posts) - 增加状态控制
-- ==========================================
CREATE TYPE post_status AS ENUM ('published', 'under_review', 'hidden');

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    content TEXT,
    tags TEXT[] DEFAULT '{}',
    status post_status DEFAULT 'published'::post_status NOT NULL, -- 新增状态
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 索引
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS posts_status_idx ON public.posts(status);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON public.posts USING GIN(tags);

-- ==========================================
-- 3. 评论表 (Comments)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 索引
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS comments_author_id_idx ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at ASC);

-- ==========================================
-- 4. 举报表 (Reports)
-- ==========================================
CREATE TYPE report_status AS ENUM ('pending', 'resolved', 'dismissed');

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,     -- 举报的帖子
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- 或者是举报的评论
    reason TEXT NOT NULL,
    status report_status DEFAULT 'pending'::report_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL) -- 至少关联一项
);

-- 索引
CREATE INDEX IF NOT EXISTS reports_post_id_idx ON public.reports(post_id);
CREATE INDEX IF NOT EXISTS reports_comment_id_idx ON public.reports(comment_id);
CREATE INDEX IF NOT EXISTS reports_reporter_id_idx ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports(status);

-- ==========================================
-- 5. 点赞表 (Likes) - 保持不变，但关联 profile
-- ==========================================
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes(user_id);

-- ==========================================
-- 6. Storage Bucket (如果不存在)
-- ==========================================
-- 在 Supabase Dashboard > Storage 中创建或使用以下 SQL:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--     'workshop_images',
--     'workshop_images',
--     true,
--     10485760, -- 10MB
--     ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
-- )
-- ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 7. RLS 策略
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- -------------------- Profiles RLS --------------------
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- -------------------- Posts RLS --------------------
-- 普通用户只能看 published 的帖子，admin 可以看所有
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (
    status = 'published' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update_own_or_admin" ON public.posts FOR UPDATE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_delete_own_or_admin" ON public.posts FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- -------------------- Comments RLS --------------------
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_delete_own_or_admin" ON public.comments FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- -------------------- Reports RLS --------------------
CREATE POLICY "reports_select_own_or_admin" ON public.reports FOR SELECT USING (
    auth.uid() = reporter_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "reports_insert_own" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_update_admin_only" ON public.reports FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- -------------------- Likes RLS --------------------
CREATE POLICY "likes_select_all" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- -------------------- Storage RLS --------------------
-- workshop_images 存储桶策略
-- CREATE POLICY "workshop_images_public_read" ON storage.objects
--     FOR SELECT USING (bucket_id = 'workshop_images');
--
-- CREATE POLICY "workshop_images_auth_upload" ON storage.objects
--     FOR INSERT WITH CHECK (
--         bucket_id = 'workshop_images' AND
--         auth.role() = 'authenticated'
--     );
--
-- CREATE POLICY "workshop_images_owner_delete" ON storage.objects
--     FOR DELETE USING (
--         bucket_id = 'workshop_images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );
