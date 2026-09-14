"use client";

import { createClient } from "@/lib/server/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function LogoutButton() {
  const [user, setUser] = useState<User | null>(null);
  // 获取用户信息
  useEffect(() => {
    const getUser = async () => {
      const _user = await createClient().auth.getUser();
      setUser(_user.data.user);
    };
    getUser();
  }, []);

  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await createClient().auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.log("退出帐号失败", error);
    }
  };
  return (
    user?.id && (
      <div>
        <Button
          className="p-2 bg-gray-200 rounded-lg hover:bg-teal-400 hover:text-white cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut />
          退出帐号
        </Button>
      </div>
    )
  );
}
