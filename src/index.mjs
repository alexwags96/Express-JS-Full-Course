import express, { urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;
const mockUsers = [
  { id: 1, userName: "Anson", displayName: "Anson" },
  { id: 2, userName: "John", displayName: "John" },
  { id: 3, userName: "Ellie", displayName: "Ellie" },
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello" });
});

app.get("/api/users", (req, res) => {
  const { filter, value } = req.query;
  console.log(req.query);
  if (!filter || !value) return res.send(mockUsers);
  const filteredUsers = mockUsers.filter((user) =>
    user[filter].includes(value)
  );
  console.log(filteredUsers);
  console.log(mockUsers);
  if (!filteredUsers) return res.send(mockUsers);
  return res.send(filteredUsers);
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const user = mockUsers.find((user) => user.id == id);
  if (!user) return res.sendStatus(404);
  return res.send(user);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  if (!body) return sendStatus(404);
  const newUser = { id: mockUsers.at(-1).id + 1, ...body };
  mockUsers.push(newUser);
  // console.log('Hee ',newUser);
  res.status(201).send(newUser);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 123, Name: "Chicken George", price: 1.99 }]);
});

app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const userPosition = mockUsers.findIndex((user) => user.id == id);
  if (userPosition == -1) return res.sendStatus(404);
  mockUsers[userPosition] = body;
  console.log("Update", mockUsers);
  res.status(200).send(mockUsers);
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
