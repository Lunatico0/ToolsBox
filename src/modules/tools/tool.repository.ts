import { Collection } from "mongodb";
import { db } from "@/lib/db";
import { ToolDoc, ToolStatus, CreateToolInput } from "@/modules/tools/tool.types";
import { nowIso } from "@/modules/shared/domain";

const COLLECTION_NAME = "tools";

export class ToolsRepository {
  private collection(): Collection<ToolDoc> {
    return db.collection<ToolDoc>(COLLECTION_NAME);
  }

  async findById(id: string): Promise<ToolDoc | null> {
    return this.collection().findOne({ _id: id });
  }

  async findAll(): Promise<ToolDoc[]> {
    return this.collection().find({}).toArray();
  }

  async findAvailable(): Promise<ToolDoc[]> {
    return this.collection().find({ status: "available" }).toArray();
  }

  async findByInternalCode(code: string): Promise<ToolDoc[]> {
    return this.collection().find({ internalCode: code }).toArray();
  }

  async findAvailableByInternalCode(code: string): Promise<ToolDoc[]> {
    return this.collection()
      .find({
        internalCode: code,
        status: "available",
      })
      .toArray();
  }

  async create(input: CreateToolInput): Promise<ToolDoc> {
    const now = nowIso();

    const tool: ToolDoc = {
      _id: crypto.randomUUID(),
      internalCode: input.internalCode,
      name: input.name,
      description: input.description,
      location: input.location,
      status: "available",
      createdAt: now,
      updatedAt: now,
    };

    await this.collection().insertOne(tool);
    return tool;
  }

  async updateStatus(toolId: string, status: ToolStatus, currentRequestId?: string): Promise<void> {
    await this.collection().updateOne(
      { _id: toolId },
      {
        $set: {
          status,
          currentRequestId,
          updatedAt: nowIso(),
        },
      }
    );
  }

  async markAsDiscarded(toolId: string): Promise<void> {
    await this.updateStatus(toolId, "discarded");
  }
}
