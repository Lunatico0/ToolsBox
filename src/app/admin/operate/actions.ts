export async function fetchAvailableTools() {
  const res = await fetch("/api/tools");
  if (!res.ok) throw new Error("Error cargando herramientas");
  const tools = await res.json();
  return tools.filter((t: any) => t.status === "available");
}

export async function createRequestsByAdmin(input: {
  userDni: string;
  toolIds: string[];
  purpose: string;
  adminDni: string;
  reason: string;
}) {
  const res = await fetch("/api/requests/by-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userDni: input.userDni,
      toolIds: input.toolIds,
      purpose: input.purpose,
      createdByAdmin: {
        adminDni: input.adminDni,
        reason: input.reason,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error creando solicitud");
  }

  return res.json();
}
