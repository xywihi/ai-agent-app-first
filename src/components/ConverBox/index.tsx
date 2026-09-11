import { UIMessage, useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useRef } from "react";
import { AiAnswer } from "../AiAnswer";
import { addHistoryMessage } from "@/app/utils/api/chat";
import ConversateInput from "../ConversateInput";
import { reportErrorLog } from "@/lib/reportError";
import { useParams } from "next/navigation";
import { DefaultChatTransport } from "ai";
// import { Home } from "lucide-react";
// import { Icon } from "../Icon";
import {
  Copy,
  MoreVertical,
  AudioLines,
  RectangleEllipsis,
} from "lucide-react";
import { CopyButton } from "../ui/copy-button";
import { SpeechButton } from "../ui/speech-button";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
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

type PropsType = {
  initialMessages: UIMessage[];
  api: string;
};
export const ConverBox = ({ initialMessages, api }: PropsType) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const conversationId = params.id as string;
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: api || "api/chat",
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
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      // behavior: "smooth",
    });
  }, [messages]);
  useEffect(() => {
    if (!initialMessages) return;
    console.log("messages", initialMessages);
    setMessages(initialMessages);
  }, [initialMessages]);
  const reload = useCallback(() => {
    const lastUserMessage = messages.filter(
      (message) => message.role === "user"
    );
    if (lastUserMessage.length === 0) return;
    sendMessage(lastUserMessage[lastUserMessage.length - 1]);
  }, [messages]);
  return (
    <div className="p-4 relative h-[calc(100vh-5rem)] pt-4 lg:pt-0 pb-12">
      <div
        ref={scrollRef}
        className="flex-1 h-[calc(100vh-10rem)] overflow-y-auto space-y-4 pb-16 "
      >
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
                          className="rounded-lg p-2 bg-gray-200"
                          text={text}
                        />
                        <SpeechButton
                          text={text}
                          className="rounded-lg p-2 bg-gray-200"
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
                            <p className="text-sm p-2 rounded-2xl text-gray-400 bg-gray-200">
                              {part.errorText}
                            </p>
                          </div>
                          <div className="flex row gap-1.5 my-2">
                            <CopyButton text={part.errorText} />
                            <button className="rounded-lg p-2 bg-gray-200">
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
                        className="text-sm p-2 rounded-2xl text-gray-400 bg-gray-200"
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
                            className="rounded-lg p-2 bg-gray-200"
                            text={`${location}的温度为${temperature}摄氏度`}
                          />
                          <button className="rounded-lg p-2 bg-gray-200">
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
                          className="rounded-lg p-2 bg-gray-200"
                          text={JSON.stringify(part, null, 2)}
                        />

                        <button className="rounded-lg p-2 bg-gray-200">
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
                          className="rounded-lg p-2 bg-gray-200"
                          text={tool_dateTimeTool_text}
                        />
                        <button className="rounded-lg p-2 bg-gray-200">
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
                        <button className="rounded-lg p-2 bg-gray-200">
                          <CopyButton text={part.output as QuestionData} />
                        </button>
                        <button className="rounded-lg p-2 bg-gray-200">
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
            AI已完成思考...
          </Button>
        )}
        {status === "error" && (
          <Button className="border border-teal-200  px-4 rounded-2xl text-sm text-teal-500">
            <RectangleEllipsis />
            AI出错了...
          </Button>
        )}
      </div>
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
