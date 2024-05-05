import express from "express";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../interfaces/AuthRequest.interface";
import { responser } from "../utils/requests";
import { ErrorCode } from "../enums/ErrorCode.enum";
import {
  getChatByExchangeId,
  getChatsByUserId,
  getMessagesByExchangeId,
} from "../services/chats.service";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const chats = await getChatsByUserId(req.userId);
  return res.status(200).send(responser.success({ chats }));
});

router.get("/:exchangeId", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  if (!req.params.exchangeId) {
    return res.status(400).send(responser.error([ErrorCode.INVALID_ID]));
  }
  const exchangeId = new mongoose.Types.ObjectId(req.params.exchangeId);
  const chat = await getChatByExchangeId(exchangeId, req.userId);
  const messages = await getMessagesByExchangeId(exchangeId);
  return res.status(200).send(responser.success({ chat, messages }));
});

export default router;
