import { formatDate, statusStyles } from "@/app/hooks/useInventoryDashboard";
import type { ToolDTO } from "@/types/inventory";

interface ToolsTableProps {
  tools: ToolDTO[];
}

export function ToolsTable({ tools }: ToolsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-3">
        <h3 className="text-base font-semibold text-slate-900">Inventario</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-6 py-3">Herramienta</th>
              <th className="px-6 py-3">Ubicación</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tools.map((tool) => (
              <tr key={tool._id}>
                <td className="px-6 py-3">
                  <p className="font-semibold text-slate-900">{tool.name}</p>
                  <p className="text-xs text-slate-500">
                    {tool.brand} · {tool.model}
                  </p>
                </td>
                <td className="px-6 py-3 text-slate-700">
                  Est.{tool.location.shelf} · Col.{tool.location.column} · Fila {tool.location.row}
                </td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[tool.status]}`}>
                    {tool.status}
                  </span>
                  {tool.assignedTo && (
                    <p className="text-xs text-slate-500">Asignada a {tool.assignedTo}</p>
                  )}
                </td>
                <td className="px-6 py-3 text-xs text-slate-500">{formatDate(tool.updatedAt)}</td>
              </tr>
            ))}
            {tools.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                  No hay herramientas cargadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
