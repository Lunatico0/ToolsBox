// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";

// import { requireAdminSession } from "@/lib/auth";
// import { dbConnect } from "@/lib/mongoose";
// import { Tool } from "@/models/Tool";

// const updateSchema = z.object({
//   name: z.string().min(2).optional(),
//   brand: z.string().min(2).optional(),
//   model: z.string().min(1).optional(),
//   description: z.string().optional(),
//   location: z
//     .object({
//       shelf: z.string().min(1),
//       column: z.string().min(1),
//       row: z.string().min(1),
//     })
//     .optional(),
// });

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   let toolId: string | undefined;
//   try {
//     await requireAdminSession();
//     const payload = await request.json();
//     const data = updateSchema.parse(payload);
//     const { id } = await params;
//     toolId = id;

//     await dbConnect();
//     const updated = await Tool.findByIdAndUpdate(
//       toolId,
//       { $set: data },
//       { new: true },
//     );

//     if (!updated) {
//       return NextResponse.json({ message: "Tool not found" }, { status: 404 });
//     }

//     return NextResponse.json({ tool: updated });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ message: error.message }, { status: 400 });
//     }

//     if (error instanceof Error && error.message === "Unauthorized") {
//       return NextResponse.json({ message: "No autorizado" }, { status: 401 });
//     }

//     console.error(`PATCH /api/tools/${toolId ?? "unknown"} error`, error);
//     return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
//   }
// }
