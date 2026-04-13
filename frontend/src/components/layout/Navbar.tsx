"use client";

import Link from "next/link";
import { useAuthStore } from "../../context/userStore";
import { HeartPulse, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-xl transition-all">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-red-500" />
          <span className="font-bold text-xl tracking-tight text-gray-900">EHCIDB</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
              <User className="h-4 w-4 text-slate-500" />
              <span>{user.name}</span>
              <span className="ml-1 text-xs uppercase text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
