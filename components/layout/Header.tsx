"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700 px-8 flex items-center justify-between">
      {/* Left Side */}

      <div>
        <h1 className="text-2xl font-bold text-white">GABBAR</h1>

        <p className="text-sm text-slate-300">Restaurant Management System</p>
      </div>

      {/* Right Side */}

      <div className="flex items-center gap-6">
        <div className="text-right">
          <h3 className="text-white font-semibold">Aarohi Modi</h3>

          {/* <p className="text-sm text-slate-300">Administrator</p> */}
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-xl bg-orange-500 px-5 py-2 font-medium text-white shadow-md transition-all duration-300 hover:bg-orange-600 hover:shadow-xl"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
