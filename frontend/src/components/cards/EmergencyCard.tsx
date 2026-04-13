import { PatientCard } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { AlertCircle, Activity, Droplets } from "lucide-react";

export function EmergencyCard({ patient }: { patient: PatientCard }) {
  if (!patient) return null;

  return (
    <Card className="max-w-2xl w-full border-red-100 shadow-red-100/50">
      <div className="bg-red-500/10 p-6 flex items-start gap-4 border-b border-red-100">
        <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-2xl flex-shrink-0">
          {patient.blood_type || "?"}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
          <p className="text-red-600 font-mono font-medium tracking-wide mt-1">ID: {patient.emergency_identifier}</p>
        </div>
      </div>
      <CardContent className="space-y-6">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
            <Activity className="h-5 w-5 text-red-500" /> Emergency Contact
          </h3>
          <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
            {patient.emergency_contact_summary || "No emergency contact provided."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
