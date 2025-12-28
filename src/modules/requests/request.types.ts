import { z } from "zod";
import {
  optionalText,
  isoDateString,
  nonEmpty,
} from "@/modules/shared/domain";

export const requestStatusSchema = z.enum([
  "pending_approval",
  "approved",
  "pending_return_confirmation",
  "returned_ok",
  "returned_with_issue",
]);
export type RequestStatus = z.infer<typeof requestStatusSchema>;

export const requestSchema = z.object({
  _id: z.string(), // UUID del sistema
  toolId: z.string(), // herramienta física
  userId: z.string(),
  purpose: nonEmpty("Propósito").max(160),
  status: requestStatusSchema,

  approvedByUserId: z.string().optional(),

  requestedAt: isoDateString,
  approvedAt: isoDateString.optional(),
  returnRequestedAt: isoDateString.optional(),
  returnedAt: isoDateString.optional(),

  returnNotes: optionalText,
});

export type RequestDoc = z.infer<typeof requestSchema>;

export const createRequestInputSchema = z.object({
  userDni: z.string().trim(),
  toolIds: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos una herramienta."),
  purpose: nonEmpty("Propósito").max(160),
});

export type CreateRequestInput = z.infer<typeof createRequestInputSchema>;

export const approveRequestInputSchema = z.object({
  approverUserId: z.string(),
});

export type ApproveRequestInput = z.infer<typeof approveRequestInputSchema>;

export const returnRequestInputSchema = z.object({
  returnNotes: optionalText,
  outcome: z.enum(["returned_ok", "returned_with_issue"]),
});

export type ReturnRequestInput = z.infer<typeof returnRequestInputSchema>;

export const createRequestByAdminSchema = createRequestInputSchema.extend({
  createdByAdmin: z.object({
    adminDni: z.string().trim(),
    reason: nonEmpty("Motivo").max(200),
  }),
});

export type CreateRequestByAdminInput = z.infer<typeof createRequestByAdminSchema>;
