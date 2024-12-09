import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import prisma from "@/lib/prisma";

export default async function Home() {
  //tampilkan semua category
  const categories = await prisma.category.findMany(
    {
      include: {
        products: true,
      },
    }
  );
  //tampilkan semua product
  const products = await prisma.product.findMany({
    include: {
      items: {
        include: {
          color: true,
        },
      },
      colors: true,
      category: true
    },
  });
  //tampilkan semua order
  const orders = await prisma.order.count();
  //tampilkan jumlah user customer
  const customer = await prisma.user.count({
    where: {
      roles: "CUSTOMER"
    }
  });
  
  return (
    <div>
      <ECommerce customers={customer} categories={categories} products={products} orders={orders} />
    </div>
  );
}
