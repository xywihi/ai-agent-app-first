import Image from "next/image";
export const UnderDevelop = ({ title }: { title: string }) => {
  return (
    <div className="h-[calc(100dvh-10rem)] flex-1 flex flex-col justify-center items-center gap-4 text-2xl">
      <Image
        src="/images/under_ development.webp"
        alt="AI Agent"
        width={200}
        height={200}
      />
      <div className="flex flex-col justify-center items-center gap-4 transform -translate-y-10">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-gray-400 text-sm">此功能正在开发中，敬请期待！</p>
      </div>
    </div>
  );
};
