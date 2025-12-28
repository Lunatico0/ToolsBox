import { AdminProxyForm } from "./AdminProxyForm";

export default function AdminOperatePage() {
  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">
        Operar por técnico
      </h1>
      <AdminProxyForm />
    </main>
  );
}
