import mongoose from "mongoose";

export interface IFile {
  _id: mongoose.Types.ObjectId;
  filename: string;
}
