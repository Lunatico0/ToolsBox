import { AuditService } from "@/modules/audit/audit.service";
import { ToolsRepository } from "@/modules/tools/tool.repository";
import { ToolDoc, ToolStatus } from "@/modules/tools/tool.types";

type ToolTransitionMap = Record<ToolStatus, ToolStatus[]>;

const ALLOWED_TRANSITIONS: ToolTransitionMap = {
  available: ["assigned"],
  assigned: ["available", "maintenance", "lost"],
  maintenance: ["available", "discarded"],
  lost: [],
  discarded: [],
};

export class ToolService {
  constructor(
    private readonly toolRepo: ToolsRepository,
    private readonly auditService: AuditService
  ) {}

  async getById(toolId: string): Promise<ToolDoc> {
    const tool = await this.toolRepo.findById(toolId);

    if(!tool){
      throw new Error('Herramienta no encontrada');
    };

    return tool;
  }

  async assignToRequest(toolId: string, requestId: string, performedByUserId?: string): Promise<void> {
    const tool = await this.getById(toolId);
    this.assertTransitionAllowed(tool.status, "assigned");
    await this.toolRepo.updateStatus(toolId, "assigned", requestId);
    await this.auditService.log({
      entity: "tool",
      entityId: toolId,
      action: "assign",
      performedByUserId,
      meta: { requestId },
    });
  }

  async markAsReturned(toolId: string): Promise<void> {
    const tool = await this.getById(toolId);
    this.assertTransitionAllowed(tool.status, "available");
    await this.toolRepo.updateStatus(toolId, "available", undefined);
    await this.auditService.log({
      entity: "tool",
      entityId: toolId,
      action: "status_change",
      message: "Herramienta devuelta y disponible",
    });
  }

  async sendToMaintenance(toolId: string): Promise<void> {
    const tool = await this.getById(toolId);
    this.assertTransitionAllowed(tool.status, "maintenance");
    await this.toolRepo.updateStatus(toolId, "maintenance", undefined);
    await this.auditService.log({
      entity: "tool",
      entityId: toolId,
      action: "maintenance_sent",
    });
  }

  async markAsLost(toolId: string): Promise<void> {
    const tool = await this.getById(toolId);
    this.assertTransitionAllowed(tool.status, "lost");
    await this.toolRepo.updateStatus(toolId, "lost", undefined);
  }

  async discard(toolId: string): Promise<void> {
    const tool = await this.getById(toolId);
    this.assertTransitionAllowed(tool.status, "discarded");
    await this.toolRepo.markAsDiscarded(toolId);
  }

  /**
   * Private Helpers
   */

  private assertTransitionAllowed(current: ToolStatus, next: ToolStatus): void {
    const allowed = ALLOWED_TRANSITIONS[current];

    if(!allowed.includes(next)){
      throw new Error(`Transición no permitida: ${current} → ${next}`);
    }
  }
}
