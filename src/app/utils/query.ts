export const Get = async (url: string, headers?: HeadersInit) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https//ai-agent-app-first.vercel.app";
  const result = await fetch(baseUrl + url, {
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
