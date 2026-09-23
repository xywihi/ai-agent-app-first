"use client";
import { Suspense, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ToTop } from "@/components/ToTop";
import { QueryKeys } from "@/app/utils/query-keys";
import { Get } from "@/app/utils/query";
import { recordPortfolioVisit } from "@/app/utils/api/design/reuqery";
import { Recommands } from "./components/Recommands";
import { LeaveMessage } from "./components/LeavveMessage";
import { Content } from "./components/Content";
import { Author } from "./components/Author";
import { LikeButton } from "@/components/design/DesignCard/components/LikeButton";
import { CollectButton } from "@/components/design/DesignCard/components/CollectButton";
import { GlobalLoading } from "@/components/GlobalLoading";

export default function Design() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  useEffect(() => {
    // 右键拦截
    const onContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);
    return () => {
      document.removeEventListener("contextmenu", onContext);
    };
  }, []);
  // 处理用户浏览设计记录
  useQuery({
    queryKey: QueryKeys.fronend.visit,
    // enabled: !userId,
    queryFn: async () => {
      try {
        if (!id) return null;
        const data = await recordPortfolioVisit(id as string);
        return data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { data: card, isPending } = useQuery({
    queryKey: QueryKeys.portfolio.detail(id as string),
    enabled: !!id,
    queryFn: async () => {
      const data = await Get(`/api/user/design/portfolio/detail?id=${id}`);
      return data;
    },
  });
  const { data: recomandCards } = useQuery({
    queryKey: QueryKeys.portfolio.recomand(card),
    enabled: !!card?.portfolio_categories?.id,
    queryFn: async () => {
      const data = await Get(
        `/api/user/design/portfolio/recomand?categoryId=${card?.portfolio_categories?.id}&id=${id}`
      );
      return data;
    },
  });
  if (isPending) return <GlobalLoading />;
  return (
    card && (
      <div>
        <div className="w-full md:w-auto md:right-0 px-4 fixed bottom-4 xl:bottom-10 z-50 flex md:flex-col md:items-end gap-4 justify-between md:justify-end items-center">
          {/* 活动按钮 */}
          <div className="flex md:flex-col space-y-2 bg-white dark:bg-gray-700 rounded-full py-2 md:py-4 px-2 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="px-2 md:p-0 m-0 md:mb-2">
              <LikeButton
                card={card}
                className="md:flex-col-reverse w-12 md:h-16"
                detail
              />
            </div>
            <div className="px-2 md:p-0 m-0 md:mb-2">
              <CollectButton
                card={card}
                className="md:flex-col-reverse w-12 md:h-16"
                detail
              />
            </div>
            <div className="px-2 md:p-0 m-0">
              <Button className="rounded-full w-12 md:h-16 flex flex-row-reverse md:flex-col justify-center items-center cursor-pointer hover:bg-teal-400 dark:hover:bg-teal-600 hover:drop-shadow-[0_4px_12px_#14b8a6cc]">
                <span>{card.actions.share.count}</span>
                <Share2
                  size={46}
                  fill={card.actions.share.active ? "#14b8a6" : "transparent"}
                />
              </Button>
            </div>
          </div>
          {/* 返回顶部 */}
          <div className="flex items-center gap-4 self-center">
            <ToTop />
          </div>
        </div>
        <section className="mb-19">
          <Author card={card} />
        </section>
        <div
          ref={containerRef}
          className="pb-24 relative w-full lg:max-w-1/2 m-auto bg-white dark:bg-gray-700 px-4 xl:rounded-2xl shadow-2xl"
        >
          <section className="py-6">
            <Suspense>
              <Content card={card} />
            </Suspense>
          </section>
          {recomandCards && recomandCards.length > 0 && (
            <section className="mt-12">
              <Recommands recomandCards={recomandCards} />
            </section>
          )}
          <section className="mt-12">
            <LeaveMessage />
          </section>
        </div>
      </div>
    )
  );
}
