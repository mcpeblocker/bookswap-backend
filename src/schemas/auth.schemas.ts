import { z } from "zod";
import { ErrorCode } from "../enums/ErrorCode.enum";

export const loginSchema = z.object({
  email: z
    .string({ message: ErrorCode.INVALID_EMAIL })
    .email({ message: ErrorCode.INVALID_EMAIL }),
  token: z.string({ message: ErrorCode.INVALID_TOKEN }),
});

export const boardedUserSchema = z.object({
  userId: z.string({
    message: ErrorCode.INVALID_USER_ID,
  }),
  email: z
    .string({
      message: ErrorCode.INVALID_EMAIL,
    })
    .email({
      message: ErrorCode.INVALID_EMAIL,
    }),
  nickname: z
    .string({
      message: ErrorCode.INVALID_NICKNAME,
    })
    .min(3, {
      message: ErrorCode.INVALID_NICKNAME,
    })
    .max(20, {
      message: ErrorCode.INVALID_NICKNAME,
    }),
  preferredGenres: z.string({
    message: ErrorCode.INVALID_GENRE,
  }),
});

export default {
  login: loginSchema,
  board: boardedUserSchema,
};
