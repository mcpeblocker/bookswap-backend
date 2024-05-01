import { Request } from "express";
import mongoose from "mongoose";

export interface AuthRequest extends Request {
  userId?: mongoose.Types.ObjectId;
}
