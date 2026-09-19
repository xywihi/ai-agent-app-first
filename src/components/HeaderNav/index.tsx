"use client";
import Link from "next/link";
import { Home } from "lucide-react";
import { MovingBorder } from "../MovingBorder";
import { cn } from "@/app/utils/tools";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Breadcrumbs } from "../Breadcrumbs";
import { UserCenter } from "../UserCenter";
import { SearchAll } from "../SearchAll";
import PerformanceClock from "../PerformanceClock";
import LogoutButton from "../LogoutButton";
import { Suspense, useMemo } from "react";
import React from "react";

// const paths: {
//   name: string;
//   path: string;
//   icon: Parameters<typeof Icon>[0]["name"];
// }[] = [
//   {
//     name: "首页",
//     path: "/home",
//     icon: "home",
//   },
//   {
//     name: "UI作品集",
//     path: "/design",
//     icon: "pencil-ruler",
//   },
//   {
//     name: "前端笔记",
//     path: "/frontend",
//     icon: "computer",
//   },
//   {
//     name: "AI-Chat",
//     path: "/chat",
//     icon: "bot",
//   },
//   {
//     name: "AI-Agent",
//     path: "/ai-agent",
//     icon: "computer",
//   },
// ];
type Path = {
  name: string;
  path: string;
  icon: Parameters<typeof Icon>[0]["name"];
};
export const HeaderNav = () => {
  const pathname = usePathname();
  const paths: {
    name: string;
    path: string;
    icon: Parameters<typeof Icon>[0]["name"];
  }[] = useMemo(() => {
    return [
      {
        name: "首页",
        path: "/home",
        icon: "home",
      },
      {
        name: "UI作品集",
        path: "/design",
        icon: "pencil-ruler",
      },
      {
        name: "前端笔记",
        path: "/frontend",
        icon: "computer",
      },
      {
        name: "AI-Chat",
        path: "/chat",
        icon: "bot",
      },
      {
        name: "AI-Agent",
        path: "/ai-agent",
        icon: "computer",
      },
    ];
  }, []);
  return (
    <div className="flex-row justify-between items-center hidden xl:flex">
      <div className="w-2xs hidden xl:block">
        {/* 面包屑导航 */}
        <Breadcrumbs />
      </div>
      <nav>
        {/* 顶部导航 */}
        <ul className="flex flex-row items-center space-x-14">
          <Suspense>
            {paths.map((item, index) => (
              <li key={index} className="group relative">
                <Link
                  href={item.path}
                  aria-disabled="true"
                  className="flex items-center gap-1 flex-nowrap z-10 relative text-nowrap"
                >
                  <Icon name={item.icon} size={16} />

                  {item.name}
                </Link>
                {/* <MovingBorder
                  className={cn(
                    "group-hover:block hidden absolute -top-0.5 left-1/2 -translate-x-1/2",
                    pathname.startsWith(item.path) && "block"
                  )}
                  innerClassName="bg-white dark:bg-gray-700 px-4 py-0"
                >
                  <div className="flex items-center gap-1 flex-nowrap text-nowrap z-10 relative invisible">
                    <Home size={16} />
                    {item.name}
                  </div>
                </MovingBorder> */}
              </li>
            ))}
          </Suspense>
        </ul>
      </nav>
      <div className="w-2xs flex flex-row justify-end items-center space-x-2">
        {/* 个人中心 */}
        <UserCenter />
        {/* 搜索全站 */}
        <SearchAll />
        {/* <ThemeToggle />
                  <LanguageToggle /> */}
        {/* 性能时钟 */}
        <PerformanceClock />
        {/* 退出登录 */}
        {<LogoutButton />}
      </div>
    </div>
  );
};

// 抽离外部，不要写在HeaderNav内部
const NavMenuList = React.memo(
  ({ paths, pathname }: { paths: Path[]; pathname: string }) => {
    return (
      <ul className="flex flex-col items-center space-y-14">
        {paths.map((item: Path) => (
          <li key={item.path}>
            {" "}
            {/*❗不要用index，用path唯一key*/}
            <Link
              href={item.path}
              aria-disabled="true"
              className="flex items-center gap-1 flex-nowrap z-10 group relative"
            >
              <Icon name={item.icon} size={16} />
              {item.name}
              {/* ❗不要每一项都渲染MovingBorder！动画组件循环渲染开销爆炸 */}
              {/* <MovingBorder> ... </MovingBorder> */}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
);

NavMenuList.displayName = "NavMenuList";
