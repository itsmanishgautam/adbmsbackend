"use client";

import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../components/auth/RoleGuard";
import { FileText } from "lucide-react";
import AdminInsuranceProvidersTab from "../components/AdminInsuranceTab";

export default function AdminInsurancePage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Insurance Settings</h1>
              <p className="text-slate-500 mt-1">Manage global insurance providers.</p>
            </div>
            <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center font-medium border border-slate-200 shadow-sm">
              <FileText className="h-4 w-4 mr-2" /> Admin Root
            </div>
          </div>
          <div className="mt-8">
            <AdminInsuranceProvidersTab />
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
