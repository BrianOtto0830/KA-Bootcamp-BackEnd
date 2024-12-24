import { productSchema } from "@/schema/product";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";
import Swal from "sweetalert2";


type Color = {
  color: string;
  quantity: number;
};
//create
export async function POST(request: Request) {
  try {
    const user = await verifyUser(request);
    console.log(user);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    productSchema.parse(body);

    const category = await prisma.category.findFirst({
      where: {
        id: body.categoryId,
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

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        company: body.company,
        images: body.images,
        categoryId: body.categoryId,
        description: body.description,
      },
    });

    await prisma.color.createMany({
      data: body.colors.map((color: Color) => ({
        color: color.color,
        quantity: color.quantity,
        productId: product.id,
      })),
    });

    Swal.fire({
      icon: 'success',
      title: 'Create product success',
      text: `Data: ${JSON.stringify(product)}`,
      }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({
      data: null,
      success: false,
      message: "Internal server error",
    });
  }
}
//read
export async function GET(request: Request) {
  try {
    // const user = await verifyUser(request);
    // console.log(user);

    // if (!user) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }
    const products = await prisma.product.findMany({
      include: {
        colors: true,
        category: true,
      },
    });
    return NextResponse.json(
      {
        data: products,
        success: true,
        message: "Get Products Success",
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: err?.message || "Internal server eror",
      },
      {
        status: 500,
      },
    );
  }
}
