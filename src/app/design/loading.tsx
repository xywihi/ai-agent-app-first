export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-220px)] flex-1 justify-center items-center text-gray-400">
      {/* <p className="text-xl">页面加载中...</p> */}
      <div className="h-full inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900">
          <span className="bg-amber-300 px-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Loading
          </span>
        </div>
      </div>
    </div>
  );
}
