import * as d3 from "d3";

/**
 * Maps a user count to a color using discrete buckets and D3's interpolateBlues.
 *
 * @param userCount - The number of users in a country.
 * @returns A hex color representing the user count.
 */
export function getUserCountColor(userCount: number): string {
  if (userCount <= 1000) {
    return d3.interpolateBlues(0.1);
  } else if (userCount <= 5000) {
    return d3.interpolateBlues(0.3);
  } else if (userCount <= 10000) {
    return d3.interpolateBlues(0.6);
  } else {
    return d3.interpolateBlues(1);
  }
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
