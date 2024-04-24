import { db } from "../core/database";
import { IFile } from "../interfaces/File.interface";

export async function createFile(data: Pick<IFile, "filename">) {
  const newFile = new db.models.File(data);
  return newFile.save();
}