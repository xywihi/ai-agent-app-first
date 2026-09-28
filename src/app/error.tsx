"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col h-full pt-60 flex-1 justify-center items-center text-gray-400">
      <p className="text-lg text-gray-400">{error.message}</p>
      <p className="text-lg text-gray-400">页面出错了，请刷新重试</p>
      <button onClick={() => reset()}>刷新</button>
    </div>
  );
}
