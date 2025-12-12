import { NextResponse } from "next/server";
import { z } from "zod";

import { dbConnect } from "@/lib/mongoose";
import { hashPassword, setAuthCookie, signAdminToken, verifyPassword } from "@/lib/auth";
import { Admin } from "@/models/Admin";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = loginSchema.parse(payload);

    await dbConnect();

    let admin = await Admin.findOne({ email: data.email.toLowerCase() });
    const adminCount = await Admin.countDocuments();

    if (!admin && adminCount === 0 && process.env.DEFAULT_ADMIN_PASSWORD) {
      const passwordHash = await hashPassword(process.env.DEFAULT_ADMIN_PASSWORD);
      admin = await Admin.create({
        email: data.email.toLowerCase(),
        name: process.env.DEFAULT_ADMIN_NAME || "Administrador",
        passwordHash,
      });
    }

    if (!admin) {
      return NextResponse.json(
        { message: "Administrador no encontrado" },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(data.password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const token = signAdminToken(admin._id.toString());
    setAuthCookie(token);

    return NextResponse.json({
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("POST /api/admin/login error", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
