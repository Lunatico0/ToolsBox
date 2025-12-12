import { NextResponse } from "next/server";
import { z } from "zod";

import { dbConnect } from "@/lib/mongoose";
import { Request as RequestModel } from "@/models/Request";
import { Tool } from "@/models/Tool";

const createSchema = z.object({
  toolId: z.string().length(24),
  technician: z.string().min(2),
  purpose: z.string().optional(),
});

export async function GET() {
  await dbConnect();
  const requests = await RequestModel.find()
    .populate("tool")
    .sort({ createdAt: -1 });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = createSchema.parse(payload);

    await dbConnect();
    const tool = await Tool.findById(data.toolId);

    if (!tool) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }

    if (tool.status !== "available") {
      return NextResponse.json(
        { message: "La herramienta no está disponible" },
        { status: 400 },
      );
    }

    const newRequest = await RequestModel.create({
      tool: tool._id,
      technician: data.technician,
      purpose: data.purpose,
    });

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("POST /api/requests error", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
