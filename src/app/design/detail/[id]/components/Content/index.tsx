import {
  PortfolioWorkImage,
  ProcessedPortfolioWork,
} from "@/app/utils/api/design/type";
import { getTime } from "@/app/utils/tools";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import Image from "next/image";

export const Content = ({ card }: { card: ProcessedPortfolioWork }) => {
  return (
    <div>
      <div>
        <article>
          <h1 className="text-2xl font-bold mb-6">{card.title}</h1>
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
        </article>
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
    </div>
  );
};
