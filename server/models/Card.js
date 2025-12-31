import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      trim: true,
    },
    back: {
      type: String,
      trim: true,
    },
    // The only reference a card needs. Links the card back to its parent deck.
    deck: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Deck",
    },
    // The incorrect 'user' field has been removed from this schema.
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;