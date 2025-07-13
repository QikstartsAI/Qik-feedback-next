export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  name: string;
}

export const countryCodes: CountryCode[] = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+57", country: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "+51", country: "PE", flag: "🇵🇪", name: "Peru" },
  { code: "+56", country: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "+54", country: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "+593", country: "EC", flag: "🇪🇨", name: "Ecuador" },
  { code: "+58", country: "VE", flag: "🇻🇪", name: "Venezuela" },
  { code: "+595", country: "PY", flag: "🇵🇾", name: "Paraguay" },
  { code: "+598", country: "UY", flag: "🇺🇾", name: "Uruguay" },
  { code: "+591", country: "BO", flag: "🇧🇴", name: "Bolivia" },
];

export const ratingEmojis = [
  { id: "terrible", emoji: "😡", label: "Terrible" },
  { id: "bad", emoji: "😞", label: "Malo" },
  { id: "regular", emoji: "😐", label: "Regular" },
  { id: "good", emoji: "😊", label: "Bueno" },
  { id: "excellent", emoji: "🤩", label: "Excelente" },
];

export const referralSources = [
  { id: "google_maps", label: "Google Maps" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "referral", label: "Referido" },
  { id: "walking", label: "Caminaba" },
  { id: "social_media", label: "Redes sociales" },
  { id: "other", label: "Otro" },
];

export const applyPhoneMask = (digitsOnly: string): string => {
  // Apply mask: (333)-333-3333
  let maskedValue = "";
  if (digitsOnly.length > 0) {
    maskedValue = "(" + digitsOnly.substring(0, 3);
    if (digitsOnly.length > 3) {
      maskedValue += ")-" + digitsOnly.substring(3, 6);
      if (digitsOnly.length > 6) {
        maskedValue += "-" + digitsOnly.substring(6, 10);
      }
    }
  }

  return maskedValue;
};

export const validatePhone = (
  phoneNumber: string,
  countryCode: string
): { isValid: boolean; error: string } => {
  const cleanPhone = phoneNumber
    .replace(countryCode + " ", "")
    .replace(/\D/g, "");

  if (cleanPhone.length > 10) {
    return { isValid: false, error: "Número incorrecto - máximo 10 dígitos" };
  } else if (cleanPhone.length < 10 && cleanPhone.length > 0) {
    return {
      isValid: false,
      error:
        "Número incompleto - faltan " + (10 - cleanPhone.length) + " dígitos",
    };
  } else {
    return { isValid: true, error: "" };
  }
};

export const formatPhoneWithCountryCode = (
  maskedValue: string,
  countryCode: string
): string => {
  return countryCode + " " + maskedValue;
};

export const extractDigitsFromPhone = (
  phone: string,
  countryCode: string
): string => {
  return phone.replace(countryCode + " ", "").replace(/\D/g, "");
};
