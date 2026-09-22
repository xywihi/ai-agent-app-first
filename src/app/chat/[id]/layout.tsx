"use client";
import { ConverListSchema, getConverHistoryList } from "@/app/utils/api/chat";
import { QueryKeys } from "@/app/utils/query-keys";
import { ConverHistoryList } from "@/components/ConverHistoryList";
import client from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import z from "zod";

const Schema = z.object({
  user: z.object({
    id: z.string(),
    user_metadata: z.object({
      email: z.string(),
      username: z.string(),
    }),
  }),
});
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showConverHistory, setShowConverHistory] = useState(false);
  const { data = [], isPending } = useQuery({
    queryKey: QueryKeys.aiChat.history,
    queryFn: async () => {
      try {
        const data = await client.auth.getUser();
        const user = Schema.safeParse(data.data);
        if (user.success) {
          const result_converList = await getConverHistoryList(
            user?.data?.user.id as string
          );
          const result = ConverListSchema.safeParse(result_converList);
          if (result.success) {
            console.log("result", result);
            const filterList = result.data.filter(
              (item) => item.user_id.toString() === user.data.user.id
            );
            return filterList;
          } else {
            throw new Error(result.error.message);
          }
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
  const handleShowConverHistory = () => {
    setShowConverHistory((pre) => !pre);
  };
  return (
    <div className="flex flex-row xl:mt-8">
      <div className="flex-1 max-w-3xl mx-4 fixed top-4 rounded-2xl z-10 border bg-white dark:bg-gray-700 py-2 px-4 block lg:hidden">
        <button className="px-2" onClick={handleShowConverHistory}>
          会话记录
        </button>
        {showConverHistory && (
          <div className="mt-4">
            <ConverHistoryList data={data} />
          </div>
        )}
      </div>
      <div className="h-[calc(100vh-10rem)] w-1/4 space-y-4 mx-4 pt-18 lg:pt-0 pb-0 hidden lg:block">
        <ConverHistoryList data={data} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
