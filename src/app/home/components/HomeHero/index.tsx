import { Badge } from "@/components/ui/badge";

export const HomeHero = () => {
  return (
    <div className="w-full h-[calc(100vh-80px)] pt-20 pb-12 px-4 rounded-2xl flex flex-col justify-center">
      <div className="text-center max-w-6xl mx-auto">
        <div className="text-slate-800 dark:text-slate-100 mb-8">
          <h1 className="relative text-6xl md:text-8xl font-black">
            {/* 核心：文字背景裁剪 */}
            <span
              className="
           inline-block
             bg-clip-text
             text-transparent
             bg-size-[200%_100%]
         "
              style={{
                backgroundImage:
                  "linear-gradient(90deg,black 20%, blue 30%,blue 60%,black 80%)",
                animation: "moveBlock 2s linear infinite",
              }}
            >
              DESIGN × CODE × AI
            </span>
          </h1>
          <p className="text-xl mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          <h3 className="text-4xl font-bold mt-18">
            你好 ·{" "}
            <span className="text-blue-600 dark:text-blue-500">我是夕夜</span>
          </h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          <span className="inline-block mb-1">
            专注于前端开发 、 UI设计与AI Agent应用开发。
          </span>
          <br />
          喜欢把设计思维、现代 Web 技术与 AI 融合， 构建真正可以使用的产品。
        </p>
        <div className="flex justify-center flex-wrap gap-20 mt-8 text-lg">
          <span className="font-bold cursor-pointer hover:text-teal-400">
            [查看我的作品]
          </span>
          <span className="font-bold cursor-pointer hover:text-teal-400">
            [体验AI Agent]
          </span>
          {/* <Badge
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
          </Badge> */}
        </div>
      </div>
    </div>
  );
};
