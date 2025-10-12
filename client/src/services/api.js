export const api = {
  // --- Authentication ---
  register: async (userData) => {
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error:
            errorText || `Error: ${response.status} ${response.statusText}`,
        };
      }
    } catch (error) {
      console.error("Full register error:", error);
      return { success: false, error: "A network or server error occurred." };
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        return { success: true, user };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`/api/auth/logout`, {
        method: "POST",
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: "Logout failed" };
      }
    } catch (error) {
      console.error("Full logout error:", error);
      return { success: false, error: "A network or server error occurred." };
    }
  },

  loginAsGuest: async () => {
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
      });

      if (response.ok) {
        const user = await response.json();
        return { success: true, user };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error("Guest login error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

    deleteAccount: async () => {
    try {
      const response = await fetch(`/api/users/profile`, {
        method: "DELETE",
      });
      if (response.ok) {
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  // --- Deck Functions ---
  getMyDecks: async () => {
    try {
      const response = await fetch("/api/decks");
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error("Get decks error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  getDeckById: async (id) => {
    try {
      const response = await fetch(`/api/decks/${id}`);
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error("Get deck by ID error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  createDeck: async (deckData) => {
    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deckData),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || "Failed to create deck",
        };
      }
    } catch (error) {
      console.error("Create deck error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  deleteDeck: async (deckId) => {
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error("Delete deck error:", error);
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

  // --- Card Functions ---
  addCard: async (cardData) => {
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      });
      const data = await response.json();
      return response.ok
        ? { success: true, data }
        : { success: false, error: data.message };
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
      return response.ok
        ? { success: true, data }
        : { success: false, error: data.message };
    } catch (error) {
      console.error("Update card error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  deleteCard: async (cardId) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return response.ok
        ? { success: true, data }
        : { success: false, error: data.message };
    } catch (error) {
      console.error("Delete card error:", error);
      return { success: false, error: "A network error occurred." };
    }
  },

  // --- AI Functions ---
  generateSentenceStem: async (card, otherOptions) => {
    try {
      const response = await fetch("/api/gemini/generate-stem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front: card.front,
          back: card.back,
          otherOptions: otherOptions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error("Generate stem error:", error);
      return {
        success: false,
        error: "A network error occurred while generating the question.",
      };
    }
  },
};

