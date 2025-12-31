import express from 'express';
const router = express.Router();
import { generateStem } from '../controllers/geminiController.js';
import { protect } from '../middleware/authMiddleware.js';

// apply the protect middleware to the route
router.post('/generate-stem', protect, generateStem);

export default router;