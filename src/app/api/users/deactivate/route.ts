import { NextResponse, NextRequest } from "next/server";
import { UsersRepository } from "@/modules/users/user.repository";
import { z } from "zod";

const usersRepo = new UsersRepository();

const deactivateUserSchema = z.object({
  userId: z.string().uuid("UserId inválido"),
});

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = deactivateUserSchema.parse(await req.json());
    await usersRepo.deactivate(userId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
