# Supabase 数据管理后台

完整的审美积累应用数据管理系统，包含数据库结构、数据导入和后台管理界面。

## 📁 文件结构

```
├── supabase/
│   ├── complete-schema.sql        # 完整数据库表结构
│   ├── seed-categories.sql        # 分类数据种子
│   └── import-data.js             # Node.js 数据导入脚本
├── src/
│   ├── admin/                     # 管理后台组件
│   └── components/
│       └── admin/                 # 数据管理组件
│           ├── DataAdminPanel.tsx  # 数据管理主面板
│           ├── AdminAesthetics.tsx  # 美学数据管理
│           ├── AdminCategories.tsx # 分类管理
│           └── AestheticEditor.tsx # 美学编辑器
```

## 🚀 快速开始

### 1. 设置数据库

在 Supabase SQL Editor 中按顺序执行：

```sql
-- 第一步：创建完整表结构
supabase/complete-schema.sql

-- 第二步：插入分类数据
supabase/seed-categories.sql
```

### 2. 设置管理员账户

1. 在你的应用中注册一个账户
2. 在 Supabase SQL Editor 中执行：

```sql
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'your-email@example.com'
);
```

### 3. 使用后台管理界面

在你的应用中，创建一个路由指向 `DataAdminPanel` 组件，或者直接在浏览器中打开该页面。

## 📊 数据库表说明

### 核心表

| 表名 | 说明 |
|------|------|
| `aesthetic_categories` | 美学分类 |
| `aesthetic_subcategories` | 美学子分类 |
| `aesthetic_types` | 美学类型（核心数据表） |
| `profiles` | 用户资料 |
| `contributions` | 用户投稿 |
| `aesthetic_logs` | 美学日志 |
| `likes` | 点赞记录 |
| `contribution_comments` | 评论 |
| `user_favorites` | 用户收藏 |
| `reports` | 举报记录 |

## 🛠️ 使用 Node.js 导入数据（高级）

### 准备工作

1. 创建 `.env` 文件：

```env
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. 在 `import-data.js` 中导入你的美学数据文件，然后调用 `importAesthetics()` 函数。

3. 运行导入脚本：

```bash
npm install @supabase/supabase-js dotenv
node supabase/import-data.js
```

## 🎨 管理功能

### 数据管理面板 (`DataAdminPanel`)

集成所有管理功能的主面板，包含：

1. **美学数据管理**
   - 查看所有美学类型
   - 添加、编辑、删除美学
   - 启用/禁用美学
   - 搜索和筛选

2. **分类管理**
   - 管理分类和子分类
   - 创建、编辑、删除分类

3. **用户管理**
   - 查看用户列表
   - 提升/降级管理员权限

4. **投稿管理**
   - 查看所有用户投稿
   - 隐藏/删除违规内容

5. **评论管理**
   - 查看所有评论
   - 删除不当评论

## 🔐 权限说明

| 角色 | 权限 |
|------|------|
| 普通用户 | 只能查看和操作自己的数据 |
| 管理员 | 可以查看和操作所有数据 |

## 📝 示例：在应用中集成管理后台

在你的路由中添加：

```tsx
import { DataAdminPanel } from '@/components/admin';
import { AuthProvider } from '@/workshop/useAuth';

function AdminPage() {
  return (
    <AuthProvider>
      <DataAdminPanel />
    </AuthProvider>
  );
}
```

然后，在用户个人资料页面中，为管理员添加一个"数据管理"入口。

## 🎯 下一步

1. 执行数据库脚本
2. 设置管理员账户
3. 在后台添加你的美学数据
4. 开始使用！
