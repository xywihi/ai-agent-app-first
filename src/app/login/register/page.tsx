"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import client from "@/lib/server";
import { useRouter } from "next/navigation";
const formSchema = z
  .object({
    username: z.string().min(2, "用户名至少2个字"),
    password: z.string(),
    confirmPassword: z.string(),
    email: z.email({ message: "请输入正确的邮箱地址" }),
    // captchaCode: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"], // 将错误消息绑定到 confirmPassword 字段
  });
// .superRefine((data, ctx) => {
//   const val = data.email?.trim();
//   //邮箱为空时，不校验
//   if (val === "") return;
//   // 邮箱地址的正则表达式
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(val as string)) {
//     ctx.addIssue({
//       code: "custom",
//       message: "请输入正确的邮箱地址",
//       path: ["email"], // 将错误消息绑定到 email 字段
//     });
//   }
// });
type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const captchaRef = useRef<HCaptcha>(null);
  const [hcaptchaToken, setHcaptchaToken] = useState("");
  const [msg, setMsg] = useState("");
  // const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: FormValues) => {
    if (!hcaptchaToken) {
      alert("请先完成验证");
      return;
    }
    const { error } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
        emailRedirectTo: "/login",
      },
    });
    if (error) {
      setMsg(error.message);
    } else {
      router.push("/login");
      // setMsg("注册成功，请前往邮箱激活");
    }
  };
  const getSmsCode = async () => {
    if (!hcaptchaToken) {
      alert("请先完成验证");
      return;
    }
    const verifyRes = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hcaptchaToken,
      }),
    });
    captchaRef.current?.resetCaptcha();
    setHcaptchaToken("");
  };
  // if (!siteKey) {
  //   return <div>未找到hcaptcha环境变量，未配置</div>;
  // }
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]  flex-1 justify-center items-center">
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-gray-100 shadow-lg">
        <form
          className="flex flex-col items-center space-y-4 xl:w-lg"
          action=""
          onSubmit={handleSubmit(onSubmit)}
          method="post"
        >
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="text-2xl font-bold w-full">帐号注册</h2>
            <span className="text-nowrap">
              已有帐号，
              <a href="/login" className="text-nowrap text-teal-500">
                前往登录
              </a>
            </span>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-2">昵称</label>
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
            <label className="mb-2">
              邮箱
              <span className="text-xs text-gray-500">
                （用于登录和激活帐号）
              </span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="border rounded-lg px-2 py-2 w-full border-teal-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
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
          <div className="flex flex-col w-full">
            <label className="mb-2">确认密码</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="border rounded-lg px-2 py-2 border-teal-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-2">验证人机</label>
            <div className="flex flex-row ">
              {/* <input
                type="text"
                placeholder="请输入验证码"
                {...register("captchaCode")}
                className="border rounded-lg px-2 py-2 w-full border-teal-500"
              /> */}
              <div className="flex-1">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                  onVerify={(token) => setHcaptchaToken(token)}
                />
              </div>
              {/* <button type="button" onClick={getSmsCode}>
                获取验证码
              </button> */}
            </div>
            {/* {errors.captchaCode && (
              <span className="text-red-500 text-sm">
                {errors.captchaCode.message}
              </span>
            )} */}
          </div>
          <div className="rounded-lg w-full bg-teal-400 dark:bg-teal-600 mt-4">
            <button
              type="submit"
              className="rounded-lg px-4 py-2 w-full text-center text-white text-xl cursor-pointer"
            >
              马上注册
            </button>
          </div>
          <div>
            <p>{msg}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
