"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <div className="flex flex-row min-h-screen">
      {!isLoginPage && <Sidebar />}
      <main className={`flex-1 ${isLoginPage ? "w-full" : ""}`}>
        {children}
      </main>
    </div>
  );
}
