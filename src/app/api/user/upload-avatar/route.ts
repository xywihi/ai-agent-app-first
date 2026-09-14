import { createServer } from "@/lib/server/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log("user", user);
    console.log("authError", authError);
    if (authError || !user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;
    if (!file) {
      return NextResponse.json({ error: "没有文件" }, { status: 400 });
    }

    // 校验
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "仅支持图片" }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "图片最大2MB" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    // 上传storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // 更新profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);
    if (updateError) throw updateError;

    return NextResponse.json({ data: { publicUrl }, error: null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
