import mongoose from "mongoose";
import { IFile } from "../interfaces/File.interface";

const fileSchema = new mongoose.Schema<IFile>({
  filename: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IFile>("File", fileSchema);
