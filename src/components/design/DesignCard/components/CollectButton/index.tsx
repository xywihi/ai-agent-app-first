"use client";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { Post } from "@/app/utils/query";
import { QueryKeys } from "@/app/utils/query-keys";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useOptimistic, startTransition, useCallback } from "react";
export const CollectButton = ({ card }: { card: ProcessedPortfolioWork }) => {
  const { type } = useParams();
  const queryClient = useQueryClient();
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
  const handleToCollect = useCallback(
    async (id?: string) => {
      const res = await Post(`/api/user/design/portfolio/collect`, {
        body: JSON.stringify({
          workId: card.id,
          id,
        }),
      });
      console.log("res", res);
      if (res) {
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
                    star: {
                      ...item.actions.star,
                      active: !item.actions.star.active,
                      count: id
                        ? item.actions.star.count - 1
                        : item.actions.star.count + 1,
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
    },
    [card.id, queryClient, type]
  );
  return (
    <Button
      className="rounded-full cursor-pointer hover:bg-rose-300 dark:hover:bg-rose-600 hover:drop-shadow-[0_4px_12px_#f43f5ecc]"
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
      <Star fill={optCollected ? "#f43f5e" : "transparent"} />
      <span>{optCollectCount}</span>
    </Button>
  );
};
