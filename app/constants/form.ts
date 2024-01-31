import { FeedbackProps } from "@/app/validators/feedbackSchema";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconUserShare,
  IconUserPlus,
  IconBrandGoogleMaps,
  IconBrandTiktok,
  IconToolsKitchen,
  IconBuildingStore,
  IconUsers,
  TablerIconsProps,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { Business } from "../types/business";
import { currencyPrices } from "./prices";
import { Improvements } from "@/app/types/feedback";

const getKnownOrigins = (business: Business | BusinessI | undefined | null) => {
  const referred =
    business?.Country === "US"
      ? "Referred"
      : business?.Country === "CA"
      ? "Référé"
      : "Referido";

  const newClient =
    business?.Country === "US"
      ? "New client"
      : business?.Country === "CA"
      ? "Nouvelle cliente"
      : "Cliente nuevo";
  return [
    { value: "Maps", label: "Maps", icon: IconBrandGoogleMaps },
    { value: "TikTok", label: "TikTok", icon: IconBrandTiktok },
    { value: "Facebook", label: "Facebook", icon: IconBrandFacebook },
    { value: "WhatsApp", label: "WhatsApp", icon: IconBrandWhatsapp },
    { value: "Instagram", label: "Instagram", icon: IconBrandInstagram },
    { value: referred, label: referred, icon: IconUserShare },
    { value: newClient, label: newClient, icon: IconUserPlus },
  ];
};

const getCustomersQuantity = (
  business: Business | BusinessI | undefined | null
) => {
  const toGo =
    business?.Country === "US"
      ? "To go"
      : business?.Country === "CA"
      ? "Pour emporter"
      : "Para llevar";

  const forDelivery =
    business?.Country === "US"
      ? "For delivery"
      : business?.Country === "CA"
      ? "Pour livraison"
      : "Domicilio";
  return [
    { value: "1-2", label: "1-2" },
    { value: "2-4", label: "2-4" },
    { value: "+4", label: "+4" },
    { value: toGo, label: toGo },
    { value: forDelivery, label: forDelivery },
  ];
};

const getAverageTicket = (
  business: Business | BusinessI | undefined | null
) => {
  const businessCountry = business?.Country;
  const averageTicketList = Object.entries(currencyPrices).find(
    ([key]) => key === businessCountry
  )?.[1];

  return (
    averageTicketList?.map((price) => ({ value: price, label: price })) || []
  );
};

type ImproveOptions = {
  value: keyof FeedbackProps;
  label: string;
  icon: (props: TablerIconsProps) => ReactNode;
};

const improveOptions: ImproveOptions[] = [
  { value: "Food", label: "Comida", icon: IconToolsKitchen },
  { value: "Service", label: "Servicio", icon: IconUsers },
  { value: "Ambience", label: "Ambiente", icon: IconBuildingStore },
];

type IGetImprovements = ({
  Ambience,
  Food,
  Service,
}: {
  Food: boolean;
  Service: boolean;
  Ambience: boolean;
  business: Business | BusinessI | undefined | null;
}) => string[];

const getImprovements: IGetImprovements = ({
  Ambience,
  Food,
  Service,
  business,
}) => {
  const businessCountry = business?.Country;
  const foodLabel =
    businessCountry === "US"
      ? Improvements.Food
      : businessCountry === "CA"
      ? "Nourriture"
      : "Comida";

  const serviceLabel =
    businessCountry === "US"
      ? Improvements.Service
      : businessCountry === "CA"
      ? "Service"
      : "Servicio";

  const ambienceLabel =
    businessCountry === "US"
      ? Improvements.Ambience
      : businessCountry === "CA"
      ? "Ambiance"
      : "Ambiente";

  const Improve = [];
  if (Food) {
    Improve.push(foodLabel);
  }
  if (Service) {
    Improve.push(serviceLabel);
  }
  if (Ambience) {
    Improve.push(ambienceLabel);
  }
  return Improve;
};

export {
  getKnownOrigins,
  getCustomersQuantity,
  getAverageTicket,
  improveOptions,
  getImprovements,
};
