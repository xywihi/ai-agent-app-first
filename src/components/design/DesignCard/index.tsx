"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "./components/LikeButton";
import { CardModel } from "./components/CardModel";

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
  height,
  className,
  cardHeightsRef,
  calcLayout,
}: props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    // 右键拦截
    const onContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);
    return () => {
      document.removeEventListener("contextmenu", onContext);
    };
  }, []);
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

  return (
    <Card
      className={cn(
        "pt-0 bg-white dark:bg-gray-700 shadow-md pb-2 xl:pb-4",
        className
      )}
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
        src={card.portfolio_work_images[0].image_url}
        className="relative z-20 w-full h-auto max-h-60 xl:max-h-140 object-cover object-top select-none [-webkit-user-drag:none]"
        // className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 select-none [-webkit-user-drag:none]"
        onClick={() => {
          setShowImage(true);
        }}
      />
      <CardContent>
        <CardTitle className="text-lg xl:text-xl line-clamp-1">
          {card.title}
        </CardTitle>
        <CardDescription
          vocab="https://schema.org"
          className="hidden xl:flex space-x-2 mt-2 xl:mt-4"
        >
          {card.tags.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className="opacity-50 text-xs xl:text-sm"
            >
              {badge}
            </Badge>
          ))}
        </CardDescription>
        <section className="space-x-2 mt-2 xl:mt-4 hidden xl:flex">
          <p className="text-gray-500 line-clamp-2">{card.description}</p>
        </section>
        <CardAction className="w-full flex justify-between items-center mt-2">
          <div className="flex space-x-2 items-center">
            <Avatar
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                router.push("/user/" + card.user_id);
              }}
            >
              <AvatarImage src={card.author.avatar_url} />
              <AvatarFallback>{card.author.display_name}</AvatarFallback>
            </Avatar>
            <span>{card.author.display_name}</span>
          </div>
          <LikeButton card={card} />
        </CardAction>
      </CardContent>

      {showImage && <CardModel card={card} setShowImage={setShowImage} />}
    </Card>
  );
};
