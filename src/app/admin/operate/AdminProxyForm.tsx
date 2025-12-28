"use client";

import { useEffect, useState } from "react";
import {
  fetchAvailableTools,
  createRequestsByAdmin,
} from "./actions";

export function AdminProxyForm() {
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableTools().then(setTools);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await createRequestsByAdmin({
        userDni: String(data.get("userDni")).trim(),
        purpose: String(data.get("purpose")).trim(),
        adminDni: String(data.get("adminDni")).trim(),
        reason: String(data.get("reason")).trim(),
        toolIds: selectedTools,
      });

      alert("Solicitud creada y aprobada correctamente");
      form.reset();
      setSelectedTools([]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleTool(id: string) {
    setSelectedTools((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border p-4 rounded">
      <input
        name="adminDni"
        placeholder="DNI del administrador"
        required
      />

      <input
        name="userDni"
        placeholder="DNI del técnico"
        required
      />

      <textarea
        name="purpose"
        placeholder="Descripción del trabajo"
        required
      />

      <textarea
        name="reason"
        placeholder="Motivo de operación por administrador"
        required
      />

      <div className="space-y-1">
        <div className="font-medium">Herramientas disponibles</div>
        {tools.map((t) => (
          <label
            key={t._id}
            className="flex gap-2 items-center"
          >
            <input
              type="checkbox"
              checked={selectedTools.includes(t._id)}
              onChange={() => toggleTool(t._id)}
            />
            {t.name} ({t.internalCode})
          </label>
        ))}
      </div>

      <button
        disabled={loading || selectedTools.length === 0}
        className="btn"
      >
        Asignar herramientas
      </button>
    </form>
  );
}
