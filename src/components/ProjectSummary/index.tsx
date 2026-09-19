import { cn } from "@/app/utils/tools";
import { useEffect, useRef, useState } from "react";
const features = [
  {
    title: "权限与存储",
    description:
      "依托Supabase Auth实现HttpOnly Cookie安全登录，Storage完成头像、作品图片上传；数据库使用触发器自动维护分类作品统计数量。",
  },
  {
    title: "状态管理",
    description:
      "使用TanStack Query管理接口缓存，统一维护query-keys，多组件共享服务端数据，登录退出自动清理缓存。",
  },
  {
    title: "代码架构",
    description:
      "清晰分层 lib (SDK实例封装) / utils (纯工具函数) / hooks (自定义业务钩子)；Typescript全链路类型约束，按业务模块拆分类型定义。",
  },
  {
    title: "性能优化",
    description:
      "针对CLS布局偏移、图片加载抖动进行优化;图片、组件按需懒加载;使用oklch色彩模式自定义shadcn/ui主题，支持亮色/暗黑模式。",
  },
  {
    title: "业务能力",
    description:
      "笔记模糊检索、作品集多图上传、作品列表关联查询规避N+1查询、个人中心、全局搜索、主题切换。",
  },
];

export const ProjectSummary = () => {
  const [index, setIndex] = useState(0);
  const rafIdRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  useEffect(() => {
    function tick() {
      // 页面不可见直接跳过，降功耗
      if (document.hidden) {
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }
      const now = Date.now();
      //   每5秒更新一次
      if (now - lastTimeRef.current >= 5000) {
        lastTimeRef.current = now;
        setIndex((index) => (index + 1) % features.length);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    }

    // 初始化一次
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    };
  }, []);
  return (
    <div className="px-6 xl:px-14 py-6 flex flex-col gap-4 justify-around items-center w-full md:w-[calc(150%+4rem)] 2xl:max-w-[calc(75%+4rem)]">
      {/* <div className="w-full mt-20 mb-8 px-14 py-6 min-w-md flex gap-4 justify-around items-center flex-wrap">
        {features.map((item, _index) => (
          <div key={_index}>
            <p
              className={cn("relative text-2xl font-bold", {
                "after:content-[''] after:absolute after:opacity-50 after:left-1/2 after:top-1/2 after:-translate-1/2 after:block after:w-3 after:h-3 after:bg-teal-400 after:rounded-lg":
                  index === _index,
              })}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div> */}
      <div className="mt-20 relative w-full flex justify-center isolate">
        {features.map((item, __index) => (
          <div
            key={__index}
            className={cn(
              "absolute px-6 xl:px-14 py-6 bg-teal-300 dark:bg-teal-600 scale-0.95 -z-1 w-fit rounded-2xl transform transition-transform duration-1000 ease-out",
              {
                "animate-card-change z-99 shadow-xl opacity-100":
                  index === __index,
              },
              {
                "-z-1 opacity-0": index !== __index,
              }
            )}
          >
            <div className="text-center">{item.description}</div>
          </div>
        ))}
        {/* <div className="absolute top-0 mt-4 w-full h-px bg-linear-to-r from-[#050505] via-gray-200 to-[#050505] z-10"></div> */}
        {/* <div className="mt-4 w-full h-10 dark:h-4 bg-linear-to-b from-gray-200/50 to-white dark:from-[#181818] dark:to-[#181818] z-10"></div> */}
        {/* <div className="absolute left-0 mt-4 w-full h-60 bg-white dark:bg-[#050505] z-1"></div> */}
        {/* <div className="mt-4 w-full h-60 bg-amber-400 z-10"></div> */}
      </div>
    </div>
  );
};
