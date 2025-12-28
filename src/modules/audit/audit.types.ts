import { z } from "zod";
import { isoDateString, optionalText } from "@/modules/shared/domain";

export const auditEntitySchema = z.enum([
  "tool",
  "request",
  "user",
  "incident",
]);

export type AuditEntity = z.infer<typeof auditEntitySchema>;

export const auditActionSchema = z.enum([
  "create",
  "update",
  "status_change",
  "assign",
  "approve",
  "return_requested",
  "return_confirmed",
  "maintenance_sent",
  "lost_marked",
  "discarded",
]);

export type AuditAction = z.infer<typeof auditActionSchema>;

export const auditSchema = z.object({
  _id: z.string(), // AuditId (UUID)
  entity: auditEntitySchema,
  entityId: z.string(), // ToolId | RequestId | UserId
  action: auditActionSchema,

  performedByUserId: z.string().optional(), // ADMIN / TECH
  message: optionalText,

  meta: z.record(z.string(), z.unknown()).optional(),

  createdAt: isoDateString,
});

export type AuditDoc = z.infer<typeof auditSchema>;
