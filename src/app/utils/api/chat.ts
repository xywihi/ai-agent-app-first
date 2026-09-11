import { UIDataTypes, UIMessagePart, UITools } from "ai";
import { createClient } from "@/lib/server/client";
import z from "zod";
import { th } from "zod/v4/locales";
export interface ConverHistoryListInterface {
  id: number;
  conversation_name: string;
}

export const getHistoryMessages = async (conversation_id: string | number) => {
  if (!conversation_id) {
    return;
  }
  const client = createClient();
  //查询conversation_id为2的数据
  const { data, error } = await client
    .from("conversation_history_list")
    .select("*")
    .eq("id", conversation_id)
    .single();
  if (error) {
    console.log("error", error);
    throw error;
  }
  console.log("data", data);
  const { data: historyData, error: historyError } = await client
    .from("conversation_history")
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
  const client = createClient();
  const { data, error } = await client
    .from("conversation_history")
    .insert({ conversation_id: conversationId, role, content, message_id });
  if (error) {
    console.log("error", error);
    return;
  }
  console.log("data", data);
};

export const createConver = async (user_id: string) => {
  const client = createClient();
  const { error } = await client
    .from("conversation_history_list")
    .insert({ conversation_name: "新建对话", user_id });
  if (error) {
    throw new Error("新建对话失败");
  }
  const { data: historyData, error: historyError } = await client
    .from("conversation_history_list")
    .select("*")
    .eq("user_id", user_id);

  if (historyError) {
    console.log("historyError", historyError);
    return;
  }
  console.log("data", historyData, [...historyData][0]?.id);
  return [...historyData][0]?.id;
};
export const ConverListSchema = z.array(
  z.object({
    id: z.number(),
    conversation_name: z.string(),
    user_id: z.string(),
  })
);
export const getConverHistoryList = async (user_id: string) => {
  const client = createClient();
  const { data, error } = await client
    .from("conversation_history_list")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.log("error", error);
    return;
  }
  const converList = ConverListSchema.safeParse(data);
  if (converList.success) {
    console.log("conversation_history_list data", data);
    return converList.data;
  } else {
    console.log("error_获取对话历史失败", converList.error);
    throw new Error("获取对话历史失败");
  }
};

export const deleteConverHistoryList = async (id: string | number) => {
  const client = createClient();
  const { data, error } = await client
    .from("conversation_history_list")
    .delete()
    .eq("id", id);
  if (error) {
    console.log("error", error);
    return;
  }
  console.log("data", data);
};

//更新对话历史某项
export const updateConverHistoryList = async (
  id: string,
  conversation_name: string
) => {
  const client = createClient();
  const { data, error } = await client
    .from("conversation_history_list")
    .update({ conversation_name: conversation_name, updated_at: new Date() })
    .eq("id", id);
  if (error) {
    console.log("error", error);
    return;
  }
  console.log("data", data);
};
