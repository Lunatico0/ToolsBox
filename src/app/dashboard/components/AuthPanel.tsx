import type React from "react";

interface AuthPanelProps {
  adminName: string | null;
  authForm: { email: string; password: string };
  setAuthForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  onLogin: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function AuthPanel({ adminName, authForm, setAuthForm, onLogin, onLogout }: AuthPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Acceso administrador</h2>
          <p className="text-sm text-slate-600">Autentica para crear recursos y aprobar solicitudes.</p>
        </div>
        {adminName && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Sesión activa
          </span>
        )}
      </div>

      {adminName ? (
        <div className="flex flex-col gap-3 text-sm text-slate-700">
          <p>
            Sesión iniciada como <span className="font-semibold">{adminName}</span>.
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={onLogin}>
          <input
            required
            type="email"
            placeholder="Correo"
            value={authForm.email}
            onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <input
            required
            type="password"
            placeholder="Contraseña"
            value={authForm.password}
            onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Iniciar sesión
          </button>
        </form>
      )}
    </div>
  );
}
