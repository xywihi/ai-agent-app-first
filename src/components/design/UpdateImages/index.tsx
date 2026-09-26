"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { PortfolioWorkImage } from "@/app/utils/api/design/type";
import { toast } from "sonner";
import { Post } from "@/app/utils/query";
import { QueryKeys } from "@/app/utils/query-keys";
import { useQueryClient } from "@tanstack/react-query";

export function UpdateImages({
  setValue,
  defaultImages = [],
}: {
  setValue: any;
  defaultImages: PortfolioWorkImage[];
}) {
  const queryClient = useQueryClient();
  // 存储选中的文件
  const [fileList, setFileList] = useState<File[]>([]);
  // 预览图url数组
  const [previewUrls, setPreviewUrls] =
    useState<PortfolioWorkImage[]>(defaultImages);
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
    const newPreviews = newFiles.map((file) => ({
      image_url: URL.createObjectURL(file),
    }));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // 清空input，保证可以重复选择同一批文件
    if (inputRef.current) inputRef.current.value = "";
  };

  // 删除单张图片
  const handleRemoveImage = async (index: number, item: PortfolioWorkImage) => {
    toast("删除作品", {
      description: "删除后，此图片无法恢复，确定要删除吗?",
      action: {
        label: "确认删除",
        onClick: async () => {
          try {
            if (!item.id) {
              // 释放预览blob内存，防止内存泄漏
              URL.revokeObjectURL(previewUrls[index].image_url);
            } else {
              // 删除后端图片
              await Post("/api/user/design/images/delete", {
                body: JSON.stringify({
                  id: item.id,
                }),
              });
            }
            setFileList(fileList.filter((_, i) => i !== index));
            setPreviewUrls(previewUrls.filter((_, i) => i !== index));
            await queryClient.invalidateQueries({
              queryKey: QueryKeys.portfolio.portfoliosAll,
            });
            toast.success("删除成功", {
              position: "top-center",
              style: {
                backgroundColor: "#00d5be",
                borderRadius: "8px",
              },
            });
          } catch (error) {
            toast.error("删除失败");
          }
        },
      },
      cancel: {
        label: "取消",
        onClick: () => {},
      },
      style: {
        backgroundColor: "white",
        borderRadius: "8px",
      },
    });
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
          {previewUrls.map((item, idx) => (
            <div key={idx} className="relative overflow-hidden aspect-square">
              <Image
                src={item.image_url}
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
                onClick={() => handleRemoveImage(idx, item)}
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
