// --- API Configuration ---
// Defines the base URL for the deployed backend, pulled from Vite's environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// An object that centralizes all API communication functions for the application.
export const api = {
  // --- Authentication Functions ---
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        // Tells the browser to send credentials (cookies) with this request.
        credentials: 'include',
      });
      if (response.ok) return { success: true, data: await response.json() };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      if (response.ok) return { success: true, user: await response.json() };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, { 
        method: "POST",
        credentials: 'include',
      });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  loginAsGuest: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/guest`, { 
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) return { success: true, user: await response.json() };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Guest login error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  deleteAccount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, { 
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) return { success: true };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  // --- Deck Functions ---
  getMyDecks: async () => {
    try {
      // This is the function that was failing. Adding `credentials: 'include'` will fix it.
      const response = await fetch(`${API_BASE_URL}/api/decks`, { credentials: 'include' });
      if (response.ok) return { success: true, data: await response.json() };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Get decks error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  getDeckById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decks/${id}`, { credentials: 'include' });
      if (response.ok) return { success: true, data: await response.json() };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Get deck by ID error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  createDeck: async (deckData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deckData),
        credentials: 'include',
      });
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      console.error("Create deck error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  updateDeck: async (deckId, deckData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deckData),
        credentials: 'include',
      });
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      console.error("Update deck error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  deleteDeck: async (deckId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decks/${deckId}`, { 
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) return { success: true };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Delete deck error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  // --- Card Functions ---
  addCard: async (cardData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
        credentials: 'include',
      });
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      console.error("Add card error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  updateCard: async (cardId, cardData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
        credentials: 'include',
      });
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      console.error("Update card error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  deleteCard: async (cardId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}`, { 
        method: "DELETE",
        credentials: 'include',
      });
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      console.error("Delete card error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  // --- AI Functions ---
  generateSentenceStem: async (card, otherOptions) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gemini/generate-stem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          front: card.front,
          back: card.back,
          otherOptions: otherOptions,
        }),
        credentials: 'include',
      });
      if (response.ok) return { success: true, data: await response.json() };
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Generate stem error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },
};

