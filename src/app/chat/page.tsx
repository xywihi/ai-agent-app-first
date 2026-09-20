"use client";
import { GlobalLoading } from "@/components/GlobalLoading";
import { getConverHistoryList } from "../utils/api/chat";
import { ConverHistoryList } from "@/components/ConverHistoryList";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import client from "@/lib/server";
import z from "zod";
import { QueryKeys } from "@/app/utils/query-keys";
const Schema = z.object({
  user: z.object({
    id: z.string(),
    user_metadata: z.object({
      email: z.string(),
      username: z.string(),
    }),
  }),
});
// type User = z.infer<typeof Schema>;
export default function Chat() {
  const [userId, setUserId] = useState<string | null>(null);
  // const user = queryClient.getQueryData<{ id: string } | undefined>([
  //   "authUser",
  // ]);
  const { data = [], isPending } = useQuery({
    queryKey: QueryKeys.aiChat.history,
    enabled: !userId,
    queryFn: async () => {
      try {
        const data = await client.auth.getUser();
        const user = Schema.safeParse(data.data);
        if (user.success) {
          setUserId(user.data.user.id);
          const result = await getConverHistoryList(
            user?.data?.user.id as string
          );
          console.log("result", result);
          return result;
        } else {
          throw new Error(user.error.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  if (isPending) {
    return <GlobalLoading />;
  }
  return (
    <div className="lg:flex flex-row h-full flex-1 justify-center items-center p-4 pt-18 md:pt-12 pb-12 space-y-4 mb-4 relative">
      <ConverHistoryList data={data} isLoading={isPending} />
    </div>
  );
}
