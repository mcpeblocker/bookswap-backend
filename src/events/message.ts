import mongoose from "mongoose";
import { Socket } from "socket.io";
import { createMessage } from "../services/messages.service";
import logger from "../utils/logger";
import { io } from "../core/io";

export default async function onMessage(
  socket: Socket,
  userId: mongoose.Types.ObjectId,
  {
    exchangeId,
    text,
  }: {
    exchangeId: string;
    text: string;
  }
) {
  try {
    if (!exchangeId || !mongoose.Types.ObjectId.isValid(exchangeId)) {
      throw new Error("Invalid exchange ID");
    }
    if (!text || typeof text !== "string") {
      throw new Error("Invalid message text");
    }
    const message = await createMessage(
      text,
      new mongoose.Types.ObjectId(exchangeId),
      userId
    );
    if (!message) {
      throw new Error("Error creating message");
    }
    socket.broadcast.to(exchangeId.toString()).emit("message", {
      exchangeId: exchangeId.toString(),
      sender: userId.toString(),
      text: message.text,
      seen: message.seen,
      createdAt: message.createdAt,
    });
  } catch (error) {
    logger.silly("Error publishing message", { error });
    return;
  }
}
