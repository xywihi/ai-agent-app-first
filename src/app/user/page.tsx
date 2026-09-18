"use client";
import { useQuery } from "@tanstack/react-query";
import { Note } from "../utils/api/font-notes/typs";
import { Calendar, Eye, ThumbsUp } from "lucide-react";
import { getTime } from "../utils/tools";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/server/client";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { type User } from "@/app/api/admin/list-users/type";
import { QueryKeys } from "../utils/query-keys";
import {
  PortfolioWork,
  ProcessedPortfolioWork,
} from "../utils/api/design/type";
import Image from "next/image";
import { Get } from "../utils/query";
export default function User() {
  const router = useRouter();
  const { data: portfolioss_data, isPending: portfolios_loading } = useQuery({
    queryKey: QueryKeys.portfolio.portfoliosAll,
    queryFn: async () => {
      const data = await Get(`/api/user/design/portfolio/default?category=all`);
      return data;
    },
  });
  const { data: notes_data, isPending: notes_loading } = useQuery({
    queryKey: QueryKeys.fronend.new_notes,
    queryFn: async () => {
      const data = await Get(`/api/user/frontend/new-notes`);
      return data;
    },
  });
  const {
    data: users,
    isPending: users_loading,
    error,
  } = useQuery({
    queryKey: QueryKeys.userCenter.users,
    queryFn: async () => {
      const client = createClient();
      const {
        data: { session },
        error,
      } = await client.auth.refreshSession();
      if (error || !session?.access_token) throw new Error("session 失效");
      const data = await Get(`/api/admin/list-users`, {
        Authorization: `Bearer ${session?.access_token}`,
      });
      return data;
    },
  });
  console.log("users", notes_data);
  return (
    <div className="h-full grid grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold">UI 作品集</h1>
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <div className="overflow-y-scroll pb-4 h-[calc(100vh-24rem)]">
          {portfolioss_data &&
            !portfolioss_data.list?.length &&
            !portfolios_loading && (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                暂无笔记
              </p>
            )}
          {portfolios_loading && (
            <p className="text-gray-400 text-center h-full flex flex-col justify-center">
              加载中...
            </p>
          )}
          {portfolioss_data &&
            portfolioss_data.list?.map((item: ProcessedPortfolioWork) => {
              return (
                <div
                  key={item.id}
                  className="mb-4 p-4 flex gap-4 bg-white dark:bg-gray-700 rounded-2xl shadow-xl cursor-pointer transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
                  onClick={() => {
                    router.push(`/design/detail/${item.id}`);
                  }}
                >
                  <Image
                    src={item.portfolio_work_images[0].image_url}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="object-cover object-top w-1/3 max-h-40 overflow-hidden"
                  />
                  <div className="flex-1">
                    <h1 className="text-xl font-bold mb-3">{item.title}</h1>
                    <p className="text-sm mb-8 text-gray-400">
                      {item.description}
                    </p>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Calendar size={14} />
                        {item.updated_at && getTime(item.updated_at)}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <ThumbsUp size={14} />
                        {item.like_count}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 shadow-xl rounded-2xl flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">前端笔记</h1>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="overflow-y-scroll pb-4 h-[calc(100vh-24rem)]">
            {notes_data && !notes_data.list?.length && !notes_loading && (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                暂无笔记
              </p>
            )}
            {notes_loading && (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                加载中...
              </p>
            )}
            {notes_data &&
              notes_data.list?.map((item: Note) => {
                return (
                  <div
                    key={item.id}
                    className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-xl cursor-pointer transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
                    onClick={() => {
                      router.push(
                        `/frontend?category_id=${item.category_id}&seconde_id=${item.sub_category_id}&note_id=${item.id}`
                      );
                    }}
                  >
                    <h1 className="text-xl font-bold mb-4">{item.title}</h1>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Calendar size={14} />
                        {item.updated_at && getTime(item.updated_at)}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Eye size={14} />
                        {item.view_count}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="text-gray-400 flex justify-evenly items-center gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold">{notes_data?.noteTotal ?? 0}</h1>
            <span>总数</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold">{notes_data?.totalView ?? 0}</h1>
            <span>总浏览</span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 shadow-xl rounded-2xl flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户统计</h1>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="overflow-y-scroll pb-4 h-[calc(100vh-24rem)]">
            {users_loading && (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                加载中...
              </p>
            )}
            {users &&
              users.users?.map((item: User) => {
                return (
                  <div
                    key={item.id}
                    className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-xl cursor-pointer transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center">
                      <Avatar className="w-14 h-14 flex shrink-0 rounded-full after:absolute after:inset-0 after:rounded-full after:mix-blend-darken after:border-0">
                        <AvatarImage
                          src={item?.avatar_url}
                          alt="@shadcn"
                          className="border-none"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                      </Avatar>
                      <div className="flex-1 ml-4">
                        <p className="flex justify-between items-center mb-2">
                          <span className="text-xl font-medium leading-none">
                            {item.display_name}
                          </span>
                          {item.authority === "admin" && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-xl">
                              管理员
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.email}
                        </p>
                      </div>
                    </div>
                    <hr className="my-4 border-gray-200 dark:border-gray-700" />
                    <p className="text-sm text-gray-400">
                      最近登录于：{getTime(item.last_sign_in_at as string)}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="text-gray-400 flex justify-evenly items-center gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold">{users?.totalCount ?? 0}</h1>
            <span>总数</span>
          </div>
        </div>
      </div>
    </div>
  );
}
