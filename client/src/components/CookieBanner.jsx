import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  // When the component loads, check if the user has already accepted the cookies.
  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  // When the user clicks "Accept", save their choice to localStorage and hide the banner.
  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  // If the banner shouldn't be visible, render nothing.
  if (!isVisible) return null;

  return (
    // This div positions the banner at the bottom of the screen.
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          We use a single, essential cookie to keep you logged in. By using our
          site, you agree to this practice. See our{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>{" "}
          for more details.
        </p>
        <Button onClick={handleAccept} className="w-full sm:w-auto">
          Accept
        </Button>
      </div>
    </div>
  );
}
