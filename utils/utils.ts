import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MatchStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMatchStatusText(
  status: MatchStatus,
  minute?: number,
): string {
  switch (status) {
    case "NOT_STARTED":
      return "Not Started";
    case "FIRST_HALF":
      return `${minute}'`;
    case "HALF_TIME":
      return "HT";
    case "SECOND_HALF":
      return `${minute}'`;
    case "FULL_TIME":
      return "FT";
    default:
      return "";
  }
}

export function isMatchLive(status: MatchStatus): boolean {
  return status === "FIRST_HALF" || status === "SECOND_HALF";
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function generateUserId(): string {
  return `user_${Math.random().toString(36).substring(2, 11)}`;
}
