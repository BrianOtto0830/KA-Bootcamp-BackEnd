import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

export default async function FormOrder() {
    const orders = await prisma.order.findMany({
        include: {
            items:{
                include:{
                    product: {
                        include: {
                            colors: true
                        }
                    },
                }
            }
        }
    }
    );

    return (
        <div>
            <Breadcrumb pageName="Order" />
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                        Order ID
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Product
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Color
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Quantity
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Create At
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order, key) => (
                        <tr key={key}>
                        {/* Order ID */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.id}
                            </h5>
                        </td>
                        {/* items */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.items[0].product.name}
                            </h5>
                        </td>
                        {/* Color */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.items[0].colorId}
                            </h5>
                        </td>
                        {/* Quantity */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.items[0].quantity}
                            </h5>
                        </td>                                                                 
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}