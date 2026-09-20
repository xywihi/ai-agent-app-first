import { Note } from "@/app/utils/api/font-notes/typs";
import { Get } from "@/app/utils/query";
import { cn } from "@/app/utils/tools";
import { GroundGlassCard } from "@/components/GroundGlassCard";
import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleChevronRight, Computer } from "lucide-react";
import Link from "next/link";
export const NotesSection = async <
  T extends { data: { list: Note[] } | undefined }
>({
  data,
}: T) => {
  const list = data?.list ?? [];
  return (
    <GroundGlassCard
      className={cn("w-[calc(100%-2rem)] 2xl:max-w-1/4 max-w-lg")}
      cardClassName={cn(
        "flex flex-col xl:max-h-110 opacity-0 transition-all duration-300 ease-out",
        {
          "opacity-100": list.length > 0,
        }
      )}
    >
      <CardHeader>
        <CardTitle className="text-3xl flex items-center">
          <Computer size={24} className="mr-2" />
          前端学习总结
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto flex flex-col">
        <CardAction className="flex flex-wrap gap-2 mb-4 justify-self-start">
          <Button
            size="sm"
            className="border border-gray-200 dark:border-gray-700 rounded-xl"
          >
            React学习笔记
          </Button>
          <Button
            size="sm"
            className="border border-gray-200 dark:border-gray-700 rounded-xl"
          >
            Vue学习笔记
          </Button>
          <Button
            size="sm"
            className="border border-gray-200 dark:border-gray-700 rounded-xl"
          >
            前端优化笔记
          </Button>
        </CardAction>
        <CardDescription>
          <p>
            整理主流前端框架与AI全栈开发实战笔记，包含
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">React</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">Vue</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">Next.js</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">工程化</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">性能优化</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">
              AI‑SDK应用开发
            </Kbd>
            、 配套可运行Demo与代码示例。
          </p>
        </CardDescription>
        <ScrollArea className="flex-1 overflow-auto rounded-md mt-4">
          <div className="flex flex-col space-y-2 min-h-33">
            {list.map((item: Note, index: number) => (
              // 解决border影响元素高度问题
              <div key={index} className="h-11 relative group">
                <Item className="flex-nowrap border border-gray-200 dark:border-gray-700 group-hover:border-transparent">
                  <ItemContent className="flex-1 min-w-0 flex max-w-md">
                    {/* 文本省略号会受flex、width: fit-content影响 */}
                    <ItemTitle className="block w-auto flex-1 min-w-0 truncate">
                      {item.title}
                    </ItemTitle>
                    {/* <ItemDescription>{item}</ItemDescription> */}
                  </ItemContent>
                  <ItemActions className="group-hover:block hidden shrink-0">
                    <Link
                      href={`/frontend?category_id=${item.category_id}&seconde_id=${item.sub_category_id}&note_id=${item.id}`}
                    >
                      <CircleChevronRight size={20} color="teal" />
                    </Link>
                  </ItemActions>
                </Item>
                <div className="absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent group-hover:border-teal-400 transition-colors" />
              </div>
            ))}
          </div>
        </ScrollArea>
        <p className="mt-8 text-xs text-gray-400">最后更新：2026‑09‑05</p>
      </CardContent>
      <CardFooter className="border-gray-200 dark:border-gray-700">
        <p>
          GitHub：
          <a
            className="text-teal-400 underline decoration-1 decoration-teal-400 italic"
            href="https://github.com/xywihi"
          >
            https://www.github.com/xywhi
          </a>
        </p>
      </CardFooter>
    </GroundGlassCard>
  );
};
