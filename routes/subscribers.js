// routes/subscribers.js
import express from 'express';
import connectDB from '../lib/connectDB.js';
import Subscriber from '../models/subscriber.js';

const router = express.Router();

// GET all subscribers
router.get('/', async (req, res) => {
  try {
    await connectDB();

    const subscribers = await Subscriber.find();
    res.json({ status: 'success', data: subscribers });
  } catch (err) {
    console.error('Fetch subscribers error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

export default router;
