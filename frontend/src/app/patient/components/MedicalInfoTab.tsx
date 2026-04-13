import { useEffect, useState } from "react";
import { Patient } from "../../../types";
import { getDependencies, createDependency, deleteDependency } from "../../../api/medical";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";

export default function MedicalInfoTab({ patient }: { patient: Patient | null }) {
  const [data, setData] = useState({
    allergies: [],
    conditions: [],
    medications: [],
    devices: [],
    "emergency-contacts": []
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const [allergies, conditions, medications, devices, emergencyContacts] = await Promise.all([
        getDependencies("allergies", patient.patient_id),
        getDependencies("conditions", patient.patient_id),
        getDependencies("medications", patient.patient_id),
        getDependencies("devices", patient.patient_id),
        getDependencies("emergency-contacts", patient.patient_id)
      ]);
      setData({
        allergies,
        conditions,
        medications,
        devices,
        "emergency-contacts": emergencyContacts
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patient]);

  const handleDelete = async (endpoint: any, id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDependency(endpoint, id);
        loadData();
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
  };

  const handleAddAllergy = async (e: any) => {
    e.preventDefault();
    const payload = {
      allergy_name: e.target.allergy_name.value,
      severity: e.target.severity.value,
      patient_id: patient?.patient_id
    };
    await createDependency("allergies", payload);
    e.target.reset();
    loadData();
  };

  const handleAddCondition = async (e: any) => {
    e.preventDefault();
    const payload = {
      condition_name: e.target.condition_name.value,
      critical_flag: e.target.critical_flag.checked,
      patient_id: patient?.patient_id
    };
    await createDependency("conditions", payload);
    e.target.reset();
    loadData();
  };

  const handleAddMedication = async (e: any) => {
    e.preventDefault();
    const payload = {
      medication_name: e.target.medication_name.value,
      dosage: e.target.dosage.value,
      patient_id: patient?.patient_id
    };
    await createDependency("medications", payload);
    e.target.reset();
    loadData();
  };

  if (loading) {
    return <div className="flex justify-center p-12 text-slate-400"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ALLERGIES */}
        <Card>
          <CardHeader className="bg-orange-50 border-b border-orange-100 flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-orange-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Allergies</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.allergies.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No allergies recorded.</p> : (
              <ul className="space-y-2">
                {data.allergies.map((item: any) => (
                  <li key={item.allergy_id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-medium text-slate-800">{item.allergy_name}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{item.severity}</span>
                    </div>
                    <button onClick={() => handleDelete('allergies', item.allergy_id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleAddAllergy} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Allergy</h4>
              <div className="flex gap-2">
                <input required name="allergy_name" placeholder="Allergy Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <select name="severity" className="rounded-md border-slate-300 px-3 py-1.5 text-sm">
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
                <button type="submit" className="bg-primary text-white p-1.5 rounded-md hover:bg-primary/90"><Plus className="h-5 w-5" /></button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* CONDITIONS */}
        <Card>
          <CardHeader className="bg-red-50 border-b border-red-100 flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-red-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Chronic Conditions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.conditions.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No conditions recorded.</p> : (
              <ul className="space-y-2">
                {data.conditions.map((item: any) => (
                  <li key={item.condition_id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-medium text-slate-800">{item.condition_name}</span>
                      {item.critical_flag && <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Critical</span>}
                    </div>
                    <button onClick={() => handleDelete('conditions', item.condition_id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleAddCondition} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Condition</h4>
              <div className="flex gap-2 items-center">
                <input required name="condition_name" placeholder="Condition Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <label className="flex items-center gap-1 text-sm text-red-700 font-medium">
                  <input type="checkbox" name="critical_flag" className="rounded border-red-300 text-red-600 focus:ring-red-500" />
                  Critical
                </label>
                <button type="submit" className="bg-primary text-white p-1.5 rounded-md hover:bg-primary/90"><Plus className="h-5 w-5" /></button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* MEDICATIONS */}
        <Card className="lg:col-span-2">
          <CardHeader className="bg-blue-50 border-b border-blue-100 flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-blue-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Active Medications</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.medications.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No active medications.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.medications.map((item: any) => (
                  <div key={item.medication_id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <h4 className="font-semibold text-slate-800">{item.medication_name}</h4>
                      <p className="text-sm text-slate-500">{item.dosage}</p>
                    </div>
                    <button onClick={() => handleDelete('medications', item.medication_id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="h-5 w-5" /></button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddMedication} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Medication</h4>
              <div className="flex flex-col md:flex-row gap-2">
                <input required name="medication_name" placeholder="Medication Name" className="flex-1 rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <input required name="dosage" placeholder="Dosage Details (e.g. 50mg daily)" className="flex-[2] rounded-md border-slate-300 px-3 py-1.5 text-sm" />
                <button type="submit" className="bg-primary text-white p-1.5 px-4 rounded-md hover:bg-primary/90 text-sm font-medium">Add</button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
