import Card from '../models/Card.js';
import Deck from '../models/Deck.js';

// @desc    Create a new card for a deck
// @route   POST /api/cards
// @access  Private
// The asyncHandler wrapper has been removed and replaced with a standard try...catch block.
const createCard = async (req, res) => {
  try {
    const { front, back, deckId } = req.body;

    const deck = await Deck.findById(deckId);

    if (deck && deck.user.toString() === req.user._id.toString()) {
      const card = await Card.create({
        front,
        back,
        deck: deckId,
      });
      res.status(201).json(card);
    } else {
      res.status(404).json({ message: 'Deck not found or you are not authorized' });
    }
  } catch (error) {
    console.error("Error in createCard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private
// The asyncHandler wrapper has been removed and replaced with a standard try...catch block.
const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (card) {
      const deck = await Deck.findById(card.deck);

      if (!deck) {
          res.status(404).json({ message: 'Parent deck for this card not found' });
          return;
      }

      if (deck.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }

      card.front = req.body.front ?? card.front;
      card.back = req.body.back ?? card.back;
      const updatedCard = await card.save();
      res.json(updatedCard);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    console.error("Error in updateCard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
// The asyncHandler wrapper has been removed and replaced with a standard try...catch block.
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (card) {
      const deck = await Deck.findById(card.deck);

      if (!deck) {
          res.status(404).json({ message: 'Parent deck for this card not found. Cannot perform security check.' });
          return;
      }

      if (deck.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      
      await Card.findByIdAndDelete(req.params.id);

      res.json({ message: 'Card removed' });
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    console.error("Error in deleteCard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { createCard, updateCard, deleteCard };

