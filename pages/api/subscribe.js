import connectDB from '../../lib/connectDB';
import Subscriber from '../../models/subscriber';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    // Connect to DB
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
}
