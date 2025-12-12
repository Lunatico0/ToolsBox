import type React from "react";

import { formatDate, statusStyles } from "@/app/hooks/useInventoryDashboard";
import type { RequestDTO } from "@/types/inventory";

interface RequestsBoardProps {
  pendingRequests: RequestDTO[];
  activeAssignments: RequestDTO[];
  approvers: Record<string, string>;
  returnNotes: Record<string, string>;
  setApprovers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setReturnNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onApprove: (id: string) => Promise<void>;
  onReturn: (id: string) => Promise<void>;
}

export function RequestsBoard({
  pendingRequests,
  activeAssignments,
  approvers,
  returnNotes,
  setApprovers,
  setReturnNotes,
  onApprove,
  onReturn,
}: RequestsBoardProps) {
  const RequestCard = ({ request }: { request: RequestDTO }) => (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 text-sm">
        <div>
          <p className="font-semibold text-slate-900">{request.technicianName}</p>
          <p className="text-slate-600">{request.tools.length} herramienta(s)</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}>
          {request.status}
        </span>
      </div>
      <div className="text-sm text-slate-700">
        <p className="font-semibold">Herramientas</p>
        <ul className="mt-1 list-disc pl-4 text-slate-600">
          {request.tools.map((tool) => (
            <li key={tool._id}>
              {tool.name} — {tool.brand} ({tool.model})
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <p>
          <span className="font-semibold">Pedido:</span> {formatDate(request.requestedAt)}
        </p>
        <p>
          <span className="font-semibold">Aprobado:</span> {formatDate(request.approvedAt)}
        </p>
        <p>
          <span className="font-semibold">Devuelto:</span> {formatDate(request.returnedAt)}
        </p>
        {request.returnNotes && <p className="col-span-2">Notas: {request.returnNotes}</p>}
      </div>
      {request.status === "pending" && (
        <div className="space-y-2">
          <input
            required
            placeholder="Nombre del aprobador"
            value={approvers[request._id] ?? ""}
            onChange={(e) => setApprovers((prev) => ({ ...prev, [request._id]: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onApprove(request._id)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Aprobar solicitud
          </button>
        </div>
      )}
      {request.status === "approved" && (
        <div className="space-y-2">
          <textarea
            placeholder="Notas de devolución"
            value={returnNotes[request._id] ?? ""}
            onChange={(e) => setReturnNotes((prev) => ({ ...prev, [request._id]: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onReturn(request._id)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Registrar devolución
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">Solicitudes pendientes</h3>
        {pendingRequests.length === 0 && (
          <p className="text-sm text-slate-500">No hay solicitudes pendientes por aprobar.</p>
        )}
        {pendingRequests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">Herramientas en uso</h3>
        {activeAssignments.length === 0 && (
          <p className="text-sm text-slate-500">No hay herramientas asignadas actualmente.</p>
        )}
        {activeAssignments.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
    </div>
  );
}
