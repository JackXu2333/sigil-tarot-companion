import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Typography Scale - Consistent font sizes across the application
export const typography = {
  // Display text (headings, titles)
  display: {
    h1: "text-2xl font-bold", // Main page titles
    h2: "text-lg font-semibold", // Section headings
    h3: "text-base font-semibold", // Subsection headings
    h4: "text-sm font-semibold", // Small headings
  },
  
  // Body text
  body: {
    large: "text-base", // Important body text
    default: "text-sm", // Standard body text
    small: "text-xs", // Secondary text, captions
  },
  
  // Labels and form elements
  label: {
    default: "text-sm font-medium", // Form labels, standard labels
    small: "text-xs font-medium", // Small labels, metadata
  },
  
  // Interactive elements
  interactive: {
    button: "text-sm font-medium", // Button text
    link: "text-sm", // Links
    badge: "text-xs", // Badges, tags
  },
  
  // Special contexts
  chart: {
    value: "text-xs font-mono", // Chart values, numeric displays  
    label: "text-xs", // Chart labels
  },
  
  // Status text
  status: {
    muted: "text-xs text-muted-foreground", // Timestamps, helper text
    error: "text-sm text-destructive", // Error messages
    success: "text-sm text-green-600", // Success messages
  }
} as const;
