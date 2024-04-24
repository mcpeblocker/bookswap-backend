import mongoose from "mongoose";
import { IUser } from "../interfaces/User.interface";

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  preferredGenres: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<IUser>("User", userSchema);
