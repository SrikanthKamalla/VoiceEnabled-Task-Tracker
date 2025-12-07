import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
        dbName:"TasksApp"
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
