import { useState, useEffect } from "react";
import { getBloodBank } from "../../../api/blood_bank";
import { Card, CardContent } from "../../../components/ui/Card";
import { Loader2, Droplet } from "lucide-react";

export function BloodBankWidget() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const records = await getBloodBank();
        setData(records);
      } catch(e) {
        // ignore errors for widget
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return null; // invisible while loading

  // Sort logically or just show non-zero
  const available = data.filter(r => r.units_available > 0).sort((a,b) => b.units_available - a.units_available);

  if (available.length === 0) return null; // hide if bank empty

  return (
    <Card className="bg-gradient-to-r from-red-50 to-white border-red-100">
      <CardContent className="p-4 flex items-center gap-4 overflow-x-auto">
        <div className="flex-shrink-0 flex items-center gap-2 text-red-800 font-bold pr-4 border-r border-red-200">
           <Droplet className="h-5 w-5 fill-red-500" />
           Live Blood Supply
        </div>
        <div className="flex gap-4">
           {available.map(bt => (
             <div key={bt.blood_type} className="flex flex-col items-center min-w-[3rem]">
                <span className="text-sm font-bold text-slate-700">{bt.blood_type}</span>
                <span className="text-xs font-mono bg-red-100 text-red-700 px-2 py-0.5 rounded-full mt-1">{bt.units_available}</span>
             </div>
           ))}
        </div>
      </CardContent>
    </Card>
  )
}
