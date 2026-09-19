"use client";
import Link from "next/link";
import { cn } from "@/app/utils/tools";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { Suspense, useEffect, useMemo } from "react";
import LogoutButton from "../LogoutButton";
import { Fullscreen, Menu } from "lucide-react";
import { UserCenter } from "../UserCenter";
import { SearchAll } from "../SearchAll";

type Path = {
  name: string;
  path: string;
  icon: Parameters<typeof Icon>[0]["name"];
};

const NavMenuList = React.memo(
  ({ paths, pathname }: { paths: Path[]; pathname: string }) => {
    return (
      <ul className="flex flex-col space-y-14 mt-6">
        {paths.map((item) => (
          <li key={item.path}>
            <Suspense>
              <Link
                href={item.path}
                className={cn(
                  "flex items-center gap-3 flex-nowrap z-10 group relative text-lg",
                  pathname.startsWith(item.path) &&
                    "text-teal-500 font-bold text-xl"
                )}
              >
                <Icon name={item.icon} size={24} />
                {item.name}
              </Link>
            </Suspense>
          </li>
        ))}
      </ul>
    );
  }
);
NavMenuList.displayName = "NavMenuList";

export function MobileSheetNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
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

  const handleOpenOrClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleOpenOrClose();
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);
  const hadleFullScreen = () => {
    const body = document.getElementById("global_anln");
    if (!body) return;
    body.requestFullscreen();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex 2xl:hidden flex-row justify-between items-center">
        <SheetTrigger className="2xl:hidden">
          <Menu size={24} />
        </SheetTrigger>
        <div className="flex flex-row justify-between items-center gap-2">
          <div
            className={cn(
              "w-fit p-3 h-fit 2xl:p-2 shrink-0 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg group hover:text-teal-400 cursor-pointer transition-all"
            )}
            onClick={hadleFullScreen}
          >
            <Fullscreen size={16} />
          </div>
          {/* 个人中心 */}
          <UserCenter />
          {/* 搜索全站 */}
          <SearchAll />
        </div>
      </div>

      <SheetContent
        side="left"
        lang="zh"
        className="bg-white/95 border-none truncate z-[100] p-6 max-h-[calc(100vh)]"
        showCloseButton={false}
        // overlayClassName="bg-black/40"
      >
        <SheetHeader className="p-0 flex flex-row justify-between items-center">
          <SheetTitle>导航菜单</SheetTitle>
          <SheetClose>关闭</SheetClose>
        </SheetHeader>
        <NavMenuList paths={paths} pathname={pathname} />
        <SheetFooter className="p-0">
          {/* 退出登录 */}
          {<LogoutButton />}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
