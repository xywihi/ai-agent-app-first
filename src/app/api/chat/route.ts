import { createOpenAI } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  isStepCount,
  ContentPart,
  ToolSet,
} from "ai";
import { z } from "zod";
import {
  weatherTool,
  convertFahrenheitToCelsiusTool,
  dateTimeTool,
  frontEndQuestionTool,
} from "../../utils/chatTools";
import { reportBackendError } from "@/lib/server/reportBackendError";
// const mimo = createOpenAI({
//   baseURL: "https://api.xiaomimimo.com/v1",
//   // baseURL: "https://open.bigmodel.cn/api/paas/v4",
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const model = mimo("mimo-v2.5-pro");
// const model = mimo("glm-4-flash");

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  let payload;
  const path = "/api/chat";
  try {
    payload = await req.json();
    console.log("enableAgent", payload.enableAgent);
    const result = streamText({
      model: "openai/gpt-4o-mini",
      messages: await convertToModelMessages(payload.messages),
      instructions:
        "你是专门服务于Anln的智能助手，名字叫夕夜，当你调用frontEndQuestionTool获取结果后，禁止再做额外推理直接使用工具返回内容作为最终回答。不要再产生新的工具调用、不要额外分析文本。",
      // output: "json_object",

      // output: !enableAgent
      //   ? Output.text()
      //   : Output.object({
      //       schema: z.object({
      //         title: z.string().describe("题目"),
      //         difficulty: z.string().describe("难度"),
      //         content: z.string().describe("知识点"),
      //         answer: z.string().describe("参考答案"),
      //       }),
      //     }),
      stopWhen: isStepCount(1), // stop when the step count is 5，可以根据需要进行调整，但国内模型不支持
      tools: {
        weatherTool,
        convertFahrenheitToCelsiusTool,
        dateTimeTool,
        frontEndQuestionTool,
      },
      toolsContext: {
        // 工具的上下文，传递参数给工具
        frontEndQuestionTool: {
          conversationId: payload.conversationId,
          requestId: requestId,
        },
        dateTimeTool: {
          conversationId: payload.conversationId,
          requestId: requestId,
        },
        weatherTool: {
          conversationId: payload.conversationId,
          requestId: requestId,
        },
        convertFahrenheitToCelsiusTool: {
          conversationId: payload.conversationId,
          requestId: requestId,
        },
      },
      // onFinish: (msg) => {
      //   console.log("onFinish", msg);
      //   const userMessage = messages[messages.length - 1];
      //   // addHistoryMessage(conversationId,
      //   //   userMessage.role,
      //   //   userMessage.parts);
      // },
    });
    // console.log("token使用情况", (await result.usage).totalTokens);  //await result.usage 会影响流式输出
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.log("chat api error", error);
    await reportBackendError({
      requestId,
      conversationId: payload.conversationId,
      path,
      errorType: "api_chat_handler_exception",
      error,
      meta: {},
    });
    return new Response(JSON.stringify({ error: "服务异常", requestId }), {
      status: 500,
    });
  }
}
