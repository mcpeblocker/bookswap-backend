import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["REQUESTED", "APPROVED", "ARCHIVED"],
    required: true,
  },
});

export default mongoose.model("Exchange", exchangeSchema);
