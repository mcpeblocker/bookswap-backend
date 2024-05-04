import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
  offeredBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exchangedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  status: {
    type: String,
    enum: ["REQUESTED", "APPROVED", "COMPLETED", "ARCHIVED"],
    required: true,
  },
  approvedAt: {
    type: Date,
  },
  exchangedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Exchange", exchangeSchema);
