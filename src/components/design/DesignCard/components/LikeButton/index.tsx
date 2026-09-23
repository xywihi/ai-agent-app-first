"use client";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { Post } from "@/app/utils/query";
import { QueryKeys } from "@/app/utils/query-keys";
import { cn } from "@/app/utils/tools";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useOptimistic, startTransition, useCallback } from "react";

export const LikeButton = ({
  card,
  className,
  detail,
}: {
  card: ProcessedPortfolioWork;
  className?: string;
  detail?: boolean;
}) => {
  const { type } = useParams();
  const queryClient = useQueryClient();
  const [optLiked, setOptLiked] = useOptimistic(
    card.actions.like.active,
    (pre: boolean, _action: "toggle") => {
      return !pre;
    }
  );
  const [optLikeCount, setOptLikeCount] = useOptimistic(
    card.actions.like.count,
    (pre: number, _action: "add" | "remove") => {
      if (_action === "remove") {
        return pre - 1;
      }
      return pre + 1;
    }
  );
  const handleToLike = useCallback(
    async (id?: string): Promise<void> => {
      const res = await Post(`/api/user/design/portfolio/like`, {
        body: JSON.stringify({
          workId: card.id,
          id,
        }),
      });
      if (res) {
        if (detail) {
          queryClient.invalidateQueries({
            queryKey: QueryKeys.portfolio.detail(card.id as string),
          });
          queryClient.setQueryData(
            QueryKeys.portfolio.detail(card.id as string),
            (oldData: ProcessedPortfolioWork) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                actions: {
                  ...oldData.actions,
                  like: {
                    ...oldData.actions.like,
                    active: !oldData.actions.like.active,
                    count: id
                      ? oldData.actions.like.count - 1
                      : oldData.actions.like.count + 1,
                  },
                },
              };
            }
          );
        } else {
          queryClient.invalidateQueries({
            queryKey: QueryKeys.portfolio.portfolios(type as string),
          });
          queryClient.setQueryData(
            QueryKeys.portfolio.portfolios(type as string),
            (oldData: { list: ProcessedPortfolioWork[] }) => {
              if (!oldData) return oldData;
              const list = oldData?.list.map((item: ProcessedPortfolioWork) => {
                if (item.id === card.id) {
                  return {
                    ...item,
                    actions: {
                      ...item.actions,
                      like: {
                        ...item.actions.like,
                        active: !item.actions.like.active,
                        count: id
                          ? item.actions.like.count - 1
                          : item.actions.like.count + 1,
                      },
                    },
                  };
                }
                return item;
              });
              return {
                list,
              };
            }
          );
        }
      }
    },
    [card.id, queryClient, type, detail]
  );
  return (
    <Button
      className={cn(
        "rounded-full cursor-pointer hover:bg-amber-300 dark:hover:bg-amber-600 hover:drop-shadow-[0_4px_12px_#f59e0bcc]",
        className
      )}
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
      <ThumbsUp fill={optLiked ? "#f59e0b" : "transparent"} />
      <span>{optLikeCount}</span>
    </Button>
  );
};
