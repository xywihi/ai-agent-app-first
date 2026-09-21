import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PencilRuler, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export const Recommands = ({
  recomandCards,
}: {
  recomandCards: ProcessedPortfolioWork[];
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold my-6 flex items-center gap-2">
        <PencilRuler size={24} />
        推荐相关 · <span className="text-teal-400">设计作品</span>
      </h2>
      <ScrollArea className="w-full">
        <div className="flex flex-row gap-4">
          {recomandCards.map((card: ProcessedPortfolioWork) => (
            <figure key={card.id} className="h-full xl:max-w-60 shrink-0">
              <Link href={`/design/detail/${card.id}`} className="relative">
                <Image
                  width={200}
                  height={300}
                  loading="eager"
                  src={card.portfolio_work_images[0].image_url}
                  alt="Event cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 加载优化
                  className="relative z-20 h-40 rounded-2xl aspect-4/3 w-full object-cover object-top select-none [-webkit-user-drag:none]"
                />
                <p className="absolute top-2 left-2 z-20 bg-white dark:bg-gray-700/20 backdrop-blur-md px-3 py-1 rounded-full text-sm text-white flex gap-1 items-center cursor-pointer">
                  <ThumbsUp
                    size={16}
                    fill={card.actions.like.active ? "#f59e0b" : "transparent"}
                  />
                  {card.actions.like.count}
                </p>
              </Link>

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
    </div>
  );
};
