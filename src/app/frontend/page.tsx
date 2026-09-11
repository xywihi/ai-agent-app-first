"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChatMarkDown } from "@/components/ChatMarkDown";
import { ToTop } from "@/components/ToTop";
import { useToc } from "@/hooks/uese-toc";
import Link from "next/link";
import { cn } from "@/app/utils/tools";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategoryTree, getNote } from "@/app/utils/api/font-notes/requery";
import { CategoryTree, Note } from "@/app/utils/api/font-notes/typs";
import { Edit, Notebook } from "lucide-react";
import { GlobalModel } from "@/components/GlobalModel";
import { Card, CardContent } from "@/components/ui/card";
import { EditeNoteForm } from "@/components/frontNote/EditeNoteForm";
export default function Page({ children }: { children: React.ReactNode }) {
  const tocList = useToc("#article-wrapper").filter((item) => item.level < 3);
  const [activeId, setActiveId] = useState<string>("");
  const [editable, setEditable] = useState(false);
  const note_id = useSearchParams().get("note_id");
  // 处理用户浏览笔记记录
  // const { data: data2 = [], isPending } = useQuery({
  //   queryKey: ["fontendNoteVisit"],
  //   // enabled: !userId,
  //   queryFn: async () => {
  //     try {
  //       const data = await recordNoteVisit("0");
  //       return data;
  //     } catch (error) {
  //       console.log("error", error);
  //       return [];
  //     }
  //   },
  //   staleTime: Infinity,
  //   refetchOnWindowFocus: false,
  // });
  const { data: root_category = {}, isPending: rooting } = useQuery({
    queryKey: ["fontendNoteRootCategories"],
    // enabled: !!category_id,
    queryFn: async () => {
      try {
        const data: CategoryTree = await getCategoryTree();
        return data;
      } catch (error) {
        console.log("error", error);
        return {};
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  // 获取笔记请求
  const { data: note_data, isPending } = useQuery({
    queryKey: ["fontendNote", note_id],
    enabled: !!note_id,

    queryFn: async () => {
      try {
        if (note_id === undefined) return [];

        const data = await getNote(note_id as string);
        return data;
      } catch (error) {
        console.log("error", error);
        return [];
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
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

  return (
    <div className="flex-1 flex flex-col min-h-screen gap-4">
      {!note_data && (
        <div className="flex-1 text-center flex flex-col justify-center items-center text-2xl">
          <Notebook size={64} className="mb-4 text-gray-400 " />
          <p className="text-gray-300 pb-20">
            {" "}
            请选择左侧笔记目录查看指定笔记！
          </p>
        </div>
      )}
      <aside className="fixed right-4 bottom-40">
        <ScrollArea className="max-h-[45vh]">
          <nav>
            {tocList.map((item) => {
              return (
                <Tooltip key={item.id}>
                  <div className="group/tooltip">
                    <TooltipTrigger className="w-10 h-6 flex justify-center items-center bg-white rounded-full cursor-pointer">
                      <div
                        className={cn("w-2 h-2 rounded-full bg-gray-300", {
                          "bg-teal-400 w-3 h-3": activeId === item.id,
                        })}
                        onClick={() => handleClick(item.id)}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={2} side="left">
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
      <section>
        {isPending && (
          <div className="flex-1 text-center flex flex-col justify-center items-center text-2xl">
            笔记正在努力加载中...
          </div>
        )}
        <div className="prose prose-slate max-w-none">
          <ChatMarkDown
            content={note_data?.content
              .replaceAll("\\n", "\n")
              .replaceAll("\t", "")}
            languageType="JavaScript"
          />
        </div>
      </section>
      <div className="fixed bottom-28 right-8 z-50 flex items-center gap-4">
        <Tooltip disableHoverablePopup>
          <TooltipTrigger
            className="bg-white border border-gray-400 cursor-pointer shadow-xl hover:bg-teal-400 font-bold py-2 px-4 rounded-full"
            onClick={() => setEditable(true)}
          >
            <Edit size={24} />
          </TooltipTrigger>
          <TooltipContent sideOffset={2} side="left">
            编辑该笔记
          </TooltipContent>
        </Tooltip>
        <ToTop />
        {editable && (
          <GlobalModel handleShowModel={() => setEditable(false)}>
            <Card className="bg-white w-full self-center">
              <CardContent>
                <EditeNoteForm
                  root_category={root_category as CategoryTree}
                  setEditable={setEditable}
                  note_data={note_data}
                />
              </CardContent>
            </Card>
          </GlobalModel>
        )}
      </div>
    </div>
  );
}
