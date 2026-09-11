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
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface props {
  data: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    badges: string[];
    updatedAt: string;
    actions: {
      like: {
        count: number;
        active: boolean;
      };
      star: {
        count: number;
        active: boolean;
      };
      share: {
        count: number;
        active: boolean;
      };
    };
  };
  height?: number;
  className?: string;
  getCardHeight?: (height: number) => void;
  cardHeightsRef?: React.RefObject<Map<number, number>>;
  calcLayout?: () => void;
}
export const DesignCard = ({
  data: card,
  height,
  className,
  cardHeightsRef,
  calcLayout,
}: props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState<boolean>(false);
  const router = useRouter();
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
  }, [cardHeightsRef, card, cardRef]);
  return (
    <Card
      className={cn("pt-0 bg-white shadow-md", className)}
      ref={cardRef}
      style={{ height }}
    >
      <Image
        width={200}
        height={300}
        src={card.imageUrl}
        alt="Event cover"
        className="relative z-20 w-full h-auto object-cover select-none [-webkit-user-drag:none]"
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
          {card.badges.map((badge) => (
            <Badge key={badge} variant="outline" className="opacity-50">
              {badge}
            </Badge>
          ))}
        </CardDescription>
        <section className="flex space-x-2">
          <p className="text-gray-500 line-clamp-2">{card.description}</p>
        </section>
        <CardAction className="flex space-x-2 justify-self-start mt-2">
          <Button className="rounded-full cursor-pointer hover:bg-amber-300 hover:drop-shadow-[0_4px_12px_#f59e0bcc]">
            <ThumbsUp
              fill={card.actions.like.active ? "#f59e0b" : "transparent"}
            />
            <span>{card.actions.like.count}</span>
          </Button>
          <Button className="rounded-full cursor-pointer hover:bg-rose-300 hover:drop-shadow-[0_4px_12px_#f43f5ecc]">
            <Star fill={card.actions.star.active ? "#f43f5e" : "transparent"} />
            <span>{card.actions.star.count}</span>
          </Button>
          <Button className="rounded-full cursor-pointer hover:bg-teal-400 hover:drop-shadow-[0_4px_12px_#14b8a6cc]">
            <Share2
              fill={card.actions.share.active ? "#14b8a6" : "transparent"}
            />
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
            <Card className="bg-white flex flex-row">
              <Image
                width={200}
                height={300}
                loading="eager"
                src={card.imageUrl}
                alt="Event cover"
                className="relative z-20 w-full object-cover max-h-[60vh] object-center rounded-none! select-none [-webkit-user-drag:none]"
              />

              <div className="w-1/2 flex flex-col justify-between">
                {/* <CardHeader className="py-4"></CardHeader> */}
                <CardContent className="py-4">
                  <CardTitle className="text-2xl mb-4">{card.title}</CardTitle>
                  <CardDescription
                    vocab="https://schema.org"
                    className="flex space-x-2 mb-4"
                  >
                    {card.badges.map((badge) => (
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
                      <Share2
                        fill={
                          card.actions.share.active ? "#14b8a6" : "transparent"
                        }
                      />
                      <span>{card.actions.share.count}</span>
                    </Button>
                  </CardAction>
                </CardContent>
                <CardFooter className="border-t-gray-200 text-gray-500">
                  更新时间：{card.updatedAt}
                </CardFooter>
              </div>
            </Card>
          </div>
        </GlobalModel>
      )}
    </Card>
  );
};
