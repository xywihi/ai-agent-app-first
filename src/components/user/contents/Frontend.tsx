"use client";
import { getCategoryTree } from "@/app/utils/api/font-notes/requery";
import { CategoryTree, Note } from "@/app/utils/api/font-notes/typs";
import { Delete, Get } from "@/app/utils/query";
import { QueryKeys } from "@/app/utils/query-keys";
import { getTime } from "@/app/utils/tools";
import { EditeNoteForm } from "@/components/frontNote/EditeNoteForm";
import { GlobalModel } from "@/components/GlobalModel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { BookSearch, Calendar, Edit, Eye, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Frontend() {
  const { data, isPending } = useQuery({
    queryKey: QueryKeys.fronend.notesAll,
    queryFn: async () => {
      const data = await Get(`/api/user/frontend`);
      return data;
    },
  });

  const data_update = useMemo(() => {
    const _data: React.JSX.Element[] = [];
    if (!data) return null;
    for (const key in data) {
      const items = data[key];
      if (typeof items === "object")
        _data.push(
          <div key={key}>
            <p className="font-bold text-4xl text-gray-400 mb-4">{key}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {items &&
                items?.map((_item: Note) => (
                  <NoteItem key={_item.id} note={_item} />
                ))}
            </div>
          </div>
        );
    }
    return _data;
  }, [data]);
  return (
    <div>
      {isPending ? (
        <div className="flex-1 text-center h-[calc(100vh-10rem)] flex flex-col justify-center items-center xl:text-xl text-gray-400">
          笔记正在努力加载中...
        </div>
      ) : (
        data_update
      )}
    </div>
  );
}

const NoteItem = memo(function NoteItem({ note }: { note: Note }) {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
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
  const handleToSee = () => {
    router.push(
      `/frontend/${note.id}?category_id=${note.category_id}&seconde_id=${note.sub_category_id}`
    );
  };
  const handleToDelete = async (id: string) => {
    const res = confirm("确定删除吗?");
    if (res) {
      const res = await Delete(`/api/user/frontend/${id}`);
      if (res.status === 200) {
        toast.success("删除成功", {
          position: "top-center",
          style: {
            backgroundColor: "#00d5be",
            borderRadius: "8px",
          },
        });
      }
    }
  };
  return (
    <div
      className="p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-xl transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
      onClick={handleToSee}
    >
      <p className="font-bold text-lg mb-2 truncate">{note.title}</p>
      <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl px-2 py-1 inline-block text-xs mb-4 truncate">
        {note.note_categories?.name}
      </span>
      <div className="flex justify-between">
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <Calendar size={14} />
          {note.updated_at && getTime(note.updated_at)}
        </p>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <Eye size={14} />
          {note.view_count}
        </p>
      </div>
      <div className="flex justify-between space-x-2 mt-4">
        <Tooltip>
          <TooltipTrigger
            className="flex-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-600 py-2 cursor-pointer"
            onClick={handleToSee}
          >
            <div className="flex justify-center">
              <BookSearch size={14} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>查看笔记</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            className="flex-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-600 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEditable(true);
            }}
          >
            <div className="border-gray-300 dark:border-gray-600 flex justify-center">
              <Edit size={14} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>编辑笔记</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            className="flex-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-600 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleToDelete(note.id as string);
            }}
          >
            <div className="border-gray-300 dark:border-gray-600 flex justify-center">
              <Trash size={14} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>删除笔记</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {editable && (
        <GlobalModel>
          <Card className="bg-white dark:bg-gray-700 w-full self-center">
            <CardContent>
              <EditeNoteForm
                root_category={root_category as CategoryTree}
                note_data={note}
                setEditable={setEditable}
              />
            </CardContent>
          </Card>
        </GlobalModel>
      )}
    </div>
  );
});
