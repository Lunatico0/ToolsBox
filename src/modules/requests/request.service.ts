import { RequestsRepository } from "@/modules/requests/request.repository";
import { ToolsRepository } from "@/modules/tools/tool.repository";
import { ToolService } from "@/modules/tools/tool.service";
import { CreateRequestByAdminInput, CreateRequestInput } from "@/modules/requests/request.types";
import { UsersRepository } from "@/modules/users/user.repository";
import { AuditService } from "@/modules/audit/audit.service";

export class RequestService {
  constructor(
    private readonly requestsRepo: RequestsRepository,
    private readonly toolsRepo: ToolsRepository,
    private readonly toolService: ToolService,
    private readonly usersRepo: UsersRepository,
    private readonly auditService: AuditService
  ) { }

  /**
   * El tecnico solicita una o mas herramientas.
   * Se crea UNA request por herramienta
   */

  async getAllRequests() {
    return this.requestsRepo.findAll();
  }

  async createRequests(input: CreateRequestInput) {
    const user = await this.usersRepo.findByDni(input.userDni);
    if (!user) throw new Error("Usuario no encontrado");

    const createdRequests = [];

    for (const toolId of input.toolIds) {
      const tool = await this.toolsRepo.findById(toolId);
      if (!tool) throw new Error(`Herramienta ${toolId} no encontrada`);
      if (tool.status !== "available") {
        throw new Error(`Herramienta ${toolId} no disponible`);
      }

      const request = await this.requestsRepo.create(
        toolId,
        user._id,
        input.purpose
      );

      await this.auditService.log({
        entity: "request",
        entityId: request._id,
        action: "create",
        performedByUserId: user._id,
        message: "Solicitud creada",
        meta: { toolId, purpose: input.purpose },
      });

      await this.toolService.assignToRequest(
        toolId,
        request._id,
        user._id
      );

      createdRequests.push(request);
    }

    return createdRequests;
  }

  async createRequestsByAdmin(input: CreateRequestByAdminInput) {
    const tech = await this.usersRepo.findByDni(input.userDni);
    if (!tech) throw new Error("Técnico no encontrado");

    const admin = await this.usersRepo.findByDni(
      input.createdByAdmin.adminDni
    );

    if (!admin) throw new Error("Administrador no encontrado");

    if (admin.role !== "ADMIN") {
      throw new Error("El usuario no tiene rol ADMIN");
    }

    const createdRequests = [];

    for (const toolId of input.toolIds) {
      const tool = await this.toolsRepo.findById(toolId);
      if (!tool) throw new Error(`Herramienta ${toolId} no encontrada`);
      if (tool.status !== "available") {
        throw new Error(`Herramienta ${toolId} no disponible`);
      }

      const request = await this.requestsRepo.create(
        toolId,
        tech._id,
        input.purpose
      );

      await this.auditService.log({
        entity: "request",
        entityId: request._id,
        action: "create",
        performedByUserId: admin._id,
        message: "Solicitud creada por administrador",
        meta: {
          onBehalfOfUserId: tech._id,
          reason: input.createdByAdmin.reason,
          toolId,
          purpose: input.purpose,
        },
      });

      await this.requestsRepo.approve(request._id, admin._id);

      await this.auditService.log({
        entity: "request",
        entityId: request._id,
        action: "approve",
        performedByUserId: admin._id,
        meta: {
          autoApproved: true,
          reason: "Creación por administrador",
        },
      });

      await this.toolService.assignToRequest(
        toolId,
        request._id,
        admin._id
      );

      createdRequests.push(request);
    }

    return createdRequests;
  }

  /**
   * El administrador aprueba una request.
   */

  async approveRequest(requestId: string, approverUserId: string): Promise<void> {
    const request = await this.requestsRepo.findById(requestId);

    if (!request) {
      throw new Error('Solicitud no encontrada');
    };

    if (request.status !== 'pending_approval') {
      throw new Error('La solicitud no está pendiente de aprobación');
    };

    await this.requestsRepo.approve(requestId, approverUserId);
    await this.auditService.log({
      entity: "request",
      entityId: requestId,
      action: "approve",
      performedByUserId: approverUserId,
    });
  }

  /**
   * El tecnico avisa que devuelve la herramienta
   */

  async requestReturn(requestId: string): Promise<void> {
    const request = await this.requestsRepo.findById(requestId);

    if (!request) {
      throw new Error('Solicitud no encontrada');
    };

    if (request.status !== 'approved') {
      throw new Error('Solo se puede devolver una solicitud aprobada');
    };

    await this.requestsRepo.markReturnRequested(requestId);
    await this.auditService.log({
      entity: "request",
      entityId: requestId,
      action: "return_requested",
    });
  }

  /**
   * El administrador confirma la devolucion
   */

  async confirmReturn(requestId: string, outcome: "returned_ok" | "returned_with_issue", notes?: string): Promise<void> {
    const request = await this.requestsRepo.findById(requestId);

    if (!request) {
      throw new Error("Solicitud no encontrada");
    }

    if (request.status !== "pending_return_confirmation") {
      throw new Error(
        "La solicitud no está pendiente de confirmación"
      );
    }

    if (outcome === "returned_ok") {
      await this.toolService.markAsReturned(request.toolId);
    } else {
      // Por ahora lo mandamos a mantenimiento
      await this.toolService.sendToMaintenance(request.toolId);
      // Mañana: crear incidente acá
    }

    await this.requestsRepo.finalizeReturn(
      requestId,
      outcome,
      notes
    );
    await this.auditService.log({
      entity: "request",
      entityId: requestId,
      action: "return_confirmed",
      meta: { outcome },
    });
  }
}
