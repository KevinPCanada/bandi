// --- Imports ---
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

// Creates the context object that will be used to share auth data.
const AuthContext = createContext();

// Defines the daily AI call limit. This is a frontend copy for UI purposes.
const DAILY_API_LIMIT = 100;

// --- Custom Hook: useAuth ---
// A custom hook that simplifies accessing the AuthContext from any component.
// Throws an error if used outside of an AuthProvider.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// --- AuthProvider Component ---
// The main component that wraps the application and provides all auth-related state and functions.
export const AuthProvider = ({ children }) => {
  // State for storing the current user object and the initial loading status.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checks for a persisted user session in localStorage when the app first loads.
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Handles the user login process.
  // Calls the API, then updates state and localStorage on success.
  const login = async (username, password) => {
    const result = await api.login({ username, password });
    if (result.success) {
      setUser(result.user);
      localStorage.setItem("userData", JSON.stringify(result.user));
    }
    return result;
  };

  // Handles the user registration process.
  // Calls the register API, then automatically logs the new user in.
  const register = async (userData) => {
    const result = await api.register(userData);
    if (result.success) {
      const loginResult = await api.login({
        username: userData.username,
        password: userData.password,
      });
      if (loginResult.success) {
        setUser(loginResult.user);
        localStorage.setItem("userData", JSON.stringify(loginResult.user));
      }
      return loginResult;
    }
    return result;
  };

  // Handles the user logout process.
  // Calls the logout API and clears user data from state and localStorage.
  const logout = async () => {
    await api.logout();
    localStorage.removeItem("userData");
    setUser(null);
  };

  // Handles the guest login process.
  // Calls the guest API endpoint and sets the temporary user state.
  const loginAsGuest = async () => {
    const result = await api.loginAsGuest();
    if (result.success) {
      setUser(result.user);
      localStorage.setItem("userData", JSON.stringify(result.user));
    }
    return result;
  };

  // Provides a way for other components to update the user's state.
  // Used to synchronize the API call count from the backend.
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  // Handles deleting the user's account.
  // Calls the delete API and clears all local user data on success.
  const deleteAccount = async () => {
    const result = await api.deleteAccount();
    if (result.success) {
      setUser(null);
      localStorage.removeItem('userData');
    }
    return result;
  };

  // A derived state variable that checks if the user has reached the API call limit.
  const isRateLimited = user && user.apiCallCount >= DAILY_API_LIMIT;

  // The value object holds all the state and functions to be shared via the context provider.
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginAsGuest,
    isRateLimited,
    DAILY_API_LIMIT,
    updateUser,
    deleteAccount,
  };

  // Renders the context provider, making the `value` object available to all child components.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

