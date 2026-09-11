"use client";

import { ChatMarkDown } from "@/components/ChatMarkDown";

interface QuestionData {
  title: string;
  difficulty: string;
  content: string;
  answer: string;
  codeLanguageType: string;
}
interface PropsInterface {
  type: string;
  data: string | QuestionData | null;
}
export const AiAnswer = ({ type, data }: PropsInterface) => {
  if (data && type === "object" && typeof data === "object") {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">题目：</h2>
          {data.title}
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">难度：</h2>
          {data.difficulty}
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">知识点：</h2>
          {data.content}
        </div>
        {data.answer && (
          <div className="mb-4">
            <h2 className="text-xl font-bold">参考答案：</h2>
            {/* <pre className="whitespace-pre-wrap">
              {data.answer.replace(/\\n/g, "\n")}
            </pre> */}
            <ChatMarkDown
              languageType={data.codeLanguageType}
              content={data.answer}
            />
          </div>
        )}
      </div>
    );
  } else if (type === "pre" && typeof data === "string") {
    return <pre>{data}</pre>;
  }
  return <div>{data as string}</div>;
};
