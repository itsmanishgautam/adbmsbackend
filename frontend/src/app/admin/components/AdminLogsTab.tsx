import { useEffect, useState } from "react";
import { getLogs } from "../../../api/admin";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Search, Loader2 } from "lucide-react";

export default function AdminLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    user_id: "",
    action: "",
    startDate: "",
    endDate: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getLogs(filters);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterSubmit = (e: any) => {
    e.preventDefault();
    loadData();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">User ID</label>
            <input name="user_id" type="number" placeholder="e.g. 1" value={filters.user_id} onChange={(e) => setFilters({...filters, user_id: e.target.value})} className="rounded-md border-slate-300 py-1.5 px-3 text-sm flex-1 w-32" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Action Partial String</label>
            <input name="action" placeholder="Keyword" value={filters.action} onChange={(e) => setFilters({...filters, action: e.target.value})} className="rounded-md border-slate-300 py-1.5 px-3 text-sm flex-1" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Start Date</label>
            <input name="startDate" type="datetime-local" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="rounded-md border-slate-300 py-1.5 px-3 text-sm flex-1" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">End Date</label>
            <input name="endDate" type="datetime-local" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="rounded-md border-slate-300 py-1.5 px-3 text-sm flex-1" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="bg-primary text-white p-2 px-4 rounded-md flex items-center hover:bg-primary/90 transition-colors">
              <Search className="h-4 w-4 mr-2" /> Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-slate-400" /></div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 bg-white">No logs found</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.log_id} className="border-b border-slate-100 hover:bg-slate-50 bg-white">
                      <td className="px-4 py-3">{log.log_id}</td>
                      <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3">{log.user_id || "-"}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{log.action}</td>
                      <td className="px-4 py-3">{log.resource || "SYSTEM"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{log.ip_address}</td>
                      <td className="px-4 py-3 font-mono text-xs overflow-hidden max-w-xs text-ellipsis whitespace-nowrap">
                        {log.details ? JSON.stringify(log.details) : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
