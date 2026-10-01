import { cn } from "@/app/utils/tools";
import { AiAnswer } from "@/components/AiAnswer";
import { CopyButton } from "@/components/ui/copy-button";
import { SpeechButton } from "@/components/ui/speech-button";
import { UIMessage } from "ai";
import { useCallback } from "react";

type LocationType = {
  country: string;
  city: string;
  temperature: number;
  weather: string;
  windSpeed: number;
  humidity: number;
};
type UIPart = UIMessage["parts"][number];
export const WeatherCard = ({
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
        if (part.type === "tool-weatherTool") {
          const { city, temperature, weather, windSpeed, humidity, country } =
            part.output as LocationType;
          str += `${city}的天气为：${temperature}°C，${weather}，风速为${windSpeed}米/秒，湿度为${humidity}%。`;
        }
      });
      return str;
    } catch (error) {}
  }, []);
  const partsString = useCallback(() => {
    try {
      if (part.type === "tool-weatherTool") {
        const { city, temperature, weather, windSpeed, humidity, country } =
          part.output as LocationType;
        if (!city) return <div>未找到该城市的天气信息</div>;
        //执行中状态

        // if (!part.output)
        //   return (
        //     <p
        //       key={`${message.id}-${i}`}
        //       className="w-fit text-sm rounded-2xl text-gray-400 bg-gray-100 dark:bg-gray-700"
        //     >
        //       正在获取{city}天气...
        //     </p>
        //   );
        const weatherData = `${city}的天气为：${temperature}°C，${weather}，风速为${windSpeed}米/秒，湿度为${humidity}%。`;
        return (
          <div className="">
            <AiAnswer type="string" data={weatherData} />
          </div>
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }, []);
  return (
    <div
      key={message.id}
      className={cn("whitespace-pre-wrap flex flex-col", {
        "mb-8":
          part.type === "tool-weatherTool" && part.state === "output-available",
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
      {part.type === "tool-weatherTool" && (
        <p className="w-fit text-sm rounded-2xl text-gray-400 px-4 py-2 bg-gray-100 dark:bg-gray-700">
          {part.state === "input-streaming" && "正在调用天气工具"}
          {part.state !== "output-available" &&
            part.state !== "input-streaming" &&
            "正在获取城市天气..."}
        </p>
      )}
      {message.role === "assistant" &&
        part.type === "tool-weatherTool" &&
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
