"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../context/userStore";
import { 
  LayoutDashboard, 
  UserSquare2, 
  ShieldCheck, 
  Search, 
  Settings,
  HeartPulse,
  FileText
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const routes = {
    patient: [
      { name: "Analytics", path: "/patient", icon: LayoutDashboard },
      { name: "Emergency Card", path: "/patient/card", icon: HeartPulse },
      { name: "Insurance", path: "/patient/insurance", icon: ShieldCheck },
      { name: "Incidents", path: "/patient/incidents", icon: Search },
    ],
    doctor: [
      { name: "Emergency Search", path: "/doctor", icon: Search },
      { name: "My Profile", path: "/doctor/profile", icon: UserSquare2 },
      { name: "Incidents", path: "/doctor/incidents", icon: FileText },
    ],
    admin: [
      { name: "Analytics", path: "/admin", icon: LayoutDashboard },
      { name: "User Management", path: "/admin/users", icon: UserSquare2 },
      { name: "Pending Approvals", path: "/admin/notifications", icon: ShieldCheck },
      { name: "Access Logs", path: "/admin/logs", icon: Settings },
      { name: "Insurance Providers", path: "/admin/insurance", icon: ShieldCheck },
    ]
  };

  const navItems = routes[user.role] || [];

  return (
    <aside className="w-64 border-r border-gray-100 bg-white/50 backdrop-blur-3xl hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all">
      <div className="space-y-2 mt-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
