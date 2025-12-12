import { NextResponse } from "next/server";
import { z } from "zod";

import { dbConnect } from "@/lib/mongoose";
import { Tool } from "@/models/Tool";

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
  await dbConnect();
  const tools = await Tool.find().sort({ createdAt: -1 });
  return NextResponse.json({ tools });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = toolSchema.parse(payload);

    await dbConnect();
    const tool = await Tool.create({ ...data });
    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("POST /api/tools error", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
