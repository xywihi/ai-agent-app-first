"use client";
import { GlobalModel } from "@/components/GlobalModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Maximize, Share2, Star, ThumbsUp, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  startTransition,
  Suspense,
  use,
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { useQueryClient } from "@tanstack/react-query";
import { getTime } from "@/app/utils/tools";

interface props {
  index?: number;
  data: ProcessedPortfolioWork;
  height?: number;
  className?: string;
  getCardHeight?: (height: number) => void;
  cardHeightsRef?: React.RefObject<Map<string, number>>;
  calcLayout?: () => void;
}
export const DesignCard = ({
  data: card,
  index,
  height,
  className,
  cardHeightsRef,
  calcLayout,
}: props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState<boolean>(false);
  const router = useRouter();
  const { type } = useParams();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!cardRef.current) return;
    // 先渲染所有卡片（但透明不可见），测量高度后重新计算布局
    // const height = !cardRef.current
    //   ? 200
    //   : cardRef.current.getBoundingClientRect().height;
    // // if (height && getCardHeight) getCardHeight(height);
    // if (cardHeightsRef) {
    //   // cardHeightsRef.current[index] = height;\
    //   cardHeightsRef.current.set(card.id, height);
    //   console.log(
    //     "-------------------",
    //     card.id,
    //     height,
    //     cardHeightsRef.current
    //   );
    // }
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        // if (height && getCardHeight) getCardHeight(height);

        if (cardHeightsRef?.current) {
          // cardHeightsRef.current[index] = height;\
          cardHeightsRef.current.set(card.id, height);
          if (calcLayout) calcLayout();
        }
      }
    });
    if (cardHeightsRef) {
      ro.observe(cardRef.current);
    }

    return () => {
      cardRef.current = null;
    };
  }, [cardHeightsRef, card, cardRef, calcLayout]);
  const handleToLike = useCallback(
    async (id?: string): Promise<void> => {
      const res = await fetch(`/api/user/design/portfolio/like`, {
        method: "POST",
        body: JSON.stringify({
          workId: card.id,
          id,
        }),
      });
      console.log("res", res);
      if (res.ok) {
        queryClient.invalidateQueries({
          queryKey: ["portfolio_works", type],
        });
        queryClient.setQueryData(
          ["portfolio_works", type],
          (oldData: ProcessedPortfolioWork[]) => {
            if (!oldData) return oldData;
            return oldData.map((item: ProcessedPortfolioWork) => {
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
          }
        );
      }
    },
    [card.id, queryClient, type]
  );
  const handleToCollect = useCallback(
    async (id?: string) => {
      const res = await fetch(`/api/user/design/portfolio/collect`, {
        method: "POST",
        body: JSON.stringify({
          workId: card.id,
          id,
        }),
      });
      console.log("res", res);
      if (res.ok) {
        queryClient.invalidateQueries({
          queryKey: ["portfolio_works", type],
        });
        queryClient.setQueryData(
          ["portfolio_works", type],
          (oldData: ProcessedPortfolioWork[]) => {
            if (!oldData) return oldData;
            return oldData.map((item: ProcessedPortfolioWork) => {
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
          }
        );
      }
    },
    [card.id, queryClient, type]
  );
  return (
    <Card
      className={cn("pt-0 bg-white shadow-md", className)}
      ref={cardRef}
      style={{ height }}
    >
      <Image
        width={200}
        height={300}
        alt="Event cover"
        loading="eager"
        fetchPriority="high" // 预加载
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={card.portfolio_work_images[0].image_url + "?width=800&quality=75"}
        className="relative z-20 w-full h-auto max-h-140 object-cover object-top select-none [-webkit-user-drag:none]"
        // className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 select-none [-webkit-user-drag:none]"
        onClick={() => {
          setShowImage(true);
        }}
      />
      <CardContent>
        <CardTitle className="text-xl mb-4 line-clamp-1">
          {card.title}
        </CardTitle>
        <CardDescription
          vocab="https://schema.org"
          className="flex space-x-2 mb-4"
        >
          {card.tags.map((badge) => (
            <Badge key={badge} variant="outline" className="opacity-50">
              {badge}
            </Badge>
          ))}
        </CardDescription>
        <section className="flex space-x-2">
          <p className="text-gray-500 line-clamp-2">{card.description}</p>
        </section>
        <CardAction className="flex space-x-2 justify-self-start mt-2">
          <LikeButton card={card} handleToLike={handleToLike} />
          <CollectButton card={card} handleToCollect={handleToCollect} />
          <Button className="rounded-full cursor-pointer hover:bg-teal-400 hover:drop-shadow-[0_4px_12px_#14b8a6cc]">
            <Share2 />
            <span>{card.actions.share.count}</span>
          </Button>
        </CardAction>
      </CardContent>

      {showImage && (
        <GlobalModel handleShowModel={() => setShowImage((pre) => !pre)}>
          <div className="relative">
            <div>
              <div className="absolute -top-14 right-15 cursor-pointer group">
                <Tooltip>
                  <TooltipTrigger
                    className="w-10 h-10 flex justify-center items-center bg-white rounded-full cursor-pointer"
                    onClick={() => router.push("/design/detail/" + card.id)}
                  >
                    <Maximize
                      size={20}
                      className="group-hover:stroke-4 group-hover:text-teal-400 transition-all duration-200"
                    />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>
                    <p>查看详情</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="absolute -top-15 right-0 cursor-pointer group">
                <Tooltip>
                  <TooltipTrigger
                    className="w-12 h-12 flex justify-center items-center bg-white rounded-full cursor-pointer"
                    onClick={() => setShowImage((pre) => !pre)}
                  >
                    <X
                      size={20}
                      strokeWidth={4}
                      className="group-hover:size-7 group-hover:text-teal-400 transition-all duration-200"
                    />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>
                    <p>关闭</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Card className="bg-white pt-0 flex flex-row">
              <div className="flex-1 max-h-[calc(100vh-200px)] overflow-auto">
                <Image
                  width={200}
                  height={300}
                  loading="eager"
                  src={card.portfolio_work_images[0].image_url}
                  alt="Event cover"
                  className="relative z-20 w-full object-top rounded-none! select-none [-webkit-user-drag:none]"
                />
              </div>

              <div className="flex-1 max-w-90 pt-4 flex flex-col justify-between">
                {/* <CardHeader className="py-4"></CardHeader> */}
                <CardContent className="py-4">
                  <CardTitle className="text-4xl mb-4 font-bold">
                    {card.title}
                  </CardTitle>
                  <CardDescription
                    vocab="https://schema.org"
                    className="flex space-x-2 mb-4"
                  >
                    {card.tags.map((badge) => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className="opacity-50"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </CardDescription>
                  <section className="flex space-x-2">
                    <p className="text-gray-500">{card.description}</p>
                  </section>
                  <CardAction className="flex space-x-2 justify-self-start mt-2">
                    <Button className="rounded-full cursor-pointer hover:bg-amber-300 hover:drop-shadow-[0_4px_12px_#f59e0bcc]">
                      <ThumbsUp
                        fill={
                          card.actions.like.active ? "#f59e0b" : "transparent"
                        }
                      />
                      <span>{card.actions.like.count}</span>
                    </Button>
                    <Button className="rounded-full cursor-pointer hover:bg-rose-300 hover:drop-shadow-[0_4px_12px_#f43f5ecc]">
                      <Star
                        fill={
                          card.actions.star.active ? "#f43f5e" : "transparent"
                        }
                      />
                      <span>{card.actions.star.count}</span>
                    </Button>
                    <Button className="rounded-full cursor-pointer hover:bg-teal-400 hover:drop-shadow-[0_4px_12px_#14b8a6cc]">
                      <Share2 />
                      <span>{card.actions.share.count}</span>
                    </Button>
                  </CardAction>
                </CardContent>
                <CardFooter className="border-t-gray-200 text-gray-500">
                  更新时间：{getTime(card.updated_at)}
                </CardFooter>
              </div>
            </Card>
          </div>
        </GlobalModel>
      )}
    </Card>
  );
};

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
      className="rounded-full cursor-pointer hover:bg-amber-300 hover:drop-shadow-[0_4px_12px_#f59e0bcc]"
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
      className="rounded-full cursor-pointer hover:bg-rose-300 hover:drop-shadow-[0_4px_12px_#f43f5ecc]"
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
