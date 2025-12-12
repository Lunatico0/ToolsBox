import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongoose";
import { Request as RequestModel } from "@/models/Request";
import { Tool } from "@/models/Tool";

const actionSchema = z.object({
  action: z.enum(["approve", "return"]),
  approver: z.string().min(2).optional(),
  returnNotes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let requestId: string | undefined;
  try {
    await requireAdminSession();
    const { id } = await params;
    requestId = id;
    const payload = await request.json();
    const data = actionSchema.parse(payload);

    await dbConnect();
    const existing = await RequestModel.findById(requestId)
      .populate("tools")
      .populate("user");

    if (!existing) {
      return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 });
    }

    if (data.action === "approve") {
      if (!data.approver) {
        return NextResponse.json(
          { message: "Se requiere el nombre del aprobador" },
          { status: 400 },
        );
      }

      if (existing.status !== "pending") {
        return NextResponse.json(
          { message: "Solo las solicitudes pendientes pueden aprobarse" },
          { status: 400 },
        );
      }

      const tools = await Tool.find({ _id: { $in: existing.tools } });

      const unavailable = tools.filter((tool) => tool.status !== "available");
      if (unavailable.length > 0) {
        return NextResponse.json(
          {
            message: `Las siguientes herramientas ya no están disponibles: ${unavailable
              .map((t) => t.name)
              .join(", ")}`,
          },
          { status: 400 },
        );
      }

      existing.status = "approved";
      existing.approver = data.approver;
      existing.approvedAt = new Date();

      await Tool.updateMany(
        { _id: { $in: existing.tools } },
        {
          status: "assigned",
          assignedTo: existing.technicianName,
          assignedAt: new Date(),
        },
      );

      await existing.save();

      return NextResponse.json({ request: existing });
    }

    if (existing.status !== "approved") {
      return NextResponse.json(
        { message: "Solo las solicitudes aprobadas pueden devolverse" },
        { status: 400 },
      );
    }

    existing.status = "returned";
    existing.returnedAt = new Date();
    existing.returnNotes = data.returnNotes ?? existing.returnNotes;

    await Tool.updateMany(
      { _id: { $in: existing.tools } },
      { status: "available", assignedAt: null, assignedTo: null },
    );

    await existing.save();

    return NextResponse.json({ request: existing });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    console.error(`PATCH /api/requests/${requestId ?? "unknown"} error`, error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
