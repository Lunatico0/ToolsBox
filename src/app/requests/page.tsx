import { RequestList } from "./RequestList";

export default function RequestsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Solicitudes</h1>
      <RequestList />
    </main>
  );
}
