import { ChatMarkDown } from "@/components/ChatMarkDown";
import { CreateNote } from "../components/CreateNote/inde";
import { CalendarRange, Eye } from "lucide-react";
import { NoteAsideNav } from "@/components/frontNote/NoteAsideNav";
import { cn, getDateTime } from "@/app/utils/tools";
import { getCategoryTree } from "@/lib/data/notes/categories";
import { getNote } from "@/lib/data/notes/detail";
import { recordNoteVisit } from "@/lib/data/notes/visit";
import { getFrontNotes } from "@/lib/data/notes";

// frontend/[id]/page.tsx

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  // 请求数据库获取当前作品
  const work = await getNote(id as string);
  return {
    title: work?.title ?? "笔记详情",
    description: work?.description ?? "实用的前端笔记",
  };
}
export async function generateStaticParams() {
  const notes = await getFrontNotes();
  return notes?.list.map((n) => ({ id: n.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  const [root_category, note_data] = await Promise.all([
    getCategoryTree(),
    getNote(id as string),
    id && recordNoteVisit(id as string),
  ]);
  const updateTime = getDateTime(note_data?.updated_at || 0);
  return (
    <div className="">
      <NoteAsideNav note_id={id as string} />
      <article className="pb-28 xl:p-0">
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
      </article>
      <CreateNote rootCategory={root_category} id={id} data={note_data} />
    </div>
  );
}
