import translations from './translations';



// dictionary of translations depending on the country of the business
/**
 * @typedef {Object} Translations
 * @property {string} [US] - The translation for the US
 * @property {string} [CA] - The translation for Canada
 * @property {string} [FR] - The translation for France
 * @property {string} [default] - The default translation
 * @description The translations for the different countries where the business is located
 * @param {businessCountry} businessCountry - The country of the business to get the translations
 */

const { 
  formSubTitle, 
  formTitle, 
  fullNameQuestion,
  emailQuestion,
  waiterServiceQuestion,
  submitButton,
  termsAndConditions1,
  termsAndConditions2,
  termsAndConditions3,
  termsAndConditions4,
 } = translations

const getTranslatedFormTitle = ({ businessCountry }: { businessCountry: string }) => {  
  return formTitle[businessCountry as keyof typeof formTitle] || formTitle.default
}

const getTranslatedFormSubTitle = ({ businessCountry }: { businessCountry: string }) => {
  return formSubTitle[businessCountry as keyof typeof formSubTitle] || formSubTitle.default
}

const getTranslatedFullNameQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return fullNameQuestion[businessCountry as keyof typeof fullNameQuestion] || fullNameQuestion.default
}

const getTranslatedEmailQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return emailQuestion[businessCountry as keyof typeof emailQuestion] || emailQuestion.default
}

const getTranslatedWaiterServiceQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return waiterServiceQuestion[businessCountry as keyof typeof waiterServiceQuestion] || waiterServiceQuestion.default
}

const getSubmitButton = ({ businessCountry }: { businessCountry: string }) => {
  return submitButton[businessCountry as keyof typeof submitButton] || submitButton.default
}

const getTermsAndConditions1 = ({ businessCountry }: { businessCountry: string }) => {
  return termsAndConditions1[businessCountry as keyof typeof termsAndConditions1] || termsAndConditions1.default
}

const getTermsAndConditions2 = ({ businessCountry }: { businessCountry: string }) => {
  return termsAndConditions2[businessCountry as keyof typeof termsAndConditions2] || termsAndConditions2.default
}

const getTermsAndConditions3 = ({ businessCountry }: { businessCountry: string }) => {
  return termsAndConditions3[businessCountry as keyof typeof termsAndConditions3] || termsAndConditions3.default
}

const getTermsAndConditions4 = ({ businessCountry }: { businessCountry: string }) => {
  return termsAndConditions4[businessCountry as keyof typeof termsAndConditions4] || termsAndConditions4.default
}

const getFormTranslations = ({ businessCountry }: { businessCountry: string }) => {

  return {
    title: getTranslatedFormTitle({ businessCountry }),
    subTitle: getTranslatedFormSubTitle({ businessCountry }),
    fullNameQuestion: getTranslatedFullNameQuestion({ businessCountry }),
    emailQuestion: getTranslatedEmailQuestion({ businessCountry }),
    waiterServiceQuestion: getTranslatedWaiterServiceQuestion({ businessCountry }),
    submitButton: getSubmitButton({ businessCountry }),
    termsAndConditions1: getTermsAndConditions1({ businessCountry }),
    termsAndConditions2: getTermsAndConditions2({ businessCountry }),
    termsAndConditions3: getTermsAndConditions3({ businessCountry }),
    termsAndConditions4: getTermsAndConditions4({ businessCountry }),
  }
}

export default getFormTranslations