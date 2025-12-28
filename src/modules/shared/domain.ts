import { xid, z } from 'zod';

/**
 * Reglas base y utilidades de dominio (cross-module)
 * -tipos "brand" para ID´s
 * -Zod schemas reutilizables
 * -Helpers de fechas
 */

export type Brand<K, T> = K & { __brand: T };

export type ToolId = Brand<string, 'ToolId'>;
export type UserId = Brand<string, 'UserId'>;
export type RequestId = Brand<string, 'RequestId'>;
export type IncidentId = Brand<string, "IncidentId">
export type AuditId = Brand<string, 'AuditId'>;

export const isoDateString = z
  .string()
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Debe ser una fecha ISO 8601 válida"
  )
  .describe('ISO 8601 datetime with timezone offset, e.g. 2025-12-13T03:00:00.000Z');

export const dniSchema = z.preprocess(
  (val) => {
    if (val === null || val === undefined) return val;
    return String(val);
  },
  z.string().trim().regex(/^\d{7,9}$/, "DNI inválido")
);

export const nonEmpty = (label: string) =>
  z.string().trim().min(1, `${label} es requerido`)

export const optionalText = z.string().trim().max(500).optional();

export const nowIso = () => new Date().toISOString();

/**
 * Location dentro del pañol (modelo simple del MVP)
 */

export const locationSchema = z.object({
  shelf: nonEmpty('Estanteria').max(20),
  column: nonEmpty('Columna').max(20),
  row: nonEmpty('Fila').max(20),
})

export type Location = z.infer<typeof locationSchema>;
