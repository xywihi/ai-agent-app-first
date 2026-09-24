import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { Get } from "@/app/utils/query";
import { QueryKeys } from "@/app/utils/query-keys";
import { cn } from "@/app/utils/tools";
import { DesignCard } from "@/components/design/DesignCard";
import { useUserQuery } from "@/hooks/use-user-query";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SkeletonD } from "../SkeletonD";
export const PortfolioList = ({
  setPortfolioLength,
}: {
  setPortfolioLength: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { data: user } = useUserQuery();
  const { type } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardHeightsRef = useRef<Map<string, number>>(new Map());
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [visibleIndexes, setVisibleIndexes] = useState(new Set());
  const [containerHeight, setContainerHeight] = useState(0);
  const [positions, setPositions] = useState<
    Map<string, { left: number; top: number; width: number; height: number }>
  >(new Map());
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
    if (portfolio_works) {
      setPortfolioLength(portfolio_works?.list?.length);
    }
  }, [portfolio_works, setPortfolioLength]);
  // 列数配置
  const getColumnCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 1000) return 2;
    if (width < 1300) return 3;
    return 4;
  }, []);
  useEffect(() => {
    // 懒加载
    if (!containerRef.current) return;
    let observers: IntersectionObserver[] = [];
    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      // 分别监听每张卡片
      observers = cardRefs.current.map((card, index) => {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              // 这张卡片露出来了，加入 Set
              setVisibleIndexes((prev) => {
                const _visibleIndexes = new Set(prev).add(index);
                return _visibleIndexes;
              });
              if (card) {
                observer.unobserve(card); // 只触发一次，取消该卡片的观察
              }
              // observer.disconnect(); // 会取消所有的观察
            }
          },
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
    };
  }, [portfolio_works]);
  // 计算布局
  const calcLayout = useCallback(() => {
    if (!containerRef.current) return;
    // 用测量到的高度计算布局
    const columnCount = getColumnCount();
    const columnHeights = new Array(columnCount).fill(0);
    const gap = 10;
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
      columnHeights[shortestCol] += height + gap + 14;
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
  return (
    <div
      ref={containerRef}
      className="pb-12 mb-4 relative"
      style={{ height: containerHeight || "2000px" }}
    >
      <div>
        {isPending && <SkeletonD />}
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
  );
};
