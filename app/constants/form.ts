import { FeedbackProps } from '@/app/validators/feedbackSchema'
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
} from '@tabler/icons-react'
import { ReactNode } from 'react'
import { Business } from '../types/business'
import { currencyPrices } from './prices'
import { Improvements } from '@/app/types/feedback'
import { CustomerRole } from '../types/customer'

const getOthersText = (business: Business | null) => {
  return business?.Country === 'US'
    ? 'Others'
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Autres'
      : 'Otros'
}

const getOtherOptions = (business: Business | null) => {
  const walking = business?.Country === 'US'
    ? 'Walking'
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Marche'
      : 'Caminando'
  const billboard = business?.Country === 'US'
    ? 'Billboard'
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? "Panneau d'affichage"
      : 'Valla publicitaria'
  const events = business?.Country === 'US'
    ? 'Events'
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? "Événements"
      : 'Eventos'

  return [
    { value: walking, label: walking, icon: IconWalk },
    { value: 'TV', label: 'TV', icon: IconScreenShare },
    { value: 'Radio', label: 'Radio', icon: IconRadio },
    { value: events, label: events, icon: IconBuildingStore },
    { value: billboard, label: billboard, icon: IconAd },
  ]
}

const getOtherOriginValues = (business: Business | null) => {
  const others = getOthersText(business)
  return { value: others, label: others, icon: IconPlus }
}

const getKnownOrigins = (business: Business | null) => {
  const referred = business?.Country === 'US'
    ? 'Referred'
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Référé'
      : 'Referido'

  return [
    { value: 'Maps', label: 'Maps', icon: IconBrandGoogleMaps },
    { value: 'TikTok', label: 'TikTok', icon: IconBrandTiktok },
    { value: 'Facebook', label: 'Facebook', icon: IconBrandFacebook },
    { value: 'WhatsApp', label: 'WhatsApp', icon: IconBrandWhatsapp },
    { value: 'Instagram', label: 'Instagram', icon: IconBrandInstagram },
    { value: referred, label: referred, icon: IconUserShare },
  ]
}

const getCustomersQuantity = (business: Business | null) => {
  const toGo = business?.Country === 'US'
    ? 'To go'
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Pour emporter'
      : 'Para llevar'

  const forDelivery = business?.Country === 'US'
    ? 'For delivery'
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Pour livraison'
      : 'Domicilio'
  return [
    { value: '1-2', label: '1-2' },
    { value: '2-4', label: '2-4' },
    { value: '+4', label: '+4' },
    { value: toGo, label: toGo },
    { value: forDelivery, label: forDelivery }
  ]
}

const getAverageTicket = (business: Business | null) => {
  const businessCountry = business?.Country
  const averageTicketList = Object.entries(currencyPrices).find(([key]) => key === businessCountry)?.[1]

  return averageTicketList?.map((price) => ({ value: price, label: price })) || []
}

type ImproveOptions = {
  value: keyof FeedbackProps
  label: string
  icon: (props: TablerIconsProps) => ReactNode;
}

const improveOptions: ImproveOptions[] = [
  { value: 'Food', label: 'Comida', icon: IconToolsKitchen },
  { value: 'Service', label: 'Servicio', icon: IconUsers },
  { value: 'Ambience', label: 'Ambiente', icon: IconBuildingStore }
]

type IGetImprovements = ({ Ambience, Food, Service }: { Food: boolean, Service: boolean, Ambience: boolean, business: Business | null }) => string[]

const getImprovements: IGetImprovements = ({ Ambience, Food, Service, business }) => {
  const businessCountry = business?.Country
  const foodLabel = businessCountry === 'US'
    ? Improvements.Food
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Nourriture'
      : 'Comida'

  const serviceLabel = businessCountry === 'US'
    ? Improvements.Service
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Service'
      : 'Servicio'

  const ambienceLabel = businessCountry === 'US'
    ? Improvements.Ambience
    : business?.Country === 'CA' || business?.Country === 'FR'
      ? 'Ambiance'
      : 'Ambiente'

  const Improve = []
  if (Food) {
    Improve.push(foodLabel)
  }
  if (Service) {
    Improve.push(serviceLabel)
  }
  if (Ambience) {
    Improve.push(ambienceLabel)
  }
  return Improve
}

const getOriginLabel = (
  isUsCountry: boolean,
  isCaCountry: boolean,
  isFrCountry: boolean,
  customerType: CustomerRole
) => {
  let originLabel = ""
  if (customerType === 'new') {
    originLabel =   isUsCountry
    ? 'Where do you know us from?'
    : isCaCountry || isFrCountry
      ? "D'où nous connaissez-vous?"
      : '¿De dónde nos conoces?'
  } else if (customerType === 'frequent') {
    originLabel =   isUsCountry
    ? 'Where have you seen us lately?'
    : isCaCountry || isFrCountry
      ? "Où nous as-tu vu dernièrement ?"
      : '¿Dónde nos has visto últimamente?'
  }
  return originLabel
}

// array of objects with the value and label of the rating from 1 to 10
const ratingOptionsFrom1To10 = Array.from({ length: 5 }, (_, i) => {
  const strValue = (i + 1).toString();
  return { value: strValue, label: strValue, icon: IconStar };
});

export {
  getKnownOrigins,
  getCustomersQuantity,
  getAverageTicket,
  improveOptions,
  getImprovements,
  getOthersText,
  getOtherOptions,
  getOtherOriginValues,
  getOriginLabel,
  ratingOptionsFrom1To10,
}
