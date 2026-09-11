import { useChat } from "@ai-sdk/react";
import { memo, useCallback, useEffect, useState } from "react";
import { updateConverHistoryList } from "@/app/utils/api/chat";
import { useParams } from "next/navigation";
interface PropsInterface {
  messages?: ReturnType<typeof useChat>["messages"];
  status: ReturnType<typeof useChat>["status"];
  stop: ReturnType<typeof useChat>["stop"];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  setMessages: ReturnType<typeof useChat>["setMessages"];
}
const WorkflowInput = ({
  status,
  stop,
  sendMessage,
  setMessages,
}: PropsInterface) => {
  const [input, setInput] = useState("");
  const params = useParams();
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input) {
        alert("请输入内容");
        return;
      }
      console.log("input", input);
      const currentConverId = params.id;
      await updateConverHistoryList(currentConverId as string, input);

      sendMessage(
        { text: input },
        {
          body: {
            conversationId: currentConverId as string,
          },
        }
      );
      setInput("");
    },
    [input]
  );
  useEffect(() => {
    console.log("初始化了");
    return () => {
      console.log("销毁了");
    };
  }, []);
  return (
    <form
      className="w-[calc(100%-2rem)]  dark:border-zinc-800 absolute bottom-0"
      onSubmit={handleSubmit}
    >
      <div>
        <div className="flex flex-row-reverse mb-2 pointer-events-none">
          <button
            type="button"
            className="p-2 border border-zinc-300 bg-gray-200 dark:bg-zinc-900 w-max text-xs rounded-md"
            onClick={() => setMessages([])}
          >
            清空当前对话
          </button>
        </div>
        <div className="flex flex-row justify-between bg-gray-100 dark:bg-zinc-900  border border-zinc-300 rounded-xl overflow-auto">
          <textarea
            className="max-w-2xl p-2 flex-1 max-h-12 leading-8 resize-none outline-none"
            value={input}
            placeholder="发消息..."
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() === "") return;
                handleSubmit(e);
              }
            }}
            disabled={status === "streaming"}
          />
          <div>
            <div className="hidden sm:block">
              {status === "streaming" ? (
                <button
                  type="button"
                  className="dark:bg-zinc-900 min-h-12 max-w-md p-2 w-max px-8 bg-zinc-200"
                  onClick={stop}
                >
                  停止
                </button>
              ) : (
                <button
                  type="submit"
                  className="dark:bg-zinc-900 min-h-12 max-w-md p-2 w-max px-8 bg-teal-400 text-teal-700"
                >
                  发送
                </button>
              )}
            </div>
            <div className="sm:hidden">
              {status === "streaming" ? (
                <button
                  type="button"
                  className="dark:bg-zinc-900 min-h-12 max-w-md p-2 w-max px-8 bg-zinc-200"
                  onClick={stop}
                >
                  停止
                </button>
              ) : (
                <button
                  type="submit"
                  className="dark:bg-zinc-900 min-h-12 max-w-md p-2 w-max px-4 bg-teal-400 text-teal-700"
                >
                  ✈️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default memo(WorkflowInput, (prev, next) => {
  console.log("prev.status", prev.status === next.status);
  return prev.status === next.status;
});
