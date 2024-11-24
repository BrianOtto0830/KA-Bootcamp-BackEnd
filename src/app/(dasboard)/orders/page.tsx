import UpdateDeleteBtn from "@/app/_components/update-delete-btn";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import Link from "next/link";

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            items:{
                include:{
                    product: true,
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
                        Status
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Address
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Postal Code
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Country
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        City
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Create At
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order, key) => (
                        <tr key={key}>
                        {/* Status */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.status}
                            </h5>
                        </td>
                        {/* address */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.address}
                            </h5>
                        </td>
                        {/* Postal Code */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.postalCode}
                            </h5>
                        </td>
                        {/* Country */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.country}
                            </h5>
                        </td>
                        {/* City */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.city}
                            </h5>
                        </td>
                        {/* created at */}
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                            {dayjs(order.createdAt).format("DD MMMM YYYY")}
                            </p>
                        </td>   
                        {/* Action See Order Details */}
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <button className="col-span-1 flex items-center justify-center bg-green-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 font-semibold dark:bg-gray-500 dark:text-black dark:hover:bg-gray-600">
                                <Link href={`/orders/${order.id}`}>
                                    <span>See Order Details</span>
                                </Link>
                            </button>
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