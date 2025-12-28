import { z } from "zod";
import { optionalText, isoDateString, nonEmpty, ToolId, RequestId, UserId } from "@/modules/shared/domain";

export const incidentTypeSchema = z.enum(["DAMAGE", "TOTAL_BREAK", "LOSS", "OTHER"]);
export type IncidentType = z.infer<typeof incidentTypeSchema>;

export const incidentSchema = z.object({
  _id: z.string(),
  type: incidentTypeSchema,

  toolId: z.string(),
  requestId: z.string(),

  reportedByUserId: z.string(), // ADMIN
  responsibleUserId: z.string(), // TECH

  description: nonEmpty("Descripción").max(300),

  createdAt: isoDateString,
});

export type IncidentDoc = z.infer<typeof incidentSchema>;

export const createIncidentInputSchema = z.object({
  toolId: z.string(),
  requestId: z.string(),
  responsibleUserId: z.string(),
  type: z.preprocess(
    (val) => String(val).toUpperCase(),
    incidentTypeSchema
  ),
  description: nonEmpty("Descripción").max(300),
});


export type CreateIncidentInput = z.infer<typeof createIncidentInputSchema>;
