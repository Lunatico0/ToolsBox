import { formatDate } from "@/app/hooks/useInventoryDashboard";
import type { UserDTO } from "@/types/inventory";

interface UsersTableProps {
  users: UserDTO[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-3">
        <h3 className="text-base font-semibold text-slate-900">Usuarios registrados</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">DNI</th>
              <th className="px-6 py-3">Alta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-3">
                  <p className="font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </p>
                </td>
                <td className="px-6 py-3 text-slate-700">{user.dni}</td>
                <td className="px-6 py-3 text-xs text-slate-500">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">
                  No hay usuarios cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
