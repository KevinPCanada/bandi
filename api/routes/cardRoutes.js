import express from 'express';
const router = express.Router();
import {
  createCard,
  updateCard,
  deleteCard,
} from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route for creating a new card.
router.route('/').post(protect, createCard);

// Routes for updating and deleting a specific card by its ID.
router.route('/:id').put(protect, updateCard).delete(protect, deleteCard);

export default router;
