import passport from "passport";
import { Strategy } from "passport-local";
// import { mockUsers } from "../utils/constants.mjs";
import User from "../models/userModel.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  console.log("Serialize");

  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log("Strategy");

    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (!findUser.validPassword(password)) throw new Error("Bad Credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
