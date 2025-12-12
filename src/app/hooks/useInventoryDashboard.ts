"use client";

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

export const statusStyles: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  assigned: "bg-amber-100 text-amber-700",
  pending: "bg-indigo-100 text-indigo-700",
  approved: "bg-blue-100 text-blue-700",
  returned: "bg-slate-100 text-slate-700",
};

export function formatDate(date?: string | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function useInventoryDashboard() {
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

  const resetMessages = () => {
    setMessage(null);
    setError(null);
  };

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
      const messageText = err instanceof Error ? err.message : "Error inesperado";
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!demoMode) {
      fetchData();
    }
  }, []);

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
      const messageText = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(messageText);
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

      setTools((prev) => [...prev, data.tool]);
      setToolForm({
        name: "",
        brand: "",
        model: "",
        description: "",
        location: { shelf: "", column: "", row: "" },
      });
      setMessage("Herramienta creada");
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Error inesperado";
      setError(messageText);
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
      const messageText = err instanceof Error ? err.message : "Error inesperado";
      setError(messageText);
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
      const messageText = err instanceof Error ? err.message : "Error inesperado";
      setError(messageText);
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
      const messageText = err instanceof Error ? err.message : "Error inesperado";
      setError(messageText);
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
      const messageText = err instanceof Error ? err.message : "Error inesperado";
      setError(messageText);
    }
  }

  const toolSelection = (id: string) =>
    setRequestForm((prev) => ({
      ...prev,
      toolIds: prev.toolIds.includes(id)
        ? prev.toolIds.filter((toolId) => toolId !== id)
        : [...prev.toolIds, id],
    }));

  return {
    adminName,
    setAdminName,
    tools,
    requests,
    users,
    loading,
    message,
    error,
    toolForm,
    userForm,
    requestForm,
    authForm,
    approvers,
    returnNotes,
    availableTools,
    pendingRequests,
    activeAssignments,
    demoMode,
    setToolForm,
    setUserForm,
    setRequestForm,
    setAuthForm,
    setApprovers,
    setReturnNotes,
    fetchData,
    handleLogin,
    handleLogout,
    handleCreateTool,
    handleCreateUser,
    handleCreateRequest,
    handleApprove,
    handleReturn,
    toolSelection,
  } as const;
}
