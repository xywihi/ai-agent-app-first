import { CategoryItem } from "@/app/utils/api/font-notes/typs";
import { FileIcon } from "lucide-react";
import { CollapsibleItem } from "../CollapsibleItem";
import { cn } from "@/app/utils/tools";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const [currentId, setCurrentId] = useState<string | undefined>(
    pathname.split("/")[2]
  );
  const getUrl = (id: string, parent_id: string) => {
    const _searchParams = new URLSearchParams();
    _searchParams.set("category_id", categoryId || "");
    _searchParams.set("seconde_id", parent_id || "");
    // searchParams.set("note_id", fileItem.id || "");
    const url = `/frontend/${id}?${_searchParams.toString()}`;
    return url;
  };

  const renderItem = (fileItem: FileTreeItem, index: number) => {
    if ("children" in fileItem) {
      return (
        <CollapsibleItem
          fileItem={fileItem}
          defaultOpen={fileItem.id === secondeId}
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
        <span
          className={cn("hover:underline truncate", {
            "underline text-teal-500 font-bold": currentId === fileItem.id,
          })}
          onClick={() => {
            setCurrentId(fileItem.id);
            router.push(getUrl(fileItem.id || "", fileItem.parent_id || ""));
          }}
        >
          {fileItem.name}
        </span>
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
