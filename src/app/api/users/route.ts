import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

const userSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dni: z.string().min(6),
});

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 });
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = await request.json();
    const data = userSchema.parse(payload);

    await dbConnect();

    const existing = await User.findOne({ dni: data.dni });
    if (existing) {
      return NextResponse.json(
        { message: "Ya existe un usuario con ese DNI" },
        { status: 400 },
      );
    }

    const user = await User.create({ ...data });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    console.error("POST /api/users error", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
