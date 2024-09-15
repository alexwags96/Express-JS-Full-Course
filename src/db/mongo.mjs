import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.zuqes.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbUrl);

mongoose.connection.on("connected", () => {
  console.log("Connecté à la base de données");
});

mongoose.connection.on("error", (err) => {
  console.log("Erreur de connexion à la base de données : " + err);
});

export default mongoose;
