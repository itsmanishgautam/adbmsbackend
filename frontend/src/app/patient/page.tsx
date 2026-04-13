"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RoleGuard from "../../components/auth/RoleGuard";
import { getMe } from "../../api/patients";
import { Patient } from "../../types";
import { Activity, HeartPulse } from "lucide-react";
import MedicalInfoTab from "./components/MedicalInfoTab";

export default function PatientDashboard() {
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
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patient Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage your chronic conditions, allergies, and dependencies.</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center font-medium border border-blue-100 shadow-sm">
              <HeartPulse className="h-4 w-4 mr-2" /> Medical Info
            </div>
          </div>
          
          <div className="mt-8 transition-all duration-300">
             <MedicalInfoTab patient={patient} />
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
