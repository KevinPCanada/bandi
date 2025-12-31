import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Deck from './Deck.js'; 


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // email field is always required and unique, because even guests will have a unique (but fake) email address.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      // password is still not required for guests.
      required: function () {
        return !this.isGuest;
      },
      select: false,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    // will hold the date when a guest account should be automatically deleted.
    expiresAt: {
      type: Date,
      default: undefined, // Defaults to nothing for permanent users.
    },
    apiCallCount: {
      type: Number,
      default: 0,
    },
    // field to store the date when the count should reset.
    apiCallResetDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// This tells MongoDB to look at the `expiresAt` field and automatically delete any document where that date has passed. The `expireAfterSeconds: 0` means the document is deleted immediately upon expiration.
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// --- CASCADING DELETE MIDDLEWARE ---
// This `pre` hook will run automatically right before a user document is deleted.
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  console.log(`Decks being removed for user: ${this._id}`);
  try {
    // Find all decks where the `user` field matches this user's ID.
    const decks = await Deck.find({ user: this._id });
    
    // For each deck found, trigger its deletion. This will in turn trigger the cascading delete middleware on the Deck model.
    for (const deck of decks) {
      await deck.deleteOne();
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;