import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const COLORS = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  primary: "#2563EB",
  text: "#0F172A",
  muted: "#64748B",
};