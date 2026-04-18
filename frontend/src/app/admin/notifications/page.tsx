"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../components/auth/RoleGuard";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

export default function AdminNotifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) fetchAlerts(t);
  }, []);

  const fetchAlerts = async (t: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/notifications", {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: any, status: string) => {
    try {
      let endpoint = "";
      if (item.type === "patient_profile") {
        endpoint = `http://localhost:8000/api/v1/admin/users/${item.user_id}/patient_profile/status?status=${status}`;
      } else if (item.type === "doctor_profile") {
        endpoint = `http://localhost:8000/api/v1/doctor/profile/${item.id}/approve`;
      } else {
        // Implement approval for other medical fields using direct patch if implemented or simply accept patient profile.
        // For medical items, typically they are approved when patient profile is approved.
        alert(`This item should interact directly with its respective endpoint, or you can approve the entire patient profile.`);
        return;
      }
      
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAlerts(token!);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pending Approvals</h1>
              <p className="text-slate-500 mt-1">Review and approve changes made by users.</p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl flex items-center font-medium border border-indigo-100 shadow-sm">
              <ShieldCheck className="h-4 w-4 mr-2" /> Action Required
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Needs Approval</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
              ) : notifications.length === 0 ? (
                <p className="text-slate-500 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">No pending approvals.</p>
              ) : (
                <ul className="space-y-4">
                  {notifications.map((n, i) => (
                    <li key={i} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-800">{n.message}</p>
                        <p className="text-sm text-slate-500 uppercase tracking-widest mt-1 text-[10px]">{n.type.replace('_', ' ')} ID: {n.id}</p>
                      </div>
                      <div className="flex gap-2">
                        {n.type.includes('profile') && (
                          <button onClick={() => handleApprove(n, 'approved')} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                             Approve
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
