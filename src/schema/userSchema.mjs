import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: Number,
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: String,
  // createdAt: { type: Date, default: Date.now },
});

export default userSchema;
