import { ChatMarkDown } from "@/components/ChatMarkDown";
import { cn, getDateTime } from "@/app/utils/tools";
import { CalendarRange, Eye, Notebook } from "lucide-react";
import { NoteAsideNav } from "@/components/frontNote/NoteAsideNav";
import { CreateNote } from "./components/CreateNote/inde";
import { getCategoryTree } from "@/lib/data/notes/categories";
import { getNote } from "@/lib/data/notes/detail";
import { recordNoteVisit } from "@/lib/data/notes/visit";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ note_id?: string }>;
}) {
  const { note_id } = await searchParams;
  const [root_category, note_data] = await Promise.all([
    getCategoryTree(),
    getNote(note_id as string),
    note_id && recordNoteVisit(note_id as string),
  ]);

  const isPending = note_data === undefined;
  const updateTime = getDateTime(note_data?.updated_at || 0);

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
        <div className="flex-1 text-center h-full flex flex-col justify-center items-center xl:text-xl text-gray-400">
          笔记正在努力加载中...
        </div>
      )}
      <NoteAsideNav note_id={note_id as string} />
      <section className="pb-28 xl:p-0">
        <div className="prose prose-slate max-w-none">
          <div className={cn("gap-4 hidden", { flex: updateTime })}>
            <p className="text-gray-400 my-4 flex items-center">
              <span className="xl:inline-block hidden">更新时间：</span>
              <span className="inline-block xl:hidden mr-2">
                <CalendarRange size={14} />
              </span>
              {updateTime}
            </p>
            <p className="text-gray-400 my-4 flex items-center">
              <span className="xl:inline-block hidden">笔记阅览次数：</span>
              <span className="inline-block xl:hidden mr-2">
                <Eye size={14} />
              </span>
              {note_data?.view_count}
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
      <CreateNote rootCategory={root_category} id={note_id} data={note_data} />
    </div>
  );
}
