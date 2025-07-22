export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  name: string;
  phoneLength: number; // Number of digits expected for this country
}

export const countryCodes: CountryCode[] = [
  {
    code: "+1",
    country: "US",
    flag: "🇺🇸",
    name: "United States",
    phoneLength: 10,
  },
  {
    code: "+44",
    country: "GB",
    flag: "🇬🇧",
    name: "United Kingdom",
    phoneLength: 10,
  },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain", phoneLength: 9 },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France", phoneLength: 10 },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany", phoneLength: 11 },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy", phoneLength: 10 },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico", phoneLength: 10 },
  { code: "+57", country: "CO", flag: "🇨🇴", name: "Colombia", phoneLength: 10 },
  { code: "+51", country: "PE", flag: "🇵🇪", name: "Peru", phoneLength: 9 },
  { code: "+56", country: "CL", flag: "🇨🇱", name: "Chile", phoneLength: 9 },
  {
    code: "+54",
    country: "AR",
    flag: "🇦🇷",
    name: "Argentina",
    phoneLength: 10,
  },
  { code: "+593", country: "EC", flag: "🇪🇨", name: "Ecuador", phoneLength: 9 },
  {
    code: "+58",
    country: "VE",
    flag: "🇻🇪",
    name: "Venezuela",
    phoneLength: 10,
  },
  { code: "+595", country: "PY", flag: "🇵🇾", name: "Paraguay", phoneLength: 9 },
  { code: "+598", country: "UY", flag: "🇺🇾", name: "Uruguay", phoneLength: 8 },
  { code: "+591", country: "BO", flag: "🇧🇴", name: "Bolivia", phoneLength: 8 },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil", phoneLength: 11 },
  {
    code: "+506",
    country: "CR",
    flag: "🇨🇷",
    name: "Costa Rica",
    phoneLength: 8,
  },
  { code: "+507", country: "PA", flag: "🇵🇦", name: "Panama", phoneLength: 8 },
  {
    code: "+502",
    country: "GT",
    flag: "🇬🇹",
    name: "Guatemala",
    phoneLength: 8,
  },
  {
    code: "+503",
    country: "SV",
    flag: "🇸🇻",
    name: "El Salvador",
    phoneLength: 8,
  },
  { code: "+504", country: "HN", flag: "🇭🇳", name: "Honduras", phoneLength: 8 },
  {
    code: "+505",
    country: "NI",
    flag: "🇳🇮",
    name: "Nicaragua",
    phoneLength: 8,
  },
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

export const applyPhoneMask = (
  digitsOnly: string,
  countryCode: string
): string => {
  const country = countryCodes.find((c) => c.code === countryCode);
  const maxLength = country?.phoneLength || 10;

  // Limit digits to country's phone length
  const limitedDigits = digitsOnly.substring(0, maxLength);

  // Apply mask based on country length
  if (country?.phoneLength === 8) {
    // Format for 8-digit numbers (e.g., Uruguay, Bolivia): 1234-5678
    let maskedValue = "";
    if (limitedDigits.length > 0) {
      maskedValue = limitedDigits.substring(0, 4);
      if (limitedDigits.length > 4) {
        maskedValue += "-" + limitedDigits.substring(4, 8);
      }
    }
    return maskedValue;
  } else if (country?.phoneLength === 9) {
    // Format for 9-digit numbers (e.g., Spain, Peru, Chile, Ecuador, Paraguay): 123-456-789
    let maskedValue = "";
    if (limitedDigits.length > 0) {
      maskedValue = limitedDigits.substring(0, 3);
      if (limitedDigits.length > 3) {
        maskedValue += "-" + limitedDigits.substring(3, 6);
        if (limitedDigits.length > 6) {
          maskedValue += "-" + limitedDigits.substring(6, 9);
        }
      }
    }
    return maskedValue;
  } else {
    // Default format for 10+ digit numbers: (123)-456-7890
    let maskedValue = "";
    if (limitedDigits.length > 0) {
      maskedValue = "(" + limitedDigits.substring(0, 3);
      if (limitedDigits.length > 3) {
        maskedValue += ")-" + limitedDigits.substring(3, 6);
        if (limitedDigits.length > 6) {
          maskedValue +=
            "-" + limitedDigits.substring(6, Math.min(10, maxLength));
        }
      }
    }
    return maskedValue;
  }
};

export const validatePhone = (
  phoneNumber: string,
  countryCode: string
): { isValid: boolean; error: string } => {
  const cleanPhone = phoneNumber
    .replace(countryCode + " ", "")
    .replace(/\D/g, "");

  const country = countryCodes.find((c) => c.code === countryCode);
  const expectedLength = country?.phoneLength || 10;

  if (cleanPhone.length > expectedLength) {
    return {
      isValid: false,
      error: `Número incorrecto - máximo ${expectedLength} dígitos`,
    };
  } else if (cleanPhone.length < expectedLength && cleanPhone.length > 0) {
    return {
      isValid: false,
      error: `Número incompleto - faltan ${
        expectedLength - cleanPhone.length
      } dígitos`,
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

// Map ISO country codes to phone country codes
export const getCountryCodeFromISO = (
  isoCode: string
): CountryCode | undefined => {
  const isoToPhoneMap: { [key: string]: string } = {
    US: "+1",
    CA: "+1", // Canada also uses +1
    GB: "+44",
    ES: "+34",
    FR: "+33",
    DE: "+49",
    IT: "+39",
    MX: "+52",
    CO: "+57",
    PE: "+51",
    CL: "+56",
    AR: "+54",
    EC: "+593",
    VE: "+58",
    PY: "+595",
    UY: "+598",
    BO: "+591",
    BR: "+55", // Brazil
    CR: "+506", // Costa Rica
    PA: "+507", // Panama
    GT: "+502", // Guatemala
    SV: "+503", // El Salvador
    HN: "+504", // Honduras
    NI: "+505", // Nicaragua
  };

  const phoneCode = isoToPhoneMap[isoCode];
  return phoneCode ? countryCodes.find((c) => c.code === phoneCode) : undefined;
};
