import { createOpenAI } from "@ai-sdk/openai";
import { ToolLoopAgent, tool } from "ai";
import { z } from "zod";

const mimo = createOpenAI({
  baseURL: "https://api.xiaomimimo.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});
const model = mimo("mimo-v2.5-pro");

const weatherAgent = new ToolLoopAgent({
  model: model,
  tools: {
    weather: tool({
      description: "获取某个地点的天气情况（以华氏温度为单位）",
      inputSchema: z.object({
        location: z.string().describe("获取天气信息的位置"),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
    convertFahrenheitToCelsius: tool({
      description: "将华氏温度转换为摄氏温度",
      inputSchema: z.object({
        temperature: z.number().describe("用华氏温度表示的温度需要被被转换"),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
});

const result = await weatherAgent.generate({
  prompt: "旧金山地区的天气温度如何，以摄氏度为单位来表示呢？",
});

// console.log(result.text); // agent's final answer
// console.log(result.steps); // steps taken by the agent
export { result };
