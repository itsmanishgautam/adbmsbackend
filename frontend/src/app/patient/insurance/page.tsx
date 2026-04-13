"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../components/auth/RoleGuard";
import { getMe } from "../../../api/patients";
import { Patient } from "../../../types";
import { ShieldCheck } from "lucide-react";
import InsuranceTab from "../components/InsuranceTab";

export default function PatientInsurancePage() {
  const [patient, setPatient] = useState<Patient | null>(null);

  const loadProfile = async () => {
    try {
      const data = await getMe();
      setPatient(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["patient"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Insurance Details</h1>
              <p className="text-slate-500 mt-1">Manage your insurance providers.</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl flex items-center font-medium border border-indigo-100 shadow-sm">
              <ShieldCheck className="h-4 w-4 mr-2" /> Coverage
            </div>
          </div>
          <div className="mt-8">
            <InsuranceTab patient={patient} />
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
