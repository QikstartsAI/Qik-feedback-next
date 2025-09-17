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

export enum Ratings {
  Mal = "1",        // 😞
  Regular = "2",    // 😐
  Bien = "4",       // 😊
  Excelente = "5"   // 😄
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
  payload: UserPayload;
}

// Brand entity
export type BrandPayload = {
  logoImgURL: string;
  coverImgURL: string;
  name: string;
  category: string;
  powers: string[];
  location: {
    address: string;
    countryCode: string;
    geopoint: { lat: number; lon: number };
    googleMapURL: string;
  };
};

export interface Brand extends ModelResponseBase<BrandPayload> {
  payload: BrandPayload;
}

// Business entity for geolocation functionality
export interface Business {
  Geopoint?: { _lat: number; _long: number };
  HasGeolocation?: boolean;
  sucursales?: Branch[];
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
  brandId: string; // Reference to parent brand
  payload: BranchPayload;
  // Geolocation fields
  Geopoint?: { _lat: number; _long: number };
  HasGeolocation?: boolean;
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
  branchId: string; // Reference to parent branch
  payload: WaiterPayload;
}

// Customer entity (updated to match specification)
export type CustomerPayload = {
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  birthDate?: Date;
  branches: Array<{
    branchId: string;
    acceptPromotions: boolean;
  }>;
};

export interface Customer extends ModelResponseBase<CustomerPayload> {
  payload: CustomerPayload;
}

// Feedback entity (updated to match specification)

export interface FeedbackPayload {
  acceptTerms: boolean;
  acceptPromotions: boolean;
  customerType: CustomerType;
  averageTicket: string;
  origin: string;
  feedback?: string;
  rate: number;
  experienceText?: string;
  improve?: string[];
}

export interface Feedback extends ModelResponseBase<FeedbackPayload> {
  branchId: string;
  waiterId?: string;
  customerId: string;
  payload: FeedbackPayload;
}
