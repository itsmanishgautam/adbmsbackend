"use client";

import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../components/auth/RoleGuard";
import { AdminBloodBankTab } from "../components/AdminBloodBankTab";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminBloodBankPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin"]}>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link href="/admin" className="text-blue-600 hover:underline flex items-center w-fit text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-1"/> Back to Admin
          </Link>
          <AdminBloodBankTab />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
