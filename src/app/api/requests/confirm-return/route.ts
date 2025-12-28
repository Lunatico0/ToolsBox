import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { returnRequestInputSchema } from "@/modules/requests/request.types";
import { buildRequestService } from "../_service";

const confirmReturnSchema = returnRequestInputSchema.extend({
  requestId: z.string().uuid("requestId inválido"),
});

export async function PATCH(req: NextRequest) {
  try {
    const { requestId, outcome, returnNotes } =
      confirmReturnSchema.parse(await req.json());

    const service = buildRequestService();

    await service.confirmReturn(requestId, outcome, returnNotes);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? err },
      { status: 400 }
    );
  }
}
