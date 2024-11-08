import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { categorySchema } from "@/schema/category";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    const user = await verifyUser(request);
    console.log(user);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    categorySchema.parse(body);

    const category = await prisma.category.findFirst({
      where: {
        id: Number(params.categoryId),
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        },
      );
    }

    const updateCategory = await prisma.category.update({
      where: {
        id: Number(params.categoryId),
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json({
      data: category,
      success: true,
      message: "Create category success",
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

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    const categoryId = Number(params.categoryId);

    // Fetch the category by its ID
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Category Not Found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        data: category,
        success: true,
        message: "Get category success",
      },
      {
        status: 200,
      },
    );
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

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    const user = await verifyUser(request);
    console.log(user);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const category = await prisma.category.findFirst({
      where: {
        id: Number(params.categoryId),
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Category Not Found",
        },
        {
          status: 400,
        },
      );
    }
    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });

    return NextResponse.json(
      {
        data: category,
        success: true,
        message: "Delete category success",
      },
      {
        status: 200,
      },
    );
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