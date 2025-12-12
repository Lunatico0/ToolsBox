import { dbConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import type { UserDTO } from "@/types/inventory";

import { ServiceError } from "./errors";

export async function listUsers(): Promise<UserDTO[]> {
  await dbConnect();
  return User.find().sort({ createdAt: -1 });
}

export async function createUser(data: { firstName: string; lastName: string; dni: string }): Promise<UserDTO> {
  await dbConnect();

  const existing = await User.findOne({ dni: data.dni });
  if (existing) {
    throw new ServiceError("Ya existe un usuario con ese DNI", 400);
  }

  const user = await User.create({ ...data });
  return user;
}

export async function findUserByDni(dni: string) {
  const user = await User.findOne({ dni });
  if (!user) {
    throw new ServiceError("No se encontró un usuario con ese DNI", 404);
  }
  return user;
}
