import express, { urlencoded } from "express";
import { matchedData, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import { validateUser } from "./utils/validateUser.mjs";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(usersRouter);
app.use(productsRouter);

// const loggingMiddleware = (req, res, next) => {
//   console.log(`${req.method} - ${req.url}`);
//   next();
// };
// app.use(loggingMiddleware);

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
