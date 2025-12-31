// ----------------------------------------------------------------
// This is the main logic for our authentication routes.
// ----------------------------------------------------------------

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Deck from '../models/Deck.js';
import Card from '../models/Card.js';
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Node.js crypto module for random names

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

// --- Demo Deck Content ---
// This constant holds the data for the pre-made deck that every guest user will receive.
const demoDeckData = {
  name: "Demo Deck (Korean Basics)",
  cards: [
    { front: "Hello / Hi", back: "안녕하세요" },
    { front: "Thank you", back: "감사합니다" },
    { front: "Yes", back: "네" },
    { front: "No", back: "아니요" },
    { front: "Please give me...", back: "주세요" },
    { front: "Water", back: "물" },
    { front: "Food", back: "음식" },
    { front: "Goodbye (to someone leaving)", back: "안녕히 가세요" },
  ],
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      // FIX: Ensure arguments are passed in the correct order: (res, userId).
      // This was the source of the "res.cookie is not a function" error.
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        isGuest: user.isGuest,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add the login and logout functions here in the next steps

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      // FIX: Ensure arguments are passed in the correct order: (res, userId).
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        isGuest: user.isGuest,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  // Simply clear the cookie by setting it to an empty string
  // and giving it an expiration date that has already passed.
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiration to a past date
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// new controller function for creating a guest user

export const createGuestUser = async (req, res) => {
  try {
    // Generate a unique, random username for the guest.
    const guestUsername = `Guest_${crypto.randomBytes(4).toString("hex")}`;

    // Create a fake, but guaranteed unique, email address for the guest.
    const guestEmail = `${guestUsername}@guest.com`;

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Set to expire in 24 hours

    // Create the new user in the database with the isGuest flag set to true.
    const user = await User.create({
      username: guestUsername,
      email: guestEmail,
      isGuest: true,
      expiresAt: expirationDate,
      // No email or password is provided
    });

    if (user) {
      // --- Seed the demo deck after the user is created ---
      try {
        // Create the demo deck, linking it to the new user.
        const demoDeck = await Deck.create({
          name: demoDeckData.name,
          user: user._id, // Link the deck to the new guest user
        });

        // Prepare the demo cards, linking each one to the new deck.
        const cardsToCreate = demoDeckData.cards.map((card) => ({
          ...card,
          deck: demoDeck._id, // Link each card to the new deck
        }));

        // Save all the cards to the database in a single, efficient operation.
        if (cardsToCreate.length > 0) {
          await Card.insertMany(cardsToCreate);
        }
      } catch (seedError) {
        // If seeding fails, we still want to log the user in, but we should log the error.
        console.error("Failed to seed demo deck for guest user:", seedError);
      }
      // --- End of seeding logic ---

      // If creation is successful, generate a JWT and send it back in a cookie.
      generateToken(res, user._id);

      // Send back the user data (without the password).
      res.status(201).json({
        _id: user._id,
        username: user.username,
        isGuest: user.isGuest,
      });
    } else {
      res.status(400).json({ message: "Failed to create guest user" });
    }
  } catch (error) {
    console.error("Error creating guest user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
