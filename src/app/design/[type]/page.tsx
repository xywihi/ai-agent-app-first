"use client";
import { debounce } from "@/app/utils/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divide, Search } from "lucide-react";
import { Suspense, useCallback, useState } from "react";
import { PortfolioList } from "./components/PortfolioList";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonD } from "./components/SkeletonD";

const debounceFn = debounce((fn) => {
  if (typeof fn !== "function") return;
  // 在此处做你的搜索逻辑
  // fn("9999999");
}, 500);
export default function Design() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [portfolioLength, setPortfolioLength] = useState(0);
  const doDebounce = useCallback(
    (value: string) =>
      debounceFn((val) => {
        console.log("value", value, "val", val);
        // setSearchValue(val);
      }),
    []
  );

  // console.log("portfolio_works", portfolio_works);
  return (
    <div onClick={() => setShowSearch(false)}>
      <div className="mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center">
        <h1 className="text-gray-400 xl:text-2xl">
          设计作品 <span className="underline">{portfolioLength}</span> 个
        </h1>
        {/* 搜索框 */}
        <div className="relative w-[calc(100%-1.5rem)] xl:w-auto">
          <div className="relative">
            <Input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                const vv = doDebounce(e.target.value);
                console.log("vv", vv);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowSearch((pre) => !pre);
                console.log("showSearch", showSearch);
              }}
              placeholder="搜索"
              className="w-full xl:w-120  p-4 rounded-2xl min-h-10"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search />
              搜索
              {/* <Kbd className="ml-1 bg-gray-200 dark:bg-gray-700 rounded">
                ⌘K
              </Kbd> */}
            </Button>
          </div>
          {showSearch && (
            <div
              className="absolute mt-3 w-full bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 rounded-2xl min-h-10 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>作品主推</h3>
              <ul className="mt-2 flex flex-row flex-wrap gap-2">
                <li
                  className="px-2 bg-gray-100 dark:bg-gray-800/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("UI设计");
                    setShowSearch(false);
                  }}
                >
                  UI设计
                </li>
                <li
                  className="px-2 bg-gray-100 dark:bg-gray-800/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("图标设计");
                    setShowSearch(false);
                  }}
                >
                  图标设计
                </li>
                <li
                  className="px-2 bg-gray-100 dark:bg-gray-800/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("图标设计");
                    setShowSearch(false);
                  }}
                >
                  LOGO设计
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <Suspense fallback={<SkeletonD />}>
        <PortfolioList setPortfolioLength={setPortfolioLength} />
      </Suspense>
    </div>
  );
}
