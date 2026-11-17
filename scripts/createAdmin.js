import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../src/config/db.js';
import User from '../src/models/User.js';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before running this script.');
  process.exit(1);
}
try {
  await connectDatabase();
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) { existing.role = 'admin'; await existing.save(); console.log('Existing user promoted to admin.'); }
  else { await User.create({ name: ADMIN_NAME, email, password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'admin' }); console.log('Admin account created.'); }
  process.exit(0);
} catch (error) { console.error(`Could not create admin: ${error.message}`); process.exit(1); }
