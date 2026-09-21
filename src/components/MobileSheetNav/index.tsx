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
import React, { Suspense, useEffect, useMemo, useState } from "react";
import LogoutButton from "../LogoutButton";
import { UserCenter } from "../UserCenter";
import { SearchAll } from "../SearchAll";
import FullScreen from "../HeaderNav/components/FullScreen";
import { Menu } from "lucide-react";
import client from "@/lib/server";
import { UserMetadata } from "@/app/utils/api/user/type";

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
  const [user, setUser] = useState<UserMetadata | null>(null);
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
  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (e) => {
      const data = await client.auth.getUser();
      setUser((data.data.user?.user_metadata as UserMetadata) ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
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
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex 2xl:hidden flex-row justify-between items-center">
        <SheetTrigger className="2xl:hidden">
          <Menu size={24} />
        </SheetTrigger>
        <div className="flex flex-row justify-between items-center gap-2">
          {/* 全屏 */}
          <FullScreen />
          {/* 个人中心 */}
          {user && <UserCenter userMetadata={user} />}
          {/* 搜索全站 */}
          <SearchAll />
        </div>
      </div>

      <SheetContent
        side="left"
        lang="zh"
        className="bg-white/95 border-none truncate z-100 p-6 max-h-[calc(100vh)]"
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
          {user && <LogoutButton />}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
