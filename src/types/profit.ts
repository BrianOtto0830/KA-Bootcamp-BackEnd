import { Color, OrderItems, Product } from "@prisma/client";

export type Profit = {
    day: string;
    orders: {
        items: (OrderItems & {
            product: Product;
        })[];
    }[];
};