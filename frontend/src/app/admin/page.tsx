"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RoleGuard from "../../components/auth/RoleGuard";
import { getUsers, updateUserStatus } from "../../api/admin";
import { User } from "../../types";
import { AdminUserTable } from "../../components/tables/AdminUserTable";
import { Settings } from "lucide-react";
import CreateDoctorModal from "./CreateDoctorModal";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (id: number, status: boolean) => {
    try {
      await updateUserStatus(id, status);
      loadUsers(); // Refresh
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Administration</h1>
              <p className="text-slate-500 mt-1">Manage system configurations and users.</p>
            </div>
            <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center font-medium border border-slate-200">
              <Settings className="h-4 w-4 mr-2" /> Admin Dashboard
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">User Management</h2>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
              >
                + Create Doctor Account
              </button>
            </div>
            <AdminUserTable users={users} onToggleStatus={handleToggleStatus} />
          </div>
          
          {isModalOpen && (
            <CreateDoctorModal 
              onClose={() => setIsModalOpen(false)} 
              onSuccess={loadUsers} 
            />
          )}
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
