-- ==========================================
-- 清理现有审美相关表（谨慎使用）
-- ==========================================
-- 警告：这会删除所有现有数据！
-- 如果你有重要数据，请先备份！

-- 按依赖关系倒序删除
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.contribution_comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.aesthetic_logs CASCADE;
DROP TABLE IF EXISTS public.contributions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.aesthetic_types CASCADE;
DROP TABLE IF EXISTS public.aesthetic_subcategories CASCADE;
DROP TABLE IF EXISTS public.aesthetic_categories CASCADE;

-- 删除类型（如果存在）
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS post_status CASCADE;
DROP TYPE IF EXISTS report_status CASCADE;

-- 删除触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 完成！现在可以运行 complete-schema.sql
