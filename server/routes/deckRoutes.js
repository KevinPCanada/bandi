import express from 'express';
const router = express.Router();
import {
  createDeck,
  getMyDecks,
  getDeckById,
  updateDeck,
  deleteDeck
} from '../controllers/deckController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, createDeck)
  .get(protect, getMyDecks);

router.route('/:id')
  .get(protect, getDeckById)
  .put(protect, updateDeck)
  .delete(protect, deleteDeck);

export default router;