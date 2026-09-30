import { tool } from "ai";
import z from "zod";

export const dateCalcTool = tool({
  description:
    "计算两个日期之间相差的天数，用于倒计时。输入开始日期、目标日期（格式YYYY-MM-DD），返回剩余天数。目标日期在未来返回正数，过去返回负数。",
  inputSchema: z.object({
    startDate: z.string().describe("起始日期，格式 YYYY-MM-DD"),
    endDate: z.string().describe("目标截止日期，格式 YYYY-MM-DD"),
  }),
  contextSchema: z.object({
    conversationId: z.string(),
    requestId: z.string(),
  }),
  execute: async ({ startDate, endDate }, { context }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      remainDays: diffDays,
    };
  },
});
