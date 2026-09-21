"use client";
import { Breadcrumbs } from "../Breadcrumbs";
import { UserCenter } from "../UserCenter";
import { SearchAll } from "../SearchAll";
import PerformanceClock from "../PerformanceClock";
import LogoutButton from "../LogoutButton";
import FullScreen from "./components/FullScreen";
import NavMenuList from "./components/NavMenuList";

export const HeaderNav = () => {
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
        <UserCenter />
        {/* 全屏 */}
        <FullScreen />
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
