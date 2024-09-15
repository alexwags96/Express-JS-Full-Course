import { Router } from "express";
import { mockUsers } from "../utils/contants.mjs";
import { matchedData, validationResult } from "express-validator";
import { validateUser } from "../utils/validateUser.mjs";
import { resolveIndexByUserId } from "../middleware/users.mjs";

const router = Router();

router.get("/", (req, res) => {
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

router.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const user = mockUsers.find((user) => user.id == id);
  if (!user) return res.sendStatus(404);
  return res.send(user);
});

router.post("/api/users", validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const data = matchedData(req);
  if (!data) return sendStatus(404);
  const newUser = { id: mockUsers.at(-1).id + 1, ...data };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
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
