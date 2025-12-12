import { dbConnect } from "@/lib/mongoose";
import { Tool } from "@/models/Tool";
import type { ToolDTO } from "@/types/inventory";

import { ServiceError } from "./errors";

export async function listTools(): Promise<ToolDTO[]> {
  await dbConnect();
  const tools = await Tool.find().sort({ createdAt: -1 });
  return tools;
}

export async function createTool(data: {
  name: string;
  brand: string;
  model: string;
  description?: string;
  location: { shelf: string; column: string; row: string };
}): Promise<ToolDTO> {
  await dbConnect();
  const tool = await Tool.create({ ...data });
  return tool;
}

export async function markToolsAssigned(
  toolIds: string[],
  technicianName: string,
  assignedAt: Date,
) {
  await Tool.updateMany(
    { _id: { $in: toolIds } },
    { status: "assigned", assignedTo: technicianName, assignedAt },
  );
}

export async function markToolsReturned(toolIds: string[]) {
  await Tool.updateMany({ _id: { $in: toolIds } }, { status: "available", assignedAt: null, assignedTo: null });
}

export async function ensureToolsAvailable(toolIds: string[]) {
  const tools = await Tool.find({ _id: { $in: toolIds } });
  if (tools.length !== toolIds.length) {
    throw new ServiceError("Alguna herramienta seleccionada no existe", 404);
  }

  const unavailable = tools.filter((tool) => tool.status !== "available");
  if (unavailable.length > 0) {
    throw new ServiceError(
      `Las siguientes herramientas no están disponibles: ${unavailable
        .map((t) => t.name)
        .join(", ")}`,
      400,
    );
  }

  return tools;
}
