"use client";

import { useState } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RoleGuard from "../../components/auth/RoleGuard";
import { DoctorSearch } from "../../components/forms/DoctorSearch";
import { EmergencyCard } from "../../components/cards/EmergencyCard";
import { PatientCard } from "../../types";
import { Stethoscope } from "lucide-react";

export default function DoctorDashboard() {
  const [activePatient, setActivePatient] = useState<PatientCard | null>(null);

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["doctor"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Physician Access</h1>
              <p className="text-slate-500 mt-1">Retrieve vital patient data during critical interactions.</p>
            </div>
            <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center font-medium border border-slate-200 shadow-sm">
              <Stethoscope className="h-4 w-4 mr-2" /> Duty Roster
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">Patient Search</h2>
            <DoctorSearch onFound={(p) => setActivePatient(p)} />
          </div>

          {activePatient && (
            <div className="pt-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Search Results</h2>
              <EmergencyCard patient={activePatient} />
            </div>
          )}
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
