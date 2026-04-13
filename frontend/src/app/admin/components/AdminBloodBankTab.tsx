import { useState, useEffect } from "react";
import { getBloodBank, updateBloodBank } from "../../../api/blood_bank";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Loader2, Plus, Minus, Droplet, Save } from "lucide-react";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function AdminBloodBankTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingParams, setEditingParams] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const records = await getBloodBank();
      setData(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getUnits = (bt: string) => {
    if (editingParams[bt] !== undefined) return editingParams[bt];
    const match = data.find(r => r.blood_type === bt);
    return match ? match.units_available : 0;
  };

  const hasChanges = (bt: string) => {
    const match = data.find(r => r.blood_type === bt);
    const original = match ? match.units_available : 0;
    return editingParams[bt] !== undefined && editingParams[bt] !== original;
  };

  const handleUpdate = async (bt: string) => {
    const units = editingParams[bt];
    if (units === undefined) return;
    
    setSaving(true);
    try {
      await updateBloodBank(bt, { units_available: units });
      const newEditing = { ...editingParams };
      delete newEditing[bt];
      setEditingParams(newEditing);
      await loadData();
    } catch (err) {
      alert("Failed to update blood bank amount.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-red-500" /></div>;
  }

  return (
    <Card>
      <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
        <CardTitle className="text-red-900 flex items-center gap-2"><Droplet className="h-5 w-5 fill-red-500 text-red-600"/> Blood Bank Inventory</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BLOOD_TYPES.map(bt => {
            const units = getUnits(bt);
            const changed = hasChanges(bt);
            
            return (
              <div key={bt} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center shadow-sm relative">
                <h3 className="text-xl font-bold text-slate-800 absolute top-3 left-3">{bt}</h3>
                
                <div className="mt-8 flex flex-col items-center">
                  <div className={`text-4xl font-black ${units === 0 ? "text-slate-300" : "text-red-600"}`}>
                    {units}
                  </div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-slate-500 mt-1">Units</span>
                </div>
                
                <div className="flex gap-2 mt-5">
                   <button 
                     onClick={() => setEditingParams({ ...editingParams, [bt]: Math.max(0, units - 1) })}
                     className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-100"
                   >
                     <Minus className="h-4 w-4 text-slate-700"/>
                   </button>
                   <button 
                     onClick={() => setEditingParams({ ...editingParams, [bt]: units + 1 })}
                     className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-100"
                   >
                     <Plus className="h-4 w-4 text-slate-700"/>
                   </button>
                </div>
                
                {changed && (
                  <button 
                    disabled={saving}
                    onClick={() => handleUpdate(bt)}
                    className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white rounded py-2 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-1"
                  >
                    <Save className="h-3 w-3" /> Save Value
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
