import { cn } from "@/app/utils/tools";
import { AiAnswer } from "@/components/AiAnswer";
import { CopyButton } from "@/components/ui/copy-button";
import { SpeechButton } from "@/components/ui/speech-button";
import { UIMessage } from "ai";
import { useCallback } from "react";

type UIPart = UIMessage["parts"][number];
export const TextCard = ({
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
        if (part.type === "text") {
          str += part.text;
        }
      });
      return str;
    } catch (error) {}
  }, []);

  let text = "";
  if (part.type === "text") {
    // 只有type="text"的part才有text字段
    text = (part as { parseStr?: string }).parseStr ?? part.text;
  }
  return (
    <div
      key={message.id}
      className={cn("whitespace-pre-wrap flex flex-col", {
        "self-end mb-14": message.role === "user",
      })}
    >
      {/* <div
          className={cn("mb-2", { "self-end": message.role === "user" })}
        >
          {message.role === "user" ? "🧒: " : "🤖: "}
        </div> */}
      <div
        className={cn(
          "relative rounded-2xl py-2 px-4 my-2 bg-gray-200 dark:bg-gray-700",
          {
            "bg-teal-400 w-fit px-4 my-2": message.role === "user",
          }
        )}
      >
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
      {message.role === "assistant" &&
        part.type === "text" &&
        part.state === "done" && (
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
