import { z } from "zod";
import { validate } from "@typeschema/zod";

const loginSchema = z.object({
  email: z.string().email(),
  token: z.string(),
});

const boardedUserSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  nickname: z.string().min(3).max(20),
  preferredGenres: z.array(z.string()),
});

export function validateLogin(data: any) {
  return validate(loginSchema, data);
}

export function validateBoardedUser(data: any) {
  return validate(boardedUserSchema, data);
}
