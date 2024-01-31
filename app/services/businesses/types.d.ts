// `I` comes from interface

interface BusinessI {
  id: string;
  Address: string;
  Country: string;
  Name: string;
  Cover?: string;
  IconoWhite: string;
  Icono?: string;
  QRGeolocationIsActive?: boolean;
  PricePlan?: number;
  MapsUrl?: string;
  Coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface BusinessSucursalI extends BusinessI {}
