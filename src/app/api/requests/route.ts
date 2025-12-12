import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongoose";
import { Request as RequestModel } from "@/models/Request";
import { Tool } from "@/models/Tool";
import { User } from "@/models/User";

const createSchema = z.object({
  toolIds: z.array(z.string().length(24)).min(1),
  technicianDni: z.string().min(6),
  purpose: z.string().optional(),
});

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const requests = await RequestModel.find()
    .populate("tools")
    .populate("user")
    .sort({ createdAt: -1 });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = createSchema.parse(payload);

    await dbConnect();

    const user = await User.findOne({ dni: data.technicianDni });
    if (!user) {
      return NextResponse.json(
        { message: "No se encontró un usuario con ese DNI" },
        { status: 404 },
      );
    }

    const tools = await Tool.find({ _id: { $in: data.toolIds } });

    if (tools.length !== data.toolIds.length) {
      return NextResponse.json(
        { message: "Alguna herramienta seleccionada no existe" },
        { status: 404 },
      );
    }

    const unavailable = tools.filter((tool) => tool.status !== "available");
    if (unavailable.length > 0) {
      return NextResponse.json(
        {
          message: `Las siguientes herramientas no están disponibles: ${unavailable
            .map((t) => t.name)
            .join(", ")}`,
        },
        { status: 400 },
      );
    }

    const newRequest = await RequestModel.create({
      tools: tools.map((tool) => tool._id),
      user: user._id,
      technicianName: `${user.firstName} ${user.lastName}`,
      purpose: data.purpose,
    });

    const populated = await newRequest.populate(["tools", "user"]);

    return NextResponse.json({ request: populated }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("POST /api/requests error", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
