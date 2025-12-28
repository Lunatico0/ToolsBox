export async function fetchTools() {
  const res = await fetch("/api/tools");
  if (!res.ok) throw new Error("Error al cargar herramientas");
  return res.json();
}

export async function createTool(input: {
  internalCode: string;
  name: string;
  description?: string;
  location: {
    shelf: string;
    column: string;
    row: string;
  };
}) {
  const res = await fetch("/api/tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al crear herramienta");
  }

  return res.json();
}
