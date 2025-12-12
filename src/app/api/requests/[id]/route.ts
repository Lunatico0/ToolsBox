import { NextResponse } from "next/server";
import { z } from "zod";

import { dbConnect } from "@/lib/mongoose";
import { Request as RequestModel } from "@/models/Request";
import { Tool } from "@/models/Tool";

const actionSchema = z.object({
  action: z.enum(["approve", "return"]),
  approver: z.string().min(2).optional(),
  returnNotes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await request.json();
    const data = actionSchema.parse(payload);

    await dbConnect();
    const existing = await RequestModel.findById(params.id).populate("tool");

    if (!existing) {
      return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 });
    }

    const toolId = typeof existing.tool === "string" ? existing.tool : existing.tool._id;

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

      const tool = await Tool.findById(toolId);
      if (!tool) {
        return NextResponse.json({ message: "Herramienta no encontrada" }, { status: 404 });
      }

      if (tool.status !== "available") {
        return NextResponse.json(
          { message: "La herramienta ya está asignada" },
          { status: 400 },
        );
      }

      existing.status = "approved";
      existing.approver = data.approver;
      existing.approvedAt = new Date();

      tool.status = "assigned";
      tool.assignedTo = existing.technician;
      tool.assignedAt = new Date();

      await tool.save();
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

    await Tool.findByIdAndUpdate(toolId, {
      status: "available",
      assignedAt: null,
      assignedTo: null,
    });

    await existing.save();

    return NextResponse.json({ request: existing });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error(`PATCH /api/requests/${params.id} error`, error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
