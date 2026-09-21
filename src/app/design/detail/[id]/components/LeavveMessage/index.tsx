"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { MessageSquareText } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  leaveMessage: z.string().min(1, "请输入留言"),
  phone: z.string().min(1, "请输入手机号"),
  email: z.string().email("请输入正确的邮箱"),
});
type FormValues = z.infer<typeof formSchema>;
export const LeaveMessage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {};
  return (
    <div>
      {" "}
      <h2 className="text-2xl font-bold my-6 flex items-center gap-2">
        <MessageSquareText size={24} />
        <span>
          留下足迹
          <span className="text-teal-400 hidden lg:inline-block">
            {" "}
            · 在此给作者写下您的留言
          </span>
        </span>
      </h2>
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="rounded-2xl p-6 border-6 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <textarea
              maxLength={500}
              {...register("leaveMessage")}
              className="w-full h-40 min-h-40 max-h-80 outline-none focus:outline-none"
              placeholder="在此给作者写下您的留言"
            ></textarea>
          </div>
          <span
            className={cn("text-red-500 text-sm h-4 w-full inline-block", {
              invisible: !errors.leaveMessage,
            })}
          >
            {errors.leaveMessage && errors.leaveMessage.message}
          </span>
        </div>
        <div>
          <div className="flex flex-col xl:flex-row gap-1 xl:gap-4 mt-2">
            <div className="flex-1">
              <Input
                {...register("phone")}
                type="phone"
                placeholder="请输入您的手机号"
                className="flex-1 block w-full h-max rounded-2xl p-4 border-6 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 outline-none focus:outline-none"
              />
              <span
                className={cn(
                  "text-red-500 text-sm shrink-0 h-4 w-full inline-block",
                  {
                    invisible: !errors.phone,
                  }
                )}
              >
                {errors.phone && errors.phone.message}
              </span>
            </div>
            <div className="flex-1">
              <Input
                {...register("email")}
                type="email"
                placeholder="请输入您的邮箱"
                className="flex-1 block w-full h-fit rounded-2xl p-4 border-6 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 outline-none focus:outline-none"
              />
              <span
                className={cn(
                  "text-red-500 text-sm shrink-0 h-4 w-full inline-block",
                  {
                    invisible: !errors.email,
                  }
                )}
              >
                {errors.email && errors.email.message}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-2 xl:mt-6">
            <Button
              type="submit"
              className="xl:w-60 h-14 rounded-2xl px-4 py-2 bg-gray-300 dark:bg-gray-600 text-2xl font-bold xl:mt-4 cursor-pointer"
            >
              取消留言
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 rounded-2xl px-4 py-2 bg-teal-300 dark:bg-teal-600 text-2xl font-bold xl:mt-4 cursor-pointer"
            >
              提交
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
