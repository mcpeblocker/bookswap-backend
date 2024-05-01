import jwt from "jsonwebtoken";
import { config } from "../utils/config";

export const generateToken = (payload: any) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};