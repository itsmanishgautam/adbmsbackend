"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../components/auth/RoleGuard";
import { Loader2, Plus, Flag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

export default function Incidents() {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [token, setToken] = useState<string | null>(null);
  
  // We can fetch user role from localStorage or pass it in context. For now it's patient.

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) fetchIncidents(t);
  }, []);

  const fetchIncidents = async (t: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/incidents/", {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/incidents/", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: "", description: "" });
        fetchIncidents(token!);
      } else {
        alert("Failed to report incident.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["patient", "doctor"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Incident Reports</h1>
              <p className="text-slate-500 mt-1">Track and report medical or system incidents.</p>
            </div>
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center font-medium border border-red-100 shadow-sm">
              <Flag className="h-4 w-4 mr-2" /> Incidents
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center"><Plus className="h-4 w-4 mr-2" /> Report Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <input 
                    required
                    maxLength={255}
                    placeholder="Brief Title"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded border border-slate-300 p-2 text-sm"
                  />
                  <textarea 
                    required
                    rows={4}
                    placeholder="Describe what happened..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full rounded border border-slate-300 p-2 text-sm"
                  />
                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded p-2 text-sm font-semibold transition-colors">
                     Submit Report
                  </button>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div> : incidents.length === 0 ? (
                   <p className="text-slate-500 py-8 text-center bg-slate-50 rounded-xl">No incidents reported.</p>
                ) : (
                  <div className="space-y-4">
                    {incidents.map((inc) => (
                      <div key={inc.incident_id} className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-2">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800">{inc.title}</h4>
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${inc.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {inc.status}
                            </span>
                         </div>
                         <p className="text-sm text-slate-600">{inc.description}</p>
                         {inc.resolution_notes && (
                           <div className="mt-2 text-sm bg-yellow-50 text-yellow-800 border border-yellow-200 p-2 rounded-lg">
                             <strong>Resolution:</strong> {inc.resolution_notes}
                           </div>
                         )}
                         <div className="text-[10px] text-slate-400 font-mono mt-1 text-right">
                           {new Date(inc.created_at).toLocaleString()}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
