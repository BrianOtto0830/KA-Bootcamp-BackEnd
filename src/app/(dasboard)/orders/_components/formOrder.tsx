import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

interface FormOrderProps {
    order: any; // Anda bisa mengganti dengan tipe data yang sesuai
}

export default async function FormOrder({ order }: FormOrderProps) {
    

    return (
        <div>
            <Breadcrumb pageName="Order" />
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Order ID
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Product Name
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Color
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Items Ordered
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Total Price
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.items.map((item: any, key: number) => (
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
                        {/* Items Color */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {
                                // Cari warna berdasarkan ID
                                order.items[0].product.colors.find(
                                    (color: any) => color.id === order.items[0].colorId
                                )?.color || "Unknown Color" 
                            }
                            </h5>
                        </td>
                        {/* Quantity */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {order.items[0].quantity}
                            </h5>
                        </td>
                        {/* Total Price */}
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                            {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.items.reduce((total: any, item: any) => total + item.product.price * item.quantity, 0))}
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