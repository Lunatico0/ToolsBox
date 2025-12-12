import { Schema, model, models, type Document } from "mongoose";
import type { ToolDocument } from "./Tool";
import type { UserDocument } from "./User";

export type RequestStatus = "pending" | "approved" | "returned";

export interface RequestDocument extends Document {
  tools: ToolDocument["_id"][];
  user: UserDocument["_id"];
  technicianName: string;
  purpose?: string;
  status: RequestStatus;
  approver?: string;
  requestedAt: Date;
  approvedAt?: Date | null;
  returnedAt?: Date | null;
  returnNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const requestSchema = new Schema<RequestDocument>(
  {
    tools: [{ type: Schema.Types.ObjectId, ref: "Tool", required: true }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    technicianName: { type: String, required: true, trim: true },
    purpose: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "returned"],
      default: "pending",
    },
    approver: { type: String, trim: true },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date, default: null },
    returnedAt: { type: Date, default: null },
    returnNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Request =
  models.Request || model<RequestDocument>("Request", requestSchema);
