import { RequestService } from "@/modules/requests/request.service";
import { RequestsRepository } from "@/modules/requests/request.repository";
import { ToolsRepository } from "@/modules/tools/tool.repository";
import { ToolService } from "@/modules/tools/tool.service";
import { UsersRepository } from "@/modules/users/user.repository";
import { AuditRepository } from "@/modules/audit/audit.repository";
import { AuditService } from "@/modules/audit/audit.service";

export function buildRequestService() {
  const toolsRepo = new ToolsRepository();
  const auditService = new AuditService(new AuditRepository());
  const toolService = new ToolService(toolsRepo, auditService);

  return new RequestService(
    new RequestsRepository(),
    toolsRepo,
    toolService,
    new UsersRepository(),
    auditService
  )
}
