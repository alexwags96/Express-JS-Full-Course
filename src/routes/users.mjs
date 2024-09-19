import { Router } from "express";
import { mockUsers } from "../utils/contants.mjs";
import { matchedData, validationResult } from "express-validator";
import { validateUser } from "../utils/validateUser.mjs";
import { resolveIndexByUserId } from "../middleware/users.mjs";
import User from "../models/userModel.mjs";

const router = Router();

router.get("/", (req, res) => {
  // console.log(req.session);
  // console.log("ID: ", req.sessionID);

  // res.cookie("Hello", "World", { maxAge: 60000 });
  res.status(201).send({ msg: "Hello" });
});

router.get("/api/users", async (req, res) => {
  const { filter, value } = req.query;
  if (!filter || !value) {
    const users = await User.find({});
    return res.send(users);
  }
  const usersFiltered = await User.find({
    $or: [{ [filter]: { $regex: value, $options: "i" } }],
  });
  return res.send(usersFiltered);
});
// const filteredUsers = mockUsers.filter((user) =>
//   user[filter].includes(value)
// );
//   console.log(filteredUsers);
//   console.log(mockUsers);

router.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ id }).exec();
  if (!user) return res.sendStatus(404);
  return res.send(user);
});

router.post("/api/users", validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const data = matchedData(req);
  // console.log(data);

  if (!data) return sendStatus(404);
  let findUser = await User.findOne({ username: data.username });

  if (findUser) return res.send("Utilisateur existant");

  const newUser = new User(data);
  try {
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
});

router.put(
  "/api/users/:id",
  validateUser,
  resolveIndexByUserId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { body, userToUpdate } = req;
    console.log({ body, userToUpdate });

    try {
      const user = await User.findOneAndUpdate(
        { id: userToUpdate.id },
        { $set: body }
      );
      // console.log("Update", user);
      return res.status(200).send(user);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Erreur de mise à jour de l'utilisateur" });
    }
  }
);

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userPosition } = req;
  mockUsers[userPosition] = { ...mockUsers[userPosition], ...body };
  return res.status(200).send(mockUsers);
});

router.delete("/api/users/:id", resolveIndexByUserId, async (req, res) => {
  const { userToUpdate } = req;
  const deletedUser = await User.findOneAndDelete({ id: userToUpdate.id });
  if (!deletedUser) {
    return res.status(404)({
      message: `Utilisateur avec l'ID ${req.params.id} non trouvé`,
    });
  }
  return res
    .status(200)
    .send({ message: `Utilisateur supprimé avec succès`, deletedUser });
});

export default router;
