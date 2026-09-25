"use client";
import { CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CategoryItem } from "@/app/utils/api/font-notes/typs";
import { ChevronLeft, ChevronRight, FileClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMCategoryTree } from "@/app/utils/api/font-notes/requery";
import { QueryKeys } from "@/app/utils/query-keys";
import { cn } from "@/app/utils/tools";
import { MobileNav } from "./MobileNav";
import { ScrollArea } from "../ui/scroll-area";
import { useParams } from "next/navigation";

export const MobileAsideNav = () => {
  const { id, userId } = useParams();
  const [openAsideNav, setOpenAsideNav] = useState(false);
  const { data: category = [], isPending: rooting } = useQuery({
    queryKey: QueryKeys.fronend.mobileCategories(),
    enabled: !!userId,
    queryFn: async () => {
      try {
        const data: CategoryItem[] = await getMCategoryTree(userId as string);
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
      setOpenAsideNav(false);
    });
    return () => {
      clearTimeout(timer);
    };
  }, [id]);
  return (
    ((category as CategoryItem[]) || rooting) && (
      <div
        className={cn(
          "fixed top-22 z-9999 transform -translate-x-82 xl:block hover:translate-x-0 transition-transform duration-500",
          {
            "translate-x-0": openAsideNav,
          }
        )}
      >
        <div className="ml-4 min-w-80 relative">
          <div
            className="absolute pl-11.5 w-18 px-2 py-2 rounded-full right-0 top-1/2 transform translate-x-1/3 -translate-y-1/2 bg-white dark:bg-gray-900 drop-shadow-[4px_0px_12px_#ccc] dark:drop-shadow-[4px_0_12px_#4b4b4b]"
            onClick={() => {
              setOpenAsideNav((pre) => !pre);
            }}
          >
            {openAsideNav ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          <aside className="w-1/5 h-[calc(100vh-7rem)] bg-black rounded-2xl p-4 group/root">
            <div className="w-full h-full py-5 overflow-auto bg-white dark:bg-gray-700 absolute shadow-2xl rounded-2xl top-0 left-0 z-10 flex flex-col">
              {rooting && (
                <div className="h-full w-full flex flex-col justify-center items-center">
                  笔记目录加载中...
                </div>
              )}
              {/* <h1 className="text-2xl font-bold p-6 bg-white dark:bg-gray-700 sticky top-0">
                {root?.name}
              </h1> */}
              <ScrollArea className="flex-1 flex flex-col gap-1 px-6 overflow-auto">
                <MobileNav secondes={category as CategoryItem[]} />
              </ScrollArea>
              <div className="bg-white dark:bg-gray-700 w-full sticky bottom-0 flex flex-col gap-4">
                <CardFooter className="border-t-gray-200 dark:border-t-gray-800 text-gray-500 p-4">
                  {/* 用户头像信息 */}
                  {/* <Avatar>
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar> */}
                  <div className="flex items-center gap-2">
                    <FileClock size={20} />{" "}
                    <span className="text-sm">2026-09-01</span>
                  </div>
                </CardFooter>
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  );
};
