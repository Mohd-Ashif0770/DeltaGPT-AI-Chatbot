import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import authRoute from "./routes/user.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);
app.use("/api/auth", authRoute);

//connect to database
await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

