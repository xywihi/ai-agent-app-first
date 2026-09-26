import server from "@/lib/server/server";
import { cookies } from "next/headers";

// 删除后端作品图片

export const deletePortfolioImg = async (id: string) => {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) {
    throw new Error("user_id is required");
  }
  const { data, error } = await supabase
    .from("portfolio_work_images")
    .delete()
    .eq("id", id);
  if (error) {
    return new Error(error.message);
  }
  return data;
};
