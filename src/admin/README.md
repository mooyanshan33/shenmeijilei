# 管理后台使用说明

## 功能列表

1. **帖子管理** - 查看、隐藏、删除用户发布的帖子
2. **评论管理** - 查看、删除用户评论
3. **举报管理** - 处理用户举报内容
4. **用户管理** - 查看用户列表、设置管理员权限

## 设置步骤

### 1. 执行数据库脚本

在 Supabase SQL Editor 中按顺序执行以下脚本：

```bash
# 先执行完整的数据库表结构
src/workshop/schema-final.sql

# 然后设置你的管理员账号（先修改里面的邮箱）
src/admin/setup-admin.sql
```

### 2. 注册管理员账号

1. 在应用中先注册一个账号（用你在 `setup-admin.sql` 中设置的邮箱）
2. 然后执行 `setup-admin.sql` 脚本把这个账号升级为管理员

### 3. 访问管理后台

你有两种方式访问管理后台：

#### 方式一：直接在新页面打开（推荐用于测试）

创建一个新的 React 页面，内容如下：

```tsx
import { AdminPage } from '@/sections/AdminPage';

function AdminRoute() {
  return <AdminPage />;
}
```

#### 方式二：在现有应用中添加入口

修改 `src/sections/ProfilePage.tsx`，在菜单中添加管理后台入口：

在 `menuItems` 数组中添加：

```tsx
{
  id: 'admin',
  icon: 'shield_person',
  label: '管理后台',
  action: () => {
    // 这里跳转到管理后台
    window.open('/admin', '_blank');
  },
  hidden: !isLoggedIn, // 或者用 isAdmin 权限检查
},
```

### 4. 完整集成（可选）

如果你想要完整的集成，可以：

1. 在 `App.tsx` 中添加路由逻辑
2. 使用 `AuthProvider` 包装整个应用
3. 根据用户角色显示/隐藏管理功能

## 快速开始（测试用）

为了快速测试，你可以：

1. 直接在浏览器中访问 `http://localhost:5173`
2. 在开发者控制台中运行：

```javascript
// 临时创建一个管理员入口
localStorage.setItem('is_admin', 'true');
```

或者直接创建一个简单的测试页面来预览管理后台 UI。

## 权限说明

- **普通用户 (user)** - 只能看到自己的内容
- **管理员 (admin)** - 可以看到所有内容、编辑帖子状态、管理用户

## 文件结构

```
src/
├── admin/
│   ├── AdminPanel.tsx          # 管理后台主界面
│   ├── AdminPosts.tsx          # 帖子管理
│   ├── AdminComments.tsx       # 评论管理
│   ├── AdminReports.tsx        # 举报管理
│   ├── AdminUsers.tsx          # 用户管理
│   ├── setup-admin.sql         # 设置管理员脚本
│   └── index.ts                # 导出文件
├── workshop/
│   ├── useAuth.ts              # 认证 Hook（包含 isAdmin 检查）
│   └── schema-final.sql        # 完整数据库结构
└── sections/
    └── AdminPage.tsx           # 管理后台页面（用于路由）
```

## 注意事项

1. 管理后台使用了 `sonner` Toast 组件，请确保项目中已安装
2. 需要确保你的 Supabase 表结构正确（使用 `schema-final.sql`）
3. 管理员权限是通过 `profiles` 表的 `role` 字段控制的
