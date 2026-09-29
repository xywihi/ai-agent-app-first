import { Badge } from "@/components/ui/badge";

export const HomeHero = () => {
  return (
    <div className="w-full pt-20 pb-12 px-4 rounded-2xl">
      <div className="text-center max-w-4xl mx-auto">
        <div className="text-slate-800 dark:text-slate-100 mb-8">
          <h1 className="text-6xl font-bold">
            你好 ·
            <span className="text-blue-600 dark:text-blue-500">我是夕夜</span>
          </h1>
          <p className="text-xl mt-8 flex flex-col sm:flex-row gap-2 justify-center items-center">
            <span className="w-fit text-slate-500 dark:text-slate-400 border border-dashed rounded-xl px-4">
              Frontend Developer
            </span>
            <span className="w-fit text-slate-500 dark:text-slate-400 border border-dashed rounded-xl px-4">
              UI Designer
            </span>
            <span className="w-fit text-slate-500 dark:text-slate-400 border border-dashed rounded-xl px-4">
              AI Engineer
            </span>
          </p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          专注于前端开发 / UI设计 / AI Agent
          应用开发，把设计、代码与AI融合，做出真正可以使用的产品。
        </p>
        <div className="flex justify-center flex-wrap gap-2 mt-4">
          <Badge
            className="bg-gray-100 dark:bg-gray-700 text-gray-400"
            variant="secondary"
          >
            React
          </Badge>
          <Badge
            className="bg-gray-100 dark:bg-gray-700 text-gray-400"
            variant="secondary"
          >
            Next.js
          </Badge>
          <Badge
            className="bg-gray-100 dark:bg-gray-700 text-gray-400"
            variant="secondary"
          >
            TypeScript
          </Badge>
          <Badge
            className="bg-gray-100 dark:bg-gray-700 text-gray-400"
            variant="secondary"
          >
            Tailwind
          </Badge>
          <Badge
            className="bg-gray-100 dark:bg-gray-700 text-gray-400"
            variant="secondary"
          >
            Supabase
          </Badge>
          <Badge
            className="bg-gray-100 dark:bg-gray-700 text-gray-400"
            variant="secondary"
          >
            AI SDK
          </Badge>
          <Badge
            className="bg-gray-100 dark:bg-gray-700 text-gray-400"
            variant="secondary"
          >
            AI Agent
          </Badge>
        </div>
      </div>
    </div>
  );
};
