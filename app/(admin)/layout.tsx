export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div className="flex bg-slate-50">
        <Sidebar />

        <main className="flex-1 min-h-screen p-6">{children}</main>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
