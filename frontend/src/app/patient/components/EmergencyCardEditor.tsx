import { useState } from "react";
import { Patient, User } from "../../../types";
import { EmergencyCard } from "../../../components/cards/EmergencyCard";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/Card";
import { updateMe } from "../../../api/patients";
import { Pencil, Check, X } from "lucide-react";

interface Props {
  patient: Patient | null;
  user: User | null;
  onUpdated: () => void;
}

export default function EmergencyCardEditor({ patient, user, onUpdated }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    blood_type: patient?.blood_type || "",
    emergency_contact_summary: patient?.emergency_contact_summary || "",
    emergency_identifier: patient?.emergency_identifier || "",
  });

  if (!patient || !user) {
    return <Card className="p-8 text-center text-slate-500 bg-slate-50/50">Loading metrics...</Card>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMe(formData);
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Your Active Emergency Card</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              <Pencil className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <Card className="animate-in fade-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSave}>
              <CardHeader>
                <CardTitle>Edit Emergency Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Identifier (Unique ID)</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={formData.emergency_identifier}
                    onChange={(e) => setFormData({ ...formData, emergency_identifier: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                  <select
                    value={formData.blood_type}
                    onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  >
                    <option value="">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact Summary</label>
                  <textarea
                    rows={3}
                    maxLength={255}
                    value={formData.emergency_contact_summary}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_summary: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    placeholder="e.g. Call my wife Jane at 555-0192"
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <X className="h-4 w-4 inline mr-1" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
                >
                  {loading ? "Saving..." : <><Check className="h-4 w-4 inline mr-1" /> Save Changes</>}
                </button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <div className="transition-all duration-300 hover:shadow-md rounded-2xl group">
            <EmergencyCard patient={{ ...patient, name: user.name }} />
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/3">
        <Card className="h-full bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Your Identifier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700/80 mb-4 text-sm">
              Use this identifier with authorized medical personnel so they can quickly access your life-saving medical profile.
            </p>
            <div className="bg-white px-4 py-3 rounded-lg border border-blue-200 font-mono text-center text-lg font-bold text-slate-800 tracking-wider shadow-sm">
              {patient.emergency_identifier || "NOT SET"}
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-3">Checklist</h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${patient.blood_type ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {patient.blood_type ? '✓' : '!'}
                  </span>
                  Blood Type configured
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${patient.emergency_contact_summary ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {patient.emergency_contact_summary ? '✓' : '!'}
                  </span>
                  Emergency Contact Summary set
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
