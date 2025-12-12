import { Schema, model, models, type Document } from "mongoose";

export type ToolStatus = "available" | "assigned";

export interface ToolDocument extends Document {
  name: string;
  brand: string;
  model: string;
  description?: string;
  location: {
    shelf: string;
    column: string;
    row: string;
  };
  status: ToolStatus;
  assignedTo?: string | null;
  assignedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const toolSchema = new Schema<ToolDocument>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: {
      shelf: { type: String, required: true, trim: true },
      column: { type: String, required: true, trim: true },
      row: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ["available", "assigned"],
      default: "available",
    },
    assignedTo: { type: String, default: null },
    assignedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export const Tool = models.Tool || model<ToolDocument>("Tool", toolSchema);
