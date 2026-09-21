"use client";

import client from "@/lib/server";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/app/utils/query-keys";
export default function LogoutButton() {
  const queryclient = useQueryClient();
  // 获取用户信息
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await client.auth.signOut();
      queryclient.removeQueries({
        // 刷新数据
        queryKey: QueryKeys.userCenter.data,
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.log("退出帐号失败", error);
    }
  };
  return (
    <div>
      <Button
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-teal-400 dark:hover:bg-teal-600 hover:text-white cursor-pointer"
        onClick={handleSignOut}
      >
        <LogOut />
        退出帐号
      </Button>
    </div>
  );
}
