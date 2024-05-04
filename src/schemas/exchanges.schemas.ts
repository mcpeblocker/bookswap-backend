import { z } from "zod";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { Visibility } from "../enums/Visibility.enum";

const requestSchema = z.object({
  bookId: z.string({ message: ErrorCode.INVALID_ID }),
});

const acceptSchema = z.object({
  exchangeId: z.string({ message: ErrorCode.INVALID_ID }),
  bookId: z.string({ message: ErrorCode.INVALID_ID }),
});

const swapSchema = z.object({
  exchangeId: z.string({ message: ErrorCode.INVALID_ID }),
});

export default {
  request: requestSchema,
  accept: acceptSchema,
  swap: swapSchema,
};
