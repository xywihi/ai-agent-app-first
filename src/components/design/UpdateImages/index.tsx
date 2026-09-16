"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import Image from "next/image";

export function UpdateImages({ setValue }: { setValue: any }) {
  // 存储选中的文件
  const [fileList, setFileList] = useState<File[]>([]);
  // 预览图url数组
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // 监听fileList
  useEffect(() => {
    setValue("images", fileList);
  }, [fileList]);
  // 触发原生input弹窗
  const handleClickSelect = () => {
    inputRef.current?.click();
  };

  // 选择图片回调
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    // 合并到已有文件（支持多次选图追加）
    const updatedFiles = [...fileList, ...newFiles];
    setFileList(updatedFiles);

    // 生成本地预览url
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // 清空input，保证可以重复选择同一批文件
    if (inputRef.current) inputRef.current.value = "";
  };

  // 删除单张图片
  const handleRemoveImage = (index: number) => {
    // 释放预览blob内存，防止内存泄漏
    URL.revokeObjectURL(previewUrls[index]);

    setFileList(fileList.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* 隐藏原生input */}
      <input
        ref={inputRef}
        type="file"
        multiple // ✅开启多选
        accept="image/*" // 只允许图片
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 视觉按钮 */}
      <Button variant="outline" onClick={handleClickSelect}>
        <Upload className="w-4 h-4 mr-2" />
        选择多张作品图片
      </Button>

      {/* 图片预览区域 */}
      {previewUrls.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative overflow-hidden aspect-square">
              <Image
                src={url}
                alt="preview"
                width={0}
                height={0}
                sizes="100vw"
                className="w-40 h-40 object-cover rounded-xl"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 w-6 h-6"
                onClick={() => handleRemoveImage(idx)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
