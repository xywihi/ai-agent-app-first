"use client";
import dynamic from "next/dynamic"; //动态导入，异步加载
import { memo } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports"; //动态导入
import { LucideProps } from "lucide-react";

type IconName = keyof typeof dynamicIconImports; //导入的图标

interface IconProps extends LucideProps {
  name: IconName;
}

const Icon = memo(function Icon({ name, ...props }: IconProps) {
  const LucideIcon = dynamic(dynamicIconImports[name]);
  return <LucideIcon {...props} />;
});

export { Icon };
