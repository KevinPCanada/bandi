// An object that centralizes all API communication functions for the application. All fetch calls use relative URLs (e.g., `/api/...`). This allows the Cloudflare proxy (defined in `public/_redirects`) to intercept these requests in production and forward them to the correct backend server.

export const api = {
  // --- Authentication Functions ---
  register: async (userData) => {
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        return { success: true, data: await response.json() };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        return { success: true, user: await response.json() };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  logout: async () => {
    try {
      await fetch(`/api/auth/logout`, { method: "POST" });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  loginAsGuest: async () => {
    try {
      const response = await fetch(`/api/auth/guest`, { method: 'POST' });
      if (response.ok) {
        return { success: true, user: await response.json() };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Guest login error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  deleteAccount: async () => {
    try {
      const response = await fetch(`/api/users/profile`, { method: "DELETE" });
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  // --- Deck Functions ---
  getMyDecks: async () => {
    try {
      const response = await fetch(`/api/decks`);
      if (response.ok) {
        return { success: true, data: await response.json() };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Get decks error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  getDeckById: async (id) => {
    try {
      const response = await fetch(`/api/decks/${id}`);
      if (response.ok) {
        return { success: true, data: await response.json() };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Get deck by ID error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  createDeck: async (deckData) => {
    try {
      const response = await fetch(`/api/decks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deckData),
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
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deckData),
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
      const response = await fetch(`/api/decks/${deckId}`, { method: "DELETE" });
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Delete deck error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  // --- Card Functions ---
  addCard: async (cardData) => {
    try {
      const response = await fetch(`/api/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
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
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
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
      const response = await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
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
      const response = await fetch(`/api/gemini/generate-stem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          front: card.front,
          back: card.back,
          otherOptions: otherOptions,
        }),
      });
      if (response.ok) {
        return { success: true, data: await response.json() };
      }
      return { success: false, error: await response.text() };
    } catch (error) {
      console.error("Generate stem error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },
};

