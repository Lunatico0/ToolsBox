import type React from "react";

import type { ToolDTO } from "@/types/inventory";

interface RequestFormProps {
  requestForm: { technicianDni: string; purpose: string; toolIds: string[] };
  setRequestForm: React.Dispatch<
    React.SetStateAction<{ technicianDni: string; purpose: string; toolIds: string[] }>
  >;
  availableTools: ToolDTO[];
  onToggleTool: (id: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function RequestForm({ requestForm, setRequestForm, availableTools, onToggleTool, onSubmit }: RequestFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Solicitud de herramientas</h2>
        <p className="text-sm text-slate-600">Genera pedidos tipo carrito con uno o más ítems.</p>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          required
          placeholder="DNI del técnico"
          value={requestForm.technicianDni}
          onChange={(e) => setRequestForm((prev) => ({ ...prev, technicianDni: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
        />
        <textarea
          placeholder="Propósito de uso"
          value={requestForm.purpose}
          onChange={(e) => setRequestForm((prev) => ({ ...prev, purpose: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
        />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Selecciona herramientas disponibles</p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {availableTools.map((tool) => {
              const isSelected = requestForm.toolIds.includes(tool._id);
              return (
                <button
                  key={tool._id}
                  type="button"
                  onClick={() => onToggleTool(tool._id)}
                  className={`flex items-start justify-between rounded-lg border px-3 py-2 text-left text-sm shadow-sm transition hover:border-indigo-400 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{tool.name}</span>
                    <span className="text-xs text-slate-500">{tool.brand}</span>
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">{isSelected ? "Quitar" : "Agregar"}</span>
                </button>
              );
            })}
            {availableTools.length === 0 && (
              <p className="col-span-2 text-sm text-slate-500">No hay herramientas disponibles.</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Crear solicitud
        </button>
      </form>
    </div>
  );
}
