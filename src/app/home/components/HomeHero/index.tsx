export const HomeHero = () => {
  return (
    <div className="w-full pt-20 pb-12 px-4 rounded-2xl">
      <div className="text-center max-w-4xl mx-auto">
        <div className="text-slate-800 dark:text-slate-100 mb-8">
          <h1 className="text-6xl font-bold">
            探索设计 · 前端 ·{" "}
            <span className="text-blue-600 dark:text-blue-500">
              AI 全栈实践
            </span>
          </h1>
          <p className="text-xl mt-8 flex flex-col sm:flex-row gap-2 justify-center">
            <span className="text-slate-500 dark:text-slate-400 border border-dashed rounded-xl px-2">
              作品集
            </span>
            <span className="text-slate-500 dark:text-slate-400 border border-dashed rounded-xl px-2">
              技术笔记
            </span>
            <span className="text-slate-500 dark:text-slate-400 border border-dashed rounded-xl px-2">
              可交互项目演示
            </span>
          </p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          汇集UI设计作品、前端实战笔记、AI交互Demo。记录设计、编码与AI-Agent全栈开发实践，全部项目附带源码与可运行示例。
        </p>
      </div>
    </div>
  );
};
