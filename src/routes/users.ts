import express from "express";
import { responser } from "../utils/requests";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { searchUsersByNickname } from "../services/users.service";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../interfaces/AuthRequest.interface";

const router = express.Router();

router.use(auth);

router.get("/search", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).json(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const text = req.query.text?.toString();
  if (!text) {
    return res.status(400).json(responser.error([ErrorCode.INVALID_QUERY]));
  }
  const users = await searchUsersByNickname(text, req.userId);
  if (!users) {
    return res.status(500).json(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).json(responser.success({ users }));
});

export default router;
