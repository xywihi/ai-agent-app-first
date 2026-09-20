import { UIDataTypes, UIMessagePart, UITools } from "ai";
import client from "@/lib/server";
export interface ConverHistoryListInterface {
  id: number;
  conversation_name: string;
}

export const createApprovalTask = async (
  requestId: string,
  approver: string,
  amount: number,
  reason: string
) => {
  const { data, error } = await client
    .from("approval_tasks")
    .insert({ request_id: requestId, approver, amount, reason });
  if (error) {
    console.log("error", error);
    return;
  }
  return data;
};

export const checkApprovalStatus = async (requestId: string) => {
  const data = await client
    .from("approval_tasks")
    .select("*")
    .eq("request_id", requestId)
    .single();
  return data;
};
export const updateApprovalStatus = async (
  requestId: string,
  status: string
) => {
  const data = await client
    .from("approval_tasks")
    .update({ status })
    .eq("request_id", requestId);
  return data;
};

export const createThread = async (threadId: string, state: unknown) => {
  const { data, error } = await client
    .from("agent_threads")
    .upsert(
      { thread_id: threadId, state, updated_at: new Date() },
      { onConflict: "thread_id" }
    )
    .select();
  if (error) {
    console.log("error", error);
    return;
  }
  return data;
};

export const checkThreadStatus = async (threadId: string) => {
  const data = await client
    .from("agent_threads")
    .select("*")
    .eq("thread_id", threadId)
    .single();
  return data;
};

export interface ConverHistoryListInterface {
  id: number;
  conversation_name: string;
}

export const getHistoryMessages = async (conversation_id: string | number) => {
  if (!conversation_id) {
    return;
  }

  //查询conversation_id为2的数据
  const { data, error } = await client
    .from("workflow_history_list")
    .select("*")
    .eq("id", conversation_id);
  // .single();
  if (error) {
    console.log("error", error);
    throw error;
  }
  const { data: historyData, error: historyError } = await client
    .from("workflow_history")
    .select("*")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });
  if (historyError) {
    console.log("historyError", historyError);
    return;
  }
  console.log("data", { historyData, currentItem: data });
  const remouldData = historyData.map((item) => {
    return {
      id: item.message_id,
      role: item.role,
      parts: item.content,
    };
  });
  return { historyData: remouldData, currentItem: data };
};

export const addHistoryMessage = async (
  conversationId: string | number,
  role: string,
  content: UIMessagePart<UIDataTypes, UITools>[],
  message_id: string
) => {
  const { data, error } = await client
    .from("workflow_history")
    .insert({ conversation_id: conversationId, role, content, message_id });
  if (error) {
    console.log("error", error);
    return;
  }
};

export const createWorkflow = async () => {
  const { error } = await client
    .from("workflow_history_list")
    .insert({ conversation_name: "新建对话" });
  if (error) {
    throw new Error("新建对话失败");
  }
  const { data: historyData, error: historyError } = await client
    .from("workflow_history_list")
    .select("*");

  if (historyError) {
    console.log("historyError", historyError);
    return;
  }
  console.log("data", historyData, [...historyData].pop()?.id);
  return [...historyData].pop()?.id;
};

export const getWorkflowHistoryList = async () => {
  const { data, error } = await client
    .from("workflow_history_list")
    .select("*");
  if (error) {
    console.log("error", error);
    return;
  }
  console.log("workflow_history_list data", data);
  return data.reverse();
};

export const deleteWorkflowHistoryList = async (id: string | number) => {
  const { data, error } = await client
    .from("workflow_history_list")
    .delete()
    .eq("id", id);
  if (error) {
    console.log("error", error);
    return;
  }
};

//更新对话历史某项
export const updateWorkflowHistoryList = async (
  id: string,
  conversation_name: string
) => {
  const { data, error } = await client
    .from("workflow_history_list")
    .update({ conversation_name: conversation_name, updated_at: new Date() })
    .eq("id", id);
  if (error) {
    console.log("error", error);
    return;
  }
};
