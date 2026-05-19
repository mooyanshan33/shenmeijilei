# Supabase 配置指南

本文档提供审美积累项目 Supabase 后端服务的完整配置指南。

## 目录

- [1. 项目创建](#1-项目创建)
- [2. 环境变量配置](#2-环境变量配置)
- [3. 认证配置](#3-认证配置)
- [4. 数据库连接](#4-数据库连接)
- [5. Storage 配置](#5-storage-配置)
- [6. Edge Functions](#6-edge-functions)
- [7. 安全性检查清单](#7-安全性检查清单)

---

## 1. 项目创建

### 1.1 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目信息：
   - **Organization**: 选择组织或创建新组织
   - **Name**: `aesthetic-journal`
   - **Database Region**: 选择离用户最近的区域
   - **Pricing Plan**: 选择免费版或付费版
4. 点击 "Create new project"
5. 等待项目初始化完成（约2分钟）

### 1.2 获取项目凭证

项目创建完成后，在 **Settings > API** 中获取：

- `Project URL`: `https://xxxxx.supabase.co`
- `anon/public` key: 用于前端
- `service_role` key: **仅用于后端**，严禁暴露在前端

### 1.3 初始数据库设置

在 **SQL Editor** 中执行 `migrations.sql` 中的所有脚本：

1. 表结构定义
2. RLS 策略配置
3. Storage Bucket 配置
4. 索引优化
5. 种子数据
6. 触发器设置

---

## 2. 环境变量配置

### 2.1 创建环境变量文件

在项目根目录创建 `.env.local`：

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=development
```

### 2.2 多环境配置

建议创建以下环境文件：

| 文件 | 用途 | 注入方式 |
|------|------|----------|
| `.env.local` | 本地开发 | gitignore |
| `.env.staging` | 预发环境 | CI/CD |
| `.env.production` | 生产环境 | CI/CD |

### 2.3 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `VITE_SUPABASE_URL` | 是 | Supabase 项目地址 |
| `VITE_SUPABASE_ANON_KEY` | 是 | 匿名密钥（公开） |
| `VITE_APP_ENV` | 否 | 环境标识 |

### 2.4 部署平台配置

| 平台 | 配置方式 |
|------|----------|
| Vercel | Project Settings > Environment Variables |
| Netlify | Site Settings > Environment Variables |
| Cloudflare Pages | Settings > Environment Variables |

---

## 3. 认证配置

### 3.1 启用认证提供商

在 **Authentication > Providers** 中启用：

#### 邮箱/密码（默认启用）
```sql
-- 在 SQL Editor 中确认邮箱登录已启用
-- 默认已开启，无需额外配置
```

#### Google OAuth（可选）

1. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建 OAuth 2.0 客户端
2. 获取 `Client ID` 和 `Client Secret`
3. 在 Supabase **Authentication > Providers > Google** 中填入：
   - Client ID
   - Client Secret
4. 添加 Authorized Redirect URI：
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

#### Apple Sign In（可选）

1. 在 Apple Developer 创建 App ID 和 Services ID
2. 配置 Private Key
3. 在 Supabase **Authentication > Providers > Apple** 中配置

### 3.2 配置重定向 URL

在 **Authentication > URL Configuration** 中：

```
Site URL: http://localhost:5173
Redirect URLs:
  - http://localhost:5173
  - https://your-domain.com
```

### 3.3 邮件模板（可选）

在 **Authentication > Email Templates** 自定义：

- Confirmation emails
- Reset password emails
- Magic link emails

---

## 4. 数据库连接

### 4.1 连接方式

前端通过 `@supabase/supabase-js` 连接（已在项目中配置）：

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.2 直接连接（仅用于开发）

在 **SQL Editor** 或使用 psql：

```bash
# 获取连接信息
# Settings > Connection Pooling > Direct connection

PGPASSWORD=your-password psql \
  -h db.your-project-ref.supabase.co \
  -p 6543 \
  -U postgres \
  -d postgres
```

### 4.3 查看 API 文档

在 **API > Table Editor** 中选择表，可查看自动生成的 API 文档和示例代码。

---

## 5. Storage 配置

### 5.1 Bucket 列表

| Bucket ID | 用途 | 公开访问 |
|-----------|------|----------|
| `contribution-images` | 用户投稿图片 | 是 |
| `log-images` | 日志附图 | 是 |

### 5.2 上传路径规范

```
contribution-images/
  └── {user_id}/
      └── {timestamp}-{filename}

log-images/
  └── {user_id}/
      └── {timestamp}-{filename}
```

### 5.3 文件大小限制

建议配置：

- 最大文件大小：5MB
- 允许格式：JPEG, PNG, WebP, GIF

### 5.4 Storage 策略

在 `SUPABASE_SQL.md` 中已配置 RLS 策略：

- 公开读取
- 登录用户可上传
- 仅可删除自己上传的文件

---

## 6. Edge Functions

### 6.1 适用场景

- 敏感聚合逻辑
- 第三方 API 代理
- 复杂事务处理
- 内容审核

### 6.2 创建 Edge Function

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 初始化（如果需要）
supabase functions new content-audit
```

### 6.3 部署 Edge Function

```bash
# 部署
supabase functions deploy content-audit

# 本地测试
supabase functions serve content-audit
```

### 6.4 调用示例

```typescript
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase.functions.invoke('content-audit', {
  body: { text: '待审核内容' }
});
```

---

## 7. 安全性检查清单

### 7.1 认证安全

- [ ] 启用 MFA（可选）
- [ ] 配置强密码策略
- [ ] 设置会话超时
- [ ] 配置登录尝试限制

### 7.2 数据库安全

- [ ] 启用 RLS
- [ ] RLS 策略遵循最小权限原则
- [ ] 定期检查异常查询
- [ ] 启用慢查询日志

### 7.3 Storage 安全

- [ ] 公开 bucket 仅存储用户生成内容
- [ ] 上传时验证文件类型
- [ ] 设置文件大小限制
- [ ] 定期清理无用文件

### 7.4 API 安全

- [ ] 永远不要在前端使用 `service_role` key
- [ ] 敏感操作通过 Edge Functions
- [ ] 启用 API 速率限制
- [ ] 记录所有 API 请求

### 7.5 监控与告警

建议配置：

- 数据库异常查询告警
- API 错误率告警
- 存储使用量告警
- RLS 策略拒绝告警

---

## 附录 A：常见问题

### Q: 如何重置数据库？

```sql
-- 删除所有数据（保留表结构）
TRUNCATE TABLE aesthetic_types, profiles, contributions, aesthetic_logs, likes CASCADE;
```

### Q: 如何导出数据？

在 Dashboard > Table Editor 中选择表，点击 "Export to CSV"。

### Q: 如何回滚 RLS 更改？

```sql
-- 临时禁用 RLS（仅用于调试）
alter table public.contributions disable row level security;
```

### Q: 如何查看实时连接数？

在 Dashboard > Database > Connection Pooling 中查看。

---

## 附录 B：相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Discord 社区](https://discord.gg/supabase)
- [官方示例项目](https://github.com/supabase/supabase/tree/master/examples)
