import Link from "next/link";
import { User } from "../../types";
import { Card, CardContent } from "../ui/Card";
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Trash2 } from "lucide-react";

export function AdminUserTable({ users, onToggleStatus, onDelete }: { users: User[], onToggleStatus: (id: number, status: boolean) => void, onDelete: (id: number) => void }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-50 text-blue-700 border border-blue-100">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.is_active ? (
                    <span className="inline-flex items-center gap-1.5 text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-md">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-red-600 font-medium text-xs bg-red-50 px-2 py-1 rounded-md">
                      <XCircle className="h-3.5 w-3.5" /> Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-xs font-medium">
                    {user.role === "patient" && (
                       <Link
                         href={`/admin/users/${user.id}`}
                         className="px-3 py-1.5 rounded-md transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center justify-center font-medium"
                       >
                         View Profile
                       </Link>
                    )}
                    <button
                      onClick={() => onToggleStatus(user.id, !user.is_active)}
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        user.is_active ? "text-orange-600 bg-orange-50 hover:bg-orange-100" : "text-green-600 bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                    {user.role !== "admin" && (
                       <button
                         onClick={() => onDelete(user.id)}
                         className="px-2 py-1.5 rounded-md transition-colors text-red-600 bg-red-50 hover:bg-red-100 flex items-center justify-center"
                         title="Delete User"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
