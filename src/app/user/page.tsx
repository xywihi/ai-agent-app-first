"use client";
import { useQuery } from "@tanstack/react-query";
import { Note } from "../utils/api/font-notes/typs";
import { Calendar, Eye, NotebookText, ThumbsUp, Users } from "lucide-react";
import { getDateTime, getTime } from "../utils/tools";
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
import { ProcessedPortfolioWork } from "../utils/api/design/type";
import Image from "next/image";
import { Get } from "../utils/query";
import { getUserProfiles } from "../utils/api/user/requery";
import { Button } from "@/components/ui/button";
export default function User() {
  const router = useRouter();
  const { data: user, isPending: user_loading } = useQuery({
    queryKey: QueryKeys.userCenter.data,
    queryFn: async () => {
      const _data = await Get(`/api/user`);
      const data = await _data.json();
      return data.data;
    },
    staleTime: 0,
  });
  const { data: user_profiles, isPending: user_profiles_loading } = useQuery({
    queryKey: QueryKeys.userCenter.profiles,
    queryFn: async () => {
      const _data = await getUserProfiles();
      const data = await _data.json();
      return data.data;
    },
  });
  // QueryKeys.userCenter.profiles
  const { data: portfolioss_data, isPending: portfolios_loading } = useQuery({
    queryKey: QueryKeys.portfolio.portfolios("all"),
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

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4  gap-4">
      {/* 用户信息 */}
      <div className="bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 shadow-xl rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">个人资料</h1>
            <Button
              className="text-gray-400 px-3 py-1 rounded-lg bg-gray-200"
              onClick={() => router.push("/user/profile")}
            >
              查看详情
            </Button>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="overflow-y-scroll pb-4 h-[calc(100vh-20rem)]">
            {user_loading || user_profiles_loading ? (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                加载中...
              </p>
            ) : (
              <div>
                <div>
                  <p className="text-gray-400">头像</p>
                  <p className="py-2 mb-2">
                    {user_profiles?.avatar_url && (
                      <Image
                        src={user_profiles?.avatar_url}
                        width={50}
                        height={50}
                        alt="avatar"
                        className="rounded-full"
                      />
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">昵称</p>
                  <p className="text-xl border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 mt-2">
                    {user?.user_metadata.username}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400">邮箱</p>
                  <p className="text-xl border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 mt-2">
                    {user?.email}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-gray-400">用户权限</p>
                  <p className="text-xl border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 mt-2">
                    {user?.email === "anli_ang@yeah.net"
                      ? "管理员"
                      : "普通用户"}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400">创建时间</p>
                  <p className="text-xl border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 mt-2">
                    {getDateTime(user?.created_at)}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400">简介</p>
                  <p className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 mt-2">
                    {user_profiles?.bio || "暂无简介"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* UI 作品集 */}
      <div className="bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 shadow-xl rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">UI 作品集</h1>
          <Button
            className="text-gray-400 px-3 py-1 rounded-lg bg-gray-200 block xl:hidden"
            onClick={() => router.push("/user/ui")}
          >
            查看详情
          </Button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <div className="overflow-y-scroll pb-4 h-[calc(100vh-20rem)]">
          {portfolioss_data &&
            !portfolioss_data.list?.length &&
            !portfolios_loading && (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                暂无笔记
              </p>
            )}
          {portfolios_loading ? (
            <p className="text-gray-400 text-center h-full flex flex-col justify-center">
              加载中...
            </p>
          ) : (
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
            })
          )}
        </div>
      </div>
      {/* 前端笔记 */}
      <div className="bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 shadow-xl rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">前端笔记</h1>
            <Button
              className="text-gray-400 px-3 py-1 rounded-lg bg-gray-200 block xl:hidden"
              onClick={() => router.push("/user/frontend")}
            >
              查看详情
            </Button>
          </div>
          <div className="gap-4 hidden xl:flex">
            <div className="flex gap-2 items-center">
              <NotebookText size={14} />
              <span>{notes_data?.noteTotal ?? 0}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Eye size={14} />
              <span>{notes_data?.totalView ?? 0}</span>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="overflow-y-scroll pb-4 h-[calc(100vh-20rem)]">
            {notes_data && !notes_data.list?.length && !notes_loading && (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                暂无笔记
              </p>
            )}
            {notes_loading ? (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                加载中...
              </p>
            ) : (
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
              })
            )}
          </div>
        </div>
      </div>
      {/* 用户统计 */}
      <div className="bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 shadow-xl rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">用户统计</h1>
            <Button
              className="text-gray-400 px-3 py-1 rounded-lg bg-gray-200 block xl:hidden"
              onClick={() => router.push("/user/ui")}
            >
              查看详情
            </Button>
            <div className="gap-2 items-center hidden xl:flex">
              <Users size={14} />
              <span>{users?.totalCount ?? 0}</span>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="overflow-y-scroll pb-4 h-[calc(100vh-20rem)]">
            {users_loading ? (
              <p className="text-gray-400 text-center h-full flex flex-col justify-center">
                加载中...
              </p>
            ) : (
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
