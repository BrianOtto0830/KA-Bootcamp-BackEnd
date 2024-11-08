import { z } from "zod";
export const userSignUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string(),
  roles: z.enum(["ADMIN", "CUSTOMER"]),
});

export const userSignInSchema = z.object({
  email: z.string().email().min(3),
  password: z.string().min(6),
});