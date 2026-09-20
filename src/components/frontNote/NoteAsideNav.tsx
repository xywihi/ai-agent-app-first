"use client";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/app/utils/tools";
import { useToc } from "@/hooks/uese-toc";
import { useCallback, useEffect, useState } from "react";

export const NoteAsideNav = ({ note_id }: { note_id: string }) => {
  const [activeId, setActiveId] = useState<string>("");
  const tocList = useToc("#article-wrapper", note_id as string).filter(
    (item) => item.level < 3
  );
  const handleClick = useCallback((id: string) => {
    // 更新地址栏hash，不触发页面刷新
    window.history.pushState(null, "", `#${id}`);
    // 查找元素滚动
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const nodeList = Array.from(document.querySelectorAll("h1, h2"));
      const headings: HTMLElement[] = [];
      nodeList.forEach((el) => {
        if (el instanceof HTMLElement) {
          headings.push(el);
        }
      });
      const scrollY = window.scrollY + 160;
      let current = "";
      for (const item of headings) {
        if (item.offsetTop <= scrollY) {
          current = item.id;
        } else {
          break;
        }
      }
      setActiveId(current);
      // const currentHeading = headings.find((heading) => {
      //   const headingRect = heading.getBoundingClientRect();
      //   return scrollY >= headingRect.top && scrollY < headingRect.bottom;
      // });
      // if (currentHeading) {
      //   setActiveId(currentHeading.id);
      // }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <aside className="fixed right-4 bottom-40">
      <ScrollArea className="max-h-[45vh]">
        <nav>
          {tocList.map((item) => {
            return (
              <Tooltip key={item.id}>
                <div className="group/tooltip">
                  <TooltipTrigger className="w-10 h-6 flex justify-center items-center rounded-full cursor-pointer">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600",
                        {
                          "bg-teal-400 dark:bg-teal-600 w-3 h-3":
                            activeId === item.id,
                        }
                      )}
                      onClick={() => handleClick(item.id)}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={2}
                    side="left"
                    className="dark:bg-gray-700"
                  >
                    <Link
                      href={`#${item.id}`}
                      key={item.id}
                      scroll={false}
                      className={cn(
                        `block text-right text-xs hover:bg-accent hover:text-accent-foreground text-white max-w-40 truncate`,
                        {
                          hidden: item.level === 3,
                          "text-teal-400 font-medium": activeId === item.id,
                        }
                      )}
                      onClick={() => handleClick(item.id)}
                    >
                      {item.title}
                    </Link>
                  </TooltipContent>
                  <div
                    className={cn(
                      "absolute hidden -mt-6.5 right-10 z-9999 items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background",
                      {
                        "inline-flex": activeId === item.id,
                        // "group-hover/tooltip:hidden": activeId !== item.id,
                      }
                    )}
                  >
                    <div className="relative">
                      <div className="max-w-40 truncate">{item.title}</div>
                      <div className="absolute right-0 top-1/2 z-50 size-2.5 -translate-y-[calc(50%)] translate-x-[calc(100%+5px)] rotate-45 rounded-xs bg-foreground fill-foreground"></div>
                    </div>
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
};
