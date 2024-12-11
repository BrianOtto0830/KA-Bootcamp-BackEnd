import ECommerce from "@/components/Dashboard/E-commerce";
import prisma from "@/lib/prisma";
import { getProfit } from "@/lib/profit";


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

  const profits = await getProfit();
  console.log("cek profits: ",profits);

  
  
  return (
    <div>
      <ECommerce customers={customer} categories={categories} products={products} orders={orders} profits={profits} />
    </div>
  );
}
