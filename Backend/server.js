import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"
const PORT = 8080;
import authRoute from "./routes/user.routes.js"  


const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_Connection);
    console.log("Database successfully connected!");
  } catch (err) {
    console.log(`Failed to connect with Database ${err}`);
  }
};
