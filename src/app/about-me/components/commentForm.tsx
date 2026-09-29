"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { submitAboutMessage } from "@/lib/data/user/about-action";

// Zod 校验规则
const messageSchema = z.object({
  name: z.string().min(2, "昵称至少2个字符").max(30, "昵称最多30字符"),
  email: z.string().email("请输入有效的邮箱").max(100),
  content: z.string().min(5, "留言至少5个字符").max(500, "留言最多500字符"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export function CommentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    const result = await submitAboutMessage(data);
    if (result.success) {
      toast.success("留言提交成功！");
      reset();
    } else {
      toast.error(result.error || "提交失败，请稍后重试");
    }
  };
  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <div className="flex gap-4 flex-col lg:flex-row">
              <Field>
                <FieldLabel htmlFor="comment-name" className="text-xl">
                  昵称
                </FieldLabel>
                <Input
                  id="comment-name"
                  placeholder="你的昵称"
                  {...register("name")}
                />
                <FieldError className="text-red-500">
                  {errors.name?.message}
                </FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="comment-email" className="text-xl">
                  邮箱
                </FieldLabel>
                <Input
                  id="comment-email"
                  placeholder="用于回复你"
                  {...register("email")}
                />
                <FieldError className="text-red-500">
                  {errors.content?.message}
                </FieldError>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="comment-content" className="text-xl">
                留言内容
              </FieldLabel>
              <Textarea
                id="comment-content"
                placeholder="写下你的想法..."
                rows={4}
                {...register("content")}
              />
              <FieldError className="text-red-500">
                {errors.content?.message}
              </FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
      <Button
        type="submit"
        disabled={isSubmitting}
        className={
          "mt-4 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 cursor-pointer hover:bg-teal-300 dark:hover:bg-teal-600"
        }
      >
        {isSubmitting ? "提交中..." : "提交留言"}
      </Button>
    </form>
  );
}
