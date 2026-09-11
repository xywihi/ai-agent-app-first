"use client";
import { Icon } from "@/components/Icon";
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
  return (
    <div className="flex justify-start items-start p-4">
      <div className="flex-1 p-4 ">{children}</div>
    </div>
  );
}
