"use client";
import { GlobalLoading } from "@/components/GlobalLoading";
import { MovingBorder } from "@/components/MovingBorder";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/server/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import z from "zod";
import { Kbd } from "@/components/ui/kbd";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, CircleChevronRight, Computer, PencilRuler } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { GlobalModel } from "@/components/GlobalModel";
import { GroundGlassCard } from "@/components/GroundGlassCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
interface ConverInterface {
  currentConverId: number | string;
  currentConverName: string;
}
interface ChatConverInterface {
  converData: ConverInterface;
}
interface ChatContextInterface {
  chatState: ChatConverInterface;
  dispatch: React.Dispatch<{ type: string; payload: number | string | object }>;
  handleRefreshConerHistoryList: (toCreateNewConver?: boolean) => void;
}

const initialState: ChatConverInterface = {
  converData: {
    currentConverId: "",
    currentConverName: "",
  },
};
const Schema = z.object({
  user: z.object({
    id: z.string(),
    user_metadata: z.object({
      email: z.string(),
      username: z.string(),
    }),
  }),
});
type User = z.infer<typeof Schema>;
export const ChatContext = createContext<ChatContextInterface>({
  chatState: initialState,
  dispatch: () => {},
  handleRefreshConerHistoryList: () => {},
});
const images = [
  "https://qflukknufugagvwhtpgs.supabase.co/storage/v1/object/sign/images/0168c85d22f766a80121376304ede5.webp?token=eyJraWQiOiJmZjBlMjA3MC1mZmZjLTRlOWYtYmRhYy1jODg5NDdkYmRkODIiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZXMvMDE2OGM4NWQyMmY3NjZhODAxMjEzNzYzMDRlZGU1LndlYnAiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4NTQ5NDM4LCJleHAiOjE4MjAwODU0Mzh9.SVL0VBNAPBlCUYXKoVsuGPdVAi_H-KirCDNrGxw2ZrDy_yeo_ZegKuZp9HmfC4iZgQMwCT00XNZ0iXQ9PePfew",
  "https://qflukknufugagvwhtpgs.supabase.co/storage/v1/object/sign/images/looking.webp?token=eyJraWQiOiJmZjBlMjA3MC1mZmZjLTRlOWYtYmRhYy1jODg5NDdkYmRkODIiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZXMvbG9va2luZy53ZWJwIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4ODU0OTY1NiwiZXhwIjoxODIwMDg1NjU2fQ.3bgKPdwzKRN5xeoPXctidG3BZrZClt1r2SInTm-khrL8qUH9clb3rGT0KBIa6OORyHbkUYN66OHYPwDQk-9IYg",
  "https://qflukknufugagvwhtpgs.supabase.co/storage/v1/object/sign/images/panda.webp?token=eyJraWQiOiJmZjBlMjA3MC1mZmZjLTRlOWYtYmRhYy1jODg5NDdkYmRkODIiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZXMvcGFuZGEud2VicCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODg1NDk2OTksImV4cCI6MTgyMDA4NTY5OX0.qYTDRrlbBwO3nw_DfttMyrxCwwJDVerNXXlsuEQmiWY1r3GZZwgWky2OQly0dtUXSgsw-7KOeG6DnSyn5rLrIA",
  "https://qflukknufugagvwhtpgs.supabase.co/storage/v1/object/sign/images/trip.webp?token=eyJraWQiOiJmZjBlMjA3MC1mZmZjLTRlOWYtYmRhYy1jODg5NDdkYmRkODIiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZXMvdHJpcC53ZWJwIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4ODU0OTcxMywiZXhwIjoxODIwMDg1NzEzfQ.gZMsy6HA0xV6uWguaDzUjoHBRvURidEe3_kN6Ue8VBvsFBJpjam6J1HRs0KaPba2ixl0BfSXT6R1_dYRUY9xkQ",
  "https://qflukknufugagvwhtpgs.supabase.co/storage/v1/object/sign/images/vi.webp?token=eyJraWQiOiJmZjBlMjA3MC1mZmZjLTRlOWYtYmRhYy1jODg5NDdkYmRkODIiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZXMvdmkud2VicCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODg1NDk3MjcsImV4cCI6MTgyMDA4NTcyN30.muV02BpxhJJ652OSWz6jdzV10uIhUys5nDr-dYJTKl--ROKfPzeHWHTUX6E_hRtS4hrk26m-DmJFh0TLM_7EAw",
  "https://img.zcool.cn/community/031oaeewl93qrdodxkbghtg3030.png?k=616de91a187927b7389f41c6721eec2b&t=6a9d8e00&x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/quality,q_80/format,webp",
];
const technologies = [
  "React / React19 新特性与Hooks实战",
  "Next.js App Router 路由、布局、服务端组件",
  "TypeScript 类型实践、工程化配置",
  "TanStack Query 数据状态管理",
  "Vercel-AI-SDK｜AI Agent工具调用开发",
  "前端性能优化、组件设计模式",
  "Vercel AI SDK - AI Agent工具调用开发",
  "Vercel AI SDK - AI Agent工具调用开发1",
  "Vercel AI SDK - AI Agent工具调用开发2",
  "Vercel AI SDK - AI Agent工具调用开发3",
  "Vercel AI SDK - AI Agent工具调用开发4",
];
export default function Chat() {
  const supabase = createClient();
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [showImageIndex, setShowImageIndex] = useState<number | null>(null);
  // const [user, setUser] = useState<User>();
  useEffect(() => {
    if (!api) {
      return;
    }
    queueMicrotask(() => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);

      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    });
  }, [api]);
  const { data, isFetching, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const result = await supabase.auth.getUser();
      const user = Schema.safeParse(result.data);
      if (user.success) {
        return user.data;
      } else {
        throw new Error(user.error.message);
      }
    },
    refetchOnWindowFocus: false,
  });
  const handleSendMessage = async () => {
    // const response = await fetch("/api/chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ message }),
    // });
    // const data = await response.json();
    // return data;
  };
  if (isFetching) {
    return <GlobalLoading />;
  }
  return (
    // <div className="flex-1 flex flex-col justify-between items-center bg-linear-to-br from-white via-slate-50 to-zinc-50">
    <div className="flex-1 flex flex-col justify-between items-center pb-98">
      <div className="w-full pt-20 pb-12 px-4 rounded-2xl mb-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="text-slate-800 mb-8">
            <h1 className="text-6xl font-bold">
              探索设计 · 前端 ·{" "}
              <span className="text-blue-600">AI 全栈实践</span>
            </h1>
            <p className="text-xl mt-8 flex gap-2 justify-center">
              <span className="text-slate-500 border border-dashed rounded-xl px-2">
                作品集
              </span>
              <span className="text-slate-500 border border-dashed rounded-xl px-2">
                技术笔记
              </span>
              <span className="text-slate-500 border border-dashed rounded-xl px-2">
                可交互项目演示
              </span>
            </p>
          </div>
          <p className="text-slate-500 text-base">
            汇集UI设计作品、前端实战笔记、AI交互Demo。记录设计、编码与AI-Agent全栈开发实践，全部项目附带源码与可运行示例。
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col 2xl:flex-row justify-center items-center gap-8">
        <GroundGlassCard
          className="w-1/2 2xl:max-w-1/4 min-w-md"
          cardClassName="pt-0 max-h-110"
        >
          <div className="relative max-h-[20vh] min-h-[210px] flex">
            <Carousel
              className="w-full flex-1 overflow-auto flex"
              plugins={[plugin.current]}
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="flex-1">
                {images.map((item, index) => (
                  <CarouselItem key={index}>
                    <Image
                      width={800}
                      height={600}
                      loading="eager"
                      fetchPriority="auto"
                      src={item}
                      alt="Event cover"
                      className="relative z-20 aspect-video w-full object-cover object-top"
                      onClick={() => setShowImageIndex(index)}
                    />
                    {showImageIndex === index && (
                      <GlobalModel
                        handleShowModel={() => setShowImageIndex(null)}
                      >
                        <Image
                          width={600}
                          height={900}
                          loading="eager"
                          src={item}
                          alt="Event cover"
                          className="relative z-20 aspect-video w-full object-cover object-top rounded-2xl select-none [-webkit-user-drag:none]"
                        />
                      </GlobalModel>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute bottom-2 left-2 text-white">
              {count}/<b className="text-lg ml-1">{current}</b>
            </div>
          </div>

          {/* <CardHeader></CardHeader> */}
          <CardContent>
            {/* <CardAction></CardAction> */}
            <CardTitle className="text-3xl mb-4 flex items-center">
              <PencilRuler size={24} className="mr-2" />
              UI设计作品集
            </CardTitle>
            <CardDescription>
              <p>
                在这里你可以找到
                <Kbd className="bg-gray-200 ml-1">VI设计</Kbd>、
                <Kbd className="bg-gray-200 ml-1">UI设计</Kbd>、
                <Kbd className="bg-gray-200 ml-1">交互设计</Kbd>、
                <Kbd className="bg-gray-200 ml-1">网页设计</Kbd>
                以及
                <Kbd className="bg-gray-200">APP设计</Kbd>等。
              </p>
              <p className="mt-8 text-xs text-gray-400">最后更新：2026‑09‑05</p>
            </CardDescription>
          </CardContent>
          <CardFooter className="border-gray-200">
            <p>
              站酷链接：
              <a
                className="text-teal-400 underline decoration-1 decoration-teal-400 italic"
                href="https://www.zcool.com.cn/u/ZNjEyODMzODA="
              >
                https://www.zcool.com.cn/u/ZNjEyODMzODA=
              </a>
            </p>
          </CardFooter>
        </GroundGlassCard>
        <GroundGlassCard
          className="w-1/2 2xl:max-w-1/4 min-w-md"
          cardClassName="flex flex-col max-h-110"
        >
          <CardHeader>
            <CardTitle className="text-3xl flex items-center">
              <Computer size={24} className="mr-2" />
              前端学习总结
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto flex flex-col">
            <CardAction className="flex gap-2 mb-4 justify-self-start">
              <Button size="sm" className="border border-gray-200 rounded-xl">
                React学习笔记
              </Button>
              <Button size="sm" className="border border-gray-200 rounded-xl">
                Vue学习笔记
              </Button>
              <Button size="sm" className="border border-gray-200 rounded-xl">
                前端优化笔记
              </Button>
            </CardAction>
            <CardDescription>
              <p>
                整理主流前端框架与AI全栈开发实战笔记，包含
                <Kbd className="bg-gray-200 ml-1">React</Kbd>、
                <Kbd className="bg-gray-200 ml-1">Vue</Kbd>、
                <Kbd className="bg-gray-200 ml-1">Next.js</Kbd>、
                <Kbd className="bg-gray-200 ml-1">工程化</Kbd>、
                <Kbd className="bg-gray-200 ml-1">性能优化</Kbd>、
                <Kbd className="bg-gray-200 ml-1">AI‑SDK应用开发</Kbd>、
                配套可运行Demo与代码示例。
              </p>
            </CardDescription>
            <ScrollArea className="flex-1 overflow-auto rounded-md mt-4">
              <div className="flex flex-col space-y-2">
                {technologies.map((item, index) => (
                  // 解决border影响元素高度问题
                  <div key={index} className="h-11 relative group">
                    <Item className="flex-nowrap border border-gray-200 group-hover:border-transparent">
                      <ItemContent className="flex-1 min-w-0 flex max-w-md">
                        {/* 文本省略号会受flex、width: fit-content影响 */}
                        <ItemTitle className="block w-auto flex-1 min-w-0 truncate">
                          {item}
                        </ItemTitle>
                        {/* <ItemDescription>{item}</ItemDescription> */}
                      </ItemContent>
                      <ItemActions className="group-hover:block hidden shrink-0">
                        <CircleChevronRight size={20} color="teal" />
                      </ItemActions>
                    </Item>
                    <div className="absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent group-hover:border-teal-400 transition-colors" />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="mt-8 text-xs text-gray-400">最后更新：2026‑09‑05</p>
          </CardContent>
          <CardFooter className="border-gray-200">
            <p>
              GitHub：
              <a
                className="text-teal-400 underline decoration-1 decoration-teal-400 italic"
                href="https://www.github.com.cn/u/ZNjEyODMzODA="
              >
                https://www.github.com/xywhi
              </a>
            </p>
          </CardFooter>
        </GroundGlassCard>
        <GroundGlassCard
          className="w-1/2 2xl:max-w-1/4 min-w-md"
          cardClassName="flex flex-col max-h-110"
        >
          <CardContent className="flex-1 p-8">
            <p className="mb-10 flex justify-center items-center flex-wrap space-x-2 text-xl text-center">
              <span>
                一个名叫<b className="text-teal-400 text-2xl">夕夜</b>
                的AI智能助手
              </span>
              <Bot size={26} />
            </p>
            <MovingBorder className="mb-4">
              {data?.user ? (
                <p className="text-lg flex items-center flex-wrap">
                  <Bot />： Hello，
                  <b>
                    <strong> {data?.user.user_metadata.username}</strong>
                  </b>
                  ！高兴你的到来。
                </p>
              ) : (
                <p className="text-lg">
                  Hello！欢迎来到
                  <b>
                    <strong> AI智能会话</strong>
                  </b>{" "}
                  🤖，使用之前请先登录！
                </p>
              )}
            </MovingBorder>
            {data?.user ? (
              <div className="flex space-x-4">
                {/* <input
          type="text"
          className="p-2 bg-gray-200 rounded-lg hover:bg-teal-400 hover:text-white cursor-pointer"
        /> */}
                <ButtonGroup className="w-full">
                  <Input
                    id="input-button-group"
                    placeholder="给AI助手发消息..."
                    className="h-full bg-gray-100 border-none rounded-lg outline-none focus:outline-none focus-visible:ring-0"
                  />
                  <Button
                    size={"lg"}
                    className="h-12 bg-teal-400 text-white rounded-lg hover:bg-teal-400 hover:text-white"
                    onClick={handleSendMessage}
                  >
                    <b>开始聊天</b>
                  </Button>
                </ButtonGroup>

                {/* <Button
          size={"lg"}
          className="p-2 bg-teal-400 text-white rounded-lg hover:bg-teal-400 hover:text-white cursor-pointer"
          onClick={() => router.push("/chat")}
        >
          开始聊天
        </Button> */}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button
                  className="p-2 bg-teal-400 text-white rounded-lg hover:bg-teal-400 hover:text-white cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  去登录
                </Button>
                <Button
                  className="p-2 bg-gray-200 rounded-lg hover:bg-teal-400 hover:text-white cursor-pointer"
                  onClick={() => router.push("/login/register")}
                >
                  去注册
                </Button>
              </div>
            )}
            <p className="mt-10 flex flex-col space-y-2 text-center">
              <span>
                智能AI对话助手，支持
                <span className="underline">工具调用</span>、
                <span className="underline">实时问答</span>。
              </span>
              <span>
                可以帮你搞定<span className="underline">面试问答</span>、
                <span className="underline">答疑解惑</span>
                ，高效解决各类学习与日常问题。
              </span>
            </p>
            <p className="mt-8 text-xs text-center text-gray-400">
              最后更新：2026‑09‑05
            </p>
          </CardContent>
        </GroundGlassCard>
      </div>
    </div>
  );
}
