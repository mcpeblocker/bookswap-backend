import { Request, Response, NextFunction } from "express";
import { IResponseBody } from "../interfaces/ResponseBody.interface";
import { ZodSchema } from "zod";
import { validate } from "@typeschema/zod";
import { ErrorCode } from "../enums/ErrorCode.enum";

export function validator(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validationResult = await validate(schema, req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json(
          responser.error(
            validationResult.issues.map((issue) => issue.message as ErrorCode)
          )
        );
    }
    next();
  };
}

export const responser = {
  success: (data: any) => ({ success: true, data } as IResponseBody),
  error: (issues: ErrorCode[]) =>
    ({
      success: false,
      issues: issues.map((issue) => ({ code: issue })),
    } as IResponseBody),
};
