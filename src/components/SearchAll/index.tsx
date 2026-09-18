"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
} from "@/components/ui/command";
import { Eye, FileIcon, Search, ThumbsUp } from "lucide-react";
import { cn } from "@/app/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { fuzzySearchAll } from "@/app/utils/api/requery";
import { debounce } from "@/app/utils/tools";
import { useRouter } from "next/navigation";
import { Note } from "@/app/utils/api/font-notes/typs";
import { Spinner } from "../ui/spinner";
import { PortfolioWork } from "@/app/utils/api/design/type";
import { QueryKeys } from "@/app/utils/query-keys";
const debounceFn = debounce((fn) => {
  if (typeof fn !== "function") return;
  // 在此处做你的搜索逻辑
  fn("9999999");
}, 500);
export const SearchAll = () => {
  const [open, setOpen] = React.useState(false);
  const [keyValue, setKeyValue] = React.useState("");
  const router = useRouter();
  const doDebounce = React.useCallback(
    (value: string) =>
      debounceFn((val) => {
        console.log("value", value, "val", val);
        setKeyValue(value);
      }),
    []
  );
  const { data, isPending } = useQuery({
    queryKey: QueryKeys.public.fuzzySearchAll(keyValue as string),
    enabled: open,
    queryFn: async () => {
      try {
        const _data = await fuzzySearchAll(keyValue as string);
        const data = await _data.json();
        return data.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="flex flex-col gap-4">
      <Button
        className={cn(
          "w-12 p-2 backdrop-blur-md border-gray-200 dark:border-gray-700 rounded-lg group hover:w-20 hover:text-teal-400 cursor-pointer transition-all"
        )}
        onClick={() => setOpen(true)}
      >
        <Search size={16} />
        <span
          className={cn(
            "opacity-0 group-hover:opacity-100 absolute transition-all  group-hover:static"
          )}
        >
          搜索
        </span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="bg-white dark:bg-gray-700/80 backdrop-blur-md"
      >
        <Command>
          <CommandInput
            placeholder="通过关键词搜索前端笔记和UI作品集..."
            onValueChange={(val) => {
              doDebounce(val);
            }}
          />
          <div>
            {isPending && (
              <div className="flex items-center gap-2 p-2 hover:bg-white dark:bg-gray-700 hover:text-teal-400 cursor-pointer">
                <Spinner className="size-3 text-gray-400" />
                <span>搜索中...</span>
              </div>
            )}

            {data && (
              <div>
                {!!data?.notes?.length && (
                  <div className="mt-2">
                    <div className="px-2  text-gray-500 text-sm">前端笔记</div>
                    {data.notes
                      .slice(0, !keyValue ? 4 : data.length)
                      ?.map((item: Note) => (
                        <div
                          className="flex items-center justify-between gap-2 p-2 hover:bg-white dark:bg-gray-700 hover:text-teal-400 cursor-pointer"
                          key={item.id}
                          onClick={() => {
                            const searchParams = new URLSearchParams();
                            searchParams.set("category_id", item.category_id);
                            searchParams.set(
                              "seconde_id",
                              item.sub_category_id
                            );
                            searchParams.set("note_id", item.id as string);
                            const url = `/frontend?${searchParams.toString()}`;
                            router.push(url);
                            setOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FileIcon size={16} />
                            <span>{item.title}</span>
                          </div>
                          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                            <Eye size={16} />
                            {item.view_count}
                          </span>
                        </div>
                      ))}
                    {data.notes?.length === 0 && (
                      <CommandEmpty>无相关前端笔记</CommandEmpty>
                    )}
                  </div>
                )}

                {!!data?.portfolios?.length && (
                  <div className="mt-2">
                    <div className="px-2  text-gray-500 text-sm">设计作品</div>
                    {data.portfolios
                      .slice(0, !keyValue ? 4 : data.length)
                      ?.map((item: PortfolioWork) => (
                        <div
                          className="flex items-center justify-between gap-2 p-2 hover:bg-white dark:bg-gray-700 hover:text-teal-400 cursor-pointer"
                          key={item.id}
                          onClick={() => {
                            const url = `/design/detail/${item.id}`;
                            router.push(url);
                            setOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FileIcon size={16} />
                            <span>{item.title}</span>
                          </div>
                          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                            <ThumbsUp size={16} />
                            {item.like_count}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
            {!data?.portfolios?.length && !data?.notes?.length && (
              <CommandEmpty className="text-gray-400">无相关结果</CommandEmpty>
            )}
          </div>
        </Command>
      </CommandDialog>
    </div>
  );
};
