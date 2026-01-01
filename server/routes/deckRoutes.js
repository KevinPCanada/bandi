import express from 'express';
const router = express.Router();
import {
  createDeck,
  getMyDecks,
  getDeckById,
  updateDeck,
  deleteDeck,
  syncDeckCards
} from '../controllers/deckController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, createDeck)
  .get(protect, getMyDecks);

//The bulk sync route for saving all changes at once. This maps to POST /api/decks/:id/sync
router.route('/:id/sync').post(protect, syncDeckCards);

router.route('/:id')
  .get(protect, getDeckById)
  .put(protect, updateDeck)
  .delete(protect, deleteDeck);

export default router;