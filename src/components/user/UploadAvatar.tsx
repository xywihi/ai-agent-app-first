"use client";

import { Input } from "@base-ui/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/app/utils/tools";
import { Post } from "@/app/utils/query";
import { ImageUp } from "lucide-react";

export function UploadAvatarApi({
  className,
  avatarUrl,
}: {
  className?: string;
  avatarUrl?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const submit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    const res = await Post("/api/user/upload-avatar", {
      body: formData,
    });
    if (res) {
      setFileUrl(res.publicUrl);
    }
    setUploading(false);
  };
  return (
    <div className={cn("w-fit h-fit relative group", className)}>
      <Input
        type="file"
        accept="image/*"
        onChange={submit}
        disabled={uploading}
        className="w-24 h-24 rounded-full bg-gray-300 opacity-0"
      />
      <Avatar
        className={
          "w-full h-full absolute top-0 left-0 cursor-pointer select-none pointer-events-none after:absolute after:inset-0 after:rounded-full after:mix-blend-darken after:border-0"
        }
      >
        <AvatarImage src={fileUrl || avatarUrl} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="hidden group-hover:block cursor-pointer select-none pointer-events-none bg-amber-200/40 absolute top-0 left-0 w-full h-full rounded-full">
        <ImageUp
          size={32}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
