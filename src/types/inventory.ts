import type { RequestStatus } from "@/models/Request";
import type { ToolStatus } from "@/models/Tool";
import type { UserDocument } from "@/models/User";

export type UserDTO = {
  _id: string;
  firstName: string;
  lastName: string;
  dni: string;
  createdAt: string;
  updatedAt: string;
};

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
  tools: ToolDTO[] | string[];
  user: UserDTO | UserDocument["_id"];
  technicianName: string;
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
