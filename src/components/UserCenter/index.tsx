"use client";
import { createClient } from "@/lib/server/client";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type User as SupabaseUser } from "@supabase/supabase-js";

export const UserCenter = () => {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  // 获取用户信息
  useEffect(() => {
    const getUser = async () => {
      const _user = await createClient().auth.getUser();
      setUser(_user.data.user);
    };
    getUser();
  }, []);
  return (
    user?.id && (
      <div
        className="w-fit p-1.5 border border-gray-200 rounded-lg group hover:text-teal-400 cursor-pointer"
        onClick={() => router.push("/user")}
      >
        <User size={18} />
      </div>
    )
  );
};
