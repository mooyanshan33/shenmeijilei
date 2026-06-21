# Supabase 数据库设置指南

## 问题诊断

如果你看到 **"column 'post_id' does not exist"** 错误，说明你的 Supabase 中已经存在旧的表结构，而旧表的字段不匹配。

---

## 解决方法（按顺序执行）

### 方法一：完全重置（推荐，干净简单）

**警告：这会删除所有 Workshop 相关数据！如有重要数据请先备份！**

在 Supabase SQL Editor 中执行以下代码：

```sql
-- 第一步：删除所有相关表
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS post_status CASCADE;
DROP TYPE IF EXISTS report_status CASCADE;
```

然后在同一个 SQL Editor 窗口中，**完整复制并执行** `schema-final.sql` 中的所有代码。

---

### 方法二：分步执行（更安全）

在 Supabase SQL Editor 中，打开 `schema-final.sql`，**逐段**执行：

1. 先执行第二步（创建类型）
2. 再执行第三步（创建表）
3. 依此类推...

---

## 如果仍然出错

### 检查现有表

在 Supabase SQL Editor 中运行此查询查看现有表：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 检查表结构

查看 `posts` 表是否真的有 `author_id` 等字段：

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' AND table_schema = 'public'
ORDER BY ordinal_position;
```

---

## 创建测试数据（可选）

成功执行后，你可以添加一些测试数据：

```sql
-- 注意：执行前请先确保你已经在 Supabase Auth 中注册了至少一个用户！

-- 1. 首先查询你的用户 ID
-- SELECT id FROM auth.users LIMIT 1;

-- 2. 用你的用户 ID 替换下面的 'YOUR_USER_ID' 来测试

-- INSERT INTO public.posts (author_id, image_url, content, tags, status)
-- VALUES (
--   'YOUR_USER_ID',
--   'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
--   '这是一张很有美感的照片！',
--   ARRAY['极简', '设计'],
--   'published'
-- );
```
