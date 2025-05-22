import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lastFeedbackFilledIsGreaterThanOneDay(
  lastFeedbackFilled: Timestamp | undefined
): boolean {
  const oneDayInMilliseconds = 3 * 60 * 60 * 1000;
  const currentDate = new Date().getTime();

  if (lastFeedbackFilled) {
    const differenceInMilliseconds =
      currentDate - lastFeedbackFilled.toDate().getTime();
    return oneDayInMilliseconds > differenceInMilliseconds;
  }
  return false;
}

export function setCookie(c_name: string, value: string, exdays: number) {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  let c_value =
    escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

export function getCookie(c_name: string) {
  let c_value: string | null = document.cookie;
  let c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_start = c_value.indexOf(c_name + "=");
  }
  if (c_start == -1) {
    c_value = null;
  } else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start, c_end));
  }
  return c_value;
}

/**
 * Copies the given text to the clipboard.
 * @param text The text to copy.
 * @returns A promise that resolves to true if the copy was successful, and rejects otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    console.error("Clipboard API not available");
    return Promise.reject("Clipboard API not available");
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy text: ", error);
    return Promise.reject(error);
  }
}
