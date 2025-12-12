import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { ServiceError } from "@/services/errors";
import { approveRequest, returnRequest } from "@/services/requests";

const actionSchema = z.object({
  action: z.enum(["approve", "return"]),
  approver: z.string().min(2).optional(),
  returnNotes: z.string().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let requestId: string | undefined;
  try {
    await requireAdminSession();
    const { id } = await params;
    requestId = id;
    const payload = await request.json();
    const data = actionSchema.parse(payload);

    if (data.action === "approve") {
      if (!data.approver) {
        return NextResponse.json({ message: "Se requiere el nombre del aprobador" }, { status: 400 });
      }

      const updated = await approveRequest(requestId, data.approver);
      return NextResponse.json({ request: updated });
    }

    const updated = await returnRequest(requestId, data.returnNotes);
    return NextResponse.json({ request: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof ServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    console.error(`PATCH /api/requests/${requestId ?? "unknown"} error`, error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
