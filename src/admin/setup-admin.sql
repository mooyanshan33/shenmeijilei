-- ============================================================
-- 设置管理员账号
-- ============================================================
-- 使用说明:
-- 1. 先在 Supabase Auth 中注册你的账号
-- 2. 然后在 SQL Editor 中执行这个脚本，替换 '你的邮箱@example.com' 为你注册的邮箱

-- 第一步: 查询你的用户 ID（可选）
-- SELECT id, email FROM auth.users WHERE email = '你的邮箱@example.com';

-- 第二步: 将你的账号升级为管理员
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = '你的邮箱@example.com'
);

-- 或者，如果你知道用户 ID，可以直接使用:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = '你的用户ID';

-- 验证是否成功
SELECT id, username, role, created_at
FROM public.profiles
WHERE role = 'admin';
