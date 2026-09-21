export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-start items-start p-4">
      <div className="flex-1">{children}</div>
    </div>
  );
}
