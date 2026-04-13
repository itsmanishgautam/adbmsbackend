"use client";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RoleGuard from "../../components/auth/RoleGuard";
import { Settings, Users, Activity, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Administration</h1>
              <p className="text-slate-500 mt-1">Manage system configurations globally.</p>
            </div>
            <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center font-medium border border-slate-200 shadow-sm">
              <Settings className="h-4 w-4 mr-2" /> Admin Root
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Link href="/admin/users" className="block group">
               <Card className="h-full hover:border-primary/50 transition-colors bg-white">
                 <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                     <Users className="h-8 w-8" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg text-slate-800">User Management</h3>
                     <p className="text-slate-500 text-sm mt-1">Manage platform users and doctors</p>
                   </div>
                 </CardContent>
               </Card>
            </Link>

            <Link href="/admin/insurance" className="block group">
               <Card className="h-full hover:border-primary/50 transition-colors bg-white">
                 <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                     <FileText className="h-8 w-8" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg text-slate-800">Insurance Settings</h3>
                     <p className="text-slate-500 text-sm mt-1">Configure global insurance providers</p>
                   </div>
                 </CardContent>
               </Card>
            </Link>

            <Link href="/admin/logs" className="block group">
               <Card className="h-full hover:border-primary/50 transition-colors bg-white">
                 <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="p-4 bg-green-50 text-green-600 rounded-full group-hover:scale-110 transition-transform">
                     <Activity className="h-8 w-8" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg text-slate-800">Activity Logs</h3>
                     <p className="text-slate-500 text-sm mt-1">Review system audits and events</p>
                   </div>
                 </CardContent>
               </Card>
            </Link>

            <Link href="/admin/blood-bank" className="block group">
               <Card className="h-full hover:border-red-500/50 transition-colors bg-white">
                 <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="p-4 bg-red-50 text-red-600 rounded-full group-hover:scale-110 transition-transform">
                     <Activity className="h-8 w-8" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg text-slate-800">Blood Bank</h3>
                     <p className="text-slate-500 text-sm mt-1">Manage global blood inventory</p>
                   </div>
                 </CardContent>
               </Card>
            </Link>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
