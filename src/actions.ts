"use server";

import { compareSync } from "bcrypt";
import prisma from "./lib/prisma";
import { userSignInSchema } from "./schema/user";
import { ZodError } from "zod";
import { SignJWT } from "jose";

// export async function createCategory(formData: FormData) {
//   try {
//     const name = formData.get("name");

//     await prisma.category.create({
//       data: {
//         name: name,
//       },
//     });
//   } catch (err: any) {
//     console.log();
//   }
// }


export async function signIn(formData: FormData) {
    try {
        const body = {
            email: formData.get("email"),
            password: formData.get("password")
        };
        userSignInSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: body.email as string
            }
        });

        if(!user) throw new Error("Email or Password is incorrect");
        if(!compareSync(body.password as string, user.password)) throw new Error("Email or Password is incorrect");

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({
            userId: user?.id,
            email: user?.email
        })
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret);

        return {
            token
        };
    } catch (error: any) {
        console.log(error);
        if(error instanceof ZodError){
            return {error: "Please fill the form correctly"};
        } else {
            return {error: error?.message || "Internal server error"};
        }
    }
}
