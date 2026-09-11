import { reportErrorLog } from "@/lib/reportError";
export async function register() {
  if (typeof window === "undefined") return;
  //捕获同步JS错误：组件渲染，语法错误
  window.addEventListener("error", async (event) => {
    await reportErrorLog({
      errorType: "global_js_error",
      error: event.error,
      extra: {
        message: event.message, // 保存消息快照，以便后续调试工具调用问题
        filename: event.filename,
      },
    });
  });
  //捕获未处理Promise reject （fetch、async await忘记catch）
  window.addEventListener("unhandledrejection", async (event) => {
    await reportErrorLog({
      errorType: "promise_unhandled_reject",
      error: event.reason,
    });
  });
}
