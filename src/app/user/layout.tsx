"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getUserInfo, getUserProfiles } from "@/app/utils/api/user/requery";
import { Separator } from "@/components/ui/separator";
import { Button } from "@base-ui/react";
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UploadAvatarApi } from "@/components/user/UploadAvatar";
import { Suspense, useMemo } from "react";
import { ItemContent } from "@/components/ui/item";
import { Icon } from "@/components/Icon";
import { useRouter } from "next/navigation";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const asideFunctions = useMemo(() => {
    return [
      {
        name: "UI作品集",
        icon: "user",
        path: "/user/ui",
        children: null,
      },
      {
        name: "前端笔记",
        icon: "code",
        path: "/user/frontend",
        children: null,
      },
      {
        name: "浏览记录",
        icon: "eye",
        path: "/user/record",
        children: null,
      },
      {
        name: "个人资料",
        icon: "book-text",
        path: "/user/profile",
        children: null,
      },
      {
        name: "用户统计",
        icon: "chart-no-axes-combined",
        path: "/user/statistic",
        children: null,
      },
    ];
  }, []);
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const _data = await getUserInfo();
      const data = await _data.json();
      return data.data;
    },
  });
  const { data: user_profiles } = useQuery({
    queryKey: ["user_profiles"],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const _data = await getUserProfiles(user?.user.id);
      const data = await _data.json();
      return data.data;
    },
  });
  return (
    <div className="flex gap-4 p-6">
      <aside className="shrink-0 p-6 sticky top-24 flex flex-col justify-between bg-linear-to-b from-gray-200 to-white  bg-white rounded-2xl min-w-90 h-[calc(100vh-13rem)] shadow-2xl">
        <div>
          {user && (
            <div className="flex  items-center gap-4">
              <Dialog>
                <DialogTrigger>
                  <Avatar className="w-14 h-14 flex shrink-0 rounded-full after:absolute after:inset-0 after:rounded-full after:mix-blend-darken after:border-0">
                    <AvatarImage
                      src={user_profiles?.avatar_url}
                      alt="@shadcn"
                      className="border-none"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                  </Avatar>
                </DialogTrigger>
                <DialogContent className="bg-white/40 backdrop-blur-md flex flex-col justify-center items-center gap-4">
                  <h1 className="text-2xl font-bold">修改头像</h1>
                  <UploadAvatarApi
                    className="my-4"
                    avatarUrl={user_profiles?.avatar_url}
                  />
                </DialogContent>
              </Dialog>
              <div>
                <b>{user.user.user_metadata.username}</b>
                <p>{user.user.user_metadata.email}</p>
              </div>
            </div>
          )}

          <Separator className="h-0.5 bg-gray-400 my-8" />
          <div>
            {asideFunctions.map((item, index) => (
              <div
                key={index}
                className="border-2 border-gray-300 rounded-xl mb-4 group bg-white drop-shadow-[0_4px_10px_#ddd] hover:drop-shadow-[0_8px_14px_#b4b4b4cc]"
              >
                <div
                  className="flex items-center  text-xl my-4 px-4  w-full justify-between transition-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => router.push(item.path)}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <Suspense>
                      <Icon
                        name={item.icon as Parameters<typeof Icon>[0]["name"]}
                      />
                    </Suspense>
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className="transition-transform group-data-open:rotate-90 shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
