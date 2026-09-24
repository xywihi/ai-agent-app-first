import { cn } from "@/app/utils/tools";
import { AiAnswer } from "@/components/AiAnswer";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SpeechButton } from "@/components/ui/speech-button";
import { AudioLines, RectangleEllipsis } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { UIMessage } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionData {
  title: string;
  difficulty: string;
  content: string;
  answer: string;
  codeLanguageType: string;
}
type DateType = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};
type LocationType = {
  location: string;
  temperature: number;
};

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
    console.log(
      "scrollRef.current.scrollHeight",
      scrollRef.current?.scrollHeight
    );
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      // behavior: "smooth", //平滑滚动
    });
  }, [messages]);
  if (isPending && currentItem.conversation_name !== "新建对话") {
    return (
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
    );
  }
  console.log("isPending", isPending, currentItem.conversation_name);
  return (
    <ScrollArea
      ref={scrollRef}
      className="flex-1 h-[calc(100vh-8rem)] lg:h-[calc(100vh-11rem)] overflow-auto"
    >
      <div className="space-y-4 pb-16">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap mb-4">
            <div className="mb-2">
              {message.role === "user" ? "🧒: " : "🤖: "}
            </div>

            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  const text =
                    (part as unknown as { parseStr: string }).parseStr ||
                    part.text;
                  return (
                    <div key={`${message.id}-${i}`}>
                      <div className="border rounded-2xl p-2 ">
                        <AiAnswer
                          type={
                            (part as unknown as { parseStr: string }).parseStr
                              ? "object"
                              : "string"
                          }
                          data={text}
                        />
                      </div>
                      <div
                        className={cn(
                          message.role === "user" ? "hidden" : "flex",
                          "row gap-1.5 my-2"
                        )}
                      >
                        <CopyButton
                          className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700"
                          text={text}
                        />
                        <SpeechButton
                          text={text}
                          className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  );
                case "tool-weatherTool":
                  //工具调用块
                  if (part.type === "tool-weatherTool") {
                    //执行中状态
                    if (part.state === "output-error") {
                      //执行失败，返回错误信息
                      return (
                        <div key={`${message.id}-${i}`}>
                          <div className="border rounded-2xl p-2 ">
                            <p className="text-sm p-2 rounded-2xl text-gray-400 bg-gray-200 dark:bg-gray-700">
                              {part.errorText}
                            </p>
                          </div>
                          <div className="flex row gap-1.5 my-2">
                            <CopyButton text={part.errorText} />
                            <button className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                              <AudioLines size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  }
                  if (!part.output)
                    return (
                      <p
                        key={`${message.id}-${i}`}
                        className="text-sm p-2 rounded-2xl text-gray-400 bg-gray-200 dark:bg-gray-700"
                      >
                        工具调用执行中...
                      </p>
                    );
                  const { location, temperature } = part.output as LocationType;
                  console.log("part.output", part.output);
                  return (
                    <div key={`${message.id}-${i}`}>
                      <div className="border rounded-2xl p-2 ">
                        <AiAnswer
                          type="string"
                          data={`${location}的温度为${temperature}摄氏度`}
                        />
                        <div className="flex row gap-1.5 my-2">
                          <CopyButton
                            className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700"
                            text={`${location}的温度为${temperature}摄氏度`}
                          />
                          <button className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                            <AudioLines size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                case "tool-convertFahrenheitToCelsius":
                  return (
                    <div key={`${message.id}-${i}`}>
                      <div className="border rounded-2xl p-2 ">
                        <AiAnswer
                          type="pre"
                          data={JSON.stringify(part, null, 2)}
                        />
                      </div>
                      <div className="flex row gap-1.5 my-2">
                        <CopyButton
                          className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700"
                          text={JSON.stringify(part, null, 2)}
                        />

                        <button className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                          <AudioLines size={16} />
                        </button>
                      </div>
                    </div>
                  );
                case "tool-dateTimeTool":
                  const { year, month, day, hour, minute, second } =
                    part.output as DateType;
                  const tool_dateTimeTool_text = `当前的时间为${year}-${month}-${day} ${hour}:${minute}:${second}`;
                  return (
                    <div key={`${message.id}-${i}`}>
                      <div className="border rounded-2xl p-2 ">
                        <AiAnswer type="text" data={tool_dateTimeTool_text} />
                      </div>
                      <div className="flex row gap-1.5 my-2">
                        <CopyButton
                          className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700"
                          text={tool_dateTimeTool_text}
                        />
                        <button className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                          <AudioLines size={16} />
                        </button>
                      </div>
                    </div>
                  );
                case "tool-frontEndQuestionTool":
                  return (
                    <div key={`${message.id}-${i}`}>
                      <div className="border rounded-2xl p-2 ">
                        <AiAnswer
                          type="object"
                          data={part.output as QuestionData}
                        />
                        {i !== message.parts.length - 1 && (
                          <hr className="my-4" />
                        )}
                      </div>
                      {/* <div className="flex row gap-1.5 my-2">
                    <button className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                      <CopyButton text={part.output as QuestionData} />
                    </button>
                    <button className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                      <AudioLines size={16} />
                    </button>
                  </div> */}
                    </div>
                  );
                default:
                  return null;
              }
            })}
            {/* <div>
            <Icon name="copy" className="animate-spin" />
            <Icon name="audio-lines" className="animate-spin" />
          </div> */}
          </div>
        ))}

        <div>
          {error && (
            <div>
              <div className="border border-red-500 p-2 rounded-2xl text-red-500">
                后端请求失败，请检查网络，原因为{error.message}
              </div>
              <button onClick={() => reload()}>点击重试</button>
            </div>
          )}
        </div>
        {status === "submitted" && (
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
        )}
      </div>
    </ScrollArea>
  );
};
