import { Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { IncidentDoc } from "./incident.types";

const COLLECTION_NAME = "incidents";

export class IncidentRepository {
  private collection(): Collection<IncidentDoc> {
    return db.collection<IncidentDoc>(COLLECTION_NAME);
  }

  async create (doc: IncidentDoc): Promise<void> {
    await this.collection().insertOne(doc);
  }

  async findByToolId (toolId: string): Promise<IncidentDoc[]> {
    return this.collection()
      .find({ toolId })
      .sort({ createdAt: -1 })
      .toArray();
  }
}
