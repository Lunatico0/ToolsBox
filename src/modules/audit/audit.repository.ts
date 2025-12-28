import { Collection } from "mongodb";
import { db } from "@/lib/db";
import { AuditDoc } from "./audit.types";
import { nowIso } from "@/modules/shared/domain";

const COLLECTION_NAME = "audit_logs";

export class AuditRepository {
  private collection(): Collection<AuditDoc> {
    return db.collection<AuditDoc>(COLLECTION_NAME);
  }

  async create(entry: Omit<AuditDoc, "_id" | "createdAt">): Promise<AuditDoc> {
    const audit: AuditDoc = {
      _id: crypto.randomUUID(),
      createdAt: nowIso(),
      ...entry,
    };

    await this.collection().insertOne(audit);
    return audit;
  }

  async findByEntity(
    entity: AuditDoc["entity"],
    entityId: string
  ): Promise<AuditDoc[]> {
    return this.collection()
      .find({ entity, entityId })
      .sort({ createdAt: 1 })
      .toArray();
  }
}
