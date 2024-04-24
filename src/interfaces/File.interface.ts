import mongoose from "mongoose";
import { IUser } from "./User.interface";

export interface IFile {
  _id: mongoose.Types.ObjectId;
  filename: string;
}
