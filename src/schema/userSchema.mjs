import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: Number,
  userName: String,
  displayName: String,
  createdAt: { type: Date, default: Date.now },
});

export default userSchema;
