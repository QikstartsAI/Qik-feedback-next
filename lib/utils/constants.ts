export const DEFAULT_COUNTRY_CODE = "+593";
export const PHONE_MAX_LENGTH = 14; // Format: (333)-333-3333 = 14 characters
export const PHONE_DIGITS_MAX_LENGTH = 10; // Total digits needed: 3 + 3 + 4 = 10
export const GOOGLE_REVIEW_URL = "https://g.page/r/CdUpuKOxF_CvEBM/review";

export const FORM_STEPS = {
  WELCOME: 1,
  SURVEY: 2,
  THANK_YOU: 3,
} as const;

export const VIEWS = {
  WELCOME: "welcome",
  SURVEY: "survey",
  THANK_YOU: "thankyou",
} as const;

export const RATING_TYPES = {
  TERRIBLE: "terrible",
  BAD: "bad",
  REGULAR: "regular",
  GOOD: "good",
  EXCELLENT: "excellent",
} as const;
