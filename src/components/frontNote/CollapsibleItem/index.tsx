"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, FolderIcon } from "lucide-react";
import { JSX } from "react";

type FileTreeItem =
  | { name: string; id?: string | undefined; parent_id?: string | null }
  | {
      name: string;
      id?: string | undefined;
      parent_id?: string | null;
      children: FileTreeItem[];
    };

export const CollapsibleItem = ({
  curentClickId,
  setCurrentClickId,
  fileItem,
  defaultOpen,
  renderItem,
}: {
  curentClickId: string[] | undefined;
  setCurrentClickId: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  fileItem: FileTreeItem;
  defaultOpen?: boolean;
  renderItem: (fileItem: FileTreeItem, index: number) => JSX.Element;
}) => {
  return (
    <Collapsible
      open={!!curentClickId?.includes(fileItem.id as string) || defaultOpen}
      onOpenChange={(open) => {
        if (fileItem)
          setCurrentClickId((pre) => {
            // console.log(fileItem, "curentClickId", curentClickId, pre);
            if (typeof fileItem.parent_id === "string") {
              if (pre?.includes(fileItem.parent_id)) {
                return open
                  ? [fileItem.parent_id, fileItem.id as string]
                  : [fileItem.parent_id];
              }
            } else {
              return open
                ? [fileItem.parent_id || (fileItem.id as string)]
                : [];
            }
            return pre;
          });
      }}
      key={fileItem.id}
      className="mb-4 group"
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center text-xl mb-4  w-full justify-between transition-none hover:bg-accent hover:text-accent-foreground">
          <div className="flex items-center gap-2 font-bold">
            <FolderIcon />
            {fileItem.name}
          </div>
          {defaultOpen ? (
            <ChevronRight className="rotate-90" />
          ) : (
            <ChevronRight />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mb-2 ml-5 style-lyra:ml-4">
        {
          <div className="flex flex-col gap-1">
            {(fileItem as { children: FileTreeItem[] })?.children.map(
              (child, index) => renderItem(child, index)
            )}
            {!(fileItem as { children: FileTreeItem[] }).children.length && (
              <span className="text-gray-500 text-sm indent-8">
                暂无相关笔记
              </span>
            )}
          </div>
        }
      </CollapsibleContent>
    </Collapsible>
  );
};
