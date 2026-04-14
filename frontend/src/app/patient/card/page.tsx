//src/app/patient/card/page.tsx

//this is emergency card page.


"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import RoleGuard from "../../../components/auth/RoleGuard";
import { getMe } from "../../../api/patients";
import { getDependencies } from "../../../api/medical";
import { Patient } from "../../../types";
import { useAuthStore } from "../../../context/userStore";
import { ShieldCheck } from "lucide-react";

export default function PatientCardPage() {
  const user = useAuthStore((state) => state.user);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [deps, setDeps] = useState({
    allergies: [],
    conditions: [],
    medications: [],
    devices: [],
    contacts: [],
  });

  const loadProfile = async () => {
    try {
      const data = await getMe();
      setPatient(data);

      const [
        allergies,
        conditions,
        medications,
        devices,
        contacts,
      ] = await Promise.all([
        getDependencies("allergies", data.patient_id),
        getDependencies("conditions", data.patient_id),
        getDependencies("medications", data.patient_id),
        getDependencies("devices", data.patient_id),
        getDependencies("emergency-contacts", data.patient_id),
      ]);

      setDeps({
        allergies,
        conditions,
        medications,
        devices,
        contacts,
      });
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

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Emergency Profile
              </h1>
              <p className="text-slate-500 mt-1">
                Manage your active emergency card.
              </p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center font-medium border border-blue-100 shadow-sm">
              <ShieldCheck className="h-4 w-4 mr-2" /> Active Status
            </div>
          </div>



          {/* COMPACT READ-ONLY CARD */}
          {patient && user && (
            <div className="mt-10 flex justify-center">

              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-4 space-y-4">

                {/* HEADER */}
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">
                      Emergency Card
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Read-only profile
                    </p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    Active
                  </span>
                </div>

                {/* BASIC INFO */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Name</p>
                    <p className="font-medium text-slate-800 truncate">
                      {user.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Phone</p>
                    <p className="text-slate-700">
                      {user.phone_number || "—"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-slate-400">Emergency ID</p>
                    <p className="font-mono text-xs font-bold tracking-wider text-slate-900">
                      {patient.emergency_identifier || "NOT SET"}
                    </p>
                  </div>
                </div>

                {/* CRITICAL INFO */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-2">
                    <p className="text-[10px] text-red-500">Blood Type</p>
                    <p className="font-bold text-red-700 text-base">
                      {patient.blood_type || "?"}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2">
                    <p className="text-[10px] text-yellow-600">
                      Emergency Note
                    </p>
                    <p className="text-[11px] font-medium text-slate-700">
                      {patient.emergency_contact_summary || "None"}
                    </p>
                  </div>
                </div>

                {/* TAG SECTIONS */}
                <div className="space-y-3 text-xs">

                  {/* Allergies */}
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">
                      Allergies
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {deps.allergies.length ? (
                        deps.allergies.map((a: any) => (
                          <span
                            key={a.allergy_id}
                            className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-medium"
                          >
                            {a.allergy_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          None
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">
                      Conditions
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {deps.conditions.length ? (
                        deps.conditions.map((c: any) => (
                          <span
                            key={c.condition_id}
                            className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-medium"
                          >
                            {c.condition_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          None
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Medications */}
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">
                      Medications
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {deps.medications.length ? (
                        deps.medications.map((m: any) => (
                          <span
                            key={m.medication_id}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium"
                          >
                            {m.medication_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          None
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Devices */}
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">
                      Devices
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {deps.devices.length ? (
                        deps.devices.map((d: any) => (
                          <span
                            key={d.device_id}
                            className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-medium"
                          >
                            {d.device_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          None
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contacts */}
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">
                      Emergency Contacts
                    </p>
                    <div className="space-y-1">
                      {deps.contacts.length ? (
                        deps.contacts.map((c: any) => (
                          <div
                            key={c.contact_id}
                            className="text-[10px] bg-slate-50 px-2 py-1 rounded border"
                          >
                            <span className="font-medium">{c.name}</span> (
                            {c.relationship}) • {c.phone_number}
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          None
                        </span>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}