// --- Imports ---
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from '../server/db.js';
import authRoutes from '../server/routes/auth.js';
import deckRoutes from '../server/routes/deckRoutes.js';
import cardRoutes from '../server/routes/cardRoutes.js';
import geminiRoutes from '../server/routes/geminiRoutes.js';
import userRoutes from '../server/routes/userRoutes.js';

// --- Initialization ---
const app = express();
// Vercel handles the port automatically, but keep this for local testing.
const PORT = process.env.PORT || 8800;

// --- Database Connection ---
connectDB();

// --- CORS Configuration ---
const allowedOrigins = [
    'https://www.bandismartcards.com',
    'https://bandismartcards.com',
    'http://localhost:5173',
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// --- Middleware Configuration ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Route Definitions ---
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/users', userRoutes);

// --- Server Startup ---
app.get('/', (req, res) => {
  res.send('API is running on Vercel...');
});

// IMPORTANT FOR VERCEL: 
// only call app.listen() if we are NOT in a production (Vercel) environment.
// Vercel expects the app to be exported to handle the serverless execution.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
}

// Export the Express app for Vercel's Serverless Functions
export default app;