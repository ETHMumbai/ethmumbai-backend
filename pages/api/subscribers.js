import connectDB from '../../lib/connectDB';
import Subscriber from '../../models/subscriber';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    // Connect to DB
    await connectDB();

    const subscribers = await Subscriber.find();
    res.json({ status: 'success', data: subscribers });
  } catch (err) {
    console.error('Fetch subscribers error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
}
