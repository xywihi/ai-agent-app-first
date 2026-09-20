import { createClient } from "@supabase/supabase-js";
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
);

type BackendLogOpt = {
  conversationId?: string | number;
  requestId?: string;
  path: string;
  errorType: string;
  error: unknown;
  requestPayload?: Record<string, unknown>; //请求体
  meta?: Record<string, unknown>;
};

export async function reportBackendError({
  conversationId,
  requestId,
  path,
  errorType,
  error,
  requestPayload,
  meta = {},
}: BackendLogOpt) {
  try {
    const err = error as Error;
    await supabaseServer.from("backend_error_logs").insert({
      conversation_id: conversationId,
      request_id: requestId,
      path,
      error_type: errorType,
      error_name: err?.name ?? "ServerUnknownError",
      error_message: err?.message ?? String(err),
      stack_trace: err?.stack ?? "", //错误堆栈
      request_payload: requestPayload,
      meta,
    });
  } catch (error) {
    //上报自身失败，静默，避免无限异常循环
    console.error("服务端日志上传失败", error);
  }
}
