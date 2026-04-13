"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import RoleGuard from "../../components/auth/RoleGuard";
import { getMe } from "../../api/patients";
import { Patient } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { EmergencyCard } from "../../components/cards/EmergencyCard";
import { useAuthStore } from "../../context/userStore";
import { Activity, ShieldCheck } from "lucide-react";

export default function PatientDashboard() {
  const user = useAuthStore((state) => state.user);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMe();
        setPatient(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["patient"]}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patient Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage your critical emergency data.</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center font-medium border border-blue-100">
              <Activity className="h-4 w-4 mr-2" /> Active Status
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-slate-400" />
                Your Active Emergency Card
              </h2>
              {patient && user ? (
                <EmergencyCard patient={{ ...patient, name: user.name }} />
              ) : (
                <Card className="p-8 text-center text-slate-500 bg-slate-50/50">
                  Loading emergency card...
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 mb-4">Your profile looks 100% complete.</p>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
