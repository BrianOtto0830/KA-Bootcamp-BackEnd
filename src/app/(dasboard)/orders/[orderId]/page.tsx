import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormOrder from "../_components/formOrder";

export default async function OrderDetail({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await prisma.order.findUnique({
    where: {
      id: Number(params.orderId),
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              colors: true,
            },
          },
        },
      },
    },
  });
  if (!order) {
    return notFound();
  }
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
  });
  return (
    <div>
      <Breadcrumb pageName="Product Detail" />
      {/* form order here */}
      <FormOrder categories={categories} order={order} />
      
    </div>
  );
}
