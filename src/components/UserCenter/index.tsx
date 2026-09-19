"use client";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserQuery } from "@/hooks/use-user-query";

export const UserCenter = () => {
  const router = useRouter();
  // const [user, setUser] = useState<SupabaseUser | null>(null);
  // // 获取用户信息
  // 获取用户信息
  const { data: user } = useUserQuery();
  return (
    user?.id && (
      <div
        className="w-full xl:w-fit p-3 xl:p-1.5 flex gap-2 items-center border border-gray-200 dark:border-gray-700 rounded-lg group hover:text-teal-400 cursor-pointer"
        onClick={() => router.push("/user")}
      >
        <User size={18} /> <span>{user.user_metadata.name}</span>
      </div>
    )
  );
};
