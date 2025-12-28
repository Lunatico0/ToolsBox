import { z } from 'zod';
import {
  locationSchema,
  nonEmpty,
  optionalText,
  ToolId,
  isoDateString
} from '@/modules/shared/domain';

export const toolStatusSchema = z.enum([
  "available",
  "assigned",
  "maintenance",
  "lost",
  "discarded",
]);
export type ToolStatus = z.infer<typeof toolStatusSchema>;

export const toolSchema = z.object({
  _id: z.string(), // UUID del sistema
  internalCode: nonEmpty("Código interno").max(60),
  name: nonEmpty("Nombre").max(80),
  description: optionalText,

  location: locationSchema,

  status: toolStatusSchema,
  currentRequestId: z.string().optional(),

  createdAt: isoDateString,
  updatedAt: isoDateString,
});

export type ToolDoc = z.infer<typeof toolSchema>;

export const createToolInputSchema = z.object({
  internalCode: nonEmpty("Código interno").max(60),
  name: nonEmpty("Nombre").max(80),
  description: optionalText,
  location: locationSchema,
});

export type CreateToolInput = z.infer<typeof createToolInputSchema>;

export const asToolId = (id: string): ToolId => id as ToolId;
