import { NextRequest, NextResponse } from "next/server";
import { buildRequestService } from "../_service";

export async function PATCH(req: NextRequest) {
  try {
    const { requestId } = await req.json();

    if (!requestId) {
      throw new Error("requestId requerido");
    }

    const service = buildRequestService();
    await service.requestReturn(requestId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
