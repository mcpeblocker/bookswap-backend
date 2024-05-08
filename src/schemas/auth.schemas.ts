import { z } from "zod";
import { ErrorCode } from "../enums/ErrorCode.enum";

export const loginSchema = z.object({
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

const modifySchema = z.object({
  name: z
    .string({
      message: ErrorCode.INVALID_NICKNAME,
    })
    .optional(),
  nickname: z
    .string({
      message: ErrorCode.INVALID_NICKNAME,
    })
    .min(3, {
      message: ErrorCode.INVALID_NICKNAME,
    })
    .max(20, {
      message: ErrorCode.INVALID_NICKNAME,
    })
    .optional(),
  preferredGenres: z
    .string({
      message: ErrorCode.INVALID_GENRE,
    })
    .optional(),
});

export default {
  login: loginSchema,
  board: boardedUserSchema,
  modify: modifySchema,
};
