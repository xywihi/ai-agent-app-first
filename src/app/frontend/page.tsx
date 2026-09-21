import { Notebook } from "lucide-react";
export default async function Page() {
  return (
    <div className="flex-1 flex flex-col min-h-screen gap-4">
      <div className="flex-1 text-center flex flex-col justify-center items-center text-2xl">
        <Notebook size={64} className="mb-4 text-gray-400 " />
        <p className="text-gray-300 pb-20"> 请选择左侧笔记目录查看指定笔记！</p>
      </div>
    </div>
  );
}
