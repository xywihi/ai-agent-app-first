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
        className={cn("relative rounded-2xl", {
          "bg-teal-400 w-fit px-4 my-2": message.role === "user",
          "py-2 px-4 my-2 bg-gray-200 dark:bg-gray-700": message.parts.some(
            (part) => {
              const toolPart = part as {
                type: string;
                state?: "input-streaming" | "output-available" | "done";
              };
              return (
                // toolPart?.state === "output-available" ||
                // (toolPart?.state === "done" && toolPart?.type === "text")
                toolPart.state === "done"
              );
            }
          ),
        })}
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
