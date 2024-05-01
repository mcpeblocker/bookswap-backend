import mongoose from "mongoose";
import { Visibility } from "../enums/Visibility.enum";

export interface UploadBookDto {
  title: string;
  author: string;
  genre: string;
  visibility: Visibility;
  exceptions: mongoose.Types.ObjectId[];
}

export interface EditBookDto {
  title?: string;
  author?: string;
  genre?: string;
  visibility?: Visibility;
  exceptions?: mongoose.Types.ObjectId[];
}
