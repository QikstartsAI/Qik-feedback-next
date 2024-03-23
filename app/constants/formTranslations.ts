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
  placeCleannessQuestion,
  quicknessQuestion,
  foodQualityQuestion,
  ambienceQuestion,
  courtesyQuestion,
  latelySeenQuestion,
  spendingQuestion,
  recommendingQuestion,
  experienceQuestion,
  submitButton,
  termsAndConditions1,
  termsAndConditions2,
  termsAndConditions3,
  termsAndConditions4,
  formErrorMessage,
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

const getTranslatedPlaceCleannessQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return placeCleannessQuestion[businessCountry as keyof typeof placeCleannessQuestion] || placeCleannessQuestion.default
}

const getTranslatedQuicknessQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return quicknessQuestion[businessCountry as keyof typeof quicknessQuestion] || quicknessQuestion.default
}

const getTranslatedFoodQualityQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return foodQualityQuestion[businessCountry as keyof typeof foodQualityQuestion] || foodQualityQuestion.default
}

const getTranslatedAmbienceQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return ambienceQuestion[businessCountry as keyof typeof ambienceQuestion] || ambienceQuestion.default
}

const getTranslatedCourtesyQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return courtesyQuestion[businessCountry as keyof typeof courtesyQuestion] || courtesyQuestion.default
}

const getTranslatedLatelySeenQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return latelySeenQuestion[businessCountry as keyof typeof latelySeenQuestion] || latelySeenQuestion.default
}

const getTranslatedSpendingQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return spendingQuestion[businessCountry as keyof typeof spendingQuestion] || spendingQuestion.default
}

const getTranslatedRecommendingQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return recommendingQuestion[businessCountry as keyof typeof recommendingQuestion] || recommendingQuestion.default
}

const getTranslatedExperienceQuestion = ({ businessCountry }: { businessCountry: string }) => {
  return experienceQuestion[businessCountry as keyof typeof experienceQuestion] || experienceQuestion.default
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

const getFormErrorMessage = ({ businessCountry }: { businessCountry: string }) => {
  return formErrorMessage[businessCountry as keyof typeof formErrorMessage] || formErrorMessage.default
}

const getFormTranslations = ({ businessCountry }: { businessCountry: string }) => {

  return {
    title: getTranslatedFormTitle({ businessCountry }),
    subTitle: getTranslatedFormSubTitle({ businessCountry }),
    fullNameQuestion: getTranslatedFullNameQuestion({ businessCountry }),
    emailQuestion: getTranslatedEmailQuestion({ businessCountry }),
    waiterServiceQuestion: getTranslatedWaiterServiceQuestion({ businessCountry }),
    placeCleannessQuestion: getTranslatedPlaceCleannessQuestion({ businessCountry }),
    quicknessQuestion: getTranslatedQuicknessQuestion({ businessCountry }),
    foodQualityQuestion: getTranslatedFoodQualityQuestion({ businessCountry }),
    ambienceQuestion: getTranslatedAmbienceQuestion({ businessCountry }),
    courtesyQuestion: getTranslatedCourtesyQuestion({ businessCountry }),
    latelySeenQuestion: getTranslatedLatelySeenQuestion({ businessCountry }),
    spendingQuestion: getTranslatedSpendingQuestion({ businessCountry }),
    recommendingQuestion: getTranslatedRecommendingQuestion({ businessCountry }),
    experienceQuestion: getTranslatedExperienceQuestion({ businessCountry }),
    submitButton: getSubmitButton({ businessCountry }),
    termsAndConditions1: getTermsAndConditions1({ businessCountry }),
    termsAndConditions2: getTermsAndConditions2({ businessCountry }),
    termsAndConditions3: getTermsAndConditions3({ businessCountry }),
    termsAndConditions4: getTermsAndConditions4({ businessCountry }),
    formErrorMessage: getFormErrorMessage({ businessCountry }),
  }
}

export default getFormTranslations