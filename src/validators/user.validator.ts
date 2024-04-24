import { z } from "zod";
import { validate } from "@typeschema/zod";

const userSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(3).max(20),
  preferredGenres: z.array(z.string()),
});

export function validateUser(data: any) {
  return validate(userSchema, data);
}
