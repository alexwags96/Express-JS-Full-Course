import { mockUsers } from "../utils/contants.mjs";

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const userPosition = mockUsers.findIndex((user) => user.id == id);
  if (userPosition == -1) return res.sendStatus(404);
  req.userPosition = userPosition;
  next();
};

export { resolveIndexByUserId };
