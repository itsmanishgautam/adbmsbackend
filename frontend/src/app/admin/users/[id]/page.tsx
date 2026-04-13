"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../../components/auth/RoleGuard";
import { getPatientProfileAdmin, setPatientProfileStatus } from "../../../../api/admin";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/Card";
import { Loader2, ArrowLeft, ShieldCheck, HeartPulse, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminPatientProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getPatientProfileAdmin(Number(id));
      setProfile(data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
          alert("Patient profile not initialized yet.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const handleSetStatus = async (status: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      await setPatientProfileStatus(Number(id), status);
      await loadProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
  }

  if (!profile) {
     return (
       <ProtectedRoute>
         <RoleGuard allowedRoles={["admin"]}>
           <div className="p-8 space-y-6">
              <Link href="/admin/users" className="text-blue-600 hover:underline flex items-center text-sm"><ArrowLeft className="h-4 w-4 mr-1"/> Back</Link>
              <h1 className="text-2xl font-bold">Profile not found</h1>
           </div>
         </RoleGuard>
       </ProtectedRoute>
     )
  }

  const StatusBadge = ({ status }: { status: string }) => {
     if (status === 'approved') return <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider text-[10px]">Approved</span>;
     if (status === 'rejected') return <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold uppercase tracking-wider text-[10px]">Rejected</span>;
     return <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-bold uppercase tracking-wider text-[10px]">Pending</span>;
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
          <Link href="/admin/users" className="text-blue-600 hover:underline flex items-center w-fit text-sm font-medium"><ArrowLeft className="h-4 w-4 mr-1"/> Back to Directory</Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center">
                 Patient Profile File
                 <StatusBadge status={profile.approval_status} />
              </h1>
              <p className="font-mono text-slate-500 mt-1">E_ID: {profile.emergency_identifier}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                 onClick={() => handleSetStatus('rejected')}
                 disabled={processing || profile.approval_status === "rejected"}
                 className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-colors"
              >
                {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />} 
                Reject Details
              </button>
              <button 
                 onClick={() => handleSetStatus('approved')}
                 disabled={processing || profile.approval_status === "approved"}
                 className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-colors"
              >
                {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} 
                Approve All Actionable Items
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-slate-50 border-slate-200">
               <CardHeader><CardTitle className="text-lg">Core Vitals</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div><span className="text-sm font-semibold block text-slate-500">Blood Type</span><p className="font-medium text-lg">{profile.blood_type || "Unknown"}</p></div>
                  <div><span className="text-sm font-semibold block text-slate-500">Emergency Contact Summary</span><p className="font-medium">{profile.emergency_contact_summary || "None provided"}</p></div>
               </CardContent>
             </Card>

             <Card className="bg-blue-50 border-blue-100">
               <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HeartPulse className="h-5 w-5"/> Medical Metrics</CardTitle></CardHeader>
               <CardContent className="space-y-6">
                 
                 <div>
                   <h3 className="font-bold text-slate-700 mb-2 border-b border-blue-200 pb-1">Allergies</h3>
                   {profile.allergies.length === 0 ? <p className="text-xs text-slate-400">No allergies</p> : 
                      <ul className="space-y-1 text-sm bg-white p-2 rounded-lg border border-blue-200">{profile.allergies.map((a: any) => <li key={a.allergy_id} className="flex items-center justify-between"><span>{a.allergy_name} ({a.severity})</span><StatusBadge status={a.approval_status}/></li>)}</ul>
                   }
                 </div>

                 <div>
                   <h3 className="font-bold text-slate-700 mb-2 border-b border-blue-200 pb-1">Conditions</h3>
                   {profile.conditions.length === 0 ? <p className="text-xs text-slate-400">No conditions</p> : 
                      <ul className="space-y-1 text-sm bg-white p-2 rounded-lg border border-blue-200">{profile.conditions.map((c: any) => <li key={c.condition_id} className="flex items-center justify-between"><span className={c.critical_flag ? "font-bold text-red-600" : ""}>{c.condition_name}</span><StatusBadge status={c.approval_status}/></li>)}</ul>
                   }
                 </div>

                 <div>
                   <h3 className="font-bold text-slate-700 mb-2 border-b border-blue-200 pb-1">Medications</h3>
                   {profile.medications.length === 0 ? <p className="text-xs text-slate-400">No medications</p> : 
                      <ul className="space-y-1 text-sm bg-white p-2 rounded-lg border border-blue-200">{profile.medications.map((m: any) => <li key={m.medication_id} className="flex items-center justify-between"><span>{m.medication_name} ({m.dosage})</span><StatusBadge status={m.approval_status}/></li>)}</ul>
                   }
                 </div>

               </CardContent>
             </Card>

             <Card className="bg-indigo-50 border-indigo-100 md:col-span-2">
               <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="h-5 w-5"/> Insurance Coverages</CardTitle></CardHeader>
               <CardContent>
                  {profile.insurances.length === 0 ? <p className="text-sm text-slate-500">No insurances listed.</p> : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.insurances.map((ins: any) => (
                           <div key={ins.patient_insurance_id} className="bg-white p-4 rounded-xl border border-indigo-200">
                              <h4 className="font-bold text-slate-800 flex justify-between items-center text-sm">{ins.plan_type} <StatusBadge status={ins.approval_status}/></h4>
                              <p className="text-xs text-slate-500 mt-1">Provider ID Link: {ins.provider_id}</p>
                              <div className="mt-3 text-xs flex justify-between">
                                 <span className="font-mono bg-slate-100 px-1 rounded text-slate-600">MID: {ins.member_id}</span>
                                 <span className="font-mono bg-slate-100 px-1 rounded text-slate-600">GRP: {ins.group_number}</span>
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
