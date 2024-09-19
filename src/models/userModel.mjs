import mongoose from "../db/mongo.mjs";
import userSchema from "../schema/userSchema.mjs";

const User = mongoose.model("User", userSchema);

export default User;
