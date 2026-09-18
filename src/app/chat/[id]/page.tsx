"use client";
import { ConverBox } from "@/components/ConverBox";
import {
  getHistoryMessages,
  ConverListSchema,
  getConverHistoryList,
} from "@/app/utils/api/chat";
import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { useState } from "react";
import { createClient } from "@/lib/server/client";
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
const ChatPage = () => {
  const params = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  // const converList: ConverListType = useQueryClient().getQueryData([
  //   "converHistories",
  // ]) as [];
  const { data: converList = [], isPending } = useQuery({
    queryKey: QueryKeys.aiChat.history,
    enabled: !userId,
    queryFn: async () => {
      try {
        const data = await createClient().auth.getUser();
        const user = Schema.safeParse(data.data);
        if (user.success) {
          setUserId(user.data.user.id);
          const result_converList = await getConverHistoryList(
            user?.data?.user.id as string
          );
          const result = ConverListSchema.safeParse(result_converList);
          if (result.success) {
            return result.data;
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
    staleTime: Infinity, //不过期
    refetchOnWindowFocus: false,
  });
  const {
    data: { historyData: initialMessages, currentItem } = {
      historyData: [],
      currentItem: { conversation_name: "新建对话" },
    },
    isFetching,
    error,
  } = useQuery({
    queryKey: QueryKeys.aiChat.message(params.id as string),
    queryFn: async () => {
      console.log("converList", converList);
      if (
        !converList ||
        converList.findIndex((item) => item.id.toString() === params.id) === -1
      ) {
        throw new Error("会话不存在");
      }

      return getHistoryMessages(params.id as string);
    },
    enabled: !!converList,
    refetchOnWindowFocus: false,
  });
  //新建对话
  if (error) {
    console.log("error---", error);
    notFound();
  }
  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto">
      {isFetching && currentItem.conversation_name !== "新建对话" ? (
        <div className="p-4 pt-18 lg:pt-0 pb-12 space-y-4 mb-4">
          <span className="bg-gray-100 dark:bg-gray-800 dark:bg-gray-800 rounded-lg px-2 py-1 text-sm">
            会话历史加载中...
          </span>
        </div>
      ) : (
        <ConverBox initialMessages={initialMessages} api={"/api/chat"} />
      )}
    </div>
  );
};

export default ChatPage;
