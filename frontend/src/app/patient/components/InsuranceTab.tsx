import { useEffect, useState } from "react";
import { Patient, PatientInsurance, InsuranceProvider } from "../../../types";
import { getPatientInsurances, getProviders, createPatientInsurance, updatePatientInsurance, deletePatientInsurance } from "../../../api/insurance";

import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Plus, Trash2, Pencil, Check, X, Loader2, Shield } from "lucide-react";

const ItemStatus = ({ status }: { status: string }) => {
  if (status === "approved") {
    return <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider text-[10px]">Approved</span>;
  }
  return <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-bold uppercase tracking-wider text-[10px]">Pending</span>;
};

const InsuranceItem = ({ item, providers, onUpdate, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    provider_id: item.provider_id,
    plan_type: item.plan_type,
    member_id: item.member_id,
    group_number: item.group_number
  });

  const handleSave = () => {
    onUpdate(item.patient_insurance_id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col p-5 bg-white rounded-xl border border-indigo-300 shadow-sm relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select value={formData.provider_id} onChange={e => setFormData({...formData, provider_id: Number(e.target.value)})} className="rounded border-slate-300 px-2 py-1.5 text-sm font-semibold">
            {providers.map((p: any) => <option key={p.provider_id} value={p.provider_id}>{p.provider_name}</option>)}
          </select>
          <input value={formData.plan_type} onChange={e => setFormData({...formData, plan_type: e.target.value})} placeholder="Plan Type" className="rounded border-slate-300 px-2 py-1.5 text-sm" />
          <input value={formData.member_id} onChange={e => setFormData({...formData, member_id: e.target.value})} placeholder="Member ID" className="rounded border-slate-300 px-2 py-1.5 text-sm font-mono" />
          <input value={formData.group_number} onChange={e => setFormData({...formData, group_number: e.target.value})} placeholder="Group Number" className="rounded border-slate-300 px-2 py-1.5 text-sm font-mono" />
        </div>
        <div className="mt-3 flex gap-2 justify-end">
          <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-xs font-medium flex items-center"><Check className="h-3 w-3 mr-1"/>Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-300 text-xs font-medium flex items-center"><X className="h-3 w-3 mr-1"/>Cancel</button>
        </div>
      </div>
    );
  }

  const providerName = providers.find((p: any) => p.provider_id === item.provider_id)?.provider_name || 'Unknown Provider';

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
      <div className="pl-4">
        <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          {providerName}
          <ItemStatus status={item.approval_status} />
        </h4>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-600">
          <p><span className="font-medium text-slate-500">Plan Type:</span> {item.plan_type}</p>
          <p><span className="font-medium text-slate-500">Member ID:</span> <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{item.member_id}</span></p>
          <p><span className="font-medium text-slate-500">Group Number:</span> <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{item.group_number}</span></p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 pl-4 md:pl-0 flex items-center gap-2">
        <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"><Pencil className="h-5 w-5" /></button>
        <button onClick={() => onDelete(item.patient_insurance_id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"><Trash2 className="h-5 w-5" /></button>
      </div>
    </div>
  );
};


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

  const handleUpdate = async (id: number, payload: any) => {
    try {
      // Retain coverage_status which isn't currently editable but required by the API conceptually
      await updatePatientInsurance(id, { ...payload, coverage_status: "Active" });
      loadData();
    } catch (err) {
      alert("Failed to update record.");
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
        <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-4">
          <CardTitle className="text-indigo-800 flex items-center gap-2"><Shield className="h-5 w-5" /> Current Insurance Plans</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {insurances.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No insurance plans recorded.</p> : (
            <div className="space-y-4">
              {insurances.map((item) => (
                <InsuranceItem key={item.patient_insurance_id} item={item} providers={providers} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
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
