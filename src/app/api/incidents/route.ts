import { NextRequest, NextResponse } from "next/server";
import { IncidentRepository } from "@/modules/incidents/incident.repository";
import { IncidentService } from "@/modules/incidents/incident.service";
import { ToolsRepository } from "@/modules/tools/tool.repository";
import { RequestsRepository } from "@/modules/requests/request.repository";
import { AuditRepository } from "@/modules/audit/audit.repository";
import { AuditService } from "@/modules/audit/audit.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminUserId = body.adminUserId;

    if (!adminUserId) {
      throw new Error("adminUserId requerido");
    }

    const service = new IncidentService(
      new IncidentRepository(),
      new ToolsRepository(),
      new RequestsRepository(),
      new AuditService(new AuditRepository())
    );

    await service.createIncident(body, adminUserId);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
