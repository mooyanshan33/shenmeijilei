# 审美积累 - Aesthetic Journal

一款专注于美学风格探索与审美积累的移动端应用，帮助用户发现、记录和分享美学感悟。

![审美积累](https://img.shields.io/badge/version-1.1.0-neon)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ecf8e)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

---

## 1. 项目简介

**审美积累 (Aesthetic Journal)** 是一款为设计从业者、艺术爱好者及追求生活美感的用户打造的移动端应用。通过系统化地梳理全球多元的美学流派，结合个人审美日志与社区分享功能，旨在帮助用户建立深厚且个性化的美学知识库。

### 1.1 核心价值

- **风格探索**：深度解析从「侘寂」到「赛博朋克」的多样化美学风格。
- **灵感记录**：随时捕捉瞬间的审美灵感，支持多媒体形式的日志沉淀。
- **社区共创**：在「创意工坊」中分享个人见解，与同好交流美学心得。
- **系统沉淀**：通过 Supabase 实时云端存储，确保美学积累永不丢失。

---

## 2. 功能模块构成

### 2.1 审美探索 (Explore)
作为应用的首页，提供沉浸式的风格发现体验。
- **瀑布流展示**：以艺术化的卡片形式展示各类美学风格。
- **深度详情**：包含风格起源、核心特征、代表艺术家及精选画廊。
- **智能搜索**：支持按名称、标签或中英文关键词检索。

### 2.2 创意工坊 (Workshop)
社区化的分享平台，促进美学灵感的流动。
- **动态流**：实时展示社区用户的投稿作品。
- **极简发布**：支持图片上传、心得描述及美学标签关联。
- **点赞互动**：支持双击或点击图标进行点赞，数据实时同步。

### 2.3 美学日志 (Journal)
私密且纯净的个人审美记录空间。
- **时间轴管理**：按日期有序组织个人日志。
- **灵活编辑**：支持创建、修改和删除日志，适配多种记录需求。
- **多维度检索**：通过标签分类快速回顾历史感悟。

### 2.4 个人中心 (Profile)
用户账户及个性化偏好管理。
- **数据仪表盘**：直观展示日志数、投稿数及收藏数。
- **主题管理**：支持一键切换亮色/暗色模式，适配不同审美情境。
- **账户系统**：集成 Supabase Auth，支持安全的登录与退出。

---

## 3. 技术路线

### 3.1 前端架构
- **核心框架**：[React 19](https://react.dev/) - 利用最新的 Concurrent Rendering 特性。
- **构建工具**：[Vite 7](https://vitejs.dev/) - 极致的开发与构建速度。
- **类型安全**：[TypeScript 5](https://www.typescriptlang.org/) - 全链路类型约束，降低维护成本。
- **样式方案**：[Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) - 原子化 CSS 与无障碍组件的完美结合。

### 3.2 后端服务 (Supabase)
项目采用 **Serverless** 架构，后端能力完全由 [Supabase](https://supabase.com/) 提供：
- **Database (PostgreSQL)**：存储用户信息、审美类型、投稿、日志及点赞关系。
- **Authentication**：提供安全可靠的邮箱/密码及第三方登录服务。
- **Storage**：存储用户上传的灵感图片与日志素材。
- **RLS (Row Level Security)**：基于行级安全策略，确保用户数据的私密性与安全性。

### 3.3 目录结构
```text
src/
├── components/ui/      # Shadcn 基础 UI 组件库
├── sections/           # 业务逻辑页面 (Explore, Logs, Profile, etc.)
├── supabase/           # Supabase 核心集成层
│   ├── client.ts       # Supabase 客户端配置
│   ├── error.ts        # 统一错误处理
│   └── services/       # 业务数据服务层
├── lib/                # 基础工具库 (Utils)
├── hooks/              # 自定义状态逻辑 (Theme, Mobile detection)
├── types/              # 全局 TypeScript 类型定义
└── data/               # 静态数据与 Mock 配置
supabase/               # 后端配置与脚本 (Root)
├── migrations.sql      # 数据库初始化脚本
└── SETUP.md            # Supabase 环境搭建指南
```

---

## 4. UI 风格

应用采用 **简约低饱和** 风格，整体更克制、清爽，强调内容层级与阅读体验：

- **配色方案**：
  - **Dark Mode**：深灰色背景 (`#111827`) 搭配浅灰色 (`#d1d5db`) 点缀，保持克制与清晰层次。
  - **Light Mode**：纯净白背景搭配柔和灰色调，强调内容的阅读体验。
- **交互细节**：
  - **移动端优先**：针对移动端手势优化的滑动与点击体验。
  - **微动效**：卡片渐入、点赞反馈及页面切换的平滑过渡。
  - **容器化呈现**：在 PC 端以精致的手机边框形式展现，增强沉浸感。

---

## 5. 快速开始

### 5.1 环境准备
复制 `.env.example` 为 `.env.local` 并填入你的 Supabase 配置：
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 5.2 安装运行
```bash
npm install
npm run dev
```

### 5.3 数据库初始化
请参考 [migrations.sql](file:///e:/work/code/Zzz/yy/supabase/migrations.sql) 中的脚本在 Supabase SQL Editor 中执行，以完成表结构与 RLS 策略的配置。

---

## 6. 开源协议
MIT License
