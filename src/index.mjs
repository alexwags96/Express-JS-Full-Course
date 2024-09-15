import express, { urlencoded } from "express";
import { matchedData, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import { validateUser } from "./utils/validateUser.mjs";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "./db/mongo.mjs";

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "maCleSecrete",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000, // en millisecondes
    },
  })
);

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
