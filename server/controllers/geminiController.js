import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import User from "../models/User.js";

// Initializes the Google AI client with the API key.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Defines the daily limit for AI calls per user.
const DAILY_API_LIMIT = 100;

// Main controller function to generate a sentence stem for a flashcard.
export const generateStem = async (req, res) => {
  try {
    // --- Rate Limiting Logic ---
    // Fetches the current user from the database, selecting only necessary fields.
    const user = await User.findById(req.user._id).select('apiCallCount apiCallResetDate');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const now = new Date();
    let resetDate = user.apiCallResetDate;
    let callCount = user.apiCallCount;
    // Added a flag to track if the reset period has expired.
    let needsReset = false;

    // Checks if the user's call count should be reset for a new day.
    if (!resetDate || resetDate < now) {
      callCount = 0;
      resetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      // Mark that we need to perform a reset in the database.
      needsReset = true;
    }

    // Blocks the request if the user has exceeded the daily limit.
    if (callCount >= DAILY_API_LIMIT) {
      return res.status(429).json({ message: "You have reached your daily limit for AI questions. Please try again tomorrow." });
    }

    // --- AI Prompt and Call Logic ---
    // Extracts card data from the request body.
    const { front, back, otherOptions } = req.body;
    if (!front || !back) {
      return res.status(400).json({ message: "Card 'front' and 'back' are required." });
    }
    const distractorOptions = Array.isArray(otherOptions) ? otherOptions : [];
    
    // Selects the specific Gemini model to use.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    // Constructs the detailed prompt for the AI model.
    const prompt = `
      You are an expert Korean language tutor creating a quiz for a student.
      The student needs to learn the word '${back}', which means '${front}'.
      Crucially, the other multiple-choice options the student will see are: [${distractorOptions.join(", ")}].
      Your task is to create a single, simple Korean sentence with a blank space (___) for the word '${back}'.
      This sentence MUST contain enough specific context to make '${back}' the ONLY logical answer among the choices. The sentence must NOT work for the other options provided.
      The sentence should be natural and easy for a beginner to understand.
      Do not provide the answer, any translations, or any other extra text. Your entire response must be ONLY the single Korean sentence with the blank.
      Example:
      - Target Word: 치킨 (chicken)
      - Other Options: 밥 (rice), 책 (book)
      - Good, specific sentence: 오늘 저녁으로 ___을/를 시켰어요. (I ordered ___ for dinner today.)
      - Bad, generic sentence: 나는 ___을/를 먹어요. (I eat ___.)
    `;

    // Sends the prompt to the Gemini API and gets the response.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // --- NEW: UPDATED DATABASE UPDATE LOGIC ---
    // We check if a reset was triggered.
    // If YES: We use $set to force the apiCallCount back to 1.
    // If NO: We use $inc to add 1 to the existing count as normal.
    const updateQuery = needsReset 
      ? { $set: { apiCallCount: 1, apiCallResetDate: resetDate } }
      : { $inc: { apiCallCount: 1 }, $set: { apiCallResetDate: resetDate } };

    // After a successful API call, updates the user's call count in the database.
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateQuery,
      { new: true } // This option returns the updated user document.
    );

    // Sends the generated sentence and the new call count back to the frontend.
    res.status(200).json({
      sentenceStem: text.trim(),
      apiCallCount: updatedUser.apiCallCount,
    });

  } catch (error) {
    // Catches any errors during the process and sends a server error response.
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ message: "Failed to generate sentence stem from AI." });
  }
};