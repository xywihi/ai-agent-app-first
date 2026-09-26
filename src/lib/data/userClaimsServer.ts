import server from "@/lib/server/server";
import { cookies } from "next/headers";
export default async function getUserClaimsServer() {
  const cookieStore = await cookies();
  const supabase = await server(cookieStore);
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) throw new Error("用户未登录");
  const userId = claimsData?.claims.sub;
  return userId;
}
