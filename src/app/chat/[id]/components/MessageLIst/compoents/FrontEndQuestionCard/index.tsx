import { cn } from "@/app/utils/tools";
import { AiAnswer } from "@/components/AiAnswer";
import { CopyButton } from "@/components/ui/copy-button";
import { SpeechButton } from "@/components/ui/speech-button";
import { UIMessage } from "ai";
import { useCallback } from "react";

interface QuestionData {
  title: string;
  difficulty: string;
  content: string;
  answer: string;
  codeLanguageType: string;
}
type UIPart = UIMessage["parts"][number];
export const FrontEndQuestionCard = ({
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
        if (part.type === "tool-frontEndQuestionTool") {
          const { title, difficulty, content, answer, codeLanguageType } =
            part.output as QuestionData;
          str += `问题：${title}，难度：${difficulty}，知识点：${content}，参考答案：${answer}，代码语言类型：${codeLanguageType}`;
        }
      });
      return str;
    } catch (error) {}
  }, []);
  const partsString = useCallback(() => {
    try {
      if (part.type === "tool-frontEndQuestionTool") {
        return (
          <div className="">
            <AiAnswer type="object" data={part.output as QuestionData} />
            {/* {i !== message.parts.length - 1 && (
                <hr className="my-4" />
              )} */}
          </div>
        );
      }
    } catch (error) {}
  }, [part]);
  return (
    <div
      key={message.id}
      className={cn("whitespace-pre-wrap flex flex-col", {
        "mb-8":
          part.type === "tool-frontEndQuestionTool" &&
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
      {part.type === "tool-frontEndQuestionTool" && (
        <p className="w-fit text-sm rounded-2xl text-gray-400 px-4 py-2 bg-gray-100 dark:bg-gray-700">
          {part.state === "input-streaming" && "正在调用提问工具"}
          {part.state !== "output-available" &&
            part.state !== "input-streaming" &&
            "正在获取问题答案..."}
        </p>
      )}
      {message.role === "assistant" &&
        part.type === "tool-frontEndQuestionTool" &&
        part.state === "output-available" && (
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
