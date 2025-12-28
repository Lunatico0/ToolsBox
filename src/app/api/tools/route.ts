import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ToolsRepository } from "@/modules/tools/tool.repository";
import { createToolInputSchema } from "@/modules/tools/tool.types";

const toolsRepo = new ToolsRepository();

/**
 * POST /api/tools
 * Alta de herramienta (ADMIN)
 */
export async function POST(req: NextRequest) {
  try {
    const body = createToolInputSchema.parse(await req.json());

    const tool = await toolsRepo.create(body);

    return NextResponse.json(tool, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}

/**
 * GET /api/tools
 * Listado completo de herramientas
 */
export async function GET() {
  try {
    const tools = await toolsRepo.findAll();
    return NextResponse.json(tools);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
