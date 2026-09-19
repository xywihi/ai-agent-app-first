import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const Get = async (url: string, headers?: HeadersInit) => {
  const result = await fetch(url, {
    headers: headers,
  });
  if (result.ok) {
    const data = await result.json();
    return data.data;
  }
  throw Response.json({ error: result.statusText }, { status: result.status });
};

export const Post = async (
  url: string,
  {
    body,
    headers,
  }: {
    body: BodyInit;
    headers?: HeadersInit;
  }
) => {
  const result = await fetch(url, {
    method: "POST",
    body,
    headers,
  });
  if (result.ok) {
    const data = await result.json();
    return data.data;
  }
  throw new Error("请求失败");
};

export const Delete = async (url: string, headers?: HeadersInit) => {
  const result = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (result.ok) {
    const data = await result.json();
    return data.data;
  }
  throw new Error("请求失败");
};
