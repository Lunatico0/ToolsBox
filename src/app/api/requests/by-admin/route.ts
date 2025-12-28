import { NextRequest, NextResponse } from "next/server";
import { createRequestByAdminSchema } from "@/modules/requests/request.types";
import { buildRequestService } from "../_service";

export async function POST(req: NextRequest) {
  try {
    const body = createRequestByAdminSchema.parse(await req.json());
    const service = buildRequestService();

    const result = await service.createRequestsByAdmin(body);

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
