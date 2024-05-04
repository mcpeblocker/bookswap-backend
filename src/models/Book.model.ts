import mongoose from "mongoose";
import { Visibility } from "../enums/Visibility.enum";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  cover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  visibility: {
    type: String,
    enum: Visibility,
    required: true,
  },
  exceptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "RESERVED", "EXCHANGED"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.index({
  title: "text",
  author: "text",
});

export default mongoose.model("Book", bookSchema);
