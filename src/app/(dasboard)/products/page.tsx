import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import Link from "next/link";

import dayjs from "dayjs";
import Image from "next/image";
import { Product } from "@/types/product";
import UpdateDeleteBtn from "@/app/_components/update-delete-btn";

export default async function ProductsPage() {
  // get products
  const products = await prisma.product.findMany({
    include: {
      category: true,
      colors: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(products);
  
  return (
    <div>
      <Breadcrumb pageName="Products" />
      <div className="flex justify-end">
        <Link
          href="/products/create "
          className="btn btn-primary m-2 rounded-lg bg-green-600  px-7 py-3 text-white transition-all duration-300 ease-in-out hover:bg-green-900"
        >
          add Product
        </Link>
      </div>
      {/* product */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Top Products
          </h4>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Product Name</p>
          </div>
          {/* <div className="col-span-3 flex items-center">
            <p className="font-medium">Company</p>
          </div> */}
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Price</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Color</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Action</p>
          </div>
        </div>

        {products.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            {/* product name */}
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="mb-2 mt-2 flex h-12.5 w-15 overflow-hidden rounded-md">
                  <Image
                    src={`${process.env.SUPABASE_PUBLIC_IMAGE}/${(product.images as string[])[0]}`}
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {product.name}
                </p>
              </div>
            </div>
            {/* category */}
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product.category.name}
              </p>
            </div>
            {/* price */}
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                ${product.price}
              </p>
            </div>
            {/* color */}
            <div className="col-span-1 flex items-center">
              <p className="flex items-center gap-2 text-sm text-black dark:text-white">
                {product.colors.map((color) => (
                  <div key={color.id} className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: color.color,
                        height: "20px",
                        width: "20px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>
                ))}
              </p>
            </div>
            {/* action */}
            <div className="col-span-1 flex items-center">
              <UpdateDeleteBtn
                url={`products/${product.id}`}
                type="product"
                id={product.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
