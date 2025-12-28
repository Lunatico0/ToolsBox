import { NextRequest, NextResponse } from "next/server";
import { UsersRepository } from "@/modules/users/user.repository";
import { createUserInputSchema } from "@/modules/users/user.types";

const usersRepo = new UsersRepository();

/**
 * Handlear el caso en que el DNI venga en formato Number
 */

export async function POST (req: NextRequest) {
  try {
    const body = createUserInputSchema.parse(await req.json());

    const user = await usersRepo.create({
      name: body.name,
      lastName: body.lastName,
      dni: body.dni,
      role: body.role,
    });

    return NextResponse.json( user , { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const users = await usersRepo.findAll();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
