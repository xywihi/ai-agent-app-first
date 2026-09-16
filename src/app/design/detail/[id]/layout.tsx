"use client";
export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-start items-start p-4">
      <div className="flex-1 p-4 ">{children}</div>
    </div>
  );
}
