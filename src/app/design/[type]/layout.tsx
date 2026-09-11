"use client";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { ChevronRight, Feather } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/app/utils/tools";
import { GlobalModel } from "@/components/GlobalModel";
import { ca } from "zod/v4/locales";
const designs: {
  id: number;
  name: string;
  path: string;
  description: string;
  count: number;
  icon: Parameters<typeof Icon>[0]["name"];
}[] = [
  {
    id: 1,
    name: "全部设计",
    path: "/design/all",
    description:
      "用户界面设计，聚焦数字产品的视觉呈现与交互细节。通过布局、色彩、图标、控件等元素的系统化编排，让产品在美观的同时具备清晰的操作逻辑与一致的使用体验。",
    count: 10,
    icon: "layers",
  },
  {
    id: 2,
    name: "UI设计",
    path: "/design/ui",
    description:
      "用户界面设计，聚焦数字产品的视觉呈现与交互细节。通过布局、色彩、图标、控件等元素的系统化编排，让产品在美观的同时具备清晰的操作逻辑与一致的使用体验。",
    count: 10,
    icon: "smartphone",
  },
  {
    id: 3,
    name: "网页设计",
    path: "/design/web",
    description:
      "以浏览器为载体的视觉与体验设计，涵盖页面结构、信息层级、响应式适配与交互动效。兼顾品牌表达与用户浏览效率，在不同设备上呈现统一且流畅的访问体验。",
    count: 10,
    icon: "monitor",
  },
  {
    id: 4,
    name: "插画设计",
    path: "/design/illustration",
    description:
      "以图形语言传递信息与情绪的视觉创作。通过风格化的造型、色彩与构图，为品牌、产品或内容赋予独特的视觉个性，增强叙事感染力与记忆点。",
    count: 10,
    icon: "pen-tool",
  },
  {
    id: 5,
    name: "海报设计",
    path: "/design/poster",
    description:
      "面向线下或线上传播的单幅视觉设计。在有限画幅内通过标题、图像与排版的强对比，快速传递核心信息，兼具视觉冲击力与信息传达效率。",
    count: 10,
    icon: "amphora",
  },
  {
    id: 6,
    name: "KV设计",
    path: "/design/kv",
    description:
      "主视觉设计，是品牌活动或营销战役的核心视觉符号。统一整套传播物料的视觉基调与识别元素，确保从线上到线下、从主画面到延展物料的品牌一致性。",
    count: 10,
    icon: "megaphone",
  },
];
export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { type } = useParams();
  const router = useRouter();
  return (
    <div className="flex justify-start items-start p-4">
      <div className="w-1/4 h-screen shrink-0 sticky top-22">
        <div className="min-h-[calc(100%-10rem)] bg-gray-100  rounded-2xl shadow-2xl py-8 px-6 m-4 flex flex-col justify-between">
          <div>
            <div className="w-[calc(100%+1.5rem)] mb-4 flex felx-row flex-nowrap items-center gap-6 shadow-md bg-white p-4 py-8 rounded-l-2xl">
              <Image
                width={100}
                height={100}
                alt=""
                src="https://img.zcool.cn/community/018a995c383326a8012090db47b28c.jpg?x-oss-process=image/resize,m_fill,w_160,h_160,limit_0/auto-orient,1/sharpen,100/quality,q_100/format,webp&k=b9d5bf2f979faf88f8a9942c843159c4&t=6aa540b7"
                className="w-20 h-20 rounded-full bg-gray-200"
              ></Image>
              <div className="flex-1">
                <h1 className="text-2xl font-bold flex flex-row items-center gap-4">
                  设计作品集 <span>{"////////////"}</span>
                </h1>
                <p className="text-sm text-gray-400">Design Portfolio</p>
              </div>
            </div>
            <div className="mt-2 text-sm mb-6">
              自2017年投身UI与网页设计行业，擅长界面交互、网页、插画、海报及KV主视觉设计，兼顾设计创意与落地实现，注重真实可用的用户体验。
            </div>
            <hr className="border-gray-200 my-4" />

            <div className="flex flex-col gap-6">
              {designs.map((design) => (
                <Item
                  key={design.id}
                  className={cn(
                    "border overflow-hidden shadow-xl border-gray-300 group h-14 2xl:hover:h-42 hover:h-48 transition-all duration-500 ease-in-out",
                    design.path.includes(type as string) && "2xl:h-42 h-48"
                  )}
                >
                  <div className="mb-2 w-full flex flex-row justify-between items-center">
                    <ItemContent className="text-lg font-bold flex flex-row items-center">
                      {/* <Layers size={24} className="mr-2" /> */}
                      <Icon name={design.icon} size={24} className="mr-2" />
                      {design.name}
                    </ItemContent>
                    <ItemActions>
                      <div className="bg-gray-200 hover:bg-teal-300 cursor-pointer rounded-lg">
                        <div className="group-hover:hidden px-2 py-1">
                          共计 {design.count} 个
                        </div>
                        <Button
                          className="hidden group-hover:flex flex-row items-center"
                          onClick={() => router.push(design.path)}
                        >
                          前往查看 <ChevronRight size={16} />
                        </Button>
                      </div>
                    </ItemActions>
                  </div>
                  <div
                    className={cn(
                      "group-hover:visible group-hover:scale-100 invisible transform scale-0 transition-all duration-500 ease-in-out",
                      design.path.includes(type as string)
                        ? "visible scale-100"
                        : "invisible scale-0"
                    )}
                  >
                    <hr className="w-full border-gray-200 mb-4" />
                    <div>{design.description}</div>
                  </div>
                </Item>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <Feather size={16} />
              Anln
            </div>
            <div className="text-sm flex flex-row text-gray-500 justify-self-center">
              有 {designs.length * 10} 种设计·有 {designs.length * 100} 个人浏览
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 ">{children}</div>
    </div>
  );
}
