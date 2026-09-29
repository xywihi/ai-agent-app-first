import { cn } from "@/app/utils/tools";
import { AiAnswer } from "@/components/AiAnswer";
import { CopyButton } from "@/components/ui/copy-button";
import { SpeechButton } from "@/components/ui/speech-button";
import { useCallback, useEffect, useMemo, useRef } from "react";
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
  country: string;
  city: string;
  temperature: number;
  weather: string;
  windSpeed: number;
  humidity: number;
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
  const getPartsString = useCallback((parts: any[]) => {
    try {
      let str = "";
      parts.forEach((part) => {
        switch (part.type) {
          case "text":
            str += part.text;
            break;
          case "code":
            str += part.code;
            break;
          case "tool-weatherTool":
            const { city, temperature, weather, windSpeed, humidity, country } =
              part.output as LocationType;
            str += `${city}的天气为：${temperature}°C，${weather}，风速为${windSpeed}米/秒，湿度为${humidity}%。`;
            break;
          case "tool-convertFahrenheitToCelsius":
            const { fahrenheit, celsius } = part.output as {
              fahrenheit: number;
              celsius: number;
            };
            str += `华氏温度：${fahrenheit}，摄氏温度：${celsius}`;
            break;
          case "tool-dateTimeTool":
            const { year, month, day, hour, minute, second } =
              part.output as DateType;
            str += `当前的时间为${year}-${month}-${day} ${hour}:${minute}:${second}。`;
            break;
          case "tool-frontEndQuestionTool":
            const { title, difficulty, content, answer, codeLanguageType } =
              part.output as QuestionData;
            str += `问题：${title}，难度：${difficulty}，知识点：${content}，参考答案：${answer}，代码语言类型：${codeLanguageType}`;
            break;
          default:
            break;
        }
      });
      return str;
    } catch (error) {}
  }, []);
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
      <div className="space-y-4 pb-16 pt-8 flex flex-col">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("whitespace-pre-wrap mb-8 flex flex-col", {
              "self-end": message.role === "user",
            })}
          >
            {/* <div
              className={cn("mb-2", { "self-end": message.role === "user" })}
            >
              {message.role === "user" ? "🧒: " : "🤖: "}
            </div> */}
            <div
              className={cn("relative rounded-2xl px-4 my-2", {
                "bg-teal-400 w-fit": message.role === "user",
                "py-2 bg-gray-200 dark:bg-gray-700": message.parts.some(
                  (part) => {
                    return part?.state === "output-available";
                  }
                ),
              })}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    const text =
                      (part as unknown as { parseStr: string }).parseStr ||
                      part.text;
                    return (
                      <div key={`${message.id}-${i}`}>
                        <div>
                          <AiAnswer
                            type={
                              (part as unknown as { parseStr: string }).parseStr
                                ? "object"
                                : "string"
                            }
                            data={text}
                          />
                        </div>
                      </div>
                    );
                  case "tool-weatherTool":
                    try {
                      if (part.state === "input-streaming") {
                        return (
                          <div key={`${message.id}-${i}`}>
                            <p className="w-fit text-sm rounded-2xl text-gray-400 px-4 py-2 bg-gray-100 dark:bg-gray-700">
                              正在调用天气工具
                            </p>
                          </div>
                        );
                      }
                      if (part.state !== "output-available") {
                        //执行失败，返回错误信息
                        return (
                          <div key={`${message.id}-${i}`}>
                            <p className="w-fit text-sm rounded-2xl px-4 py-2 text-gray-400 bg-gray-100 dark:bg-gray-700">
                              正在获取城市天气...
                            </p>
                          </div>
                        );
                      }
                      const {
                        city,
                        temperature,
                        weather,
                        windSpeed,
                        humidity,
                        country,
                      } = part.output as LocationType;
                      if (!city)
                        return (
                          <div key={`${message.id}-${i}`}>
                            <div>未找到该城市的天气信息</div>
                          </div>
                        );
                      //执行中状态

                      // if (!part.output)
                      //   return (
                      //     <p
                      //       key={`${message.id}-${i}`}
                      //       className="w-fit text-sm rounded-2xl text-gray-400 bg-gray-100 dark:bg-gray-700"
                      //     >
                      //       正在获取{city}天气...
                      //     </p>
                      //   );
                      const weatherData = `${city}的天气为：${temperature}°C，${weather}，风速为${windSpeed}米/秒，湿度为${humidity}%。`;
                      return (
                        <div key={`${message.id}-${i}`}>
                          <div className="">
                            <AiAnswer type="string" data={weatherData} />
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.log("error", error);
                    }
                  case "tool-convertFahrenheitToCelsius":
                    return (
                      <div key={`${message.id}-${i}`}>
                        <div className="">
                          <AiAnswer
                            type="pre"
                            data={JSON.stringify(part, null, 2)}
                          />
                        </div>
                      </div>
                    );
                  case "tool-dateTimeTool":
                    try {
                      if (part.state === "input-streaming") {
                        return (
                          <div key={`${message.id}-${i}`}>
                            <p className="w-fit text-sm rounded-2xl px-4 py-2 text-gray-400 bg-gray-100 dark:bg-gray-700">
                              正在调用时间工具
                            </p>
                          </div>
                        );
                      }
                      if (part.state !== "output-available") {
                        //执行失败，返回错误信息
                        return (
                          <div key={`${message.id}-${i}`}>
                            <p className="w-fit text-sm rounded-2xl px-4 py-2 text-gray-400 bg-gray-100 dark:bg-gray-700">
                              正在获取当前时间...
                            </p>
                          </div>
                        );
                      }
                      const { year, month, day, hour, minute, second } =
                        part.output as DateType;
                      const tool_dateTimeTool_text = `当前的时间为${year}-${month}-${day} ${hour}:${minute}:${second}。`;
                      return (
                        <div key={`${message.id}-${i}`}>
                          <div className="">
                            <AiAnswer
                              type="pre"
                              data={tool_dateTimeTool_text}
                            />
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.log("error", error);
                    }
                  case "tool-frontEndQuestionTool":
                    return (
                      <div key={`${message.id}-${i}`}>
                        <div className="">
                          <AiAnswer
                            type="object"
                            data={part.output as QuestionData}
                          />
                          {i !== message.parts.length - 1 && (
                            <hr className="my-4" />
                          )}
                        </div>
                        {/* <div className="flex row gap-1.5 my-2">
                    <button className="rounded-lg bg-gray-200 dark:bg-gray-700">
                      <CopyButton text={part.output as QuestionData} />
                    </button>
                    <button className="rounded-lg bg-gray-200 dark:bg-gray-700">
                      <AudioLines size={16} />
                    </button>
                  </div> */}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
            <div className="flex row gap-1.5 my-2">
              <CopyButton
                className="rounded-lg bg-gray-200 dark:bg-gray-700"
                text={getPartsString(message.parts)}
              />
              <SpeechButton
                text={getPartsString(message.parts)}
                className="rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            </div>
            {/* <div>
            <Icon name="copy" className="animate-spin" />
            <Icon name="audio-lines" className="animate-spin" />
          </div> */}
          </div>
        ))}

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
