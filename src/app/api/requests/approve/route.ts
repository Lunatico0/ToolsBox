import { NextRequest, NextResponse } from "next/server";
import { approveRequestInputSchema } from "@/modules/requests/request.types";
import { buildRequestService } from "../_service";

export async function PATCH(req: NextRequest) {
  try {
    const { requestId, approverUserId } = approveRequestInputSchema
      .extend({ requestId: approveRequestInputSchema.shape.approverUserId })
      .parse(await req.json());

    const service = buildRequestService();
    await service.approveRequest(requestId, approverUserId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
