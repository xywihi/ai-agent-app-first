"use client";
import Link from "next/link";
import { Bot, Computer, Home, PencilRuler } from "lucide-react";
import { MovingBorder } from "../MovingBorder";
import { cn } from "@/app/utils/tools";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";

const paths: {
  name: string;
  path: string;
  icon: Parameters<typeof Icon>[0]["name"];
}[] = [
  {
    name: "首页",
    path: "/home",
    icon: "home",
  },
  {
    name: "UI作品集",
    path: "/design",
    icon: "pencil-ruler",
  },
  {
    name: "前端笔记",
    path: "/frontend",
    icon: "computer",
  },
  {
    name: "AI-Chat",
    path: "/chat",
    icon: "bot",
  },
  {
    name: "AI-Agent",
    path: "/aI-agent",
    icon: "computer",
  },
];
export const HeaderNav = () => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-row items-center space-x-14">
      {paths.map((item, index) => (
        <li key={index} className="group relative">
          <Link
            href={item.path}
            aria-disabled="true"
            className="flex items-center gap-1 flex-nowrap z-10 relative text-nowrap"
          >
            <Icon name={item.icon} size={16} />
            {item.name}
          </Link>
          <MovingBorder
            className={cn(
              "group-hover:block hidden absolute -top-0.5 left-1/2 -translate-x-1/2",
              pathname.includes(item.path) && "block"
            )}
            innerClassName="bg-white px-4 py-0"
          >
            <div className="flex items-center gap-1 flex-nowrap text-nowrap z-10 relative invisible">
              <Home size={16} />
              {item.name}
            </div>
          </MovingBorder>
        </li>
      ))}
    </ul>
  );
};
