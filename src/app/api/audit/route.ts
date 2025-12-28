import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuditRepository } from "@/modules/audit/audit.repository";

const auditRepo = new AuditRepository();

const querySchema = z.object({
  entity: z.enum(["tool", "request", "user"]),
  entityId: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = querySchema.parse({
      entity: searchParams.get("entity"),
      entityId: searchParams.get("entityId"),
    });

    const logs = await auditRepo.findByEntity(
      parsed.entity,
      parsed.entityId
    );

    return NextResponse.json(logs);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
