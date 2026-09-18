"use client";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { getUserInfo } from "@/app/utils/api/user/requery";
import { Get } from "@/app/utils/query";
import { QueryKeys } from "@/app/utils/query-keys";
import { debounce } from "@/app/utils/tools";
import { DesignCard } from "@/components/design/DesignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { useUserQuery } from "@/hooks/use-user-query";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const debounceFn = debounce((fn) => {
  if (typeof fn !== "function") return;
  // 在此处做你的搜索逻辑
  fn("9999999");
}, 500);
export default function Design() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIndexes, setVisibleIndexes] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const cardHeightsRef = useRef<Map<string, number>>(new Map());
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [positions, setPositions] = useState<
    Map<string, { left: number; top: number; width: number; height: number }>
  >(new Map());
  const { data: user } = useUserQuery();
  const { type } = useParams();
  const { data: portfolio_works, isPending } = useQuery({
    queryKey: QueryKeys.portfolio.portfolios(type as string),
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const data = await Get(
        `/api/user/design/portfolio/default?category=${type}`
      );
      return data;
    },
  });
  useEffect(() => {
    // 右键拦截
    // const onContext = (e: MouseEvent) => e.preventDefault();
    // document.addEventListener("contextmenu", onContext);

    // 快捷键拦截
    // const onKey = (e: KeyboardEvent) => {
    //   if (e.key === "F12") e.preventDefault();
    //   if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "i")
    //     e.preventDefault();
    //   if ((e.metaKey || e.ctrlKey) && e.key === "s") e.preventDefault();
    // };
    // document.addEventListener("keydown", onKey);
    if (!containerRef.current) return;
    let observers: IntersectionObserver[] = [];
    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      // 分别监听每张卡片
      observers = cardRefs.current.map((card, index) => {
        console.log("index", index);
        observer = new IntersectionObserver(
          (entries) => {
            const count = entries.filter(
              (entry) => entry.isIntersecting
            ).length; // 剩余的卡片露出来了
            if (entries[0].isIntersecting) {
              // 这张卡片露出来了，加入 Set
              setVisibleIndexes((prev) => {
                const _visibleIndexes = new Set(prev).add(index);
                return _visibleIndexes;
              });
              setShouldAnimate(true);
              if (card) {
                observer.unobserve(card); // 只触发一次，取消该卡片的观察
              }
              // observer.disconnect(); // 会取消所有的观察
            }
            setVisibleCount(count);
          },
          // ([entry]) => {
          //   if (entry.isIntersecting) {
          //     // 这张卡片露出来了，加入 Set
          //     setVisibleIndexes((prev) => new Set(prev).add(index));
          //     observer.disconnect(); // 只触发一次
          //   }
          // },
          { threshold: 0.15 } // 露出 15% 就触发
        );
        if (card) observer.observe(card); // 如果有卡片，就观察
        return observer;
      }, 300);
    });

    // 清理所有 observer
    return () => {
      observers.forEach((obs) => obs.disconnect());
      clearTimeout(timer);
      observer?.disconnect();
      // document.removeEventListener("contextmenu", onContext);
      // document.removeEventListener("keydown", onKey);
    };
  }, [portfolio_works]);
  const doDebounce = useCallback(
    (value: string) =>
      debounceFn((val) => {
        console.log("value", value, "val", val);
        // setSearchValue(val);
      }),
    []
  );
  // 列数配置
  const getColumnCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 1000) return 2;
    if (width < 1300) return 3;
    return 4;
  }, []);
  // 计算布局
  const calcLayout = useCallback(() => {
    if (!containerRef.current) return;
    // 用测量到的高度计算布局
    const columnCount = getColumnCount();
    const columnHeights = new Array(columnCount).fill(0);
    const gap = 16;
    const containerWidth = containerRef.current
      ? containerRef.current?.offsetWidth
      : 0;
    const columnWidth =
      (containerWidth - gap * (columnCount - 1)) / columnCount;
    const newPositions: Map<
      string,
      { left: number; top: number; width: number; height: number }
    > = new Map();
    if (!portfolio_works) return;
    portfolio_works.list.forEach((work: ProcessedPortfolioWork) => {
      const height = cardHeightsRef.current.get(work.id) || 200;
      const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
      const left = shortestCol * (columnWidth + gap);
      const top = columnHeights[shortestCol];
      newPositions.set(work.id, { left, top, width: columnWidth, height });
      columnHeights[shortestCol] += height + gap + 16;
    });

    const timer = setTimeout(() => {
      // setPositions(newPositions);
      setPositions(
        (
          prev: Map<
            string,
            { left: number; top: number; width: number; height: number }
          >
        ) => {
          return new Map([...prev, ...newPositions]);
        }
      );
      setContainerHeight(Math.max(...columnHeights));
    });
    return () => clearTimeout(timer);
  }, [cardHeightsRef, getColumnCount, portfolio_works]);
  console.log("portfolio_works", portfolio_works);
  return (
    <div onClick={() => setShowSearch(false)}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          设计作品{" "}
          <span className="underline">{portfolio_works?.list?.length}</span> 个
        </h1>
        {/* 搜索框 */}
        <div className="relative">
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
              <Kbd className="ml-1 bg-gray-200 dark:bg-gray-700 rounded">
                ⌘K
              </Kbd>
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
      <div
        ref={containerRef}
        className="pb-12 mb-4 relative"
        style={{ height: containerHeight || "2000px" }}
      >
        <div
        // className={cn(
        //   "flex w-full gap-4 opacity-0 transform translate-y-40 duration-200 ease-bezier[0.22,1,0,0.36,1] delay-0",
        //   visibleIndexes.has(index) && "opacity-100 translate-y-0 delay-0"
        // )}
        >
          {isPending && <div className="text-center">作品努力加载中...</div>}
          {portfolio_works && !portfolio_works?.list.length && (
            <div>暂无作品</div>
          )}
          {portfolio_works &&
            portfolio_works.list.map(
              (work: ProcessedPortfolioWork, index: number) => {
                const pos = positions.get(work.id);
                return (
                  <div
                    key={index}
                    ref={(work) => {
                      cardRefs.current[index] = work as HTMLDivElement;
                    }}
                    className={cn(
                      "w-[calc(33%-1.5rem)] h-fit rounded-2xl opacity-0 translate-y-40 transform  duration-600 ease-bezier[0.22,1,0,0.36,1] delay-0",
                      visibleIndexes.has(index) &&
                        "opacity-100 translate-y-0 delay-0"
                      // shouldAnimate ? "opacity-100 translate-y-0" : ""
                    )}
                    onClick={() => {
                      console.log(cardHeightsRef.current, 1);
                    }}
                    // style={{
                    //   position: "absolute",
                    //   top: pos?.top + "px",
                    //   left: pos?.left + "px",
                    //   width: pos?.width + "px",
                    //   height: pos?.height + "px",
                    // }}
                    // 解决在卡片延迟滑出时，下面的卡片延迟时间不协调的问题
                    style={
                      {
                        position: "absolute",
                        // top: pos?.top + "px",
                        top:
                          (pos?.top === undefined ? index * 450 : pos?.top) +
                          "px",
                        left: pos?.left + "px",
                        width: (pos?.width || 450) + "px",
                        height: (pos?.height || 600) + "px",
                        transitionDelay: `${200}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <DesignCard
                      data={work}
                      cardHeightsRef={cardHeightsRef}
                      calcLayout={calcLayout}
                    />
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
}
