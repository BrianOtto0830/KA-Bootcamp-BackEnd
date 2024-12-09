import { BRAND } from "@/types/brand";
import { Category, Color, Order, OrderItems, Product } from "@prisma/client";
import Image from "next/image";



type TableOneProps = {
  products : (Product & {
    items : (OrderItems & {
      color : Color;
    })[];
    quantity: number;
    colors: Color[];
    category: Category;
  })[];
};

const TableOne = ({products}: TableOneProps) => {
  
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Products
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Price
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Color
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Total items purchased
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Category
            </h5>
          </div>
        </div>

        {products.map((product, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === products.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            {/* tampilkan gambar dan nama product */}
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_IMAGE}/${(product.images as string[])[0]}`} alt="Brand" width={48} height={48} />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {product.name}
              </p>
            </div>
            {/* tampilkan harga dari product yang terjual */}
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">Rp. {product.price}</p>

            </div>

            {/* tampilkan warna dari product yang terjual */}
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              {product.colors.map((color) => (
                <div
                  key={color.id}
                  style={{ 
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "1px solid #000",
                    backgroundColor: color.color,
                    marginRight: "5px"
                   }}
                ></div>
              ))}
            </div>
            {/* tampilkan product yang dibeli */}
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{product.quantity}</p>
            </div>
            {/* tampilkan category */}
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{product.category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
