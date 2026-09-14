"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/server/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  username: z.string().min(2, "用户名至少2个字"),
  password: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });
  const onSubmit = async (data: FormValues) => {
    console.log("data", data);
    const {
      error,
      data: { user },
    } = await createClient().auth.signInWithPassword({
      email: data.username,
      password: data.password,
    });
    if (error) {
      if (error.code === "invalid_credentials") {
        toast.error("用户名或密码错误", {
          position: "top-center",
          style: { backgroundColor: "white" },
        });
      }
    } else {
      toast.success("登录成功", {
        position: "top-center",
        style: { backgroundColor: "white" },
      });
      localStorage.setItem("user", JSON.stringify(user));
      router.replace("/user");
      router.refresh();
    }
  };
  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] flex-1 justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-gray-100 shadow-lg">
        <form
          className="flex flex-col items-center space-y-4 w-lg"
          action=""
          onSubmit={handleSubmit(onSubmit)}
          method="post"
        >
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="text-2xl font-bold w-full">帐号登录</h2>
            <span className="text-nowrap">
              尚未注册，
              <a href="/login/register" className="text-nowrap text-teal-500">
                立即注册
              </a>
            </span>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-2">用户名</label>
            <input
              type="text"
              {...register("username")}
              className="border rounded-lg px-2 py-2 w-full border-teal-500"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-2">密码</label>
            <input
              type="password"
              {...register("password")}
              className="border rounded-lg px-2 py-2 border-teal-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="rounded-lg w-full mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 w-full bg-teal-400 disabled:bg-gray-400 text-center text-white text-xl cursor-pointer"
            >
              {isSubmitting ? "登录中..." : "登录"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
