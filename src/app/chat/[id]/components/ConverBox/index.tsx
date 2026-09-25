import { useChat } from "@ai-sdk/react";
import { Suspense, useEffect, useState } from "react";
import {
  addHistoryMessage,
  ConverListSchema,
  getConverHistoryList,
  getHistoryMessages,
} from "@/app/utils/api/chat";
import ConversateInput from "@/app/chat/[id]/components/ConversateInput";
import { reportErrorLog } from "@/lib/reportError";
import { useParams } from "next/navigation";
import { DefaultChatTransport } from "ai";
import { MessageList } from "../MessageLIst";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/app/utils/query-keys";
import z from "zod";
import client from "@/lib/server";
import notFound from "../../not-found";
import { Skeleton } from "@/components/ui/skeleton";

const Schema = z.object({
  user: z.object({
    id: z.string(),
    user_metadata: z.object({
      email: z.string(),
      username: z.string(),
    }),
  }),
});

export const ConverBox = () => {
  const params = useParams();
  const conversationId = params.id as string;
  const [userId, setUserId] = useState<string | null>(null);
  // const converList: ConverListType = useQueryClient().getQueryData([
  //   "converHistories",
  // ]) as [];
  const { data: converList = [], isPending: converListPending } = useQuery({
    queryKey: QueryKeys.aiChat.history,
    enabled: !userId,
    queryFn: async () => {
      try {
        const data = await client.auth.getUser();
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
      currentItem: { conversation_name: "" },
    },
    isPending: historyPending,
    error: history_rror,
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

  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: async (msg) => {
      const userMessage = messages[messages.length - 2];
      const currentConverId = conversationId;
      // 保存用户消息
      await addHistoryMessage(
        currentConverId,
        "user",
        userMessage.parts,
        userMessage.id
      );

      // 保存AI消息
      await addHistoryMessage(
        currentConverId,
        "assistant",
        msg.message.parts,
        msg.message.id
      );
    },
    onError: async (err) => {
      console.error("useChat onError", err);
      // 保存错误消息
      await reportErrorLog({
        conversationId: conversationId,
        errorType: "usechat_stream_error",
        error: err,
        extra: {
          messageSnapshot: messages, // 保存消息快照，以便后续调试工具调用问题
        },
      });
    },
  });
  useEffect(() => {
    if (!initialMessages.length) return;
    console.log("messages", initialMessages);
    setMessages(initialMessages);
  }, [initialMessages, setMessages]);
  //新建对话
  if (history_rror) {
    console.log("error---", history_rror);
    notFound();
  }
  return (
    <div className="lg:px-4 relative h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)] xl:h-[calc(100vh-10rem)] lg:pt-0 pb-12 max-w-4xl  w-full xl:w-240">
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4 flex flex-col gap-2">
                <Skeleton className="ml-8 h-8 w-[calc(100%-32px)] bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-8 w-[calc(100%-4)] bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="w-full">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4 flex flex-col gap-2">
                <Skeleton className="ml-8 h-8 w-[calc(100%-32px)] bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-8 w-[calc(100%-4)] bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        }
      >
        <MessageList
          messages={messages}
          sendMessage={sendMessage}
          status={status}
          error={error}
          isPending={converListPending}
          currentItem={currentItem}
        />
      </Suspense>
      <ConversateInput
        messages={messages}
        status={status}
        stop={stop}
        setMessages={setMessages}
        sendMessage={sendMessage}
      />
    </div>
  );
};
