import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { createTool, listTools } from "@/services/tools";
import { ServiceError } from "@/services/errors";

const toolSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(2),
  model: z.string().min(1),
  description: z.string().optional(),
  location: z.object({
    shelf: z.string().min(1),
    column: z.string().min(1),
    row: z.string().min(1),
  }),
});

export async function GET() {
  const tools = await listTools();
  return NextResponse.json({ tools });
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = await request.json();
    const data = toolSchema.parse(payload);

    const tool = await createTool(data);
    return NextResponse.json({ tool }, { status: 201 });
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

    console.error("POST /api/tools error", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
