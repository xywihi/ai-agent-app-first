"use client";
import { getCategoryTree } from "@/app/utils/api/font-notes/requery";
import { CategoryTree, Note } from "@/app/utils/api/font-notes/typs";
import { getTime } from "@/app/utils/tools";
import { EditeNoteForm } from "@/components/frontNote/EditeNoteForm";
import { GlobalModel } from "@/components/GlobalModel";
import { Button } from "@/components/ui/button";
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

export default function Frontend() {
  const { data, isPending } = useQuery({
    queryKey: ["frontend"],
    queryFn: async () => {
      const _data = await fetch(`/api/user/frontend`);
      const data = await _data.json();
      return data.data;
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
            <div className="grid grid-cols-4 gap-4">
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
  console.log("data", data);
  return (
    <div>
      {isPending ? (
        <div className="flex-1 text-center h-[calc(100vh-10rem)] flex flex-col justify-center items-center text-xl">
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
  const handleToSee = () => {
    router.push(
      `/frontend?category_id=${note.category_id}&seconde_id=${note.sub_category_id}&note_id=${note.id}`
    );
  };
  const handleToDelete = (id: string) => {
    const res = confirm("确定删除吗?");
    if (res) {
      fetch(`/api/user/frontend/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.status === 200) {
          alert("删除成功");
        }
      });
    }
  };
  return (
    <div
      className="p-4 bg-white rounded-2xl shadow-xl transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
      onClick={handleToSee}
    >
      <p className="font-bold text-lg mb-2 truncate">{note.title}</p>
      <span className="bg-gray-100 text-gray-400 rounded-xl px-2 py-1 inline-block text-xs mb-4 truncate">
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
            className="flex-1 rounded hover:bg-gray-100 py-2 cursor-pointer"
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
            className="flex-1 rounded hover:bg-gray-100 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEditable(true);
            }}
          >
            <div className="border-gray-300 flex justify-center">
              <Edit size={14} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>编辑笔记</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            className="flex-1 rounded hover:bg-gray-100 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleToDelete(note.id as string);
            }}
          >
            <div className="border-gray-300 flex justify-center">
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
          <Card className="bg-white w-full self-center">
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
