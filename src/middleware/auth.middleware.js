import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'Authentication token is required.' });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User account was not found.' });
    req.user = user; next();
  } catch { return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' }); }
}
