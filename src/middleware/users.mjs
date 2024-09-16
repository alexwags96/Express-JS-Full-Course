import User from "../models/userModel.mjs";
import { mockUsers } from "../utils/contants.mjs";

const resolveIndexByUserId = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  if (isNaN(id)) return res.sendStatus(404);
  const userToUpdate = await User.findOne({ id });

  if (!userToUpdate) return res.sendStatus(404);
  req.userToUpdate = userToUpdate;
  next();
};

export { resolveIndexByUserId };
