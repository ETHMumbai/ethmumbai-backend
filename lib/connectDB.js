// lib/connectDB.js
import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
