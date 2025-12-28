import { ToolList } from "./ToolList";
import { ToolForm } from "./ToolForm";

export default function ToolsPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Herramientas</h1>

      <ToolForm />
      <ToolList />
    </main>
  );
}
