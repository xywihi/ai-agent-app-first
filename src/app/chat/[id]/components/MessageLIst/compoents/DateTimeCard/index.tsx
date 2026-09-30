import { cn } from "@/app/utils/tools";
import { AiAnswer } from "@/components/AiAnswer";
import { CopyButton } from "@/components/ui/copy-button";
import { SpeechButton } from "@/components/ui/speech-button";
import { UIMessage } from "ai";
import { useCallback } from "react";

type DateType = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};
type UIPart = UIMessage["parts"][number];
export const DateTimeCard = ({
  message,
  part,
}: {
  message: UIMessage;
  part: UIPart;
}) => {
  const getPartsString = useCallback((parts: UIPart[]) => {
    try {
      let str = "";
      parts.forEach((part) => {
        if (part.type === "tool-dateTimeTool") {
          const { year, month, day, hour, minute, second } =
            part.output as DateType;
          str += `当前的时间为${year}-${month}-${day} ${hour}:${minute}:${second}。`;
        }
      });
      return str;
    } catch (error) {}
  }, []);
  const partsString = useCallback(() => {
    try {
      if (part.type === "tool-dateTimeTool") {
        if (part.state === "input-streaming") {
          return (
            <p className="w-fit text-sm rounded-2xl px-4 py-2 text-gray-400 bg-gray-100 dark:bg-gray-700">
              正在调用时间工具
            </p>
          );
        }
        if (part.state !== "output-available") {
          //执行失败，返回错误信息
          return (
            <p className="w-fit text-sm rounded-2xl px-4 py-2 text-gray-400 bg-gray-100 dark:bg-gray-700">
              正在获取当前时间...
            </p>
          );
        }
        const { year, month, day, hour, minute, second } =
          part.output as DateType;
        const tool_dateTimeTool_text = `当前的时间为${year}-${month}-${day} ${hour}:${minute}:${second}。`;
        return (
          <div className="">
            <AiAnswer type="pre" data={tool_dateTimeTool_text} />
          </div>
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [part]);
  return (
    <div
      key={message.id}
      className={cn("whitespace-pre-wrap flex flex-col", {
        "mb-8":
          part.type === "tool-dateTimeTool" &&
          part.state === "output-available",
      })}
    >
      {/* <div
          className={cn("mb-2", { "self-end": message.role === "user" })}
        >
          {message.role === "user" ? "🧒: " : "🤖: "}
        </div> */}
      <div
        className={cn("relative rounded-2xl", {
          "py-2 px-4 my-2 bg-gray-200 dark:bg-gray-700": message.parts.some(
            (part) => {
              const toolPart = part as {
                type: string;
                state?: "input-streaming" | "output-available" | "done";
              };
              return (
                // toolPart?.state === "output-available" ||
                // (toolPart?.state === "done" && toolPart?.type === "text")
                typeof toolPart.type === "string" &&
                toolPart.type.startsWith("tool-") &&
                toolPart.state === "output-available"
              );
            }
          ),
        })}
      >
        {partsString()}
      </div>
      {message.role === "assistant" && (
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
      )}
    </div>
  );
};
