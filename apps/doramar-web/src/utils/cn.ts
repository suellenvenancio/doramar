import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"

export function mergeCn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
