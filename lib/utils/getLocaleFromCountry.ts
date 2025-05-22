// Mapping from Country Code to Locale
export const getLocaleFromCountry = (
  countryCode: string | undefined
): string => {
  if (!countryCode) return "en"; // Default locale
  const code = countryCode.toUpperCase();

  switch (code) {
    // Spanish Speaking Countries
    case "ES": // Spain
    case "MX": // Mexico
    case "CO": // Colombia
    case "AR": // Argentina
    case "PE": // Peru
    case "VE": // Venezuela
    case "CL": // Chile
    case "EC": // Ecuador
    case "GT": // Guatemala
    case "CU": // Cuba
    case "BO": // Bolivia
    case "DO": // Dominican Republic
    case "HN": // Honduras
    case "PY": // Paraguay
    case "SV": // El Salvador
    case "NI": // Nicaragua
    case "CR": // Costa Rica
    case "PA": // Panama
    case "UY": // Uruguay
      return "es";

    // English Speaking Countries
    case "US": // United States
    case "GB": // United Kingdom (England)
    case "CA": // Canada
    case "AU": // Australia
      return "en";

    // Italian Speaking Countries
    case "IT": // Italy
      return "it";

    // French Speaking Countries
    case "FR": // France
      return "fr";

    // Chinese Speaking Countries
    case "CN": // China
      return "zh";

    // Portuguese Speaking Countries
    case "PT": // Portugal
    case "BR": // Brazil
      return "pt";

    // Add mappings for other countries/locales you support
    default:
      return "en"; // Fallback locale
  }
};
