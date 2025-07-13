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

// Base interface for all entities
interface ModelResponseBase<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: T;
}

// User entity
export type UserPayload = {
  name: string;
  lastName: string;
  phoneNumber: string;
};

export interface User extends ModelResponseBase<UserPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: UserPayload;
}

// Brand entity
export type BrandPayload = {
  logoImgURL: string;
  coverImgURL: string;
  name: string;
  category: string;
  location: {
    address: string;
    countryCode: string;
    geopoint: { lat: number; lon: number };
    googleMapURL: string;
  };
};

export interface Brand extends ModelResponseBase<BrandPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: BrandPayload;
}

// Branch entity (updated to match specification)
export type BranchPayload = {
  logoImgURL: string;
  coverImgURL: string;
  name: string;
  category: string;
  location: {
    address: string;
    countryCode: string;
    geopoint: { lat: number; lon: number };
    googleMapURL: string;
  };
};

export interface Branch extends ModelResponseBase<BranchPayload> {
  id: string;
  brandId: string; // Reference to parent brand
  createdAt: Date;
  updatedAt: Date;
  payload: BranchPayload;
}

// Waiter entity
export type WaiterPayload = {
  name: string;
  lastName: string;
  gender: "male" | "female";
  birthDate: Date;
  rate: number;
};

export interface Waiter extends ModelResponseBase<WaiterPayload> {
  id: string;
  branchId: string; // Reference to parent branch
  createdAt: Date;
  updatedAt: Date;
  payload: WaiterPayload;
}

// Customer entity (updated to match specification)
export type CustomerPayload = {
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  birthDate?: Date;
  businesses: Array<{
    branchId: string;
    acceptPromotions: boolean;
  }>;
};

export interface Customer extends ModelResponseBase<CustomerPayload> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  payload: CustomerPayload;
}

// Feedback entity (updated to match specification)
export interface FeedbackDataPayload {
  averageTicket: string;
  origin: string;
  feedback?: string;
  rate: number;
  experienceText?: string;
  improve?: string[];
}

export interface FeedbackPayload {
  branchId: string;
  waiterId?: string;
  customerId: string;
  acceptTerms: boolean;
  acceptPromotions: boolean;
  payload: FeedbackDataPayload;
}

export interface Feedback extends ModelResponseBase<FeedbackPayload> {
  id: string;
  branchId: string;
  waiterId?: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
  payload: FeedbackPayload;
}
