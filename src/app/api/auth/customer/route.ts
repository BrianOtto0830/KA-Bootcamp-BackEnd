import prisma from "@/lib/prisma";

import { userSignInSchema } from "@/schema/user";
import { NextResponse } from "next/server";
import { compareSync, hashSync } from "bcrypt";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    //get data from request
    const body = await request.json();
    userSignInSchema.parse(body);

    //get user by email

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    //cek if user exsting or not
    if (!user) {
      return new NextResponse("user not found", { status: 404 });
    }
    //cek if user role is ADMIN
    if (user.roles !== "CUSTOMER") {
      return new NextResponse("User not customer", { status: 401 });
    }

    //destructur the data
    const { password, ...props } = user;

    //chek if the pasword from request, same like the user.pasword
    if (!compareSync(body.password, password)) {
      return new NextResponse("you are not authorized to acces this route", {
        status: 401,
      });
    }
    // create secret
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      userId: user?.id,
      email: user?.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    return NextResponse.json({ ...props, token }, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err, { status: 500 });
  }
}
