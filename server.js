// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/connectDB.js'; // 👈 import it
import subscribeRoute from './routes/subscribe.js';
import subscriberRoute from './routes/subscribers.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB once before routes
await connectDB();

// Routes
app.use('/api/subscribe', subscribeRoute);
app.use('/api/subscribers', subscriberRoute);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Vercel' });
});

export default app;
