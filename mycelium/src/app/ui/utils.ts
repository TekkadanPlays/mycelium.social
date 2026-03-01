import { clsx, type ClassValue } from 'clsx';
import { createTailwindMerge, getDefaultConfig } from 'tailwind-merge';

// Explicitly wire createTailwindMerge + getDefaultConfig to work around
// Bun bundler failing to resolve the default twMerge re-export.
const twMerge = createTailwindMerge(getDefaultConfig);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
