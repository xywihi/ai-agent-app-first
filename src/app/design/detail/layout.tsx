export default async function FrontendDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen xl:flex justify-between items-start md:p-4">
      <div className="flex-1 px-0 xl:px-40">{children}</div>
    </div>
  );
}
