import client from "@/lib/server";
type ReportLogOpt = {
  conversationId?: string | number;
  errorType: string; // 错误类型
  error: unknown; // 错误信息
  extra?: Record<string, unknown>; // 附加信息
};

/**上报错误日志到supabase frontend_error_logs */
export const reportErrorLog = async ({
  conversationId,
  errorType,
  error,
  extra = {},
}: ReportLogOpt) => {
  try {
    const err = error as Error;

    await client.from("frontend_error_logs").insert({
      conversationId,
      error_type: errorType,
      error_name: err?.name ?? "UnknownError",
      error_message: err?.message ?? String(err),
      stack_trace: err?.stack ?? "", //错误堆栈
      page_url: typeof window !== "undefined" ? window.location.href : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "", //浏览器信息
      extra_payload: extra,
    });
  } catch (error) {
    //上报自身失败，静默，不要无限递归
    console.error("上报错误日志失败", error);
  }
};
