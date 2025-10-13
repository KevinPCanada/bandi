// --- Imports ---
// Loads environment variables and all necessary modules and route files.
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import deckRoutes from './routes/deckRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import userRoutes from './routes/userRoutes.js';

// --- Initialization ---
// Creates the Express application and sets the server port.
const app = express();
const PORT = process.env.PORT || 8800;

// --- Database Connection ---
// Establishes the connection to the MongoDB database.
connectDB();

// --- CORS Configuration ---
// Configures Cross-Origin Resource Sharing to allow the live frontend to make requests to this backend. This is a crucial security step.
const allowedOrigins = [
    'https://www.bandismartcards.com',
    'https://bandismartcards.com',
    'http://localhost:5173'
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
};
app.use(cors(corsOptions));

// The CORS middleware is the VERY FIRST middleware to be used.
app.use(cors(corsOptions));


// --- Middleware Configuration ---
// Configures the server to use necessary middleware for handling requests including parsing JSON, URL-encoded data, and cookies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Route Definitions ---
// Binds the imported route handlers to specific URL paths.
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/users', userRoutes);

// --- Server Startup ---
// A simple test route to confirm the server is running.
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Starts the server and listens for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

