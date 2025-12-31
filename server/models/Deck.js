import mongoose from 'mongoose';
import Card from './Card.js'; 

// blueprint for Deck documents.
const deckSchema = new mongoose.Schema(
  {
    // The name of the deck, e.g., "Korean Vocabulary"
    name: {
      type: String,
      required: [true, 'Please provide a name for the deck.'],
      trim: true, // Removes any extra whitespace from the beginning or end
    },

    // is the crucial link to the User model. It stores the unique ID of the user who owns this deck.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // 'ref' tells Mongoose that this ID points to a document in the 'User' collection. This is essential for populating data later.
      ref: 'User',
    },
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` fields to our documents, which is very useful for tracking.
    timestamps: true,
  }
);

// --- CASCADING DELETE MIDDLEWARE ---
// This hook will run automatically right before a deck document is deleted.
deckSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log(`Cards being removed for deck: ${this._id}`);
    try {
        // Delete all cards where the `deck` field matches this deck's ID.
        await Card.deleteMany({ deck: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

// We compile the schema into a model, which gives us an interface to interact with the 'decks' collection in our MongoDB database.
const Deck = mongoose.model('Deck', deckSchema);

export default Deck;