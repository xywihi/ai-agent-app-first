"use client";

import { createClient } from "@/lib/server/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
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
    <div>
      <Button
        className="p-2 bg-gray-200 rounded-lg hover:bg-teal-400 hover:text-white cursor-pointer"
        onClick={handleSignOut}
      >
        <LogOut />
        退出帐号
      </Button>
    </div>
  );
}
