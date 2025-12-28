import { Collection } from "mongodb";
import { db } from "@/lib/db";
import { RequestDoc, RequestStatus } from "@/modules/requests/request.types";
import { nowIso } from "@/modules/shared/domain";

const COLLECTION_NAME = "requests";

export class RequestsRepository {
  private collection(): Collection<RequestDoc> {
    return db.collection<RequestDoc>(COLLECTION_NAME);
  }

  async findAll(): Promise<RequestDoc[]> {
    return this.collection()
      .find({})
      .sort({ requestedAt: -1 })
      .toArray();
  }

  async findById(id: string): Promise<RequestDoc | null> {
    return this.collection().findOne({ _id: id });
  }

  async findByStatus(status: RequestStatus): Promise<RequestDoc[]> {
    return this.collection().find({ status }).toArray();
  }

  async findActiveByToolId(toolId: string): Promise<RequestDoc | null> {
    return this.collection().findOne({
      toolId,
      status: { $in: ["approved", "pending_return_confirmation"] },
    });
  }

  async create(
    toolId: string,
    userId: string,
    purpose: string
  ): Promise<RequestDoc> {
    const now = nowIso();

    const request: RequestDoc = {
      _id: crypto.randomUUID(),
      toolId,
      userId,
      purpose,
      status: "pending_approval",
      requestedAt: now,
    };

    await this.collection().insertOne(request);
    return request;
  }

  async approve(
    requestId: string,
    approverUserId: string
  ): Promise<void> {
    await this.collection().updateOne(
      { _id: requestId },
      {
        $set: {
          status: "approved",
          approvedByUserId: approverUserId,
          approvedAt: nowIso(),
        },
      }
    );
  }

  async markReturnRequested(requestId: string): Promise<void> {
    await this.collection().updateOne(
      { _id: requestId },
      {
        $set: {
          status: "pending_return_confirmation",
          returnRequestedAt: nowIso(),
        },
      }
    );
  }

  async finalizeReturn(
    requestId: string,
    finalStatus: "returned_ok" | "returned_with_issue",
    notes?: string
  ): Promise<void> {
    await this.collection().updateOne(
      { _id: requestId },
      {
        $set: {
          status: finalStatus,
          returnedAt: nowIso(),
          returnNotes: notes,
        },
      }
    );
  }
}
