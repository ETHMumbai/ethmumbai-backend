import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const Subscriber =
  mongoose.models.Subscriber ||
  mongoose.model("Subscriber", subscriberSchema);

app.post("/api/subscribe", async (req, res) => {
  try {
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
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
