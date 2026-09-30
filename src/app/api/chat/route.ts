import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  isStepCount,
  hasToolCall,
} from "ai";
import {
  convertFahrenheitToCelsiusTool,
  dateTimeTool,
  frontEndQuestionTool,
} from "../../utils/chatTools";
import { reportBackendError } from "@/lib/server/reportBackendError";
import { weatherTool } from "@/app/utils/chatTools/weather";
import { createOpenAI } from "@ai-sdk/openai";
import { dateCalcTool } from "@/app/utils/chatTools/dateCalc";
// const mimo = createOpenAI({
//   // baseURL: "https://api.xiaomimimo.com/v1",
//   baseURL: "https://open.bigmodel.cn/api/paas/v4",
//   apiKey: process.env.GLM_API_KEY,
// });
// const model = mimo("mimo-v2.5-pro");
// const model = mimo("glm-4-flash");
// const glm = createOpenAI({
//   baseURL: "https://open.bigmodel.cn/api/paas/v4",
//   apiKey: process.env.GLM_API_KEY,
//   // 关键！强制走 chat/completions，不要用 responses
//   compatibility: "completions",
// });
// const model = glm("glm-4-flash");
const glm = createOpenAI({
  baseURL: "https://open.bigmodel.cn/api/paas/v4",
  apiKey: process.env.GLM_API_KEY,
});
// .chat() 强制使用 chat/completions
const model = glm.chat("glm-5.3-flash");
export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  let payload;
  const path = "/api/chat";
  try {
    payload = await req.json();
    const result = streamText({
      model,
      // model: "openai/gpt-4o-mini",
      messages: await convertToModelMessages(payload.messages),
      instructions: `
      你是专门服务于Anln的智能助手，名字叫夕夜。
      规则：
      1. 只有用户明确要求获取前端面试题目、前端考题时，才可以调用frontEndQuestionTool工具。调用frontEndQuestionTool获取题目结果之后，直接输出题目内容，不要再产生新的工具调用。
      2. weather工具仅在用户明确询问天气时调用，单纯提到城市名称，不是询问天气，禁止调用weatherTool。
      3. 日期计算规则：用户询问倒计时、距离某个节日还有多少天，**必须分步调用工具**：
         ① 先调用 dateTimeTool 获取当前日期；
         ② 拿到当前日期后，调用 dateCalcTool，传入 startDate=当前日期，endDate=目标节日日期（如2027春节：2027-02-06）；
         ③ 使用dateCalcTool返回的remainDays作为最终答案，禁止模型自己估算天数。
         ④ 如果用户不是询问天数，禁止调用dateCalcTool（如询问小时，分钟，秒，年份）。
      4. 不要编造日期，所有日期差值必须使用dateCalcTool计算。
      `,

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
      // stopWhen: isStepCount(hasToolCall("dateTimeTool") ? 1 : 10), // stop when the step count is 5，可以根据需要进行调整，但国内模型不支持
      tools: {
        weatherTool,
        convertFahrenheitToCelsiusTool,
        dateTimeTool,
        dateCalcTool,
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
        dateCalcTool: {
          conversationId: payload.conversationId,
          requestId: requestId,
        },
        weatherTool: {
          conversationId: payload.conversationId,
          requestId: requestId,
          userQuery: payload.userQuery ?? "",
        },
        convertFahrenheitToCelsiusTool: {
          conversationId: payload.conversationId,
          requestId: requestId,
        },
      },
      // toolChoice: "required",
      toolChoice: hasToolCall("dateTimeTool") ? "required" : "none",
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
