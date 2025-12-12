import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { ServiceError } from "@/services/errors";
import { createRequest, listRequests } from "@/services/requests";

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

  const requests = await listRequests();
  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = createSchema.parse(payload);

    const newRequest = await createRequest(data);

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof ServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("POST /api/requests error", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
