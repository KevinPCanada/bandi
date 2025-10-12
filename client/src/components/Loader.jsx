import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Import the `cn` utility

// CHANGE 1: The component now accepts a `className` prop.
const Loader = ({ text, className }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* The `cn` utility merges the default styles
          with any custom className I pass in. This allows me
          to change the color, size, etc. from outside the component.
      */}
      <Loader2 className={cn("h-8 w-8 animate-spin text-primary-foreground", className)} />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default Loader;