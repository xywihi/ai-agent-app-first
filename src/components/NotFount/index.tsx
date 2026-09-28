export default function NotFound({
  content = "页面没有找到，请返回上一页",
}: {
  content?: string;
}) {
  return (
    <div className="flex flex-col h-full pt-80 flex-1 justify-center items-center text-gray-300">
      <p className="text-9xl font-bold ">404</p>
      <p className="text-2xl mt-4">{content}</p>
    </div>
  );
}
