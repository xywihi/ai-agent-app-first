import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone, hcaptchaToken } = await req.json();

  // hCaptcha校验
  const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.HCAPTCHA_SECRET_KEY!,
      response: hcaptchaToken,
    }),
  });
  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return NextResponse.json({ error: "人机验证失败" }, { status: 400 });
  }

  // 校验通过，往下执行发送短信逻辑
  return NextResponse.json({ success: true });
}
