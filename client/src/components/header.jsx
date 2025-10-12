import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export function Header({ className }) {
  // Gets user state from AuthContext and navigation functionality.
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Logs the user out and redirects to the login page.
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    // Header container with background and border styles.
    <header className={cn(" bg-foreground px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        
        {/* Clickable logo that links to the homepage. */}
        <Link to="/" className="flex items-center gap-3">
          <span className="text-xl font-semibold text-background">반디</span>
          <span className="text-xl font-semibold text-background">Bandi</span>
        </Link>

        {/* Renders content based on the user's login status. */}
        <div className="flex items-center gap-4">
          {user ? (
            // Shows a welcome message and logout button if the user is logged in.
            <>
              <span className="hidden sm:inline text-sm font-medium text-background">
                Welcome, {user.username}.
              </span>
              <Button onClick={handleLogout} className="hover:cursor-pointer">
                Logout
              </Button>
            </>
          ) : (
            // Shows Login and Register buttons if the user is logged out.
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

