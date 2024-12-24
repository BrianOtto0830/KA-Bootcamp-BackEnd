import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { categorySchema } from "@/schema/category";
import { ZodError } from "zod";
import { verifyUser } from "@/lib/verify";
import prisma from "@/lib/prisma";
import Swal from "sweetalert2";

export async function POST(request: Request) {
  try {
    //token verify user
    const user = await verifyUser(request);
    console.log(user);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    //sampai sini tokennya

    const body = await request.json();

    categorySchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json({
      data: category,
      success: true,
      message: "Create category success",
  }, {
      status: 201, // Include the status code
  });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: err.issues[0],
        },
        {
          status: 400,
        },
      );
    }
    console.log(err);
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: err?.message || "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json({
      data: categories,
      success: true,
      message: "Get categories success",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: err?.message || "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
