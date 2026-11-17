import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
const port = process.env.PORT || 3000;
connectDatabase().then(() => app.listen(port, () => console.log(`CampusCare is running at http://localhost:${port}`))).catch((error) => { console.error(`Database connection failed: ${error.message}`); process.exit(1); });
