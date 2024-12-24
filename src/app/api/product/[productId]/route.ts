import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { productSchema } from "@/schema/product";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";
import Swal from "sweetalert2";
//update id
type Color = {
  color: string;
  quantity: number;
};
export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } },
) {
  try {
    const user = await verifyUser(request);
    console.log(user);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await request.json();

    productSchema.parse(body);

    const product = await prisma.product.findFirst({
      where: {
        id: Number(params.productId),
      },
    });
    if (!product) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Product not found",
        },
        {
          status: 400,
        },
      );
    }
    const updateProduct = await prisma.product.update({
      where: {
        id: Number(params.productId),
      },
      data: {
        name: body.name,
      },
    });

    for (const color of body.colors) {
      await prisma.color.update({
        where: {
          id: color.id,

          productId: product.id,
        },
        data: {
          color: color.color,

          quantity: color.quantity,
        },
      });
    }

    Swal.fire({
      icon: 'success',
      title: 'Update Product success',
      text: `Data: ${JSON.stringify(updateProduct)}`,
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
    } else {
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
}
//delet id
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } },
) {
  try {
    const user = await verifyUser(request);
    console.log(user);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Cari produk berdasarkan ID
    const product = await prisma.user.findFirstOrThrow({
      where: {
        id: Number(params.productId),
      },
    });
    console.log(Number(params.productId));
    // Jika produk tidak ditemukan
    if (!product) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Product not found",
        },
        {
          status: 400,
        },
      );
    }

    // Hapus produk berdasarkan ID
    await prisma.product.delete({
      where: {
        id: Number(params.productId),
      },
    });

    return NextResponse.json({
      data: null,
      success: true,
      message: "Product deleted successfully",
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
//get id
export async function GET(
  request: Request,
  { params }: { params: { productId: string } },
) {
  try {
    const productId = Number(params.productId);

    if (productId) {
      // Fetch the product by its ID
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          colors: true,
        },
      });

      if (!product) {
        return NextResponse.json(
          {
            data: null,
            success: false,
            message: "Product Not Found",
          },
          {
            status: 404,
          },
        );
      }

      return NextResponse.json(
        {
          data: product,
          success: true,
          message: "Get product by id success",
        },
        {
          status: 200,
        },
      );
    } else {
      // If no ID is provided, fetch all products
      const products = await prisma.product.findMany();

      return NextResponse.json({
        data: products,
        success: true,
        message: "Get products success",
      });
    }
  } catch (err: any) {
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
