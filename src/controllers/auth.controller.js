import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    const user = await User.create({ name, email: normalizedEmail, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ success: true, message: 'Student account created.', data: { user: safeUser(user), token: generateToken(user._id) } });
  } catch (error) { next(error); }
}
export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: (req.body.email || '').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    res.json({ success: true, message: 'Login successful.', data: { user: safeUser(user), token: generateToken(user._id) } });
  } catch (error) { next(error); }
}
export function me(req, res) { res.json({ success: true, data: { user: safeUser(req.user) } }); }
