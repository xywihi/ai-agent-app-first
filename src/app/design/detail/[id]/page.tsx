"use client";
import {
  startTransition,
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Share2, Star, ThumbsUp } from "lucide-react";
import z from "zod";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { ToTop } from "@/components/ToTop";
import { QueryKeys } from "@/app/utils/query-keys";
import { Get, Post } from "@/app/utils/query";
import { recordPortfolioVisit } from "@/app/utils/api/design/reuqery";
import { Recommands } from "./components/Recommands";
import { LeaveMessage } from "./components/LeavveMessage";
import { Content } from "./components/Content";
import { Author } from "./components/Author";

export default function Design() {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
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
  const { data: card } = useQuery({
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

  const handleToLike = useCallback(
    async (likeId?: string): Promise<void> => {
      const res = await Post(`/api/user/design/portfolio/like`, {
        body: JSON.stringify({
          workId: id,
          id: likeId,
        }),
      });
      console.log("res", res);
      if (res) {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.portfolio.detail(id as string),
        });
        queryClient.setQueryData(
          ["portfolio_work_detail", id],
          (oldData: ProcessedPortfolioWork) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              actions: {
                ...oldData.actions,
                like: {
                  ...oldData.actions.like,
                  active: !oldData.actions.like.active,
                  count: likeId
                    ? oldData.actions.like.count - 1
                    : oldData.actions.like.count + 1,
                },
              },
            };
          }
        );
      }
    },
    [id, queryClient]
  );
  const handleToCollect = useCallback(
    async (collectId?: string) => {
      const res = await Post(`/api/user/design/portfolio/collect`, {
        body: JSON.stringify({
          workId: id,
          id: collectId,
        }),
      });
      if (res) {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.portfolio.detail(id as string),
        });
        queryClient.setQueryData(
          ["portfolio_work_detail", id],
          (oldData: ProcessedPortfolioWork) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              actions: {
                ...oldData.actions,
                star: {
                  ...oldData.actions.star,
                  active: !oldData.actions.star.active,
                  count: collectId
                    ? oldData.actions.star.count - 1
                    : oldData.actions.star.count + 1,
                },
              },
            };
          }
        );
      }
    },
    [queryClient, id]
  );
  return (
    card && (
      <div>
        {/* 活动按钮 */}
        <div className="fixed bottom-4 xl:bottom-25 z-50 left-4 xl:right-8 xl:left-auto lg:bottom-40 flex lg:flex-col space-y-2 bg-white dark:bg-gray-700 rounded-full py-2 lg:py-4 px-2 shadow-xl mt-2 border border-gray-200 dark:border-gray-700">
          <div className="px-2 lg:p-0 m-0 lg:mb-2">
            <LikeButton card={card} handleToLike={handleToLike} />
          </div>
          <div className="px-2 lg:p-0 m-0 lg:mb-2">
            <CollectButton card={card} handleToCollect={handleToCollect} />
          </div>
          <div className="px-2 lg:p-0 m-0">
            <Button className="rounded-full w-12 lg:h-16 flex flex-row-reverse lg:flex-col justify-center items-center cursor-pointer hover:bg-teal-400 dark:bg-teal-600 hover:drop-shadow-[0_4px_12px_#14b8a6cc]">
              <span>{card.actions.share.count}</span>
              <Share2
                size={46}
                fill={card.actions.share.active ? "#14b8a6" : "transparent"}
              />
            </Button>
          </div>
        </div>
        {/* 返回顶部 */}
        <div className="fixed bottom-4 xl:bottom-9 right-4 xl:right-9 z-50 flex items-center gap-4">
          <ToTop />
        </div>
        <section className="mb-19">
          <Author card={card} />
        </section>
        <div
          ref={containerRef}
          className="pb-12 mb-4 relative w-full lg:max-w-1/2 m-auto bg-white dark:bg-gray-700 px-4 rounded-2xl shadow-2xl"
        >
          <section className="py-6">
            <Content card={card} />
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

const LikeButton = ({
  card,
  handleToLike,
}: {
  card: ProcessedPortfolioWork;
  handleToLike: (id?: string) => Promise<void>;
}) => {
  const [optLiked, setOptLiked] = useOptimistic(
    card.actions.like.active,
    (pre: boolean, _action: "toggle") => {
      console.log("pre", pre, _action);
      return !pre;
    }
  );
  const [optLikeCount, setOptLikeCount] = useOptimistic(
    card.actions.like.count,
    (pre: number, _action: "add" | "remove") => {
      console.log("pre", pre, _action);
      if (_action === "remove") {
        return pre - 1;
      }
      return pre + 1;
    }
  );
  return (
    <Button
      className="rounded-full w-12 lg:h-16 flex flex-row-reverse lg:flex-col justify-center items-center cursor-pointer hover:bg-amber-300 hover:drop-shadow-[0_4px_12px_#f59e0bcc]"
      onClick={() => {
        startTransition(async () => {
          setOptLiked("toggle");
          setOptLikeCount(optLiked ? "remove" : "add");
          // 乐观更新后的值会在异步结束后立即结束，返回旧值
          await handleToLike(
            card.portfolio_work_likes?.[0] && card.portfolio_work_likes?.[0].id
          );
        });
      }}
    >
      <span>{optLikeCount}</span>
      <ThumbsUp fill={optLiked ? "#f59e0b" : "transparent"} />
    </Button>
  );
};
const CollectButton = ({
  card,
  handleToCollect,
}: {
  card: ProcessedPortfolioWork;
  handleToCollect: (id?: string) => Promise<void>;
}) => {
  const [optCollected, setOptCollected] = useOptimistic(
    card.actions.star.active,
    (pre: boolean, _action: "toggle") => {
      console.log("pre", pre, _action);
      return !pre;
    }
  );
  const [optCollectCount, setOptCollectCount] = useOptimistic(
    card.actions.star.count,
    (pre: number, _action: "add" | "remove") => {
      console.log("pre", pre, _action);
      if (_action === "remove") {
        return pre - 1;
      }
      return pre + 1;
    }
  );
  return (
    <Button
      className="rounded-full w-12 lg:h-16 flex flex-row-reverse lg:flex-col justify-center items-center cursor-pointer hover:bg-rose-300 hover:drop-shadow-[0_4px_12px_#f43f5ecc]"
      onClick={() => {
        startTransition(async () => {
          setOptCollected("toggle");
          setOptCollectCount(optCollected ? "remove" : "add");
          // 乐观更新后的值会在异步结束后立即结束，返回旧值
          await handleToCollect(
            card.portfolio_work_collects?.[0] &&
              card.portfolio_work_collects?.[0].id
          );
        });
      }}
    >
      <span>{optCollectCount}</span>
      <Star fill={optCollected ? "#f43f5e" : "transparent"} />
    </Button>
  );
};
