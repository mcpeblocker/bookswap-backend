import mongoose from "mongoose";
import { IFile } from "./File.interface";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  nickname: string;
  avatar: mongoose.Types.ObjectId | IFile;
  preferredGenres: string[];
  onboarding: boolean;
}
