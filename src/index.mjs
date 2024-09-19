import express, { urlencoded } from "express";
import { matchedData, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import { validateUser } from "./utils/validateUser.mjs";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import bodyParser from "express";
import passport from "passport";
import User from "./models/userModel.mjs";
import session from "express-session";
// import "./utils/Strategy.mjs";
import { Strategy } from "passport-local";
import { comparePassword } from "./utils/helpers.mjs";

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "maCleSecrete",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60, // en millisecondes
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

passport.use(
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

// passport.serializeUser((user, done) => {
//   console.log("Serialize");

//   done(null, user.id);
// });

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  // Vérifiez si l'utilisateur existe déjà
  const user = await User.findOne({ username });

  if (user) {
    return res.status(400).send({ message: "Utilisateur déjà existant" });
  }

  // Hasher le mot de passe
  // const hashedPassword = bcrypt.hashSync(password, 10);

  // Créez un nouveau utilisateur
  const newUser = new User({ username, password });

  // Enregistrez l'utilisateur
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

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.get("/profile", (req, res) => {
  if (req.user) {
    res.send(`Bonjour, ${req.user.username} !`);
  } else {
    res.send("Vous devez vous connecter pour accéder à cette page.");
  }
});

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
