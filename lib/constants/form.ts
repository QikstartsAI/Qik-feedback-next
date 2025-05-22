import { FeedbackProps } from "@/lib/validators/feedbackSchema";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconUserShare,
  IconBrandGoogleMaps,
  IconBrandTiktok,
  IconToolsKitchen,
  IconBuildingStore,
  IconUsers,
  TablerIconsProps,
  IconPlus,
  IconWalk,
  IconAd,
  IconScreenShare,
  IconRadio,
  IconStar,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { currencyPrices } from "./prices";
import { Improvements } from "@/lib/types/feedback";
import { CustomerRole } from "../types/customer";
import { Country } from "react-phone-number-input";
import getFormTranslations from "@/lib/constants/formTranslations";
import { commonPaymentMethods, walletsByCountry } from "./wallets";

const getOthersText = (businessCountry: Country | undefined) => {
  return businessCountry === "US"
    ? "Others"
    : businessCountry === "CA" || businessCountry === "FR"
    ? "Autres"
    : businessCountry === "IT"
    ? "Altri"
    : "Otros";
};

const getOtherOptions = (businessCountry: Country | undefined) => {
  const walking =
    businessCountry === "US"
      ? "Walking"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Marche"
      : businessCountry === "IT"
      ? "Camminando"
      : "Caminando";
  const billboard =
    businessCountry === "US"
      ? "Billboard"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Panneau d'affichage"
      : businessCountry === "IT"
      ? "Cartellone pubblicitario"
      : "Valla publicitaria";
  const events =
    businessCountry === "US"
      ? "Events"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Événements"
      : businessCountry === "IT"
      ? "Eventi"
      : "Eventos";

  return [
    { value: walking, label: walking, icon: IconWalk },
    { value: "TV", label: "TV", icon: IconScreenShare },
    { value: "Radio", label: "Radio", icon: IconRadio },
    { value: events, label: events, icon: IconBuildingStore },
    { value: billboard, label: billboard, icon: IconAd },
  ];
};

const getOtherOriginValues = (businessCountry: Country | undefined) => {
  const others = getOthersText(businessCountry);
  return { value: others, label: others, icon: IconPlus };
};

const getKnownOrigins = (businessCountry: Country | undefined) => {
  const referred =
    businessCountry === "US"
      ? "Referred"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Référé"
      : businessCountry === "IT"
      ? "Riferito"
      : "Referido";

  return [
    { value: "Maps", label: "Maps", icon: IconBrandGoogleMaps },
    { value: "TikTok", label: "TikTok", icon: IconBrandTiktok },
    { value: "Facebook", label: "Facebook", icon: IconBrandFacebook },
    { value: "WhatsApp", label: "WhatsApp", icon: IconBrandWhatsapp },
    { value: "Instagram", label: "Instagram", icon: IconBrandInstagram },
    { value: referred, label: referred, icon: IconUserShare },
  ];
};

const getCustomersQuantity = (businessCountry: Country | undefined) => {
  const toGo =
    businessCountry === "US"
      ? "To go"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Pour emporter"
      : businessCountry === "IT"
      ? "Da asporto"
      : "Para llevar";

  const forDelivery =
    businessCountry === "US"
      ? "For delivery"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Pour livraison"
      : businessCountry === "IT"
      ? "Per consegna"
      : "Domicilio";
  return [
    { value: "1-2", label: "1-2" },
    { value: "2-4", label: "2-4" },
    { value: "+4", label: "+4" },
    { value: toGo, label: toGo },
    { value: forDelivery, label: forDelivery },
  ];
};

const getGoodFeedbackOptions = (businessCountry: Country | undefined) => {
  const loveIt =
    businessCountry === "US"
      ? "Everything was amazing, I loved it! 🌟✨"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Tout était incroyable, j'ai adoré ! 🌟✨"
      : businessCountry === "IT"
      ? "Tutto era incredibile, mi è piaciuto! 🌟✨"
      : "Todo increíble, ¡me encantó! 🌟✨";

  const recommended =
    businessCountry === "US"
      ? "Exceeded my expectations, highly recommended 👍💯"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "A dépassé mes attentes, très recommandé 👍💯"
      : businessCountry === "IT"
      ? "Ha superato le mie aspettative, altamente raccomandato 👍💯"
      : "Superó mis expectativas, muy recomendado 👍💯";

  const greatExperience =
    businessCountry === "US"
      ? "Great experience, I will definitely come back! 😃👏"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Grande expérience, je reviendrai sans doute ! 😃👏"
      : businessCountry === "IT"
      ? "Grande esperienza, tornerò sicuramente! 😃👏"
      : "Gran experiencia, ¡voleveré sin duda! 😃👏";

  const amazing =
    businessCountry === "US"
      ? "Excellent in all aspects, congratulations! 🎉🙌"
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Excellente dans tous les aspects, bravo ! 🎉🙌"
      : businessCountry === "IT"
      ? "Eccellente in tutti gli aspetti, congratulazioni! 🎉🙌"
      : "Excelente en todos los aspectos, ¡felicitaciones! 🎉🙌";

  return [
    { value: "loveIt", label: loveIt },
    { value: "recommended", label: recommended },
    { value: "greatExperience", label: greatExperience },
    { value: "amazing", label: amazing },
  ];
};

const getAverageTicket = (businessCountry: Country | undefined) => {
  const averageTicketList = Object.entries(currencyPrices).find(
    ([key]) => key === businessCountry
  )?.[1];

  return (
    averageTicketList?.map((price) => ({ value: price, label: price })) || []
  );
};

const localizedCommonPaymentMethods = (businessCountry: Country | undefined) =>
  commonPaymentMethods.map((method) => {
    let localizedName;
    switch (method.id) {
      case "credit-card":
        localizedName =
          businessCountry === "US"
            ? "Credit Card"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Carte de Crédit"
            : businessCountry === "IT"
            ? "Carta di Credito"
            : "Tarjeta de Crédito";
        break;
      case "cash":
        localizedName =
          businessCountry === "US"
            ? "Cash"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Espèces"
            : businessCountry === "IT"
            ? "Contanti"
            : "Efectivo";
        break;
      case "transfer":
        localizedName =
          businessCountry === "US"
            ? "Transfer"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Virement"
            : businessCountry === "IT"
            ? "Bonifico"
            : "Transferencia";
        break;
      default:
        localizedName = method.name;
    }
    return { ...method, name: localizedName };
  });

const getWalletByCountry = (businessCountry: Country | undefined) => {
  const wallets = Object.entries(walletsByCountry).find(
    ([key]) => key === businessCountry
  )?.[1];
  return (
    [
      ...(wallets || []),
      ...localizedCommonPaymentMethods(businessCountry),
    ]?.map((wallet) => ({
      value: wallet.id,
      label: wallet.name,
      image: wallet.image,
    })) || []
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
  Food: boolean | undefined;
  Service: boolean | undefined;
  Ambience: boolean | undefined;
  businessCountry: Country | undefined;
}) => string[];

const getImprovements: IGetImprovements = ({
  Ambience,
  Food,
  Service,
  businessCountry,
}) => {
  const foodLabel =
    businessCountry === "US"
      ? Improvements.Food
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Nourriture"
      : businessCountry === "IT"
      ? "Cibo"
      : "Comida";

  const serviceLabel =
    businessCountry === "US"
      ? Improvements.Service
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Service"
      : businessCountry === "IT"
      ? "Servizio"
      : "Servicio";

  const ambienceLabel =
    businessCountry === "US"
      ? Improvements.Ambience
      : businessCountry === "CA" || businessCountry === "FR"
      ? "Ambiance"
      : businessCountry === "IT"
      ? "Atmosfera"
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

const getOriginLabel = (
  isUsCountry: boolean,
  isCaCountry: boolean,
  isFrCountry: boolean,

  customerType: CustomerRole
) => {
  let originLabel = "";
  if (customerType === "new") {
    originLabel = isUsCountry
      ? "Where do you know us from?"
      : isCaCountry || isFrCountry
      ? "D'où nous connaissez-vous?"
      : "¿De dónde nos conoces?";
  } else if (customerType === "frequent") {
    originLabel = isUsCountry
      ? "Where have you seen us lately?"
      : isCaCountry || isFrCountry
      ? "Où nous as-tu vu dernièrement ?"
      : "¿Dónde nos has visto últimamente?";
  }
  return originLabel;
};

// array of objects with the value and label of the rating from 1 to 5
const getRatingOptions = (businessCountry: string) => {
  return Array.from({ length: 5 }, (_, i) => {
    const strValue = (i + 1).toString();
    const {
      oneStarLabel,
      twoStarLabel,
      threeStarLabel,
      fourStarLabel,
      fiveStarLabel,
    } = getFormTranslations({ businessCountry });
    const strLabels: { [index: string]: string } = {
      "1": oneStarLabel,
      "2": twoStarLabel,
      "3": threeStarLabel,
      "4": fourStarLabel,
      "5": fiveStarLabel,
    };
    return { value: strValue, label: strLabels[strValue], icon: IconStar };
  });
};

export {
  getKnownOrigins,
  getCustomersQuantity,
  getAverageTicket,
  getWalletByCountry,
  improveOptions,
  getImprovements,
  getOthersText,
  getOtherOptions,
  getOtherOriginValues,
  getOriginLabel,
  getRatingOptions,
  getGoodFeedbackOptions,
};
