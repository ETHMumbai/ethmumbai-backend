import mongoose from "mongoose";

let isConnected = false; // global mongoose connection state

// Connect to MongoDB
async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

// Schema + Model
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Subscriber =
  mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);

// API handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ status: "error", message: "Invalid email" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({ status: "duplicate" });
    }

    await Subscriber.create({ email });
    res.json({ status: "success" });
  } catch (err) {
    console.error("❌ Subscribe error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
}
