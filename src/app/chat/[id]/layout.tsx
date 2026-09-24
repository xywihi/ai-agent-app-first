import { ConverHistoryList } from "@/app/chat/[id]/components/ConverHistoryList";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-center px-4 lg:mt-8">
      <div className="hidden lg:block ">
        <ConverHistoryList />
      </div>
      {children}
    </div>
  );
}
