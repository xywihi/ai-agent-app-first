ai-agent-app-first

Next.js + React 19 + Supabase + Vercel AI SDK 项目：技术笔记平台 + UI 作品集管理 + AI Agent 全栈应用

✨ 项目简介

本项目是一套个人全栈作品平台，集成三大核心模块：

1.  技术笔记管理：Markdown 文档笔记系统，支持两级分类目录、锚点导航、代码块高亮、自定义容器渲染，记录前端开发学习笔记；
2. UI 作品集管理：作品集素材管理模块，可上传、分类、预览 UI 设计作品，用于个人作品展示；
3. AI Agent 对话：基于 Vercel AI SDK 构建 AI Agent，支持流式对话、工具调用，可实现业务场景智能交互（示例：财务审批流程）。

数据全部存储在 Supabase（PostgreSQL），UI 基于 shadcn/ui + Tailwind CSS 开发，采用 Next.js App Router 架构，搭配 TanStack Query 做服务端状态管理，TypeScript 全类型约束。

📦 技术栈

类别 技术
Web 框架 Next.js(App Router) + React 19
样式 Tailwind CSS + shadcn/ui
数据请求 TanStack Query(React Query)
类型&表单校验 Zod
数据库 Supabase（PostgreSQL）
Markdown 渲染 react-markdown + remark-gfm + rehype-slug + remark-directive
AI 能力 Vercel AI SDK
图标 Lucide React

📁 项目功能

📝 技术笔记模块

1.  两级分类树侧边导航（一级分类 + 二级子分类）；
2. Markdown 渲染，支持标题锚点跳转、自动生成目录、自定义容器  :::  语法；
3.  新建笔记弹窗，Zod 表单校验；
4.  笔记浏览统计：记录浏览次数、访问用户 ID；
5. URL SearchParams 驱动路由，选中状态联动。

🎨 UI 作品集管理模块

1.  作品集素材分类管理，支持多维度归类设计作品；
2.  作品图片/素材上传存储（Supabase Storage）；
3.  作品预览页面，支持查看作品详情；
4.  作品集条目增删改查，和笔记分类系统共用一套分类逻辑；
5.  作品详情页，支持添加描述、标签、技术栈说明。

🤖 AI Agent 对话模块

1.  流式输出对话，对接前端 useChat；
2.  支持工具调用，内置财务审批场景 Demo；
3.  两套实现方案：Vercel Workflow 持久休眠版本 / ToolLoopAgent 单次请求版本；
4.  独立 API 路由处理 AI 请求。

🗄️ Supabase 数据库设计

- categories ：两级分类自关联表（parent_id 父子层级），同时服务笔记、作品集两套业务
- notes ：笔记主表，关联分类 ID，存储 markdown 正文
- note_visit_logs ：笔记访问日志，统计浏览次数、访问用户 ID
- portfolio_items ：作品集作品表，存储作品名称、描述、图片存储路径、关联分类 ID

🚀 本地开发

1. 克隆仓库

bash

git clone git@github.com:xywihi/ai-agent-app-first.git
cd ai-agent-app-first



2. 安装依赖

bash

pnpm install



3. 环境变量配置

新建  .env.local

env

# Supabase

NEXT_PUBLIC_SUPABASE_URL=你的 supabase 地址
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon 密钥
SUPABASE_SERVICE_ROLE_KEY=服务端密钥

# AI 模型

OPENAI_API_KEY=你的模型密钥



4. 启动开发服务

bash

pnpm dev



访问： http://localhost:3000

📜 项目目录结构

plaintext

ai-agent-app-first/
├── app/ # Next.js App Router
│ ├── api/ # API 路由（AI Agent 接口）
│ ├── frontend/ # 笔记页面路由
│ ├── portfolio/ # UI 作品集页面路由
│ └── utils/ # 工具函数、TS 类型定义
├── components/ # shadcn/ui + 业务组件
│ ├── ui/ # shadcn 基础组件
│ ├── AsideNav.tsx # 侧边两级分类目录
│ ├── EditeNoteForm.tsx # 新建笔记表单
│ ├── PortfolioCard.tsx # 作品集卡片组件
│ └── GlobalModel.tsx # 全局弹窗
├── lib/ # 第三方库初始化（supabase）
├── public/ # 静态资源
└── types/ # TS 类型定义



📌 开发备注

1. Markdown 支持 remark-directive 自定义容器语法；
2.  分类树使用 TanStack Query 缓存，减少重复请求；
3. Supabase 开启 RLS 行安全策略，隔离不同用户数据；
4. Tailwind 使用命名 group，实现复杂 hover 联动 UI 效果；
5.  作品集图片文件存储在 Supabase Storage 对象存储。

📄 License

MIT



这个项目页面和交互比较多，工作任务模式可以帮你继续新增作品集页面、调试组件和预览效果，要不要用它继续？
