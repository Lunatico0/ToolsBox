import { NextRequest, NextResponse } from "next/server";
import { createRequestInputSchema } from "@/modules/requests/request.types";
import { buildRequestService } from "./_service";

export async function POST(req: NextRequest) {
  try {
    const body = createRequestInputSchema.parse(await req.json());
    const service = buildRequestService();

    const requests = await service.createRequests(body);

    return NextResponse.json(requests, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const service = buildRequestService();
    const requests = await service.getAllRequests();

    return NextResponse.json(requests);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
