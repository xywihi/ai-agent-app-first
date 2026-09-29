import { useChat } from "@ai-sdk/react";
import { Suspense, useEffect } from "react";
import { addHistoryMessage, getHistoryMessages } from "@/app/utils/api/chat";
import ConversateInput from "@/app/chat/[id]/components/ConversateInput";
import { reportErrorLog } from "@/lib/reportError";
import { useParams } from "next/navigation";
import { DefaultChatTransport } from "ai";
import { MessageList } from "../MessageLIst";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/app/utils/query-keys";
import notFound from "../../not-found";
import { Skeleton } from "@/components/ui/skeleton";

export const ConverBox = () => {
  const { id } = useParams();
  const conversationId = id as string;
  const {
    data: { historyData: initialMessages, currentItem } = {
      historyData: [],
      currentItem: { conversation_name: "" },
    },
    isPending: historyPending,
    error: history_rror,
  } = useQuery({
    queryKey: QueryKeys.aiChat.message(id as string),
    queryFn: async () => {
      return getHistoryMessages(id as string);
    },
    enabled: !!id,
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
    setMessages(initialMessages);
  }, [initialMessages, setMessages]);
  //新建对话
  if (history_rror) {
    // 返回404
    return notFound();
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
          isPending={historyPending}
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
