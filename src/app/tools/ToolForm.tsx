"use client";

import { useState } from "react";
import { createTool } from "./actions";

const toUpper = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim().toUpperCase() : "";

export function ToolForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await createTool({
        internalCode: toUpper(data.get("internalCode")) as string,
        name: toUpper(data.get("name")) as string,
        description: toUpper(data.get("description")) as string,
        location: {
          shelf: toUpper(data.get("shelf")) as string,
          column: toUpper(data.get("column")) as string,
          row: toUpper(data.get("row")) as string,
        },
      });

      form.reset();
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="border rounded p-4 space-y-2">
      <h2 className="font-medium">Alta de herramienta</h2>

      <input name="internalCode" placeholder="Código interno" required />
      <input name="name" placeholder="Nombre" required />
      <input name="description" placeholder="Descripción" />

      <div className="flex gap-2">
        <input name="shelf" placeholder="Estantería" required />
        <input name="column" placeholder="Columna" required />
        <input name="row" placeholder="Fila" required />
      </div>

      <button disabled={loading} className="btn">
        Crear
      </button>
    </form>
  );
}
