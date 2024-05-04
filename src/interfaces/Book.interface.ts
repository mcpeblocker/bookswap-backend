import mongoose from "mongoose";
import { Visibility } from "../enums/Visibility.enum";
import { IFile } from "./File.interface";
import { IUser } from "./User.interface";

export interface IBook {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  genre: string;
  cover: IFile | mongoose.Types.ObjectId;
  visibility: Visibility;
  exceptions: mongoose.Types.ObjectId[] | IUser[];
  owner: mongoose.Types.ObjectId | IUser;
  status: "AVAILABLE" | "RESERVED" | "EXCHANGED";
  createdAt: Date;
}
