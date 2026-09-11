"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ 在组件外部创建（全局单例）
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 默认 1 分钟视为新鲜
        refetchOnWindowFocus: false, // 窗口聚焦时不自动刷新（按需）
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
