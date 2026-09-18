"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatMarkDown } from "@/components/ChatMarkDown";
import { ToTop } from "@/components/ToTop";
import { cn } from "@/app/utils/tools";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getCategoryTree,
  getNote,
  recordNoteVisit,
} from "@/app/utils/api/font-notes/requery";
import { CategoryTree } from "@/app/utils/api/font-notes/typs";
import { Edit, Notebook } from "lucide-react";
import { GlobalModel } from "@/components/GlobalModel";
import { Card, CardContent } from "@/components/ui/card";
import { EditeNoteForm } from "@/components/frontNote/EditeNoteForm";
import { useTime } from "@/hooks/use-time";
import { NoteAsideNav } from "@/components/frontNote/NoteAsideNav";
import { QueryKeys } from "../utils/query-keys";
export default function Page({ children }: { children: React.ReactNode }) {
  const [editable, setEditable] = useState(false);
  const note_id = useSearchParams().get("note_id");
  const [updateTime, setUpdateTime] = useTime();

  // 处理用户浏览笔记记录
  const { data: data2 = [] } = useQuery({
    queryKey: QueryKeys.fronend.visit,
    // enabled: !userId,
    queryFn: async () => {
      try {
        if (!note_id) return null;
        const data = await recordNoteVisit(note_id as string);
        return data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { data: root_category = {}, isPending: rooting } = useQuery({
    queryKey: QueryKeys.fronend.rootCategories(),
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
    queryKey: QueryKeys.fronend.note(note_id as string),
    // enabled: !!note_id,
    queryFn: async () => {
      try {
        if (!note_id) return null;
        const data = await getNote(note_id as string);
        return data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // 更新笔记更新时间
    if (!note_data) return;
    setUpdateTime(note_data.updated_at);
  }, [setUpdateTime, note_data]);

  return (
    <div className="flex-1 flex flex-col min-h-screen gap-4">
      {!note_data && !isPending && (
        <div className="flex-1 text-center flex flex-col justify-center items-center text-2xl">
          <Notebook size={64} className="mb-4 text-gray-400 " />
          <p className="text-gray-300 pb-20">
            {" "}
            请选择左侧笔记目录查看指定笔记！
          </p>
        </div>
      )}
      {isPending && (
        <div className="flex-1 text-center h-full flex flex-col justify-center items-center text-xl">
          笔记正在努力加载中...
        </div>
      )}
      <NoteAsideNav note_id={note_id as string} />
      <section>
        <div className="prose prose-slate max-w-none">
          <div className={cn("gap-4 hidden", { flex: updateTime })}>
            <p className="text-gray-400 my-4">更新时间：{updateTime}</p>
            <p className="text-gray-400 my-4">
              笔记阅览次数：{note_data?.view_count}
            </p>
          </div>
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
            className={cn(
              "bg-white dark:bg-gray-700 border border-gray-400 cursor-pointer shadow-xl hover:bg-teal-400 dark:bg-teal-600 font-bold py-2 px-4 rounded-full",
              {
                hidden: !note_id,
              }
            )}
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
          <GlobalModel>
            <Card className="bg-white dark:bg-gray-700 w-full self-center">
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
