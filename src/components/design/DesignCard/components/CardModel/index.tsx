import { GlobalModel } from "@/components/GlobalModel";
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
import Image from "next/image";
import { Maximize, Share2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "../LikeButton";
import { CollectButton } from "../CollectButton";
import { Button } from "@/components/ui/button";
import { getTime } from "@/app/utils/tools";
import Link from "next/link";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";

export const CardModel = ({
  card,
  setShowImage,
}: {
  card: ProcessedPortfolioWork;
  setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <GlobalModel handleShowModel={() => setShowImage((pre) => !pre)}>
      <div className="relative">
        <div>
          <div className="absolute -top-14 right-15 cursor-pointer group">
            <Tooltip>
              <Link href={"/design/detail/" + card.id}>
                <TooltipTrigger className="w-10 h-10 flex justify-center items-center bg-white dark:bg-gray-700 rounded-full cursor-pointer">
                  <Maximize
                    size={20}
                    className="group-hover:stroke-4 group-hover:text-teal-400 transition-all duration-200"
                  />
                </TooltipTrigger>
              </Link>

              <TooltipContent sideOffset={6}>
                <p>查看详情</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="absolute -top-15 right-0 cursor-pointer group">
            <Tooltip>
              <TooltipTrigger
                className="w-12 h-12 flex justify-center items-center bg-white dark:bg-gray-700 rounded-full cursor-pointer"
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
        <Card className="bg-white dark:bg-gray-700 pt-0 flex flex-col xl:flex-row">
          <div className="flex-1 max-h-80 xl:max-h-[calc(100vh-200px)] overflow-auto">
            <Image
              width={200}
              height={300}
              loading="lazy"
              fetchPriority="high" // 预加载
              src={card.portfolio_work_images[0].image_url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Event cover"
              className="relative z-20 w-full object-top rounded-none! select-none [-webkit-user-drag:none]"
            />
          </div>

          <div className="flex-1 xl:w-full xl:max-w-90 flex flex-col justify-between">
            {/* <CardHeader className="py-4"></CardHeader> */}
            <CardContent className="py-4">
              <CardTitle className="text-2xl xl:text-4xl mb-4 font-bold">
                {card.title}
              </CardTitle>
              {!!card.tags.length && (
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
              )}

              <section className="flex space-x-2">
                <p className="text-gray-500">{card.description}</p>
              </section>
              <Link
                href={`/user/${card.user_id}`}
                className="flex space-x-2 items-center mt-4"
              >
                <Avatar size="default" className="cursor-pointer">
                  <AvatarImage src={card.author.avatar_url} />
                  <AvatarFallback>{card.author.display_name}</AvatarFallback>
                </Avatar>
                <span className="text-lg">{card.author.display_name}</span>
              </Link>
              <CardAction className="w-full flex space-x-2 justify-start mt-4 transform -translate-x-2">
                <LikeButton card={card} />
                <CollectButton card={card} />
                <Button className="shrink-0 flex-nowrap flex rounded-full cursor-pointer hover:bg-teal-400 dark:hover:bg-teal-600 hover:drop-shadow-[0_4px_12px_#14b8a6cc]">
                  <Share2 />
                  <span>{card.actions.share.count}</span>
                </Button>
              </CardAction>
            </CardContent>
            <CardFooter className="border-t-gray-200 dark:border-t-gray-800 text-gray-500">
              更新时间：{getTime(card.updated_at)}
            </CardFooter>
          </div>
        </Card>
      </div>
    </GlobalModel>
  );
};
