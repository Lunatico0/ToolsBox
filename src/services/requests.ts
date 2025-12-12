import { dbConnect } from "@/lib/mongoose";
import { Request as RequestModel } from "@/models/Request";
import type { RequestDTO } from "@/types/inventory";

import { ServiceError } from "./errors";
import { ensureToolsAvailable, markToolsAssigned, markToolsReturned } from "./tools";
import { findUserByDni } from "./users";

export async function listRequests(): Promise<RequestDTO[]> {
  await dbConnect();
  return RequestModel.find().populate("tools").populate("user").sort({ createdAt: -1 });
}

export async function createRequest(data: { toolIds: string[]; technicianDni: string; purpose?: string }) {
  await dbConnect();

  const user = await findUserByDni(data.technicianDni);
  const tools = await ensureToolsAvailable(data.toolIds);

  const newRequest = await RequestModel.create({
    tools: tools.map((tool) => tool._id),
    user: user._id,
    technicianName: `${user.firstName} ${user.lastName}`,
    purpose: data.purpose,
  });

  return newRequest.populate(["tools", "user"]);
}

export async function approveRequest(requestId: string, approver: string): Promise<RequestDTO> {
  await dbConnect();
  const existing = await RequestModel.findById(requestId).populate("tools").populate("user");

  if (!existing) {
    throw new ServiceError("Solicitud no encontrada", 404);
  }

  if (existing.status !== "pending") {
    throw new ServiceError("Solo las solicitudes pendientes pueden aprobarse", 400);
  }

  await ensureToolsAvailable(existing.tools as string[]);

  existing.status = "approved";
  existing.approver = approver;
  existing.approvedAt = new Date();

  await markToolsAssigned(existing.tools as string[], existing.technicianName, new Date());
  await existing.save();

  return existing;
}

export async function returnRequest(requestId: string, returnNotes?: string): Promise<RequestDTO> {
  await dbConnect();
  const existing = await RequestModel.findById(requestId).populate("tools").populate("user");

  if (!existing) {
    throw new ServiceError("Solicitud no encontrada", 404);
  }

  if (existing.status !== "approved") {
    throw new ServiceError("Solo las solicitudes aprobadas pueden devolverse", 400);
  }

  existing.status = "returned";
  existing.returnedAt = new Date();
  existing.returnNotes = returnNotes ?? existing.returnNotes;

  await markToolsReturned(existing.tools as string[]);
  await existing.save();

  return existing;
}
