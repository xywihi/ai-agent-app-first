"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { JSX, Suspense, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { GlobalModel } from "@/components/GlobalModel";
import { Button } from "@/components/ui/button";
import { cn } from "@/app/utils/tools";
import z from "zod";
import {
  CategoryItem,
  CategorySchema,
  CategoryTree,
} from "@/app/utils/api/font-notes/typs";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
  CreativeCommons,
  FileIcon,
  FolderIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryTree } from "@/app/utils/api/font-notes/requery";
import { EditeNoteForm } from "./EditeNoteForm";
import { QueryKeys } from "@/app/utils/query-keys";

type FileTreeItem =
  | { name: string; id?: string | undefined; parent_id?: string | null }
  | {
      name: string;
      id?: string | undefined;
      parent_id?: string | null;
      children: FileTreeItem[];
    };
type CategoryType = z.infer<typeof CategorySchema>;

export const AsideNav = () => {
  const [editable, setEditable] = useState(false);
  const [currentRootCategory, setCurrentRootCategory] =
    useState<CategoryType>();
  const router = useRouter();
  const note_id = useSearchParams().get("note_id");
  const category_id = useSearchParams().get("category_id");
  const seconde_id = useSearchParams().get("seconde_id");

  const { data: root_category = {}, isPending: rooting } = useQuery({
    queryKey: QueryKeys.fronend.rootCategories(),
    // enabled: !category_id,
    queryFn: async () => {
      try {
        const data: CategoryTree = await getCategoryTree();

        return data;
      } catch (error) {
        console.log("error", error);
        return {};
      }
    },
    // 请求结束

    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const root = useMemo(() => {
    if (!(root_category as CategoryTree)?.root) return null;
    const _root = (root_category as CategoryTree).root?.find((item) => {
      if (currentRootCategory?.id) {
        if (item.id === currentRootCategory?.id) {
          return item;
        }
        return;
      }
      if (item.id === category_id) {
        return item;
      }
    });
    return _root ?? (root_category as CategoryTree)?.root[0];
  }, [root_category, category_id, currentRootCategory]);

  const secondes = useMemo(() => {
    if (!(root_category as CategoryTree)?.seconde) return null;
    const _secondes = (root_category as CategoryTree)?.seconde.filter(
      (item) => {
        if (currentRootCategory?.id) {
          if (item.parent_id === currentRootCategory?.id) {
            return item;
          }
          return;
        }
        if (item.id === seconde_id) {
          return item;
        }
        if (item.parent_id === root?.id) {
          return item;
        }
      }
    );
    return _secondes;
  }, [root_category, seconde_id, currentRootCategory, root]);

  // useEffect(() => {
  //   if (!(root_category as CategoryTree).seconde) return;

  //   // const timer = setTimeout(() => {
  //   //   // setSecondCategories(_seconde);
  //   //   if (!currentRootCategory) {
  //   //     const firstRoot = (root_category as CategoryTree)?.root[0];
  //   //     setCurrentRootCategory(firstRoot);
  //   //   }
  //   // }, 0);
  //   return () => {
  //     // clearTimeout(timer);
  //   };
  // }, [currentRootCategory, root_category]);
  const renderItem = (fileItem: FileTreeItem, index: number) => {
    if ("children" in fileItem) {
      return (
        <CollapsibleItem
          fileItem={fileItem}
          defaultOpen={fileItem.id === seconde_id}
          renderItem={renderItem}
          key={index}
        />
      );
    }
    return (
      <Button
        key={index}
        variant="link"
        size="sm"
        className="w-full my-2 text-md justify-start gap-2 text-foreground"
        onClick={() => {
          // setCurrentNote(fileItem.name);
          // if (!category_id) return;
          const searchParams = new URLSearchParams();
          searchParams.set("category_id", root?.id || "");
          searchParams.set("seconde_id", fileItem?.parent_id || "");
          searchParams.set("note_id", fileItem.id || "");
          const url = `/frontend?${searchParams.toString()}`;
          router.push(url);
        }}
      >
        <FileIcon />
        <span
          className={cn("hover:underline truncate", {
            "underline text-teal-500 font-bold": note_id === fileItem.id,
          })}
        >
          {fileItem.name}
        </span>
      </Button>
    );
  };
  return (
    ((root_category as CategoryTree)?.root || rooting) && (
      <aside className="w-1/5 h-[calc(100vh-10rem)] sticky top-22 min-w-80  bg-black rounded-2xl p-4 group/root">
        <div className="absolute top-20 -right-39 flex flex-col items-end space-y-4">
          {/* 一级菜单导航 */}
          {(root_category as CategoryTree)?.root?.map((item, index) => (
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
                <div
                  className={cn(
                    "inline-block h-full w-0 group-hover:w-6 transition-width duration-300"
                  )}
                ></div>
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
              <div className="inline-block h-full w-10 group-hover:w-0 transition-all duration-300"></div>
            </Button>
          ))}
        </div>
        <div className="w-full h-full overflow-auto bg-white dark:bg-gray-700 absolute shadow-2xl rounded-2xl top-0 left-0 z-10 flex flex-col">
          {rooting && (
            <div className="h-full w-full flex flex-col justify-center items-center">
              笔记目录加载中...
            </div>
          )}
          <h1 className="text-2xl font-bold p-6 bg-white dark:bg-gray-700 sticky top-0">
            {root?.name}
          </h1>
          {/* 二级菜单导航 */}
          <div className="flex-1 flex flex-col gap-1 px-6">
            {secondes &&
              (secondes as CategoryItem[])?.map((item: CategoryItem, index) =>
                renderItem(item, index)
              )}
          </div>
          <div className="bg-white dark:bg-gray-700 w-full sticky bottom-0 flex flex-col gap-4">
            <div className="p-6">
              <Button
                size="lg"
                className="bg-teal-400 dark:bg-teal-600 w-full py-4 h-12 text-white text-md font-bold cursor-pointer hover:bg-teal-500 hover:shadow-2xl hover:transform hover:-translate-y-1"
                onClick={() => setEditable(true)}
              >
                <CreativeCommons size={20} />
                新建笔记
              </Button>
            </div>
            <CardFooter className="border-t-gray-200 dark:border-t-gray-800 text-gray-500 p-6">
              更新时间：2026-09-01
            </CardFooter>
            {editable && (
              <GlobalModel>
                <Card className="bg-white dark:bg-gray-700 w-full self-center">
                  <CardContent>
                    <EditeNoteForm
                      root_category={root_category as CategoryTree}
                      setEditable={setEditable}
                    />
                  </CardContent>
                </Card>
              </GlobalModel>
            )}
          </div>
        </div>
      </aside>
    )
  );
};

const CollapsibleItem = ({
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
