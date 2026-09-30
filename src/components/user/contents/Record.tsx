"use client";
import { Get } from "@/app/utils/query";
import { QueryKeys } from "@/app/utils/query-keys";
import { cn, getTime } from "@/app/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
export const Record = () => {
  const router = useRouter();
  const { data, isPending } = useQuery({
    queryKey: QueryKeys.userCenter.records,
    queryFn: async () => {
      const data = await Get(`/api/user/visit`);
      return data;
    },
    refetchOnWindowFocus: true, // 窗口聚焦时不自动刷新（按需）
  });
  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">*仅显示最近7天的浏览记录</p>
      {isPending && (
        <div className="flex-1 text-center h-[calc(100vh-10rem)] flex flex-col justify-center items-center  xl:text-xl text-gray-400">
          正在努力加载中...
        </div>
      )}
      {data && (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
          {/* 设计作品 */}
          <div
            className={cn("flex-1 invisible", {
              visible: data.portfolio_visits_data?.length,
            })}
          >
            <h1 className="text-2xl font-bold mb-6">设计作品</h1>
            <div className="flex gap-4 flex-wrap">
              {data.portfolio_visits_data?.map((item: any) => {
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
                    onClick={() => {
                      router.push(`/design/detail/${item.portfolio_works.id}`);
                    }}
                  >
                    <Image
                      src={
                        item.portfolio_works.portfolio_work_images[0].image_url
                      }
                      alt={item.portfolio_works.title}
                      width={400}
                      height={400}
                      loading="eager"
                      className="object-cover object-top w-full h-48 overflow-hidden hidden lg:block"
                    />
                    <div className="p-4">
                      <p className="font-bold text-lg">
                        {item.portfolio_works.title}
                      </p>
                      <p className="text-sm mt-2">
                        {item.portfolio_works.description}
                      </p>
                      <div className="mt-4 gap-2 hidden lg:flex">
                        {item.portfolio_works.tags.map(
                          (item: any, index: number) => {
                            return (
                              <span
                                key={index}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl px-2 py-1 inline-block text-xs"
                              >
                                {item}
                              </span>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-600" />
                    <p className="px-4 py-2 text-sm text-gray-400 flex gap-2 items-center">
                      <Clock size={14} />
                      {getTime(item.visited_at)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 前端笔记 */}
          <div
            className={cn("flex-1 invisible", {
              visible: data.note_visits_data?.length,
            })}
          >
            <h1 className="text-2xl font-bold mb-6">前端笔记</h1>
            <div className="flex gap-4 flex-wrap">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-25">标题</TableHead>
                    <TableHead className="text-right">类型</TableHead>
                    <TableHead className="text-right">时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.note_visits_data?.map((item: any) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.frontend_notes.title}
                        </TableCell>
                        <TableCell>
                          {item.frontend_notes.note_categories.name}
                        </TableCell>
                        <TableCell>{getTime(item.visited_at)}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              router.push(
                                `/frontend/${item.frontend_notes.owner_id}/detail/${item.frontend_notes.id}`
                              );
                            }}
                          >
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {/* {data.note_visits_data?.map((item: any) => {
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
                    onClick={() => {
                      router.push(
                        `/frontend/${item.frontend_notes.owner_id}/detail/${item.frontend_notes.id}`
                      );
                    }}
                  >
                    <div className="p-4">
                      <p className="font-bold text-lg">
                        {item.frontend_notes.title}
                      </p>
                      <p className="mt-2 hidden lg:inline-block bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl px-2 py-1 text-xs truncate">
                        {item.frontend_notes.note_categories.name}
                      </p>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-600" />
                    <p className="px-4 py-2 text-sm text-gray-400 flex gap-2 items-center">
                      <Clock size={14} />
                      {getTime(item.visited_at)}
                    </p>
                  </div>
                );
              })} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
