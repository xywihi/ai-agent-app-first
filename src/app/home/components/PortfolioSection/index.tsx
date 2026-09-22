import { cn } from "@/app/utils/tools";
import { GroundGlassCard } from "@/components/GroundGlassCard";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { PencilRuler } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { PortfoliosCarousel } from "../PortfoliosCarousel";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import Link from "next/link";

export const PortfolioSection = async <
  T extends { data: { list: ProcessedPortfolioWork[] } | undefined }
>({
  data,
}: T) => {
  const list = data?.list ?? [];
  return (
    <GroundGlassCard
      className={cn("w-[calc(100%-2rem)] 2xl:max-w-1/4 max-w-lg")}
      cardClassName={cn(
        "pt-0 xl:max-h-110 opacity-0 transition-opacity duration-300 ease-out",
        {
          "opacity-100": data,
        }
      )}
    >
      <Suspense
        fallback={
          <Image
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={list[0]?.portfolio_work_images?.[0]?.image_url}
            alt={list[0]?.title ?? "UI设计作品"}
            className="relative z-20 aspect-video w-full object-cover object-top cursor-pointer"
            priority
          />
        }
      >
        <PortfoliosCarousel portfolios={list} />
      </Suspense>

      {/* <CardHeader></CardHeader> */}
      <CardContent>
        {/* <CardAction></CardAction> */}
        <CardTitle className="text-3xl mb-4 flex items-center">
          <PencilRuler size={24} className="mr-2" />
          UI设计作品集
        </CardTitle>
        <CardDescription>
          <p>
            在这里你可以找到
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">VI设计</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">UI设计</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">交互设计</Kbd>、
            <Kbd className="bg-gray-200 dark:bg-gray-700 ml-1">网页设计</Kbd>
            以及
            <Kbd className="bg-gray-200 dark:bg-gray-700">APP设计</Kbd>等。
          </p>
          <p className="mt-8 text-xs text-gray-400">最后更新：2026‑09‑05</p>
        </CardDescription>
      </CardContent>
      <CardFooter className="border-gray-200 dark:border-gray-700">
        <p className="w-full xl:flex">
          <span className="xl:shrink-0">站酷链接：</span>
          <Link
            className="inline-block text-teal-400 w-[calc(100%-0.5rem)] text-wrap truncate underline decoration-1 decoration-teal-400 italic"
            href="https://www.zcool.com.cn/u/ZNjEyODMzODA="
          >
            https://www.zcool.com.cn/u/ZNjEyODMzODA=
          </Link>
        </p>
      </CardFooter>
    </GroundGlassCard>
  );
};
