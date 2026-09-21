"use client";
import { UserMetadata } from "@/app/utils/api/user/type";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";

export const UserCenter = ({
  userMetadata,
}: {
  userMetadata: UserMetadata;
}) => {
  return (
    <Link
      href="/user"
      className="w-full xl:w-fit py-2 px-3 xl:py-1 xl:px-3 flex gap-2 items-center border border-gray-200 dark:border-gray-700 rounded-lg group hover:text-teal-400 cursor-pointer"
    >
      <UserIcon size={16} />{" "}
      <span className="text-nowrap">{userMetadata.username}</span>
    </Link>
  );
};
