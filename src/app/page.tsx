"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

import type { RequestDTO, ToolDTO } from "@/types/inventory";

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const demoTools: ToolDTO[] = [
  {
    _id: "tool-1",
    name: "Taladro percutor",
    brand: "Bosch",
    model: "GSR 18V",
    description: "Taladro inalámbrico con batería 18V",
    location: { shelf: "A", column: "2", row: "3" },
    status: "assigned",
    assignedTo: "María Ponce",
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "tool-2",
    name: "Llave dinamométrica",
    brand: "Stanley",
    model: "PRO 30-200Nm",
    description: "Rango 30-200Nm, con estuche",
    location: { shelf: "B", column: "1", row: "1" },
    status: "available",
    assignedTo: null,
    assignedAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    _id: "tool-3",
    name: "Calibrador Vernier",
    brand: "Mitutoyo",
    model: "500-196-30",
    description: "Precisión 0.01mm",
    location: { shelf: "B", column: "3", row: "2" },
    status: "available",
    assignedTo: null,
    assignedAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

const demoRequests: RequestDTO[] = [
  {
    _id: "req-1",
    tool: demoTools[0],
    technician: "María Ponce",
    purpose: "Mantenimiento preventivo",
    status: "approved",
    approver: "Supervisor Omar",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    returnedAt: null,
    returnNotes: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
  {
    _id: "req-2",
    tool: demoTools[1],
    technician: "Julián Rivero",
    purpose: "Ajuste de torque",
    status: "pending",
    approver: "",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    approvedAt: null,
    returnedAt: null,
    returnNotes: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

const statusStyles: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  assigned: "bg-amber-100 text-amber-700",
  pending: "bg-indigo-100 text-indigo-700",
  approved: "bg-blue-100 text-blue-700",
  returned: "bg-slate-100 text-slate-700",
};

function formatDate(date?: string | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function Home() {
  const [tools, setTools] = useState<ToolDTO[]>([]);
  const [requests, setRequests] = useState<RequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toolForm, setToolForm] = useState({
    name: "",
    brand: "",
    model: "",
    description: "",
    location: { shelf: "", column: "", row: "" },
  });
  const [requestForm, setRequestForm] = useState({
    toolId: "",
    technician: "",
    purpose: "",
  });
  const [approvers, setApprovers] = useState<Record<string, string>>({});
  const [returnNotes, setReturnNotes] = useState<Record<string, string>>({});

  const availableTools = useMemo(
    () => tools.filter((tool) => tool.status === "available"),
    [tools],
  );

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  const activeAssignments = useMemo(
    () => requests.filter((request) => request.status === "approved"),
    [requests],
  );

  async function fetchData() {
    if (demoMode) {
      setTools(demoTools);
      setRequests(demoRequests);
      setMessage("Vista demo activa: los cambios no se guardan en base de datos");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [toolsRes, requestsRes] = await Promise.all([
        fetch("/api/tools"),
        fetch("/api/requests"),
      ]);

      const toolsJson = await toolsRes.json();
      const requestsJson = await requestsRes.json();

      if (!toolsRes.ok) throw new Error(toolsJson.message || "Error al cargar herramientas");
      if (!requestsRes.ok) throw new Error(requestsJson.message || "Error al cargar solicitudes");

      setTools(toolsJson.tools);
      setRequests(requestsJson.requests);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const resetMessages = () => {
    setMessage(null);
    setError(null);
  };

  async function handleCreateTool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (demoMode) {
      const newTool: ToolDTO = {
        _id: crypto.randomUUID?.() ?? String(Date.now()),
        ...toolForm,
        status: "available",
        assignedTo: null,
        assignedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTools((prev) => [...prev, newTool]);
      setMessage("Herramienta creada en modo demo");
      setToolForm({
        name: "",
        brand: "",
        model: "",
        description: "",
        location: { shelf: "", column: "", row: "" },
      });
      return;
    }

    const response = await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolForm),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "No se pudo crear la herramienta");
      return;
    }

    setMessage("Herramienta creada correctamente");
    setToolForm({
      name: "",
      brand: "",
      model: "",
      description: "",
      location: { shelf: "", column: "", row: "" },
    });
    fetchData();
  }

  async function handleCreateRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (demoMode) {
      const now = new Date().toISOString();
      const newRequest: RequestDTO = {
        _id: crypto.randomUUID?.() ?? String(Date.now()),
        tool: requestForm.toolId,
        technician: requestForm.technician,
        purpose: requestForm.purpose,
        status: "pending",
        approver: "",
        requestedAt: now,
        approvedAt: null,
        returnedAt: null,
        returnNotes: "",
        createdAt: now,
        updatedAt: now,
      };

      setRequests((prev) => [...prev, newRequest]);
      setMessage("Solicitud creada en modo demo");
      setRequestForm({ toolId: "", technician: "", purpose: "" });
      return;
    }

    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestForm),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "No se pudo registrar la solicitud");
      return;
    }

    setMessage("Solicitud enviada al aprobador");
    setRequestForm({ toolId: "", technician: "", purpose: "" });
    fetchData();
  }

  async function handleApprove(requestId: string) {
    resetMessages();
    const approver = approvers[requestId]?.trim();

    if (!approver) {
      setError("Ingresá el nombre del aprobador para continuar");
      return;
    }

    if (demoMode) {
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? {
                ...req,
                approver,
                status: "approved",
                approvedAt: new Date().toISOString(),
              }
            : req,
        ),
      );

      setTools((prev) => {
        const request = prev && prev.length ? requests.find((r) => r._id === requestId) : undefined;
        const toolId = request?.tool && typeof request.tool !== "string" ? request.tool._id : request?.tool;
        if (!toolId) return prev;
        return prev.map((tool) =>
          tool._id === toolId
            ? {
                ...tool,
                status: "assigned",
                assignedTo: requests.find((r) => r._id === requestId)?.technician ?? "",
                assignedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : tool,
        );
      });

      setMessage("Entrega aprobada (demo)");
      return;
    }

    const response = await fetch(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", approver }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "No se pudo aprobar la solicitud");
      return;
    }

    setMessage("Entrega aprobada y registrada");
    fetchData();
  }

  async function handleReturn(requestId: string) {
    resetMessages();
    const notes = returnNotes[requestId];

    if (demoMode) {
      const now = new Date().toISOString();
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? { ...req, status: "returned", returnedAt: now, returnNotes: notes }
            : req,
        ),
      );
      setTools((prev) => {
        const request = requests.find((r) => r._id === requestId);
        const toolId = request?.tool && typeof request.tool !== "string" ? request.tool._id : request?.tool;
        if (!toolId) return prev;
        return prev.map((tool) =>
          tool._id === toolId
            ? {
                ...tool,
                status: "available",
                assignedTo: null,
                assignedAt: null,
                updatedAt: now,
              }
            : tool,
        );
      });
      setMessage("Devolución registrada (demo)");
      return;
    }

    const response = await fetch(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "return", returnNotes: notes }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "No se pudo registrar la devolución");
      return;
    }

    setMessage("Devolución registrada y herramienta disponible");
    fetchData();
  }

  const inventoryUsage = useMemo(() => {
    const total = tools.length || 1;
    const assigned = tools.filter((tool) => tool.status === "assigned").length;
    return Math.round((assigned / total) * 100);
  }, [tools]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 lg:px-0">
        <header className="flex flex-col gap-4 rounded-2xl bg-slate-900/60 p-8 shadow-xl ring-1 ring-white/10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Inventario</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Pañol de herramientas inteligente
            </h1>
            <p className="mt-3 max-w-2xl text-slate-200">
              Controla qué técnico tiene cada herramienta, registra aprobaciones y
              devoluciones y mantené el stock visible para todo el taller.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-slate-200">
            <div className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Herramientas</p>
              <p className="mt-1 text-2xl font-semibold">{tools.length}</p>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Uso</p>
              <p className="mt-1 text-2xl font-semibold">{inventoryUsage}%</p>
            </div>
          </div>
        </header>

        {(message || error) && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm shadow ${
              message
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                : "border-rose-500/50 bg-rose-500/10 text-rose-100"
            }`}
          >
            {message ?? error}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Nuevo equipo</p>
                <h2 className="text-xl font-semibold">Registrar herramienta</h2>
              </div>
            </div>
            <form className="mt-4 grid gap-4 lg:grid-cols-2" onSubmit={handleCreateTool}>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Nombre</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={toolForm.name}
                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Marca</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={toolForm.brand}
                  onChange={(e) => setToolForm({ ...toolForm, brand: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Modelo</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={toolForm.model}
                  onChange={(e) => setToolForm({ ...toolForm, model: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Descripción</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={toolForm.description}
                  onChange={(e) =>
                    setToolForm({ ...toolForm, description: e.target.value })
                  }
                  placeholder="Taladro, llave, calibrador..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Estantería</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={toolForm.location.shelf}
                  onChange={(e) =>
                    setToolForm({
                      ...toolForm,
                      location: { ...toolForm.location, shelf: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Columna</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={toolForm.location.column}
                  onChange={(e) =>
                    setToolForm({
                      ...toolForm,
                      location: { ...toolForm.location, column: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Fila</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={toolForm.location.row}
                  onChange={(e) =>
                    setToolForm({
                      ...toolForm,
                      location: { ...toolForm.location, row: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 shadow transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  Guardar herramienta
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Entrega</p>
                <h2 className="text-xl font-semibold">Solicitar herramienta</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                Real-time
              </span>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleCreateRequest}>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Herramienta disponible</label>
                <select
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={requestForm.toolId}
                  onChange={(e) => setRequestForm({ ...requestForm, toolId: e.target.value })}
                  required
                  disabled={availableTools.length === 0}
                >
                  <option value="">Seleccionar</option>
                  {availableTools.map((tool) => (
                    <option key={tool._id} value={tool._id}>
                      {tool.name} · {tool.brand} {tool.model}
                    </option>
                  ))}
                </select>
                {availableTools.length === 0 && (
                  <p className="text-xs text-amber-200">
                    No hay herramientas disponibles en este momento.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Técnico</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={requestForm.technician}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, technician: e.target.value })
                  }
                  placeholder="Nombre y apellido"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Propósito</label>
                <textarea
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  value={requestForm.purpose}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, purpose: e.target.value })
                  }
                  rows={3}
                  placeholder="Ej: Cambio de rotor, inspección, calibración"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-400 px-4 py-3 text-sm font-semibold text-indigo-950 shadow transition hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-500"
                disabled={availableTools.length === 0}
              >
                Enviar solicitud
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Aprobaciones</p>
                <h2 className="text-xl font-semibold">Solicitudes pendientes</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                {pendingRequests.length} pendientes
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {pendingRequests.length === 0 && (
                <p className="text-sm text-slate-200">No hay solicitudes por aprobar.</p>
              )}
              {pendingRequests.map((request) => (
                <div
                  key={request._id}
                  className="space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-slate-300">{request.technician}</p>
                      <p className="text-base font-semibold text-white">
                        {(request.tool as ToolDTO)?.name ?? "Herramienta"}
                      </p>
                      <p className="text-xs text-slate-400">{request.purpose || "Sin detalle"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[1fr,160px] md:items-center">
                    <input
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
                      placeholder="Aprobado por"
                      value={approvers[request._id] || ""}
                      onChange={(e) =>
                        setApprovers({ ...approvers, [request._id]: e.target.value })
                      }
                    />
                    <button
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                      onClick={() => handleApprove(request._id)}
                    >
                      Aprobar entrega
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    Solicitado: {formatDate(request.requestedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">En uso</p>
                <h2 className="text-xl font-semibold">Herramientas asignadas</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                {activeAssignments.length} activas
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {activeAssignments.length === 0 && (
                <p className="text-sm text-slate-200">Sin entregas activas.</p>
              )}
              {activeAssignments.map((request) => {
                const tool = request.tool as ToolDTO;
                return (
                  <div
                    key={request._id}
                    className="space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-slate-300">{request.technician}</p>
                        <p className="text-base font-semibold text-white">{tool.name}</p>
                        <p className="text-xs text-slate-400">
                          {tool.brand} {tool.model} · Est. {tool.location.shelf}, Col. {tool.location.column}, Fila {tool.location.row}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[request.status]}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-[1fr,160px] md:items-center">
                      <input
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
                        placeholder="Notas de devolución"
                        value={returnNotes[request._id] || ""}
                        onChange={(e) =>
                          setReturnNotes({ ...returnNotes, [request._id]: e.target.value })
                        }
                      />
                      <button
                        className="inline-flex items-center justify-center rounded-lg bg-blue-400 px-4 py-2 text-sm font-semibold text-blue-950 transition hover:bg-blue-300"
                        onClick={() => handleReturn(request._id)}
                      >
                        Registrar devolución
                      </button>
                    </div>
                    <div className="text-xs text-slate-400">
                      Aprobado: {formatDate(request.approvedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Inventario</p>
              <h2 className="text-xl font-semibold">Listado completo</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
              {tools.length} registros
            </span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
            <div className="grid grid-cols-6 gap-4 border-b border-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              <div className="col-span-2">Herramienta</div>
              <div>Ubicación</div>
              <div>Estado</div>
              <div>Asignado a</div>
              <div>Actualizado</div>
            </div>
            <div className="divide-y divide-white/5 text-sm">
              {loading && (
                <div className="px-4 py-4 text-slate-200">Cargando datos...</div>
              )}
              {!loading && tools.length === 0 && (
                <div className="px-4 py-4 text-slate-200">Sin herramientas registradas.</div>
              )}
              {!loading &&
                tools.map((tool) => (
                  <div key={tool._id} className="grid grid-cols-6 gap-4 px-4 py-3">
                    <div className="col-span-2">
                      <p className="font-medium text-white">{tool.name}</p>
                      <p className="text-xs text-slate-400">{tool.brand} · {tool.model}</p>
                    </div>
                    <div className="text-slate-200">
                      Est. {tool.location.shelf}, Col. {tool.location.column}, Fila {tool.location.row}
                    </div>
                    <div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[tool.status]}`}>
                        {tool.status === "available" ? "Disponible" : "Asignada"}
                      </span>
                    </div>
                    <div className="text-slate-200">{tool.assignedTo || "-"}</div>
                    <div className="text-slate-200">{formatDate(tool.updatedAt)}</div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
