"use client";
import { toast } from "sonner";
import { CommentForm } from "./components/commentForm";
import Image from "next/image";
import { useState } from "react";
import { GlobalModel } from "@/components/GlobalModel";
import { X } from "lucide-react";

type Project = {
  title: string;
  desc: string;
  tech: string[];
  link: string;
};
// app/about/page.tsx
export default function AboutPage() {
  const copyEmail = () => {
    navigator.clipboard.writeText("anli_ang@yeah.net");
    toast.success("邮箱已复制");
  };

  return (
    <main className="min-h-screen px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Hero */}
        <section className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
            {/* 头像 */}
            <Image
              width={200}
              height={200}
              loading="eager"
              src="/develop.gif"
              alt="avatar"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">夕夜</h1>
            <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">
              全栈开发者 · UI爱好者
            </p>
            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              专注 Web 交互、Next.js 全栈开发与 AI 应用搭建。 喜欢打磨 UI
              细节，研究前端交互、数据库设计，持续构建个人作品集与 AI 工具项目。
            </p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <a
                href="https://github.com/xywihi"
                target="_blank"
                className="rounded-md bg-slate-900 px-4 py-2 text-white dark:bg-white dark:text-slate-900"
              >
                Github
              </a>
              <button
                className="cursor-pointer rounded-md border border-slate-400 px-4 py-2"
                onClick={copyEmail}
              >
                联系我
              </button>
            </div>
          </div>
        </section>

        {/* 技能栈 */}
        <section className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 pt-12">
          <h2 className="text-lg text-white font-semibold px-4 py-2 bg-teal-400 dark:bg-teal-600 inline-block absolute top-0 left-0 rounded-br-2xl">
            技能栈
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                前端
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "React",
                  "TypeScript",
                  "TailwindCSS",
                  "shadcn/ui",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                后端 & 工具
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Supabase",
                  "PostgreSQL",
                  "Vercel",
                  "Vercel AI SDK",
                  "Figma",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 精选项目 */}
        <section className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 pt-12">
          <h2 className="text-lg text-white font-semibold px-4 py-2 bg-teal-400 dark:bg-teal-600 inline-block absolute top-0 left-0 rounded-br-2xl">
            精选项目
          </h2>
          <div className="mt-6 flex flex-col lg:flex-row gap-2">
            {[
              {
                title: "夕夜作品集",
                desc: "个人作品集网站，支持作品发布、留言，Supabase 权限管理，SEO优化",
                tech: ["Next.js", "Supabase", "Tailwind"],
                link: "/",
              },
              {
                title: "AI Chat / AI Agent",
                desc: "基于 Vercel AI SDK 的对话应用，支持工具调用",
                tech: ["Vercel AI SDK", "React"],
                link: "/ai-chat",
              },
              {
                title: "前端笔记",
                desc: "技术笔记管理页面，记录开发踩坑与学习笔记",
                tech: ["Next.js", "Zod"],
                link: "/notes",
              },
            ].map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        {/* 关于 */}
        <section className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 pt-12">
          <h2 className="text-lg text-white font-semibold px-4 py-2 bg-teal-400 dark:bg-teal-600 inline-block absolute top-0 left-0 rounded-br-2xl">
            我的更多
          </h2>
          <p className="mt-6 indent-8">
            目前在做个人作品集、AI 应用和前端相关项目。 我比较喜欢从 0 到 1
            搭建产品，也喜欢把一个页面从粗糙的原型打磨成细节完整的应用。
          </p>
          <p className="mt-4 indent-8">
            技术上，我主要围绕 Next.js
            生态开展开发。前端负责页面、组件、交互和状态，
            后端负责数据库、接口、权限和业务逻辑，部署上线后再根据反馈继续调整。
            我觉得一个好的产品，不只是功能能跑，还要结构清晰、体验顺畅、后期好维护。
          </p>
          <p className="mt-4 indent-8">
            最近我在关注 AI
            应用开发，尤其是基于大模型的对话系统、工具调用和知识库应用。
            我希望把 AI
            能力真正落到具体场景里，比如帮助用户整理信息、生成内容、完成查询，
            而不是只做一个聊天框。
          </p>
          <p className="mt-4 indent-8">
            我也会写一些技术笔记，把开发中遇到的坑、配置细节和实现思路记录下来。
            对我来说，记录的过程也是重新理解问题的过程。
          </p>
          <p className="mt-4 indent-8">
            如果你有不错的项目、想法，或者想一起交流技术，欢迎联系我。 我对 Web
            应用、AI 产品、开发者工具和个人站方向都比较感兴趣。
          </p>
        </section>
        {/* 留言 */}
        <section className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 pt-12">
          <h2 className="text-lg text-white font-semibold px-4 py-2 bg-teal-400 dark:bg-teal-600 inline-block absolute top-0 left-0 rounded-br-2xl">
            给我留言
          </h2>
          <p className="my-4 text-slate-700 dark:text-slate-300 leading-relaxed">
            如果你有想法、合作或者技术交流，可以在这里留言。
          </p>
          <CommentForm />
        </section>
      </div>
    </main>
  );
}

const ProjectCard = ({ project }: { project: Project }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      key={project.title}
      className="rounded-xl border p-5 bg-white dark:bg-gray-800 dark:border-slate-700 flex-1 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span
          className="cursor-pointer text-xs text-gray-500 dark:text-gray-300"
          onClick={() => setIsOpen(true)}
        >
          查看更多
        </span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{project.desc}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="text-xs text-slate-500 dark:text-slate-400">
            {t}
          </span>
        ))}
      </div>
      {isOpen && (
        <GlobalModel>
          <ProjectDetailCard project={project} setIsOpen={setIsOpen} />
        </GlobalModel>
      )}
    </div>
  );
};
const ProjectDetailCard = ({
  project,
  setIsOpen,
}: {
  project: Project;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      key={project.title}
      className="rounded-xl border p-5 bg-white dark:bg-gray-800 dark:border-slate-700 flex-1 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span className="cursor-pointer text-xs text-gray-500 dark:text-gray-300">
          <X className="w-4 h-4" onClick={() => setIsOpen(false)} />
        </span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{project.desc}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="text-xs text-slate-500 dark:text-slate-400">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};
