import Deck from '../models/Deck.js';
import Card from '../models/Card.js'; // <-- 1. IMPORT THE CARD MODEL

// @desc    Create a new deck
// @route   POST /api/decks
// @access  Private
const createDeck = async (req, res) => {
  const { name } = req.body;
  try {
    const deck = new Deck({ name, user: req.user._id });
    const createdDeck = await deck.save();
    res.status(201).json(createdDeck);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all decks for a logged-in user
// @route   GET /api/decks
// @access  Private
const getMyDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user._id });
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single deck by ID with its cards
// @route   GET /api/decks/:id
// @access  Private
const getDeckById = async (req, res) => {
  try {
    // 1. Find the deck by its ID
    const deck = await Deck.findById(req.params.id);

    if (deck) {

      // 2. Find all cards that belong to this deck
      const cards = await Card.find({ deck: req.params.id });

      // 3. Return the deck and its cards
      res.status(200).json({ deck, cards });
    } else {
      res.status(404).json({ message: 'Deck not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a deck and all its cards
// @route   DELETE /api/decks/:id
// @access  Private
const deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    // SECURITY CHECK: Make sure the deck belongs to the logged-in user.
    if (deck.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 1. CASCADING DELETE: Delete all cards associated with this deck.
    await Card.deleteMany({ deck: req.params.id });

    // 2. Delete the deck itself.
    await deck.deleteOne();

    res.json({ message: 'Deck and all associated cards removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateDeck = async (req, res) => {
    try {
        const deck = await Deck.findOne({ _id: req.params.id, user: req.user._id });

        if (deck) {
            deck.name = req.body.name || deck.name;
            const updatedDeck = await deck.save();
            res.json(updatedDeck);
        } else {
            res.status(404).json({ message: 'Deck not found' });
        }
    } catch (error) {
        console.error("Error in updateDeck:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export { createDeck, getMyDecks, getDeckById, deleteDeck, updateDeck };