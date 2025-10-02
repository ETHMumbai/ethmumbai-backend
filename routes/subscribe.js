// routes/subscribe.js
import express from 'express';
import Subscriber from '../models/subscriber.js';
import connectDB from '../lib/connectDB.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await connectDB();

    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ status: 'error', message: 'Invalid email' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({ status: 'duplicate' });
    }

    await Subscriber.create({ email });
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ status: 'error', message: 'There was an error from our side. Please try again.' });
  }
});

export default router;
