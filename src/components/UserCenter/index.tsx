"use client";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";

export const UserCenter = () => {
  const router = useRouter();
  // const [user, setUser] = useState<SupabaseUser | null>(null);
  // // 获取用户信息
  // useEffect(() => {
  //   const getUser = async () => {
  //     const _user = await createClient().auth.getUser();
  //     setUser(_user.data.user);
  //   };
  //   getUser();
  // }, []);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<SupabaseUser | null>(["user_data"]);
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
