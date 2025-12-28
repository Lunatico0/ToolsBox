import { z } from 'zod';
import { nonEmpty, dniSchema, UserId, isoDateString } from '@/modules/shared/domain';

export const userRoleSchema = z.enum(["TECH", "ADMIN"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchemma = z.object({
  _id: z.string(), //Mongo ObjectId string
  name: nonEmpty('Nombre').max(60),
  lastName: nonEmpty('Apellido').max(60),
  dni: dniSchema,
  role: userRoleSchema,
  active: z.boolean().default(true),
  createdAt: isoDateString,
  updatedAt: isoDateString,
});

export type UserDoc = z.infer<typeof userSchemma>;

/**
 * DTO´s de entrada (API)
 */

export const createUserInputSchema = z.object({
  name: nonEmpty('Nombre').max(60),
  lastName: nonEmpty('Apellido').max(60),
  dni: dniSchema,
  role: userRoleSchema.default("TECH"),
});

export type CreateUserInput =z.infer<typeof createUserInputSchema>;

/**
 * Helper para tipar IDs
 */

export const asUserId = (id: string) => id as UserId;
