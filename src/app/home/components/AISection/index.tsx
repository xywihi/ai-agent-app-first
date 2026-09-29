"use client";
import { createConver, updateConverHistoryList } from "@/app/utils/api/chat";
import { cn } from "@/app/utils/tools";
import { GroundGlassCard } from "@/components/GroundGlassCard";
import { MovingBorder } from "@/components/MovingBorder";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserQuery } from "@/hooks/use-user-query";
import { useMutation } from "@tanstack/react-query";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const AISection = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const { data: user, error, isPending } = useUserQuery();
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    });
    return () => clearTimeout(timer);
  }, []);
  const { mutate: mutateCreate, isPending: isLoadingCreate } = useMutation({
    mutationFn: async () => {
      try {
        if (!inputValue) return;
        const data_create = await createConver();
        return data_create;
      } catch (error) {
        throw new Error("新建对话失败");
      }
    },
    onSuccess: (data_id) => {
      if (!data_id) return;
      router.push(`/chat/${data_id}?message=${inputValue}`);
    },
  });
  return (
    <GroundGlassCard
      className={cn("w-[calc(100%-2rem)] 2xl:max-w-1/4 max-w-lg")}
      cardClassName={cn(
        "flex flex-col xl:max-h-110 transition-all duration-300 ease-out delay-500"
      )}
    >
      <CardContent className="flex-1 p-(--card-spacing) xl:p-8">
        <div className="mb-10 flex justify-center items-center flex-wrap space-x-2 text-xl text-center">
          <span>
            一个名叫<b className="text-teal-400 text-2xl">夕夜</b>
            的AI智能助手
          </span>
          {mounted && <Bot size={26} />}
        </div>
        <MovingBorder>
          {user ? (
            <div className="text-lg flex items-center flex-wrap">
              {mounted && <Bot />}： Hello，
              <b>
                <strong> {user.user_metadata.username}</strong>
              </b>
              ！高兴你的到来。
            </div>
          ) : (
            <div className="text-lg">
              Hello！欢迎来到
              <b>
                <strong> AI智能会话</strong>
              </b>{" "}
              🤖，使用之前请先登录！
            </div>
          )}
        </MovingBorder>
        {user ? (
          <div className="flex space-x-4 mt-6">
            {/* <input
    type="text"
    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-teal-400 dark:bg-teal-600 hover:text-white cursor-pointer"
  /> */}
            <ButtonGroup className="w-full">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                id="input-button-group"
                placeholder="给AI助手发消息..."
                className="h-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg outline-none focus:outline-none focus-visible:ring-0" //清楚input的默认样式
              />
              <Button
                size={"lg"}
                className="h-12 bg-teal-400 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-400 dark:hover:bg-teal-600 hover:text-white"
                onClick={() => mutateCreate()}
              >
                <b>{isLoadingCreate ? "对话请求..." : "开始聊天"}</b>
              </Button>
            </ButtonGroup>

            {/* <Button
    size={"lg"}
    className="p-2 bg-teal-400 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-400 dark:bg-teal-600 hover:text-white cursor-pointer"
    onClick={() => router.push("/chat")}
  >
    开始聊天
  </Button> */}
          </div>
        ) : (
          <div className="flex space-x-4 mt-6">
            <Button
              className="p-2 bg-teal-400 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-400 dark:bg-teal-600 hover:text-white cursor-pointer"
              onClick={() => router.push("/login")}
            >
              去登录
            </Button>
            <Button
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-teal-400 dark:bg-teal-600 hover:text-white cursor-pointer"
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
  );
};
