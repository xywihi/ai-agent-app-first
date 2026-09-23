"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryTree, Note } from "@/app/utils/api/font-notes/typs";
import { ToTop } from "@/components/ToTop";
import { GlobalModel } from "@/components/GlobalModel";
import { EditeNoteForm } from "@/components/frontNote/EditeNoteForm";
import { useState } from "react";
import { cn } from "@/app/utils/tools";

export function CreateNote({
  rootCategory,
  id,
  data,
}: {
  rootCategory: CategoryTree;
  id?: string;
  data?: Note;
}) {
  const [editable, setEditable] = useState(false);
  return (
    <div className="fixed bottom-11 right-4 xl:right-8 z-50 flex items-center gap-4">
      <Tooltip disableHoverablePopup>
        <TooltipTrigger
          className={cn(
            "bg-white border border-gray-400 cursor-pointer shadow-xl hover:bg-teal-400 dark:bg-teal-600 font-bold py-2 px-4 rounded-full",
            {
              hidden: !id,
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
                root_category={rootCategory}
                setEditable={setEditable}
                note_data={data}
              />
            </CardContent>
          </Card>
        </GlobalModel>
      )}
    </div>
  );
}
