-- Supabase 数据库初始化脚本
-- 本文件包含项目所需的完整数据库结构、RLS 策略、索引、种子数据及触发器。
-- 请在 Supabase SQL Editor 中直接运行此脚本。

-- ==========================================
-- 1. 表结构定义
-- ==========================================

-- 1.1 审美类型表 (aesthetic_types)
create table if not exists public.aesthetic_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text not null,
  origin text not null,
  era text not null,
  description text not null,
  cover_image text not null,
  gallery text[] not null default '{}',
  features text[] not null default '{}',
  related_artists text[] not null default '{}',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 1.2 用户资料表 (profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '新用户',
  avatar text,
  bio text,
  log_count integer not null default 0,
  contribution_count integer not null default 0,
  favorite_count integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 1.3 用户投稿表 (contributions)
create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  user_avatar text,
  image_url text not null,
  caption text not null,
  tags text[] not null default '{}',
  likes integer not null default 0,
  comments integer not null default 0,
  created_at timestamptz not null default now()
);

-- 1.4 美学日志表 (aesthetic_logs)
create table if not exists public.aesthetic_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  content text not null,
  image_url text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 1.5 点赞记录表 (likes)
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contribution_id uuid not null references public.contributions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, contribution_id)
);

-- 1.6 投稿评论表 (contribution_comments)
create table if not exists public.contribution_comments (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.contributions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  user_avatar text,
  content text not null,
  created_at timestamptz not null default now()
);

-- ==========================================
-- 2. RLS 策略配置
-- ==========================================

-- 2.1 启用 RLS
alter table public.profiles enable row level security;
alter table public.contributions enable row level security;
alter table public.aesthetic_logs enable row level security;
alter table public.likes enable row level security;
alter table public.contribution_comments enable row level security;

-- 2.2 profiles 表策略
-- 公开读取所有用户资料
create policy "profiles_select_all"
on public.profiles for select
to authenticated
using (true);

-- 仅可更新自己的资料
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 创建资料时自动关联当前用户
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

-- 2.3 contributions 表策略
-- 所有登录用户可读取投稿
create policy "contributions_select_all"
on public.contributions for select
to authenticated
using (true);

-- 仅可创建自己的投稿
create policy "contributions_insert_own"
on public.contributions for insert
to authenticated
with check (auth.uid() = user_id);

-- 仅可更新自己的投稿
create policy "contributions_update_own"
on public.contributions for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 仅可删除自己的投稿
create policy "contributions_delete_own"
on public.contributions for delete
to authenticated
using (auth.uid() = user_id);

-- 2.4 aesthetic_logs 表策略
-- 仅可读取自己的日志
create policy "logs_select_own"
on public.aesthetic_logs for select
to authenticated
using (auth.uid() = user_id);

-- 仅可创建自己的日志
create policy "logs_insert_own"
on public.aesthetic_logs for insert
to authenticated
with check (auth.uid() = user_id);

-- 仅可更新自己的日志
create policy "logs_update_own"
on public.aesthetic_logs for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 仅可删除自己的日志
create policy "logs_delete_own"
on public.aesthetic_logs for delete
to authenticated
using (auth.uid() = user_id);

-- 2.5 likes 表策略
-- 所有登录用户可读取点赞记录
create policy "likes_select_all"
on public.likes for select
to authenticated
using (true);

-- 仅可创建自己的点赞
create policy "likes_insert_own"
on public.likes for insert
to authenticated
with check (auth.uid() = user_id);

-- 仅可删除自己的点赞
create policy "likes_delete_own"
on public.likes for delete
to authenticated
using (auth.uid() = user_id);

-- 2.6 contribution_comments 表策略
create policy "contribution_comments_select_all"
on public.contribution_comments for select
to authenticated
using (true);

create policy "contribution_comments_insert_own"
on public.contribution_comments for insert
to authenticated
with check (auth.uid() = user_id);

create policy "contribution_comments_delete_own"
on public.contribution_comments for delete
to authenticated
using (auth.uid() = user_id);

-- ==========================================
-- 3. Storage Bucket 配置
-- ==========================================

-- 3.1 创建投稿图片 Bucket
insert into storage.buckets (id, name, public)
values ('contribution-images', 'contribution-images', true)
on conflict (id) do nothing;

-- 3.2 创建日志图片 Bucket
insert into storage.buckets (id, name, public)
values ('log-images', 'log-images', true)
on conflict (id) do nothing;

-- 3.3 创建头像 Bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3.3 Storage RLS 策略
-- 允许读取公开图片
create policy "public_image_access"
on storage.objects for select
to authenticated
using (bucket_id in ('contribution-images', 'log-images', 'avatars'));

-- 允许上传图片
create policy "authenticated_upload"
on storage.objects for insert
to authenticated
with check (bucket_id in ('contribution-images', 'log-images', 'avatars'));

-- 允许删除自己的图片
create policy "authenticated_delete"
on storage.objects for delete
to authenticated
using (auth.uid()::text = (storage.foldername(name))[1]);

-- ==========================================
-- 4. 索引优化
-- ==========================================

-- 4.1 contributions 表索引
create index if not exists idx_contributions_user_created
on public.contributions(user_id, created_at desc);

create index if not exists idx_contributions_created
on public.contributions(created_at desc);

-- 4.2 aesthetic_logs 表索引
create index if not exists idx_logs_user_date
on public.aesthetic_logs(user_id, date desc);

create index if not exists idx_logs_created
on public.aesthetic_logs(created_at desc);

-- 4.3 likes 表索引
create index if not exists idx_likes_contribution
on public.likes(contribution_id);

create index if not exists idx_likes_user
on public.likes(user_id, contribution_id);

create index if not exists idx_contribution_comments_contribution_created
on public.contribution_comments(contribution_id, created_at asc);

create index if not exists idx_contribution_comments_user
on public.contribution_comments(user_id, contribution_id);

-- ==========================================
-- 5. 种子数据
-- ==========================================

-- 5.1 审美类型种子数据
insert into public.aesthetic_types (
  name, name_en, origin, era, description, cover_image,
  gallery, features, related_artists, tags
) values
(
  '侘寂',
  'Wabi-Sabi',
  '日本',
  '15世纪至今',
  '侘寂是日本传统美学中最具代表性的概念之一，强调在不完美中寻找美，接受生命的无常和缺陷。它欣赏朴素、谦逊、不对称、粗糙或不规则的美，认为真正的美存在于朴素和谦逊之中。',
  '/aesthetic-wabi-sabi.jpg',
  ARRAY['/aesthetic-wabi-sabi.jpg'],
  ARRAY['接受不完美与无常', '欣赏自然老化过程', '简约而朴素的设计', '不对称的构图', '天然材料的使用'],
  ARRAY['千利休', '柳宗悦'],
  ARRAY['日本美学', '禅意', '极简']
),
(
  '极简主义',
  'Minimalism',
  '西方',
  '1960年代至今',
  '极简主义是一种将设计元素简化到最基本形式的艺术风格。它强调"少即是多"，通过去除多余的装饰，让观者专注于作品的本质和核心内容。极简主义追求纯粹、简洁和秩序。',
  '/aesthetic-minimalism.jpg',
  ARRAY['/aesthetic-minimalism.jpg'],
  ARRAY['简洁的几何形状', '大量留白空间', '有限的色彩 palette', '功能性优先', '去除多余装饰'],
  ARRAY['Donald Judd', 'Dan Flavin'],
  ARRAY['西方美学', '现代艺术', '设计']
),
(
  '赛博朋克',
  'Cyberpunk',
  '科幻文学',
  '1980年代至今',
  '赛博朋克是一种融合高科技与低端生活的科幻美学风格。它以霓虹灯光、雨夜城市、人工智能和虚拟现实为视觉特征，探讨科技发展对社会和人性的影响。视觉风格通常充满未来感和颓废感。',
  '/aesthetic-cyberpunk.jpg',
  ARRAY['/aesthetic-cyberpunk.jpg'],
  ARRAY['霓虹灯光与暗色调对比', '高科技与废墟并存', '雨夜城市景观', '人机融合元素', '反乌托邦氛围'],
  ARRAY['Syd Mead', 'Simon Stålenhag'],
  ARRAY['科幻美学', '未来主义', '科技']
),
(
  '新中式',
  'Neo-Chinese',
  '中国',
  '21世纪',
  '新中式是将传统中式元素与现代设计理念相结合的美学风格。它保留了中国传统文化的精髓，如山水意境、对称布局、木质结构，同时融入现代简约的设计语言，创造出既有东方韵味又符合现代审美的空间。',
  '/aesthetic-neo-chinese.jpg',
  ARRAY['/aesthetic-neo-chinese.jpg'],
  ARRAY['传统与现代的融合', '中式元素的现代化演绎', '自然材质的运用', '意境营造', '对称与平衡'],
  ARRAY['贝聿铭', '马岩松'],
  ARRAY['东方美学', '中国传统', '现代设计']
),
(
  '波普艺术',
  'Pop Art',
  '英国/美国',
  '1950-1970年代',
  '波普艺术是一种源于大众文化的艺术运动，它将广告、漫画和日常物品等流行文化元素融入艺术创作。波普艺术以鲜艳的色彩、大胆的图形和重复的元素为特征，挑战传统艺术的精英主义。',
  '/aesthetic-pop-art.jpg',
  ARRAY['/aesthetic-pop-art.jpg'],
  ARRAY['鲜艳的原色运用', '大众文化图像', '重复与复制', '漫画风格元素', '商业艺术手法'],
  ARRAY['Andy Warhol', 'Roy Lichtenstein'],
  ARRAY['现代艺术', '大众文化', '美国美学']
),
(
  '装饰艺术',
  'Art Deco',
  '法国',
  '1920-1940年代',
  '装饰艺术是一种充满魅力和奢华感的设计风格，以其几何形状、对称图案和豪华材质著称。它代表了现代性与传统的结合，在20世纪初的建筑、家具和时尚领域产生了深远影响。',
  '/aesthetic-art-deco.jpg',
  ARRAY['/aesthetic-art-deco.jpg'],
  ARRAY['几何图案与对称', '金色与黑色的搭配', '太阳放射状图案', '奢华材质的使用', '流线型设计'],
  ARRAY['Erté', 'Tamara de Lempicka'],
  ARRAY['西方美学', '古典复兴', '奢华']
);

-- ==========================================
-- 6. 触发器设置
-- ==========================================

-- 6.1 自动创建用户资料
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', '新用户'),
    coalesce(
      new.raw_user_meta_data->>'avatar',
      (array[
        '/avatars/defaults/avatar-01.jpg',
        '/avatars/defaults/avatar-02.png',
        '/avatars/defaults/avatar-03.jpg',
        '/avatars/defaults/avatar-04.png',
        '/avatars/defaults/avatar-05.png',
        '/avatars/defaults/avatar-06.png',
        '/avatars/defaults/avatar-07.png',
        '/avatars/defaults/avatar-08.jpg'
      ])[floor(random() * 8 + 1)]
    )
  );
  return new;
end;
$$ language plpgsql security definer;

update public.profiles
set avatar = (array[
  '/avatars/defaults/avatar-01.jpg',
  '/avatars/defaults/avatar-02.png',
  '/avatars/defaults/avatar-03.jpg',
  '/avatars/defaults/avatar-04.png',
  '/avatars/defaults/avatar-05.png',
  '/avatars/defaults/avatar-06.png',
  '/avatars/defaults/avatar-07.png',
  '/avatars/defaults/avatar-08.jpg'
])[floor(random() * 8 + 1)]
where avatar is null or btrim(avatar) = '';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6.2 自动更新统计计数 (日志)
create or replace function public.update_log_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.profiles set log_count = log_count + 1 where id = new.user_id;
  elsif TG_OP = 'DELETE' then
    update public.profiles set log_count = log_count - 1 where id = old.user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_aesthetic_log_change on public.aesthetic_logs;
create trigger on_aesthetic_log_change
  after insert or delete on public.aesthetic_logs
  for each row execute procedure public.update_log_count();

-- 6.3 自动更新统计计数 (投稿)
create or replace function public.update_contribution_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.profiles set contribution_count = contribution_count + 1 where id = new.user_id;
  elsif TG_OP = 'DELETE' then
    update public.profiles set contribution_count = contribution_count - 1 where id = old.user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_contribution_change on public.contributions;
create trigger on_contribution_change
  after insert or delete on public.contributions
  for each row execute procedure public.update_contribution_count();

-- 6.4 自动更新统计计数 (投稿点赞)
create or replace function public.update_contribution_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.contributions
      set likes = greatest(likes + 1, 0)
      where id = new.contribution_id;
  elsif TG_OP = 'DELETE' then
    update public.contributions
      set likes = greatest(likes - 1, 0)
      where id = old.contribution_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_like_change on public.likes;
create trigger on_like_change
  after insert or delete on public.likes
  for each row execute procedure public.update_contribution_likes_count();

-- 6.5 自动更新统计计数 (投稿评论)
create or replace function public.update_contribution_comments_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.contributions
      set comments = greatest(comments + 1, 0)
      where id = new.contribution_id;
  elsif TG_OP = 'DELETE' then
    update public.contributions
      set comments = greatest(comments - 1, 0)
      where id = old.contribution_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_contribution_comment_change on public.contribution_comments;
create trigger on_contribution_comment_change
  after insert or delete on public.contribution_comments
  for each row execute procedure public.update_contribution_comments_count();
