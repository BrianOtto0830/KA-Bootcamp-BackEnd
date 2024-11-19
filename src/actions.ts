"use server";

import { number, string, ZodError } from "zod";
import prisma from "./lib/prisma";
import { userSignInSchema } from "./schema/user";
import { compareSync } from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { categorySchema } from "./schema/category";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { productSchema } from "./schema/product";
interface Color {
  color: string;
  quantity: number;
}

//sign in
export async function signIn(formData: FormData) {
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
  try {
    //get data from request
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    //validasi data dari request
    userSignInSchema.parse(body);

    //get user by email
    const user = await prisma.user.findUnique({
      where: {
        email: body.email as string,
      },
    });

    //cek if user exsting or not
    if (!user) {
      throw new Error("email or pasword is wrong");
    }
    //cek if user role is ADMIN
    if (user.roles !== "ADMIN") {
      throw new Error("email or pasword is wrong");
    }

    //destructur the data
    const { password, ...props } = user;

    //chek if the pasword from request, same like the user.pasword
    if (!compareSync(body.password as string, password)) {
      throw new Error("email or pasword is wrong");
    }
    // create secret
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      userId: user?.id,
      email: user?.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    //set cookie
    cookies().set("token", token);
    //return the token
    return { token };
    //end of try
  } catch (err: any) {
    console.log(err);
    //cek if the error is instance of ZodError
    if (err instanceof ZodError) {
      return { error: "please insert a corect data" };
      //end of if
    } else {
      return { error: err?.message || "internal server eror" };
    }
  }
}
//sign out
export async function signOut() {
  try {
    // Clear the token cookie to log out the user
    cookies().delete("token");

    // Optionally return a message indicating success
    return { message: "Successfully signed out" };
  } catch (err: any) {
    console.log(err);
    return { error: err?.message || "Internal server error during sign out" };
  }
}

//create category
export async function createCategory(formData: FormData) {
  try {
    const body = {
      name: formData.get("name"),
      isActive: formData.get("isActive"),
      description: formData.get("description"),
    };

    categorySchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name: body.name as string,
        description: body.description as string,
        isActive: body.isActive === "1" ? true : false,
      },
    });

    return {
      success: true,
      data: category,
    };
  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return { success: false, error: "please insert a corect data" };
      //end of if
    } else {
      return { success: false, error: err?.message || "internal server eror" };
    }
  }
}

//edit category
export async function editCategory(id: number, formData: FormData) {
  try {
    const body = {
      name: formData.get("name"),
      isActive: formData.get("isActive"),
      description: formData.get("description"),
    };

    categorySchema.parse(body);

    const updatedCategory = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name as string,
        description: body.description as string,
        isActive: body.isActive === "1" ? true : false,
      },
    });
    revalidatePath("/categories");
    return {
      success: true,
      data: updatedCategory,
    };
  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return { success: false, error: "please insert a corect data" };
      //end of if
    } else {
      return { success: false, error: err?.message || "internal server eror" };
    }
  }
}
//delete category
export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    revalidatePath("/categories");
    return {
      success: true,
    };
  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return { success: false, error: "please insert a corect data" };
      //end of if
    } else {
      return { success: false, error: err?.message || "internal server eror" };
    }
  }
}
// delete product
export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    revalidatePath("/products");
    return {
      success: true,
    };
  } catch (err: any) {
    console.log(err);
  }
}

//create product
export async function createProduct(
  formData: FormData,
  colors: Color[],
  images: string[],
) {
  try {
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      categoryId: Number(formData.get("categoryId")),
      price: Number(formData.get("price")),
      company: formData.get("company"),
      images,
      colors,
    };
    console.log(body);
    productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: body.name as string,
        description: body.description as string,
        categoryId: Number(body.categoryId),
        images: body.images,
        price: Number(body.price),
        company: body.company as string,
      },
    });

    for (const color of colors) {
      await prisma.color.create({
        data: {
          color: color.color,
          quantity: color.quantity,
          productId: product.id,
        },
      });
    }

    return {
      success: true,
      data: product,
    };
  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return { success: false, error: "Please insert a correct data" };
    } else {
      return { success: false, error: err?.message || "Internal server error" };
    }
  }
}

export async function updateProduct(
  formData: FormData,
  colors: {
    color: string;
    quantity: number;
    id?: number;
  }[],
  images: string[],
  id: number,
  idsColor: number[]
) {
  try {
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      categoryId: Number(formData.get("categoryId")),
      price: Number(formData.get("price")),
      company: formData.get("company"),
      images,
      colors,
    };
    console.log(body);
    productSchema.parse(body);

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name as string,
        description: body.description as string,
        categoryId: Number(body.categoryId),
        images: body.images,
        price: Number(body.price),
        company: body.company as string,
      },
    });

    for (const color of colors) {
      if (color.id) {
      await prisma.color.create({
        data: {
          color: color.color,
          quantity: color.quantity,
          productId: product.id,
        },
      });
    } else{
      await prisma.color.update({
        where: {
          id: color.id,
        },
        data: {
          color: color.color,
          quantity: color.quantity,
        },
      });
    }
  }
  
  for (const id of idsColor){
    await prisma.color.delete({
      where: {
        id: id,
      },
    });
  }

    return {
      success: true,
      data: product,
    };
  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return { success: false, error: "Please insert a correct data" };
    } else {
      return { success: false, error: err?.message || "Internal server error" };
    }
  }
}
