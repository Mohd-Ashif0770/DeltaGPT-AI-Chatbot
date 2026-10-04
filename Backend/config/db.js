import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_Connection);
    console.log("Database successfully connected!");
  } catch (err) {
    console.log(`Failed to connect with Database ${err}`);
    process.exit(1); // Exit the process with an error code
  }
}
  export default connectDB;