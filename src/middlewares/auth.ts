import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { responser } from "../utils/requests";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { AuthRequest } from "../interfaces/AuthRequest.interface";
import { verifyToken } from "../services/jwt.service";

export async function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // extract token from req header
  const authorizationHeader = req.header("Authorization");
  if (!authorizationHeader) {
    return res.status(401).json(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const token = authorizationHeader.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(401).json(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  // verify token
  try {
    const data = verifyToken(token);
    if (!data || typeof data !== "object") {
      return res.status(401).json(responser.error([ErrorCode.UNAUTHORIZED]));
    }
    const userId = data.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json(responser.error([ErrorCode.UNAUTHORIZED]));
    }
    req.userId = new mongoose.Types.ObjectId(userId as string);
    next();
  } catch (error) {
    return res.status(401).json(responser.error([ErrorCode.INVALID_TOKEN]));
  }
}
