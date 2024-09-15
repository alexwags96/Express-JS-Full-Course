import { Router } from "express";
import { mockUsers } from "../utils/contants.mjs";
import { matchedData, validationResult } from "express-validator";
import { validateUser } from "../utils/validateUser.mjs";
import { resolveIndexByUserId } from "../middleware/users.mjs";
import User from "../models/userModel.mjs";

const router = Router();

router.get("/", (req, res) => {
  console.log(req.session);
  console.log("ID: ", req.sessionID);

  res.cookie("Hello", "World", { maxAge: 60000 });
  res.status(201).send({ msg: "Hello" });
});

router.get("/api/users", (req, res) => {
  const { filter, value } = req.query;
  //   console.log(req.query);
  if (!filter || !value) return res.send(mockUsers);
  const filteredUsers = mockUsers.filter((user) =>
    user[filter].includes(value)
  );
  //   console.log(filteredUsers);
  //   console.log(mockUsers);
  if (!filteredUsers) return res.send(mockUsers);
  return res.send(filteredUsers);
});

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
  if (!data) return sendStatus(404);
  let lastUser = await User.findOne().sort({ createdAt: -1 }).exec();
  console.log(lastUser);

  let lastID;
  if (!lastUser) lastID = 1;
  lastID = parseInt(lastUser.id) + 1;
  console.log(lastID);

  const newUser = new User({ id: lastID, ...data });
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

router.put("/api/users/:id", validateUser, resolveIndexByUserId, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { body, userPosition } = req;
  mockUsers[userPosition] = { id: mockUsers[userPosition].id, ...body };
  console.log("Update", mockUsers);
  return res.status(200).send(mockUsers);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userPosition } = req;
  mockUsers[userPosition] = { ...mockUsers[userPosition], ...body };
  return res.status(200).send(mockUsers);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userPosition } = req;

  mockUsers.splice(userPosition, 1);
  return res.status(200).send(mockUsers);
});

export default router;
