"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { GlobalModel } from "@/components/GlobalModel";
import { Button } from "@/components/ui/button";
import z from "zod";
import { CategorySchema, CategoryTree } from "@/app/utils/api/font-notes/typs";
import { useSearchParams } from "next/navigation";
import { CreativeCommons, FileClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryTree } from "@/app/utils/api/font-notes/requery";
import { EditeNoteForm } from "./EditeNoteForm";
import { QueryKeys } from "@/app/utils/query-keys";
import { SecondeNav } from "./SecondsNav";
import { FirstNav } from "./FirstNav";

type CategoryType = z.infer<typeof CategorySchema>;

export const AsideNav = () => {
  const [editable, setEditable] = useState(false);
  const [currentRootCategory, setCurrentRootCategory] =
    useState<CategoryType>();
  const searchParams = useSearchParams();
  const category_id = searchParams.get("category_id");
  const seconde_id = searchParams.get("seconde_id");

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
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const root = (() => {
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
  })();

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

  return (
    ((root_category as CategoryTree)?.root || rooting) && (
      <aside className="w-1/5 h-[calc(100vh-10rem)] bg-black rounded-2xl p-4 group/root">
        <div className="absolute top-20 -right-39">
          {/* 一级菜单导航 */}
          <FirstNav
            setCurrentRootCategory={setCurrentRootCategory}
            rootCategory={root_category as CategoryTree}
            root={root}
          />
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
            <SecondeNav
              secondes={secondes}
              secondeId={seconde_id}
              categoryId={category_id}
            />
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
              {/* 用户头像信息 */}
              {/* <Avatar>
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar> */}
              <div className="flex items-center gap-2">
                <FileClock size={20} /> <span>2026-09-01</span>
              </div>
            </CardFooter>
            {/* 编辑笔记 */}
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
