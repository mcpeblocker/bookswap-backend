import mongoose from "mongoose";
import { db } from "../core/database";
import logger from "../utils/logger";

export async function createMessage(
  text: string,
  exchange: mongoose.Types.ObjectId,
  sender: mongoose.Types.ObjectId
) {
  try {
    const message = new db.models.Message({
      exchange,
      text,
      sender,
    });
    await message.save();
    return message;
  } catch (error) {
    logger.error("Error creating message", { error });
    return null;
  }
}
