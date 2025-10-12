import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import MainLayout from "./components/MainLayout"; // Import the main layout

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditDeckPage from "./pages/EditDeck/EditDeck";
import ReviewPage from "./pages/ReviewPage/ReviewPage";
import { CookieBanner } from "./components/CookieBanner"; 
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy"; 



import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Cookie Banner placed here so it can be shown on any page */}
        <CookieBanner />
        <Routes>
          {/* Group all routes that SHOULD have the header under the MainLayout element */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/decks/:id/edit"
              element={
                <ProtectedRoute>
                  <EditDeckPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/decks/:id/review"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* all routes that should NOT have the header as standalone routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
        <Toaster richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
