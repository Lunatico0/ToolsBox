"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

import type { RequestDTO, ToolDTO, UserDTO } from "@/types/inventory";

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const demoUsers: UserDTO[] = [
  {
    _id: "user-1",
    firstName: "María",
    lastName: "Ponce",
    dni: "11223344",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    _id: "user-2",
    firstName: "Julián",
    lastName: "Rivero",
    dni: "22334455",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

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
    tools: [demoTools[0]],
    user: demoUsers[0],
    technicianName: "María Ponce",
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
    tools: [demoTools[1], demoTools[2]],
    user: demoUsers[1],
    technicianName: "Julián Rivero",
    purpose: "Kit de torque y medición",
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
  const [adminName, setAdminName] = useState<string | null>(demoMode ? "Demo" : null);
  const [tools, setTools] = useState<ToolDTO[]>(demoMode ? demoTools : []);
  const [requests, setRequests] = useState<RequestDTO[]>(demoMode ? demoRequests : []);
  const [users, setUsers] = useState<UserDTO[]>(demoMode ? demoUsers : []);
  const [loading, setLoading] = useState(!demoMode);
  const [message, setMessage] = useState<string | null>(
    demoMode ? "Vista demo activa: los cambios no se guardan en base de datos" : null,
  );
  const [error, setError] = useState<string | null>(null);

  const [toolForm, setToolForm] = useState({
    name: "",
    brand: "",
    model: "",
    description: "",
    location: { shelf: "", column: "", row: "" },
  });

  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    dni: "",
  });

  const [requestForm, setRequestForm] = useState({
    technicianDni: "",
    purpose: "",
    toolIds: [] as string[],
  });

  const [authForm, setAuthForm] = useState({ email: "", password: "" });
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
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [toolsRes, requestsRes, usersRes] = await Promise.all([
        fetch("/api/tools", { credentials: "include" }),
        fetch("/api/requests", { credentials: "include" }),
        fetch("/api/users", { credentials: "include" }),
      ]);

      if (toolsRes.status === 401 || requestsRes.status === 401 || usersRes.status === 401) {
        setError("Inicie sesión como administrador para continuar");
        setLoading(false);
        return;
      }

      const toolsJson = await toolsRes.json();
      const requestsJson = await requestsRes.json();
      const usersJson = await usersRes.json();

      if (!toolsRes.ok) throw new Error(toolsJson.message || "Error al cargar herramientas");
      if (!requestsRes.ok) throw new Error(requestsJson.message || "Error al cargar solicitudes");
      if (!usersRes.ok) throw new Error(usersJson.message || "Error al cargar usuarios");

      setTools(toolsJson.tools);
      setRequests(requestsJson.requests);
      setUsers(usersJson.users);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!demoMode) {
      fetchData();
    }
  }, []);

  const resetMessages = () => {
    setMessage(null);
    setError(null);
  };

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo iniciar sesión");

      setAdminName(data.admin.name);
      setMessage("Sesión de administrador iniciada");
      fetchData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(message);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAdminName(null);
    setMessage("Sesión cerrada");
    setTools([]);
    setRequests([]);
    setUsers([]);
  }

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

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toolForm),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo crear la herramienta");

      setTools((prev) => [data.tool, ...prev]);
      setToolForm({
        name: "",
        brand: "",
        model: "",
        description: "",
        location: { shelf: "", column: "", row: "" },
      });
      setMessage("Herramienta creada");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    }
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (demoMode) {
      const newUser: UserDTO = {
        _id: crypto.randomUUID?.() ?? String(Date.now()),
        ...userForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      setMessage("Usuario creado en modo demo");
      setUserForm({ firstName: "", lastName: "", dni: "" });
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo crear el usuario");

      setUsers((prev) => [data.user, ...prev]);
      setUserForm({ firstName: "", lastName: "", dni: "" });
      setMessage("Usuario dado de alta");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    }
  }

  async function handleCreateRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (requestForm.toolIds.length === 0) {
      setError("Seleccione al menos una herramienta");
      return;
    }

    if (demoMode) {
      const user = users.find((u) => u.dni === requestForm.technicianDni.trim());
      if (!user) {
        setError("No se encontró un usuario con ese DNI");
        return;
      }

      const selectedTools = tools.filter((tool) => requestForm.toolIds.includes(tool._id));
      const unavailable = selectedTools.filter((tool) => tool.status !== "available");
      if (unavailable.length > 0) {
        setError(
          `Las siguientes herramientas no están disponibles: ${unavailable
            .map((t) => t.name)
            .join(", ")}`,
        );
        return;
      }

      const newRequest: RequestDTO = {
        _id: crypto.randomUUID?.() ?? String(Date.now()),
        tools: selectedTools,
        user,
        technicianName: `${user.firstName} ${user.lastName}`,
        purpose: requestForm.purpose,
        status: "pending",
        approver: "",
        requestedAt: new Date().toISOString(),
        approvedAt: null,
        returnedAt: null,
        returnNotes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRequests((prev) => [newRequest, ...prev]);
      setRequestForm({ technicianDni: "", purpose: "", toolIds: [] });
      setMessage("Solicitud generada en modo demo");
      return;
    }

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo crear la solicitud");

      setRequests((prev) => [data.request, ...prev]);
      setRequestForm({ technicianDni: "", purpose: "", toolIds: [] });
      setMessage("Solicitud creada");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    }
  }

  async function handleApprove(id: string) {
    resetMessages();
    const approver = approvers[id];
    if (!approver) {
      setError("Ingrese el nombre del aprobador");
      return;
    }

    if (demoMode) {
      setRequests((prev) =>
        prev.map((req) => {
          if (req._id !== id) return req;
          const selectedTools = tools.filter((tool) =>
            (req.tools as ToolDTO[]).map((t) => t._id).includes(tool._id),
          );
          const unavailable = selectedTools.filter((tool) => tool.status !== "available");
          if (unavailable.length > 0) {
            setError(
              `Las siguientes herramientas ya no están disponibles: ${unavailable
                .map((t) => t.name)
                .join(", ")}`,
            );
            return req;
          }

          const now = new Date().toISOString();
          setTools((prevTools) =>
            prevTools.map((tool) =>
              (req.tools as ToolDTO[]).find((t) => t._id === tool._id)
                ? {
                    ...tool,
                    status: "assigned",
                    assignedTo: req.technicianName,
                    assignedAt: now,
                  }
                : tool,
            ),
          );

          return {
            ...req,
            status: "approved",
            approver,
            approvedAt: now,
            updatedAt: now,
          };
        }),
      );
      setMessage("Solicitud aprobada en modo demo");
      return;
    }

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", approver }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo aprobar la solicitud");

      setRequests((prev) => prev.map((req) => (req._id === id ? data.request : req)));
      fetchData();
      setMessage("Solicitud aprobada");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    }
  }

  async function handleReturn(id: string) {
    resetMessages();
    const notes = returnNotes[id];

    if (demoMode) {
      const now = new Date().toISOString();
      const updatedRequests = requests.map((req) =>
        req._id === id
          ? { ...req, status: "returned", returnedAt: now, returnNotes: notes, updatedAt: now }
          : req,
      );
      const returnedTools = requests.find((r) => r._id === id)?.tools as ToolDTO[];
      if (returnedTools) {
        setTools((prevTools) =>
          prevTools.map((tool) =>
            returnedTools.find((t) => t._id === tool._id)
              ? { ...tool, status: "available", assignedAt: null, assignedTo: null }
              : tool,
          ),
        );
      }
      setRequests(updatedRequests as RequestDTO[]);
      setMessage("Devolución registrada en modo demo");
      return;
    }

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "return", returnNotes: notes }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo registrar la devolución");

      setRequests((prev) => prev.map((req) => (req._id === id ? data.request : req)));
      fetchData();
      setMessage("Devolución registrada");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
    }
  }

  const toolSelection = (id: string) =>
    setRequestForm((prev) => ({
      ...prev,
      toolIds: prev.toolIds.includes(id)
        ? prev.toolIds.filter((toolId) => toolId !== id)
        : [...prev.toolIds, id],
    }));

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Tablero digital</p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Gestión de herramientas y asignaciones
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Administra altas de usuarios, stock de herramientas y solicitudes en lote.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
            <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            {demoMode ? "Modo demo" : adminName ? `Admin: ${adminName}` : "Sin sesión"}
          </div>
        </header>

        {message && (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        {!demoMode && !adminName && (
          <section className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Iniciar sesión</h2>
                <p className="text-sm text-slate-600">Solo administradores pueden gestionar el pañol.</p>
              </div>
            </div>
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleLogin}>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Correo del administrador
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Contraseña
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                />
              </label>
              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Entrar
                </button>
                {loading && <span className="text-xs text-slate-500">Cargando datos…</span>}
              </div>
            </form>
          </section>
        )}

        {(demoMode || adminName) && (
          <>
            <section className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Solicitudes pendientes</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingRequests.length}</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    Aprobación
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Asignadas</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{activeAssignments.length}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    En uso
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Disponibles</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{availableTools.length}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Stock
                  </span>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Alta de herramienta</h2>
                    <p className="text-sm text-slate-600">Solo administradores pueden crear/editar.</p>
                  </div>
                  {!demoMode && (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Cerrar sesión
                    </button>
                  )}
                </div>
                <form className="space-y-3" onSubmit={handleCreateTool}>
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
                    onChange={(e) =>
                      setToolForm((prev) => ({ ...prev, description: e.target.value }))
                    }
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

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Alta de usuario</h2>
                  <p className="text-sm text-slate-600">
                    Carga nombre, apellido y DNI. El DNI se usará para solicitar herramientas.
                  </p>
                </div>
                <form className="space-y-3" onSubmit={handleCreateUser}>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      placeholder="Nombre"
                      value={userForm.firstName}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                    />
                    <input
                      required
                      placeholder="Apellido"
                      value={userForm.lastName}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                  <input
                    required
                    placeholder="DNI"
                    value={userForm.dni}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, dni: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                  >
                    Crear usuario
                  </button>
                </form>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Solicitud en lote</h2>
                  <p className="text-sm text-slate-600">
                    Selecciona varias herramientas y vincula al técnico por DNI.
                  </p>
                </div>
                <form className="space-y-3" onSubmit={handleCreateRequest}>
                  <input
                    required
                    placeholder="DNI del técnico"
                    value={requestForm.technicianDni}
                    onChange={(e) =>
                      setRequestForm((prev) => ({ ...prev, technicianDni: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  />
                  <textarea
                    placeholder="Propósito (opcional)"
                    value={requestForm.purpose}
                    onChange={(e) => setRequestForm((prev) => ({ ...prev, purpose: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Herramientas disponibles
                    </p>
                    <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2">
                      {availableTools.length === 0 && (
                        <p className="col-span-2 text-sm text-slate-500">No hay stock disponible</p>
                      )}
                      {availableTools.map((tool) => (
                        <label
                          key={tool._id}
                          className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1 text-sm hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={requestForm.toolIds.includes(tool._id)}
                            onChange={() => toolSelection(tool._id)}
                          />
                          <div>
                            <p className="font-medium text-slate-800">{tool.name}</p>
                            <p className="text-xs text-slate-500">
                              {tool.brand} · {tool.model} · Ubicación {tool.location.shelf}-
                              {tool.location.column}-{tool.location.row}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    Generar solicitud
                  </button>
                </form>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Solicitudes</h2>
                  <span className="text-sm text-slate-500">{requests.length} registradas</span>
                </div>
                <div className="mt-4 space-y-3">
                  {requests.length === 0 && (
                    <p className="text-sm text-slate-500">Aún no hay solicitudes</p>
                  )}
                  {requests.map((request) => (
                    <div
                      key={request._id}
                      className="rounded-lg border border-slate-200 p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {request.technicianName}
                          </p>
                          <p className="text-xs text-slate-500">
                            DNI {(request.user as UserDTO).dni} · {request.purpose || "Sin detalle"}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(request.tools as ToolDTO[]).map((tool) => (
                          <span
                            key={tool._id}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700"
                          >
                            {tool.name}
                            <span className="text-[10px] text-slate-500">
                              {tool.location.shelf}-{tool.location.column}-{tool.location.row}
                            </span>
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-3 text-xs text-slate-600 md:grid-cols-3">
                        <div>
                          <p className="font-semibold text-slate-700">Solicitada</p>
                          <p>{formatDate(request.requestedAt)}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">Aprobada</p>
                          <p>{formatDate(request.approvedAt)}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">Devuelta</p>
                          <p>{formatDate(request.returnedAt)}</p>
                        </div>
                      </div>

                      {request.status === "pending" && (
                        <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                          <input
                            placeholder="Nombre del aprobador"
                            value={approvers[request._id] ?? ""}
                            onChange={(e) =>
                              setApprovers((prev) => ({ ...prev, [request._id]: e.target.value }))
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                          />
                          <button
                            onClick={() => handleApprove(request._id)}
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                          >
                            Aprobar entrega
                          </button>
                        </div>
                      )}

                      {request.status === "approved" && (
                        <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                          <textarea
                            placeholder="Notas de devolución (opcional)"
                            value={returnNotes[request._id] ?? ""}
                            onChange={(e) =>
                              setReturnNotes((prev) => ({ ...prev, [request._id]: e.target.value }))
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                          />
                          <button
                            onClick={() => handleReturn(request._id)}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                          >
                            Registrar devolución
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Inventario</h2>
                    <span className="text-sm text-slate-500">{tools.length} herramientas</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {tools.length === 0 && (
                      <p className="text-sm text-slate-500">No hay herramientas registradas</p>
                    )}
                    {tools.map((tool) => (
                      <div
                        key={tool._id}
                        className="rounded-lg border border-slate-200 p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
                            <p className="text-xs text-slate-500">
                              {tool.brand} · {tool.model}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[tool.status]}`}
                          >
                            {tool.status}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                          <p>
                            Ubicación: {tool.location.shelf}-{tool.location.column}-{tool.location.row}
                          </p>
                          <p>Asignada a: {tool.assignedTo || "-"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Usuarios</h2>
                    <span className="text-sm text-slate-500">{users.length} técnicos</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {users.length === 0 && (
                      <p className="text-sm text-slate-500">Aún no hay usuarios</p>
                    )}
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-slate-500">DNI {user.dni}</p>
                        </div>
                        <span className="text-xs text-slate-500">Alta: {formatDate(user.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
