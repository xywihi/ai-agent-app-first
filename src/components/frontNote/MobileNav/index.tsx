import { CategoryItem, Note } from "@/app/utils/api/font-notes/typs";
import { FileIcon } from "lucide-react";
import { CollapsibleItem } from "../CollapsibleItem";
import { cn } from "@/app/utils/tools";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { QueryKeys } from "@/app/utils/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getNote } from "@/app/utils/api/font-notes/requery";
import Link from "next/link";

type FileTreeItem =
  | { name: string; id?: string | undefined; parent_id?: string | null }
  | {
      name: string;
      id?: string | undefined;
      parent_id?: string | null;
      children: FileTreeItem[];
    };

export const MobileNav = ({
  secondes,
}: {
  secondes: CategoryItem[] | null;
}) => {
  const { id } = useParams();
  const [cuurentClickId, setCurrentClickId] = useState<string[] | undefined>();
  const { data: note, isPending: noting } = useQuery({
    queryKey: QueryKeys.fronend.note(id as string),
    // enabled: !category_id,
    queryFn: async () => {
      try {
        const data: Note = await getNote(id as string);

        return data;
      } catch (error) {
        console.log("error", error);
        return {};
      }
    },
    // 请求结束
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (note && (note as Note)?.sub_category_id) {
        setCurrentClickId([
          (note as Note).category_id,
          (note as Note).sub_category_id,
          id as string,
        ]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [note, id]);
  const renderItem = (fileItem: FileTreeItem, index: number) => {
    if ("children" in fileItem) {
      return (
        <CollapsibleItem
          cuurentClickId={cuurentClickId}
          setCurrentClickId={setCurrentClickId}
          fileItem={fileItem}
          defaultOpen={!!cuurentClickId?.includes(fileItem.id as string)}
          renderItem={renderItem}
          key={index}
        />
      );
    }
    return (
      <Button
        key={index}
        className="w-full my-2 flex text-md justify-start gap-2 text-foreground"
      >
        <FileIcon />
        <Link
          href={`/frontend/${fileItem.id}`}
          className={cn("hover:underline truncate", {
            "underline text-teal-500 font-bold": id === fileItem.id,
          })}
        >
          {fileItem.name}
        </Link>
      </Button>
    );
  };
  return (
    <div>
      {secondes &&
        (secondes as CategoryItem[])?.map((item: CategoryItem, index) =>
          renderItem(item, index)
        )}
    </div>
  );
};
