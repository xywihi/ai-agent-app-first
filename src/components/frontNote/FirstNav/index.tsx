import { CategoryTree, Root } from "@/app/utils/api/font-notes/typs";
import { cn } from "@/app/utils/tools";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const FirstNav = ({
  setCurrentRootCategory,
  rootCategory,
  root,
}: {
  setCurrentRootCategory: (item: Root) => void;
  rootCategory: CategoryTree;
  root: Root | null;
}) => {
  return (
    <div className="flex flex-col items-end space-y-4">
      {(rootCategory as CategoryTree)?.root?.map((item, index) => (
        <Button
          key={index}
          className="w-40 h-12 p-0 group flex flex-row gap-0 items-start justify-start font-bold text-md hover:text-lg"
          // style={{ writingMode: "vertical-rl" }}
          onClick={() => {
            setCurrentRootCategory(item);
          }}
        >
          <div
            className={cn(
              "flex flex-row items-center gap-2 rounded-r-2xl bg-white dark:bg-gray-700 shadow-2xl group-hover:bg-amber-200 dark:group-hover:bg-amber-700",
              {
                "bg-amber-200 dark:bg-amber-700": root?.id === item.id,
              }
            )}
          >
            {/* left */}
            <div
              className={cn(
                "inline-block h-full w-0 group-hover:w-6 transition-width duration-300"
              )}
            ></div>
            {/* center */}
            <div
              className={cn(
                "rounded-r-xl h-full text-left w-fit pr-4 group-hover/root:pl-2 leading-11.5 flex items-center"
              )}
            >
              <span
                className={cn(
                  "absolute opacity-0 group-hover/root:relative group-hover/root:opacity-100 transition-opacity duration-0 group-hover/root:duration-400"
                )}
              >
                {item.name}
              </span>
              <div className="ml-2 h-11.5 flex items-center">
                {item?.icon_name && (
                  <Suspense>
                    <Icon
                      name={
                        item.icon_name as Parameters<typeof Icon>[0]["name"]
                      }
                    />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
          {/* right */}
          <div className="inline-block h-full w-10 group-hover:w-0 transition-all duration-300"></div>
        </Button>
      ))}
    </div>
  );
};
