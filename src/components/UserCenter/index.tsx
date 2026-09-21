"use client";
import { User } from "lucide-react";
import Link from "next/link";
import { useUserQuery } from "@/hooks/use-user-query";

export const UserCenter = () => {
  // 获取用户信息
  const { data: user } = useUserQuery();
  return (
    user?.id && (
      <Link
        href="/user"
        className="w-full xl:w-fit py-2 px-3 xl:py-1 xl:px-3 flex gap-2 items-center border border-gray-200 dark:border-gray-700 rounded-lg group hover:text-teal-400 cursor-pointer"
      >
        <User size={16} />{" "}
        <span className="text-nowrap">{user.user_metadata.username}</span>
      </Link>
    )
  );
};
