import dayjs from "dayjs";
import prisma from "./prisma";


export async function getProfit() {

    const today = dayjs();

    const startOfWeek = today.startOf("week").add(1, "day");

    const endOfWeek = today.endOf("week").add(1, "day");

    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: startOfWeek.toDate(), 
                lte: endOfWeek.toDate(),
            },
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    const groupedOrders: { day: string; orders: typeof orders }[] = [];

    orders.forEach((order) => {
        const day = dayjs(order.createdAt).format("dddd");

        const existingDay = groupedOrders.find((group) => group.day === day);

        if (existingDay) {
        existingDay.orders.push(order);
        } else {
        groupedOrders.push({ day, orders: [order] });
        }
    });

    return groupedOrders;
}