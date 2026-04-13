"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RoleGuard from "../../components/auth/RoleGuard";
import { getUsers, updateUserStatus, deleteUser, deleteDoctor } from "../../api/admin";
import { User } from "../../types";
import { AdminUserTable } from "../../components/tables/AdminUserTable";
import { Settings, Users, Activity, FileText } from "lucide-react";
import CreateDoctorModal from "./CreateDoctorModal";

import AdminLogsTab from "./components/AdminLogsTab";
import AdminInsuranceProvidersTab from "./components/AdminInsuranceTab";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "insurance" | "logs">("users");

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
      loadUsers();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm("Are you sure you want to delete this user completely?")) {
       try {
         const user = users.find(u => u.id === id);
         if (user?.role === "doctor") {
            await deleteDoctor(id);
         }
         await deleteUser(id);
         loadUsers();
       } catch (err) {
         console.error("Delete failed", err);
         alert("Could not delete the user.");
       }
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
            <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center font-medium border border-slate-200 shadow-sm">
              <Settings className="h-4 w-4 mr-2" /> Admin Root
            </div>
          </div>

          <div className="flex gap-4 border-b border-slate-200">
            <button 
              onClick={() => setActiveTab("users")}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === "users" ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users className="h-5 w-5" /> Directory & Roles
            </button>
            <button 
              onClick={() => setActiveTab("insurance")}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === "insurance" ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileText className="h-5 w-5" /> Insurance Settings
            </button>
            <button 
              onClick={() => setActiveTab("logs")}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === "logs" ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity className="h-5 w-5" /> Activity Logs
            </button>
          </div>

          <div className="mt-8">
            {activeTab === "users" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">User Management</h2>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
                  >
                    + Add Doctor
                  </button>
                </div>
                <AdminUserTable users={users} onToggleStatus={handleToggleStatus} onDelete={handleDeleteUser} />
              </div>
            )}

            {activeTab === "insurance" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <AdminInsuranceProvidersTab />
              </div>
            )}

            {activeTab === "logs" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                 <AdminLogsTab />
              </div>
            )}
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
