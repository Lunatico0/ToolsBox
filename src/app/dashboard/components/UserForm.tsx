import type React from "react";

interface UserFormProps {
  userForm: { firstName: string; lastName: string; dni: string };
  setUserForm: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; dni: string }>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function UserForm({ userForm, setUserForm, onSubmit }: UserFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Alta de usuario</h2>
        <p className="text-sm text-slate-600">
          Carga nombre, apellido y DNI. El DNI se usará para solicitar herramientas.
        </p>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
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
  );
}
