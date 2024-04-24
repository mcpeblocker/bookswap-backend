import mongoose from "mongoose";
import { IFile } from "./File.interface";

export interface IUser {
  email: string;
  nickname: string;
  avatar: mongoose.Types.ObjectId | IFile;
  preferredGenres: string[];
}
