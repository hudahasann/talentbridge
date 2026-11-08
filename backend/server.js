import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1);

// --- PAYLOAD LIMIT FIX (ALLOWS BASE64 IMAGES) ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { httpOnly: true, secure: true, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24 }
}));

// Static uploads folder
app.use('/uploads', express.static('uploads'));

// --- CRITICAL VERCEL FIX: Check headers for user ID (ONCE, BEFORE ALL ROUTES) ---
app.use((req, res, next) => {
  if (req.headers['x-user-id'] && !req.session.userId) {
    req.session.userId = req.headers['x-user-id'];
  }
  next();
});

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));