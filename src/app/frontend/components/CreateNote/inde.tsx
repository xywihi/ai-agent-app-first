"use client";
import { CategoryTree, Note } from "@/app/utils/api/font-notes/typs";
import { ToTop } from "@/components/ToTop";

export function CreateNote({
  rootCategory,
  id,
  data,
}: {
  rootCategory: CategoryTree;
  id?: string;
  data?: Note;
}) {
  return (
    <div className="fixed bottom-11 right-4 xl:right-8 z-50 flex items-center gap-4">
      {/* <Tooltip disableHoverablePopup>
        <TooltipTrigger
          className={cn(
            "hidden md:block bg-white border border-gray-400 cursor-pointer shadow-xl hover:bg-teal-400 dark:bg-teal-600 font-bold py-2 px-4 rounded-full",
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
      </Tooltip> */}
      <ToTop />
      {/* {editable && (
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
      )} */}
    </div>
  );
}
