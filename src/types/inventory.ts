import type { RequestStatus } from "@/models/Request";
import type { ToolStatus } from "@/models/Tool";

export type ToolLocation = {
  shelf: string;
  column: string;
  row: string;
};

export type ToolDTO = {
  _id: string;
  name: string;
  brand: string;
  model: string;
  description?: string;
  location: ToolLocation;
  status: ToolStatus;
  assignedTo?: string | null;
  assignedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RequestDTO = {
  _id: string;
  tool: ToolDTO | string;
  technician: string;
  purpose?: string;
  status: RequestStatus;
  approver?: string;
  requestedAt: string;
  approvedAt?: string | null;
  returnedAt?: string | null;
  returnNotes?: string;
  createdAt: string;
  updatedAt: string;
};
