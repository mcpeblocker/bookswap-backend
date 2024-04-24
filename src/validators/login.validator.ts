import { validate } from "@typeschema/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  idToken: z.string(),
});

export function validateLogin(data: any) {
  return validate(loginSchema, data);
}
