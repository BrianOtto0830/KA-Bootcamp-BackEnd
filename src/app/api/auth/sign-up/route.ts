import prisma from "@/lib/prisma";
import { userSignUpSchema } from "@/schema/user";
import { NextResponse } from "next/server";
import { hashSync } from "bcrypt";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    userSignUpSchema.parse(body);
    const { name, email, password, phoneNumber, roles } = body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
        phoneNumber,
        roles,
      },
    });

    const { password: newPassword, ...props } = user;
    return NextResponse.json({
      data: props,
      success: false,
      message: "success",
    });
  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return NextResponse.json({
        data: null,
        success: false,
        message: err.issues[0],
      });
    } else if (err instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({
        data: null,
        success: false,
        message: "email already in database",
      });
    } else {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Internal server eror",
        },
        {
          status: 500,
        },
      );
    }
  }
}