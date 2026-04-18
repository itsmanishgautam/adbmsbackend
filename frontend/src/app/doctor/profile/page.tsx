"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../components/auth/RoleGuard";
import { UserSquare2, Loader2, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ specialty: "", contact_info: "" });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) {
      fetchProfile(t);
    }
  }, []);

  const fetchProfile = async (t: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/doctor/profile", {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({ specialty: data.specialty || "", contact_info: data.contact_info || "" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/doctor/profile", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Profile updated and submitted for approval!");
        fetchProfile(token!);
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["doctor"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
              <p className="text-slate-500 mt-1">Manage your public information and status.</p>
            </div>
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl flex items-center font-medium border border-blue-100 shadow-sm">
              <UserSquare2 className="h-4 w-4 mr-2" /> Doctor Profile
            </div>
          </div>

          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div> : (
                <form onSubmit={handleSave} className="space-y-4">
                  {profile?.approval_status && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${profile.approval_status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700' }`}>
                      Status: {profile.approval_status.charAt(0).toUpperCase() + profile.approval_status.slice(1)}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Specialty</label>
                    <input 
                      value={formData.specialty}
                      onChange={e => setFormData({...formData, specialty: e.target.value})}
                      className="w-full rounded-md border-slate-300 px-3 py-2 border shadow-sm"
                      placeholder="e.g. Cardiology"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Info</label>
                    <input 
                      value={formData.contact_info}
                      onChange={e => setFormData({...formData, contact_info: e.target.value})}
                      className="w-full rounded-md border-slate-300 px-3 py-2 border shadow-sm"
                      placeholder="e.g. Phone or Office Number"
                    />
                  </div>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center justify-center w-full">
                     Save Profile
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
