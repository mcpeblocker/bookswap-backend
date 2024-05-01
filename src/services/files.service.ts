import { db } from "../core/database";
import { IFile } from "../interfaces/File.interface";
import logger from "../utils/logger";

export async function createFile(data: Pick<IFile, "filename">) {
  try {
    const newFile = new db.models.File(data);
    return await newFile.save();
  } catch (error) {
    logger.silly("Error creating file", { error });
    return null;
  }
}
