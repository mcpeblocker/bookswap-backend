import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
  exchange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exchange",
    required: true,
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["ACCEPTANCE", "RESERVATION", "REQUEST"],
    required: true,
  },
});

export default mongoose.model("Action", actionSchema);
