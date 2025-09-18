export const DEFAULT_COUNTRY_CODE = "+593";
export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJE2d1JuOb1ZER1Sm4o7EX8K8&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2";

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
