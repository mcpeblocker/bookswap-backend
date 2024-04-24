import mongoose from "mongoose";
import logger from "../utils/logger";
import models from "../models";
import { config } from "../utils/config";

export const db = {
  models,
};

export async function connectDatabase() {
  try {
    await mongoose.connect(config.databaseUri);
    logger.info("Connected to MongoDB Database!");
  } catch (error: any) {
    logger.error(
      `Error connecting to MongoDB: ${
        error?.message || "Unidentifiable reason"
      }`,
      { error }
    );
    process.exit(1);
  }
}
