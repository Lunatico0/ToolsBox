import type { RequestDTO, ToolDTO } from "@/types/inventory";
import { statusStyles } from "@/app/hooks/useInventoryDashboard";

interface HeaderProps {
  adminName: string | null;
  demoMode: boolean;
  tools: ToolDTO[];
  pendingRequests: RequestDTO[];
  activeAssignments: RequestDTO[];
}

export function Header({ adminName, demoMode, tools, pendingRequests, activeAssignments }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <p className="text-sm font-medium text-indigo-600">Inventario de herramientas</p>
        <h1 className="text-2xl font-bold text-slate-900">Pañol de taller</h1>
        <p className="text-sm text-slate-600">
          Gestiona altas, pedidos y devoluciones de herramientas con aprobación de administradores.
        </p>
        {demoMode && (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Modo demo activo: la información no se persiste en base de datos.
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
          Admin: {adminName ?? "Sin sesión"}
        </span>
        <span className={`rounded-full px-3 py-1 font-semibold ${statusStyles.available}`}>
          Herramientas: {tools.length}
        </span>
        <span className={`rounded-full px-3 py-1 font-semibold ${statusStyles.pending}`}>
          Pendientes: {pendingRequests.length}
        </span>
        <span className={`rounded-full px-3 py-1 font-semibold ${statusStyles.approved}`}>
          Asignadas: {activeAssignments.length}
        </span>
      </div>
    </header>
  );
}
