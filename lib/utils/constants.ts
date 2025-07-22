export const DEFAULT_COUNTRY_CODE = "+593";
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
