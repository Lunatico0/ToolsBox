import type React from "react";

interface ToolFormProps {
  toolForm: {
    name: string;
    brand: string;
    model: string;
    description: string;
    location: { shelf: string; column: string; row: string };
  };
  setToolForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      brand: string;
      model: string;
      description: string;
      location: { shelf: string; column: string; row: string };
    }>
  >;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function ToolForm({ toolForm, setToolForm, onSubmit }: ToolFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Alta de herramienta</h2>
        <p className="text-sm text-slate-600">Registra marca, modelo, ubicación y detalle.</p>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Nombre"
            value={toolForm.name}
            onChange={(e) => setToolForm((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <input
            required
            placeholder="Marca"
            value={toolForm.brand}
            onChange={(e) => setToolForm((prev) => ({ ...prev, brand: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <input
          required
          placeholder="Modelo"
          value={toolForm.model}
          onChange={(e) => setToolForm((prev) => ({ ...prev, model: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
        />
        <textarea
          placeholder="Descripción"
          value={toolForm.description}
          onChange={(e) => setToolForm((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            required
            placeholder="Estantería"
            value={toolForm.location.shelf}
            onChange={(e) =>
              setToolForm((prev) => ({
                ...prev,
                location: { ...prev.location, shelf: e.target.value },
              }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <input
            required
            placeholder="Columna"
            value={toolForm.location.column}
            onChange={(e) =>
              setToolForm((prev) => ({
                ...prev,
                location: { ...prev.location, column: e.target.value },
              }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <input
            required
            placeholder="Fila"
            value={toolForm.location.row}
            onChange={(e) =>
              setToolForm((prev) => ({
                ...prev,
                location: { ...prev.location, row: e.target.value },
              }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Crear herramienta
        </button>
      </form>
    </div>
  );
}
