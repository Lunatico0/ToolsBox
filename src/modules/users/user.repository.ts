import { Collection } from "mongodb";
import { db } from "@/lib/db";
import { UserDoc } from "./user.types";
import { nowIso } from "@/modules/shared/domain";

const COLLECTION_NAME = "users";

export class UsersRepository {
  private collection(): Collection<UserDoc> {
    return db.collection<UserDoc>(COLLECTION_NAME);
  }

  async findById(id: string): Promise<UserDoc | null> {
    return this.collection().findOne({ _id: id });
  }

  async findByDni(dni: string): Promise<UserDoc | null> {
    return this.collection().findOne({ dni });
  }

  async findAll(): Promise<UserDoc[]> {
    return this.collection().find({}).toArray();
  }

  async create(input: {
    name: string;
    lastName: string;
    dni: string;
    role: "TECH" | "ADMIN";
  }): Promise<UserDoc> {
    const now = nowIso();

    const existing = await this.findByDni(input.dni);
    if (existing) {
      throw new Error("Ya existe un usuario con ese DNI");
    }

    const user: UserDoc = {
      _id: crypto.randomUUID(),
      name: input.name,
      lastName: input.lastName,
      dni: input.dni,
      role: input.role,
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    await this.collection().insertOne(user);
    return user;
  }

  async deactivate(userId: string): Promise<void> {
    await this.collection().updateOne(
      { _id: userId },
      {
        $set: {
          active: false,
          updatedAt: nowIso(),
        },
      }
    );
  }
}
