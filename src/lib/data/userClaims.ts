import client from "@/lib/server";
export default async function getUserClaims() {
  const { data: claimsData, error: claimsError } =
    await client.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) throw new Error("用户未登录");
  const userId = claimsData?.claims.sub;
  return userId;
}
