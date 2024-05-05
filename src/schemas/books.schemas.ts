import { z } from "zod";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { Visibility } from "../enums/Visibility.enum";

export const uploadSchema = z.object({
  title: z.string({
    message: ErrorCode.INVALID_TITLE,
  }),
  author: z.string({
    message: ErrorCode.INVALID_AUTHOR,
  }),
  genre: z.string({
    message: ErrorCode.INVALID_GENRE,
  }),
  visibility: z.nativeEnum(Visibility, {
    message: ErrorCode.INVALID_VISIBILITY,
  }),
  exceptions: z.string({
    message: ErrorCode.INVALID_EXCEPTION,
  }).optional(),
});

export const editSchema = z.object({
  title: z
    .string({
      message: ErrorCode.INVALID_TITLE,
    })
    .optional(),
  author: z
    .string({
      message: ErrorCode.INVALID_AUTHOR,
    })
    .optional(),
  genre: z
    .string({
      message: ErrorCode.INVALID_GENRE,
    })
    .optional(),
  visibility: z
    .nativeEnum(Visibility, {
      message: ErrorCode.INVALID_VISIBILITY,
    })
    .optional(),
  exceptions: z
    .string({
      message: ErrorCode.INVALID_EXCEPTION,
    })
    .optional(),
});

export default {
  upload: uploadSchema,
  edit: editSchema,
};
