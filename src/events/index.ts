import mongoose from "mongoose";
import { io } from "../core/io";
import { verifyToken } from "../services/jwt.service";
import { config } from "../utils/config";
import logger from "../utils/logger";
import onMessage from "./message";
import { getChatsByUserId } from "../services/chats.service";
import { Socket } from "socket.io";

const authError = new Error("Unauthorized");

const sockets = new Map();

export const getSocket = (userId: string): Socket => sockets.get(userId);

export function initializeEvents() {
  io.on("connection", async (socket) => {
    try {
      // const token = socket.handshake.auth?.token;
      const token = socket.handshake.query?.token;
      if (!token || typeof token !== "string") {
        throw authError;
      }
      const data = verifyToken(token);
      if (!data || typeof data !== "object") {
        throw authError;
      }
      if (!data.userId || !mongoose.Types.ObjectId.isValid(data.userId)) {
        throw authError;
      }
      const userId = new mongoose.Types.ObjectId(data.userId as string);
      // const userId = new mongoose.Types.ObjectId("6636fecc60d2dcedfac82061");
      sockets.set(userId.toString(), socket);
      socket.join(userId.toString());
      const chats = await getChatsByUserId(userId);
      if (chats) {
        for (let chat of chats) {
          socket.join(chat.exchangeId.toString());
        }
      }
      socket.on("message", (message) => onMessage(socket, userId, message));
      socket.on("disconnect", () => {
        logger.silly("User disconnected");
        sockets.delete(userId.toString());
      });
    } catch (error) {
      logger.silly("Unauthorized user", { error });
      socket.disconnect();
      return;
    }
  });
  logger.silly("Events initialized");
  logger.silly(`Listening for events on port ${config.socketPort}`);
}
