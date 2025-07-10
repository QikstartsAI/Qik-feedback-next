export enum CustomerType {
  New,
  Frequent,
}

export enum Origin {
  GoogleMapsContext,
  WhatsApp,
  Referring,
  Walking,
}

export enum SocialNetwork {
  Google,
  Facebook,
  Instagram,
  TikTok,
  Youtube,
}

export enum Improve {
  Food,
  Service,
  Ambiance,
  Other,
}

export type CustomerPayload = {
  fullName: string;
  customerType: CustomerType;
  birthDate: Date;
  phoneNumber: string;
};

export interface FeedbackPayload {
  customer: CustomerPayload;
  acceptPromotions: boolean;
  origin: Origin | SocialNetwork | string;
  rating: 1 | 2 | 3 | 4 | 5;
  improve: Improve[];
  improveText?: string;
  acceptTyC: boolean;
  branchId: string;
}

interface ModelResponseBase<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: T;
}

export interface Customer extends ModelResponseBase<CustomerPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: CustomerPayload;
}
export interface Feedback extends ModelResponseBase<FeedbackPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: FeedbackPayload;
}

export type BranchPayload = {
  name: string;
  address: string;
  country: string;
  city: string;
  coverImgURL?: string;
  logo?: string;
  geopoint?: { _lat: number; _long: number };
  hasGeolocation?: boolean;
};

export interface Branch extends ModelResponseBase<BranchPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: BranchPayload;
}
