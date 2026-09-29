import { redirect } from "next/navigation";
import { toast } from "sonner";

export const Get = async (url: string, headers?: HeadersInit) => {
  const result = await fetch(url, {
    headers: headers,
    next: {
      revalidate: 300,
    },
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
  if (result.status === 401) {
    toast.error("请先登录！", {
      position: "top-center",
      style: {
        backgroundColor: "#FF6470",
        borderRadius: "8px",
      },
    });
    redirect("/login");
  }
  throw new Error("请求失败");
};
