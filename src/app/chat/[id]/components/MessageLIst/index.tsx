import { AiAnswer } from "@/components/AiAnswer";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { UIMessage } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { TextCard } from "./compoents/TextCard";
import { WeatherCard } from "./compoents/WeatherCard";
import { DateTimeCard } from "./compoents/DateTimeCard";
import { DateCalcCard } from "./compoents/DateCalcCard";
import { FrontEndQuestionCard } from "./compoents/FrontEndQuestionCard";

export const MessageList = ({
  messages,
  sendMessage,
  status,
  error,
  isPending,
  currentItem,
}: {
  messages: UIMessage[];
  sendMessage: (message: UIMessage) => void;
  status: string;
  error: Error | undefined;
  isPending: boolean;
  currentItem: { conversation_name: string };
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reload = useCallback(() => {
    const lastUserMessage = messages.filter(
      (message) => message.role === "user"
    );
    if (lastUserMessage.length === 0) return;
    sendMessage(lastUserMessage[lastUserMessage.length - 1]);
  }, [messages, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      // behavior: "smooth", //平滑滚动
    });
  }, [messages]);
  if (isPending && currentItem.conversation_name !== "新建对话") {
    return (
      <div className="flex flex-col gap-4 pt-8">
        <div className="w-1/2 flex flex-col justify-end self-end">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 self-end" />
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4 flex flex-col gap-2">
            <Skeleton className="h-8  bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8  bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="w-1/2">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4 flex flex-col gap-2">
            <Skeleton className="h-8 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-end self-end">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 self-end" />
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4 flex flex-col gap-2">
            <Skeleton className="h-8  bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8  bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="w-1/2">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-4 flex flex-col gap-2">
            <Skeleton className="h-8 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <ScrollArea
      ref={scrollRef}
      className="flex-1 h-[calc(100vh-8rem)] lg:h-[calc(100vh-11rem)] overflow-auto"
    >
      <div className="pb-16 pt-8 flex flex-col">
        {messages.map((message) => {
          return message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                if (part.text.length === 0) return null;
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="flex flex-col w-full"
                  >
                    <TextCard part={part} message={message} />
                  </div>
                );
              case "tool-weatherTool":
                console.log("******part.state", part.state);
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="flex flex-col w-full"
                  >
                    <WeatherCard message={message} part={part} />
                  </div>
                );
              case "tool-convertFahrenheitToCelsius":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="flex flex-col w-full"
                  >
                    <div className="">
                      <AiAnswer
                        type="pre"
                        data={JSON.stringify(part, null, 2)}
                      />
                    </div>
                  </div>
                );
              case "tool-dateTimeTool":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="flex flex-col w-full"
                  >
                    <DateTimeCard message={message} part={part} />
                  </div>
                );

              case "tool-dateCalcTool":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="flex flex-col w-full"
                  >
                    <DateCalcCard message={message} part={part} />
                  </div>
                );

              case "tool-frontEndQuestionTool":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="flex flex-col w-full"
                  >
                    <FrontEndQuestionCard message={message} part={part} />
                  </div>
                );

              default:
                return null;
            }
          });
        })}

        <div>
          {error && (
            <div>
              <div className="border border-red-500 rounded-2xl text-red-500">
                后端请求失败，请检查网络，原因为{error.message}
              </div>
              <button onClick={() => reload()}>点击重试</button>
            </div>
          )}
        </div>
        {status === "submitted" && (
          <p className="w-fit text-sm rounded-2xl px-4 py-2 text-gray-400 bg-gray-100 dark:bg-gray-700">
            正在思考中...
          </p>
        )}
        {/* {status === "submitted" && (
          <Button className="border border-teal-200  px-4 rounded-2xl text-sm text-teal-500">
            <RectangleEllipsis />
            AI正在思考中...
          </Button>
        )}
        {status === "streaming" && (
          <Button className="border border-teal-200  px-4 rounded-2xl text-sm text-teal-500">
            <RectangleEllipsis />
            AI正在思考中...
          </Button>
        )}
        {status === "ready" && (
          <Button className="border border-teal-200  px-4 rounded-2xl text-sm text-teal-500">
            <RectangleEllipsis />
            AI已完成思考
          </Button>
        )}
        {status === "error" && (
          <Button className="border border-teal-200  px-4 rounded-2xl text-sm text-teal-500">
            <RectangleEllipsis />
            AI出错了，请检查网络
          </Button>
        )} */}
      </div>
    </ScrollArea>
  );
};
