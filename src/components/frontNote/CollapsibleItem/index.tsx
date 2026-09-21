"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, FolderIcon } from "lucide-react";
import { JSX, useState } from "react";

type FileTreeItem =
  | { name: string; id?: string | undefined; parent_id?: string | null }
  | {
      name: string;
      id?: string | undefined;
      parent_id?: string | null;
      children: FileTreeItem[];
    };

export const CollapsibleItem = ({
  fileItem,
  defaultOpen,
  renderItem,
}: {
  fileItem: FileTreeItem;
  defaultOpen?: boolean;
  renderItem: (fileItem: FileTreeItem, index: number) => JSX.Element;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      open={defaultOpen || isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      key={fileItem.id}
      className="border-2 border-gray-300 dark:border-gray-600 rounded-xl mb-4 group bg-white dark:bg-gray-700 drop-shadow-[0_4px_10px_#ddd] hover:drop-shadow-[0_8px_14px_#b4b4b4cc] dark:drop-shadow-[0_4px_10px_#242424] dark:hover:drop-shadow-[0_8px_14px_#434343cc]"
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center  text-xl my-4 px-4  w-full justify-between transition-none hover:bg-accent hover:text-accent-foreground">
          <div className="flex items-center gap-2 font-bold">
            <FolderIcon />
            {fileItem.name}
          </div>
          <ChevronRight
            size={20}
            className="transition-transform group-data-open:rotate-90 shrink-0"
          />
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
