// --- Imports ---
// Imports two small but powerful libraries for managing CSS class strings.
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- cn (className) Utility Function ---
// A standard utility in Shadcn/UI projects for combining and managing Tailwind CSS classes.
// It allows for conditional classes and intelligently resolves conflicts.
export function cn(...inputs) {
  // `clsx` takes all the inputs (strings, objects, arrays) and combines them
  // into a single class string. It's excellent for applying classes conditionally.
  // For example: clsx('base-class', { 'active-class': isActive, 'hidden': !isVisible })
  const conditionalClasses = clsx(inputs);

  // `twMerge` takes the resulting class string and merges any conflicting
  // Tailwind utility classes. For example, if the input results in "p-2 p-4",
  // twMerge will resolve this to just "p-4", ensuring the last style wins.
  // This prevents style bugs from conflicting classes.
  const mergedClasses = twMerge(conditionalClasses);

  return mergedClasses;
}