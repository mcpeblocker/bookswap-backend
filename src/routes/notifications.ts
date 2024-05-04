import express from "express";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../interfaces/AuthRequest.interface";
import { responser } from "../utils/requests";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { getNotifications } from "../services/notifications.service";

const router = express.Router();

router.get("/my", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).json(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const notifications = await getNotifications(req.userId);
  return res.json(responser.success({ notifications }));
});

export default router;
