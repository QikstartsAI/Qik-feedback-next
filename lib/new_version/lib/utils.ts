import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cns(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
