import { useEffect, useState } from "react";
import { getProviders, createProvider, deleteProvider } from "../../../api/insurance";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Plus, Trash2, Loader2, Link } from "lucide-react";
import { InsuranceProvider } from "../../../types";

export default function AdminInsuranceProvidersTab() {
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Delete this insurance provider? This might affect patient linkages.")) {
      try {
        await deleteProvider(id);
        loadData();
      } catch (err) {
        alert("Failed to delete provider.");
      }
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const payload = {
      provider_name: e.target.provider_name.value,
      payer_phone: e.target.payer_phone.value,
    };
    try {
      await createProvider(payload);
      e.target.reset();
      loadData();
    } catch (err) {
      alert("Failed to create provider.");
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {providers.map((p) => (
              <div key={p.provider_id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative">
                <button onClick={() => handleDelete(p.provider_id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors bg-red-50 p-1.5 rounded-md"><Trash2 className="h-4 w-4" /></button>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mb-3">
                  <Link className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">{p.provider_name}</h4>
                <p className="text-slate-500 text-sm mt-1">{p.payer_phone || "No phone provided"}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  System ID {p.provider_id}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} className="bg-slate-50 p-5 rounded-xl border border-slate-200 m-w-md">
            <h4 className="font-semibold text-slate-800 mb-4">Add Provider</h4>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input required name="provider_name" placeholder="Provider Name (e.g. Aetna)" className="flex-1 rounded-md border border-slate-300 py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              <input name="payer_phone" placeholder="Phone (optional)" className="flex-1 rounded-md border border-slate-300 py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Provider
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
