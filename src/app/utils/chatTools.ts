import { reportBackendError } from "@/lib/server/reportBackendError";
import { tool } from "ai";
import { z } from "zod";

export const extractJsonFromAiText = (aiText: string) => {
  let jsonstr = aiText.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  const startIndex = jsonstr.indexOf("{");
  const endIndex = jsonstr.lastIndexOf("}");
  if (startIndex === -1 || endIndex === -1) return null;
  jsonstr = jsonstr.slice(startIndex, endIndex + 1);
  console.log("jsonstr1", jsonstr);
  try {
    const data = JSON.parse(jsonstr);
    return data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export const frontEndQuestionTool = tool({
  description: "前端面试或技术问题，包含React/Vue/Angular等前端框架",
  inputSchema: z.object({
    // question: z.string().describe("前端问题"),
    title: z.string().describe("题目"),
    difficulty: z.string().describe("简单/中等/困难"),
    content: z.string().describe("知识要点"),
    answer: z
      .string()
      .describe(
        "参考答案,可能包含代码块,如果有的话，代码块的语言类型需要是json。"
      ),
    codeLanguageType: z.string().describe("代码语言类型"),
  }),
  // outputSchema: z.object({
  //   title: z.string(),
  //   difficulty: z.string(),
  //   content: z.string(),
  //   answer: z.string(),
  // }),
  contextSchema: z.object({
    conversationId: z.string(),
    requestId: z.string(),
  }),
  execute: async (args, { context }) => {
    try {
      return args;
    } catch (err) {
      await reportBackendError({
        conversationId: context.conversationId,
        requestId: context.requestId,
        path: "/api/chat tool execute",
        errorType: "tool_execute_error",
        error: err,
        meta: { toolName: "frontEndQuestionTool", input: args },
      });
      throw err; //继续抛出，让AI-SDK生成output-error tool part给到前端
    }
  },
});
export const weatherTool = tool({
  description: "获取某个地点的天气情况（以华氏温度为单位）",
  inputSchema: z.object({
    location: z.string().describe("获取天气信息的位置"),
  }),
  outputSchema: z.object({
    location: z.string(),
    temperature: z.number(),
  }),
  contextSchema: z.object({
    conversationId: z.string(),
    requestId: z.string(),
  }),
  execute: async ({ location }, { context }) => {
    const temperature = Math.round(Math.random() * (90 - 32) + 32);
    console.log("模拟数据：", { location, temperature });
    try {
      return {
        location,
        temperature,
      };
    } catch (err) {
      await reportBackendError({
        conversationId: context.conversationId,
        requestId: context.requestId,
        path: "/api/chat tool execute",
        errorType: "tool_execute_error",
        error: err,
        meta: { toolName: "weatherTool", input: location },
      });
      throw err; //继续抛出，让AI-SDK生成output-error tool part给到前端
    }
  },
});

export const convertFahrenheitToCelsiusTool = tool({
  description: "将华氏温度转换为摄氏温度",
  inputSchema: z.object({
    temperature: z.number().describe("用华氏温度表示的温度需要被被转换"),
  }),
  contextSchema: z.object({
    conversationId: z.string(),
    requestId: z.string(),
  }),
  execute: async ({ temperature }, { context }) => {
    const celsius = Math.round((temperature - 32) * (5 / 9));
    try {
      return {
        celsius,
      };
    } catch (err) {
      await reportBackendError({
        conversationId: context.conversationId,
        requestId: context.requestId,
        path: "/api/chat tool execute",
        errorType: "tool_execute_error",
        error: err,
        meta: {
          toolName: "convertFahrenheitToCelsiusTool",
          input: temperature,
        },
      });
      throw err; //继续抛出，让AI-SDK生成output-error tool part给到前端
    }
  },
});

export const dateTimeTool = tool({
  description: "获取当前日期和时间",
  inputSchema: z.object({}),
  contextSchema: z.object({
    conversationId: z.string(),
    requestId: z.string(),
  }),
  execute: async (_, { context }) => {
    const now = new Date();
    try {
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      };
    } catch (err) {
      await reportBackendError({
        conversationId: context.conversationId,
        requestId: context.requestId,
        path: "/api/chat tool execute",
        errorType: "tool_execute_error",
        error: err,
        meta: { toolName: "dateTimeTool", input: "" },
      });
      throw err; //继续抛出，让AI-SDK生成output-error tool part给到前端
    }
  },
});
