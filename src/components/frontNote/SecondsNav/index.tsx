import { CategoryItem } from "@/app/utils/api/font-notes/typs";
import { FileIcon } from "lucide-react";
import { CollapsibleItem } from "../CollapsibleItem";
import { cn } from "@/app/utils/tools";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";

type FileTreeItem =
  | { name: string; id?: string | undefined; parent_id?: string | null }
  | {
      name: string;
      id?: string | undefined;
      parent_id?: string | null;
      children: FileTreeItem[];
    };

export const SecondeNav = ({
  secondes,
  secondeId,
  categoryId,
}: {
  secondes: CategoryItem[] | null;
  secondeId: string | null;
  categoryId: string | null;
}) => {
  const { id } = useParams();
  const [curentClickId, setCurrentClickId] = useState<string[] | undefined>();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (categoryId && secondeId && id) {
        setCurrentClickId([categoryId, secondeId, id as string]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [secondeId, categoryId, id]);
  const renderItem = (fileItem: FileTreeItem, index: number) => {
    if ("children" in fileItem) {
      return (
        <CollapsibleItem
          curentClickId={curentClickId}
          setCurrentClickId={setCurrentClickId}
          fileItem={fileItem}
          defaultOpen={!!curentClickId?.includes(fileItem.id as string)}
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
