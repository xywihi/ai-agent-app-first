"use client";
import { cn } from "@/lib/utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
} from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquareText,
  PencilRuler,
  Share2,
  Star,
  ThumbsUp,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@base-ui/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PortfolioWorkImage,
  ProcessedPortfolioWork,
} from "@/app/utils/api/design/type";
import { getTime } from "@/app/utils/tools";
import { ToTop } from "@/components/ToTop";
import { QueryKeys } from "@/app/utils/query-keys";
import { Get, Post } from "@/app/utils/query";
import { recordPortfolioVisit } from "@/app/utils/api/design/reuqery";
// import {VariableSizeGrid as Grid} from "react-window";
// type User = z.infer<typeof Schema>;

const formSchema = z.object({
  leaveMessage: z.string().min(1, "请输入留言"),
  phone: z.string().min(1, "请输入手机号"),
  email: z.string().email("请输入正确的邮箱"),
});
type FormValues = z.infer<typeof formSchema>;
export default function Design() {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {};
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
      <div
        ref={containerRef}
        className="pb-12 mb-4 relative w-full lg:max-w-1/2 m-auto bg-white dark:bg-gray-700 px-4 rounded-2xl shadow-2xl"
      >
        {/* 活动按钮 */}
        <div className="fixed right-26 bottom-25 z-10  lg:right-8 lg:bottom-40 flex lg:flex-col space-y-2 bg-white dark:bg-gray-700 rounded-full py-2 lg:py-4 px-2 shadow-xl mt-2 border border-gray-200 dark:border-gray-700">
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
        <div className="fixed bottom-26 right-9 z-50 flex items-center gap-4">
          <ToTop />
        </div>
        <section className="py-6">
          <div>
            <div>
              <h1 className="text-4xl font-bold mb-6">{card.title}</h1>
              <div vocab="https://schema.org" className="flex space-x-2 mb-4">
                {card.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="opacity-50">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="border-t-gray-200 dark:border-t-gray-800 text-gray-500 text-sm">
                更新时间：{getTime(card.updated_at)}
              </p>
              <section className="flex space-x-2 my-4">
                <p className="">{card.description}</p>
              </section>
            </div>
          </div>
          {card.portfolio_work_images.map(
            (item: PortfolioWorkImage, index: number) => {
              return (
                <Image
                  key={item.id}
                  width={200}
                  height={300}
                  loading="eager"
                  src={item.image_url}
                  alt="Event cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 加载优化
                  className={cn(
                    "relative z-20 w-full h-auto object-cover object-top select-none [-webkit-user-drag:none]",
                    {
                      "rounded-t-xl": index === 0,
                      "rounded-b-xl":
                        card.portfolio_work_images.length === index + 1,
                    }
                  )}
                />
              );
            }
          )}
        </section>
        {recomandCards && recomandCards.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold my-6 flex items-center gap-2">
              <PencilRuler size={24} />
              推荐相关 · <span className="text-teal-400">设计作品</span>
            </h2>
            <ScrollArea className="w-full">
              <div className="flex flex-row gap-4">
                {recomandCards.map((card: ProcessedPortfolioWork) => (
                  <figure key={card.id} className="h-full w-60 shrink-0">
                    <div
                      className="relative"
                      onClick={() => router.push(`/design/detail/${card.id}`)}
                    >
                      <Image
                        width={200}
                        height={300}
                        loading="eager"
                        src={card.portfolio_work_images[0].image_url}
                        alt="Event cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 加载优化
                        className="relative z-20 rounded-2xl aspect-4/3 h-fit w-full object-cover object-top select-none [-webkit-user-drag:none]"
                      />
                      <p className="absolute top-2 left-2 z-20 bg-white dark:bg-gray-700/20 backdrop-blur-md px-3 py-1 rounded-full text-sm text-white flex gap-1 items-center cursor-pointer">
                        <ThumbsUp
                          size={16}
                          fill={
                            card.actions.like.active ? "#f59e0b" : "transparent"
                          }
                        />
                        {card.actions.like.count}
                      </p>
                    </div>

                    <figcaption className="w-full pt-2 flex justify-between items-center gap-2">
                      <span className="line-clamp-1 text-md font-bold">
                        {card.title}
                      </span>
                      {/* <span className="text-sm text-gray-400 flex items-center gap-1 shrink-0">
                        <Eye size={16} />
                        {card.actions.like.count}
                      </span> */}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}
        <section className="mt-12">
          <h2 className="text-2xl font-bold my-6 flex items-center gap-2">
            <MessageSquareText size={24} />
            <span>
              留下足迹
              <span className="text-teal-400 hidden lg:inline-block">
                {" "}
                · 在此给作者写下您的留言
              </span>
            </span>
          </h2>
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="rounded-2xl p-6 border-6 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <textarea
                  maxLength={500}
                  {...register("leaveMessage")}
                  className="w-full h-40 min-h-40 max-h-80 outline-none focus:outline-none"
                  placeholder="在此给作者写下您的留言"
                ></textarea>
              </div>
              <span
                className={cn("text-red-500 text-sm h-4 w-full inline-block", {
                  invisible: !errors.leaveMessage,
                })}
              >
                {errors.leaveMessage && errors.leaveMessage.message}
              </span>
            </div>
            <div>
              <div className="flex flex-row gap-4 mt-2">
                <div className="flex-1">
                  <Input
                    {...register("phone")}
                    type="phone"
                    placeholder="请输入您的手机号"
                    className="flex-1 block w-full h-max rounded-2xl p-4 border-6 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 outline-none focus:outline-none"
                  />
                  <span
                    className={cn(
                      "text-red-500 text-sm shrink-0 h-4 w-full inline-block",
                      {
                        invisible: !errors.phone,
                      }
                    )}
                  >
                    {errors.phone && errors.phone.message}
                  </span>
                </div>
                <div className="flex-1">
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="请输入您的邮箱"
                    className="flex-1 block w-full h-fit rounded-2xl p-4 border-6 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 outline-none focus:outline-none"
                  />
                  <span
                    className={cn(
                      "text-red-500 text-sm shrink-0 h-4 w-full inline-block",
                      {
                        invisible: !errors.email,
                      }
                    )}
                  >
                    {errors.email && errors.email.message}
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-4 mt-6">
                <Button
                  type="submit"
                  className="w-60 h-14 rounded-2xl px-4 py-2 bg-gray-300 dark:bg-gray-600 text-2xl font-bold mt-4 cursor-pointer"
                >
                  取消留言
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl px-4 py-2 bg-teal-300 dark:bg-teal-600 text-2xl font-bold mt-4 cursor-pointer"
                >
                  提交
                </Button>
              </div>
            </div>
          </form>
        </section>
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
