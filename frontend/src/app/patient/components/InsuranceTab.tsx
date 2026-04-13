import { useEffect, useState } from "react";
import { Patient, PatientInsurance, InsuranceProvider } from "../../../../types";
import { getPatientInsurances, getProviders, createPatientInsurance, deletePatientInsurance } from "../../../api/insurance";



import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Plus, Trash2, Loader2, Shield } from "lucide-react";

export default function InsuranceTab({ patient }: { patient: Patient | null }) {
  const [insurances, setInsurances] = useState<PatientInsurance[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const [ins, provs] = await Promise.all([
        getPatientInsurances(patient.patient_id),
        getProviders()
      ]);
      setInsurances(ins);
      setProviders(provs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patient]);

  const handleDelete = async (id: number) => {
    if (confirm("Remove this insurance plan?")) {
      try {
        await deletePatientInsurance(id);
        loadData();
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const payload = {
      patient_id: patient?.patient_id,
      provider_id: parseInt(e.target.provider_id.value),
      plan_type: e.target.plan_type.value,
      member_id: e.target.member_id.value,
      group_number: e.target.group_number.value,
      coverage_status: "Active"
    };
    try {
      await createPatientInsurance(payload);
      e.target.reset();
      loadData();
    } catch (err) {
      alert("Failed to add insurance.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12 text-slate-400"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader className="bg-indigo-50 border-b border-indigo-100 flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-indigo-800 flex items-center gap-2"><Shield className="h-5 w-5" /> Current Insurance Plans</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {insurances.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No insurance plans recorded.</p> : (
            <div className="space-y-4">
              {insurances.map((item) => {
                const providerName = providers.find(p => p.provider_id === item.provider_id)?.provider_name || 'Unknown Provider';
                return (
                  <div key={item.patient_insurance_id} className="flex flex-col md:flex-row justify-between md:items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                    <div className="pl-4">
                      <h4 className="font-bold text-lg text-slate-800">{providerName}</h4>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-600">
                        <p><span className="font-medium text-slate-500">Plan Type:</span> {item.plan_type}</p>
                        <p><span className="font-medium text-slate-500">Member ID:</span> <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{item.member_id}</span></p>
                        <p><span className="font-medium text-slate-500">Group Number:</span> <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{item.group_number}</span></p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 pl-4 md:pl-0 flex items-center gap-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-xs uppercase tracking-wider">{item.coverage_status}</span>
                      <button onClick={() => handleDelete(item.patient_insurance_id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-base font-semibold text-slate-800 mb-4">Add Insurance Plan</h4>
            <form onSubmit={handleAdd} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Provider</label>
                  <select required name="provider_id" className="w-full rounded-md border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select a provider...</option>
                    {providers.map(p => <option key={p.provider_id} value={p.provider_id}>{p.provider_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Plan Type</label>
                  <input required name="plan_type" placeholder="e.g. HMO, PPO" className="w-full rounded-md border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Member ID</label>
                  <input required name="member_id" placeholder="ID Number" className="w-full rounded-md border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Group Number</label>
                  <input required name="group_number" placeholder="Group Number" className="w-full rounded-md border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
                  <Plus className="h-4 w-4" /> Add Insurance
                </button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
