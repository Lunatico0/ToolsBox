import { AuditRepository } from "./audit.repository";
import { AuditEntity, AuditAction } from "./audit.types";

export class AuditService {
  constructor(private readonly auditRepo: AuditRepository) {}

  async log(params: {
    entity: AuditEntity;
    entityId: string;
    action: AuditAction;
    performedByUserId?: string;
    message?: string;
    meta?: Record<string, unknown>;
  }): Promise<void> {
    await this.auditRepo.create({
      entity: params.entity,
      entityId: params.entityId,
      action: params.action,
      performedByUserId: params.performedByUserId,
      message: params.message,
      meta: params.meta,
    });
  }
}
