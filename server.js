import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Global connection state
let isConnected = false;

// Connect to MongoDB once at the beginning
async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);  // Exit the process if connection fails
  }
}

// Schema + Model for Subscriber
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);

// Connect to the database before handling any requests
connectDB().then(() => {
  // API Route to Subscribe
  app.post('/subscribe', async (req, res) => {
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
      console.error("Subscribe error:", err);
      res.status(500).json({ status: "error", message: "There was an error from our side. Please try again." });
    }
  });

  // API Route to Get All Subscribers
  app.get('/subscribers', async (req, res) => {
    try {
      const subscribers = await Subscriber.find();
      res.json({ status: 'success', data: subscribers });
    } catch (err) {
      console.error("Fetch subscribers error:", err);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  });

  // Start the server only after DB connection is established
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
