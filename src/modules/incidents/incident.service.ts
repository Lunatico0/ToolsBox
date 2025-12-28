import { ObjectId } from "mongodb";
import { IncidentRepository } from "./incident.repository";
import { ToolsRepository } from "@/modules/tools/tool.repository";
import { RequestsRepository } from "@/modules/requests/request.repository";
import { AuditService } from "@/modules/audit/audit.service";
import { nowIso } from "@/modules/shared/domain";
import { createIncidentInputSchema } from "./incident.types";

export class IncidentService {
  constructor(
    private readonly incidentRepo: IncidentRepository,
    private readonly toolsRepo: ToolsRepository,
    private readonly requestsRepo: RequestsRepository,
    private readonly auditService: AuditService
  ) { }

  async createIncident(
    input: any,
    adminUserId: string
  ): Promise<void> {
    const data = createIncidentInputSchema.parse(input);

    const tool = await this.toolsRepo.findById(data.toolId);
    if (!tool) throw new Error("Herramienta no encontrada");

    const request = await this.requestsRepo.findById(data.requestId);
    if (!request) throw new Error("Request no encontrada");

    if (tool.currentRequestId !== request._id) {
      throw new Error("La herramienta no pertenece a esa request");
    }

    const incidentId = new ObjectId().toString();

    await this.incidentRepo.create({
      _id: incidentId,
      type: data.type,
      toolId: data.toolId,
      requestId: data.requestId,
      responsibleUserId: data.responsibleUserId,
      reportedByUserId: adminUserId,
      description: data.description,
      createdAt: nowIso(),
    });

    // Impacto en estado de tool
    switch (data.type) {
      case "DAMAGE":
        await this.toolsRepo.updateStatus(data.toolId, "maintenance");
        break;

      case "TOTAL_BREAK":
        await this.toolsRepo.updateStatus(data.toolId, "discarded");
        break;

      case "LOSS":
        await this.toolsRepo.updateStatus(data.toolId, "lost");
        break;

      case "OTHER":
        // no impacta estado
        break;
    }

    await this.auditService.log({
      entity: "incident",
      entityId: incidentId,
      action: "create",
      performedByUserId: adminUserId,
      meta: {
        toolId: data.toolId,
        requestId: data.requestId,
        type: data.type,
      },
    });
  }
}
