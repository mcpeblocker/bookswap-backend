import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
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
});

export default mongoose.model("Book", bookSchema);
