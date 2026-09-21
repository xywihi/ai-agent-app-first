"use client";
import { Breadcrumbs } from "../Breadcrumbs";
import { UserCenter } from "../UserCenter";
import { SearchAll } from "../SearchAll";
import PerformanceClock from "../PerformanceClock";
import LogoutButton from "../LogoutButton";
import FullScreen from "./components/FullScreen";
import NavMenuList from "./components/NavMenuList";
import { useEffect, useState } from "react";
import client from "@/lib/server";
import { UserMetadata } from "@/app/utils/api/user/type";
export const HeaderNav = () => {
  const [user, setUser] = useState<UserMetadata | null>(null);
  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (e) => {
      console.log("e", e);
      const data = await client.auth.getUser();
      setUser((data.data.user?.user_metadata as UserMetadata) ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <div className="flex-row justify-between items-center hidden 2xl:flex">
      <div className="w-2xs hidden 2xl:block">
        {/* 面包屑导航 */}
        <Breadcrumbs />
      </div>
      <nav>
        {/* 顶部导航 */}
        <NavMenuList />
      </nav>
      <div className="w-2xs flex flex-row justify-end items-center space-x-2">
        {/* 个人中心 */}
        {user && <UserCenter userMetadata={user} />}
        {/* 全屏 */}
        <FullScreen />
        {/* 搜索全站 */}
        <SearchAll />
        {/* <ThemeToggle />
                  <LanguageToggle /> */}
        {/* 性能时钟 */}
        <PerformanceClock />
        {/* 退出登录 */}
        {user && <LogoutButton />}
      </div>
    </div>
  );
};
