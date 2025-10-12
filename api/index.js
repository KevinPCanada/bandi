// --- Imports ---
// Loads environment variables and imports all necessary modules and route files.
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
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

// --- Middleware Configuration ---
// Configures the server to use necessary middleware for handling requests.
// This includes parsing JSON, URL-encoded data, and cookies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Route Definitions ---
// Binds the imported route handlers to their specific base URL paths.
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/users', userRoutes);

// --- Server Startup ---
// Includes a root GET route for simple server status checks and starts the server.
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

