# 数据库设置分步指南

## ❌ 问题原因

你看到的错误是因为数据库中已经存在的表（`aesthetic_categories`）的 `id` 字段是 `bigint` 类型，而新脚本试图使用 `text` 类型。

## ✅ 解决方案

### 方法一：完全重置（推荐，最干净）

在 Supabase SQL Editor 中**按顺序执行**以下脚本：

#### 第一步：清理现有表
```sql
-- 执行：supabase/cleanup-tables.sql
-- 这会删除所有现有的审美相关表，请先确保备份重要数据！
```

#### 第二步：创建新表结构
```sql
-- 执行：supabase/complete-schema.sql
-- 创建完整的新表结构
```

#### 第三步：插入分类数据
```sql
-- 执行：supabase/seed-categories.sql
-- 插入分类和子分类数据
```

---

### 方法二：只更新表结构（保持数据，高级）

如果你想保留现有数据，你需要手动修改现有表的结构。但这可能比较复杂，建议使用方法一。

---

## 📝 完整执行步骤

### 1️⃣ 备份现有数据（如果需要）
在执行删除操作前，先导出你的现有数据：
- 在 Supabase Dashboard → Table Editor 中查看现有表
- 如果需要，使用 Export 功能导出数据

### 2️⃣ 执行清理脚本
在 Supabase SQL Editor 中打开 `supabase/cleanup-tables.sql` 并执行

### 3️⃣ 执行完整表结构
执行 `supabase/complete-schema.sql`

### 4️⃣ 执行分类种子数据
执行 `supabase/seed-categories.sql`

### 5️⃣ 验证
在 Supabase Table Editor 中确认以下表已创建：
- `aesthetic_categories`
- `aesthetic_subcategories`
- `aesthetic_types`
- `profiles`
- 等等...

---

## 🔧 如果还是有问题

### 检查表是否真的被删除了
```sql
-- 查看现有表
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'aesthetic%' OR tablename LIKE 'contribution%' OR tablename LIKE 'profiles';
```

### 如果还有残留，手动删除
```sql
-- 逐个删除
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
```

---

## ✨ 设置管理员账户

数据库重置后，先在应用中注册一个账户，然后执行：

```sql
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'your-email@example.com'
);
```

---

## 📚 相关文件

| 文件 | 用途 |
|------|------|
| `cleanup-tables.sql` | 清理现有表 |
| `complete-schema.sql` | 创建新表结构 |
| `seed-categories.sql` | 插入分类数据 |
| `import-data.js` | 导入美学数据（Node.js） |
