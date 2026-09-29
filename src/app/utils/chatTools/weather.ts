import { reportBackendError } from "@/lib/server/reportBackendError";
import { tool } from "ai";
import { z } from "zod";

// 天气工具
const weatherTool = tool({
  description:
    "查询指定城市的实时天气，用户问某地天气时调用。参数为城市中文名，例如：成都、上海、北京。",
  inputSchema: z.object({
    city: z.string().describe("城市名称，中文，如：成都"),
  }),
  contextSchema: z.object({
    conversationId: z.string(),
    requestId: z.string(),
  }),
  execute: async ({ city }, { context }) => {
    console.log("city", city);
    try {
      // 1. 地理编码：城市名称转经纬度（open-meteo自带地理编码接口）
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=zh`
      );
      const geoJson = await geoRes.json();
      if (!geoJson.results || geoJson.results.length === 0) {
        return { error: `找不到城市：${city}` };
      }
      const { latitude, longitude, name, country } = geoJson.results[0];

      // 2. 获取实时天气
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const weatherJson = await weatherRes.json();
      const current = weatherJson.current;

      // 天气code映射中文描述
      const getWeatherText = (code: number) => {
        if (code <= 1) return "晴";
        if (code <= 3) return "多云";
        if (code <= 48) return "雾";
        if (code <= 57) return "毛毛雨";
        if (code <= 67) return "雨";
        if (code <= 77) return "雪";
        if (code <= 82) return "阵雨";
        return "强对流天气";
      };

      return {
        city: name,
        country,
        temperature: current.temperature_2m, // ℃
        humidity: current.relative_humidity_2m, // %
        windSpeed: current.wind_speed_10m, // km/h
        weather: getWeatherText(current.weather_code),
      };
    } catch (error) {
      await reportBackendError({
        conversationId: context.conversationId,
        requestId: context.requestId,
        path: "/api/chat tool execute",
        errorType: "tool_execute_error",
        error: error,
        meta: { toolName: "weatherTool", input: location },
      });
      throw error; //继续抛出，让AI-SDK生成output-error tool part给到前端
    }
  },
});

export { weatherTool };
