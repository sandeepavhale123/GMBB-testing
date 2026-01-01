import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// src/utils/domainCheck.ts
const allowedDomains = [
  "localhost:8080",
  "member.gmbbriefcase.com",
];

export const isAllowedDomain = (): boolean => {
  return allowedDomains.includes(window.location.host);
};
