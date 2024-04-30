import mongoose from "mongoose";
import { IUser } from "../interfaces/User.interface";

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
  },
  preferredGenres: [
    {
      type: String,
    },
  ],
  onboarding: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model<IUser>("User", userSchema);
