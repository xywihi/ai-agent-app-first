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
        retry: (failureCount, err: unknown) => {
          if (typeof err === "object" && err !== null && "status" in err) {
            if (
              err?.status &&
              Number(err.status) >= 400 &&
              Number(err.status) < 500
            ) {
              return false;
            }
          }

          return failureCount < 2;
        },
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
