import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";


export function RateLimitNotification({ show }) {
  useEffect(() => {
    if (show) {
      // Call `toast.error()` which is sonner's function for an error-style toast.
      toast.error("AI Limit Reached", {
        description:
          "You can still review flashcards using the standard format!",
        duration: 2000,
        icon: <AlertCircle className="h-4 w-4 bg-background" />,
      });
    }
  }, [show]);

  return null;
}